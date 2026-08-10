import { Card } from '../ui/Card';
import { DIFFICULTIES } from '../../config/gameConfig';
import type { GameState } from '../../types';

interface GameCardProps {
  gameState: GameState;
}

export function GameCard({ gameState }: GameCardProps) {
  const diff = DIFFICULTIES[gameState.difficulty];

  return (
    <Card className="game-card">
      <h2 className="game-card__title">GUESS THE NUMBER</h2>
      <p className="game-card__range">
        {diff.min} — {diff.max}
      </p>
      <div className="game-card__mystery" aria-hidden="true">
        <span className="game-card__digit game-card__digit--anim">?</span>
        <span className="game-card__digit game-card__digit--anim game-card__digit--delay">?</span>
        <span className="game-card__digit game-card__digit--anim game-card__digit--delay2">?</span>
      </div>
      {gameState.guesses.length > 0 && (
        <div className="game-card__history">
          <span className="game-card__history-label">Previous guesses:</span>
          <div className="game-card__history-list">
            {gameState.guesses.map((g, i) => (
              <span key={i} className="game-card__history-item">
                {g}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
