import { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { Card } from '../components/ui/Card';
import { ConfirmModal } from '../components/ui/Modal';
import { tr } from '../i18n/tr';
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
        <span className="setting-toggle__text">{checked ? tr.settings.on : tr.settings.off}</span>
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
      <h1 className="page-title">{tr.settings.title}</h1>
      <p className="page-subtitle">{tr.settings.subtitle}</p>

      <Card className="settings-panel">
        <Toggle
          label={tr.settings.sound}
          checked={settings.sound}
          onChange={(v) => updateSettings({ sound: v })}
        />
        <Toggle
          label={tr.settings.animations}
          checked={settings.animations}
          onChange={(v) => updateSettings({ animations: v })}
        />

        <div className="setting-theme">
          <span className="setting-toggle__label">{tr.settings.theme}</span>
          <div className="theme-toggle">
            {(['dark', 'light'] as Theme[]).map((t) => (
              <button
                key={t}
                className={`theme-toggle__btn ${settings.theme === t ? 'theme-toggle__btn--active' : ''}`}
                onClick={() => updateSettings({ theme: t })}
                aria-pressed={settings.theme === t}
              >
                {t === 'dark' ? tr.settings.dark : tr.settings.light}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="settings-panel settings-panel--danger">
        <h3 className="settings-panel__title">{tr.settings.dangerZone}</h3>
        <p className="settings-panel__desc">{tr.settings.dangerDesc}</p>
        <button className="btn btn--danger" onClick={() => setShowReset(true)}>
          {tr.settings.resetProgress}
        </button>
      </Card>

      <ConfirmModal
        open={showReset}
        onClose={() => setShowReset(false)}
        onConfirm={resetProgress}
        title={tr.settings.confirmTitle}
        message={tr.settings.confirmMessage}
        confirmLabel={tr.settings.confirm}
        cancelLabel={tr.settings.cancel}
        danger
      />
    </div>
  );
}
