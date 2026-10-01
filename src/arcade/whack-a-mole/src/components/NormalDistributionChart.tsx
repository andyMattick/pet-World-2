import React, { useState, useMemo } from 'react';
import { normalPDF, calculateZScore, calculateNormalCDF, getHistogramBins } from '../utils/statistics';
import { DatasetStatistics, MetricType } from '../types/game';

interface NormalDistributionChartProps {
  stats: DatasetStatistics;
  currentScore?: number | null;
  roundLabel?: string;
  showHistogram?: boolean;
  metric?: MetricType;
  onMetricChange?: (metric: MetricType) => void;
  unit?: string;
}

export const NormalDistributionChart: React.FC<NormalDistributionChartProps> = ({
  stats,
  currentScore = null,
  roundLabel = 'Current Round',
  showHistogram = true,
  metric = 'score',
  onMetricChange,
  unit = metric === 'score' ? 'pts' : '%',
}) => {
  const [hoveredX, setHoveredX] = useState<number | null>(null);

  // Metric Titles & Descriptions
  const metricDetails = {
    score: {
      name: 'Score Distribution (Points)',
      unitLabel: 'pts',
      description: 'Total points scored in 30 seconds (including standard +1 and golden +3 hits).',
    },
    hit_pct: {
      name: 'Hit Accuracy % Distribution',
      unitLabel: '%',
      description: 'Percentage of successful mole hits out of all swings attempted.',
    },
    miss_pct: {
      name: 'Miss Rate % Distribution',
      unitLabel: '%',
      description: 'Percentage of swings that missed or struck empty ground.',
    },
  }[metric];

  // Chart dimensions
  const width = 680;
  const height = 290;
  const padding = { top: 36, right: 36, bottom: 48, left: 44 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Dispersion calculation: if count <= 1 or stdDev === 0, use representative spread for visual curve
  const hasMultipleRounds = stats.count >= 2;
  const isZeroVariance = stats.stdDev === 0;
  const effectiveStdDev = stats.stdDev > 0 ? stats.stdDev : Math.max(3, Math.round(stats.mean * 0.15) || 4);

  // Domain range: +/- 3.5 standard deviations from mean
  const domainMin = Math.max(0, Math.floor(stats.mean - 3.5 * effectiveStdDev));
  const domainMax = Math.ceil(stats.mean + 3.5 * effectiveStdDev);
  const domainSpan = domainMax - domainMin || 1;

  // Scale functions
  const scaleX = (val: number) => {
    return padding.left + ((val - domainMin) / domainSpan) * plotWidth;
  };

  const unscaleX = (pixelX: number) => {
    const clamped = Math.max(padding.left, Math.min(width - padding.right, pixelX));
    const ratio = (clamped - padding.left) / plotWidth;
    return domainMin + ratio * domainSpan;
  };

  // Max peak height of the normal PDF
  const maxPdf = useMemo(() => {
    return normalPDF(stats.mean, stats.mean, effectiveStdDev);
  }, [stats.mean, effectiveStdDev]);

  const scaleY = (pdfVal: number) => {
    if (!maxPdf || maxPdf <= 0) return padding.top + plotHeight;
    const ratio = pdfVal / (maxPdf * 1.18);
    return padding.top + plotHeight - ratio * plotHeight;
  };

  // Generate smooth Bell Curve path
  const curvePoints = useMemo(() => {
    if (stats.count === 0) return [];
    const steps = 140;
    const points: { x: number; y: number; val: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      const val = domainMin + (i / steps) * domainSpan;
      const pdf = normalPDF(val, stats.mean, effectiveStdDev);
      points.push({
        val,
        x: scaleX(val),
        y: scaleY(pdf),
      });
    }
    return points;
  }, [domainMin, domainSpan, stats.mean, stats.count, effectiveStdDev, maxPdf]);

  const bellCurvePath = useMemo(() => {
    if (!curvePoints.length) return '';
    return curvePoints.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
    }, '');
  }, [curvePoints]);

  // Shaded area under the curve up to currentScore (Cumulative Density / Percentile)
  const shadedAreaPath = useMemo(() => {
    if (currentScore === null || !curvePoints.length) return '';
    const clampedScore = Math.max(domainMin, Math.min(domainMax, currentScore));
    const scorePixelX = scaleX(clampedScore);

    const filtered = curvePoints.filter((pt) => pt.x <= scorePixelX);
    if (!filtered.length) return '';

    const scorePdf = normalPDF(clampedScore, stats.mean, effectiveStdDev);
    const scoreY = scaleY(scorePdf);

    const baseY = padding.top + plotHeight;
    const startX = curvePoints[0].x;

    let path = `M ${startX},${baseY} L ${filtered[0].x},${filtered[0].y}`;
    for (let i = 1; i < filtered.length; i++) {
      path += ` L ${filtered[i].x},${filtered[i].y}`;
    }
    path += ` L ${scorePixelX},${scoreY} L ${scorePixelX},${baseY} Z`;
    return path;
  }, [currentScore, curvePoints, domainMin, domainMax, stats.mean, effectiveStdDev]);

  // Empirical Histogram Bins
  const histogramBins = useMemo(() => {
    if (!showHistogram || !stats.scores.length || stats.count < 2) return [];
    const binCount = Math.min(Math.max(3, stats.scores.length), 9);
    return getHistogramBins(stats.scores, binCount);
  }, [showHistogram, stats.scores, stats.count]);

  const maxBinPercentage = useMemo(() => {
    if (!histogramBins.length) return 1;
    return Math.max(...histogramBins.map((b) => b.percentage), 1);
  }, [histogramBins]);

  // Active highlighted point
  const activeScore = hoveredX !== null ? hoveredX : currentScore;
  const activeZ =
    activeScore !== null
      ? stats.stdDev > 0
        ? calculateZScore(activeScore, stats.mean, stats.stdDev)
        : 0
      : null;
  const activePercentile =
    activeZ !== null
      ? stats.stdDev > 0
        ? calculateNormalCDF(activeZ)
        : 50.0
      : null;

  // Standard deviation markers: only show spread lines if variance > 0
  const stdMarkers = useMemo(() => {
    if (stats.count === 0) return [];
    if (stats.stdDev === 0) {
      return [{ label: 'μ (Mean)', val: stats.mean, color: 'stroke-amber-400' }];
    }
    const markers = [
      { label: '-2σ', val: stats.mean - 2 * stats.stdDev, color: 'stroke-slate-600' },
      { label: '-1σ', val: stats.mean - stats.stdDev, color: 'stroke-slate-500' },
      { label: 'μ (Mean)', val: stats.mean, color: 'stroke-amber-400' },
      { label: '+1σ', val: stats.mean + stats.stdDev, color: 'stroke-slate-500' },
      { label: '+2σ', val: stats.mean + 2 * stats.stdDev, color: 'stroke-slate-600' },
    ];
    return markers.filter((m) => m.val >= domainMin && m.val <= domainMax);
  }, [stats.mean, stats.stdDev, stats.count, domainMin, domainMax]);

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative space-y-4">
      {/* Top Header & Metric Tabs Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>{metricDetails.name}</span>
            <span className="text-xs font-normal text-slate-400">(N = {stats.count})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Mean μ = <span className="text-amber-400 font-mono font-medium">{stats.mean}{unit}</span> · Std Dev σ ={' '}
            <span className="text-amber-400 font-mono font-medium">{stats.stdDev}{unit}</span>
          </p>
        </div>

        {/* Metric Selector Tabs */}
        {onMetricChange && (
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => onMetricChange('score')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                metric === 'score'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Score (Pts)
            </button>
            <button
              onClick={() => onMetricChange('hit_pct')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                metric === 'hit_pct'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hit % (Accuracy)
            </button>
            <button
              onClick={() => onMetricChange('miss_pct')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                metric === 'miss_pct'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Miss % (Errors)
            </button>
          </div>
        )}
      </div>

      {/* Dataset State Callout for 1 game or zero games */}
      {stats.count === 1 && (
        <div className="px-3.5 py-2 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span>📈</span>
            <span>
              <strong>Round 1 Recorded:</strong> Actual Mean is <strong>{stats.mean}{unit}</strong>. Sample spread (σ) will be computed once you complete Round 2!
            </span>
          </span>
          <span className="text-[11px] font-mono text-amber-400/80 bg-slate-950/60 px-2 py-0.5 rounded border border-amber-500/20">
            N = 1 Round
          </span>
        </div>
      )}

      {/* Empty State when Dataset Has 0 Rounds */}
      {stats.count === 0 ? (
        <div className="py-12 px-6 text-center space-y-3 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
          <span className="text-4xl block">🎯</span>
          <h4 className="text-sm font-semibold text-slate-200">No Rounds in This Dataset Yet</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Play a 30-second game above! Your real mean (μ) will be calculated immediately and will update dynamically every single game you play.
          </p>
        </div>
      ) : (
        /* SVG Canvas */
        <div className="relative overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto select-none"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const mouseX = ((e.clientX - rect.left) / rect.width) * width;
              if (mouseX >= padding.left && mouseX <= width - padding.right) {
                setHoveredX(Number(unscaleX(mouseX).toFixed(1)));
              }
            }}
            onMouseLeave={() => setHoveredX(null)}
          >
          <defs>
            <linearGradient id="curveFillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={metric === 'miss_pct' ? '#F43F5E' : '#10B981'}
                stopOpacity="0.45"
              />
              <stop
                offset="100%"
                stopColor={metric === 'miss_pct' ? '#F43F5E' : '#10B981'}
                stopOpacity="0.05"
              />
            </linearGradient>
            <linearGradient id="curveLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop
                offset="0%"
                stopColor={metric === 'miss_pct' ? '#E11D48' : '#059669'}
              />
              <stop
                offset="50%"
                stopColor={metric === 'miss_pct' ? '#F43F5E' : '#10B981'}
              />
              <stop
                offset="100%"
                stopColor={metric === 'miss_pct' ? '#E11D48' : '#059669'}
              />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Baseline Axis Line */}
          <line
            x1={padding.left}
            y1={padding.top + plotHeight}
            x2={width - padding.right}
            y2={padding.top + plotHeight}
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* Histogram Bars */}
          {showHistogram &&
            histogramBins.map((bin, i) => {
              const binX1 = scaleX(bin.min);
              const binX2 = scaleX(bin.max);
              const binW = Math.max(2, binX2 - binX1);
              const barH = (bin.percentage / (maxBinPercentage * 1.3)) * (plotHeight * 0.75);
              const barY = padding.top + plotHeight - barH;

              return (
                <rect
                  key={i}
                  x={binX1}
                  y={barY}
                  width={binW - 2}
                  height={barH}
                  fill="#334155"
                  opacity="0.3"
                  rx="1"
                />
              );
            })}

          {/* Shaded Cumulative Percentile Area */}
          {shadedAreaPath && (
            <path
              d={shadedAreaPath}
              fill="url(#curveFillGrad)"
              className="transition-all duration-300 ease-out"
            />
          )}

          {/* Bell Curve Line */}
          <path
            d={bellCurvePath}
            fill="none"
            stroke="url(#curveLineGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Standard Deviation Lines */}
          {stdMarkers.map((marker, idx) => {
            const x = scaleX(marker.val);
            const isMean = marker.label.includes('Mean');
            return (
              <g key={idx}>
                <line
                  x1={x}
                  y1={padding.top + 8}
                  x2={x}
                  y2={padding.top + plotHeight}
                  stroke={isMean ? '#F59E0B' : '#475569'}
                  strokeWidth={isMean ? 1.5 : 1}
                  strokeDasharray={isMean ? '4,3' : '2,3'}
                />
                <text
                  x={x}
                  y={padding.top + plotHeight + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fill={isMean ? '#F59E0B' : '#94A3B8'}
                  className="font-mono"
                >
                  {marker.val.toFixed(1)}{unit}
                </text>
                <text
                  x={x}
                  y={padding.top + plotHeight + 28}
                  textAnchor="middle"
                  fontSize="9"
                  fill={isMean ? '#FBBF24' : '#64748B'}
                  className="font-mono font-medium"
                >
                  {marker.label}
                </text>
              </g>
            );
          })}

          {/* Active Score Pin & Flag */}
          {activeScore !== null && (
            <g>
              <line
                x1={scaleX(activeScore)}
                y1={padding.top}
                x2={scaleX(activeScore)}
                y2={padding.top + plotHeight}
                stroke="#F59E0B"
                strokeWidth="2"
                strokeDasharray="3,3"
                filter="url(#glow)"
              />

              <circle
                cx={scaleX(activeScore)}
                cy={scaleY(normalPDF(activeScore, stats.mean, stats.stdDev))}
                r="5.5"
                fill="#F59E0B"
                stroke="#FFFFFF"
                strokeWidth="2"
                filter="url(#glow)"
              />

              <g
                transform={`translate(${Math.min(
                  width - padding.right - 96,
                  Math.max(padding.left + 10, scaleX(activeScore) - 48)
                )}, ${padding.top - 8})`}
              >
                <rect
                  x="0"
                  y="-18"
                  width="96"
                  height="22"
                  rx="5"
                  fill="#0F172A"
                  stroke="#F59E0B"
                  strokeWidth="1.2"
                />
                <text
                  x="48"
                  y="-4"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#FEF08A"
                  className="font-mono font-bold"
                >
                  {activeScore}{unit}
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>
      )}

      {/* Dynamic Statistical Readout Deck */}
      {activeScore !== null && activeZ !== null && activePercentile !== null && (
        <div className="pt-2 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
              {metric === 'score' ? 'Score (X)' : metric === 'hit_pct' ? 'Hit % (X)' : 'Miss % (X)'}
            </span>
            <span className="text-lg font-bold font-mono text-slate-100">
              {activeScore}{unit}
            </span>
          </div>

          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Mean (μ)</span>
            <span className="text-lg font-bold font-mono text-amber-400">
              {stats.mean}{unit}
            </span>
          </div>

          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Z-Score (z)</span>
            <span
              className={`text-lg font-bold font-mono ${
                metric === 'miss_pct'
                  ? activeZ <= 0
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                  : activeZ >= 0
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}
            >
              {activeZ >= 0 ? `+${activeZ.toFixed(2)}` : activeZ.toFixed(2)}
            </span>
          </div>

          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Percentile</span>
            <span className="text-lg font-bold font-mono text-emerald-400">
              {activePercentile}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
