import { useGameContext } from '../../context/GameContext';
import { Button } from '../ui/Button';

export function HintButton() {
  const { gameState, useHintAction, hintMessage } = useGameContext();

  if (!gameState || gameState.gameStatus !== 'playing') return null;

  const hintsLeft = gameState.hintsAvailable.length;
  const disabled = hintsLeft === 0 || gameState.challengeNoHints;

  return (
    <div className="hint-section">
      <Button
        variant="secondary"
        onClick={useHintAction}
        disabled={disabled}
        aria-label={`Use hint, ${hintsLeft} remaining`}
      >
        💡 HINT {hintsLeft > 0 && `(${hintsLeft})`}
      </Button>
      {hintMessage && (
        <p className="hint-message" role="status">
          {hintMessage}
        </p>
      )}
      {gameState.challengeNoHints && (
        <p className="hint-message hint-message--muted">Hints disabled for this challenge</p>
      )}
    </div>
  );
}
