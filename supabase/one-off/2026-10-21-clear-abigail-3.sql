-- Third one-off cleanup for Abigail (class code 3THGBU), 2026-10-21. Run once in Supabase → SQL Editor (project utcqzhucfpvgoirbytej).
-- The demo student Maya R.'s copy came back overnight (docs/CLEARING-PROGRESS.md, "Oct 21"): a Pet World tab in a Chrome
-- browser, signed in as Abigail since Oct 19 and still running that day's code (no clears, no guardrails), woke up about
-- 5:50 AM and merged its old copy into her town after the Oct 20 clears had already run. Her records match Maya's from
-- the Oct 19 demo reset exactly (same scores, dates shifted by the daily demo reset).
-- This repeats both Oct 20 clears as one new clear, so it runs again on every copy. With the game version that rechecks
-- clears, dated records from before today in these units are also dropped again whenever an old copy shows up.
-- The report tables (assessments, problems, attempts) were checked: nothing came back there, so nothing is deleted.
do $$
declare sid uuid;
begin
  select s.id into strict sid
    from public.students s join public.classes c on c.id = s.class_id
   where c.join_code = '3THGBU' and s.display_name = 'Abigail';
  update public.students
     set quiz_overrides = coalesce(quiz_overrides, '{}'::jsonb) || jsonb_build_object('clear:2026-10-21', 'ela:pronouns,ela:modifiers,ela:prepositions,quiz:cafe:3,think:cafe:3,station:cafe:4,quiz:cafe:test,shop:bakery,shop:market,shop:clock,shop:rink,shop:potion,shop:houses,shop:show,skill:basic,skill:equiv,skill:realworld,rec:elaProgress:enPlurals,rec:elaProgress:mutantPlurals,rec:elaProgress:pluralReview,rec:elaProgress:verbIdentify,rec:elaProgress:actionLinkHelping,rec:historyProgress:historyScale,rec:historyProgress:historyFrames,rec:historyProgress:historyMemory,rec:historyProgress:historyStories,word:eager,word:infer,word:timid,word:honest,word:scarce,word:sturdy,word:analyze,word:ancient,word:compare,word:curious,word:explain,word:fragile,word:patient,word:pattern,word:predict,word:abundant,word:accurate,word:cautious,word:estimate,word:evidence,word:generous,word:grateful,word:identify,word:confident,word:interpret,word:reluctant,word:summarize,word:conclusion,word:equivalent,word:approximate,word:responsible')
   where id = sid;
  raise notice 'third clear added for Abigail (%)', sid;
end $$;
