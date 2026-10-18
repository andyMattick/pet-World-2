export interface GameGuideDetail {
  id: string;
  title: string;
  subtitle: string;
  plainEnglishSummary: string;
  realWorldAnalogy: string;
  realWorldBenefit: string;
  brainRegionDetail: {
    name: string;
    code: string;
    functionText: string;
  };
  howToPlaySteps: string[];
  proTips: string[];
  difficultyDetails: Array<{
    name: string;
    description: string;
  }>;
}

export const GAME_GUIDES: Record<string, GameGuideDetail> = {
  'dual-n-back': {
    id: 'dual-n-back',
    title: 'Dual N-Back',
    subtitle: 'Simultaneous Auditory & Visuospatial Working Memory',
    plainEnglishSummary:
      'Dual N-Back is the premier clinical exercise for working memory. Your screen flashes a square on a 3x3 grid while simultaneously playing a spoken/tone letter. Your job is to remember the position and the letter from 1, 2, or 3 turns ago, and hit the match button whenever either one repeats.',
    realWorldAnalogy:
      'Think of it like mental juggling. Your brain has to hold two completely different balls in the air at the exact same time (a visual ball and an auditory ball), dropping the oldest item each time a new one arrives.',
    realWorldBenefit:
      'Directly elevates your fluid intelligence ($G_f$) — your ability to solve novel problems without prior knowledge. In daily life, this helps you hold complex multi-step instructions in your head, remember numbers without writing them down, and stay focused during long meetings.',
    brainRegionDetail: {
      name: 'Dorsolateral Prefrontal Cortex',
      code: 'Brodmann Area 9/46',
      functionText:
        'The prefrontal cortex acts as your brain\'s RAM (random access memory buffer). It holds temporary data online while updating and discarding outdated information.',
    },
    howToPlaySteps: [
      'A glowing square appears in one of 9 grid cells while a letter tone sounds.',
      'Remember both where the square was and what letter tone sounded.',
      'If the CURRENT square position matches the position from N turns ago, press [Position Match] (or key A).',
      'If the CURRENT letter matches the letter from N turns ago, press [Audio Match] (or key L).',
      'Both, either, or neither can match on any given turn. Stay vigilant!',
    ],
    proTips: [
      'Avoid trying to memorize the entire history; only keep the last N items actively in your mind.',
      'Anchor your visual focus on the center square so you can detect peripheral grid flashes without moving your eyes.',
      'If you miss a step, don’t panic or guess — quickly reset your mental count on the next stimulus.',
    ],
    difficultyDetails: [
      { name: '1-Back', description: 'Match with the stimulus from 1 step ago. Perfect for beginners to learn the dual-stream coordination.' },
      { name: '2-Back', description: 'The clinical standard threshold used in neuroplasticity research studies.' },
      { name: '3-Back', description: 'Heavy cognitive load requiring intense prefrontal focus and active buffer purging.' },
    ],
  },

  'stroop-clash': {
    id: 'stroop-clash',
    title: 'Stroop Color Clash',
    subtitle: 'Selective Attention & Interference Inhibition',
    plainEnglishSummary:
      'You are shown a color word like "BLUE", but the font is colored in RED ink. Your brain has spent decades automatically reading words faster than it names colors. Your task is to suppress that automatic impulse and name the INK COLOR as fast as possible.',
    realWorldAnalogy:
      'Like coming to a traffic light that says the word "GO" painted in bright RED letters. Your foot wants to hit the gas because of the word, but your survival instinct must slam the brakes because of the red color.',
    realWorldBenefit:
      'Strengthens impulse control and selective focus. In daily life, this helps you resist grabbing your phone when a notification buzzes, stop yourself before saying something impulsive, and tune out noisy conversations while working.',
    brainRegionDetail: {
      name: 'Anterior Cingulate Cortex',
      code: 'Brodmann Area 24/32',
      functionText:
        'The anterior cingulate cortex is your brain\'s error-monitoring and conflict-resolution engine. It signals when two competing signals clash in the brain.',
    },
    howToPlaySteps: [
      'A large colored word will appear in the center of the arena.',
      'Identify the FONT COLOR (ink color), completely ignoring what the word spells.',
      'Tap the matching color button before the countdown fuse bar runs out.',
      'Build long streaks to earn high synaptic velocity multipliers.',
    ],
    proTips: [
      'Blur your vision slightly or focus on the outline of a single letter to reduce the automatic reading impulse.',
      'Learn the button layout positions so your fingers react without having to search for the button.',
      'Speed matters! Faster correct reactions earn significant score bonuses.',
    ],
    difficultyDetails: [
      { name: 'Standard', description: 'Classic 4-color conflict with generous 2.5s window.' },
      { name: 'Turbo Speed', description: 'Strict 1.6s fuse testing maximum synaptic velocity.' },
      { name: 'Reverse Shift', description: 'Periodically inverts the rule, forcing your brain to switch between naming ink vs reading word.' },
    ],
  },

  'chimp-memory': {
    id: 'chimp-memory',
    title: 'Chimp Spatial Span',
    subtitle: 'Iconic Flash & Ascending Sequential Recall',
    plainEnglishSummary:
      'Numbered squares (1 through 9) appear randomly scattered across a grid. You have a brief moment to look at them. The instant you touch "1", every other number is masked into a blank white box! You must tap the remaining white boxes in exact numerical order (2, 3, 4...) completely from memory.',
    realWorldAnalogy:
      'Taking a mental snapshot of a whiteboard, turning around, and writing down all the items in order from your photographic memory.',
    realWorldBenefit:
      'Trains visual-spatial indexing and short-term iconic retention. Crucial for navigating physical spaces, remembering where you left your keys, and keeping mental track of spatial layouts like blueprints, dashboards, and charts.',
    brainRegionDetail: {
      name: 'Parieto-Occipital & Hippocampal Network',
      code: 'Brodmann Area 7 & CA1',
      functionText:
        'Coordinates spatial mapping in the parietal lobe and immediate episodic encoding in the hippocampus.',
    },
    howToPlaySteps: [
      'Scan the scattered numbers on the 5x5 grid.',
      'Trace a mental path from 1 to 2, 2 to 3, 3 to 4, etc.',
      'Tap "1". Notice that all other numbers immediately turn blank!',
      'Tap the blank squares in ascending order (2, 3, 4...).',
    ],
    proTips: [
      'Group numbers into geometric paths (e.g. "triangle on the left, line on the right") rather than memorizing individual coordinates.',
      'Chunk numbers into pairs (1-2, 3-4, 5-6) before tapping the first square.',
      'Take 1 extra second during the inspection window — haste on the first tap leads to early masking errors.',
    ],
    difficultyDetails: [
      { name: 'Level 1 (5 items)', description: '5 numbers with a gentle preview window.' },
      { name: 'Level 2 (7 items)', description: '7 numbers testing high-capacity iconic retention.' },
      { name: 'Ayumu Master (9 items)', description: '9 numbers matching the world-famous Kyoto University chimpanzee test.' },
    ],
  },

  'trail-making': {
    id: 'trail-making',
    title: 'Trail Making Switch',
    subtitle: 'Frontoparietal Alternating Attention & Search',
    plainEnglishSummary:
      'You are presented with a canvas of scattered circles labeled with numbers and letters. You must connect them in an alternating sequence: 1 connects to A, A connects to 2, 2 connects to B, B connects to 3, and so on, without lifting your eyes.',
    realWorldAnalogy:
      'Like shifting gears in a manual transmission car while driving on a winding road. You must fluidly switch between two mental tracks (numerical order and alphabetical order) without stalling.',
    realWorldBenefit:
      'Measures cognitive flexibility and visual search efficiency. Highly correlated with safe driving, agile multitasking, and avoiding mental "freezes" when juggling different work tasks.',
    brainRegionDetail: {
      name: 'Frontoparietal Control Network',
      code: 'Brodmann Area 8/9/40',
      functionText:
        'Mediates executive task-switching, preventing perseveration (the tendency to get stuck repeating the previous rule).',
    },
    howToPlaySteps: [
      'Look at the active target shown in the top HUD (e.g. "Next: 1", then "Next: A").',
      'Scan the canvas to find the target circle and click it.',
      'Follow the alternating pattern: 1 → A → 2 → B → 3 → C → 4 → D...',
      'Complete the trail as quickly as possible; mistakes add time penalties.',
    ],
    proTips: [
      'While your cursor is clicking the current target, let your peripheral vision scout ahead for the next one.',
      'Whisper the sequence rhythmically to keep your phonological loop engaged.',
    ],
    difficultyDetails: [
      { name: 'Numeric (Part A)', description: 'Pure sequential search (1-12) to test baseline visual scanning speed.' },
      { name: 'Alternating (Part B)', description: 'The clinical gold-standard alternating switch test (1-A-2-B...).' },
    ],
  },

  'speed-calc': {
    id: 'speed-calc',
    title: 'Speed Calculation',
    subtitle: 'Intraparietal Mental Arithmetic & Working Calculation',
    plainEnglishSummary:
      'Rapid-fire math equations appear on screen (like "14 + 19 = 33" or "7 × 8 = 54"). You have under 3 seconds to determine whether the equation is mathematically TRUE or FALSE.',
    realWorldAnalogy:
      'Rapid mental checking at the grocery store register or checking a restaurant receipt. Your brain verifies magnitudes instantaneously without needing paper.',
    realWorldBenefit:
      'Prevents age-related synaptic loss in the parietal computing centers. Strengthens numerical estimation, financial intuition, and working calculation under time pressure.',
    brainRegionDetail: {
      name: 'Left Intraparietal Sulcus & Angular Gyrus',
      code: 'Brodmann Area 39/40',
      functionText:
        'The intraparietal sulcus houses your brain\'s internal "mental number line", encoding numeric magnitude and spatial relationships.',
    },
    howToPlaySteps: [
      'An equation and a displayed result appear on the board.',
      'Perform the mental operation before the fuse runs out.',
      'Click [TRUE] if correct, or [FALSE] if the result has been altered.',
      'Maintain an unbroken streak to trigger high-frequency combo bonuses.',
    ],
    proTips: [
      'Use the "last digit trick": in 34 + 28, 4 + 8 must end in 2. If the shown result ends in 3, it\'s instantly false!',
      'Look for rough magnitude bounds before doing exact division.',
    ],
    difficultyDetails: [
      { name: 'Foundational', description: 'Addition & subtraction within 100 with a 4.0s fuse.' },
      { name: 'Intermediate', description: 'Mixed operations including multiplication with a 3.0s fuse.' },
      { name: 'Expert', description: 'High-speed 4-operation verification under a tight 2.2s fuse.' },
    ],
  },

  'pattern-matrix': {
    id: 'pattern-matrix',
    title: 'Pattern Matrix',
    subtitle: 'Visual Inductive Reasoning & Rule Abstraction',
    plainEnglishSummary:
      'You are shown a 3x3 grid containing 8 visual tiles, with the bottom-right tile left blank. You must analyze how the shapes change across rows and columns (e.g. adding dots, rotating 90°, or changing shading) and select the correct missing tile from 4 choices.',
    realWorldAnalogy:
      'Like being a detective solving a crime. You look at multiple clues across time and space, deduce the hidden underlying rule, and predict what must happen next.',
    realWorldBenefit:
      'Directly exercises inductive logic and non-verbal fluid problem solving. Helps with debugging code, strategic planning, diagnosing vehicle/mechanical issues, and recognizing market trends.',
    brainRegionDetail: {
      name: 'Rostrolateral Prefrontal Cortex',
      code: 'Brodmann Area 10',
      functionText:
        'The highest-level hierarchical hub in the human brain, responsible for relational integration — comparing two distinct rules to form a meta-rule.',
    },
    howToPlaySteps: [
      'Examine the top row from left to right. What changes from tile 1 to tile 2 to tile 3?',
      'Check the columns from top to bottom. Does the same rule hold vertically?',
      'Apply that derived rule to the bottom row to figure out what belongs in the "?" box.',
      'Select the matching candidate tile from choices A, B, C, or D.',
    ],
    proTips: [
      'Break complex tiles down into individual variables: check Shape first, then Count, then Rotation, then Shading.',
      'Eliminate obviously wrong choices first to narrow down your options.',
    ],
    difficultyDetails: [
      { name: 'Single Rule', description: 'One clear transformation (e.g. dot count or 90° rotation).' },
      { name: 'Dual Rule', description: 'Two interacting transformations (e.g. shape edge count + shading cycle).' },
    ],
  },

  'flanker-task': {
    id: 'flanker-task',
    title: 'Signal & Flanker',
    subtitle: 'Foveal Target Focus & Peripheral Noise Suppression',
    plainEnglishSummary:
      'A row of arrows appears on screen (e.g. "← ← → ← ←"). Your job is to focus solely on the CENTER arrow and press Left or Right to match its direction, completely ignoring the surrounding distraction arrows that are trying to trick your brain.',
    realWorldAnalogy:
      'Driving down a busy highway where bright advertising billboards, flashing neon signs, and other cars surround you, but your eyes stay strictly locked on your lane marker.',
    realWorldBenefit:
      'Measures and improves the "Flanker Interference Effect" — your brain\'s ability to filter peripheral visual clutter and suppress premature motor actions.',
    brainRegionDetail: {
      name: 'Pre-Supplementary Motor Area & FEF',
      code: 'Brodmann Area 6/8',
      functionText:
        'Governs eye saccades (rapid eye jumps) and prevents premature muscle trigger pulses before visual verification is complete.',
    },
    howToPlaySteps: [
      'An array of arrows will flash on the crosshairs.',
      'Look strictly at the middle arrow.',
      'Tap [LEFT] or press [←] if the center arrow points left.',
      'Tap [RIGHT] or press [→] if the center arrow points right.',
      'Ignore the flanking side arrows even when they point the opposite way!',
    ],
    proTips: [
      'Lock your eyes onto the crosshairs before each stimulus appears.',
      'Use keyboard arrow keys [←] and [→] for faster reaction latency.',
    ],
    difficultyDetails: [
      { name: 'Standard', description: '5 arrows array with standard presentation interval.' },
      { name: 'Dense Array', description: '7 arrows with wider peripheral distraction wings.' },
    ],
  },

  'word-fluency': {
    id: 'word-fluency',
    title: 'Lexical Fluency',
    subtitle: 'Verbal Phonemic Search & Orthographic Synthesis',
    plainEnglishSummary:
      'You are given a neuroscience clue (e.g. "Microscopic junction across which nerve signals bridge") and a set of scrambled letter tiles. You must rapidly assemble the letters in the correct sequence to spell the target word (e.g. SYNAPSE).',
    realWorldAnalogy:
      'Like having a word on the "tip of your tongue" and training your brain\'s library indexing system to retrieve and assemble the syllables in a fraction of a second.',
    realWorldBenefit:
      'Preserves rapid semantic access and conversational agility. Helps prevent word-finding hesitations and keeps your working vocabulary sharp and accessible as you age.',
    brainRegionDetail: {
      name: 'Left Inferior Frontal Gyrus (Broca\'s Area)',
      code: 'Brodmann Area 44/45',
      functionText:
        'Coordinates the phonological loop, speech production, and syntactic assembly in the dominant left hemisphere.',
    },
    howToPlaySteps: [
      'Read the cognitive semantic clue at the top.',
      'Tap the scrambled letter tiles in the correct sequence to build the word.',
      'Use "Undo Letter" if you make a mistake.',
      'Solve before the timer expires to earn maximum verbal fluency points.',
    ],
    proTips: [
      'Identify vowels and common prefixes/suffixes first (e.g. -ON, -EX, SYN-).',
      'Sound out the syllables in your head to trigger phonological retrieval.',
    ],
    difficultyDetails: [
      { name: 'Core Vocabulary', description: '4-5 letter foundational terms with first-letter cues.' },
      { name: 'Extended Lexicon', description: '6-8 letter neuroscience and cognitive science terminology.' },
    ],
  },

  'corsi-block': {
    id: 'corsi-block',
    title: 'Corsi Block Span',
    subtitle: 'Visuospatial Sequential Path Memory & Trajectory Buffer',
    plainEnglishSummary:
      'A collection of blocks scattered across an irregular surface will light up in a specific sequence. Once the demonstration is finished, your goal is to tap the exact same blocks in the order they lit up (Forward Span) or in reverse order (Reverse Span).',
    realWorldAnalogy:
      'Following a path someone walked through a crowded room or tracing a flight path connecting several airports on a map from visual memory alone.',
    realWorldBenefit:
      'Fortifies non-verbal visuospatial working memory and temporal ordering. In daily life, this helps with navigating new cities without GPS, remembering physical steps in choreography or athletic plays, and spatial planning.',
    brainRegionDetail: {
      name: 'Superior Parietal Lobule & Cerebellar Loops',
      code: 'Brodmann Area 7 & Cerebellum',
      functionText:
        'Encodes spatial coordinates, irregular trajectories, and temporal timing buffers between the parietal cortex and cerebellum.',
    },
    howToPlaySteps: [
      'Watch carefully as blocks illuminate amber one after another.',
      'Remember the physical path and order of illumination.',
      'When the prompt changes to "Reproduce Path", tap the blocks in the identical sequence.',
      'In Reverse mode, tap the last block first and work backwards to the first block.',
    ],
    proTips: [
      'Mentally draw a continuous connect-the-dots line between blocks as they flash.',
      'Chunk blocks into geometric mini-clusters (e.g., "triangle on the left, then two on the right").',
    ],
    difficultyDetails: [
      { name: 'Forward Span', description: 'Reproduce the sequence in identical chronological order.' },
      { name: 'Reverse Span', description: 'Invert the order (tap last block first) for heavy executive loading.' },
      { name: 'Extended Span', description: 'Begins at span length 5 for advanced spatial training.' },
    ],
  },

  'go-no-go': {
    id: 'go-no-go',
    title: 'Go / No-Go Vigilance',
    subtitle: 'Motor Response Inhibition & Continuous Vigilance',
    plainEnglishSummary:
      'Targets flash continuously on screen in rapid rhythm. When you see a GREEN "GO" circle, you must hit [SPACE] or tap the button as fast as lightning. But when a RED "STOP" circle flashes, you must instantly freeze your motor system and suppress the prepared tap.',
    realWorldAnalogy:
      'Driving through city traffic: accelerating smoothly at green lights while being ready to hit the brakes instantly if someone unexpectedly steps off the curb.',
    realWorldBenefit:
      'Strengthens the neural "brake" of the human brain. Drastically cuts down on careless typos, impulsively blurting out thoughts before filtering them, and rushing through critical tasks.',
    brainRegionDetail: {
      name: 'Right Inferior Frontal Gyrus (rIFG)',
      code: 'Brodmann Area 47/44',
      functionText:
        'The definitive biological brake of the brain. When activated, it sends rapid inhibitory signals to the motor cortex to stop an already-prepared muscular movement.',
    },
    howToPlaySteps: [
      'Rest your finger over the spacebar or screen button.',
      'Tap immediately whenever a GREEN circle flashes.',
      'Freeze and withhold your response whenever a RED circle appears.',
      'Maintain continuous concentration across all 30 rapid stimuli.',
    ],
    proTips: [
      'Do not try to hesitate on every trial; maintain a rhythmic "ready-to-tap" state and let the rIFG brake kick in only on red.',
      'A commission error (tapping on red) counts as an instant streak penalty.',
    ],
    difficultyDetails: [
      { name: 'Standard Vigilance', description: '850ms presentation window with 75% Go / 25% No-Go ratio.' },
      { name: 'Rapid Reflex', description: 'Ultra-fast 650ms window pushing inhibitory reaction speed.' },
      { name: 'Rare Target', description: 'Tests vigilance fatigue when stop signals are rare and unexpected.' },
    ],
  },

  'mental-rotation': {
    id: 'mental-rotation',
    title: 'Mental 3D Rotation',
    subtitle: 'Isometric Spatial Transformation & Alignment',
    plainEnglishSummary:
      'You are shown two 3D block structures side by side. The left figure is fixed; the right figure has been rotated by 90, 180, or 270 degrees (and might also be a mirrored imposter). Mentally rotate the right figure in your mind\'s eye to determine whether it is the EXACT SAME shape or a DIFFERENT mirrored shape.',
    realWorldAnalogy:
      'Mentally rotating a piece of furniture in your mind to decide whether it will fit through a doorway before lifting it.',
    realWorldBenefit:
      'Stimulates parietal volumetric processing. Vital for architecture, engineering, medical imaging interpretation, parallel parking, and 3D visual problem-solving.',
    brainRegionDetail: {
      name: 'Superior Parietal Lobule',
      code: 'Brodmann Area 7 (SPL)',
      functionText:
        'Coordinates continuous analog mental rotation and spatial manipulation of 3D volumetric representations.',
    },
    howToPlaySteps: [
      'Examine the reference structure on the left.',
      'Look at the test structure on the right.',
      'Mentally turn and rotate the right structure to align with the left.',
      'Click [SAME] if it matches when rotated, or [DIFFERENT] if it is mirrored or distorted.',
    ],
    proTips: [
      'Pick one distinctive feature (like an L-branch or protruding cube) and track its orientation as you rotate.',
      'Do not rush — spatial rotation takes real biological time proportional to the angle of rotation.',
    ],
    difficultyDetails: [
      { name: 'Standard Angles', description: '90° and 180° rotations of standard tetracube assemblies.' },
      { name: 'Complex Angles', description: '270° and compound rotations requiring multi-axis spatial tracking.' },
    ],
  },

  'card-sorting': {
    id: 'card-sorting',
    title: 'Neuro Card Sort (WCST)',
    subtitle: 'Rule Induction, Set-Shifting & Perseveration Resistance',
    plainEnglishSummary:
      'You are presented with cards displaying colored geometric shapes. Your task is to sort each card into one of four target bins. The computer has a secret rule (e.g., sort by Color, Shape, or Count) that you are NOT told. You must deduce the rule by trial and error. Just when you figure it out, the rule will suddenly shift!',
    realWorldAnalogy:
      'Entering a new job or strategy game where the management rules change every quarter, and you must rapidly notice what\'s working without stubbornly clinging to old habits.',
    realWorldBenefit:
      'Directly trains cognitive flexibility and prevents "perseveration" (repeating mistakes because it worked previously). Helps you adapt smoothly when plans change, pivot strategies, and stay mentally nimble.',
    brainRegionDetail: {
      name: 'Orbitofrontal Cortex & Striatum',
      code: 'Brodmann Area 11 & Caudate',
      functionText:
        'Monitors reward contingencies, detects rule obsolescence, and signals the prefrontal cortex to abandon an outdated behavioral set.',
    },
    howToPlaySteps: [
      'Look at the card at the bottom of the arena.',
      'Tap one of the four reference bins at the top to sort the card.',
      'Watch the feedback badge: "CORRECT" or "INCORRECT".',
      'Use the feedback to figure out whether the active rule is Color, Shape, or Count.',
      'Watch out: after every 5 correct matches, the rule will SHIFT without warning!',
    ],
    proTips: [
      'If your sort is incorrect, immediately change your sorting hypothesis to a different dimension.',
      'Never perseverate: if a rule stops working, do not keep trying it!',
    ],
    difficultyDetails: [
      { name: 'Standard WCST', description: 'Rules shift every 5 consecutive correct matches.' },
      { name: 'Rapid Shift', description: 'Rules shift dynamically every 3-4 matches for high-flexibility demand.' },
    ],
  },
};

