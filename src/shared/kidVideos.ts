/* 🎬 Kid videos: short, kid-friendly YouTube videos she can pick from before practice (docs/KID-VIDEOS.md).
   Owner, Oct 30, 2026: "Khan videos are really boring. I'd rather see a YouTube page of videos especially for kids
   that she can choose from." They show first in Today's video picker (videoGateThen → openVideoPicker in game.js),
   with Khan kept under them as one more choice, and play inside Pet World (youtube-nocookie.com), so watch time counts.

   KID_VIDEO_CATALOG: every video, by its YouTube id. Each one was checked to exist on Oct 30, 2026 with YouTube's
   oEmbed (title and channel below are what it returned; `title` here is shortened for the card).
   KID_VIDEOS: the ids for each lesson, in the order she sees them (2 to 4 each). Keys are the same as lesson_links:
     "math:<shopId>:<stationId>"   a math station, for example "math:cafe:2"
     "<courseId>:<groupId>"        an English, History or Biology lesson block
   Never add an id that wasn't checked. A teacher adds, hides or reorders videos per class (question_edits.videos),
   a family at home in the picker's 🔐 grown-up editor (S.kidVideoEdits); kidVideoList applies those edits. */

export interface KidVideo { id: string; title: string; channel: string }
export interface KidVideoEdit { hide?: string[]; add?: KidVideo[]; order?: string[] }
export type KidVideoEdits = Record<string, KidVideoEdit>
export interface ShownKidVideo extends KidVideo { hidden?: boolean; added?: boolean }

/* id → [short title, channel, title as YouTube reported it] */
export const KID_VIDEO_CATALOG: Record<string, [string, string, string]> = {
  // Ratios and rates
  'xA435umOQuw': ['What are ratios?', 'Math with Mr. J', 'Introduction to Ratios (What Are Ratios?) | Ratio Examples and Answers'],
  'RQ2nYUBVvqI': ['Ratios and rates', 'Math Antics', 'Math Antics - Ratios And Rates'],
  'zTiw-uP8q5w': ['The Ratios Song', 'Numberock', 'Ratios Song | 6th Grade Animated Music Video by NUMBEROCK'],
  'f2kvrjB8AXE': ['Equivalent ratios explained', 'Math with Mr. J', 'Equivalent Ratios Explained | Finding Equivalent Ratios | Math with Mr. J'],
  '3eHhG9qZjz0': ['Double number line diagrams', 'Infinite Math', 'Double Number Line Diagrams | Infinite-Math.com'],
  'irTELw5ZYYY': ['Two-variable relationships: tables and graphs', 'Easy Math with Mrs. Easley', '2 VARIABLE RELATIONSHIPS [Tables and Coordinate Grid Graphing] 6th Grade Math'],
  'VrsDrMsPb8g': ['Unit rates', 'Math with Mr. J', 'Unit Rates | Solving Unit Rate Problems'],
  'dcSYoFFSXQk': ['Unit rate word problems', 'Math with Mr. J', 'Solving Unit Rate Word Problems | Math with Mr. J'],
  // Percents
  'XXf4wHb2lYc': ['Fractions to percents', 'Math with Mr. J', 'Fractions to Percents | Math with Mr. J'],
  '2vjbNZaFz3c': ['Fractions, decimals and percents', 'Math with Mr. J', 'Converting Between Fractions, Decimals, and Percents | A Mini Course | Math with Mr. J'],
  'IYEjOP_-Hpo': ['Find a percent of a number', 'Math with Mr. J', 'How to Find a Percent of a Number | Example #2 | Math with Mr. J'],
  'P7L4_9eim2k': ['Percent problems: find the part', 'Math with Mr. J', 'Solving Percent Problems Using the Percent Equation (Finding the Part) | Math with Mr. J'],
  'YXpZhN6iwXI': ['Percent word problems', 'Math with Mr. J', 'Percent Word Problems | Solving Percent Problems Using the Percent Equation'],
  // Decimals and fractions
  'PnwLv6khwk8': ['Adding and subtracting decimals', 'Math with Mr. J', 'Adding and Subtracting Decimals (How to) | Math with Mr. J'],
  '4LoiWzqvFG4': ['Decimals: add, subtract, multiply, divide', 'Math with Mr. J', 'How to Add, Subtract, Multiply, and Divide Decimals | A Review of Decimals | Math with Mr. J'],
  'fOxNP9nfiSM': ['Divide a fraction by a whole number', 'Math with Mr. J', 'How to Divide a Fraction by a Whole Number | Math with Mr. J'],
  'OSFxuPw2N8w': ['Divide a whole number by a fraction', 'Math with Mr. J', 'Dividing Whole Numbers by Fractions | How to Divide Whole Numbers by Fractions'],
  'RAKwouL-lTc': ['Divide a fraction by a fraction', 'Math with Mr. J', 'How to Divide a Fraction by a Fraction | Math with Mr. J'],
  '7fp1VvFL1vM': ['Dividing mixed numbers', 'Math with Mr. J', 'Dividing Mixed Numbers: A Step-By-Step Review | How to Divide Mixed Numbers | Math with Mr. J'],
  'ONX0k3x6KwM': ['Multiplying decimals', 'Math with Mr. J', 'Multiplying Decimals Explained: A Step-By-Step Review | Understanding Decimal Multiplication'],
  'dGSygRHDE7k': ['Long division with 2-digit divisors', 'Math with Mr. J', 'Long Division with 2-Digit Divisors | Dividing by a 2-Digit Number'],
  'HJYHNxS64f0': ['Long division, step by step', 'Math with Mr. J', 'Long Division: A Step-By-Step Review | How to do Long Division | Math with Mr. J'],
  'Sah_q6YkF5o': ['Dividing decimals by whole numbers', 'Math with Mr. J', 'Dividing Decimals - Whole Number Divisors | 5th Grade Math'],
  'Val4TmjHXRY': ['Divide a decimal by a decimal', 'Math with Mr. J', 'How to Divide a Decimal by a Decimal | Math with Mr. J'],
  'IuUpcCKTJBk': ['Multiplying and dividing decimals', 'Math with Mr. J', 'Multiplying and Dividing Decimals: A Step-By-Step Review | How to Multiply and Divide Decimals'],
  // Exponents and order of operations
  '-zUmvpkhvW8': ['Intro to exponents', 'Math Antics', 'Math Antics - Intro To Exponents (aka Indices)'],
  'B4zejSI8zho': ['Exponents and square roots', 'Math Antics', 'Math Antics - Exponents and Square Roots'],
  'dAgfnK528RA': ['Order of operations', 'Math Antics', 'Math Antics - Order Of Operations'],
  'BdgcItiemoY': ['The Order of Operations Song', 'Silly School Songs', 'The Order of Operations Song (PEMDAS) | Silly School Songs - Educational Math Video'],
  'xLcgug8iEYY': ['Order of operations with exponents', 'Math with Mr. J', 'Order of Operations with Exponents | Math with Mr. J'],
  // Negative numbers and absolute value
  'DDmMfTEbdqE': ['What are integers?', 'Math with Mr. J', 'What are Integers? | Math with Mr. J'],
  'u69pYSdwugo': ['The Integers Song (with absolute value)', 'Numberock', 'Integers Song: With Introduction to Absolute Value'],
  'q4iUbeN7xV4': ['Opposites and absolute value', 'Buffington (Simplifying Math)', 'Opposites and Absolute Value | Simplifying Math'],
  'SuWXNsOK7vE': ['Rational numbers on a number line', 'Math with Mr. J', 'Graphing Rational Numbers on a Number Line | Math with Mr. J'],
  '-ZTF9ffbNwo': ['Compare rational numbers on a number line', 'Math with Mr. J', 'How to Compare Rational Numbers Using a Number Line | Math with Mr. J'],
  'd8Q7w4cZLtk': ['Compare rational numbers', 'Math with Mr. J', 'How to Compare Rational Numbers | With & Without a Number Line | Math with Mr. J'],
  'GJVKUXHiVQc': ['Order rational numbers on a number line', 'Math with Mr. J', 'How to Order Rational Numbers Using a Number Line | Math with Mr. J'],
  'LnfhdtjcpVY': ['What is absolute value?', 'Math with Mr. J', 'What is Absolute Value? | Absolute Value Examples | Math with Mr. J'],
  // Expressions
  '7myEtGPZZjs': ['All about terms', 'Math with Mr. J', 'All About Terms | Identifying, Counting, & Combining | Algebra | Math with Mr. J'],
  'k-KiWkV81fQ': ['Evaluating expressions', 'Math with Mr. J', 'Intro to Evaluating Algebraic Expressions | How to Evaluate Algebraic Expressions | Math with Mr. J'],
  'Fu_TstXlHsE': ['Evaluating expressions with exponents', 'Math with Mr. J', 'Evaluating Algebraic Expressions with Exponents | Math with Mr. J'],
  'GheEHcAvdKA': ['Evaluating expressions with two variables', 'Math with Mr. J', 'Evaluating Expressions with Two Variables: A Step-By-Step Guide | Algebraic Expressions'],
  '4FMDqirfXIs': ['Writing expressions (one operation)', 'Math with Mr. J', 'Writing Algebraic Expressions (One Operation) | Math with Mr. J'],
  'o_Ubm7OI8t4': ['Writing expressions with variables', 'Math with Mr. J', 'Writing Algebraic Expressions | Writing Expressions with Variables | Math with Mr. J'],
  'Y7Xav-XAhXs': ['LCM vs. GCF', 'Math with Mr. J', 'Least Common Multiples vs. Greatest Common Factors (LCM vs. GCF) | Math with Mr. J'],
  'oJo2M6KovGM': ['GCF and LCM: a complete guide', 'Math with Mr. J', 'GCF and LCM | A Complete Guide | Math with Mr. J'],
  'CTw40jSAUx0': ['Intro to the distributive property', 'Math with Mr. J', 'An Intro to the Distributive Property | Simplifying Expressions | Math with Mr. J'],
  'Jkb1-ekHTg4': ['The distributive property, step by step', 'Math with Mr. J', 'The Distributive Property Explained | A Step-By-Step Guide | Algebraic Expressions | Math with Mr. J'],
  'eNv4fHb7OvU': ['Combining like terms', 'Math with Mr. J', 'An Intro to Combining Like Terms | Simplifying Expressions by Combining Like Terms | Math with Mr. J'],
  // Equations and inequalities
  'jZ3_1IUSYGg': ['How to solve one-step equations', 'Math with Mr. J', 'How to Solve One-Step Equations | An Introductory Guide | Algebra'],
  'KUnsabZDGzU': ['One-step equations: adding and subtracting', 'Math with Mr. J', 'How to Solve One-Step Equations (Addition and Subtraction) | Math with Mr. J'],
  '-Xq6lREUm1E': ['Inequalities on a number line', 'Math with Mr. J', 'An Intro to Inequalities on a Number Line | Graphing & Writing | Math with Mr. J'],
  'n02r9ZKAi0I': ['Graphing inequalities', 'Math with Mr. J', 'Graphing Inequalities on Number Lines | Math with Mr. J'],
  'oMBfnV_VsDc': ['Independent and dependent variables', 'Mrs.D Math', 'Independent & Dependent Variables | 6th Grade Math'],
  // Geometry
  'xCdxURXMdFY': ['Area', 'Math Antics', 'Math Antics - Area'],
  'uj6k22WubCk': ['Area of parallelograms', 'Math with Mr. J', 'Area of Parallelograms | How to Find the Area of a Parallelogram'],
  'wv71DpNgW44': ['Area of parallelograms, triangles and trapezoids', 'Easy Math with Mrs. Easley', 'AREA [Parallelograms, Triangles, and Trapezoids] 6th Grade Math'],
  '-ZPfB1uDjEw': ['Area of a triangle', 'Math with Mr. J', 'Finding the Area of a Triangle | A Step-By-Step Guide | Math with Mr. J'],
  'bo483Varm-U': ['Area of composite figures', 'Math with Mr. J', 'Finding the Area of Composite Figures with Triangles | Math with Mr. J'],
  'uc9hWu73Phw': ['The four quadrants', 'Math with Mr. J', 'Quadrants of the Coordinate Plane | What are the Four Quadrants? | Math with Mr. J'],
  'pl9nSVzRWvA': ['Plotting points in all 4 quadrants', 'Math with Mr. J', 'Plotting Points on a Coordinate Plane | All 4 Quadrants'],
  'ePvzgXzkk-Q': ['Area and perimeter on the coordinate plane', 'Eat Pi', 'Area & Perimeter in the Coordinate Plane | Geometry | Eat Pi'],
  '_74Izrb982g': ['Faces, edges and vertices', 'Math with Mr. J', 'Faces, Edges, & Vertices | 5th Grade Math'],
  'HBSLrN9LWBA': ['What’s a net?', 'Math with Mr. J', 'What\'s a Net? | Geometry | Math with Mr. J'],
  'By7sVb2IhFs': ['Volume of rectangular prisms', 'Math with Mr. J', 'Volume of Rectangular Prisms | Math with Mr. J'],
  'qJwecTgce6c': ['Volume', 'Math Antics', 'Math Antics - Volume'],
  'Z05gjC-7lBQ': ['Volume with fractional edge lengths', 'IconMath', 'Volume with Fractional Edge Lengths'],
  'dCD02kuobnY': ['Surface area of a rectangular prism', 'Math with Mr. J', 'How to Find the Surface Area of a Rectangular Prism | Math with Mr. J'],
  // Data and statistics
  'ZQ5cXMx3Db0': ['Frequency tables and dot plots', 'Math with Mr. J', 'Frequency Tables and Dot Plots | Math with Mr. J'],
  'fnJAB4v2HL4': ['Histograms and frequency tables', 'Easy Math with Mrs. Easley', 'HISTOGRAMS [and Frequency Tables] 6th Grade Math'],
  'H7u0Zrra060': ['How to find the mean', 'Math with Mr. J', 'How to Find the Mean | Math with Mr. J'],
  'Y7M_KNwIZvw': ['Finding the median', 'Math with Mr. J', 'Finding the Median | Math with Mr. J'],
  '1aJthSNuJqA': ['The mean from a dot plot', 'Math with Mr. J', 'How to Find the Mean from a Dot Plot | Math with Mr. J'],
  'LeKbUZ954lE': ['Blazer Fresh: Mean, Median, Mode and Range', 'GoNoodle', 'Learn Math With Blazer Fresh - Mean, Median, Mode and Range | Songs For Kids | Sing Along | GoNoodle'],
  'VABsJBw1JqA': ['Interquartile range (IQR)', 'Math with Mr. J', 'Interquartile Range (IQR) | Math with Mr. J'],
  'nV8jR8M8C74': ['Box and whisker plots explained', 'Math with Mr. J', 'Box and Whisker Plots Explained | Understanding Box and Whisker Plots (Box Plots) | Math with Mr. J'],
  'AQsmbvsictA': ['Mean absolute deviation (MAD)', 'Math with Mr. J', 'Mean Absolute Deviation (MAD) | Math with Mr. J'],
  // Biology
  '8vo59AKzU4Q': ['Dr. Binocs: the human cell', 'Peekaboo Kidz', 'HUMAN CELL - The Dr. Binocs Show | Best Learning Videos For Kids | Peekaboo Kidz'],
  'pnBoM4idf1k': ['Flowers and their pollinators', 'SciShow Kids', 'Flowers and Their Pollinators: A Perfect Match! | Spring is Here! | SciShow Kids'],
  'WqgVks9NViQ': ['How do plant seeds travel?', 'SciShow Kids', 'How Do Plant Seeds Travel? | Spring is Here! | SciShow Kids'],
  'ZBZWgrfZFbU': ['Dr. Binocs: the digestive system', 'Peekaboo Kidz', 'Digestive System | The Dr. Binocs Show | Learn Videos For Kids'],
  '1UvuBYUbFk0': ['The digestive system', 'Amoeba Sisters', 'Digestive System'],
  '8m6hHRlKwxY': ['DNA, genes and traits: intro to heredity', 'Amoeba Sisters', 'DNA, Chromosomes, Genes, and Traits: An Intro to Heredity'],
  'eCSIrlk0GTs': ['Who needs dirt? (what plants need)', 'Crash Course Kids', 'Who Needs Dirt?: Crash Course Kids #27.1'],
  'D1Ymc311XS8': ['Dr. Binocs: photosynthesis', 'Peekaboo Kidz', 'Photosynthesis | The Dr. Binocs Show | Learn Videos For Kids'],
  'CMiPYHNNg28': ['Photosynthesis', 'Amoeba Sisters', 'Photosynthesis (UPDATED)'],
  'eJ9Zjc-jdys': ['Cellular respiration', 'Amoeba Sisters', 'Cellular Respiration (UPDATED)'],
  'AHCOzc143Ec': ['Feed me: producers and consumers', 'Crash Course Kids', 'Feed Me: Classifying Organisms - Crash Course Kids #1.2'],
  'sKJoXdrOT70': ['Dr. Binocs: ecosystems', 'Peekaboo Kidz', 'ECOSYSTEM - The Dr. Binocs Show | Best Learning Videos For Kids | Peekaboo Kidz'],
  // History (Crash Course World History is aimed at teens: fast and jokey; a grown-up can hide it per lesson)
  'EHkAGKgoyGo': ['Ancient Mesopotamia for kids', 'Learn Bright', 'Ancient Mesopotamia for Kids | Learn all about the history of ancient Mesopotamia'],
  'sohXPx_XZ6Y': ['Mesopotamia (Crash Course)', 'CrashCourse', 'Mesopotamia: Crash Course World History #3'],
  'zYxC14pCaJ0': ['Ancient Egypt for kids', 'Learn Bright', 'Ancient Egypt for Kids | Learn the History of Ancient Egypt'],
  'Z3Wvw6BivVI': ['Ancient Egypt (Crash Course)', 'CrashCourse', 'Ancient Egypt: Crash Course World History #4'],
  '6LUiHBroEy4': ['The Indus River Valley for kids', 'Bedtime History', 'Indus River Valley Civilization for Kids | Bedtime History'],
  'n7ndRwqJYDM': ['Indus Valley Civilization (Crash Course)', 'CrashCourse', 'Indus Valley Civilization: Crash Course World History #2'],
  'Wo0KujQEJ_s': ['Ancient Rome for kids', 'Learn Bright', 'Ancient Rome for Kids | Learn all about the History of the Roman Empire for Kids'],
  'vfe-eNq-Qyg': ['The Silk Road (Crash Course)', 'CrashCourse', 'The Silk Road and Ancient Trade: Crash Course World History #9'],
  'szxPar0BcMo': ['The Mongols (Crash Course)', 'CrashCourse', 'Wait For It...The Mongols!: Crash Course World History #17'],
  'UC5km6-o2oM': ['The Columbian Exchange (Crash Course)', 'CrashCourse', 'The Columbian Exchange: Crash Course History of Science #16'],
  'FCpqN7GmLYk': ['The Industrial Revolution (Crash Course)', 'CrashCourse', 'The Industrial Revolution: Crash Course History of Science #21'],
  'RBtyaelrgmg': ['World War I for kids', 'Bedtime History', 'World War I for Kids | History Made Easy'],
};

/* each lesson's videos, best first (the picker shows them all, before Khan) */
export const KID_VIDEOS: Record<string, string[]> = {
  // 6th grade math, by station (src/shared/registry.ts SHOPS)
  'math:cafe:1': ['xA435umOQuw', 'RQ2nYUBVvqI', 'zTiw-uP8q5w'],
  'math:cafe:2': ['3eHhG9qZjz0', 'f2kvrjB8AXE', 'zTiw-uP8q5w'],
  'math:cafe:3': ['f2kvrjB8AXE', 'RQ2nYUBVvqI', 'zTiw-uP8q5w'],
  'math:cafe:4': ['irTELw5ZYYY', 'xA435umOQuw', 'RQ2nYUBVvqI'],
  'math:bakery:1': ['PnwLv6khwk8', '4LoiWzqvFG4'],
  'math:bakery:2': ['fOxNP9nfiSM', 'OSFxuPw2N8w'],
  'math:bakery:3': ['RAKwouL-lTc', '7fp1VvFL1vM', 'OSFxuPw2N8w'],
  'math:bakery:4': ['ONX0k3x6KwM', 'dGSygRHDE7k', 'HJYHNxS64f0'],
  'math:bakery:5': ['Sah_q6YkF5o', 'Val4TmjHXRY', 'IuUpcCKTJBk'],
  'math:market:1': ['VrsDrMsPb8g', 'dcSYoFFSXQk', 'RQ2nYUBVvqI'],
  'math:market:2': ['XXf4wHb2lYc', '2vjbNZaFz3c'],
  'math:market:3': ['2vjbNZaFz3c', 'XXf4wHb2lYc', 'IYEjOP_-Hpo'],
  'math:market:4': ['IYEjOP_-Hpo', 'P7L4_9eim2k', 'YXpZhN6iwXI'],
  'math:clock:1': ['-zUmvpkhvW8', 'B4zejSI8zho'],
  'math:clock:2': ['dAgfnK528RA', 'BdgcItiemoY'],
  'math:clock:3': ['xLcgug8iEYY', 'dAgfnK528RA', 'BdgcItiemoY'],
  'math:rink:1': ['DDmMfTEbdqE', 'u69pYSdwugo', 'q4iUbeN7xV4'],
  'math:rink:2': ['SuWXNsOK7vE', '-ZTF9ffbNwo'],
  'math:rink:3': ['-ZTF9ffbNwo', 'd8Q7w4cZLtk'],
  'math:rink:4': ['GJVKUXHiVQc', 'd8Q7w4cZLtk'],
  'math:rink:5': ['LnfhdtjcpVY', 'u69pYSdwugo', 'q4iUbeN7xV4'],
  'math:rink:6': ['LnfhdtjcpVY', 'q4iUbeN7xV4'],
  'math:potion:1': ['7myEtGPZZjs', 'k-KiWkV81fQ', 'Fu_TstXlHsE'],
  'math:potion:2': ['GheEHcAvdKA', 'k-KiWkV81fQ'],
  'math:potion:3': ['4FMDqirfXIs', 'o_Ubm7OI8t4'],
  'math:potion:4': ['Y7Xav-XAhXs', 'oJo2M6KovGM', 'CTw40jSAUx0'],
  'math:potion:5': ['Jkb1-ekHTg4', 'CTw40jSAUx0'],
  'math:potion:6': ['eNv4fHb7OvU', '7myEtGPZZjs'],
  'math:fair:1': ['jZ3_1IUSYGg'],
  'math:fair:2': ['KUnsabZDGzU', 'jZ3_1IUSYGg'],
  'math:fair:3': ['jZ3_1IUSYGg', 'KUnsabZDGzU'],
  'math:fair:4': ['-Xq6lREUm1E', 'n02r9ZKAi0I'],
  'math:fair:5': ['oMBfnV_VsDc', 'irTELw5ZYYY'],
  'math:fair:6': ['irTELw5ZYYY', 'oMBfnV_VsDc'],
  'math:houses:1': ['uj6k22WubCk', 'xCdxURXMdFY', 'wv71DpNgW44'],
  'math:houses:2': ['-ZPfB1uDjEw', 'wv71DpNgW44', 'xCdxURXMdFY'],
  'math:houses:3': ['bo483Varm-U', 'wv71DpNgW44'],
  'math:harbor:1': ['uc9hWu73Phw', 'pl9nSVzRWvA'],
  'math:harbor:2': ['pl9nSVzRWvA', 'ePvzgXzkk-Q'],
  'math:harbor:3': ['ePvzgXzkk-Q', 'pl9nSVzRWvA'],
  'math:post:1': ['_74Izrb982g', 'HBSLrN9LWBA'],
  'math:post:2': ['By7sVb2IhFs', 'Z05gjC-7lBQ', 'qJwecTgce6c'],
  'math:post:3': ['HBSLrN9LWBA', 'dCD02kuobnY'],
  'math:post:4': ['dCD02kuobnY', 'HBSLrN9LWBA'],
  'math:show:1': ['ZQ5cXMx3Db0', 'fnJAB4v2HL4'],
  'math:show:2': ['fnJAB4v2HL4', 'ZQ5cXMx3Db0'],
  'math:show:3': ['H7u0Zrra060', 'Y7M_KNwIZvw', '1aJthSNuJqA', 'LeKbUZ954lE'],
  'math:show:4': ['H7u0Zrra060', 'LeKbUZ954lE'],
  'math:show:5': ['VABsJBw1JqA', 'nV8jR8M8C74', 'AQsmbvsictA'],
  'math:show:6': ['nV8jR8M8C74', 'fnJAB4v2HL4'],
  // Biology (library lesson blocks, "<courseId>:<groupId>")
  'bio1:cells': ['8vo59AKzU4Q'],
  'bio1:plants': ['pnBoM4idf1k', 'WqgVks9NViQ'],
  'bio1:digestion': ['ZBZWgrfZFbU', '1UvuBYUbFk0'],
  'bio2:traits': ['8m6hHRlKwxY'],
  'bio2:growth': ['eCSIrlk0GTs', 'pnBoM4idf1k', 'WqgVks9NViQ'],
  'bio3:photo3': ['D1Ymc311XS8', 'CMiPYHNNg28'],
  'bio3:food3': ['AHCOzc143Ec', 'eJ9Zjc-jdys', 'sKJoXdrOT70'],
  // History (only the lessons with a good match so far; the rest keep Khan)
  'history3:mesopotamia': ['EHkAGKgoyGo', 'sohXPx_XZ6Y'],
  'history3:egyptNubia': ['zYxC14pCaJ0', 'Z3Wvw6BivVI'],
  'history3:ancientIndia': ['6LUiHBroEy4', 'n7ndRwqJYDM'],
  'history4:romeAndHan': ['Wo0KujQEJ_s'],
  'history5:silk5': ['vfe-eNq-Qyg'],
  'history6:mongol6': ['szxPar0BcMo'],
  'history6:columbian6': ['UC5km6-o2oM'],
  'history7:industry7': ['FCpqN7GmLYk'],
  'history8:causes8': ['RBtyaelrgmg'],
  // New units (English 8/9, Butterfly House, Farm Barn): add their keys here (docs/KID-VIDEOS.md)
};

const YT_ID = /^[A-Za-z0-9_-]{11}$/;
export const KID_VIDEO_LIMITS = { added: 6, title: 100, channel: 60, keys: 400 };
const clip = (v: unknown, n: number) => String(v ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n);

/* one class's (or family's) edits for one lesson, cleaned; null when there's nothing usable */
export function cleanKidEdit(raw: unknown): KidVideoEdit | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>, ids = (v: unknown) => Array.isArray(v) ? [...new Set(v.filter(x => typeof x === 'string' && YT_ID.test(x)) as string[])].slice(0, 40) : [];
  const add = Array.isArray(r.add) ? r.add.filter(a => a && typeof a === 'object' && YT_ID.test(String((a as KidVideo).id)))
    .slice(0, KID_VIDEO_LIMITS.added).map(a => ({ id: String((a as KidVideo).id), title: clip((a as KidVideo).title, KID_VIDEO_LIMITS.title) || 'Your teacher’s pick', channel: clip((a as KidVideo).channel, KID_VIDEO_LIMITS.channel) })) : [];
  const out: KidVideoEdit = {}, hide = ids(r.hide), order = ids(r.order);
  if (hide.length) out.hide = hide; if (add.length) out.add = add; if (order.length) out.order = order;
  return Object.keys(out).length ? out : null;
}
export function cleanKidEdits(raw: unknown): KidVideoEdits {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  return Object.fromEntries(Object.entries(raw as Record<string, unknown>).filter(([k]) => k.length <= 80).slice(0, KID_VIDEO_LIMITS.keys)
    .map(([k, v]) => [k, cleanKidEdit(v)]).filter(([, v]) => v)) as KidVideoEdits;
}

/* the videos for one lesson after a class's edits: built-in ones, then added ones, in the edited order.
   includeHidden keeps hidden ones (marked hidden) for the editors. */
export function kidVideoList(key: string, edits?: KidVideoEdits | null, { includeHidden = false } = {}): ShownKidVideo[] {
  const edit = cleanKidEdit(edits?.[key]) || {}, hidden = new Set(edit.hide || []), seen = new Set<string>();
  const list: ShownKidVideo[] = [];
  for (const id of KID_VIDEOS[key] || []) { const c = KID_VIDEO_CATALOG[id]; if (c && !seen.has(id)) { seen.add(id); list.push({ id, title: c[0], channel: c[1] }); } }
  for (const a of edit.add || []) if (!seen.has(a.id)) { seen.add(a.id); list.push({ ...a, added: true }); }
  const rank = new Map((edit.order || []).map((id, i) => [id, i]));
  const sorted = list.map((v, i) => ({ v, i })).sort((a, b) => (rank.get(a.v.id) ?? 1000 + a.i) - (rank.get(b.v.id) ?? 1000 + b.i)).map(x => x.v);
  return sorted.map(v => hidden.has(v.id) ? { ...v, hidden: true } : v).filter(v => includeHidden || !v.hidden);
}

/* the small changes the editors make, each returning the new edits object (the old one is not changed) */
export function kidEditToggle(edits: KidVideoEdits | null | undefined, key: string, id: string): KidVideoEdits {
  const all = cleanKidEdits(edits), e = { ...(all[key] || {}) }, hide = new Set(e.hide || []);
  if (hide.has(id)) hide.delete(id); else hide.add(id);
  e.hide = [...hide]; return tidy(all, key, e);
}
export function kidEditMove(edits: KidVideoEdits | null | undefined, key: string, id: string, step: number): KidVideoEdits {
  const all = cleanKidEdits(edits), ids = kidVideoList(key, all, { includeHidden: true }).map(v => v.id), i = ids.indexOf(id), j = i + step;
  if (i < 0 || j < 0 || j >= ids.length) return all;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  return tidy(all, key, { ...(all[key] || {}), order: ids });
}
export function kidEditAdd(edits: KidVideoEdits | null | undefined, key: string, video: KidVideo): KidVideoEdits {
  const all = cleanKidEdits(edits), e = { ...(all[key] || {}) };
  e.add = [...(e.add || []).filter(a => a.id !== video.id), video].slice(-KID_VIDEO_LIMITS.added);
  return tidy(all, key, e);
}
/* removes a video the teacher added (built-in ones are only hidden) */
export function kidEditRemove(edits: KidVideoEdits | null | undefined, key: string, id: string): KidVideoEdits {
  const all = cleanKidEdits(edits), e = { ...(all[key] || {}) };
  e.add = (e.add || []).filter(a => a.id !== id); e.hide = (e.hide || []).filter(h => h !== id); e.order = (e.order || []).filter(o => o !== id);
  return tidy(all, key, e);
}
export function kidEditReset(edits: KidVideoEdits | null | undefined, key: string): KidVideoEdits {
  const all = cleanKidEdits(edits); delete all[key]; return all;
}
function tidy(all: KidVideoEdits, key: string, e: KidVideoEdit): KidVideoEdits {
  const clean = cleanKidEdit(e); if (clean) all[key] = clean; else delete all[key];
  return all;
}

/* a card's thumbnail (YouTube's still image; no player loads until she picks one) */
export const kidThumb = (id: string) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
