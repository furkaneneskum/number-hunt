import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

const STEPS = [
  { num: 1, text: 'Choose your difficulty and game mode' },
  { num: 2, text: 'Guess the secret number in the given range' },
  { num: 3, text: 'Use Too High / Too Low feedback to narrow it down' },
  { num: 4, text: 'Earn score based on speed and accuracy' },
  { num: 5, text: 'Build streaks for multiplier bonuses' },
  { num: 6, text: 'Gain XP and level up over time' },
  { num: 7, text: 'Unlock achievements as you improve' },
  { num: 8, text: 'Complete daily challenges for bonus rewards' },
];

export function HowToPlayModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="How to Play">
      <ol className="how-to-play">
        {STEPS.map((step) => (
          <li key={step.num} className="how-to-play__step">
            <span className="how-to-play__num">{step.num}</span>
            <span>{step.text}</span>
          </li>
        ))}
      </ol>
      <Button onClick={onClose} className="how-to-play__close">
        Got it!
      </Button>
    </Modal>
  );
}

export function HeroSection() {
  const [showHowTo, setShowHowTo] = useState(false);

  return (
    <section className="hero">
      <div className="hero__content">
        <h1 className="hero__title">Can You Find The Number?</h1>
        <p className="hero__subtitle">
          Guess smarter. Build your streak. Become the Number Hunt champion.
        </p>
        <div className="hero__actions">
          <Link to="/play">
            <Button size="lg">PLAY NOW</Button>
          </Link>
          <Button variant="secondary" size="lg" onClick={() => setShowHowTo(true)}>
            HOW TO PLAY
          </Button>
        </div>
      </div>

      <div className="hero__visual" aria-hidden="true">
        <div className="hero__numbers">
          <span className="hero__number hero__number--float">?</span>
          <span className="hero__number hero__number--float hero__number--delay">42</span>
          <span className="hero__number hero__number--float hero__number--delay2">?</span>
        </div>
        <div className="hero__glow" />
      </div>

      <HowToPlayModal open={showHowTo} onClose={() => setShowHowTo(false)} />
    </section>
  );
}
