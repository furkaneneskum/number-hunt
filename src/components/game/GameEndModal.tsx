import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useGameContext } from '../../context/GameContext';
import { tr } from '../../i18n/tr';

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
        <h2 className="game-end__title">{isWin ? tr.gameEnd.won : tr.gameEnd.lost}</h2>

        <div className="game-end__stats">
          <div className="game-end__stat">
            <span className="game-end__stat-label">
              {isWin ? tr.gameEnd.secretNumber : tr.gameEnd.numberWas}
            </span>
            <span className="game-end__stat-value game-end__stat-value--secret">
              {lastGameResult.secretNumber}
            </span>
          </div>

          {isWin && (
            <div className="game-end__stat">
              <span className="game-end__stat-label">{tr.gameEnd.attempts}</span>
              <span className="game-end__stat-value">{lastGameResult.attempts}</span>
            </div>
          )}

          <div className="game-end__stat">
            <span className="game-end__stat-label">{tr.gameEnd.score}</span>
            <span className="game-end__stat-value">{lastGameResult.score.toLocaleString('tr-TR')}</span>
          </div>

          <div className="game-end__stat">
            <span className="game-end__stat-label">{tr.gameEnd.xpEarned}</span>
            <span className="game-end__stat-value game-end__stat-value--xp">
              +{lastGameResult.xpEarned} XP
            </span>
          </div>

          <div className="game-end__stat">
            <span className="game-end__stat-label">{tr.gameEnd.streak}</span>
            <span className="game-end__stat-value">🔥 {lastGameResult.streak}</span>
          </div>
        </div>

        <div className="game-end__actions">
          {isWin ? (
            <Button size="lg" onClick={nextRound}>
              {tr.gameEnd.nextRound}
            </Button>
          ) : (
            <Button size="lg" onClick={nextRound}>
              {tr.gameEnd.playAgain}
            </Button>
          )}
          <Button variant="ghost" onClick={endGame}>
            {tr.gameEnd.backToMenu}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
