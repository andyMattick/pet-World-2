// Copies the Insights code the daily-insights Edge Function needs into supabase/functions/_shared/ (docs/INSIGHTS.md).
// `supabase functions deploy` only bundles files under supabase/functions, so the function imports these copies.
// The copies are made fresh before every deploy (npm run deploy:insights) and are not committed (.gitignore).
// Run with: node scripts/copy-insights.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const out = 'supabase/functions/_shared';
mkdirSync(out, { recursive: true });
for (const name of ['insights.ts', 'registry.ts']) {
  const src = readFileSync(`src/shared/${name}`, 'utf8');
  if (/^\s*import\s/m.test(src)) { console.error(`src/shared/${name} imports another file; the Edge Function copy needs it to stand alone.`); process.exit(1); }
  writeFileSync(`${out}/${name}`, `// COPY of src/shared/${name}, made by scripts/copy-insights.mjs for the daily-insights Edge Function. Don't edit; edit the original.\n${src}`);
  console.log(`copied src/shared/${name} -> ${out}/${name}`);
}
