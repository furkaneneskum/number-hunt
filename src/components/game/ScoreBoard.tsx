import { useGameContext } from '../../context/GameContext';
import { GAME_MODES } from '../../config/gameConfig';

export function ScoreBoard() {
  const { player, gameState, xpProgress } = useGameContext();

  if (!gameState) return null;

  const mode = GAME_MODES[gameState.mode];
  const showLives = mode.usesLives;
  const showAttempts = mode.usesAttempts;
  const showTimer = mode.usesTimer;

  return (
    <div className="scoreboard">
      <div className="scoreboard__item">
        <span className="scoreboard__label">Score</span>
        <span className="scoreboard__value">{gameState.score + gameState.roundScore}</span>
      </div>

      <div className="scoreboard__item">
        <span className="scoreboard__label">Streak</span>
        <span className="scoreboard__value scoreboard__value--streak">
          🔥 {gameState.sessionStreak}
        </span>
      </div>

      <div className="scoreboard__item">
        <span className="scoreboard__label">Level</span>
        <span className="scoreboard__value">{player.level}</span>
      </div>

      {showLives && (
        <div className="scoreboard__item">
          <span className="scoreboard__label">Lives</span>
          <span className="scoreboard__value scoreboard__value--lives">
            {'❤️'.repeat(gameState.lives)}
            {'🖤'.repeat(Math.max(0, gameState.maxLives - gameState.lives))}
          </span>
        </div>
      )}

      {showAttempts && (
        <div className="scoreboard__item">
          <span className="scoreboard__label">Attempts</span>
          <span className="scoreboard__value">
            {gameState.attempts}/{gameState.maxAttempts}
          </span>
        </div>
      )}

      {showTimer && (
        <div className="scoreboard__item">
          <span className="scoreboard__label">Time</span>
          <span className={`scoreboard__value ${(gameState.timeRemaining ?? 0) <= 10 ? 'scoreboard__value--urgent' : ''}`}>
            {gameState.timeRemaining}s
          </span>
        </div>
      )}

      {gameState.mode === 'timeAttack' && (
        <div className="scoreboard__item">
          <span className="scoreboard__label">Found</span>
          <span className="scoreboard__value">{gameState.timeAttackCorrect}</span>
        </div>
      )}

      <div className="scoreboard__xp">
        <div className="xp-bar">
          <div className="xp-bar__fill" style={{ width: `${xpProgress.percent}%` }} />
        </div>
        <span className="xp-bar__label">
          XP {xpProgress.current}/{xpProgress.needed}
        </span>
      </div>
    </div>
  );
}
