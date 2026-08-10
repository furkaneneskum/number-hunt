import { useGameContext } from '../../context/GameContext';
import { Button } from '../ui/Button';
import { tr } from '../../i18n/tr';

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
        aria-label={`İpucu kullan, ${hintsLeft} kaldı`}
      >
        💡 {tr.game.hint} {hintsLeft > 0 && `(${hintsLeft})`}
      </Button>
      {hintMessage && (
        <p className="hint-message" role="status">
          {hintMessage}
        </p>
      )}
      {gameState.challengeNoHints && (
        <p className="hint-message hint-message--muted">{tr.game.hintsDisabled}</p>
      )}
    </div>
  );
}
