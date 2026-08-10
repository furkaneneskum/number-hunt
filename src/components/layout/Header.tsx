import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { tr, BRAND_NAME } from '../../i18n/tr';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/', label: tr.nav.home },
  { to: '/play', label: tr.nav.play },
  { to: '/statistics', label: tr.nav.statistics },
  { to: '/achievements', label: tr.nav.achievements },
  { to: '/settings', label: tr.nav.settings },
];

function isActiveRoute(current: string, path: string): boolean {
  if (path === '/') return current === '/' || current === '';
  return current === path || current.startsWith(`${path}/`);
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { username, logout } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  const goTo = (path: string) => {
    closeMenu();
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header__inner">
        <button type="button" className="header__logo" onClick={() => goTo('/')}>
          <span className="header__logo-icon">#</span>
          {BRAND_NAME}
        </button>

        <button
          type="button"
          className="header__menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? tr.nav.closeMenu : tr.nav.openMenu}
          aria-expanded={menuOpen}
        >
          <span className={`hamburger ${menuOpen ? 'hamburger--open' : ''}`} />
        </button>

        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`} aria-label="Ana menü">
          <div className="header__links">
            {NAV_ITEMS.map((item) => {
              const active = isActiveRoute(location.pathname, item.to);
              return (
                <button
                  key={item.to}
                  type="button"
                  className={`header__link ${active ? 'header__link--active' : ''}`}
                  onClick={() => goTo(item.to)}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          {username && (
            <div className="header__user">
              <span className="header__user-badge" title={tr.leaderboard.loggedAs}>
                👤 {username}
              </span>
              <button type="button" className="header__logout" onClick={handleLogout}>
                {tr.nav.logout}
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
