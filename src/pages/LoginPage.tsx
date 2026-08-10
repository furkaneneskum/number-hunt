import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BRAND_NAME, tr } from '../i18n/tr';
import { Button } from '../components/ui/Button';

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = login(username);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-page__bg" aria-hidden="true">
        <div className="login-page__orb login-page__orb--1" />
        <div className="login-page__orb login-page__orb--2" />
        <div className="login-page__grid" />
      </div>

      <div className="login-card">
        <div className="login-card__brand">
          <span className="login-card__logo">#</span>
          <h1>{BRAND_NAME}</h1>
          <p className="login-card__tagline">{tr.login.tagline}</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username" className="login-form__label">
            {tr.login.usernameLabel}
          </label>
          <input
            id="username"
            className="login-form__input"
            type="text"
            placeholder={tr.login.usernamePlaceholder}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError('');
            }}
            autoComplete="username"
            autoFocus
            maxLength={16}
          />
          {error && (
            <p className="login-form__error" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" size="lg" className="login-form__submit">
            {tr.login.submit}
          </Button>
        </form>

        <p className="login-card__hint">{tr.login.hint}</p>
      </div>
    </div>
  );
}
