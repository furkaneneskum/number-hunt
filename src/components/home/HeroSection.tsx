import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { tr } from '../../i18n/tr';

export function HowToPlayModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title={tr.howToPlay.title}>
      <ol className="how-to-play">
        {tr.howToPlay.steps.map((text, i) => (
          <li key={i} className="how-to-play__step">
            <span className="how-to-play__num">{i + 1}</span>
            <span>{text}</span>
          </li>
        ))}
      </ol>
      <Button onClick={onClose} className="how-to-play__close">
        {tr.howToPlay.gotIt}
      </Button>
    </Modal>
  );
}

export function HeroSection() {
  const [showHowTo, setShowHowTo] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero__content">
        <h1 className="hero__title">{tr.hero.title}</h1>
        <p className="hero__subtitle">{tr.hero.subtitle}</p>
        <div className="hero__actions">
          <Button size="lg" onClick={() => navigate('/play')}>
            {tr.hero.playNow}
          </Button>
          <Button variant="secondary" size="lg" onClick={() => setShowHowTo(true)}>
            {tr.hero.howToPlay}
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
