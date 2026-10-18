import { UserStats, SessionRecord } from '../types/game';

export interface Rolling7DayMetrics {
  // Calendar days
  days: Array<{
    dateStr: string;
    dayLabel: string;
    points: number;
    sessionCount: number;
    isToday: boolean;
  }>;
  
  // Rolling averages
  rollingTotalPoints: number;
  rollingAvgDailyPoints: number; // Mean points per day over the 7 days
  prior7DayAvgPoints: number;    // Mean points per day over days 8-14
  pointsTrendPercent: number;    // % change compared to prior 7-day period

  // Sessions in rolling 7-day window
  rollingSessionsCount: number;
  rollingAvgAccuracy: number;    // Mean accuracy % of all sessions in last 7 days
  priorAvgAccuracy: number;      // Mean accuracy % of sessions in prior 7 days
  accuracyTrendDelta: number;    // e.g. +3.5%

  rollingAvgReactionTimeMs: number; // Mean RT in ms of sessions in last 7 days
  priorAvgReactionTimeMs: number;

  activeDaysInLast7: number;     // e.g. 5 (out of 7)
  adherencePercentage: number;   // e.g. 71%
  totalTrainingMinutes: number;  // Total minutes trained in last 7 days
}

export function computeRolling7DayMetrics(stats: UserStats): Rolling7DayMetrics {
  const now = new Date();
  const sessionHistory = stats.sessionHistory || [];
  const dailyHistory = stats.dailyStimulationHistory || {};

  // Build the 7 days for current rolling window (from 6 days ago up to today)
  const days: Rolling7DayMetrics['days'] = [];
  const todayStr = now.toISOString().split('T')[0];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short' });
    const points = dailyHistory[dateStr] || 0;
    
    // Count sessions on this specific day
    const sessionCount = sessionHistory.filter(s => s.timestamp.startsWith(dateStr)).length;
    
    days.push({
      dateStr,
      dayLabel,
      points,
      sessionCount,
      isToday: dateStr === todayStr,
    });
  }

  // Build the prior 7-day window (days 7 to 13 ago)
  let prior7DaysPointsSum = 0;
  const priorSessions: SessionRecord[] = [];
  const currentWindowSessions: SessionRecord[] = [];

  const msInDay = 24 * 60 * 60 * 1000;
  const nowTime = now.getTime();

  sessionHistory.forEach(sess => {
    const sessTime = new Date(sess.timestamp).getTime();
    const diffDays = (nowTime - sessTime) / msInDay;

    if (diffDays <= 7) {
      currentWindowSessions.push(sess);
    } else if (diffDays > 7 && diffDays <= 14) {
      priorSessions.push(sess);
    }
  });

  for (let i = 13; i >= 7; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    prior7DaysPointsSum += (dailyHistory[dateStr] || 0);
  }

  // Calculations
  const rollingTotalPoints = days.reduce((sum, d) => sum + d.points, 0);
  const rollingAvgDailyPoints = Math.round((rollingTotalPoints / 7) * 10) / 10;
  const prior7DayAvgPoints = Math.round((prior7DaysPointsSum / 7) * 10) / 10;

  let pointsTrendPercent = 0;
  if (prior7DayAvgPoints > 0) {
    pointsTrendPercent = Math.round(((rollingAvgDailyPoints - prior7DayAvgPoints) / prior7DayAvgPoints) * 100);
  } else if (rollingAvgDailyPoints > 0) {
    pointsTrendPercent = 100;
  }

  // Accuracy
  const rollingAvgAccuracy = currentWindowSessions.length > 0
    ? Math.round(currentWindowSessions.reduce((sum, s) => sum + s.accuracy, 0) / currentWindowSessions.length)
    : 0;

  const priorAvgAccuracy = priorSessions.length > 0
    ? Math.round(priorSessions.reduce((sum, s) => sum + s.accuracy, 0) / priorSessions.length)
    : 0;

  const accuracyTrendDelta = priorAvgAccuracy > 0
    ? Math.round((rollingAvgAccuracy - priorAvgAccuracy) * 10) / 10
    : 0;

  // Reaction Time
  const validCurrentRts = currentWindowSessions.map(s => s.reactionTimeMs).filter(rt => rt > 0);
  const rollingAvgReactionTimeMs = validCurrentRts.length > 0
    ? Math.round(validCurrentRts.reduce((sum, rt) => sum + rt, 0) / validCurrentRts.length)
    : 0;

  const validPriorRts = priorSessions.map(s => s.reactionTimeMs).filter(rt => rt > 0);
  const priorAvgReactionTimeMs = validPriorRts.length > 0
    ? Math.round(validPriorRts.reduce((sum, rt) => sum + rt, 0) / validPriorRts.length)
    : 0;

  // Active Days
  const activeDaysInLast7 = days.filter(d => d.points > 0 || d.sessionCount > 0).length;
  const adherencePercentage = Math.round((activeDaysInLast7 / 7) * 100);

  // Total Training Time in minutes
  const totalTrainingMinutes = Math.round(
    currentWindowSessions.reduce((sum, s) => sum + (s.durationSeconds || 0), 0) / 60
  );

  return {
    days,
    rollingTotalPoints,
    rollingAvgDailyPoints,
    prior7DayAvgPoints,
    pointsTrendPercent,
    rollingSessionsCount: currentWindowSessions.length,
    rollingAvgAccuracy,
    priorAvgAccuracy,
    accuracyTrendDelta,
    rollingAvgReactionTimeMs,
    priorAvgReactionTimeMs,
    activeDaysInLast7,
    adherencePercentage,
    totalTrainingMinutes,
  };
}
