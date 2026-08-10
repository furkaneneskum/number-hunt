import type {
  DifficultyConfig,
  GameModeConfig,
  ProximityConfig,
  StreakMultiplierTier,
  DailyChallenge,
} from '../types';
import { tr } from '../i18n/tr';

export const DIFFICULTIES: Record<string, DifficultyConfig> = {
  easy: {
    id: 'easy',
    label: tr.difficulties.easy,
    min: 1,
    max: 50,
    maxAttempts: 10,
    scoreMultiplier: 1,
    lives: 3,
  },
  medium: {
    id: 'medium',
    label: tr.difficulties.medium,
    min: 1,
    max: 100,
    maxAttempts: 8,
    scoreMultiplier: 1.5,
    lives: 3,
  },
  hard: {
    id: 'hard',
    label: tr.difficulties.hard,
    min: 1,
    max: 500,
    maxAttempts: 10,
    scoreMultiplier: 2,
    lives: 3,
  },
  insane: {
    id: 'insane',
    label: tr.difficulties.insane,
    min: 1,
    max: 1000,
    maxAttempts: 7,
    scoreMultiplier: 3,
    lives: 3,
  },
};

export const GAME_MODES: Record<string, GameModeConfig> = {
  classic: {
    id: 'classic',
    label: tr.modes.classic.label,
    description: tr.modes.classic.description,
    icon: '🎯',
    usesAttempts: true,
    usesLives: false,
    usesTimer: false,
  },
  timeAttack: {
    id: 'timeAttack',
    label: tr.modes.timeAttack.label,
    description: tr.modes.timeAttack.description,
    icon: '⏱️',
    usesAttempts: false,
    usesLives: false,
    usesTimer: true,
    timerSeconds: 60,
    timePenaltySeconds: 3,
  },
  streak: {
    id: 'streak',
    label: tr.modes.streak.label,
    description: tr.modes.streak.description,
    icon: '🔥',
    usesAttempts: false,
    usesLives: true,
    usesTimer: false,
  },
  challenge: {
    id: 'challenge',
    label: tr.modes.challenge.label,
    description: tr.modes.challenge.description,
    icon: '🏅',
    usesAttempts: true,
    usesLives: false,
    usesTimer: false,
  },
};

export const PROXIMITY_LEVELS: ProximityConfig[] = [
  { id: 'veryClose', label: tr.proximity.veryClose, emoji: '🔥', threshold: 0.05 },
  { id: 'warm', label: tr.proximity.warm, emoji: '🙂', threshold: 0.15 },
  { id: 'far', label: tr.proximity.far, emoji: '🌡️', threshold: 0.35 },
  { id: 'veryFar', label: tr.proximity.veryFar, emoji: '❄️', threshold: 1 },
];

export const STREAK_MULTIPLIERS: StreakMultiplierTier[] = [
  { minStreak: 20, multiplier: 3 },
  { minStreak: 10, multiplier: 2 },
  { minStreak: 5, multiplier: 1.5 },
  { minStreak: 1, multiplier: 1 },
];

export const SCORING = {
  baseScores: [500, 400, 300, 250, 200, 150, 100, 75, 50, 25],
  minScore: 25,
  hintPenalty: 50,
  timeAttackBase: 100,
  xpPerCorrect: 100,
  xpPerChallenge: 250,
  xpPerStreakBonus: 25,
};

export const XP_LEVELS = {
  baseXp: 500,
  multiplier: 1.4,
};

export const HINT_TYPES = ['parity', 'range', 'divisible'] as const;

export function getXpForLevel(level: number): number {
  return Math.floor(XP_LEVELS.baseXp * Math.pow(XP_LEVELS.multiplier, level - 1));
}

export function getTotalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getXpForLevel(i);
  }
  return total;
}

export function getLevelFromXp(xp: number): number {
  let level = 1;
  let totalNeeded = 0;
  while (true) {
    const needed = getXpForLevel(level);
    if (totalNeeded + needed > xp) break;
    totalNeeded += needed;
    level++;
  }
  return level;
}

export function getStreakMultiplier(streak: number): number {
  for (const tier of STREAK_MULTIPLIERS) {
    if (streak >= tier.minStreak) return tier.multiplier;
  }
  return 1;
}

export function generateDailyChallenge(date: Date): DailyChallenge {
  const dateStr = date.toISOString().slice(0, 10);
  const seed = dateStr.split('-').reduce((a, b) => a + parseInt(b, 10), 0);
  const variants = [
    { description: tr.dailyChallenges.fiveAttempts, maxAttempts: 5, difficulty: 'medium' as const, noHints: false },
    { description: tr.dailyChallenges.noHints, maxAttempts: 8, difficulty: 'easy' as const, noHints: true },
    { description: tr.dailyChallenges.insaneSeven, maxAttempts: 7, difficulty: 'insane' as const, noHints: false },
    { description: tr.dailyChallenges.firstTry, maxAttempts: 1, difficulty: 'easy' as const, noHints: true },
  ];
  const variant = variants[seed % variants.length];
  return {
    id: `daily-${dateStr}`,
    date: dateStr,
    ...variant,
    xpReward: 250,
  };
}
