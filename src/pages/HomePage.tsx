import { HeroSection } from '../components/home/HeroSection';
import { Card } from '../components/ui/Card';
import { Link } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { GAME_MODES } from '../config/gameConfig';

export function HomePage() {
  const { player } = useGameContext();

  return (
    <div className="page home-page">
      <HeroSection />

      <section className="home-features">
        <h2 className="section-title">Think fast. Guess smart.</h2>
        <p className="section-subtitle">
          How good are you at reading the numbers? Build your streak. Beat your score. Become a Number Hunt master.
        </p>

        <div className="features-grid">
          {Object.values(GAME_MODES).map((mode) => (
            <Card key={mode.id} hover className="feature-card">
              <span className="feature-card__icon">{mode.icon}</span>
              <h3 className="feature-card__title">{mode.label}</h3>
              <p className="feature-card__desc">{mode.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {player.gamesPlayed > 0 && (
        <section className="home-stats-preview">
          <Card className="stats-preview-card">
            <div className="stats-preview-card__item">
              <span className="stats-preview-card__label">Level</span>
              <span className="stats-preview-card__value">{player.level}</span>
            </div>
            <div className="stats-preview-card__item">
              <span className="stats-preview-card__label">Best Streak</span>
              <span className="stats-preview-card__value">🔥 {player.bestStreak}</span>
            </div>
            <div className="stats-preview-card__item">
              <span className="stats-preview-card__label">Best Score</span>
              <span className="stats-preview-card__value">{player.bestScore.toLocaleString()}</span>
            </div>
            <Link to="/statistics" className="stats-preview-card__link">
              View all stats →
            </Link>
          </Card>
        </section>
      )}
    </div>
  );
}
