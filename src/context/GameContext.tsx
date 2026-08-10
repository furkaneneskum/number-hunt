import { createContext, useContext, useCallback, useState, useEffect, useRef, type ReactNode } from 'react';
import type { PlayerData, GameState, GuessFeedback, GameModeId, DifficultyId } from '../types';
import {
  loadPlayer,
  savePlayer,
  resetPlayer as resetStorage,
  getSessionUsername,
} from '../services/storage';
import { useAuth } from './AuthContext';
import {
  createGameState,
  validateGuess,
  checkGuess,
  calculateRoundScore,
  useHint as getHint,
  applyGameEnd,
  newRoundState,
  getDailyChallenge,
  shouldResetDailyChallenge,
  getXpProgress,
} from '../services/gameLogic';
import { DIFFICULTIES, GAME_MODES } from '../config/gameConfig';
import { playSound, setSoundEnabled, resumeAudio } from '../services/sound';
import { tr } from '../i18n/tr';
import type { DailyChallenge } from '../types';

interface GameContextValue {
  player: PlayerData;
  gameState: GameState | null;
  feedback: GuessFeedback | null;
  hintMessage: string | null;
  dailyChallenge: DailyChallenge;
  showLevelUp: boolean;
  showStreakLost: boolean;
  newAchievements: string[];
  lastGameResult: ReturnType<typeof applyGameEnd> | null;
  xpProgress: ReturnType<typeof getXpProgress>;
  startGame: (mode?: GameModeId, difficulty?: DifficultyId) => void;
  submitGuess: (value: string) => void;
  useHintAction: () => void;
  nextRound: () => void;
  endGame: () => void;
  updateSettings: (settings: Partial<PlayerData['settings']>) => void;
  resetProgress: () => void;
  dismissLevelUp: () => void;
  dismissAchievements: () => void;
  clearFeedback: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const { username, refreshLeaderboard } = useAuth();

  const loadForUser = useCallback((name: string | null): PlayerData => {
    if (!name) return structuredClone(loadPlayer(''));
    const p = loadPlayer(name);
    if (shouldResetDailyChallenge(p)) {
      return { ...p, dailyChallengeCompleted: false, lastDailyChallenge: new Date().toISOString().slice(0, 10) };
    }
    return p;
  }, []);

  const [player, setPlayer] = useState<PlayerData>(() => loadForUser(getSessionUsername()));
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [feedback, setFeedback] = useState<GuessFeedback | null>(null);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showStreakLost, setShowStreakLost] = useState(false);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [lastGameResult, setLastGameResult] = useState<ReturnType<typeof applyGameEnd> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameEndedRef = useRef(false);
  const dailyChallenge = getDailyChallenge();

  useEffect(() => {
    if (username) {
      setPlayer(loadForUser(username));
      setGameState(null);
      setFeedback(null);
    }
  }, [username, loadForUser]);

  const xpProgress = getXpProgress(player.xp, player.level);

  useEffect(() => {
    setSoundEnabled(player.settings.sound);
  }, [player.settings.sound]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', player.settings.theme);
    if (!player.settings.animations) {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    } else {
      document.documentElement.removeAttribute('data-reduced-motion');
    }
  }, [player.settings.theme, player.settings.animations]);

  const persistPlayer = useCallback(
    (updated: PlayerData) => {
      setPlayer(updated);
      if (username) {
        savePlayer(username, updated);
        refreshLeaderboard();
      }
    },
    [username, refreshLeaderboard]
  );

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleGameOver = useCallback(
    (state: GameState, won: boolean) => {
      if (gameEndedRef.current) return;
      gameEndedRef.current = true;
      stopTimer();
      const result = applyGameEnd(player, state, won);

      if (!won && player.currentStreak > 0) {
        setShowStreakLost(true);
        setTimeout(() => setShowStreakLost(false), 2000);
      }

      const updated: PlayerData = {
        ...player,
        score: player.score + result.score,
        xp: player.xp + result.xpEarned,
        level: result.newLevel,
        currentStreak: won ? player.currentStreak + 1 : 0,
        bestStreak: Math.max(
          player.bestStreak,
          won ? player.currentStreak + 1 : 0,
          state.peakSessionStreak
        ),
        gamesPlayed: player.gamesPlayed + 1,
        gamesWon: player.gamesWon + (won ? 1 : 0),
        gamesLost: player.gamesLost + (won ? 0 : 1),
        totalGuesses: player.totalGuesses + state.attempts,
        bestScore: Math.max(player.bestScore, result.score),
        totalCorrect: player.totalCorrect + (won ? 1 : 0),
        achievements: [...new Set([...player.achievements, ...result.newAchievements])],
        scoreHistory: [...player.scoreHistory.slice(-19), result.score],
        difficultyStats: {
          ...player.difficultyStats,
          [state.difficulty]: player.difficultyStats[state.difficulty] + 1,
        },
        timeAttackBest:
          state.mode === 'timeAttack'
            ? Math.max(player.timeAttackBest, state.timeAttackCorrect)
            : player.timeAttackBest,
        dailyChallengeCompleted:
          state.mode === 'challenge' && won ? true : player.dailyChallengeCompleted,
      };

      persistPlayer(updated);
      setLastGameResult(result);

      if (result.newAchievements.length > 0) {
        setNewAchievements(result.newAchievements);
        playSound('achievement');
      }

      if (result.leveledUp) {
        setShowLevelUp(true);
        playSound('levelUp');
      }

      setGameState({ ...state, gameStatus: won ? 'won' : 'lost' });
    },
    [player, persistPlayer, stopTimer]
  );

  const startGame = useCallback(
    (mode?: GameModeId, difficulty?: DifficultyId) => {
      resumeAudio();
      stopTimer();
      gameEndedRef.current = false;
      const m = mode ?? player.settings.mode;
      const d = difficulty ?? player.settings.difficulty;
      const challenge = m === 'challenge' ? dailyChallenge : undefined;
      const state = createGameState(m, d, challenge);
      setGameState(state);
      setFeedback(null);
      setHintMessage(null);
      setLastGameResult(null);
      setNewAchievements([]);

      if (GAME_MODES[m].usesTimer) {
        timerRef.current = setInterval(() => {
          setGameState((prev) => {
            if (!prev || prev.gameStatus !== 'playing') return prev;
            const remaining = (prev.timeRemaining ?? 0) - 1;
            if (remaining <= 0) {
              stopTimer();
              if (!gameEndedRef.current) {
                gameEndedRef.current = true;
                setTimeout(() => {
                  handleGameOver({ ...prev, timeRemaining: 0, gameStatus: 'lost' }, prev.timeAttackCorrect > 0);
                }, 0);
              }
              return { ...prev, timeRemaining: 0, gameStatus: 'lost' };
            }
            return { ...prev, timeRemaining: remaining };
          });
        }, 1000);
      }
    },
    [player.settings.mode, player.settings.difficulty, dailyChallenge, stopTimer, handleGameOver]
  );

  // Removed separate useEffect for timer end — handled in interval

  const submitGuess = useCallback(
    (value: string) => {
      if (!gameState || gameState.gameStatus !== 'playing') return;

      const diff = DIFFICULTIES[gameState.difficulty];
      const validation = validateGuess(value, diff.min, diff.max, gameState.guesses);

      if (!validation.valid) {
        setFeedback({
          result: 'tooLow',
          proximity: null,
          message: validation.error ?? tr.game.invalidInput,
          subMessage: '',
          emoji: '⚠️',
          isDuplicate: validation.isDuplicate ?? false,
          isInvalid: true,
        });
        return;
      }

      const guess = validation.number!;
      const result = checkGuess(gameState, guess);
      const newAttempts = gameState.attempts + 1;
      const newGuesses = [...gameState.guesses, guess];

      if (result.result === 'correct') {
        playSound('success');
        const roundScore = calculateRoundScore(
          { ...gameState, sessionStreak: gameState.sessionStreak + 1, attempts: newAttempts },
          newAttempts
        );
        const newSessionStreak = gameState.sessionStreak + 1;

        if (gameState.mode === 'timeAttack') {
          const updated: GameState = {
            ...gameState,
            attempts: newAttempts,
            guesses: newGuesses,
            sessionStreak: newSessionStreak,
            timeAttackCorrect: gameState.timeAttackCorrect + 1,
            roundScore: gameState.roundScore + roundScore,
            score: gameState.score + roundScore,
          };
          setFeedback(result);
          const nextState = newRoundState(updated);
          nextState.sessionStreak = newSessionStreak;
          nextState.peakSessionStreak = Math.max(updated.peakSessionStreak ?? 0, newSessionStreak);
          nextState.timeAttackCorrect = updated.timeAttackCorrect;
          nextState.roundScore = updated.roundScore;
          nextState.score = updated.score;
          setGameState(nextState);
          return;
        }

        if (gameState.mode === 'streak') {
          const updated: GameState = {
            ...gameState,
            attempts: newAttempts,
            guesses: newGuesses,
            sessionStreak: newSessionStreak,
            roundScore: gameState.roundScore + roundScore,
            score: gameState.score + roundScore,
          };
          setFeedback(result);
          const nextState = newRoundState(updated);
          nextState.sessionStreak = newSessionStreak;
          nextState.peakSessionStreak = Math.max(updated.peakSessionStreak ?? 0, newSessionStreak);
          nextState.roundScore = updated.roundScore;
          nextState.score = updated.score;
          nextState.lives = updated.lives;
          nextState.maxLives = updated.maxLives;
          setGameState(nextState);
          return;
        }

        const updated: GameState = {
          ...gameState,
          attempts: newAttempts,
          guesses: newGuesses,
          sessionStreak: newSessionStreak,
          peakSessionStreak: Math.max(gameState.peakSessionStreak, newSessionStreak),
          roundScore: roundScore,
          gameStatus: 'won',
        };
        setFeedback(result);
        handleGameOver(updated, true);
        return;
      }

      playSound('error');
      const modeConfig = GAME_MODES[gameState.mode];
      let newLives = gameState.lives;
      let gameOver = false;

      if (modeConfig.usesLives) {
        newLives -= 1;
        if (newLives <= 0) gameOver = true;
      }

      if (modeConfig.usesAttempts && newAttempts >= gameState.maxAttempts) {
        gameOver = true;
      }

      if (gameState.mode === 'timeAttack') {
        const penalty = GAME_MODES.timeAttack.timePenaltySeconds ?? 3;
        const newTime = Math.max(0, (gameState.timeRemaining ?? 0) - penalty);
        if (newTime <= 0) gameOver = true;

        const updated: GameState = {
          ...gameState,
          attempts: newAttempts,
          guesses: newGuesses,
          timeRemaining: newTime,
          wrongGuessesThisRound: gameState.wrongGuessesThisRound + 1,
          sessionStreak: 0,
        };

        setFeedback(result);
        if (gameOver) {
          handleGameOver(updated, updated.timeAttackCorrect > 0);
        } else {
          setGameState(updated);
        }
        return;
      }

      const updated: GameState = {
        ...gameState,
        attempts: newAttempts,
        guesses: newGuesses,
        lives: newLives,
        wrongGuessesThisRound: gameState.wrongGuessesThisRound + 1,
        sessionStreak: 0,
        gameStatus: gameOver ? 'lost' : 'playing',
      };

      setFeedback(result);
      if (gameOver) {
        handleGameOver(updated, false);
      } else {
        setGameState(updated);
      }
    },
    [gameState, handleGameOver]
  );

  const useHintAction = useCallback(() => {
    if (!gameState || gameState.gameStatus !== 'playing') return;
    if (gameState.challengeNoHints) {
      setHintMessage(tr.game.hintsDisabledChallenge);
      return;
    }

    const hint = getHint(gameState);
    if (!hint) return;

    playSound('click');
    setHintMessage(hint.message);
    setGameState({
      ...gameState,
      hintsUsed: gameState.hintsUsed + 1,
      hintsUsedThisRound: true,
      hintsAvailable: gameState.hintsAvailable.slice(1),
      roundScore: Math.max(0, gameState.roundScore - hint.scorePenalty),
    });
  }, [gameState]);

  const nextRound = useCallback(() => {
    startGame();
  }, [startGame]);

  const endGame = useCallback(() => {
    stopTimer();
    setGameState(null);
    setFeedback(null);
    setHintMessage(null);
    setLastGameResult(null);
  }, [stopTimer]);

  const updateSettings = useCallback(
    (settings: Partial<PlayerData['settings']>) => {
      persistPlayer({
        ...player,
        settings: { ...player.settings, ...settings },
      });
    },
    [player, persistPlayer]
  );

  const resetProgress = useCallback(() => {
    if (!username) return;
    const fresh = resetStorage(username);
    setPlayer(fresh);
    setGameState(null);
    setFeedback(null);
    setLastGameResult(null);
    refreshLeaderboard();
  }, [username, refreshLeaderboard]);

  return (
    <GameContext.Provider
      value={{
        player,
        gameState,
        feedback,
        hintMessage,
        dailyChallenge,
        showLevelUp,
        showStreakLost,
        newAchievements,
        lastGameResult,
        xpProgress,
        startGame,
        submitGuess,
        useHintAction,
        nextRound,
        endGame,
        updateSettings,
        resetProgress,
        dismissLevelUp: () => setShowLevelUp(false),
        dismissAchievements: () => setNewAchievements([]),
        clearFeedback: () => setFeedback(null),
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameContext must be used within GameProvider');
  return ctx;
}
