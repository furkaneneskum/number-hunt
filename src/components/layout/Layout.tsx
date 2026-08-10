import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { useGameContext } from '../../context/GameContext';
import { Modal } from '../ui/Modal';
import { getAchievementById } from '../../config/achievements';

export function Layout() {
  const { showLevelUp, showStreakLost, newAchievements, player, dismissLevelUp, dismissAchievements } =
    useGameContext();

  return (
    <div className="layout">
      <Header />
      <main className="main">
        <Outlet />
      </main>

      {showLevelUp && (
        <div className="toast toast--level-up" role="alert">
          <span className="toast__emoji">🎉</span>
          <div>
            <strong>LEVEL UP!</strong>
            <p>You reached Level {player.level}</p>
          </div>
          <button className="toast__close" onClick={dismissLevelUp} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      {showStreakLost && (
        <div className="toast toast--streak-lost" role="alert">
          <strong>STREAK LOST</strong>
        </div>
      )}

      {newAchievements.length > 0 && (
        <Modal open onClose={dismissAchievements} title="Achievement Unlocked!" className="modal--achievement">
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
            Awesome!
          </button>
        </Modal>
      )}
    </div>
  );
}
