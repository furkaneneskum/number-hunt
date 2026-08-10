export type DifficultyId = 'easy' | 'medium' | 'hard' | 'insane';
export type GameModeId = 'classic' | 'timeAttack' | 'streak' | 'challenge';
export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';
export type GuessResult = 'correct' | 'tooLow' | 'tooHigh';
export type ProximityLevel = 'veryFar' | 'far' | 'warm' | 'veryClose';
export type Theme = 'dark' | 'light';

export interface DifficultyConfig {
  id: DifficultyId;
  label: string;
  min: number;
  max: number;
  maxAttempts: number;
  scoreMultiplier: number;
  lives?: number;
}

export interface GameModeConfig {
  id: GameModeId;
  label: string;
  description: string;
  icon: string;
  usesAttempts: boolean;
  usesLives: boolean;
  usesTimer: boolean;
  timerSeconds?: number;
  timePenaltySeconds?: number;
}

export interface ProximityConfig {
  id: ProximityLevel;
  label: string;
  emoji: string;
  /** Percentage of range (0-1) within which this proximity applies */
  threshold: number;
}

export interface StreakMultiplierTier {
  minStreak: number;
  multiplier: number;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface PlayerSettings {
  sound: boolean;
  animations: boolean;
  theme: Theme;
  difficulty: DifficultyId;
  mode: GameModeId;
}

export interface PlayerData {
  score: number;
  xp: number;
  level: number;
  currentStreak: number;
  bestStreak: number;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  totalGuesses: number;
  bestScore: number;
  totalCorrect: number;
  achievements: string[];
  settings: PlayerSettings;
  scoreHistory: number[];
  difficultyStats: Record<DifficultyId, number>;
  timeAttackBest: number;
  lastDailyChallenge: string | null;
  dailyChallengeCompleted: boolean;
}

export interface GameState {
  mode: GameModeId;
  difficulty: DifficultyId;
  secretNumber: number;
  attempts: number;
  maxAttempts: number;
  guesses: number[];
  score: number;
  streak: number;
  sessionStreak: number;
  timeRemaining: number | null;
  hintsUsed: number;
  hintsAvailable: string[];
  gameStatus: GameStatus;
  lives: number;
  maxLives: number;
  roundScore: number;
  roundXp: number;
  hintsUsedThisRound: boolean;
  wrongGuessesThisRound: number;
  timeAttackCorrect: number;
  peakSessionStreak: number;
  challengeNoHints: boolean;
  startTime: number;
}

export interface GuessFeedback {
  result: GuessResult;
  proximity: ProximityLevel | null;
  message: string;
  subMessage: string;
  emoji: string;
  isDuplicate: boolean;
  isInvalid: boolean;
}

export interface HintResult {
  message: string;
  type: 'parity' | 'range' | 'divisible';
  scorePenalty: number;
}

export interface GameEndResult {
  won: boolean;
  secretNumber: number;
  score: number;
  xpEarned: number;
  streak: number;
  attempts: number;
  newAchievements: string[];
  leveledUp: boolean;
  newLevel: number;
}

export interface DailyChallenge {
  id: string;
  date: string;
  description: string;
  maxAttempts: number;
  difficulty: DifficultyId;
  noHints: boolean;
  xpReward: number;
}
