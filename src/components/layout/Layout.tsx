import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { LeaderboardSidebar } from './LeaderboardSidebar';
import { AmbientBackground } from '../effects/AmbientBackground';
import { useGameContext } from '../../context/GameContext';
import { Modal } from '../ui/Modal';
import { getAchievementById } from '../../config/achievements';
import { tr } from '../../i18n/tr';

export function Layout() {
  const location = useLocation();
  const { showLevelUp, showStreakLost, newAchievements, player, dismissLevelUp, dismissAchievements, endGame, gameState } =
    useGameContext();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/play' && gameState) {
      endGame();
    }
  }, [location.pathname, gameState, endGame]);

  return (
    <div className="layout">
      <AmbientBackground />
      <div className="app-shell">
        <LeaderboardSidebar />
        <div className="app-shell__main">
          <Header />
          <main className="main">
            <div key={location.pathname} className="page-transition">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {showLevelUp && (
        <div className="toast toast--level-up" role="alert">
          <span className="toast__emoji">🎉</span>
          <div>
            <strong>{tr.toast.levelUp}</strong>
            <p>{tr.toast.levelReached(player.level)}</p>
          </div>
          <button className="toast__close" onClick={dismissLevelUp} aria-label="Kapat">
            ×
          </button>
        </div>
      )}

      {showStreakLost && (
        <div className="toast toast--streak-lost" role="alert">
          <strong>{tr.toast.streakLost}</strong>
        </div>
      )}

      {newAchievements.length > 0 && (
        <Modal open onClose={dismissAchievements} title={tr.toast.achievementUnlocked} className="modal--achievement">
          {newAchievements.map((id) => {
            const ach = getAchievementById(id);
            if (!ach) return null;
            return (
              <div key={id} className="achievement-unlock">
                <span className="achievement-unlock__icon">{ach.icon}</span>
                <div>
                  <strong>{ach.title}</strong>
                  <p>{ach.description}</p>
                </div>
              </div>
            );
          })}
          <button className="btn btn--primary" onClick={dismissAchievements}>
            {tr.toast.awesome}
          </button>
        </Modal>
      )}
    </div>
  );
}
