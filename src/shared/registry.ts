/**
 * Single source of truth for skills, stations and misconceptions.
 * The game and the teacher dashboard both import this file.
 * Khan Academy CC 6th grade, Unit 1: Ratios.
 */
const KB = 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-ratios-prop-topic/';

export interface Skill { name: string; short: string; st: number; url: string; shop?: string }
export const SKILLS: Record<string, Skill> = {
  basic:      { name: 'Basic ratios', short: 'Basic', st: 1, url: KB + 'intro-to-ratios/e/representing-ratios' },
  tape:       { name: 'Ratios with tape diagrams', short: 'Tape diagrams', st: 2, url: KB + 'visualize-ratios/e/ratios-with-tape-diagrams' },
  groups:     { name: 'Equivalent ratios with equal groups', short: 'Equal groups', st: 2, url: KB + 'visualize-ratios/e/equivalent-ratio-word-problems--basic-' },
  dnlCreate:  { name: 'Create double number lines', short: 'Create DNL', st: 2, url: KB + 'visualize-ratios/e/create-double-number-lines' },
  dnl:        { name: 'Ratios with double number lines', short: 'Double number lines', st: 2, url: KB + 'visualize-ratios/e/ratios-with-double-number-lines' },
  dnlTable:   { name: 'Relate double number lines and ratio tables', short: 'DNL to table', st: 2, url: KB + 'visualize-ratios/e/relate-double-numbers-lines-and-ratio-tables' },
  table:      { name: 'Ratio tables', short: 'Ratio tables', st: 3, url: KB + 'cc-6th-equivalent-ratios/e/solving-ratio-problems-with-tables' },
  equiv:      { name: 'Equivalent ratios', short: 'Equivalent', st: 3, url: KB + 'cc-6th-equivalent-ratios/e/equivalent-ratios' },
  word:       { name: 'Equivalent ratio word problems', short: 'Word problems', st: 3, url: KB + 'cc-6th-equivalent-ratios/e/ratio_word_problems' },
  realworld:  { name: 'Equivalent ratios in the real world', short: 'Real world', st: 3, url: KB + 'cc-6th-equivalent-ratios/e/equivalent-ratios-in-the-real-world' },
  understand: { name: 'Understand equivalent ratios in the real world', short: 'Understand', st: 3, url: KB + 'cc-6th-equivalent-ratios/e/understand-equivalent-ratios' },
  coord:      { name: 'Ratios on coordinate plane', short: 'Coordinate plane', st: 4, url: KB + 'cc-6th-ratio-word-problems/e/ratios-on-coordinate-plane' },
  units:      { name: 'Ratios and units of measurement', short: 'Units', st: 4, url: KB + 'cc-6th-ratio-word-problems/e/ratios-and-units-of-measurement' },
  ppw:        { name: 'Part-part-whole ratios', short: 'Part-part-whole', st: 4, url: KB + 'cc-6th-ratio-word-problems/e/part-part-whole-ratios' },
  addDec:  { name: 'Adding decimals', short: 'Add decimals', st: 1, shop: 'bakery', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-add-decimals/e/adding_decimals_2' },
  subDec:  { name: 'Subtracting decimals', short: 'Subtract decimals', st: 1, shop: 'bakery', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-sub-decimals/e/subtracting_decimals_2' },
  decWord: { name: 'Adding & subtracting decimals word problems', short: 'Decimal word problems', st: 1, shop: 'bakery', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-add-sub-decimals-word-problems/e/adding_and_subtracting_decimals_word_problems' },
  fracDivWhole: { name: 'Divide fractions by whole numbers', short: 'Fraction ÷ whole', st: 2, shop: 'bakery', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/x0267d782:dividing-fractions-and-whole-numbers/e/divide-fractions-by-whole-numbers' },
  wholeDivFrac: { name: 'Divide whole numbers by fractions', short: 'Whole ÷ fraction', st: 2, shop: 'bakery', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/x0267d782:dividing-fractions-and-whole-numbers/e/divide-whole-numbers-by-fractions' },
  fracDiv: { name: 'Dividing fractions', short: 'Fraction ÷ fraction', st: 3, shop: 'bakery', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-dividing-fractions/e/dividing_fractions_1.5' },
  mixedDiv: { name: 'Divide mixed numbers', short: 'Mixed number ÷', st: 3, shop: 'bakery', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-dividing-fractions/e/divide-mixed-numbers' },
  fracInterp: { name: 'Interpret fraction division', short: 'Fraction ÷ stories', st: 3, shop: 'bakery', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-dividing-fractions/e/interpret-fraction-division' },
  fracWord: { name: 'Dividing fractions word problems', short: 'Fraction ÷ word problems', st: 3, shop: 'bakery', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-dividing-fractions/e/dividing-fractions-by-fractions-word-problems' },
  mulDecPlace: { name: 'Decimal multiplication place value', short: 'Decimal × place value', st: 4, shop: 'bakery', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-multiplying-decimals/e/multiplying_decimals_1' },
  mulDec: { name: 'Multiplying decimals', short: 'Multiply decimals', st: 4, shop: 'bakery', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-multiplying-decimals/e/multiplying_decimals' },
  div2: { name: 'Division by 2 digits', short: 'Divide by 2 digits', st: 4, shop: 'bakery', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-div-whole-numbers/e/division_3' },
  divMulti: { name: 'Multi-digit division', short: 'Multi-digit division', st: 4, shop: 'bakery', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-div-whole-numbers/e/division_4' },
  divToDec: { name: 'Divide whole numbers to get a decimal', short: 'Whole ÷ to decimal', st: 5, shop: 'bakery', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-dividing-decimals/e/dividing_decimals_0.5' },
  divDec2: { name: 'Dividing decimals: hundredths', short: 'Divide decimals (hundredths)', st: 5, shop: 'bakery', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-dividing-decimals/e/dividing_decimals_3' },
  divDec3: { name: 'Dividing decimals: thousandths', short: 'Divide decimals (thousandths)', st: 5, shop: 'bakery', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-dividing-decimals/e/dividing_decimals' },
  // 6th grade, Market Stall (Khan unit 3)
  unitRate: { name: 'Unit rates', short: 'Unit rates', st: 1, shop: 'market', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/x0267d782:cc-6th-rates-and-percentages/cc-6th-rates/e/unit-rates' },
  rateProblems: { name: 'Rate problems', short: 'Rate problems', st: 1, shop: 'market', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/x0267d782:cc-6th-rates-and-percentages/cc-6th-rates/e/rate_problems_0.5' },
  compareRates: { name: 'Comparing rates', short: 'Comparing rates', st: 1, shop: 'market', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/x0267d782:cc-6th-rates-and-percentages/cc-6th-rates/e/comparing-rates' },
  introPercent: { name: 'Intro to percents', short: 'Intro to percents', st: 2, shop: 'market', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/x0267d782:cc-6th-rates-and-percentages/cc-6th-percentages/e/intro-to-percents' },
  pctModel: { name: 'Percents from fraction models', short: 'Percents from models', st: 2, shop: 'market', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/x0267d782:cc-6th-rates-and-percentages/cc-6th-percentages/e/percents-from-fraction-models' },
  pctConvert: { name: 'Converting percents, decimals, and fractions', short: 'Percents, decimals, fractions', st: 3, shop: 'market', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/x0267d782:cc-6th-rates-and-percentages/x0267d782:equivalent-representations-of-percent-problems/a/converting-between-percents-fractions-decimals' },
  benchmarkPct: { name: 'Benchmark percents', short: 'Benchmark percents', st: 3, shop: 'market', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/x0267d782:cc-6th-rates-and-percentages/x0267d782:equivalent-representations-of-percent-problems/e/benchmark-percents' },
  pctEquivalent: { name: 'Equivalent representations of percent problems', short: 'Same percent, different forms', st: 3, shop: 'market', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/x0267d782:cc-6th-rates-and-percentages/x0267d782:equivalent-representations-of-percent-problems/e/equivalent-representations-of-percent-problems' },
  pctVisual: { name: 'Find percents visually', short: 'Percents on a number line', st: 4, shop: 'market', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/x0267d782:cc-6th-rates-and-percentages/x0267d782:visualize-percents/e/find-percents-visually' },
  findingPct: { name: 'Finding percents', short: 'Finding percents', st: 4, shop: 'market', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/x0267d782:cc-6th-rates-and-percentages/cc-6th-percent-problems/e/finding_percents' },
  pctWord: { name: 'Percent word problems', short: 'Percent word problems', st: 4, shop: 'market', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/x0267d782:cc-6th-rates-and-percentages/cc-6th-percent-word-problems/e/percentage_word_problems_1' },
  // 4th grade, Lemonade Stand (Sadlier lessons 1 to 5)
  cmpMult: { name: 'Compare with multiplication', short: 'Compare with ×', st: 1, shop: 'lemonade', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-multiplication-and-division-2/imp-comparing-with-multiplication/e/comparing-with-multiplication' },
  cmpWord: { name: 'Compare with multiplication word problems', short: 'Comparing word problems', st: 1, shop: 'lemonade', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-multiplication-and-division-2/imp-comparing-with-multiplication/e/multiplicative-comparison-word-problems' },
  mdWord: { name: 'Multiplication and division word problems', short: '× and ÷ word problems', st: 2, shop: 'lemonade', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/division/mult-division-word-problems/e/arithmetic_word_problems' },
  estWord: { name: '2-step estimation word problems', short: 'Estimation word problems', st: 2, shop: 'lemonade', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/division/multi-step-word-problems/e/multi-step-estimation-word-problems' },
  eqWord: { name: 'Represent multi-step word problems using equations', short: 'Word problem equations', st: 2, shop: 'lemonade', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/division/multi-step-word-problems/e/represent-multi-step-word-problems-using-equations' },
  multiStep: { name: 'Multi-step word problems with whole numbers', short: 'Multi-step word problems', st: 2, shop: 'lemonade', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/division/multi-step-word-problems/e/multi-step-word-problems-with-whole-numbers' },
  factorPairs: { name: 'Factor pairs', short: 'Factor pairs', st: 3, shop: 'lemonade', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-factors-multiples-and-patterns/imp-factors-and-multiples/e/factor-pairs' },
  identFactors: { name: 'Identify factors', short: 'Identify factors', st: 3, shop: 'lemonade', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-factors-multiples-and-patterns/imp-factors-and-multiples/e/identify-factors' },
  relateFM: { name: 'Relate factors and multiples', short: 'Factors and multiples', st: 3, shop: 'lemonade', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-factors-multiples-and-patterns/imp-factors-and-multiples/e/identifying-factors-and-multiples' },
  identMultiples: { name: 'Identify multiples', short: 'Identify multiples', st: 3, shop: 'lemonade', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-factors-multiples-and-patterns/imp-factors-and-multiples/e/identify-multiples' },
  primeId: { name: 'Identify prime numbers', short: 'Prime numbers', st: 3, shop: 'lemonade', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-factors-multiples-and-patterns/imp-prime-and-composite-numbers/e/prime_numbers' },
  compositeId: { name: 'Identify composite numbers', short: 'Composite numbers', st: 3, shop: 'lemonade', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-factors-multiples-and-patterns/imp-prime-and-composite-numbers/e/composite_numbers' },
  primeComp: { name: 'Prime and composite numbers', short: 'Prime or composite', st: 3, shop: 'lemonade', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-factors-multiples-and-patterns/imp-prime-and-composite-numbers/e/prime-and-composite-numbers' },
  numPatterns: { name: 'Patterns with numbers', short: 'Number patterns', st: 4, shop: 'lemonade', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-factors-multiples-and-patterns/imp-math-patterns/e/math-patterns' },
  shapePatterns: { name: 'Patterns with shapes', short: 'Shape patterns', st: 4, shop: 'lemonade', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-factors-multiples-and-patterns/imp-math-patterns/e/patterns-with-shapes' },
  // 4th grade, Toy Shop (Sadlier lessons 6 to 13)
  pvBlocks: { name: 'Place value blocks', short: 'Place value blocks', st: 1, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-place-value-and-rounding-2/imp-intro-to-place-value/e/place-value-blocks' },
  pvTable: { name: 'Place value tables', short: 'Place value tables', st: 1, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-place-value-and-rounding-2/imp-intro-to-place-value/e/place-value-tables' },
  digitValue: { name: 'Identify value of a digit', short: 'Value of a digit', st: 1, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-place-value-and-rounding-2/imp-intro-to-place-value/e/place_value' },
  largestSmallest: { name: 'Creating largest or smallest number', short: 'Largest or smallest', st: 1, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-place-value-and-rounding-2/imp-intro-to-place-value/e/creating-largest-or-smallest-number' },
  expandedForm: { name: 'Write whole numbers in expanded form', short: 'Expanded form', st: 1, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-place-value-and-rounding-2/imp-ways-to-write-whole-numbers-expanded-form-and-written-form/e/numbers-in-expanded-form' },
  writtenForm: { name: 'Write numbers in written form', short: 'Written form', st: 1, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-place-value-and-rounding-2/writing-whole-numbers-in-written-form/e/numbers-in-written-form' },
  differentForms: { name: 'Write whole numbers in different forms', short: 'Different forms', st: 1, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-place-value-and-rounding-2/writing-whole-numbers-in-written-form/e/write-whole-numbers-in-different-forms' },
  regroup: { name: 'Regroup whole numbers', short: 'Regroup', st: 1, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-place-value-and-rounding-2/imp-regrouping-whole-numbers/e/regrouping-whole-numbers' },
  mult10: { name: 'Multiply whole numbers by 10', short: 'Multiply by 10', st: 1, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-place-value-and-rounding-2/imp-how-10-relates-to-place-value/e/multiplying-by-10' },
  div10: { name: 'Divide whole numbers by 10', short: 'Divide by 10', st: 1, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-place-value-and-rounding-2/imp-how-10-relates-to-place-value/e/dividing-whole-numbers-by-10' },
  compareNums: { name: 'Compare multi-digit numbers', short: 'Compare numbers', st: 1, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-place-value-and-rounding-2/imp-comparing-multi-digit-numbers/e/comparing-multi-digit-numbers' },
  compareForms: { name: 'Compare multi-digit numbers written in different forms', short: 'Compare forms', st: 1, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-place-value-and-rounding-2/imp-comparing-multi-digit-numbers/e/comparing-multi-digit-numbers-pv-challenge' },
  roundNum: { name: 'Round whole numbers', short: 'Round', st: 2, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-addition-and-subtraction-2/imp-rounding-whole-numbers/e/rounding_whole_numbers' },
  roundPlaces: { name: 'Round whole numbers to different place values', short: 'Round to any place', st: 2, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-addition-and-subtraction-2/imp-rounding-whole-numbers/e/rounding-whole-numbers-2' },
  roundWord: { name: 'Round whole numbers word problems', short: 'Rounding word problems', st: 2, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-addition-and-subtraction-2/imp-rounding-whole-numbers/e/round-whole-numbers-word-problems' },
  addMulti: { name: 'Multi-digit addition', short: 'Add', st: 2, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-addition-and-subtraction-2/imp-adding-multi-digit-numbers/e/multi-digit-addition' },
  subMulti: { name: 'Multi-digit subtraction', short: 'Subtract', st: 2, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-addition-and-subtraction-2/imp-subtracting-multi-digit-numbers/e/multi-digit-subtraction' },
  mult1by10s: { name: 'Multiply 1-digit numbers by 10, 100, and 1000', short: '× 10, 100, 1000', st: 3, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-multiplication-and-division-2/imp-multiplication-by-10s-100s-and-1000s/e/multiply-1-digit-number-by-10--100-1000' },
  areaMult1: { name: 'Multiply 2-digits by 1-digit with area models', short: 'Area models (× 1-digit)', st: 3, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-multiplication-and-division-2/imp-multi-digit-multiplication-place-value-and-area-models/e/multiply-2--digits-by-1-digit-with-area-models' },
  distMult: { name: 'Multiply 3- and 4-digits by 1-digit with distributive property', short: 'Break apart to multiply', st: 3, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-multiplication-and-division-2/imp-multi-digit-multiplication-place-value-and-area-models/e/multiply-3--and-4-digits-by-1-digit-with-distributive-property' },
  estProducts: { name: 'Estimate products', short: 'Estimate products', st: 3, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-multiplication-and-division-2/estimate-products/e/estimate-products--1-digit-times-2--3--and-4-digit-' },
  multRegroup: { name: 'Multiply with regrouping', short: 'Multiply with regrouping', st: 3, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-multiplication-and-division-2/multiply-with-partial-products/e/multiplication_2' },
  areaMult2: { name: 'Multiply 2-digit numbers with area models', short: 'Area models (2-digit)', st: 3, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/multiplying-by-2-digit-numbers/multiply-2-digit-numbers-with-area-models/e/multiplying-2-digit-numbers-with-area-models' },
  partialProd2: { name: 'Multiply with partial products (2-digit numbers)', short: 'Partial products', st: 3, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/multiplying-by-2-digit-numbers/multiply-2-digit-numbers-with-partial-products/e/multiply-with-partial-products--2-digit-numbers-' },
  mult2digit: { name: 'Multiply 2-digit numbers', short: 'Multiply 2-digit numbers', st: 3, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/multiplying-by-2-digit-numbers/multiply-2-digit-numbers-with-partial-products/e/multiplication_3' },
  estDiv: { name: 'Estimate to divide by 1-digit numbers', short: 'Estimate to divide', st: 4, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/division/4th-remainders/e/estimate-to-divide-by-1-digit-numbers' },
  interpRem: { name: 'Interpret remainders', short: 'Interpret remainders', st: 4, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/division/4th-remainders/e/understanding-remainders' },
  divRem: { name: 'Divide with remainders (2-digit by 1-digit)', short: 'Divide with remainders', st: 4, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/division/4th-remainders/e/division-with-remainders-1' },
  divPV: { name: 'Divide using place value', short: 'Divide by place value', st: 4, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/division/division-place-value-and-area/e/division-using-place-value-understanding' },
  areaDiv: { name: 'Divide by 1-digit numbers with area models', short: 'Area models (÷)', st: 4, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/division/division-with-area-models/e/multi-digit-division-with-visual-models' },
  estQuot: { name: 'Estimate quotients', short: 'Estimate quotients', st: 4, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/division/estimate-quotients/e/estimate-quotients--3--and-4-digit-divided-by-1-digit-' },
  divBy2345: { name: 'Divide multi-digit numbers by 2, 3, 4, and 5', short: 'Divide by 2 to 5', st: 4, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/division/multi-digit-division/e/division_1.5' },
  divBy6789: { name: 'Divide multi-digit numbers by 6, 7, 8, and 9', short: 'Divide by 6 to 9', st: 4, shop: 'toys', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/division/multi-digit-division/e/division_2' },
  // 4th grade, Pizza Parlor (Sadlier lessons 14 to 25)
  eqFracModel: { name: 'Equivalent fractions (fraction models)', short: 'Equivalent fractions (models)', st: 1, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/comparing-fractions-and-equivalent-fractions/imp-equivalent-fractions-2/e/visualizing-equivalent-fractions' },
  eqFracLine: { name: 'Equivalent fractions (number lines)', short: 'Equivalent fractions (number lines)', st: 1, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/comparing-fractions-and-equivalent-fractions/imp-equivalent-fractions-2/e/equivalent-fractions--number-lines-' },
  eqFrac: { name: 'Equivalent fractions', short: 'Equivalent fractions', st: 1, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/comparing-fractions-and-equivalent-fractions/imp-equivalent-fractions-2/e/equivalent_fractions' },
  diffWholes: { name: 'Fractions of different wholes', short: 'Different wholes', st: 1, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/comparing-fractions-and-equivalent-fractions/imp-equivalent-fractions-2/e/naming-the-whole' },
  commonDen: { name: 'Common denominators', short: 'Common denominators', st: 1, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/comparing-fractions-and-equivalent-fractions/imp-common-denominators/e/common-denominators' },
  cmpVisual: { name: 'Visually compare fractions with unlike denominators', short: 'Compare fractions (pictures)', st: 2, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/comparing-fractions-and-equivalent-fractions/imp-comparing-fractions-with-unlike-denominators-visually/e/visually-comparing-fractions' },
  cmpBench: { name: 'Compare fractions using benchmarks', short: 'Compare with 1/2', st: 2, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/comparing-fractions-and-equivalent-fractions/imp-comparing-fractions-with-unlike-denominators/e/compare-fractions-using-benchmark' },
  cmpFrac: { name: 'Compare fractions with different numerators and denominators', short: 'Compare fractions', st: 2, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/comparing-fractions-and-equivalent-fractions/imp-comparing-fractions-with-unlike-denominators/e/comparing_fractions_2' },
  cmpFracWord: { name: 'Compare fractions word problems', short: 'Comparing word problems', st: 2, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/comparing-fractions-and-equivalent-fractions/imp-comparing-fractions-with-unlike-denominators/e/compare-fractions-word-problems' },
  decompVisual: { name: 'Decompose fractions visually', short: 'Break apart (pictures)', st: 3, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-fractions-2/imp-decomposing-fractions/e/decompose-fractions-visually' },
  decomp: { name: 'Decompose fractions', short: 'Break apart fractions', st: 3, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-fractions-2/imp-decomposing-fractions/e/decomposing-fractions' },
  addLike: { name: 'Add fractions with common denominators', short: 'Add fractions', st: 3, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-fractions-2/imp-adding-and-subtracting-fractions-with-like-denominators/e/adding_fractions_with_common_denominators' },
  subLike: { name: 'Subtract fractions with common denominators', short: 'Subtract fractions', st: 3, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-fractions-2/imp-adding-and-subtracting-fractions-with-like-denominators/e/subtracting_fractions_with_common_denominators' },
  fracWordAS: { name: 'Add and subtract fractions word problems', short: 'Fraction word problems', st: 3, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-fractions-2/imp-adding-and-subtracting-fractions-word-problems/e/adding-and-subtracting-fractions-with-like-denominators-word-problems' },
  mixedImproper: { name: 'Write mixed numbers and improper fractions', short: 'Mixed and improper', st: 3, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-fractions-2/imp-mixed-numbers/e/converting_mixed_numbers_and_improper_fractions' },
  mixedAS: { name: 'Add and subtract mixed numbers (no regrouping)', short: 'Mixed numbers', st: 3, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-fractions-2/imp-adding-and-subtracting-mixed-numbers/e/adding_subtracting_mixed_numbers_0.5' },
  mixedASregroup: { name: 'Add and subtract mixed numbers (with regrouping)', short: 'Mixed numbers (regrouping)', st: 3, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-fractions-2/imp-adding-and-subtracting-mixed-numbers/e/adding-and-subtracting-mixed-numbers-with-like-denominators-2' },
  mixedWord: { name: 'Add and subtract mixed numbers word problems', short: 'Mixed number word problems', st: 3, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-fractions-2/adding-and-subtracting-mixed-numbers-word-problems/e/add-and-subtract-mixed-numbers-word-problems--like-denominators-' },
  multFracModel: { name: 'Multiply fractions and whole numbers with models', short: 'Fraction × whole (pictures)', st: 4, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/4th-multiply-fractions/imp-multiplying-unit-fractions-and-whole-numbers/e/multiplying-fractions-and-whole-numbers-intuition' },
  multFracLine: { name: 'Multiply fractions and whole numbers on the number line', short: 'Fraction × whole (number line)', st: 4, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/4th-multiply-fractions/imp-multiplying-unit-fractions-and-whole-numbers/e/multiply-fractions-and-whole-numbers-on-the-number-line' },
  multUnitFrac: { name: 'Multiply unit fractions and whole numbers', short: 'Unit fraction × whole', st: 4, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/4th-multiply-fractions/multiplying-whole-numbers-and-fractions/e/multiplying-unit-fractions-and-whole-numbers' },
  multFracWhole: { name: 'Multiply fractions and whole numbers', short: 'Fraction × whole', st: 4, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/4th-multiply-fractions/multiplying-whole-numbers-and-fractions/e/multiplying_fractions_by_integers' },
  multMixedWhole: { name: 'Multiply mixed numbers and whole numbers', short: 'Mixed number × whole', st: 4, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/4th-multiply-fractions/imp-multiplying-whole-numbers-and-fractions/e/multiply-mixed-numbers-and-whole-numbers' },
  multFracWord: { name: 'Multiply fractions and whole numbers word problems', short: 'Fraction × whole word problems', st: 4, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/4th-multiply-fractions/imp-multiplying-whole-numbers-and-fractions-word-problems/e/multiplying-fractions-and-whole-numbers-word-problems' },
  eqFrac10: { name: 'Equivalent fractions with denominators of 10 and 100', short: 'Tenths and hundredths', st: 5, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-fractions-2/imp-fractions-with-denominators-of-10-and-100/e/equivalent-fractions-with-denominators-of-10-and-100' },
  addFrac10: { name: 'Add fractions with denominators of 10 and 100', short: 'Add tenths and hundredths', st: 5, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-fractions-2/imp-fractions-with-denominators-of-10-and-100/e/adding_fractions_0.5' },
  decShown: { name: 'Write decimals and fractions shown on grids and number lines', short: 'Decimals in pictures', st: 5, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-decimals/imp-decimals-vs-fractions/e/write-decimals-and-fractions-shown-on-number-lines' },
  decWords: { name: 'Decimals in words', short: 'Decimals in words', st: 5, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-decimals/imp-intro-to-decimals/e/decimals-in-words' },
  decLine: { name: 'Decimals on the number line', short: 'Decimals on a number line', st: 5, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-decimals/imp-decimals-on-the-number-line/e/decimals-on-the-number-line--hundredths-0-1' },
  decToFrac: { name: 'Write decimals as fractions', short: 'Decimals to fractions', st: 5, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-decimals/imp-converting-decimals-to-fractions/e/converting_decimals_to_fractions_1' },
  cmpDec: { name: 'Compare decimals', short: 'Compare decimals', st: 5, shop: 'pizza', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-decimals/imp-comparing-decimals/e/comparing_decimals_1' },
  // 4th grade, Garden Center (Sadlier lessons 26 to 33)
  convMass: { name: 'Convert to smaller units (g and kg, oz and lb)', short: 'Mass units', st: 1, shop: 'garden', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-measurement-and-data-2/imp-converting-units-of-mass/e/converting-larger-units-to-smaller-units--grams-and-kilograms-' },
  convVolume: { name: 'Convert to smaller units (mL and L, c, pt, qt, and gal)', short: 'Volume units', st: 1, shop: 'garden', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-measurement-and-data-2/imp-converting-units-of-volume/e/converting-larger-units-to-smaller-units--cups--pints--quarts--and-gallons-' },
  convLength: { name: 'Convert to smaller units (mm, cm, m, km, in, ft, yd, and mi)', short: 'Length units', st: 1, shop: 'garden', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-measurement-and-data-2/imp-converting-units-of-length/e/converting-larger-units-to-smaller-units--inches--feet--yards--and-miles-' },
  convTime: { name: 'Convert to smaller units (sec, min, and hr)', short: 'Time units', st: 1, shop: 'garden', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-measurement-and-data-2/imp-converting-units-of-time/e/measurement-units' },
  timeWord: { name: 'Time conversion word problems', short: 'Time word problems', st: 1, shop: 'garden', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-measurement-and-data-2/imp-converting-units-of-time/e/measuring-time-word-problems' },
  moneyWord: { name: 'Convert money word problems', short: 'Money word problems', st: 1, shop: 'garden', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-measurement-and-data-2/imp-money-word-problems/e/measuring-and-converting-money-word-problems' },
  metricWord: { name: 'Metric conversions word problems', short: 'Metric word problems', st: 1, shop: 'garden', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-measurement-and-data-2/imp-conversion-word-problems/e/metric-conversions-word-problems' },
  customaryWord: { name: 'US customary conversion word problems', short: 'Customary word problems', st: 1, shop: 'garden', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/imp-measurement-and-data-2/imp-conversion-word-problems/e/us-customary-conversion-word-problems' },
  apSituation: { name: 'Area and perimeter situations', short: 'Area or perimeter?', st: 2, shop: 'garden', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/area-perimeter/imp-area-and-perimeter/e/area-and-perimeter-scenarios' },
  rectMeasure: { name: 'Represent rectangle measurements', short: 'Area and perimeter', st: 2, shop: 'garden', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/area-perimeter/imp-area-and-perimeter/e/area_of_squares_and_rectangles' },
  apMissing: { name: 'Find a missing side from the area or perimeter', short: 'Missing side', st: 2, shop: 'garden', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/area-perimeter/imp-area-and-perimeter/v/width-from-perimeter' },
  apWord: { name: 'Area & perimeter of rectangles word problems', short: 'Area and perimeter word problems', st: 2, shop: 'garden', url: 'https://www.khanacademy.org/math/cc-fourth-grade-math/area-perimeter/imp-area-and-perimeter/e/area-and-perimeter-of-rectangles-word-problems' }
};
export const SKILL_ORDER = Object.keys(SKILLS);

export interface DrillType {
  name: string;                          // for teachers: "Times tables"
  unit: string;                          // building id, or 'all'
  sprintUnlock?: { unit: string; station: number };
  teacherLabel: (key: string) => string; // "7s times table"
  kidTitle: (key: string) => string;     // "Let's practice the 7s!"
}
export const DRILLS: Record<string, DrillType> = {
  times:        { name: 'Times tables', unit: 'all',    teacherLabel: k => `${k}s times table`,       kidTitle: k => `Let's practice the ${k}s!` },
  placeValue:   { name: 'Place value',  unit: 'bakery', sprintUnlock: { unit: 'bakery', station: 1 }, teacherLabel: k => `Place value (${k})`,      kidTitle: () => "Let's line up the places!" },
  decimalShift: { name: 'Moving the decimal', unit: 'bakery', sprintUnlock: { unit: 'bakery', station: 4 }, teacherLabel: k => `Multiplying by ${k}`, kidTitle: k => `Let's slide the decimal (× ${k})!` },
  reciprocal:   { name: 'Reciprocals',  unit: 'bakery', sprintUnlock: { unit: 'bakery', station: 3 }, teacherLabel: () => 'Flipping fractions',     kidTitle: () => "Let's flip some fractions!" },
  simplify:     { name: 'Simplifying',  unit: 'bakery', sprintUnlock: { unit: 'bakery', station: 2 }, teacherLabel: k => `Simplifying by ${k}`,     kidTitle: k => `Let's simplify by ${k}!` },
  lineUp:       { name: 'Lining up decimals', unit: 'bakery', sprintUnlock: { unit: 'bakery', station: 1 }, teacherLabel: k => `Lining up decimals (${k})`, kidTitle: () => "Let's line up the decimals!" },
  factors:      { name: 'Factor pairs', unit: 'lemonade', sprintUnlock: { unit: 'lemonade', station: 3 }, teacherLabel: () => 'Factor pairs', kidTitle: () => "Let's find the factor pairs!" },
  rounding:     { name: 'Rounding', unit: 'toys', sprintUnlock: { unit: 'toys', station: 2 }, teacherLabel: k => `Rounding to the nearest ${k}`, kidTitle: k => `Let's round to the nearest ${k}!` },
  story:        { name: 'Word problems to math', unit: 'all',    teacherLabel: k => k === 'divide' ? 'Word problems: dividing fractions' : k === 'ratio' ? 'Word problems: ratios' : 'Word problems: adding and subtracting', kidTitle: () => "Let's turn stories into math!" },
  mixed:        { name: 'Mixed numbers', unit: 'bakery', sprintUnlock: { unit: 'bakery', station: 2 }, teacherLabel: k => `Mixed numbers (over ${k})`, kidTitle: () => "Let's find the wholes!" }
};
/** "times:7" → "7s times table" */
export function drillLabel(id: string): string {
  const i = id.indexOf(':'), type = i < 0 ? 'times' : id.slice(0, i), key = i < 0 ? id : id.slice(i + 1);
  const d = DRILLS[type];
  return d ? d.teacherLabel(key) : id;
}

export interface DrillSettings {
  enabled: boolean;
  types: Record<string, boolean>;
  triggers: { miss: boolean; slow: boolean; sprint: boolean };
  slow: { mode: 'fixed' | 'adaptive'; idea: number; arith: number; sprint: number };
  readSeconds: number;
  timeScale: number;
  maxPerShift: number;
  resetAt?: string;
}
export const DEFAULT_DRILL_SETTINGS: DrillSettings = {
  enabled: true,
  types: {},
  triggers: { miss: true, slow: true, sprint: true },
  slow: { mode: 'adaptive', idea: 15, arith: 10, sprint: 6 },
  readSeconds: 5,
  timeScale: 1,
  maxPerShift: 3
};
const clampNum = (v: unknown, lo: number, hi: number, dflt: number) => {
  const n = typeof v === 'number' && isFinite(v) ? v : dflt;
  return Math.min(hi, Math.max(lo, n));
};
/** Built-in defaults, then class settings, then student override. Values are range-checked. */
export function mergeDrillSettings(...layers: (Partial<DrillSettings> | null | undefined)[]): DrillSettings {
  const out: DrillSettings = JSON.parse(JSON.stringify(DEFAULT_DRILL_SETTINGS));
  for (const l of layers) {
    if (!l || typeof l !== 'object') continue;
    if (typeof l.enabled === 'boolean') out.enabled = l.enabled;
    if (l.types && typeof l.types === 'object') Object.assign(out.types, l.types);
    if (l.triggers && typeof l.triggers === 'object') Object.assign(out.triggers, l.triggers);
    if (l.slow && typeof l.slow === 'object') Object.assign(out.slow, l.slow);
    if (l.readSeconds !== undefined) out.readSeconds = l.readSeconds as number;
    if (l.timeScale !== undefined) out.timeScale = l.timeScale as number;
    if (l.maxPerShift !== undefined) out.maxPerShift = l.maxPerShift as number;
    if (typeof l.resetAt === 'string') out.resetAt = l.resetAt;
  }
  out.slow.mode = out.slow.mode === 'fixed' ? 'fixed' : 'adaptive';
  out.slow.idea = clampNum(out.slow.idea, 5, 60, 15);
  out.slow.arith = clampNum(out.slow.arith, 5, 60, 10);
  out.slow.sprint = clampNum(out.slow.sprint, 3, 20, 6);
  out.readSeconds = clampNum(out.readSeconds, 0, 20, 5);
  out.timeScale = clampNum(out.timeScale, 1, 3, 1);
  out.maxPerShift = Math.round(clampNum(out.maxPerShift, 1, 5, 3));
  return out;
}
/** A drill type is on unless explicitly set to false. */
export const drillTypeOn = (s: DrillSettings, type: string) => s.enabled && s.types[type] !== false;

export interface QuizSettings {
  passPct: number;
  quizPerSkill: number;
  quizMin: number;
  quizMax: number;
  testPerSkill: number;
  testMin: number;
  testMax: number;
  reviewPerfect: number;
  requireQuiz: boolean;
  showSteps: boolean;
}
export const QUIZ_DEFAULTS: QuizSettings = {
  passPct: 80,
  quizPerSkill: 2,
  quizMin: 6,
  quizMax: 10,
  testPerSkill: 1,
  testMin: 8,
  testMax: 16,
  reviewPerfect: 2,
  requireQuiz: true,
  showSteps: false
};
const clampInt = (value: unknown, min: number, max: number, fallback: number) => {
  const number = Math.round(typeof value === 'number' && isFinite(value) ? value : fallback);
  return Math.min(max, Math.max(min, number));
};
export function quizSettings(raw: Partial<QuizSettings> | null | undefined): QuizSettings {
  const r = raw && typeof raw === 'object' ? raw : {}, d = QUIZ_DEFAULTS;
  const settings: QuizSettings = {
    passPct: clampInt(r.passPct, 50, 100, d.passPct),
    quizPerSkill: clampInt(r.quizPerSkill, 1, 4, d.quizPerSkill),
    quizMin: clampInt(r.quizMin, 3, 20, d.quizMin), quizMax: clampInt(r.quizMax, 3, 20, d.quizMax),
    testPerSkill: clampInt(r.testPerSkill, 1, 3, d.testPerSkill),
    testMin: clampInt(r.testMin, 4, 30, d.testMin), testMax: clampInt(r.testMax, 4, 30, d.testMax),
    reviewPerfect: clampInt(r.reviewPerfect, 1, 5, d.reviewPerfect),
    requireQuiz: typeof r.requireQuiz === 'boolean' ? r.requireQuiz : d.requireQuiz,
    showSteps: typeof r.showSteps === 'boolean' ? r.showSteps : d.showSteps
  };
  if (settings.quizMax < settings.quizMin) settings.quizMax = settings.quizMin;
  if (settings.testMax < settings.testMin) settings.testMax = settings.testMin;
  return settings;
}

export interface Station { id: number; name: string; emoji: string; kid: string; skills: string[] }
export const STATIONS: Station[] = [
  { id: 1, name: 'The Counter',  emoji: '🧺', kid: 'Write ratios from a tray of treats', skills: ['basic'] },
  { id: 2, name: 'Recipe Cards', emoji: '📇', kid: 'Tape diagrams, equal groups, double number lines', skills: ['tape', 'groups', 'dnlCreate', 'dnl', 'dnlTable'] },
  { id: 3, name: 'The Kitchen',  emoji: '🍳', kid: 'Ratio tables, equivalent ratios, word problems', skills: ['table', 'equiv', 'word', 'realworld', 'understand'] },
  { id: 4, name: 'Deliveries',   emoji: '🛵', kid: 'Coordinate plane, units, part-part-whole', skills: ['coord', 'units', 'ppw'] }
];
export const LEMON_STATIONS: Station[] = [
  { id: 1, name: 'Pitchers',      emoji: '🫙', kid: 'Compare with multiplication', skills: ['cmpMult', 'cmpWord'] },
  { id: 2, name: 'Big Orders',    emoji: '📦', kid: 'Word problems with more than one step', skills: ['mdWord', 'estWord', 'eqWord', 'multiStep'] },
  { id: 3, name: 'Cup Stacks',    emoji: '🥤', kid: 'Factors, multiples, and primes', skills: ['factorPairs', 'identFactors', 'relateFM', 'identMultiples', 'primeId', 'compositeId', 'primeComp'] },
  { id: 4, name: 'Sign Patterns', emoji: '🪧', kid: 'Number and shape patterns', skills: ['numPatterns', 'shapePatterns'] }
];
export const TOY_STATIONS: Station[] = [
  { id: 1, name: 'Stock Room',      emoji: '📦', kid: 'Place value, writing and comparing numbers', skills: ['pvBlocks', 'pvTable', 'digitValue', 'largestSmallest', 'expandedForm', 'writtenForm', 'differentForms', 'regroup', 'mult10', 'div10', 'compareNums', 'compareForms'] },
  { id: 2, name: 'Price Tags',      emoji: '🏷️', kid: 'Rounding, adding, and subtracting', skills: ['roundNum', 'roundPlaces', 'roundWord', 'addMulti', 'subMulti'] },
  { id: 3, name: 'Toy Crates',      emoji: '🧸', kid: 'Multiplying', skills: ['mult1by10s', 'areaMult1', 'distMult', 'estProducts', 'multRegroup', 'areaMult2', 'partialProd2', 'mult2digit'] },
  { id: 4, name: 'Sharing Shelves', emoji: '🗄️', kid: 'Dividing', skills: ['estDiv', 'interpRem', 'divRem', 'divPV', 'areaDiv', 'estQuot', 'divBy2345', 'divBy6789'] }
];
export const PIZZA_STATIONS: Station[] = [
  { id: 1, name: 'Slices',           emoji: '🍕', kid: 'Equivalent fractions', skills: ['eqFracModel', 'eqFracLine', 'eqFrac', 'diffWholes', 'commonDen'] },
  { id: 2, name: 'Which Is Bigger?', emoji: '⚖️', kid: 'Comparing fractions', skills: ['cmpVisual', 'cmpBench', 'cmpFrac', 'cmpFracWord'] },
  { id: 3, name: 'Toppings',         emoji: '🧀', kid: 'Adding and subtracting fractions and mixed numbers', skills: ['decompVisual', 'decomp', 'addLike', 'subLike', 'fracWordAS', 'mixedImproper', 'mixedAS', 'mixedASregroup', 'mixedWord'] },
  { id: 4, name: 'Party Orders',     emoji: '🎉', kid: 'Multiplying fractions by whole numbers', skills: ['multFracModel', 'multFracLine', 'multUnitFrac', 'multFracWhole', 'multMixedWhole', 'multFracWord'] },
  { id: 5, name: 'Pizza Money',      emoji: '💵', kid: 'Tenths, hundredths, and decimals', skills: ['eqFrac10', 'addFrac10', 'decShown', 'decWords', 'decLine', 'decToFrac', 'cmpDec'] }
];
export const GARDEN_STATIONS: Station[] = [
  { id: 1, name: 'Measuring Cups',   emoji: '🥄', kid: 'Converting units', skills: ['convMass', 'convVolume', 'convLength', 'convTime', 'timeWord', 'moneyWord', 'metricWord', 'customaryWord'] },
  { id: 2, name: 'Garden Beds',      emoji: '🟫', kid: 'Area and perimeter', skills: ['apSituation', 'rectMeasure', 'apMissing', 'apWord'] },
  { id: 3, name: 'Seed Survey',      emoji: '📊', kid: 'Line plots', skills: [] },
  { id: 4, name: 'Sprinkler Angles', emoji: '📐', kid: 'Measuring angles', skills: [] }
];
export interface Shop { id: string; name: string; emoji: string; unitLabel: string; stations: Station[] }
export const BAKERY_STATIONS: Station[] = [
  { id: 1, name: 'The Scale',     emoji: '⚖️', kid: 'Add and subtract decimals', skills: ['addDec', 'subDec', 'decWord'] },
  { id: 2, name: 'Sharing Pans',  emoji: '🥧', kid: 'Divide fractions and whole numbers', skills: ['fracDivWhole', 'wholeDivFrac'] },
  { id: 3, name: 'Boxing Treats', emoji: '📦', kid: 'Divide fractions by fractions', skills: ['fracDiv', 'mixedDiv', 'fracInterp', 'fracWord'] },
  { id: 4, name: 'The Register',  emoji: '🧾', kid: 'Multiply decimals, long division', skills: ['mulDecPlace', 'mulDec', 'div2', 'divMulti'] },
  { id: 5, name: 'Bulk Orders',   emoji: '🚚', kid: 'Divide decimals', skills: ['divToDec', 'divDec2', 'divDec3'] }
];
export const MARKET_STATIONS: Station[] = [
  { id: 1, name: 'Price Tags',    emoji: '🏷️', kid: 'Unit rates and comparing deals', skills: ['unitRate', 'rateProblems', 'compareRates'] },
  { id: 2, name: 'Percent Signs', emoji: '💯', kid: 'What a percent means', skills: ['introPercent', 'pctModel'] },
  { id: 3, name: 'Sale Signs',    emoji: '🪧', kid: 'Percents, decimals, and fractions', skills: ['pctConvert', 'benchmarkPct', 'pctEquivalent'] },
  { id: 4, name: 'Discount Bin',  emoji: '🧺', kid: 'Percent problems', skills: ['pctVisual', 'findingPct', 'pctWord'] }
];
export const SHOPS: Record<string, Shop> = {
  cafe:   { id: 'cafe',   name: 'Pet Café', emoji: '☕', unitLabel: 'Khan Academy 6th grade, Unit 1: Ratios', stations: STATIONS },
  bakery: { id: 'bakery', name: 'Bakery',   emoji: '🥐', unitLabel: 'Khan Academy 6th grade, Unit 2: Arithmetic with rational numbers', stations: BAKERY_STATIONS },
  market: { id: 'market', name: 'Market Stall', emoji: '🍎', unitLabel: 'Khan Academy 6th grade, Unit 3: Rates and percentages', stations: MARKET_STATIONS },
  lemonade: { id: 'lemonade', name: 'Lemonade Stand', emoji: '🍋', unitLabel: 'Sadlier Grade 4, lessons 1 to 5, with Khan Academy 4th grade practice', stations: LEMON_STATIONS },
  toys: { id: 'toys', name: 'Toy Shop', emoji: '🧸', unitLabel: 'Sadlier Grade 4, lessons 6 to 13, with Khan Academy 4th grade practice', stations: TOY_STATIONS },
  pizza: { id: 'pizza', name: 'Pizza Parlor', emoji: '🍕', unitLabel: 'Sadlier Grade 4, lessons 14 to 25, with Khan Academy 4th grade practice', stations: PIZZA_STATIONS },
  garden: { id: 'garden', name: 'Garden Center', emoji: '🌱', unitLabel: 'Sadlier Grade 4, lessons 26 to 33, with Khan Academy 4th grade practice', stations: GARDEN_STATIONS }
};
export const shopOfSkill = (id: string) => SKILLS[id]?.shop || 'cafe';
export const UNLOCK_AT = 6;

export type UnlockRule =
  | { type: 'start' }
  | { type: 'unit' }
  | { type: 'station'; station: number }
  | { type: 'mastery'; skills: string[] }
  | { type: 'unitMastery' }
  | { type: 'sprint'; best: number }
  | { type: 'streak'; n: number };

export interface Reward {
  id: string; kind: 'pet' | 'decor'; emoji: string; name: string;
  unit: string;
  unlock: UnlockRule; price: number; legendary?: boolean;
}

/** Skills belonging to each unit. Add a unit's skills when that unit is built. */
export const UNIT_SKILLS: Record<string, string[]> = {
  cafe: ['basic','tape','groups','dnlCreate','dnl','dnlTable','table','equiv','word','realworld','understand','coord','units','ppw'],
  bakery: ['addDec', 'subDec', 'decWord', 'fracDivWhole', 'wholeDivFrac', 'fracDiv', 'mixedDiv', 'fracInterp', 'fracWord', 'mulDecPlace', 'mulDec', 'div2', 'divMulti', 'divToDec', 'divDec2', 'divDec3'],
  lemonade: ['cmpMult', 'cmpWord', 'mdWord', 'estWord', 'eqWord', 'multiStep', 'factorPairs', 'identFactors', 'relateFM', 'identMultiples', 'primeId', 'compositeId', 'primeComp', 'numPatterns', 'shapePatterns'],
  toys: ['pvBlocks', 'pvTable', 'digitValue', 'largestSmallest', 'expandedForm', 'writtenForm', 'differentForms', 'regroup', 'mult10', 'div10', 'compareNums', 'compareForms', 'roundNum', 'roundPlaces', 'roundWord', 'addMulti', 'subMulti', 'mult1by10s', 'areaMult1', 'distMult', 'estProducts', 'multRegroup', 'areaMult2', 'partialProd2', 'mult2digit', 'estDiv', 'interpRem', 'divRem', 'divPV', 'areaDiv', 'estQuot', 'divBy2345', 'divBy6789'],
  pizza: ['eqFracModel', 'eqFracLine', 'eqFrac', 'diffWholes', 'commonDen', 'cmpVisual', 'cmpBench', 'cmpFrac', 'cmpFracWord', 'decompVisual', 'decomp', 'addLike', 'subLike', 'fracWordAS', 'mixedImproper', 'mixedAS', 'mixedASregroup', 'mixedWord', 'multFracModel', 'multFracLine', 'multUnitFrac', 'multFracWhole', 'multMixedWhole', 'multFracWord', 'eqFrac10', 'addFrac10', 'decShown', 'decWords', 'decLine', 'decToFrac', 'cmpDec'], garden: ['convMass', 'convVolume', 'convLength', 'convTime', 'timeWord', 'moneyWord', 'metricWord', 'customaryWord', 'apSituation', 'rectMeasure', 'apMissing', 'apWord'], market: ['unitRate', 'rateProblems', 'compareRates', 'introPercent', 'pctModel', 'pctConvert', 'benchmarkPct', 'pctEquivalent', 'pctVisual', 'findingPct', 'pctWord'], clock: [], rink: [], potion: [], houses: [], show: []
};

const cafeRewards: Reward[] = [
  { id:'cat',      kind:'pet',   emoji:'🐱', name:'Mochi the cat',       unit:'cafe', unlock:{type:'start'}, price:0 },
  { id:'bunny',    kind:'pet',   emoji:'🐰', name:'Clover the bunny',    unit:'cafe', unlock:{type:'start'}, price:40 },
  { id:'hamster',  kind:'pet',   emoji:'🐹', name:'Peanut the hamster',  unit:'cafe', unlock:{type:'start'}, price:60 },
  { id:'penguin',  kind:'pet',   emoji:'🐧', name:'Pebble the penguin',  unit:'cafe', unlock:{type:'station', station:2}, price:100 },
  { id:'fox',      kind:'pet',   emoji:'🦊', name:'Maple the fox',       unit:'cafe', unlock:{type:'station', station:3}, price:150 },
  { id:'panda',    kind:'pet',   emoji:'🐼', name:'Dumpling the panda',  unit:'cafe', unlock:{type:'station', station:4}, price:220 },
  { id:'unicorn',  kind:'pet',   emoji:'🦄', name:'Sparkle the unicorn', unit:'cafe', unlock:{type:'unitMastery'}, price:0, legendary:true },
  { id:'tulips',   kind:'decor', emoji:'🌷', name:'Tulip vase',          unit:'cafe', unlock:{type:'start'}, price:20 },
  { id:'plant',    kind:'decor', emoji:'🪴', name:'Leafy plant',         unit:'cafe', unlock:{type:'start'}, price:30 },
  { id:'teddy',    kind:'decor', emoji:'🧸', name:'Teddy bear',          unit:'cafe', unlock:{type:'start'}, price:45 },
  { id:'balloons', kind:'decor', emoji:'🎈', name:'Balloons',            unit:'cafe', unlock:{type:'start'}, price:50 },
  { id:'frame',    kind:'decor', emoji:'🖼️', name:'Fancy painting',      unit:'cafe', unlock:{type:'mastery', skills:['basic']}, price:0 },
  { id:'cake',     kind:'decor', emoji:'🎂', name:'Cake display',        unit:'cafe', unlock:{type:'mastery', skills:['table','equiv']}, price:90 },
  { id:'lights',   kind:'decor', emoji:'✨', name:'Twinkle lights',      unit:'cafe', unlock:{type:'streak', n:5}, price:110 },
  { id:'rainbow',  kind:'decor', emoji:'🌈', name:'Rainbow sign',         unit:'cafe', unlock:{type:'sprint', best:25}, price:160 },
  { id:'crown',    kind:'decor', emoji:'👑', name:'Golden crown',         unit:'cafe', unlock:{type:'unitMastery'}, price:0, legendary:true }
];

/** [building id, pets (welcome, s2, s3, s4, legend), decor (welcome, s2, s3, s4, legend)] as [emoji, name] pairs */
const UNIT_SETS: [string, [string,string][], [string,string][]][] = [
  ['bakery', [['🦔','Crumb the hedgehog'],['🐭','Nibbles the mouse'],['🐥','Sunny the chick'],['🐻','Honey the bear'],['🦝','Sprinkles the raccoon']],
             [['🍞','Bread basket'],['🥐','Croissant sign'],['🥧','Pie window'],['🥨','Pretzel garland'],['🏅',"Baker's gold medal"]]],
  ['lemonade', [['🐤','Zest the duckling'],['🦘','Pogo the kangaroo'],['🐬','Bubbles the dolphin'],['🦩','Rosie the flamingo'],['🦭','Captain the seal']],
               [['🍋','Lemon crate'],['🥤','Cup tower'],['🧊','Ice bucket'],['⛱️','Sun umbrella'],['🌟','Golden lemon sign']]],
  ['toys', [['🐶','Patch the puppy'],['🐰','Button the bunny'],['🐒','Jojo the monkey'],['🐘','Peanut the elephant'],['🐼','Captain Cuddles the panda']],
           [['🪀','Yo-yo rack'],['🧩','Puzzle wall'],['🚂','Toy train'],['🎠','Carousel'],['🎁','Golden gift box']]],
  ['pizza', [['🐭','Mozzarella the mouse'],['🐈‍⬛','Pepper the cat'],['🦔','Crust the hedgehog'],['🦝','Basil the raccoon'],['🐲','Oregano the dragon']],
            [['🧀','Cheese wheel'],['🍅','Tomato basket'],['🫓','Dough board'],['🔥','Pizza oven'],['🏆','Golden pizza peel']]],
  ['garden', [['🐇','Clover the bunny'],['🦗','Chirp the cricket'],['🐛','Wiggles the caterpillar'],['🦫','Bramble the beaver'],['🕊️','Blossom the dove']],
            [['🌵','Cactus pot'],['🥕','Carrot patch'],['🌹','Rose bush'],['⛲','Garden fountain'],['🏆','Golden watering can']]],
  ['market', [['🐐','Gus the goat'],['🦜','Kiwi the parrot'],['🐢','Slowpoke the turtle'],['🦙','Lulu the llama'],['🐓','Rocco the rooster']],
             [['🍉','Melon stand'],['🌽','Corn crate'],['🧺','Picnic basket'],['🏷️','Price tags'],['⚖️','Golden scale']]],
  ['clock',  [['🦉','Hoot the owl'],['🦇','Midnight the bat'],['🐿️','Acorn the chipmunk'],['🦅','Soar the eagle'],['🐉','Ember the dragon']],
             [['🕯️','Candles'],['🔔','Tower bell'],['⏳','Hourglass'],['🌙','Moon banner'],['🕰️','Golden clock']]],
  ['rink',   [['🦌','Frost the reindeer'],['🐺','Howl the wolf'],['🐋','Splash the whale'],['🦈','Finn the shark'],['🦢','Crystal the swan']],
             [['⛸️','Skates'],['🧣','Scarf rack'],['☃️','Snowman'],['🏒','Hockey sticks'],['🥇','Gold medal']]],
  ['potion', [['🐸','Fizz the frog'],['🐍','Noodle the snake'],['🦎','Zap the lizard'],['🐙','Inky the octopus'],['🦋','Glimmer the butterfly']],
             [['🧪','Flasks'],['🔮','Crystal ball'],['📜','Spell scroll'],['🕸️','Cobwebs'],['⚗️','Golden cauldron']]],
  ['houses', [['🐌','Shelly the snail'],['🐞','Dot the ladybug'],['🐝','Buzz the bee'],['🦡','Digger the badger'],['🦚','Jewel the peacock']],
             [['🌻','Sunflower patch'],['🧱','Brick pile'],['🏕️','Camp tent'],['🏠','Tiny house'],['🏰','Castle']]],
  ['show',   [['🐩','Fifi the poodle'],['🐈','Duchess the show cat'],['🦒','Tallulah the giraffe'],['🦓','Stripes the zebra'],['🦁','King the lion']],
             [['🎀','Ribbons'],['📊','Score board'],['🎪','Show tent'],['🎺','Trumpet'],['🏆','Grand trophy']]]
];
const SLOTS = ['welcome','s2','s3','s4','legend'] as const;
const slotRule = (i: number): UnlockRule => i === 0 ? {type:'unit'} : i === 4 ? {type:'unitMastery'} : {type:'station', station:i + 1};
const PRICE = { pet: [0,100,150,200,0], decor: [0,60,90,120,0] };

export const REWARDS: Reward[] = [
  ...cafeRewards,
  ...UNIT_SETS.flatMap(([unit, pets, decor]) => (
    [['pet', pets], ['decor', decor]] as const).flatMap(([kind, list]) =>
      list.map(([emoji, name], i): Reward => ({
        id: `${unit}_${kind}_${SLOTS[i]}`, kind, emoji, name, unit,
        unlock: slotRule(i), price: PRICE[kind][i], legendary: i === 4 || undefined
      }))))
];

/* Neighborhoods: one town per student, one neighborhood per grade or course (docs/NEIGHBORHOODS.md).
   Progress is saved by shop and skill id, so adding a neighborhood never touches what's already saved. */
export interface Neighborhood { id: string; name: string; emoji: string }
export const NEIGHBORHOODS: Neighborhood[] = [
  { id: 'g4', name: '4th grade', emoji: '🍋' },
  { id: 'g6', name: '6th grade', emoji: '☕' }
];
export const DEFAULT_HOME = 'g6';
export interface Building { id: string; emoji: string; name: string; unit: string; hood: string; open?: boolean }
export const BUILDINGS: Building[] = [
  {id:'cafe',   emoji:'☕', name:'Pet Café',     unit:'Unit 1: Ratios', hood:'g6', open:true},
  {id:'bakery', emoji:'🥐', name:'Bakery',       unit:'Unit 2: Arithmetic with rational numbers', hood:'g6', open:true},
  {id:'market', emoji:'🍎', name:'Market Stall', unit:'Unit 3: Rates and percentages', hood:'g6', open:true},
  {id:'clock',  emoji:'🕰️', name:'Clock Tower',  unit:'Unit 4: Exponents and order of operations', hood:'g6'},
  {id:'rink',   emoji:'⛸️', name:'Ice Rink',     unit:'Unit 5: Negative numbers', hood:'g6'},
  {id:'potion', emoji:'🧪', name:'Potion Lab',   unit:'Units 6 and 7: Expressions and equations', hood:'g6'},
  {id:'houses', emoji:'🏡', name:'Pet Houses',   unit:'Units 8 to 10: Area, coordinate plane, 3D figures', hood:'g6'},
  {id:'show',   emoji:'🏆', name:'Pet Show',     unit:'Unit 11: Data and statistics', hood:'g6'},
  {id:'lemonade', emoji:'🍋', name:'Lemonade Stand', unit:'Operations and algebraic thinking', hood:'g4', open:true},
  {id:'toys',     emoji:'🧸', name:'Toy Shop',       unit:'Number and operations in base ten', hood:'g4', open:true},
  {id:'pizza',    emoji:'🍕', name:'Pizza Parlor',   unit:'Number and operations: fractions', hood:'g4', open:true},
  {id:'garden',   emoji:'🌱', name:'Garden Center',  unit:'Measurement and data', hood:'g4', open:true},
  {id:'art',      emoji:'🎨', name:'Art Studio',     unit:'Geometry', hood:'g4'}
];
export const buildingsIn = (hood: string) => BUILDINGS.filter(b => b.hood === hood);
export const hoodOf = (id: string) => BUILDINGS.find(b => b.id === id)?.hood || DEFAULT_HOME;
/* the building before this one in its own neighborhood (null for the first, which is always open) */
export function prevBuilding(id: string): Building | null { const b = BUILDINGS.find(x => x.id === id); if (!b) return null; const list = buildingsIn(b.hood), i = list.indexOf(b); return i > 0 ? list[i - 1] : null; }
export function nextBuilding(id: string): Building | null { const b = BUILDINGS.find(x => x.id === id); if (!b) return null; const list = buildingsIn(b.hood), i = list.indexOf(b); return list[i + 1] || null; }
/* neighborhoods with at least one built shop; the switcher and grade pickers appear once there are two */
export const builtHoods = () => NEIGHBORHOODS.filter(n => BUILDINGS.some(b => b.hood === n.id && b.open));
export const validHood = (id: unknown) => typeof id === 'string' && NEIGHBORHOODS.some(n => n.id === id);

export interface Misconception { name: string; kid: string; tip: string; skills: string[] }
export const MIS: Record<string, Misconception> = {
  reversed:         { name: 'Writes the ratio in the wrong order', kid: 'Check the order. The first thing named goes first.', tip: 'Say the ratio in words first ("blueberries to strawberries") and point to each item while writing it.', skills: ['basic'] },
  partwhole:        { name: 'Uses part-to-whole when part-to-part was asked', kid: 'They asked about one kind compared to the other kind, not all of them.', tip: 'Sort a set into "this kind," "that kind," and "all of them" before writing any ratio.', skills: ['basic', 'ppw'] },
  partpart:         { name: 'Uses part-to-part when part-to-whole was asked', kid: '"All the treats" means both kinds together.', tip: 'Same sorting routine. Stress that the whole includes both kinds.', skills: ['basic', 'ppw'] },
  additive:         { name: 'Adds instead of multiplies (additive thinking)', kid: 'Ratios grow by multiplying, not by adding.', tip: 'Taste-test 2:3 against 4:5: adding 2 to each changes the flavor. Model ratio tables with ×arrows on both sides.', skills: ['table', 'equiv'] },
  partsCount:       { name: 'Miscounts the total number of parts', kid: 'Count every box in both rows.', tip: 'Draw the tape diagram and count every box in both rows before dividing.', skills: ['tape', 'ppw'] },
  divideWrong:      { name: 'Divides the total by the wrong number', kid: 'Share the total across ALL the boxes.', tip: 'Ask "how many equal boxes share this total?" Divide by all the boxes, not one row.', skills: ['tape', 'ppw'] },
  oneBox:           { name: 'Stops at the value of one part', kid: "That's one box. How many boxes are there?", tip: 'After finding one box, ask "how many boxes does this row have?"', skills: ['tape', 'ppw'] },
  wrongPart:        { name: 'Answers for the wrong quantity', kid: 'Check which one they asked about.', tip: 'Circle the item being asked about before solving.', skills: ['tape', 'ppw'] },
  dnlSame:          { name: 'Counts both number lines by the same amount', kid: 'Each line jumps by its own amount.', tip: "Label each line's jump size in a different color.", skills: ['dnlCreate', 'dnl'] },
  mixedMultipliers: { name: 'Accepts different multipliers for the two amounts', kid: 'Both amounts have to use the same ×number.', tip: 'Check that both amounts use the same multiplier.', skills: ['realworld', 'equiv'] },
  missedEquivalent: { name: 'Misses a ratio that is equivalent', kid: 'Divide to find each multiplier. Are they the same?', tip: 'Divide each amount by the original to find each multiplier, then compare.', skills: ['realworld', 'equiv'] },
  oneSideOnly:      { name: 'Thinks changing one amount keeps the ratio', kid: 'If only one amount changes, the taste changes.', tip: 'Use a mix (lemonade, paint) and change only one ingredient.', skills: ['understand'] },
  notSimplest: { name: 'Stops before simplest form', kid: 'Can you divide both numbers again?', tip: 'Ask: is there any number besides 1 that divides both? Divide by the biggest one (the GCF), or keep dividing until nothing does.', skills: ['basic', 'equiv', 'table', 'fracDivWhole', 'wholeDivFrac', 'fracDiv', 'mixedDiv', 'fracInterp', 'fracWord', 'pctConvert'] },
  coordSwap:        { name: 'Swaps x and y on the coordinate plane', kid: 'Go across first (x), then up (y).', tip: 'Say "across, then up" and check the axis labels before plotting.', skills: ['coord'] },
  unitsDirection:   { name: 'Multiplies when they should divide (or the reverse) converting units', kid: 'Should the number get bigger or smaller?', tip: 'Going to a smaller unit means more of them, so multiply.', skills: ['units', 'convMass', 'convVolume', 'convLength', 'convTime', 'timeWord', 'moneyWord', 'metricWord', 'customaryWord'] },
  factSlip:         { name: 'Times-table slip (off by one group)', kid: 'So close! Check that times fact.', tip: 'The method is right. Drill the specific facts (see the times-table section).', skills: [] },
  rightAlign:        { name: 'Lines up right edges instead of decimal points', kid: 'Line up the decimal points, not the last digits.', tip: 'Have students write the numbers on grid paper with the decimal points in one column, and fill empty places with zeros.', skills: ['addDec', 'subDec'] },
  noRegroup:         { name: 'Forgets to carry when adding decimals', kid: 'When a column makes 10 or more, carry the 1.', tip: 'Add one column at a time from the right and say the carry out loud. Place-value disks help.', skills: ['addDec', 'addMulti'] },
  smallerFromLarger: { name: 'Subtracts the smaller digit from the larger in each column', kid: 'When the top digit is smaller, regroup from the next place.', tip: 'Fill empty places with zeros first (5.2 becomes 5.20), then regroup. Check by adding the answer back.', skills: ['subDec', 'subMulti', 'mixedASregroup'] },
  estimateOff:       { name: 'Estimate is off by a factor of 10', kid: 'Round each number to the nearest whole number first.', tip: 'Practice rounding decimals to whole numbers before adding. The estimate should be close to the real answer.', skills: ['addDec', 'subDec', 'mulDec'] },
  wrongOperation:    { name: 'Picks the wrong operation in a word problem', kid: 'Is the story putting amounts together or finding what is left?', tip: 'Have students act out or draw the story before choosing an operation. Change and "how much is left" mean subtract.', skills: ['decWord', 'cmpWord', 'mdWord', 'fracWordAS', 'mixedWord', 'multFracWord', 'unitRate', 'rateProblems'] },
  divAsMult:         { name: 'Multiplies instead of dividing', kid: 'Sharing makes each part smaller, and fitting small servings in makes more of them. Check which way it should go.', tip: 'Before computing, ask "will the answer be more or less than we started with?"', skills: ['fracDivWhole', 'wholeDivFrac', 'fracInterp', 'fracWord'] },
  denomOnly:         { name: 'Multiplies by the denominator and forgets the numerator', kid: 'Each serving is more than one piece. How many pieces does one serving use?', tip: 'Count the pieces on the tape diagram, then group them by the size of one serving.', skills: ['wholeDivFrac'] },
  numerOnly:         { name: 'Divides by the numerator and ignores the denominator', kid: 'The serving is not whole cups. It is a fraction of a cup.', tip: 'Compare the size of one serving to 1 whole cup first.', skills: ['wholeDivFrac'] },
  reversedDivision:  { name: 'Divides the other way round', kid: 'Which amount is being split up? Start with that one.', tip: 'Say the story aloud ("how many 2/3-cups fit in 4 cups?") and write the starting amount first.', skills: ['fracDivWhole', 'wholeDivFrac', 'fracInterp', 'fracWord'] },
  notMixed:          { name: 'Leaves an improper fraction instead of a mixed number', kid: 'The top is bigger than the bottom. How many wholes are in it?', tip: 'Divide the top by the bottom: the quotient is the whole number and the remainder goes on top.', skills: ['fracDivWhole', 'wholeDivFrac', 'fracDiv', 'mixedDiv', 'fracInterp', 'fracWord', 'mixedImproper', 'mixedAS', 'mixedASregroup', 'mixedWord', 'multFracModel', 'multFracWhole', 'multMixedWhole', 'multFracWord', 'pctConvert'] },
  flipWrong:         { name: 'Flips the first fraction instead of the divisor', kid: 'Keep the first fraction. Flip the one you divide by.', tip: 'Say "keep, change, flip" while pointing at each part.', skills: ['fracDiv', 'mixedDiv', 'fracWord'] },
  noFlip:            { name: 'Multiplies straight across without flipping', kid: 'Dividing means multiply by the flip of the second fraction.', tip: 'Check with a picture: how many 3/4s fit in 2/3? Fewer than 1, so the answer must be less than 1.', skills: ['fracDiv', 'mixedDiv', 'fracWord'] },
  pointLikeAdding:   { name: 'Keeps one decimal point, like adding', kid: 'When multiplying, count all the decimal places.', tip: 'Estimate first: 2 × 1 is about 2, so 32 can\'t be right.', skills: ['mulDecPlace', 'mulDec'] },
  placesMiscount:    { name: 'Counts decimal places wrong', kid: 'Count the digits after each point and add them.', tip: 'Cover the points, multiply, then count places together.', skills: ['mulDecPlace', 'mulDec'] },
  partialShift:      { name: 'Forgets to shift the second row', kid: 'The tens row starts one place to the left.', tip: 'Write the placeholder zero in the tens row.', skills: ['mulDec', 'mult2digit'] },
  quotientTooSmall:  { name: 'Picks a quotient digit that is too small', kid: 'Your remainder is bigger than the divisor. Another one fits.', tip: 'Compare each remainder with the divisor before moving on.', skills: ['div2', 'divMulti', 'divRem', 'divBy2345', 'divBy6789'] },
  quotientTooBig:    { name: 'Picks a quotient digit that is too big', kid: 'That many is more than you have. Try one less.', tip: 'Estimate with rounded divisors (12 → 10).', skills: ['div2', 'divMulti', 'divRem', 'divBy2345', 'divBy6789'] },
  missingZero:       { name: 'Leaves out a zero in the quotient', kid: 'When the divisor doesn\'t fit, write a 0 before bringing down.', tip: 'Use a place-value chart for the quotient.', skills: ['div2', 'divMulti', 'divToDec', 'divDec2', 'divDec3', 'divBy2345', 'divBy6789'] },
  remainderNotDecimal: { name: 'Stops with a remainder instead of continuing', kid: 'Put a point and a 0 after the number, and keep dividing.', tip: 'Show 7 as 7.00 before starting.', skills: ['divToDec', 'divDec2', 'divDec3'] },
  shiftOneOnly:      { name: 'Moves the point in the divisor but not the dividend', kid: 'Whatever you do to the divisor, do to the dividend.', tip: 'Write both as a fraction, then multiply top and bottom by 100.', skills: ['divDec2', 'divDec3'] },
  pointMisplaced:    { name: 'Puts the quotient\'s point in the wrong place', kid: 'Line the point up straight above the dividend\'s point.', tip: 'Estimate: 0.4 ÷ 1 is about 0.4.', skills: ['divToDec', 'divDec2', 'divDec3'] },
  additiveCompare:   { name: 'Adds instead of multiplying in a "times as many" comparison', kid: '"Times as many" means multiply, not add.', tip: 'Draw a bar for the small amount, then that many copies of it for the big amount.', skills: ['cmpMult', 'cmpWord'] },
  reversedCompare:   { name: 'Puts the numbers the wrong way round in a comparison', kid: 'The bigger amount is the one that is "times as many".', tip: 'Ask which amount is bigger before writing the equation.', skills: ['cmpMult'] },
  moreAsTimes:       { name: 'Multiplies when the story says "more than"', kid: '"More than" adds. "Times as many" multiplies.', tip: 'Compare "3 more than 5" (8) with "3 times as many as 5" (15) side by side.', skills: ['cmpWord'] },
  remainderMeaning:  { name: 'Uses the remainder the wrong way', kid: 'Read the question again: do you need every one, only full groups, or what is left?', tip: 'After dividing, ask what the question wants: round up, drop the remainder, or answer with it.', skills: ['mdWord', 'interpRem'] },
  roundWrong:        { name: 'Rounds in the wrong direction', kid: 'Look at the digit to the right. 5 or more rounds up.', tip: 'Place the number on a number line between the two tens (or hundreds) and see which is closer.', skills: ['estWord', 'roundNum', 'roundPlaces', 'roundWord', 'estProducts'] },
  wrongEquation:     { name: 'Picks an equation that does the steps in the wrong order', kid: 'Tell the story in order, and use parentheses for what happens first.', tip: 'Act out the story and write each step, then join them into one equation.', skills: ['eqWord'] },
  pairsDoubled:      { name: 'Counts each factor pair twice', kid: '3 × 4 and 4 × 3 are the same pair. Count each pair once.', tip: 'List pairs in a T-chart from 1 upward and stop when the pairs start repeating.', skills: ['factorPairs'] },
  notAFactor:        { name: 'Picks a number that isn\'t a factor', kid: 'A factor divides the number with nothing left over.', tip: 'Check with division or skip-counting before choosing.', skills: ['identFactors'] },
  factorMultipleSwap:{ name: 'Mixes up factors and multiples', kid: 'Factors are small and divide in. Multiples are big and come from multiplying.', tip: 'In 3 × 4 = 12, point to the factors (3 and 4) and the multiple (12).', skills: ['identFactors', 'relateFM', 'identMultiples'] },
  notAMultiple:      { name: 'Picks a number that isn\'t a multiple', kid: 'Skip-count to check if you land on it.', tip: 'Skip-count or divide to check for a remainder.', skills: ['identMultiples'] },
  primeMixup:        { name: 'Mixes up prime and composite', kid: 'Prime: only 1 and itself. Try dividing by 3, 5, and 7 too, not just 2.', tip: 'Odd numbers like 21, 27, and 51 are composite. Practice dividing by 3.', skills: ['primeId', 'compositeId', 'primeComp'] },
  oneIsPrime:        { name: 'Thinks 1 is prime', kid: '1 has only one factor, so it is neither prime nor composite.', tip: 'A prime has exactly two factors. 1 has one.', skills: ['primeId', 'compositeId', 'primeComp'] },
  patternWrongRule:  { name: 'Uses the wrong rule for a pattern', kid: 'Check the rule on every step, not just the first one.', tip: 'Have students write the change between each pair of terms.', skills: ['numPatterns', 'shapePatterns'] },
  patternOffByOne:   { name: 'Counts one term too many or too few', kid: 'Count carefully: the first term is number 1.', tip: 'Number the terms in a table (1, 2, 3, …) before extending.', skills: ['numPatterns', 'shapePatterns'] },
  placeValueRegroup: { name: 'Writes counts side by side instead of regrouping', kid: '10 of a place make 1 of the next place. Regroup first.', tip: 'Build it with blocks and trade 10 of a kind for 1 of the next.', skills: ['pvBlocks', 'regroup'] },
  placeValueName:    { name: 'Mixes up the names of places', kid: 'Count places from the right: ones, tens, hundreds, thousands.', tip: 'Label a place-value chart and point to each place while naming it.', skills: ['pvTable', 'digitValue'] },
  digitNotValue:     { name: 'Gives the digit instead of its value', kid: 'The value is the digit times its place: the 4 in 4,302 is worth 4,000.', tip: 'Ask "how much is it worth?" and write the zeros.', skills: ['digitValue', 'expandedForm'] },
  placeOrder:        { name: 'Puts digits in the wrong order', kid: 'Biggest place first for the largest number. A number can\'t start with 0.', tip: 'Sort the digit cards, then place them one by one on a place-value chart.', skills: ['largestSmallest', 'differentForms'] },
  numberWords:       { name: 'Misreads a number in words', kid: 'Say the thousands part, then the hundreds, tens, and ones.', tip: 'Split at the comma and read each group of three.', skills: ['writtenForm'] },
  missingPlaceholder:{ name: 'Leaves out a zero for an empty place', kid: 'Every place needs a digit. An empty place gets a 0.', tip: 'Write expanded parts in a place-value chart so empty places show.', skills: ['differentForms', 'compareForms'] },
  shiftWrong:        { name: 'Moves the digits the wrong number of places', kid: 'Times 10 adds one 0. Divided by 10 takes one 0 away.', tip: 'Use a place-value chart and slide the digits one place.', skills: ['mult10', 'div10', 'mult1by10s', 'estProducts', 'areaMult2', 'partialProd2', 'divPV', 'areaDiv', 'estDiv', 'estQuot'] },
  moreDigitsBigger:  { name: 'Compares by the first digit when the numbers have different lengths', kid: 'Count the digits first. More digits means a bigger number.', tip: 'Line both numbers up on a place-value chart before comparing.', skills: ['compareNums'] },
  compareDigits:     { name: 'Compares the wrong places', kid: 'Start at the left and find the first place where the digits are different.', tip: 'Line the numbers up by place and compare one column at a time from the left.', skills: ['compareNums', 'compareForms'] },
  addFactors:        { name: 'Adds the factors instead of multiplying', kid: 'The area is length times width, not length plus width.', tip: 'Count the squares in a small rectangle to see why it multiplies.', skills: ['areaMult1', 'apSituation', 'rectMeasure', 'apWord', 'apMissing'] },
  distributeWrong:   { name: 'Multiplies only part of the number', kid: 'Every part of the big number gets multiplied.', tip: 'Draw an area model with one box for each place, and multiply every box.', skills: ['distMult'] },
  noCarryMult:       { name: 'Forgets to carry when multiplying', kid: 'Write the ones digit and carry the tens to the next place.', tip: 'Write each carry above the next column and add it after multiplying that column.', skills: ['multRegroup'] },
  partialMissing:    { name: 'Leaves out some of the partial products', kid: 'Every part times every part: 2-digit × 2-digit makes four parts.', tip: 'Use the area model: four boxes, four products, then add them all.', skills: ['areaMult2', 'partialProd2'] },
  compatibleNumber:  { name: 'Picks a number that is hard to divide', kid: 'Pick a close number that the divisor goes into evenly, using a times table fact.', tip: 'List multiples of the divisor times 10 or 100 and pick the one nearest the dividend.', skills: ['estDiv', 'estQuot'] },
  additiveEquiv:     { name: 'Adds the same number to the top and bottom', kid: 'Multiply (or divide) the top and bottom by the same number. Adding changes the size.', tip: 'Show 1/2 and 2/3 (added 1 to both) with fraction bars: they are not equal.', skills: ['eqFracModel', 'eqFracLine', 'eqFrac', 'diffWholes', 'commonDen', 'multFracModel', 'multFracLine', 'multFracWhole'] },
  onlyOneScaled:     { name: 'Changes only the top or only the bottom', kid: 'Whatever you do to the bottom, do to the top.', tip: 'Cut every slice into the same number of pieces: both counts change.', skills: ['eqFrac'] },
  wholesMatter:      { name: 'Forgets that fractions depend on the whole', kid: 'Half of a big pizza is more than half of a small pizza.', tip: 'Compare 1/2 of two different-size paper strips.', skills: ['diffWholes'] },
  benchmarkWrong:    { name: 'Places a fraction on the wrong side of 1/2', kid: 'Half of the bottom number is the middle. Is the top more or less than that?', tip: 'For x/y, compare x with y ÷ 2.', skills: ['cmpBench'] },
  biggerDenBigger:   { name: 'Thinks a bigger denominator means a bigger fraction', kid: 'More slices means smaller slices. Compare with the same denominator.', tip: 'Fold two equal strips into 3 and into 8: which pieces are bigger?', skills: ['cmpVisual', 'cmpBench', 'cmpFrac', 'cmpFracWord'] },
  compareFractions:  { name: 'Compares fractions incorrectly', kid: 'Give both the same denominator, then compare the tops.', tip: 'Rewrite both fractions with a common denominator before comparing.', skills: ['cmpVisual', 'cmpBench', 'cmpFrac'] },
  decomposeSum:      { name: 'Breaks a fraction into parts that don\'t add up', kid: 'The numerators of the parts must add up to the whole numerator.', tip: 'Shade the parts on one fraction bar in two colors.', skills: ['decompVisual', 'decomp'] },
  addDenominators:   { name: 'Adds the denominators too', kid: 'The slices stay the same size. Add only the tops.', tip: '1/4 + 1/4 is two fourths, not 2/8: show it with fraction bars.', skills: ['addLike', 'fracWordAS'] },
  improperWrong:     { name: 'Converts a mixed number wrong', kid: 'Wholes × denominator, then add the numerator.', tip: 'Draw each whole as a full bar of pieces and count all the pieces.', skills: ['mixedImproper', 'multMixedWhole'] },
  regroupTen:        { name: 'Regroups a whole as 10 instead of the denominator', kid: 'One whole is d/d, not 10.', tip: 'A whole pizza cut in 8 is 8/8. Borrow 8/8, not 10.', skills: ['mixedASregroup'] },
  mixedAsParts:      { name: 'Splits a mixed number into parts', kid: 'Turn the mixed number into one fraction first.', tip: 'Rewrite mixed numbers as improper fractions before anything else. 2 1/2 = 5/2.', skills: ['mixedDiv'] },
  multBoth:          { name: 'Multiplies the denominator by the whole number too', kid: 'Only the number of pieces changes. The size of each piece (the bottom) stays the same.', tip: 'Show 3 × 1/4 as three quarter pieces put together: 3/4, not 3/12. Repeated addition makes it clear the denominator stays.', skills: ['multUnitFrac', 'multFracWhole', 'multMixedWhole', 'multFracWord'] },
  wholeOnly:         { name: 'Multiplies only the whole number part of a mixed number', kid: 'Multiply the fraction part too, or change it to an improper fraction first.', tip: 'Write 3 × 2 1/2 as 3 × 2 plus 3 × 1/2 with an area model, or convert to 5/2 before multiplying.', skills: ['multMixedWhole'] },
  tenthsHundredths:  { name: 'Mixes up tenths and hundredths', kid: 'One tenth is ten hundredths. Check which place each digit is in.', tip: 'Shade 0.3 and 0.03 on hundred grids side by side. Name the place out loud: 3 tenths vs 3 hundredths.', skills: ['eqFrac10', 'addFrac10', 'decShown', 'decWords', 'decLine', 'decToFrac'] },
  longerIsBigger:    { name: 'Thinks a decimal with more digits is bigger', kid: 'More digits does not mean bigger. Compare tenths first.', tip: 'Add a zero so both have hundredths (0.5 = 0.50), then compare 50 hundredths with 45 hundredths.', skills: ['cmpDec'] },
  compareDecimals:   { name: 'Compares decimals incorrectly', kid: 'Line up the decimal points and compare from the left.', tip: 'Line up the decimal points, fill empty places with zeros, and compare place by place starting with the ones.', skills: ['cmpDec'] },
  wrongFactor:       { name: 'Uses the wrong number of small units in one big unit', kid: 'Check the fact: how many small units make 1 big unit?', tip: 'Keep a conversion chart handy (1 kg = 1,000 g, 1 lb = 16 oz, 1 ft = 12 in, 1 gal = 4 qt, 1 hr = 60 min) and have students say the fact before multiplying.', skills: ['convMass', 'convVolume', 'convLength', 'convTime', 'moneyWord', 'metricWord', 'customaryWord'] },
  joinedUnits:       { name: 'Writes mixed units side by side instead of converting', kid: '2 feet 5 inches is not 25 inches. Change the feet to inches first.', tip: 'Show 1 hr 20 min on a clock: it is 80 minutes, not 120. Convert the big unit, then add the small unit.', skills: ['convMass', 'convVolume', 'convLength', 'convTime', 'timeWord', 'customaryWord'] },
  forgotSmallPart:   { name: 'Forgets to add the small units after converting', kid: 'You changed the big units. Now add the small units that were already there.', tip: 'Underline both parts of a mixed measurement (3 lb 4 oz) and check off each part as it is used.', skills: ['convMass', 'convVolume', 'convLength', 'convTime', 'timeWord', 'moneyWord', 'metricWord'] },
  rawCompare:        { name: 'Compares the numbers without changing to the same unit', kid: 'Change both to the same unit first. 2 pounds is more than 30 ounces.', tip: 'Ask "same unit?" before every comparison; convert the bigger unit to the smaller one.', skills: ['convMass', 'convVolume', 'convLength', 'convTime'] },
  areaPerimeterSwap: { name: 'Mixes up area and perimeter', kid: 'Area covers the inside (multiply). Perimeter goes around the edge (add the sides).', tip: 'Shade the inside of a rectangle for area and trace the outline for perimeter. Fences and borders go around; soil, grass, and tiles cover.', skills: ['apSituation', 'rectMeasure', 'apMissing', 'apWord'] },
  halfPerimeter:     { name: 'Adds only two sides for the perimeter', kid: 'A rectangle has four sides: two lengths and two widths.', tip: 'Label all four sides before adding, or use 2 × (length + width).', skills: ['apSituation', 'rectMeasure', 'apMissing', 'apWord'] },
  rateUpsideDown:    { name: 'Divides the wrong way for a unit rate', kid: 'Which do you want for 1? Put that amount on the bottom and divide.', tip: 'Say the rate in words first: "dollars per pound" means dollars ÷ pounds. Check that the answer makes sense (a pound of apples doesn\'t cost 25¢ if 4 pounds cost $12).', skills: ['unitRate', 'rateProblems', 'compareRates'] },
  rateSkipUnit:      { name: 'Multiplies the total instead of the price for 1', kid: 'Find the price for 1 first, then multiply by how many you want.', tip: 'Use a double number line or a table with a row for 1.', skills: ['rateProblems'] },
  compareTotals:     { name: 'Compares totals instead of unit rates', kid: 'A bigger total can still be a better deal. Compare the price for 1.', tip: 'Have students find the unit price (or speed) for both before choosing.', skills: ['compareRates'] },
  percentComplement: { name: 'Gives the other part of the whole', kid: 'Read carefully: which part does the question ask about?', tip: 'Shade the part asked for, and check that the two parts add up to 100%.', skills: ['introPercent', 'pctModel', 'benchmarkPct', 'pctEquivalent', 'pctVisual', 'findingPct', 'pctWord'] },
  percentNot100:     { name: 'Uses the count instead of changing it to "out of 100"', kid: 'Percent means out of 100. Make the whole 100 first.', tip: 'Write the fraction, then scale the bottom to 100: 3 out of 5 is 60 out of 100.', skills: ['introPercent', 'pctModel', 'pctConvert', 'pctVisual', 'findingPct', 'pctWord'] },
  fractionDigitsPercent: { name: 'Writes the digits of the fraction as the percent', kid: '3/5 is not 35%. Make the bottom 100.', tip: 'Ask: is 3 out of 5 more or less than half? 35% is less than half, so it can\'t be right.', skills: ['introPercent', 'pctModel', 'pctConvert'] },
  percentShift:      { name: 'Moves the decimal point the wrong number of places', kid: 'Percent to decimal: 2 places left. Decimal to percent: 2 places right.', tip: 'Anchor with 50% = 0.5 = 1/2 and 7% = 0.07.', skills: ['pctConvert', 'pctEquivalent', 'findingPct'] },
  percentAsNumber:   { name: 'Uses the percent as a plain number', kid: '30% of 80 is not 30 × 80. It is 30 hundredths of 80.', tip: 'Change the percent to a decimal or fraction first, and check that the part is smaller than the whole (for percents under 100).', skills: ['benchmarkPct', 'pctEquivalent', 'findingPct'] },
  partWholeSwap:     { name: 'Mixes up the part and the whole', kid: 'Which number is the whole (100%)? Which is the part?', tip: 'Label the tape diagram: the whole is 100%. When the part is known and the whole is missing, the answer must be bigger than the part.', skills: ['pctVisual', 'findingPct', 'pctWord'] }
};

/** Mastery rule shared by game and dashboard: 4+ tries and 75% of the last 8 perfect. */
export type Status = 'new' | 'struggling' | 'practicing' | 'mastered';
export function statusFromRecent(r: string | undefined | null): Status {
  if (!r) return 'new';
  const w = r.slice(-8), p = [...w].filter(c => c === '1').length / w.length;
  if (r.length >= 4 && p >= 0.75) return 'mastered';
  if (p >= 0.5) return 'practicing';
  return 'struggling';
}
