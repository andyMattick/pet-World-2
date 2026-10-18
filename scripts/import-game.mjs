// Bring in a game built outside Pet World (an AI Studio export, a zip, or a folder). Docs: docs/IMPORT-GAMES.md
//
//   npm run import-game -- <zip or folder> --arcade <id> [--name "Name"] [--emoji 🎲] [--description "..."]
//   npm run import-game -- <zip or folder> --brain
//
// --arcade: puts the game in src/arcade/<id> (replacing an older copy, but keeping Pet World's vite.config.ts and
//           README.md), points its build at public/arcade/<id>, adds it to ARCADE_GAMES if it's new, then builds it.
// --brain:  updates the Brain Games from a newer copy of the suite: the game files (src/games, src/data, src/utils,
//           src/components) are replaced, but src/App.tsx and src/main.tsx stay, because App.tsx holds the two Pet
//           World hooks (?difficulty= and the brain:result message). Then it checks the game ids and levels against
//           src/shared/brainGames.ts and builds.
// Both: AI Studio leftovers are removed (.env files, bun.lock, unused Gemini / Express / dotenv packages), then
// npm run verify runs. Nothing is committed: look at `git status`, try it with `npm run dev`, then commit.
import { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync, rmSync, cpSync, statSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const opt = name => { const i = args.indexOf(`--${name}`); if (i < 0) return undefined; const v = args[i + 1]; args.splice(i, 2); return v; };
const flag = name => { const i = args.indexOf(`--${name}`); if (i < 0) return false; args.splice(i, 1); return true; };
const fail = msg => { console.error(`\n❌ import-game: ${msg}\n`); process.exit(1); };
const step = msg => console.log(`\n▶ ${msg}`);
const run = (cmd, cmdArgs, cwd) => { const r = spawnSync(cmd, cmdArgs, { cwd, stdio: 'inherit', shell: process.platform === 'win32' }); if (r.status !== 0) fail(`${cmd} ${cmdArgs.join(' ')} failed in ${cwd}`); };

const arcadeId = opt('arcade'), brain = flag('brain');
const name = opt('name'), emoji = opt('emoji'), description = opt('description');
const source = args[0];
if (!source || (!arcadeId && !brain) || (arcadeId && brain)) fail('usage: npm run import-game -- <zip or folder> --arcade <id>   or   --brain');
if (arcadeId && !/^[a-z0-9][a-z0-9-]{1,40}$/.test(arcadeId)) fail('the Arcade id is lowercase letters, numbers and dashes, like treasure-chase');
if (!existsSync(source)) fail(`can't find ${source}`);
const root = process.cwd();
if (!existsSync(join(root, 'src/game/game.js'))) fail('run this from the Pet World folder (the one with package.json)');
/* the import replaces files, so start from saved work: then `git checkout -- <folder>` undoes it cleanly */
const folder = arcadeId ? `src/arcade/${arcadeId}` : 'src/brain-games';
const dirty = spawnSync('git', ['status', '--porcelain', '--', folder], { cwd: root, encoding: 'utf8' });
if (dirty.status === 0 && dirty.stdout.trim()) fail(`${folder} has changes that aren't committed yet. Commit them first (git add -A && git commit), so the import can't overwrite them.`);

/* 1. unpack into a scratch folder and find the project inside (zips often have one folder at the top) */
step(`Unpacking ${basename(source)}`);
const scratch = mkdtempSync(join(tmpdir(), 'pw-import-'));
if (statSync(source).isDirectory()) cpSync(source, scratch, { recursive: true, filter: p => !p.includes('node_modules') && !p.includes(`${'/'}.git`) });
else if (/\.zip$/i.test(source)) run('unzip', ['-q', resolve(source), '-d', scratch], root);
else fail('the source must be a .zip file or a folder');
const findProject = dir => { if (existsSync(join(dir, 'package.json'))) return dir; for (const d of readdirSync(dir)) { const p = join(dir, d); if (statSync(p).isDirectory() && d !== 'node_modules' && d !== '__MACOSX') { const f = findProject(p); if (f) return f; } } return null; };
const project = findProject(scratch);
if (!project) fail('no package.json in it: is this the whole game project?');

/* AI Studio leftovers: secrets and packages Pet World never uses */
const UNUSED = ['@google/genai', 'express', 'dotenv', '@types/express', 'tsx'];
function clean(dir) {
  for (const f of readdirSync(dir)) if (/^\.env/.test(f) || f === 'bun.lock' || f === 'server.js' || f === 'server.ts') rmSync(join(dir, f), { force: true });
  const pkgPath = join(dir, 'package.json'); if (!existsSync(pkgPath)) return;
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const srcText = existsSync(join(dir, 'src')) ? readdirSync(join(dir, 'src'), { recursive: true }).filter(f => /\.(t|j)sx?$/.test(f)).map(f => readFileSync(join(dir, 'src', f), 'utf8')).join('\n') : '';
  for (const dep of UNUSED) for (const group of ['dependencies', 'devDependencies']) {
    if (pkg[group]?.[dep] && !srcText.includes(`'${dep}'`) && !srcText.includes(`"${dep}"`)) { delete pkg[group][dep]; console.log(`  removed unused package ${dep}`); }
  }
  if (pkg.scripts?.clean) pkg.scripts.clean = 'rm -rf dist';
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

if (arcadeId) {
  /* 2a. Arcade: replace src/arcade/<id>, keeping Pet World's build settings and notes */
  const target = join(root, 'src/arcade', arcadeId), isNew = !existsSync(target);
  step(`${isNew ? 'Adding' : 'Updating'} src/arcade/${arcadeId}`);
  const keep = {};
  if (!isNew) {
    for (const f of ['vite.config.ts', 'README.md']) if (existsSync(join(target, f))) keep[f] = readFileSync(join(target, f), 'utf8');
    const oldApp = existsSync(join(target, 'src/App.tsx')) ? readFileSync(join(target, 'src/App.tsx'), 'utf8') : '';
    const newApp = existsSync(join(project, 'src/App.tsx')) ? readFileSync(join(project, 'src/App.tsx'), 'utf8') : '';
    if (/arcade:(state-|round-complete)/.test(oldApp) && !/arcade:(state-|round-complete)/.test(newApp)) console.log('  ⚠️  The old copy talked to Pet World (arcade:state-save / arcade:round-complete for saves and tickets). The new copy does not, so saves and ticket rewards stop until those messages are added back. The old copy is in git: `git diff` shows what was there.');
    for (const f of readdirSync(target)) if (f !== 'node_modules') rmSync(join(target, f), { recursive: true, force: true });
  }
  cpSync(project, target, { recursive: true, filter: p => !p.includes('node_modules') });
  clean(target);
  writeFileSync(join(target, 'vite.config.ts'), keep['vite.config.ts'] || `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: './',   // served from /arcade/${arcadeId}/ inside Pet World
    plugins: [react(), tailwindcss()],
    build: {
      // \`npm run build\` writes straight into Pet World's public folder
      outDir: path.resolve(__dirname, '../../../public/arcade/${arcadeId}'),
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
`);
  writeFileSync(join(target, 'README.md'), keep['README.md'] || `# ${name || arcadeId} (Pet World Arcade)\n\nPet World serves the **built** game from \`public/arcade/${arcadeId}/\`. After changing anything in this folder, rebuild it:\n\n\`\`\`\ncd src/arcade/${arcadeId}\nnpm install        # first time only\nnpm run build      # writes ../../../public/arcade/${arcadeId}\ncd ../../..\n\`\`\`\n\nThen commit both this folder and \`public/arcade/${arcadeId}/\`. Brought in with \`npm run import-game\` (docs/IMPORT-GAMES.md).\n`);
  if (!keep['vite.config.ts']) {
    const pkg = JSON.parse(readFileSync(join(target, 'package.json'), 'utf8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    if (!deps['@tailwindcss/vite'] || !deps['@vitejs/plugin-react']) console.log('  ⚠️  This game does not use React + Tailwind like the other Arcade games, so check src/arcade/' + arcadeId + '/vite.config.ts before building.');
  }

  /* 3a. the Arcade list (src/shared/registry.ts): add the game if it's new */
  const regPath = join(root, 'src/shared/registry.ts');
  let reg = readFileSync(regPath, 'utf8');
  if (!reg.includes(`id: '${arcadeId}'`)) {
    let meta = {}; try { meta = JSON.parse(readFileSync(join(target, 'metadata.json'), 'utf8')); } catch {}
    const q = s => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const entry = `  { id: '${arcadeId}', name: '${q(name || meta.name || arcadeId)}', emoji: '${q(emoji || '🎮')}', description: '${q(description || meta.description || 'A new Arcade game.').slice(0, 200)}', src: '/arcade/${arcadeId}/', available: true }`;
    const start = reg.indexOf('export const ARCADE_GAMES'), end = reg.indexOf('\n];', start);
    if (start < 0 || end < 0) fail('could not find ARCADE_GAMES in src/shared/registry.ts');
    reg = reg.slice(0, end) + ',\n' + entry + reg.slice(end);
    writeFileSync(regPath, reg);
    console.log(`  added ${arcadeId} to ARCADE_GAMES (src/shared/registry.ts): check its name, emoji and description there`);
  }
  step('Building it into public/arcade/' + arcadeId);
  run('npm', ['install'], target); run('npm', ['run', 'build'], target);
} else {
  /* 2b. Brain Games: replace the game files, keep App.tsx and main.tsx (the Pet World hooks) */
  const target = join(root, 'src/brain-games');
  if (!existsSync(join(project, 'src/games'))) fail('this does not look like the Brain Games suite (no src/games folder)');
  step('Updating the Brain Games in src/brain-games (App.tsx and main.tsx stay)');
  for (const dir of ['games', 'data', 'utils', 'components', 'types']) {
    if (!existsSync(join(project, 'src', dir))) continue;
    rmSync(join(target, 'src', dir), { recursive: true, force: true });
    cpSync(join(project, 'src', dir), join(target, 'src', dir), { recursive: true });
  }
  if (existsSync(join(project, 'src/index.css'))) cpSync(join(project, 'src/index.css'), join(target, 'src/index.css'));
  /* new packages the newer copy needs (never the unused AI Studio ones) */
  const mine = JSON.parse(readFileSync(join(target, 'package.json'), 'utf8')), theirs = JSON.parse(readFileSync(join(project, 'package.json'), 'utf8'));
  for (const group of ['dependencies', 'devDependencies']) for (const [dep, v] of Object.entries(theirs[group] || {})) {
    if (!UNUSED.includes(dep) && !mine.dependencies?.[dep] && !mine.devDependencies?.[dep]) { (mine[group] = mine[group] || {})[dep] = v; console.log(`  added package ${dep}`); }
  }
  writeFileSync(join(target, 'package.json'), JSON.stringify(mine, null, 2) + '\n');
  const newApp = existsSync(join(project, 'src/App.tsx')) ? readFileSync(join(project, 'src/App.tsx'), 'utf8') : '';
  const myApp = readFileSync(join(target, 'src/App.tsx'), 'utf8');
  if (newApp && newApp.replace(/\s+/g, '') !== myApp.replace(/\s+/g, '')) console.log('  ⚠️  The newer copy also changed src/App.tsx. Pet World kept its own App.tsx (it has the ?difficulty= and brain:result hooks). If the new App.tsx adds a game, add its case to renderGameComponent() in src/brain-games/src/App.tsx by hand.');

  /* 3b. the game ids and levels must match src/shared/brainGames.ts */
  step('Checking game ids and levels against src/shared/brainGames.ts');
  const catalog = readFileSync(join(target, 'src/data/gamesCatalog.ts'), 'utf8'), shared = readFileSync(join(root, 'src/shared/brainGames.ts'), 'utf8');
  for (const part of catalog.split(/\n\s*\{\s*\n\s*id: /).slice(1)) {
    const id = part.match(/^'([^']+)'/)?.[1]; if (!id) continue;
    const levels = [...(part.split('difficultyLevels')[1] || '').split(']')[0].matchAll(/id: '([^']+)'/g)].map(m => m[1]);
    const row = shared.split('\n').find(l => l.includes(`id: '${id}'`));
    if (!row) { console.log(`  ⚠️  New game "${id}": add it to BRAIN_GAMES in src/shared/brainGames.ts (levels: ${levels.join(', ')}) or Pet World won't pick it`); continue; }
    const missing = levels.filter(l => !row.includes(`'${l}'`));
    if (missing.length) console.log(`  ⚠️  "${id}" has levels Pet World doesn't list: ${missing.join(', ')}. Update its levels in src/shared/brainGames.ts.`);
  }
  step('Building into public/brain-games');
  run('npm', ['install'], target); run('npm', ['run', 'build'], target);
}
rmSync(scratch, { recursive: true, force: true });

step('Checking Pet World');
run('npm', ['run', 'verify'], root);
spawnSync('git', ['diff', '--stat', '--', folder], { cwd: root, stdio: 'inherit' });
console.log(`\n✅ Imported. Next: npm run dev to try it, then git add -A && git commit -m "Update ${arcadeId || 'Brain Games'}"`);
console.log(`   Changed your mind? git checkout -- ${folder} public/${arcadeId ? `arcade/${arcadeId}` : 'brain-games'} puts everything back.\n`);
