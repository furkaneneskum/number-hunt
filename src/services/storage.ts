import type { PlayerData } from '../types';

const SESSION_KEY = 'number-hunt-session';
const USERS_KEY = 'number-hunt-users';
const LEGACY_KEY = 'number-hunt-player';

export interface LeaderboardEntry {
  username: string;
  score: number;
  level: number;
  xp: number;
  bestStreak: number;
  gamesWon: number;
  lastActive: number;
  isCurrentUser?: boolean;
}

export const DEFAULT_SETTINGS: PlayerData['settings'] = {
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

type UserRegistry = Record<string, PlayerData>;

function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase();
}

function displayUsername(raw: string): string {
  return raw.trim();
}

export function validateUsername(raw: string): { valid: boolean; error?: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { valid: false, error: 'Kullanıcı adı boş olamaz.' };
  if (trimmed.length < 3) return { valid: false, error: 'En az 3 karakter olmalı.' };
  if (trimmed.length > 16) return { valid: false, error: 'En fazla 16 karakter olabilir.' };
  if (!/^[a-zA-Z0-9_ğüşıöçĞÜŞİÖÇ]+$/.test(trimmed)) {
    return { valid: false, error: 'Sadece harf, rakam ve _ kullanılabilir.' };
  }
  return { valid: true };
}

function loadRegistry(): UserRegistry {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw) as UserRegistry;
    migrateLegacyPlayer();
    const after = localStorage.getItem(USERS_KEY);
    if (after) return JSON.parse(after) as UserRegistry;
    return {};
  } catch {
    return {};
  }
}

function saveRegistry(registry: UserRegistry): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(registry));
  } catch {
    // ignore
  }
}

function migrateLegacyPlayer(): void {
  try {
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (!legacy) return;
    const parsed = JSON.parse(legacy) as PlayerData;
    const username = 'oyuncu';
    const registry: UserRegistry = { [username]: parsed };
    saveRegistry(registry);
    setSessionUsername(username);
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // ignore
  }
}

export function getSessionUsername(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionUsername(raw: string): void {
  localStorage.setItem(SESSION_KEY, displayUsername(raw));
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function loadPlayer(username: string): PlayerData {
  const key = normalizeUsername(username);
  const registry = loadRegistry();
  const parsed = registry[key];
  if (!parsed) return structuredClone(DEFAULT_PLAYER);
  return {
    ...DEFAULT_PLAYER,
    ...parsed,
    settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
    difficultyStats: { ...DEFAULT_PLAYER.difficultyStats, ...parsed.difficultyStats },
    achievements: parsed.achievements ?? [],
    scoreHistory: parsed.scoreHistory ?? [],
  };
}

export function savePlayer(username: string, player: PlayerData): void {
  const key = normalizeUsername(username);
  const registry = loadRegistry();
  registry[key] = player;
  saveRegistry(registry);
}

export function loginUser(rawUsername: string): { username: string; player: PlayerData; isNew: boolean } {
  const validation = validateUsername(rawUsername);
  if (!validation.valid) throw new Error(validation.error);

  const key = normalizeUsername(rawUsername);
  const display = displayUsername(rawUsername);
  const registry = loadRegistry();
  const isNew = !registry[key];

  if (isNew) {
    registry[key] = structuredClone(DEFAULT_PLAYER);
    saveRegistry(registry);
  }

  setSessionUsername(display);
  return { username: display, player: loadPlayer(display), isNew };
}

export function resetPlayer(username: string): PlayerData {
  const key = normalizeUsername(username);
  const registry = loadRegistry();
  registry[key] = structuredClone(DEFAULT_PLAYER);
  saveRegistry(registry);
  return registry[key];
}

export function getLeaderboard(currentUsername?: string | null): LeaderboardEntry[] {
  const registry = loadRegistry();
  const currentKey = currentUsername ? normalizeUsername(currentUsername) : null;

  return Object.entries(registry)
    .map(([key, player]) => ({
      username: key,
      score: player.score,
      level: player.level,
      xp: player.xp,
      bestStreak: player.bestStreak,
      gamesWon: player.gamesWon,
      lastActive: 0,
      isCurrentUser: currentKey === key,
    }))
    .sort((a, b) => b.score - a.score || b.level - a.level || b.xp - a.xp);
}

export function getRegisteredUserCount(): number {
  return Object.keys(loadRegistry()).length;
}
