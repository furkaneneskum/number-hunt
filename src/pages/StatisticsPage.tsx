import { useGameContext } from '../context/GameContext';
import { Card } from '../components/ui/Card';
import { getFavoriteDifficulty } from '../services/gameLogic';

export function StatisticsPage() {
  const { player } = useGameContext();

  if (player.gamesPlayed === 0) {
    return (
      <div className="page stats-page">
        <h1 className="page-title">Statistics</h1>
        <Card className="empty-state">
          <p>Play your first game to see statistics.</p>
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
      <h1 className="page-title">Statistics</h1>
      <p className="page-subtitle">Your Number Hunt performance</p>

      <div className="stats-grid">
        <Card className="stat-card">
          <span className="stat-card__label">Games Played</span>
          <span className="stat-card__value">{player.gamesPlayed}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">Games Won</span>
          <span className="stat-card__value stat-card__value--win">{player.gamesWon}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">Games Lost</span>
          <span className="stat-card__value stat-card__value--loss">{player.gamesLost}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">Win Rate</span>
          <span className="stat-card__value">{winRate}%</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">Total Guesses</span>
          <span className="stat-card__value">{player.totalGuesses}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">Avg. Guesses</span>
          <span className="stat-card__value">{avgGuesses}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">Best Score</span>
          <span className="stat-card__value">{player.bestScore.toLocaleString()}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">Best Streak</span>
          <span className="stat-card__value">🔥 {player.bestStreak}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">Total XP</span>
          <span className="stat-card__value">{player.xp.toLocaleString()}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">Current Level</span>
          <span className="stat-card__value">{player.level}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">Favorite Difficulty</span>
          <span className="stat-card__value">{getFavoriteDifficulty(player)}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">Time Attack Best</span>
          <span className="stat-card__value">{player.timeAttackBest}</span>
        </Card>
      </div>

      <div className="charts-section">
        <Card className="chart-card">
          <h3 className="chart-card__title">Games Won / Lost</h3>
          <div className="bar-chart">
            <div className="bar-chart__bar bar-chart__bar--win" style={{ flex: player.gamesWon || 1 }}>
              <span>Won {player.gamesWon}</span>
            </div>
            <div className="bar-chart__bar bar-chart__bar--loss" style={{ flex: player.gamesLost || 1 }}>
              <span>Lost {player.gamesLost}</span>
            </div>
          </div>
        </Card>

        {player.scoreHistory.length > 0 && (
          <Card className="chart-card">
            <h3 className="chart-card__title">Score History</h3>
            <div className="line-chart">
              {player.scoreHistory.map((score, i) => {
                const max = Math.max(...player.scoreHistory, 1);
                const height = (score / max) * 100;
                return (
                  <div
                    key={i}
                    className="line-chart__bar"
                    style={{ height: `${Math.max(height, 5)}%` }}
                    title={`${score} pts`}
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
