import type { GameModeId } from '../../types';
import { GAME_MODES } from '../../config/gameConfig';

interface ModeSelectorProps {
  selected: GameModeId;
  onChange: (id: GameModeId) => void;
}

export function ModeSelector({ selected, onChange }: ModeSelectorProps) {
  const modes = Object.values(GAME_MODES);

  return (
    <div className="selector" role="group" aria-label="Select game mode">
      <h3 className="selector__title">Game Mode</h3>
      <div className="selector__grid selector__grid--modes">
        {modes.map((m) => (
          <button
            key={m.id}
            className={`selector__option selector__option--mode ${selected === m.id ? 'selector__option--active' : ''}`}
            onClick={() => onChange(m.id)}
            aria-pressed={selected === m.id}
          >
            <span className="selector__option-icon">{m.icon}</span>
            <span className="selector__option-label">{m.label}</span>
            <span className="selector__option-desc">{m.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
