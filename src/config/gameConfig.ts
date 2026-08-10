import type {
  DifficultyConfig,
  GameModeConfig,
  ProximityConfig,
  StreakMultiplierTier,
  DailyChallenge,
} from '../types';

export const DIFFICULTIES: Record<string, DifficultyConfig> = {
  easy: {
    id: 'easy',
    label: 'Easy',
    min: 1,
    max: 50,
    maxAttempts: 10,
    scoreMultiplier: 1,
    lives: 3,
  },
  medium: {
    id: 'medium',
    label: 'Medium',
    min: 1,
    max: 100,
    maxAttempts: 8,
    scoreMultiplier: 1.5,
    lives: 3,
  },
  hard: {
    id: 'hard',
    label: 'Hard',
    min: 1,
    max: 500,
    maxAttempts: 10,
    scoreMultiplier: 2,
    lives: 3,
  },
  insane: {
    id: 'insane',
    label: 'Insane',
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
    label: 'Classic',
    description: 'Find the secret number with limited attempts.',
    icon: '🎯',
    usesAttempts: true,
    usesLives: false,
    usesTimer: false,
  },
  timeAttack: {
    id: 'timeAttack',
    label: 'Time Attack',
    description: 'Find as many numbers as you can in 60 seconds!',
    icon: '⏱️',
    usesAttempts: false,
    usesLives: false,
    usesTimer: true,
    timerSeconds: 60,
    timePenaltySeconds: 3,
  },
  streak: {
    id: 'streak',
    label: 'Streak',
    description: 'Build the longest correct streak possible.',
    icon: '🔥',
    usesAttempts: false,
    usesLives: true,
    usesTimer: false,
  },
  challenge: {
    id: 'challenge',
    label: 'Challenge',
    description: 'Complete the daily challenge for bonus XP.',
    icon: '🏅',
    usesAttempts: true,
    usesLives: false,
    usesTimer: false,
  },
};

export const PROXIMITY_LEVELS: ProximityConfig[] = [
  { id: 'veryClose', label: 'Very Close!', emoji: '🔥', threshold: 0.05 },
  { id: 'warm', label: 'Getting Warm', emoji: '🙂', threshold: 0.15 },
  { id: 'far', label: 'Getting Colder', emoji: '🌡️', threshold: 0.35 },
  { id: 'veryFar', label: 'Very Far', emoji: '❄️', threshold: 1 },
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
    { description: 'Guess the number in 5 attempts.', maxAttempts: 5, difficulty: 'medium' as const, noHints: false },
    { description: 'Find 3 numbers without using hints.', maxAttempts: 8, difficulty: 'easy' as const, noHints: true },
    { description: 'Beat Insane mode in 7 attempts.', maxAttempts: 7, difficulty: 'insane' as const, noHints: false },
    { description: 'Guess correctly on your first try.', maxAttempts: 1, difficulty: 'easy' as const, noHints: true },
  ];
  const variant = variants[seed % variants.length];
  return {
    id: `daily-${dateStr}`,
    date: dateStr,
    ...variant,
    xpReward: 250,
  };
}
