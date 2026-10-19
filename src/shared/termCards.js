/* Term flashcards for "Review for the test" (docs/TEST-REVIEW.md): the words each English unit (and its Khan Academy
   unit test) expects a student to know by name. Each card: term, what it means, an example, and the lesson it comes
   from (skill), so a missed card can point back to that lesson. extra: true marks a word Khan's test may use that has
   no Pet World lesson of its own (like gerund). Wording follows the lessons in questionBanks.js. */

export const TERM_CARDS = {
  nouns: [
    { term: 'noun', means: 'A word that names a person, place, thing, or idea.', example: 'The girl took her dog to the park. (girl, dog, park)', skill: 'identifyNouns' },
    { term: 'singular noun', means: 'A noun that names just one.', example: 'one box, one child', skill: 'singularPlural' },
    { term: 'plural noun', means: 'A noun that names more than one. Most add -s or -es.', example: 'two boxes, three dogs', skill: 'singularPlural' },
    { term: 'common noun', means: 'A noun that names any person, place, or thing in general. No capital letter.', example: 'a city, a teacher', skill: 'commonProper' },
    { term: 'proper noun', means: 'A noun that names one specific person, place, or thing. It starts with a capital letter.', example: 'Chicago, Mrs. Lee, the Nile River', skill: 'commonProper' },
    { term: 'concrete noun', means: 'A noun you can see, hear, touch, taste, or smell.', example: 'pizza, thunder, a blanket', skill: 'concreteAbstract' },
    { term: 'abstract noun', means: 'A noun that names an idea, feeling, or quality you can’t touch.', example: 'courage, happiness, freedom', skill: 'concreteAbstract' },
    { term: 'irregular plural', means: 'A plural that doesn’t just add -s or -es.', example: 'mouse → mice, child → children', skill: 'pluralReview' },
    { term: '-ves plural', means: 'Some nouns ending in f or fe change to -ves.', example: 'leaf → leaves, knife → knives', skill: 'fToVes' },
    { term: '-en plural', means: 'A few nouns make the plural by adding -en or -ren.', example: 'ox → oxen, child → children', skill: 'enPlurals' },
    { term: 'base plural', means: 'A noun that stays the same for one and for more than one.', example: 'one sheep, ten sheep; one deer, two deer', skill: 'basePlurals' },
    { term: 'mutant plural', means: 'A plural made by changing the vowel inside the word.', example: 'foot → feet, tooth → teeth, man → men', skill: 'mutantPlurals' },
    { term: 'foreign plural', means: 'A plural kept from the language the word came from, like Latin or Greek.', example: 'cactus → cacti, crisis → crises', skill: 'foreignPlurals' }
  ],
  verbs: [
    { term: 'verb', means: 'A word that shows an action or a state of being.', example: 'run, think, is, seem', skill: 'verbIdentify' },
    { term: 'subject', means: 'Who or what the sentence is about: the one doing the verb.', example: 'The puppies chewed my shoe. (puppies)', skill: 'verbAgreement' },
    { term: 'subject-verb agreement', means: 'A singular subject takes a singular verb, and a plural subject takes a plural verb.', example: 'The dog barks. The dogs bark.', skill: 'verbAgreement' },
    { term: 'tense', means: 'The verb form that tells when something happens: past, present, or future.', example: 'walked (past), walk (present), will walk (future)', skill: 'verbTense' },
    { term: 'action verb', means: 'A verb that shows what the subject does.', example: 'She kicked the ball.', skill: 'actionLinkHelping' },
    { term: 'linking verb', means: 'A verb that connects the subject to a word that describes or renames it. Forms of be, plus seem, feel, look, taste.', example: 'The soup is hot. He seems tired.', skill: 'actionLinkHelping' },
    { term: 'helping verb', means: 'A verb that works with the main verb (forms of be, have, do, and modals).', example: 'She is reading. We have finished.', skill: 'actionLinkHelping' },
    { term: 'main verb', means: 'The verb that carries the meaning when there are helping verbs too.', example: 'They will have eaten. (eaten)', skill: 'actionLinkHelping' },
    { term: 'irregular verb', means: 'A verb whose past tense doesn’t end in -ed.', example: 'go → went, bring → brought, sing → sang', skill: 'irregularVerbs' },
    { term: 'past participle', means: 'The verb form used after have, has, or had. Often ends in -ed, -en, or is irregular.', example: 'have walked, has eaten, had gone', skill: 'perfectAspect' },
    { term: 'aspect', means: 'The verb form that shows how an action happens over time: simple, progressive, or perfect.', example: 'I eat / I am eating / I have eaten', skill: 'simpleAspect' },
    { term: 'simple aspect', means: 'Tells an action as a fact, a habit, or a finished event.', example: 'I walk to school. I walked yesterday.', skill: 'simpleAspect' },
    { term: 'progressive aspect', means: 'A form of be + an -ing verb. Shows an action that is still going on.', example: 'She is reading. We were swimming.', skill: 'progressiveAspect' },
    { term: 'perfect aspect', means: 'Have, has, or had + a past participle. Connects an action to another time.', example: 'I have finished my homework.', skill: 'perfectAspect' },
    { term: 'perfect progressive aspect', means: 'Have, has, or had + been + an -ing verb. An action that has been going on for a while.', example: 'It has been raining all day.', skill: 'perfectProgressive' },
    { term: 'modal verb', means: 'A helping verb that shows ability, possibility, permission, or need: can, could, may, might, must, should, will, would.', example: 'You must wear a helmet. It might rain.', skill: 'modalVerbs' },
    { term: 'gerund', means: 'An -ing verb used as a noun. It names an activity.', example: 'Swimming is fun. I love reading. (Compare: She is swimming, where swimming is the verb.)', skill: 'progressiveAspect', extra: true },
    { term: 'infinitive', means: 'To + the base verb. It can act like a noun, adjective, or adverb.', example: 'I want to win. She went to the store to buy milk.', skill: 'verbIdentify', extra: true }
  ],
  pronouns: [
    { term: 'pronoun', means: 'A word that takes the place of a noun.', example: 'Maya lost her hat. She found it later.', skill: 'personalPronoun' },
    { term: 'antecedent', means: 'The noun a pronoun stands for.', example: 'The dog wagged its tail. (dog is the antecedent of its)', skill: 'pronounNumber', extra: true },
    { term: 'personal pronoun', means: 'I, you, he, she, it, we, they, me, him, her, us, them.', example: 'They gave it to me.', skill: 'personalPronoun' },
    { term: 'subject pronoun', means: 'A pronoun that does the action: I, he, she, we, they.', example: 'Mia and I went to the zoo.', skill: 'pronounCase' },
    { term: 'object pronoun', means: 'A pronoun that receives the action or comes after to, with, or between: me, him, her, us, them.', example: 'Dad drove Mia and me.', skill: 'pronounCase' },
    { term: 'possessive pronoun', means: 'Shows ownership and stands alone: mine, yours, his, hers, ours, theirs.', example: 'The red bike is mine.', skill: 'possessivePronoun' },
    { term: 'possessive adjective', means: 'Shows ownership and comes before a noun: my, your, his, her, its, our, their.', example: 'my bike, their house, its tail', skill: 'possessivePronoun' },
    { term: 'reflexive pronoun', means: 'A -self or -selves pronoun used when the subject does something to itself.', example: 'She taught herself to knit.', skill: 'reflexivePronoun' },
    { term: 'emphatic pronoun', means: 'Looks like a reflexive pronoun but only adds emphasis. You can take it out.', example: 'The mayor herself cut the ribbon.', skill: 'emphaticPronoun' },
    { term: 'relative pronoun', means: 'Who, whom, whose, which, or that starting a clause that tells more about a noun.', example: 'The girl who won is my cousin.', skill: 'relativePronoun' },
    { term: 'question word (interrogative pronoun)', means: 'Who, whom, whose, what, or which starting a question.', example: 'Whose jacket is this?', skill: 'questionWord' },
    { term: 'indefinite pronoun', means: 'A pronoun that doesn’t name a certain person or thing. Words ending in -one, -body, -thing are singular.', example: 'Everyone has a pencil. Nobody knows.', skill: 'indefinitePronoun' },
    { term: 'pronoun person', means: 'First person is the speaker (I, we), second is the listener (you), third is anyone else (he, she, it, they).', example: 'When we got to the beach, we could smell the salt.', skill: 'pronounPerson' },
    { term: 'pronoun number', means: 'A pronoun must match its noun: singular for one, plural for more than one.', example: 'The students raised their hands.', skill: 'pronounNumber' },
    { term: 'vague pronoun', means: 'A pronoun where the reader can’t tell which noun it means.', example: 'Tess told Aria that she won. (Who won?)', skill: 'pronounVagueness' }
  ],
  modifiers: [
    { term: 'modifier', means: 'A word that describes another word. Adjectives and adverbs are modifiers.', example: 'a shiny car that drove slowly', skill: 'meetAdjective', extra: true },
    { term: 'adjective', means: 'Describes a noun or pronoun: what kind, how many, or which one.', example: 'three muddy boots; the soup tastes salty', skill: 'meetAdjective' },
    { term: 'article', means: 'A, an, and the: small adjectives that come before a noun.', example: 'the tall tree, an old map', skill: 'meetArticle' },
    { term: 'definite article', means: 'The. Points to one particular thing the reader knows about.', example: 'Close the door.', skill: 'definiteIndefinite' },
    { term: 'indefinite article', means: 'A or an. Means any one. Use an before a vowel sound.', example: 'a unicorn, an hour', skill: 'definiteIndefinite' },
    { term: 'adverb', means: 'Describes a verb, an adjective, or another adverb: how, when, where, how often, or how much.', example: 'She ran quickly. We left early.', skill: 'meetAdverb' },
    { term: 'relative adverb', means: 'Where, when, or why starting a clause that describes a noun.', example: 'the park where we met; the day when it snowed', skill: 'relativeAdverbs' },
    { term: 'adjective order', means: 'Stacked adjectives go: number, opinion, size, age, shape, color, origin, material, purpose.', example: 'a lovely little old wooden house', skill: 'adjectiveOrder' },
    { term: 'coordinate adjectives', means: 'Two adjectives you could switch or join with “and.” Put a comma between them.', example: 'a cold, rainy day (but: a big red barn)', skill: 'commasAdjectives' },
    { term: 'comparative', means: 'Compares two things: add -er or use more.', example: 'taller, more careful', skill: 'comparativeSuperlative' },
    { term: 'superlative', means: 'Compares three or more: add -est or use most.', example: 'tallest, most careful', skill: 'comparativeSuperlative' },
    { term: 'irregular comparison', means: 'Comparatives and superlatives that change the whole word.', example: 'good, better, best; bad, worse, worst', skill: 'comparativeSuperlative' },
    { term: 'intensifier (adverb of degree)', means: 'An adverb that tells how much: very, extremely, quite, almost, barely, too.', example: 'extremely cold; too hot to drink', skill: 'intensifiers' }
  ],
  bio2: [
    { term: 'offspring', means: 'The young that parents produce.', example: 'A lamb is the offspring of a ewe and a ram.', skill: 'traitsReproU' },
    { term: 'gene', means: 'A piece of information, passed from parents to offspring, that helps decide a trait.', example: 'Genes help decide a goat’s coat color.', skill: 'traitsReproU' },
    { term: 'inherited trait', means: 'A trait passed from parents to offspring through genes.', example: 'eye color, ear shape, wool color', skill: 'traitsReproU' },
    { term: 'acquired trait', means: 'A trait an organism picks up during its life. It is not passed on through genes.', example: 'a scar, a trick a dog learned, a haircut', skill: 'traitsReproU' },
    { term: 'sexual reproduction', means: 'Two parents each give half their genes, so each offspring gets a new mix and offspring vary.', example: 'Kittens in one litter look different from each other.', skill: 'traitsReproU' },
    { term: 'asexual reproduction', means: 'One parent makes offspring with the same genes as itself.', example: 'strawberry runners, potato pieces, green onion roots', skill: 'traitsReproU' },
    { term: 'clone', means: 'An offspring with exactly the same genes as its one parent.', example: 'Every Cavendish banana plant is a clone.', skill: 'traitsReproA' },
    { term: 'variation', means: 'Differences in traits among organisms of the same kind. Variation helps some survive a change.', example: 'Some seed-grown plants survive a frost and some don’t.', skill: 'traitsReproA' },
    { term: 'reproductive success', means: 'How many offspring survive to grow up and have young of their own.', example: 'A robin that raises 4 chicks to adulthood.', skill: 'animalBehaviorU' },
    { term: 'courtship', means: 'Behavior that attracts a mate, like a display, song, or dance.', example: 'A peacock spreading his tail; a songbird singing in spring', skill: 'animalBehaviorU' },
    { term: 'parental care', means: 'Parents feeding, warming, and protecting their young.', example: 'A hen sitting on her eggs', skill: 'animalBehaviorU' },
    { term: 'migration', means: 'A long trip animals make each year, often to find food or a safe place to raise young.', example: 'Salmon swimming upstream to lay eggs', skill: 'animalBehaviorU' },
    { term: 'pollinator', means: 'An animal that carries pollen from flower to flower.', example: 'bees, butterflies, hummingbirds, moths', skill: 'plantStructuresU' },
    { term: 'pollination', means: 'Moving pollen to the part of a flower that makes seeds.', example: 'A bee brushes pollen onto another squash flower.', skill: 'plantStructuresU' },
    { term: 'nectar', means: 'A sweet liquid in flowers that rewards animals that carry pollen.', example: 'Hummingbirds drink nectar from tube-shaped flowers.', skill: 'plantStructuresU' },
    { term: 'seed dispersal', means: 'Ways seeds travel away from the parent plant: wind, water, or animals.', example: 'burrs on fur, maple “helicopters,” berries eaten by birds', skill: 'plantStructuresA' },
    { term: 'genetic factor', means: 'Something inherited from the parents that affects growth.', example: 'A Great Dane’s genes make it grow bigger than a Chihuahua.', skill: 'growthEnvU' },
    { term: 'environmental factor', means: 'Something around an organism that affects its growth: food, water, light, space, temperature.', example: 'Bean sprouts in the dark grow tall, thin, and pale.', skill: 'growthEnvU' },
    { term: 'germination', means: 'When a seed starts to grow. It needs water, the right temperature, and oxygen.', example: 'A soaked bean splits open and sends out a root.', skill: 'growthEnvU' },
    { term: 'nutrients', means: 'Substances living things need to grow. Fertilizer adds them to soil and water.', example: 'Fertilizer washing into a lake feeds algae.', skill: 'growthEnvA' },
    { term: 'algae bloom', means: 'Algae growing so fast they cover the water, often because of extra nutrients and warm weather.', example: 'Lake Erie near Toledo, Ohio, in 2014', skill: 'growthEnvA' },
    { term: 'decomposer', means: 'A living thing (like bacteria) that breaks down dead matter. In water, decomposers use up oxygen.', example: 'Bacteria breaking down dead algae', skill: 'growthEnvA' }
  ]
};

export const termCards = courseId => TERM_CARDS[courseId] || [];
