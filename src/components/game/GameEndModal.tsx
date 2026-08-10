import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useGameContext } from '../../context/GameContext';

interface GameEndModalProps {
  type: 'won' | 'lost';
}

export function GameEndModal({ type }: GameEndModalProps) {
  const { gameState, lastGameResult, nextRound, endGame } = useGameContext();

  if (!gameState || !lastGameResult) return null;

  const isWin = type === 'won';

  return (
    <Modal open closable={false} className={`modal--game-end modal--${type}`}>
      <div className="game-end">
        <span className="game-end__emoji">{isWin ? '🎉' : '💀'}</span>
        <h2 className="game-end__title">{isWin ? 'YOU FOUND IT!' : 'GAME OVER'}</h2>

        <div className="game-end__stats">
          <div className="game-end__stat">
            <span className="game-end__stat-label">
              {isWin ? 'Secret Number' : 'The number was'}
            </span>
            <span className="game-end__stat-value game-end__stat-value--secret">
              {lastGameResult.secretNumber}
            </span>
          </div>

          {isWin && (
            <div className="game-end__stat">
              <span className="game-end__stat-label">Attempts</span>
              <span className="game-end__stat-value">{lastGameResult.attempts}</span>
            </div>
          )}

          <div className="game-end__stat">
            <span className="game-end__stat-label">Score</span>
            <span className="game-end__stat-value">{lastGameResult.score.toLocaleString()}</span>
          </div>

          <div className="game-end__stat">
            <span className="game-end__stat-label">XP Earned</span>
            <span className="game-end__stat-value game-end__stat-value--xp">
              +{lastGameResult.xpEarned} XP
            </span>
          </div>

          <div className="game-end__stat">
            <span className="game-end__stat-label">Streak</span>
            <span className="game-end__stat-value">🔥 {lastGameResult.streak}</span>
          </div>
        </div>

        <div className="game-end__actions">
          {isWin ? (
            <Button size="lg" onClick={nextRound}>
              NEXT ROUND
            </Button>
          ) : (
            <Button size="lg" onClick={nextRound}>
              PLAY AGAIN
            </Button>
          )}
          <Button variant="ghost" onClick={endGame}>
            BACK TO MENU
          </Button>
        </div>
      </div>
    </Modal>
  );
}
