import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { tr } from '../../i18n/tr';

const NAV_ITEMS = [
  { to: '/', label: tr.nav.home },
  { to: '/play', label: tr.nav.play },
  { to: '/statistics', label: tr.nav.statistics },
  { to: '/achievements', label: tr.nav.achievements },
  { to: '/settings', label: tr.nav.settings },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="header__inner">
        <NavLink to="/" className="header__logo" onClick={closeMenu}>
          <span className="header__logo-icon">#</span>
          NUMBER HUNT
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
              className={({ isActive }) =>
                `header__link ${isActive || (item.to !== '/' && location.pathname.startsWith(item.to)) ? 'header__link--active' : ''}`
              }
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
