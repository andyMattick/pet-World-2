# Outside work

Schoolwork done outside Pet World (piano, a co-op class, a workbook, a field trip) can go into the Ledger from the student side.

## For her (Today's plan)
- **➕ Outside work** at the bottom of Today's plan (signed-in students only).
- She fills in: **course** (it remembers her earlier ones), **what she did**, **minutes**, a **grade** if there is one, the **day** (up to 14 days back), and up to **3 photos** (worksheet, drawing, project). Photos are shrunk to small JPEGs on her device before they're sent.
- Today's outside work shows on the plan as ⏳ waiting for a grown-up, ✅ checked, or 🔁 fix it. A 🔁 row shows the teacher's note and a **Fix it** button. She can edit anything not yet checked, or **Take it back** (delete it). Checked rows are locked.

## For the teacher
- **Alerts**: "📎 {name} added outside work: …", plus "(with photos to review)" when she attached photos.
- **Ledger**: the row shows "added by {name}" and its review tag. Underneath are the photos (click one to enlarge it), **✓ Looks good**, and a note box with **🔁 Ask for a redo**. A redo needs a note.
- The teacher can still add and edit outside rows the old way.

## Setup (once)
Run `supabase/migrations/20261020000000_outside_work.sql` in the Supabase SQL editor. Until you do, the Ledger works as before, and her form tells her to ask a grown-up.

## Limits (enforced in the database)
- Up to 3 photos per row, each JPEG ≤ 200 KB.
- Days from 14 days ago through tomorrow.
- A student can only change or delete her own rows, and only before they're marked ✅.
