import { useGameContext } from '../context/GameContext';
import { Card } from '../components/ui/Card';
import { getFavoriteDifficulty } from '../services/gameLogic';
import { tr } from '../i18n/tr';

export function StatisticsPage() {
  const { player } = useGameContext();

  if (player.gamesPlayed === 0) {
    return (
      <div className="page stats-page">
        <h1 className="page-title">{tr.statistics.title}</h1>
        <Card className="empty-state">
          <p>{tr.statistics.empty}</p>
        </Card>
      </div>
    );
  }

  const winRate =
    player.gamesPlayed > 0
      ? Math.round((player.gamesWon / player.gamesPlayed) * 100)
      : 0;
  const avgGuesses =
    player.gamesWon > 0 ? (player.totalGuesses / player.gamesWon).toFixed(1) : '0';

  return (
    <div className="page stats-page">
      <h1 className="page-title">{tr.statistics.title}</h1>
      <p className="page-subtitle">{tr.statistics.subtitle}</p>

      <div className="stats-grid">
        <Card className="stat-card">
          <span className="stat-card__label">{tr.statistics.gamesPlayed}</span>
          <span className="stat-card__value">{player.gamesPlayed}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">{tr.statistics.gamesWon}</span>
          <span className="stat-card__value stat-card__value--win">{player.gamesWon}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">{tr.statistics.gamesLost}</span>
          <span className="stat-card__value stat-card__value--loss">{player.gamesLost}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">{tr.statistics.winRate}</span>
          <span className="stat-card__value">{winRate}%</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">{tr.statistics.totalGuesses}</span>
          <span className="stat-card__value">{player.totalGuesses}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">{tr.statistics.avgGuesses}</span>
          <span className="stat-card__value">{avgGuesses}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">{tr.statistics.bestScore}</span>
          <span className="stat-card__value">{player.bestScore.toLocaleString('tr-TR')}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">{tr.statistics.bestStreak}</span>
          <span className="stat-card__value">🔥 {player.bestStreak}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">{tr.statistics.totalXp}</span>
          <span className="stat-card__value">{player.xp.toLocaleString('tr-TR')}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">{tr.statistics.currentLevel}</span>
          <span className="stat-card__value">{player.level}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">{tr.statistics.favoriteDifficulty}</span>
          <span className="stat-card__value">{getFavoriteDifficulty(player)}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">{tr.statistics.timeAttackBest}</span>
          <span className="stat-card__value">{player.timeAttackBest}</span>
        </Card>
      </div>

      <div className="charts-section">
        <Card className="chart-card">
          <h3 className="chart-card__title">{tr.statistics.gamesWonLost}</h3>
          <div className="bar-chart">
            <div className="bar-chart__bar bar-chart__bar--win" style={{ flex: player.gamesWon || 1 }}>
              <span>{tr.statistics.won} {player.gamesWon}</span>
            </div>
            <div className="bar-chart__bar bar-chart__bar--loss" style={{ flex: player.gamesLost || 1 }}>
              <span>{tr.statistics.lost} {player.gamesLost}</span>
            </div>
          </div>
        </Card>

        {player.scoreHistory.length > 0 && (
          <Card className="chart-card">
            <h3 className="chart-card__title">{tr.statistics.scoreHistory}</h3>
            <div className="line-chart">
              {player.scoreHistory.map((score, i) => {
                const max = Math.max(...player.scoreHistory, 1);
                const height = (score / max) * 100;
                return (
                  <div
                    key={i}
                    className="line-chart__bar"
                    style={{ height: `${Math.max(height, 5)}%` }}
                    title={`${score} puan`}
                  />
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
