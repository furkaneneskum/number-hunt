import type { DifficultyId } from '../../types';
import { DIFFICULTIES } from '../../config/gameConfig';

interface DifficultySelectorProps {
  selected: DifficultyId;
  onChange: (id: DifficultyId) => void;
}

export function DifficultySelector({ selected, onChange }: DifficultySelectorProps) {
  const difficulties = Object.values(DIFFICULTIES);

  return (
    <div className="selector" role="group" aria-label="Select difficulty">
      <h3 className="selector__title">Difficulty</h3>
      <div className="selector__grid">
        {difficulties.map((d) => (
          <button
            key={d.id}
            className={`selector__option ${selected === d.id ? 'selector__option--active' : ''}`}
            onClick={() => onChange(d.id)}
            aria-pressed={selected === d.id}
          >
            <span className="selector__option-label">{d.label}</span>
            <span className="selector__option-meta">
              {d.min}-{d.max} · x{d.scoreMultiplier}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
