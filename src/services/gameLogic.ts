import {
  DIFFICULTIES,
  GAME_MODES,
  PROXIMITY_LEVELS,
  SCORING,
  getStreakMultiplier,
  getLevelFromXp,
  getXpForLevel,
  generateDailyChallenge,
} from '../config/gameConfig';
import { tr } from '../i18n/tr';
import type {
  DifficultyId,
  GameModeId,
  GameState,
  GuessFeedback,
  GuessResult,
  ProximityLevel,
  HintResult,
  GameEndResult,
  PlayerData,
  DailyChallenge,
} from '../types';

export function generateSecretNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getProximity(guess: number, secret: number, min: number, max: number): ProximityLevel {
  const range = max - min;
  const diff = Math.abs(guess - secret);
  const ratio = diff / range;

  for (const level of PROXIMITY_LEVELS) {
    if (ratio <= level.threshold) return level.id;
  }
  return 'veryFar';
}

export function getProximityInfo(level: ProximityLevel) {
  return PROXIMITY_LEVELS.find((p) => p.id === level)!;
}

export function createGameState(
  mode: GameModeId,
  difficulty: DifficultyId,
  challenge?: DailyChallenge
): GameState {
  const diffConfig = DIFFICULTIES[difficulty];
  const modeConfig = GAME_MODES[mode];
  const min = diffConfig.min;
  const max = diffConfig.max;

  let maxAttempts = diffConfig.maxAttempts;
  if (mode === 'challenge' && challenge) {
    maxAttempts = challenge.maxAttempts;
  }

  const secret = generateSecretNumber(min, max);

  return {
    mode,
    difficulty,
    secretNumber: secret,
    attempts: 0,
    maxAttempts,
    guesses: [],
    score: 0,
    streak: 0,
    sessionStreak: 0,
    timeRemaining: modeConfig.usesTimer ? (modeConfig.timerSeconds ?? 60) : null,
    hintsUsed: 0,
    hintsAvailable: ['parity', 'range', 'divisible'],
    gameStatus: 'playing',
    lives: diffConfig.lives ?? 3,
    maxLives: diffConfig.lives ?? 3,
    roundScore: 0,
    roundXp: 0,
    hintsUsedThisRound: false,
    wrongGuessesThisRound: 0,
    timeAttackCorrect: 0,
    peakSessionStreak: 0,
    challengeNoHints: challenge?.noHints ?? false,
    startTime: Date.now(),
  };
}

export function validateGuess(
  value: string,
  min: number,
  max: number,
  previousGuesses: number[]
): { valid: boolean; number?: number; error?: string; isDuplicate?: boolean } {
  const trimmed = value.trim();
  if (!trimmed) {
    return { valid: false, error: tr.feedback.invalidRange(min, max) };
  }

  const num = Number(trimmed);
  if (!Number.isInteger(num) || !Number.isFinite(num)) {
    return { valid: false, error: tr.feedback.invalidRange(min, max) };
  }

  if (num < min || num > max) {
    return { valid: false, error: tr.feedback.invalidRange(min, max) };
  }

  if (previousGuesses.includes(num)) {
    return { valid: false, error: tr.feedback.duplicateGuess(num), isDuplicate: true };
  }

  return { valid: true, number: num };
}

function getResultFeedback(result: GuessResult): Pick<GuessFeedback, 'message' | 'subMessage' | 'emoji'> {
  switch (result) {
    case 'correct':
      return { message: tr.feedback.correct, subMessage: tr.feedback.correctSub, emoji: '🎉' };
    case 'tooLow':
      return { message: tr.feedback.tooLow, subMessage: tr.feedback.tooLowSub, emoji: '⬆️' };
    case 'tooHigh':
      return { message: tr.feedback.tooHigh, subMessage: tr.feedback.tooHighSub, emoji: '⬇️' };
  }
}

export function checkGuess(state: GameState, guess: number): GuessFeedback {
  const diff = DIFFICULTIES[state.difficulty];
  const secret = state.secretNumber;

  let result: GuessResult;
  if (guess === secret) {
    result = 'correct';
  } else if (guess < secret) {
    result = 'tooLow';
  } else {
    result = 'tooHigh';
  }

  const feedback = getResultFeedback(result);
  const proximity = result !== 'correct' ? getProximity(guess, secret, diff.min, diff.max) : null;

  return {
    result,
    proximity,
    ...feedback,
    isDuplicate: false,
    isInvalid: false,
  };
}

export function calculateBaseScore(attemptNumber: number): number {
  const idx = attemptNumber - 1;
  if (idx < SCORING.baseScores.length) return SCORING.baseScores[idx];
  return SCORING.minScore;
}

export function calculateRoundScore(
  state: GameState,
  attemptNumber: number
): number {
  const diff = DIFFICULTIES[state.difficulty];
  const mode = GAME_MODES[state.mode];

  if (mode.id === 'timeAttack') {
    const streakMult = getStreakMultiplier(state.sessionStreak);
    return Math.floor(SCORING.timeAttackBase * diff.scoreMultiplier * streakMult);
  }

  const base = calculateBaseScore(attemptNumber);
  const streakMult = getStreakMultiplier(state.sessionStreak);
  const hintPenalty = state.hintsUsed * SCORING.hintPenalty;

  const elapsed = (Date.now() - state.startTime) / 1000;
  const timeBonus = Math.max(0, Math.floor(50 - elapsed));

  return Math.max(
    0,
    Math.floor(base * diff.scoreMultiplier * streakMult + timeBonus - hintPenalty)
  );
}

export function calculateXp(state: GameState, won: boolean): number {
  if (!won) return Math.floor(SCORING.xpPerCorrect * 0.2);

  let xp = SCORING.xpPerCorrect;
  if (state.mode === 'challenge') xp = SCORING.xpPerChallenge;
  xp += state.sessionStreak * SCORING.xpPerStreakBonus;
  if (state.hintsUsed === 0) xp += 25;
  if (state.wrongGuessesThisRound === 0) xp += 50;
  return xp;
}

export function useHint(state: GameState): HintResult | null {
  if (state.hintsAvailable.length === 0) return null;
  if (state.challengeNoHints) return null;

  const hintType = state.hintsAvailable[0];
  const secret = state.secretNumber;
  const diff = DIFFICULTIES[state.difficulty];
  let message = '';

  switch (hintType) {
    case 'parity':
      message = secret % 2 === 0 ? tr.hints.even : tr.hints.odd;
      break;
    case 'range': {
      const quarter = Math.floor((diff.max - diff.min) / 4);
      const lower = Math.max(diff.min, secret - quarter);
      const upper = Math.min(diff.max, secret + quarter);
      message = tr.hints.between(lower, upper);
      break;
    }
    case 'divisible':
      message = secret % 5 === 0 ? tr.hints.divisible : tr.hints.notDivisible;
      break;
  }

  return {
    message,
    type: hintType as HintResult['type'],
    scorePenalty: SCORING.hintPenalty,
  };
}

export function checkAchievements(
  player: PlayerData,
  state: GameState,
  won: boolean
): string[] {
  const unlocked: string[] = [];
  const has = (id: string) => player.achievements.includes(id);
  const add = (id: string) => {
    if (!has(id) && !unlocked.includes(id)) unlocked.push(id);
  };

  if (won) add('first-guess');

  if (state.sessionStreak >= 7) add('lucky-seven');
  if (state.sessionStreak >= 20) add('unstoppable');

  const newTotalCorrect = player.totalCorrect + (won ? 1 : 0);
  if (newTotalCorrect >= 100) add('number-master');

  if (state.mode === 'timeAttack' && state.timeAttackCorrect >= 10) add('speed-demon');

  if (won && state.wrongGuessesThisRound === 0) add('perfect-game');
  if (won && !state.hintsUsedThisRound) add('hintless');
  if (won && state.difficulty === 'insane') add('insane-win');

  return unlocked;
}

export function applyGameEnd(
  player: PlayerData,
  state: GameState,
  won: boolean
): GameEndResult {
  const xpEarned = calculateXp(state, won);
  const newXp = player.xp + xpEarned;
  const oldLevel = player.level;
  const newLevel = getLevelFromXp(newXp);
  const roundScore = state.roundScore;
  const newStreak = won ? player.currentStreak + 1 : 0;

  const newAchievements = checkAchievements(player, { ...state, sessionStreak: newStreak }, won);

  return {
    won,
    secretNumber: state.secretNumber,
    score: roundScore,
    xpEarned,
    streak: newStreak,
    attempts: state.attempts,
    newAchievements,
    leveledUp: newLevel > oldLevel,
    newLevel,
  };
}

export function getDailyChallenge(): DailyChallenge {
  return generateDailyChallenge(new Date());
}

export function shouldResetDailyChallenge(player: PlayerData): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return player.lastDailyChallenge !== today;
}

export function getXpProgress(xp: number, level: number): { current: number; needed: number; percent: number } {
  const totalForLevel = getXpForLevel(level);
  let xpAtLevelStart = 0;
  for (let i = 1; i < level; i++) {
    xpAtLevelStart += getXpForLevel(i);
  }
  const current = xp - xpAtLevelStart;
  const needed = totalForLevel;
  const percent = Math.min(100, (current / needed) * 100);
  return { current, needed, percent };
}

export function getDifficultyRange(difficulty: DifficultyId): string {
  const d = DIFFICULTIES[difficulty];
  return `${d.min} — ${d.max}`;
}

export function getFavoriteDifficulty(player: PlayerData): string {
  const stats = player.difficultyStats;
  const entries = Object.entries(stats) as [DifficultyId, number][];
  if (entries.every(([, v]) => v === 0)) return tr.statistics.noneYet;
  entries.sort((a, b) => b[1] - a[1]);
  return DIFFICULTIES[entries[0][0]].label;
}

export function newRoundState(state: GameState): GameState {
  const diff = DIFFICULTIES[state.difficulty];
  const secret = generateSecretNumber(diff.min, diff.max);
  return {
    ...state,
    secretNumber: secret,
    attempts: 0,
    guesses: [],
    hintsUsed: 0,
    hintsAvailable: ['parity', 'range', 'divisible'],
    hintsUsedThisRound: false,
    wrongGuessesThisRound: 0,
    roundScore: 0,
    roundXp: 0,
    startTime: Date.now(),
    gameStatus: 'playing',
    lives: state.maxLives,
  };
}
