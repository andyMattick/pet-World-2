import { DatasetStatistics, MetricType } from '../types/game';

// Calibrated predefined normative dataset representing 100 previous 30-second Whack-a-Mole rounds
// from human benchmark trials. Mean ≈ 24.2, StdDev ≈ 5.2.
export const DEFAULT_PREDEFINED_SCORES: number[] = [
  12, 14, 15, 16, 16, 17, 17, 18, 18, 18,
  19, 19, 19, 20, 20, 20, 20, 21, 21, 21,
  21, 22, 22, 22, 22, 22, 23, 23, 23, 23,
  23, 24, 24, 24, 24, 24, 24, 24, 25, 25,
  25, 25, 25, 25, 26, 26, 26, 26, 26, 26,
  26, 27, 27, 27, 27, 27, 27, 28, 28, 28,
  28, 28, 29, 29, 29, 29, 30, 30, 30, 30,
  31, 31, 31, 31, 32, 32, 32, 33, 33, 33,
  34, 34, 34, 35, 35, 36, 36, 37, 37, 38,
  15, 17, 19, 21, 23, 25, 27, 29, 31, 35,
];

// Predefined benchmark Hit Percentage (%) distribution for 100 human trials (Mean ≈ 84.6%, StdDev ≈ 7.8%)
export const DEFAULT_PREDEFINED_HIT_PERCENTAGES: number[] = [
  62.5, 66.7, 70.0, 71.4, 72.0, 73.3, 74.1, 75.0, 75.8, 76.5,
  77.1, 77.8, 78.6, 79.2, 80.0, 80.0, 80.8, 81.3, 81.8, 82.1,
  82.6, 83.3, 83.3, 83.9, 84.0, 84.4, 84.6, 85.0, 85.2, 85.7,
  85.7, 86.2, 86.4, 86.7, 87.0, 87.1, 87.5, 87.9, 88.0, 88.2,
  88.5, 88.9, 89.3, 89.7, 90.0, 90.0, 90.3, 90.5, 90.9, 91.2,
  91.4, 91.7, 92.0, 92.3, 92.6, 92.9, 93.1, 93.3, 93.8, 94.1,
  94.4, 94.7, 95.0, 95.2, 95.5, 95.8, 96.0, 96.3, 96.6, 96.9,
  97.1, 97.4, 97.7, 98.0, 98.2, 98.5, 76.0, 78.0, 81.0, 82.5,
  84.0, 85.5, 86.5, 87.5, 88.5, 89.5, 90.5, 91.5, 92.5, 93.5,
  68.0, 73.0, 77.0, 80.5, 83.5, 86.0, 88.0, 91.0, 94.0, 97.0,
];

// Predefined benchmark Miss Percentage (%) distribution for 100 human trials (Mean ≈ 15.4%, StdDev ≈ 7.8%)
export const DEFAULT_PREDEFINED_MISS_PERCENTAGES: number[] = DEFAULT_PREDEFINED_HIT_PERCENTAGES.map(
  (hitPct) => Number((100 - hitPct).toFixed(1))
);

/**
 * Calculates arithmetic mean (average)
 */
export function calculateMean(numbers: number[]): number {
  if (!numbers.length) return 0;
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  return sum / numbers.length;
}

/**
 * Calculates sample standard deviation
 */
export function calculateStdDev(numbers: number[], isSample: boolean = true): number {
  if (numbers.length <= 1) return 0;
  const mean = calculateMean(numbers);
  const squaredDiffs = numbers.map(val => Math.pow(val - mean, 2));
  const sumSquaredDiffs = squaredDiffs.reduce((acc, val) => acc + val, 0);
  const divisor = isSample ? numbers.length - 1 : numbers.length;
  return Math.sqrt(sumSquaredDiffs / divisor);
}

/**
 * Calculates standard Z-score: z = (x - μ) / σ
 */
export function calculateZScore(score: number, mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  return (score - mean) / stdDev;
}

/**
 * Calculates empirical percentile rank within a dataset:
 * Percentile = [ (count < score) + 0.5 * (count == score) ] / N * 100
 */
export function calculateEmpiricalPercentile(score: number, dataset: number[]): number {
  if (!dataset.length) return 50;
  let strictlyLess = 0;
  let equalTo = 0;

  for (const val of dataset) {
    if (val < score) strictlyLess++;
    else if (Math.abs(val - score) < 0.05) equalTo++;
  }

  const percentile = ((strictlyLess + 0.5 * equalTo) / dataset.length) * 100;
  return Math.min(99.9, Math.max(0.1, Number(percentile.toFixed(1))));
}

/**
 * High-precision approximation of the standard normal cumulative distribution function Φ(z)
 * Uses Abramowitz and Stegun approximation for erf(x)
 */
export function calculateNormalCDF(z: number): number {
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.sqrt(2);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  const erf = sign * y;

  const cdf = 0.5 * (1.0 + erf);
  return Math.min(99.9, Math.max(0.1, Number((cdf * 100).toFixed(1))));
}

/**
 * Normal Probability Density Function (Bell Curve height)
 * f(x) = (1 / (σ * √(2π))) * e^(-0.5 * ((x - μ) / σ)^2)
 */
export function normalPDF(x: number, mean: number, stdDev: number): number {
  if (stdDev <= 0) return 0;
  const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
}

/**
 * Full summary statistics of a dataset
 */
export function calculateDatasetStatistics(scores: number[]): DatasetStatistics {
  if (!scores.length) {
    return {
      scores: [],
      count: 0,
      mean: 0,
      stdDev: 0,
      variance: 0,
      min: 0,
      max: 0,
      median: 0,
      q1: 0,
      q3: 0,
    };
  }

  const sorted = [...scores].sort((a, b) => a - b);
  const count = sorted.length;
  const mean = calculateMean(sorted);
  const stdDev = calculateStdDev(sorted, true);
  const variance = Math.pow(stdDev, 2);
  const min = sorted[0];
  const max = sorted[count - 1];

  const getPercentileValue = (p: number) => {
    const idx = (count - 1) * p;
    const lower = Math.floor(idx);
    const upper = Math.ceil(idx);
    const weight = idx - lower;
    if (lower === upper) return sorted[lower];
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  };

  const median = getPercentileValue(0.5);
  const q1 = getPercentileValue(0.25);
  const q3 = getPercentileValue(0.75);

  return {
    scores: sorted,
    count,
    mean: Number(mean.toFixed(2)),
    stdDev: Number(stdDev.toFixed(2)),
    variance: Number(variance.toFixed(2)),
    min,
    max,
    median: Number(median.toFixed(2)),
    q1: Number(q1.toFixed(2)),
    q3: Number(q3.toFixed(2)),
  };
}

/**
 * Groups scores into histogram bins
 */
export function getHistogramBins(scores: number[], binCount: number = 8) {
  if (!scores.length) return [];
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = max - min || 1;
  const binWidth = Math.ceil((range / binCount) * 10) / 10 || 1;

  const bins: { rangeLabel: string; min: number; max: number; count: number; percentage: number }[] = [];

  for (let i = 0; i < binCount; i++) {
    const bMin = Number((min + i * binWidth).toFixed(1));
    const bMax = Number((bMin + binWidth).toFixed(1));
    bins.push({
      rangeLabel: `${bMin}–${bMax}`,
      min: bMin,
      max: bMax,
      count: 0,
      percentage: 0,
    });
  }

  for (const score of scores) {
    for (let i = 0; i < bins.length; i++) {
      if (score >= bins[i].min && (i === bins.length - 1 ? score <= bins[i].max + 0.05 : score < bins[i].max)) {
        bins[i].count++;
        break;
      }
    }
  }

  for (const b of bins) {
    b.percentage = Number(((b.count / scores.length) * 100).toFixed(1));
  }

  return bins;
}
