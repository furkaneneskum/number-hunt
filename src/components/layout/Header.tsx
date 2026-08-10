import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { tr, BRAND_NAME } from '../../i18n/tr';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/', label: tr.nav.home, end: true },
  { to: '/play', label: tr.nav.play, end: false },
  { to: '/statistics', label: tr.nav.statistics, end: false },
  { to: '/achievements', label: tr.nav.achievements, end: false },
  { to: '/settings', label: tr.nav.settings, end: false },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { username, logout } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header__inner">
        <NavLink to="/" className="header__logo" onClick={closeMenu}>
          <span className="header__logo-icon">#</span>
          {BRAND_NAME}
        </NavLink>

        <button
          className="header__menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? tr.nav.closeMenu : tr.nav.openMenu}
          aria-expanded={menuOpen}
        >
          <span className={`hamburger ${menuOpen ? 'hamburger--open' : ''}`} />
        </button>

        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`} aria-label="Ana menü">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `header__link ${isActive ? 'header__link--active' : ''}`
              }
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          ))}
          {username && (
            <div className="header__user">
              <span className="header__user-badge">{username}</span>
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
