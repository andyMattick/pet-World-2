#!/bin/bash
# Pet Town repo cleanup. Run from the repo root:  bash docs/cleanup-repo.sh
# Only removes or moves files nothing uses. Everything stays in git history (git log -- <file> finds it).
# It stages the changes; review with "git status", then commit.
set -e
cd "$(git rev-parse --show-toplevel)"

# 1. Game zips: each game's source now lives in src/arcade/<game>/ and its build in public/arcade/<game>/
git rm -q --ignore-unmatch \
  "docs/corsair's-cove_-pirates-vs-redcoats.zip" \
  "docs/museum-caper.zip" \
  "docs/triad-arcade_-memory,-bingo-&-war.zip" \
  "docs/whack-a-mole-stats-lab.zip" \
  "docs/mine-walker_-tactical-field-crossing.zip"

# 2. Original single-file games: the live copies are public/arcade/state-conquest/ and public/arcade/fly-fly-butterfly/
git rm -q --ignore-unmatch "docs/State Conquest.html" "docs/fly-fly-butterfly (1).html"

# 3. Screenshots and preview videos nothing links to
git rm -q --ignore-unmatch docs/pics.png docs/pics2.png docs/pics3.png \
  docs/preview-bio1-cells-silent.mp4 docs/preview-math-cafe-2-silent.mp4

# 4. Old arcade builds: each rebuild left its old script behind; index.html only loads the newest one
for game in public/arcade/*/; do
  [ -d "$game/assets" ] || continue
  for f in "$game"assets/*.js "$game"assets/*.css; do
    [ -e "$f" ] || continue
    grep -qF "$(basename "$f")" "$game/index.html" || git rm -q "$f"
  done
done

# 5. Question Bank Roadmap: four copies; keep the newest, (16), as docs/Pet Town Question Bank Roadmap.docx
if [ -e "docs/Pet Town Question Bank Roadmap (16).docx" ]; then
  git rm -q --ignore-unmatch "Pet Town Question Bank Roadmap.docx" "docs/Pet Town Question Bank Roadmap.docx" "docs/Pet Town Question Bank Roadmap (15).docx"
  git mv "docs/Pet Town Question Bank Roadmap (16).docx" "docs/Pet Town Question Bank Roadmap.docx"
fi

# 6. One-time question scripts (already applied) and their review lists: kept, but out of the way
mkdir -p docs/archive/content-passes
for f in docs/*-bank.mjs docs/*-cleanup.mjs docs/history2-fix-originals.mjs docs/rigor-update.mjs docs/*-review.md; do
  [ -e "$f" ] && git mv "$f" docs/archive/content-passes/
done

# 7. Patch files you downloaded into docs/ (never committed, just clutter)
rm -f docs/*.patch

echo "Done. Review with: git status"
