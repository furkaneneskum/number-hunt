import { useGameContext } from '../../context/GameContext';
import { getProximityInfo } from '../../services/gameLogic';

export function ResultMessage() {
  const { feedback } = useGameContext();

  if (!feedback) return null;

  const proximityInfo =
    feedback.proximity && !feedback.isInvalid ? getProximityInfo(feedback.proximity) : null;

  const shakeClass =
    feedback.result !== 'correct' && !feedback.isInvalid ? 'result-message--shake' : '';
  const successClass = feedback.result === 'correct' ? 'result-message--success' : '';
  const errorClass = feedback.isInvalid ? 'result-message--error' : '';

  return (
    <div
      className={`result-message ${shakeClass} ${successClass} ${errorClass}`}
      role="status"
      aria-live="polite"
    >
      <span className="result-message__emoji">{feedback.emoji}</span>
      <div className="result-message__text">
        <strong className="result-message__title">{feedback.message}</strong>
        {feedback.subMessage && <p className="result-message__sub">{feedback.subMessage}</p>}
        {proximityInfo && (
          <p className="result-message__proximity">
            {proximityInfo.emoji} {proximityInfo.label}
          </p>
        )}
      </div>
    </div>
  );
}
