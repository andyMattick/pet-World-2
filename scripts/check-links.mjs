// Checks every Khan Academy link Pet Town shows (docs: KHAN.md).
//   node scripts/check-links.mjs            offline: every link is a well-formed khanacademy.org address (npm run verify runs this)
//   node scripts/check-links.mjs --online   also opens each link and lists the ones that are gone (npm run check-links)
// Online needs internet. A link that can't be reached (no network, a timeout) is listed as "not checked", never as dead.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = file => fs.readFileSync(root + file, 'utf8');

/* every link, with where it is used */
export async function khanLinks(){
  const links = [];
  // math skills (src/shared/registry.ts): url: 'https://…' or url: CONST + '…'
  const registry = read('src/shared/registry.ts'), consts = {};
  for (const m of registry.matchAll(/^const ([A-Z0-9_]+) = '(https:[^']*)';/gm)) consts[m[1]] = m[2];
  for (const m of registry.matchAll(/^\s*(\w+):\s*\{[^\n]*?url:\s*(?:([A-Z0-9_]+)\s*\+\s*)?'([^']*)'/gm)) links.push({ url: (m[2] ? consts[m[2]] ?? `?${m[2]}?` : '') + m[3], where: `math skill "${m[1]}"` });
  // English, History and Biology lessons (src/shared/questionBanks.js), loaded with a stand-in for its TypeScript import
  const ID_STUB = "const questionId = (c, s, p, a) => `${c}:${s}:${String(p).trim().toLowerCase()}\\u0000${String(a).trim().toLowerCase()}`;";
  const banks = await import('data:text/javascript;base64,' + Buffer.from(read('src/shared/questionBanks.js').replace(/^import \{ questionId \} from '\.\/questionIds';$/m, ID_STUB)).toString('base64'));
  for (const course of banks.LESSON_COURSES) for (const slot of banks.lessonLinkSlots(course.id)) if (slot.khan) links.push({ url: slot.khan, where: `${course.id} lesson "${slot.name}"` });
  return links;
}

export function offlineProblems(links){
  const problems = [];
  for (const { url, where } of links) {
    let u = null; try { u = new URL(url); } catch { /* not a URL */ }
    if (!u || u.protocol !== 'https:' || !/(^|\.)khanacademy\.org$/.test(u.hostname) || /\s/.test(url) || u.pathname.includes('//') || u.pathname === '/') problems.push(`${where}: bad Khan link "${url}"`);
  }
  if (links.length < 50) problems.push(`only ${links.length} Khan links found; the link checker may need updating`);
  return problems;
}

async function checkOnline(links){
  const unique = [...new Map(links.map(l => [l.url, l])).values()], dead = [], moved = [], unchecked = [];
  let next = 0;
  const worker = async () => {
    while (next < unique.length) {
      const link = unique[next++];
      try {
        const res = await fetch(link.url, { redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'user-agent': 'Mozilla/5.0 (Pet Town link check)' } });
        if (res.status === 404 || res.status === 410) dead.push(`${link.where}: ${res.status} ${link.url}`);
        else if (!res.ok) unchecked.push(`${link.where}: HTTP ${res.status} ${link.url}`);
        else if (new URL(res.url).pathname.replace(/\/$/, '') !== new URL(link.url).pathname.replace(/\/$/, '')) moved.push(`${link.where}: now goes to ${res.url} (was ${link.url})`);
        await res.body?.cancel();
      } catch (error) { unchecked.push(`${link.where}: ${error.name === 'TimeoutError' ? 'timed out' : error.message} ${link.url}`); }
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  return { unique: unique.length, dead, moved, unchecked };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  const links = await khanLinks(), problems = offlineProblems(links);
  if (problems.length) { console.log('❌ Khan links:\n  ' + problems.join('\n  ')); process.exit(1); }
  if (!process.argv.includes('--online')) { console.log(`✅ ${links.length} Khan links are well formed. Run "npm run check-links" to open each one.`); process.exit(0); }
  console.log(`Opening ${new Set(links.map(l => l.url)).size} Khan links (about a minute)…`);
  const { unique, dead, moved, unchecked } = await checkOnline(links);
  if (moved.length) console.log(`\n↪️ ${moved.length} link(s) now redirect somewhere else. Check that the new page is still the right lesson:\n  ` + moved.join('\n  '));
  if (unchecked.length === unique) { console.log('\n⚠️ Couldn’t reach Khan Academy at all, so nothing was checked. Is this computer online?'); process.exit(0); }
  if (unchecked.length) console.log(`\n⚠️ ${unchecked.length} link(s) could not be checked (network or Khan blocked the request):\n  ` + unchecked.join('\n  '));
  if (dead.length) { console.log(`\n❌ ${dead.length} dead Khan link(s). Fix them in src/shared/registry.ts (math) or src/shared/questionBanks.js (KHAN_LINKS):\n  ` + dead.join('\n  ')); process.exit(1); }
  console.log(`\n✅ No dead links among ${unique} Khan links${unchecked.length ? ` (${unchecked.length} not checked)` : ''}.`);
}
