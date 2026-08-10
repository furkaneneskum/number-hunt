import { useAuth } from '../../context/AuthContext';
import { tr } from '../../i18n/tr';

function getRankIcon(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
}

export function LeaderboardSidebar() {
  const { leaderboard, username } = useAuth();

  return (
    <aside className="leaderboard-sidebar" aria-label={tr.leaderboard.title}>
      <div className="leaderboard-sidebar__header">
        <span className="leaderboard-sidebar__icon">🏆</span>
        <h2 className="leaderboard-sidebar__title">{tr.leaderboard.title}</h2>
        <span className="leaderboard-sidebar__count">{leaderboard.length}</span>
      </div>

      <div className="leaderboard-sidebar__list">
        {leaderboard.length === 0 ? (
          <p className="leaderboard-sidebar__empty">{tr.leaderboard.empty}</p>
        ) : (
          leaderboard.map((entry, index) => (
            <div
              key={entry.username}
              className={`leaderboard-item ${entry.isCurrentUser ? 'leaderboard-item--active' : ''} ${index < 3 ? `leaderboard-item--top${index + 1}` : ''}`}
            >
              <span className="leaderboard-item__rank">{getRankIcon(index + 1)}</span>
              <div className="leaderboard-item__info">
                <span className="leaderboard-item__name">
                  {entry.username}
                  {entry.isCurrentUser && (
                    <span className="leaderboard-item__you">{tr.leaderboard.you}</span>
                  )}
                </span>
                <span className="leaderboard-item__meta">
                  {tr.leaderboard.level} {entry.level} · 🔥 {entry.bestStreak}
                </span>
              </div>
              <span className="leaderboard-item__score">
                {entry.score.toLocaleString('tr-TR')}
              </span>
            </div>
          ))
        )}
      </div>

      {username && (
        <div className="leaderboard-sidebar__footer">
          <span className="leaderboard-sidebar__logged-as">{tr.leaderboard.loggedAs}</span>
          <strong>{username}</strong>
        </div>
      )}
    </aside>
  );
}
