-- Second one-off cleanup for Abigail (class code 3THGBU), 2026-10-20. Run once in Supabase → SQL Editor (project utcqzhucfpvgoirbytej).
-- The rest of demo student Maya R.'s records that were merged into her town (docs/CLEARING-PROGRESS.md):
--   Café skill mastery: basic, equiv, realworld (orders, quizzes and Think it through are not touched)
--   English practice records: -en plurals, mutant plurals, irregular plural review, identifying verbs, action/linking/helping verbs
--   History Unit 1 lesson records: historyScale, historyFrames, historyMemory, historyStories (her unit test stays)
--   Word Workshop answer history for the 31 words that matched Maya's exactly
-- These reset to "not practiced yet": Maya's copies replaced Abigail's, so hers can't be recovered.
-- Needs the game version with skill:, rec: and word: clears (applied the next time she opens Pet World).
do $$
declare sid uuid;
begin
  select s.id into strict sid
    from public.students s join public.classes c on c.id = s.class_id
   where c.join_code = '3THGBU' and s.display_name = 'Abigail';
  update public.students
     set quiz_overrides = coalesce(quiz_overrides, '{}'::jsonb) || jsonb_build_object('clear:2026-10-20b', 'skill:basic,skill:equiv,skill:realworld,rec:elaProgress:enPlurals,rec:elaProgress:mutantPlurals,rec:elaProgress:pluralReview,rec:elaProgress:verbIdentify,rec:elaProgress:actionLinkHelping,rec:historyProgress:historyScale,rec:historyProgress:historyFrames,rec:historyProgress:historyMemory,rec:historyProgress:historyStories,word:eager,word:infer,word:timid,word:honest,word:scarce,word:sturdy,word:analyze,word:ancient,word:compare,word:curious,word:explain,word:fragile,word:patient,word:pattern,word:predict,word:abundant,word:accurate,word:cautious,word:estimate,word:evidence,word:generous,word:grateful,word:identify,word:confident,word:interpret,word:reluctant,word:summarize,word:conclusion,word:equivalent,word:approximate,word:responsible')
   where id = sid;
  raise notice 'second clear added for Abigail (%)', sid;
end $$;
