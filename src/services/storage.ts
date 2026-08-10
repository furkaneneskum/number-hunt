import type { PlayerData, PlayerSettings } from '../types';

const STORAGE_KEY = 'number-hunt-player';

export const DEFAULT_SETTINGS: PlayerSettings = {
  sound: true,
  animations: true,
  theme: 'dark',
  difficulty: 'medium',
  mode: 'classic',
};

export const DEFAULT_PLAYER: PlayerData = {
  score: 0,
  xp: 0,
  level: 1,
  currentStreak: 0,
  bestStreak: 0,
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  totalGuesses: 0,
  bestScore: 0,
  totalCorrect: 0,
  achievements: [],
  settings: { ...DEFAULT_SETTINGS },
  scoreHistory: [],
  difficultyStats: { easy: 0, medium: 0, hard: 0, insane: 0 },
  timeAttackBest: 0,
  lastDailyChallenge: null,
  dailyChallengeCompleted: false,
};

export function loadPlayer(): PlayerData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_PLAYER);
    const parsed = JSON.parse(raw) as Partial<PlayerData>;
    return {
      ...DEFAULT_PLAYER,
      ...parsed,
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
      difficultyStats: { ...DEFAULT_PLAYER.difficultyStats, ...parsed.difficultyStats },
      achievements: parsed.achievements ?? [],
      scoreHistory: parsed.scoreHistory ?? [],
    };
  } catch {
    return structuredClone(DEFAULT_PLAYER);
  }
}

export function savePlayer(player: PlayerData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  } catch {
    // Storage full or unavailable
  }
}

export function resetPlayer(): PlayerData {
  localStorage.removeItem(STORAGE_KEY);
  return structuredClone(DEFAULT_PLAYER);
}

export function updatePlayer(updater: (prev: PlayerData) => PlayerData): PlayerData {
  const current = loadPlayer();
  const updated = updater(current);
  savePlayer(updated);
  return updated;
}
