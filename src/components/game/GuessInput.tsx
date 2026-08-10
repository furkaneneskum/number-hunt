import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { Button } from '../ui/Button';
import { tr } from '../../i18n/tr';

interface GuessInputProps {
  onSubmit: (value: string) => void;
  disabled?: boolean;
  min: number;
  max: number;
}

export function GuessInput({ onSubmit, disabled, min, max }: GuessInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit(value);
    setValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <form className="guess-input" onSubmit={handleSubmit}>
      <input
        type="number"
        className="guess-input__field"
        placeholder={tr.game.enterGuess}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        min={min}
        max={max}
        aria-label={`${min} ile ${max} arasında bir sayı gir`}
        inputMode="numeric"
      />
      <Button type="submit" size="lg" disabled={disabled || !value.trim()}>
        {tr.game.guess}
      </Button>
    </form>
  );
}
