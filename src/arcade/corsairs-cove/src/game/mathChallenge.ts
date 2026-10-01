/**
 * Comprehensive Multi-Operation Math Engine for Corsair's Cove
 * Supports: Addition, Subtraction, Multiplication, Division, and Order of Operations (PEMDAS)
 * Levels 1-10 with pedagogical hints, step-by-step explanations, and live examples.
 */

import { MathConfig, MathOperation } from '../types';
import { getLevelConfig } from './levelProgression';

export interface GeneratedMathProblem {
  challengeNumber: number;
  operation: MathOperation;
  difficultyLevel: number;
  difficultyName: string;
  question: string;
  correctAnswer: number;
  bonusPoints: number;
  explanation: string;
  hint: string;
}

export const OPERATION_META: Record<
  MathOperation,
  {
    label: string;
    symbol: string;
    color: string;
    description: string;
  }
> = {
  ADDITION: {
    label: 'Addition',
    symbol: '+',
    color: '#38bdf8', // sky-400
    description: 'Combining plundered gold & treasure chests',
  },
  SUBTRACTION: {
    label: 'Subtraction',
    symbol: '−',
    color: '#fbbf24', // amber-400
    description: 'Calculating rations, distance & remaining loot',
  },
  MULTIPLICATION: {
    label: 'Multiplication',
    symbol: '×',
    color: '#34d399', // emerald-400
    description: 'Multi-cannon broadsides & fleet flotillas',
  },
  DIVISION: {
    label: 'Division',
    symbol: '÷',
    color: '#a78bfa', // purple-400
    description: 'Dividing treasure fairly among the pirate crew',
  },
  ORDER_OF_OPERATIONS: {
    label: 'Order of Operations',
    symbol: 'PEMDAS',
    color: '#f43f5e', // rose-500
    description: 'Cracking navigational star charts using PEMDAS precedence',
  },
};

export const LEVEL_NAMES: Record<number, string> = {
  1: 'Deckhand (Beginner)',
  2: 'Cabin Mate (Elementary)',
  3: 'Boatswain (Developing)',
  4: 'Gunner (Practiced)',
  5: 'Quartermaster (Intermediate)',
  6: 'Navigator (Advanced)',
  7: 'First Mate (Skilled)',
  8: "Captain's Council (Master)",
  9: 'Fleet Commander (Expert)',
  10: 'Pirate King (Grandmaster)',
};

export const DEFAULT_MATH_CONFIG: MathConfig = {
  operations: ['ADDITION', 'SUBTRACTION', 'MULTIPLICATION', 'DIVISION', 'ORDER_OF_OPERATIONS'],
  minLevel: 1,
  maxLevel: 7,
  timedMode: false,
  timeLimitSeconds: 45,
};

// --- Problem Generators by Operation & Level ---

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 1. ADDITION GENERATOR
function generateAddition(level: number): {
  question: string;
  correctAnswer: number;
  explanation: string;
  hint: string;
} {
  let a = 0;
  let b = 0;
  let c: number | null = null;

  switch (level) {
    case 1:
      // Single digits sums <= 10
      a = randInt(2, 6);
      b = randInt(1, 4);
      break;
    case 2:
      // Single digits sums 11-18
      a = randInt(6, 9);
      b = randInt(5, 9);
      break;
    case 3:
      // 2-digit + 1-digit with carry (e.g. 27 + 6)
      a = randInt(18, 59);
      b = randInt(5, 9);
      break;
    case 4:
      // 2-digit + 2-digit without carry
      a = randInt(21, 54);
      b = randInt(12, 43);
      // adjust to prevent units carry for level 4
      if ((a % 10) + (b % 10) >= 10) {
        b = b - (b % 10) + randInt(0, 9 - (a % 10));
      }
      break;
    case 5:
      // 2-digit + 2-digit with regrouping
      a = randInt(25, 78);
      b = randInt(18, 56);
      if ((a % 10) + (b % 10) < 10) {
        b += 10 - ((a % 10) + (b % 10));
      }
      break;
    case 6:
      // 3-digit + 2-digit
      a = randInt(125, 480);
      b = randInt(35, 95);
      break;
    case 7:
      // 3-digit + 3-digit
      a = randInt(140, 520);
      b = randInt(130, 470);
      break;
    case 8:
      // Three 2-digit numbers
      a = randInt(15, 45);
      b = randInt(15, 45);
      c = randInt(12, 38);
      break;
    case 9:
      // 4-digit addition
      a = randInt(1100, 4500);
      b = randInt(850, 3200);
      break;
    case 10:
    default:
      // Three 3-digit numbers
      a = randInt(120, 360);
      b = randInt(140, 380);
      c = randInt(110, 290);
      break;
  }

  if (c !== null) {
    const sum = a + b + c;
    return {
      question: `${a} + ${b} + ${c}`,
      correctAnswer: sum,
      explanation: `Add the first two numbers: ${a} + ${b} = ${a + b}. Then add the third number: ${a + b} + ${c} = ${sum}.`,
      hint: `Tip: Group ${a} and ${b} first (${a + b}), then add ${c}.`,
    };
  }

  const sum = a + b;
  return {
    question: `${a} + ${b}`,
    correctAnswer: sum,
    explanation:
      level >= 5
        ? `Align by place value: ${a} + ${b}. Add ones: ${(a % 10)} + ${(b % 10)} = ${(a % 10) + (b % 10)}, carry over to tens to get ${sum}.`
        : `Combine ${a} and ${b}: ${a} + ${b} = ${sum}.`,
    hint: `Start by adding the ones digits: ${(a % 10)} + ${(b % 10)}.`,
  };
}

// 2. SUBTRACTION GENERATOR (Ensures positive, integer differences)
function generateSubtraction(level: number): {
  question: string;
  correctAnswer: number;
  explanation: string;
  hint: string;
} {
  let a = 0;
  let b = 0;
  let c: number | null = null;

  switch (level) {
    case 1:
      // Within 10
      a = randInt(4, 10);
      b = randInt(1, a - 1);
      break;
    case 2:
      // Within 20, no regrouping
      a = randInt(13, 19);
      b = randInt(2, (a % 10));
      break;
    case 3:
      // Within 20, with regrouping
      a = randInt(12, 18);
      b = randInt((a % 10) + 1, 9);
      break;
    case 4:
      // 2-digit minus 1-digit with borrowing
      a = randInt(21, 65);
      b = randInt(6, 9);
      if (a % 10 >= b) {
        a = a - (a % 10) + randInt(0, b - 1);
      }
      break;
    case 5:
      // 2-digit minus 2-digit without borrowing
      a = randInt(45, 89);
      b = randInt(11, a - 10);
      if (b % 10 > a % 10) {
        b = b - (b % 10) + randInt(0, a % 10);
      }
      break;
    case 6:
      // 2-digit minus 2-digit with borrowing
      a = randInt(42, 91);
      b = randInt(18, a - 12);
      if (b % 10 <= a % 10) {
        b += (a % 10 - b % 10) + randInt(1, 4);
      }
      if (b >= a) b = a - randInt(7, 19);
      break;
    case 7:
      // 3-digit minus 2-digit
      a = randInt(120, 350);
      b = randInt(35, 95);
      break;
    case 8:
      // 3-digit minus 3-digit
      a = randInt(350, 780);
      b = randInt(140, a - 60);
      break;
    case 9:
      // Subtraction across zeros (e.g. 500 - 168)
      a = randInt(3, 9) * 100;
      b = randInt(115, a - 75);
      break;
    case 10:
    default:
      // Multi-step subtraction (e.g. 240 - 55 - 45)
      a = randInt(180, 450);
      b = randInt(35, 80);
      c = randInt(25, 70);
      if (b + c >= a) {
        a = b + c + randInt(30, 100);
      }
      break;
  }

  if (c !== null) {
    const diff = a - b - c;
    return {
      question: `${a} − ${b} − ${c}`,
      correctAnswer: diff,
      explanation: `First subtract ${b} from ${a}: ${a} − ${b} = ${a - b}. Then subtract ${c}: ${a - b} − ${c} = ${diff}.`,
      hint: `Subtract step-by-step from left to right: ${a} − ${b} = ${a - b}.`,
    };
  }

  const diff = a - b;
  return {
    question: `${a} − ${b}`,
    correctAnswer: diff,
    explanation:
      level >= 4
        ? `Subtract ${b} from ${a}. You can also check by adding back: ${diff} + ${b} = ${a}.`
        : `Start with ${a} and take away ${b}: ${a} − ${b} = ${diff}.`,
    hint: `Think: What number added to ${b} makes ${a}? Or count down from ${a} by ${b}.`,
  };
}

// 3. MULTIPLICATION GENERATOR
function generateMultiplication(level: number): {
  question: string;
  correctAnswer: number;
  explanation: string;
  hint: string;
} {
  let a = 0;
  let b = 0;
  let c: number | null = null;

  switch (level) {
    case 1: {
      // 2s, 5s, 10s facts
      const tables = [2, 5, 10];
      a = tables[randInt(0, tables.length - 1)];
      b = randInt(2, 9);
      break;
    }
    case 2: {
      // 3s and 4s facts
      const tables = [3, 4];
      a = tables[randInt(0, tables.length - 1)];
      b = randInt(3, 9);
      break;
    }
    case 3:
      // 6s, 7s, 8s, 9s times table
      a = randInt(6, 9);
      b = randInt(6, 9);
      break;
    case 4:
      // 11s and 12s facts
      a = randInt(11, 12);
      b = randInt(4, 9);
      break;
    case 5: {
      // 2-digit by 1-digit friendly (e.g. 15 x 4, 25 x 3, 14 x 5)
      const friendly = [12, 14, 15, 16, 20, 24, 25];
      a = friendly[randInt(0, friendly.length - 1)];
      b = randInt(3, 6);
      break;
    }
    case 6:
      // 2-digit by 1-digit with carry (e.g. 36 x 4)
      a = randInt(26, 68);
      b = randInt(4, 7);
      break;
    case 7:
      // Multiples of 10 (e.g. 40 x 7 or 60 x 30)
      a = randInt(2, 8) * 10;
      b = randInt(4, 9);
      break;
    case 8:
      // 2-digit by 2-digit friendly (e.g. 12 x 15)
      a = randInt(12, 18);
      b = randInt(11, 15);
      break;
    case 9:
      // Three single digits (e.g. 3 x 4 x 5)
      a = randInt(2, 5);
      b = randInt(3, 6);
      c = randInt(2, 5);
      break;
    case 10:
    default:
      // Squares & double-digit products (e.g. 15 x 15, 16 x 14)
      a = randInt(14, 22);
      b = randInt(12, 18);
      break;
  }

  if (c !== null) {
    const prod = a * b * c;
    return {
      question: `${a} × ${b} × ${c}`,
      correctAnswer: prod,
      explanation: `Multiply the first two: ${a} × ${b} = ${a * b}. Then multiply by ${c}: ${a * b} × ${c} = ${prod}.`,
      hint: `Multiply ${a} × ${b} = ${a * b} first, then multiply that product by ${c}.`,
    };
  }

  const prod = a * b;
  return {
    question: `${a} × ${b}`,
    correctAnswer: prod,
    explanation:
      level >= 5
        ? `Break apart by place value: ${a} × ${b} = (${Math.floor(a / 10) * 10} × ${b}) + (${a % 10} × ${b}) = ${Math.floor(a / 10) * 10 * b} + ${(a % 10) * b} = ${prod}.`
        : `Think of ${a} groups of ${b}: ${a} × ${b} = ${prod}.`,
    hint:
      level >= 5
        ? `Try breaking ${a} into ${Math.floor(a / 10) * 10} and ${a % 10}, multiply each by ${b}, and add.`
        : `Repeated addition: add ${b} together ${a} times.`,
  };
}

// 4. DIVISION GENERATOR (Guarantees clean, positive integer quotients with 0 remainder)
function generateDivision(level: number): {
  question: string;
  correctAnswer: number;
  explanation: string;
  hint: string;
} {
  let divisor = 2;
  let quotient = 2;

  switch (level) {
    case 1: {
      // Dividing by 2, 5, 10
      const divisors = [2, 5, 10];
      divisor = divisors[randInt(0, divisors.length - 1)];
      quotient = randInt(2, 8);
      break;
    }
    case 2:
      // Dividend up to 36
      divisor = randInt(3, 6);
      quotient = randInt(3, 6);
      break;
    case 3:
      // Times tables facts up to 81 (e.g. 56 / 7, 72 / 8)
      divisor = randInt(6, 9);
      quotient = randInt(6, 9);
      break;
    case 4:
      // Division up to 144 (e.g. 96 / 8 = 12, 84 / 7 = 12)
      divisor = randInt(7, 12);
      quotient = randInt(7, 12);
      break;
    case 5:
      // Friendly 3-digit dividends with 1-digit divisor (e.g. 120 / 6 = 20, 180 / 9 = 20)
      divisor = randInt(3, 9);
      quotient = randInt(12, 25);
      break;
    case 6:
      // 3-digit dividend with exact 2-digit quotient (e.g. 135 / 5 = 27)
      divisor = randInt(4, 8);
      quotient = randInt(21, 45);
      break;
    case 7: {
      // Divisors 10, 20, 25
      const divisors = [10, 20, 25];
      divisor = divisors[randInt(0, divisors.length - 1)];
      quotient = randInt(6, 24);
      break;
    }
    case 8:
      // Larger 3-digit division (e.g. 342 / 6 = 57)
      divisor = randInt(6, 9);
      quotient = randInt(42, 85);
      break;
    case 9: {
      // Double division chain: (Dividend / d1) / d2
      const d1 = randInt(2, 4);
      const d2 = randInt(2, 5);
      const q = randInt(5, 15);
      const dividend = q * d1 * d2;
      return {
        question: `${dividend} ÷ ${d1} ÷ ${d2}`,
        correctAnswer: q,
        explanation: `First divide ${dividend} ÷ ${d1} = ${dividend / d1}. Then divide by ${d2}: ${dividend / d1} ÷ ${d2} = ${q}.`,
        hint: `Divide step-by-step from left: ${dividend} ÷ ${d1} = ${dividend / d1}.`,
      };
    }
    case 10:
    default:
      // 2-digit divisor (e.g. 288 / 12 = 24 or 375 / 15 = 25)
      divisor = randInt(11, 16);
      quotient = randInt(14, 28);
      break;
  }

  const dividend = divisor * quotient;
  return {
    question: `${dividend} ÷ ${divisor}`,
    correctAnswer: quotient,
    explanation: `Think of multiplication in reverse: What number times ${divisor} equals ${dividend}? Because ${divisor} × ${quotient} = ${dividend}, ${dividend} ÷ ${divisor} = ${quotient}.`,
    hint: `Ask yourself: ${divisor} × ? = ${dividend}.`,
  };
}

// 5. ORDER OF OPERATIONS (PEMDAS) GENERATOR
function generateOrderOfOperations(level: number): {
  question: string;
  correctAnswer: number;
  explanation: string;
  hint: string;
} {
  switch (level) {
    case 1: {
      // Multiply then add: a + b * c
      const b = randInt(2, 5);
      const c = randInt(2, 6);
      const a = randInt(3, 9);
      const prod = b * c;
      const ans = a + prod;
      return {
        question: `${a} + ${b} × ${c}`,
        correctAnswer: ans,
        explanation: `Follow PEMDAS: Multiplication comes before Addition!\nStep 1: Multiply ${b} × ${c} = ${prod}.\nStep 2: Add ${a} + ${prod} = ${ans}.`,
        hint: `PEMDAS rule: Do the multiplication (${b} × ${c}) before adding ${a}!`,
      };
    }
    case 2: {
      // Multiply then subtract: a - b * c (positive answer)
      const b = randInt(2, 5);
      const c = randInt(2, 5);
      const prod = b * c;
      const a = prod + randInt(4, 15);
      const ans = a - prod;
      return {
        question: `${a} − ${b} × ${c}`,
        correctAnswer: ans,
        explanation: `Follow PEMDAS: Multiplication before Subtraction!\nStep 1: Multiply ${b} × ${c} = ${prod}.\nStep 2: Subtract ${a} − ${prod} = ${ans}.`,
        hint: `Calculate ${b} × ${c} first, then subtract that result from ${a}.`,
      };
    }
    case 3: {
      // Divide then add: a + b / c
      const c = randInt(2, 6);
      const q = randInt(2, 6);
      const b = c * q;
      const a = randInt(5, 18);
      const ans = a + q;
      return {
        question: `${a} + ${b} ÷ ${c}`,
        correctAnswer: ans,
        explanation: `Follow PEMDAS: Division comes before Addition!\nStep 1: Divide ${b} ÷ ${c} = ${q}.\nStep 2: Add ${a} + ${q} = ${ans}.`,
        hint: `Calculate the division (${b} ÷ ${c}) first!`,
      };
    }
    case 4: {
      // Simple parentheses first: (a + b) * c
      const a = randInt(2, 6);
      const b = randInt(2, 6);
      const c = randInt(3, 5);
      const inside = a + b;
      const ans = inside * c;
      return {
        question: `(${a} + ${b}) × ${c}`,
        correctAnswer: ans,
        explanation: `Follow PEMDAS: Parentheses (P) come FIRST!\nStep 1: Evaluate parentheses (${a} + ${b}) = ${inside}.\nStep 2: Multiply by ${c}: ${inside} × ${c} = ${ans}.`,
        hint: `Always solve inside the parentheses (${a} + ${b}) first!`,
      };
    }
    case 5: {
      // Parentheses with subtraction: (a - b) / c
      const c = randInt(2, 5);
      const q = randInt(3, 7);
      const inside = c * q;
      const b = randInt(4, 12);
      const a = inside + b;
      return {
        question: `(${a} − ${b}) ÷ ${c}`,
        correctAnswer: q,
        explanation: `Follow PEMDAS: Parentheses come FIRST!\nStep 1: Inside parentheses: ${a} − ${b} = ${inside}.\nStep 2: Divide by ${c}: ${inside} ÷ ${c} = ${q}.`,
        hint: `Subtract inside the brackets first (${a} − ${b}), then divide by ${c}.`,
      };
    }
    case 6: {
      // Two multiplications added: a * b + c * d
      const a = randInt(2, 6);
      const b = randInt(2, 6);
      const c = randInt(2, 5);
      const d = randInt(2, 5);
      const p1 = a * b;
      const p2 = c * d;
      const ans = p1 + p2;
      return {
        question: `${a} × ${b} + ${c} × ${d}`,
        correctAnswer: ans,
        explanation: `Follow PEMDAS: Multiply both pairs first before adding!\nStep 1: ${a} × ${b} = ${p1}.\nStep 2: ${c} × ${d} = ${p2}.\nStep 3: Add them together: ${p1} + ${p2} = ${ans}.`,
        hint: `Calculate ${a} × ${b} and ${c} × ${d} separately first, then sum them up.`,
      };
    }
    case 7: {
      // Three terms mixed: a - b * c + d
      const b = randInt(2, 5);
      const c = randInt(3, 5);
      const prod = b * c;
      const a = prod + randInt(8, 25);
      const d = randInt(4, 12);
      const ans = a - prod + d;
      return {
        question: `${a} − ${b} × ${c} + ${d}`,
        correctAnswer: ans,
        explanation: `Follow PEMDAS: Multiply first, then work from left to right for addition and subtraction!\nStep 1: ${b} × ${c} = ${prod}.\nStep 2: ${a} − ${prod} = ${a - prod}.\nStep 3: ${a - prod} + ${d} = ${ans}.`,
        hint: `Multiply ${b} × ${c} first. Then perform subtraction and addition from left to right.`,
      };
    }
    case 8: {
      // Multiplication with parentheses and addition: a * (b - c) + d
      const a = randInt(3, 6);
      const c = randInt(3, 7);
      const diff = randInt(3, 8);
      const b = c + diff;
      const d = randInt(6, 18);
      const p = a * diff;
      const ans = p + d;
      return {
        question: `${a} × (${b} − ${c}) + ${d}`,
        correctAnswer: ans,
        explanation: `Follow PEMDAS:\nStep 1: Parentheses first: ${b} − ${c} = ${diff}.\nStep 2: Multiplication: ${a} × ${diff} = ${p}.\nStep 3: Addition: ${p} + ${d} = ${ans}.`,
        hint: `Parentheses (${b} − ${c}) first, then multiply by ${a}, then add ${d}.`,
      };
    }
    case 9: {
      // Nested division and multiplication: a / (b * c) + d
      const b = randInt(2, 3);
      const c = randInt(2, 4);
      const prod = b * c;
      const q = randInt(3, 8);
      const a = prod * q;
      const d = randInt(5, 15);
      const ans = q + d;
      return {
        question: `${a} ÷ (${b} × ${c}) + ${d}`,
        correctAnswer: ans,
        explanation: `Follow PEMDAS:\nStep 1: Parentheses first: ${b} × ${c} = ${prod}.\nStep 2: Division: ${a} ÷ ${prod} = ${q}.\nStep 3: Addition: ${q} + ${d} = ${ans}.`,
        hint: `Solve inside the parentheses (${b} × ${c}) first, then divide ${a} by that result.`,
      };
    }
    case 10:
    default: {
      // Full PEMDAS expression: a * (b + c) - d / e
      const a = randInt(3, 5);
      const b = randInt(2, 5);
      const c = randInt(2, 5);
      const sum = b + c;
      const prod = a * sum;
      const e = randInt(2, 4);
      const q = randInt(2, 5);
      const d = e * q;
      const ans = prod - q;
      return {
        question: `${a} × (${b} + ${c}) − ${d} ÷ ${e}`,
        correctAnswer: ans,
        explanation: `Follow PEMDAS:\nStep 1: Parentheses (${b} + ${c}) = ${sum}.\nStep 2: Multiply ${a} × ${sum} = ${prod}.\nStep 3: Divide ${d} ÷ ${e} = ${q}.\nStep 4: Subtract: ${prod} − ${q} = ${ans}.`,
        hint: `Parentheses first, then both multiplication and division, then finally subtraction!`,
      };
    }
  }
}

// --- Main Challenge Generator ---

export function generateMathProblem(
  config: MathConfig,
  powerUpsUsedCount: number,
  currentLevel: number = 1
): GeneratedMathProblem {
  const challengeNumber = powerUpsUsedCount + 1;
  const levelConfig = getLevelConfig(currentLevel);

  // If teacher customized min/max, respect boundaries; otherwise align with game level
  const baseLevel = levelConfig.mathDifficultyLevel;
  const minLvl = Math.max(1, Math.min(10, config.minLevel || 1));
  const maxLvl = Math.max(minLvl, Math.min(10, config.maxLevel || 10));

  // Determine difficulty level clamped to the level's curated difficulty
  const difficultyLevel = Math.max(minLvl, Math.min(maxLvl, baseLevel));

  // Preferred operations for this game level, intersected with config operations
  let activeOps = config.operations && config.operations.length > 0 ? config.operations : levelConfig.mathOperations;
  // If user hasn't explicitly restricted operations to a single type, prefer the operations introduced by this level
  const matchingLevelOps = activeOps.filter(op => levelConfig.mathOperations.includes(op));
  if (matchingLevelOps.length > 0) {
    activeOps = matchingLevelOps;
  }
  const operation = activeOps[Math.floor(Math.random() * activeOps.length)] || 'ADDITION';

  const difficultyName = `${LEVEL_NAMES[difficultyLevel] || `Level ${difficultyLevel}`} ${OPERATION_META[operation].label}`;
  const bonusPoints = 150 + (challengeNumber - 1) * 75 + difficultyLevel * 50;

  let generated: {
    question: string;
    correctAnswer: number;
    explanation: string;
    hint: string;
  };

  switch (operation) {
    case 'SUBTRACTION':
      generated = generateSubtraction(difficultyLevel);
      break;
    case 'MULTIPLICATION':
      generated = generateMultiplication(difficultyLevel);
      break;
    case 'DIVISION':
      generated = generateDivision(difficultyLevel);
      break;
    case 'ORDER_OF_OPERATIONS':
      generated = generateOrderOfOperations(difficultyLevel);
      break;
    case 'ADDITION':
    default:
      generated = generateAddition(difficultyLevel);
      break;
  }

  return {
    challengeNumber,
    operation,
    difficultyLevel,
    difficultyName,
    question: generated.question,
    correctAnswer: generated.correctAnswer,
    bonusPoints,
    explanation: generated.explanation,
    hint: generated.hint,
  };
}

// Generate an example problem for a specific operation and level (used in settings preview)
export function getExampleProblem(
  operation: MathOperation,
  level: number
): {
  question: string;
  correctAnswer: number;
  explanation: string;
  levelName: string;
} {
  const safeLvl = Math.max(1, Math.min(10, level));
  let sample: {
    question: string;
    correctAnswer: number;
    explanation: string;
    hint: string;
  };

  switch (operation) {
    case 'SUBTRACTION':
      sample = generateSubtraction(safeLvl);
      break;
    case 'MULTIPLICATION':
      sample = generateMultiplication(safeLvl);
      break;
    case 'DIVISION':
      sample = generateDivision(safeLvl);
      break;
    case 'ORDER_OF_OPERATIONS':
      sample = generateOrderOfOperations(safeLvl);
      break;
    case 'ADDITION':
    default:
      sample = generateAddition(safeLvl);
      break;
  }

  return {
    question: sample.question,
    correctAnswer: sample.correctAnswer,
    explanation: sample.explanation,
    levelName: LEVEL_NAMES[safeLvl],
  };
}
