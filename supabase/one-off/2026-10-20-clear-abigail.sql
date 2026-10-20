-- One-off cleanup for Abigail (class code 3THGBU), 2026-10-20. Run once in Supabase → SQL Editor.
-- Takes back progress she didn't earn (docs/CLEARING-PROGRESS.md):
--   English: Unit 3 Pronouns, Unit 4 Adjectives and Adverbs, Unit 5 Prepositions and Interjections
--            (Pronouns stays open as her current library; Units 4 and 5 lock again)
--   Math:    the Pet Café's Kitchen quiz and Kitchen Think it through, Deliveries (station 4) and the Café unit test,
--            and every 6th-grade shop after the Café (Bakery through Pet Show)
--   Nothing else in the Café is touched (The Counter, Recipe Cards and Kitchen orders stay).
-- Part 1 deletes her rows for those in the report tables. Part 2 adds a "clear:" key to her quiz_overrides;
-- the game applies it to her save (on every copy, so another device can't bring it back) the next time she opens Pet World.
do $$
declare
  sid uuid; n int;
  later text[] := array['bakery','market','clock','rink','potion','houses','show'];
begin
  select s.id into strict sid
    from public.students s join public.classes c on c.id = s.class_id
   where c.join_code = '3THGBU' and s.display_name = 'Abigail';

  delete from public.assessments
   where student_id = sid
     and (shop = any(later)
          or (shop = 'cafe' and (station = 4 or kind = 'test' or (station = 3 and kind = 'quiz'))));
  get diagnostics n = row_count; raise notice 'assessments deleted: %', n;

  delete from public.problems
   where student_id = sid and (shop = any(later) or (shop = 'cafe' and station = 4));
  get diagnostics n = row_count; raise notice 'problems deleted: %', n;

  delete from public.attempts
   where student_id = sid and (shop = any(later) or (shop = 'cafe' and skill in ('coord','units','ppw')));
  get diagnostics n = row_count; raise notice 'attempts deleted: %', n;

  update public.students
     set quiz_overrides = coalesce(quiz_overrides, '{}'::jsonb) || jsonb_build_object('clear:2026-10-20',
       'ela:pronouns,ela:modifiers,ela:prepositions,quiz:cafe:3,think:cafe:3,station:cafe:4,quiz:cafe:test,shop:bakery,shop:market,shop:clock,shop:rink,shop:potion,shop:houses,shop:show')
   where id = sid;
  raise notice 'clear added for Abigail (%)', sid;
end $$;
