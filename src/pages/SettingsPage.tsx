import { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { Card } from '../components/ui/Card';
import { ConfirmModal } from '../components/ui/Modal';
import type { Theme } from '../types';

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="setting-toggle">
      <span className="setting-toggle__label">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`setting-toggle__switch ${checked ? 'setting-toggle__switch--on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="setting-toggle__knob" />
        <span className="setting-toggle__text">{checked ? 'ON' : 'OFF'}</span>
      </button>
    </label>
  );
}

export function SettingsPage() {
  const { player, updateSettings, resetProgress } = useGameContext();
  const [showReset, setShowReset] = useState(false);
  const { settings } = player;

  return (
    <div className="page settings-page">
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">Customize your experience</p>

      <Card className="settings-panel">
        <Toggle
          label="Sound"
          checked={settings.sound}
          onChange={(v) => updateSettings({ sound: v })}
        />
        <Toggle
          label="Animations"
          checked={settings.animations}
          onChange={(v) => updateSettings({ animations: v })}
        />

        <div className="setting-theme">
          <span className="setting-toggle__label">Theme</span>
          <div className="theme-toggle">
            {(['dark', 'light'] as Theme[]).map((t) => (
              <button
                key={t}
                className={`theme-toggle__btn ${settings.theme === t ? 'theme-toggle__btn--active' : ''}`}
                onClick={() => updateSettings({ theme: t })}
                aria-pressed={settings.theme === t}
              >
                {t === 'dark' ? '🌙 Dark' : '☀️ Light'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="settings-panel settings-panel--danger">
        <h3 className="settings-panel__title">Danger Zone</h3>
        <p className="settings-panel__desc">Permanently delete all your progress.</p>
        <button className="btn btn--danger" onClick={() => setShowReset(true)}>
          Reset Progress
        </button>
      </Card>

      <ConfirmModal
        open={showReset}
        onClose={() => setShowReset(false)}
        onConfirm={resetProgress}
        title="Are you sure?"
        message="All progress will be permanently deleted."
        confirmLabel="Reset"
        cancelLabel="Cancel"
        danger
      />
    </div>
  );
}
