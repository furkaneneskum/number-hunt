import { useGameContext } from '../context/GameContext';
import { ACHIEVEMENTS } from '../config/achievements';
import { Card } from '../components/ui/Card';
import { tr } from '../i18n/tr';

export function AchievementsPage() {
  const { player } = useGameContext();
  const unlocked = player.achievements;

  const unlockedCount = ACHIEVEMENTS.filter((a) => unlocked.includes(a.id)).length;

  return (
    <div className="page achievements-page">
      <h1 className="page-title">{tr.achievements.title}</h1>
      <p className="page-subtitle">
        {tr.achievements.unlocked(unlockedCount, ACHIEVEMENTS.length)}
      </p>

      {unlockedCount === 0 && (
        <Card className="empty-state">
          <p>{tr.achievements.empty}</p>
        </Card>
      )}

      <div className="achievements-grid">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = unlocked.includes(ach.id);
          return (
            <Card
              key={ach.id}
              className={`achievement-card ${isUnlocked ? 'achievement-card--unlocked' : 'achievement-card--locked'}`}
            >
              <span className="achievement-card__icon">
                {isUnlocked ? ach.icon : '🔒'}
              </span>
              <div className="achievement-card__info">
                <h3 className="achievement-card__title">{ach.title}</h3>
                <p className="achievement-card__desc">{ach.description}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
