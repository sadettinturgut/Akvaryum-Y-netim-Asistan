import React from 'react';
import Card from '../ui/Card';

const ToggleSwitch: React.FC<{ label: string, enabled: boolean, onChange: (enabled: boolean) => void }> = ({ label, enabled, onChange }) => (
    <div className="flex items-center justify-between">
        <span className="text-aqua-text-primary">{label}</span>
        <button
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-aqua-accent' : 'bg-aqua-light'}`}
        >
            <span className={`inline-block w-4 h-4 transform bg-aqua-deep rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

type Theme = 'dark' | 'neon' | 'natural';

interface SettingsProps {
    theme: Theme;
    onThemeChange: (theme: Theme) => void;
}


const Settings: React.FC<SettingsProps> = ({ theme, onThemeChange }) => {
    const [notifications, setNotifications] = React.useState({
        maintenance: true,
        criticalValues: true,
        feedingTime: false,
    });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-aqua-text-primary">Ayarlar</h1>

      <Card title="Görünüm ve Tema">
        <div className="space-y-4">
            <div>
                <label className="block mb-2 text-sm font-medium text-aqua-text-secondary">Tema Seçimi</label>
                <div className="flex gap-2 sm:gap-4">
                    <button onClick={() => onThemeChange('dark')} className={`flex-1 py-2 text-sm sm:text-base rounded-lg transition-colors ${theme === 'dark' ? 'bg-aqua-accent text-aqua-deep' : 'bg-aqua-light'}`}>Karanlık</button>
                    <button onClick={() => onThemeChange('neon')} className={`flex-1 py-2 text-sm sm:text-base rounded-lg transition-colors ${theme === 'neon' ? 'bg-aqua-accent text-aqua-deep' : 'bg-aqua-light'}`}>Neon</button>
                    <button onClick={() => onThemeChange('natural')} className={`flex-1 py-2 text-sm sm:text-base rounded-lg transition-colors ${theme === 'natural' ? 'bg-aqua-accent text-aqua-deep' : 'bg-aqua-light'}`}>Doğal</button>
                </div>
            </div>
            <div>
                <label htmlFor="language" className="block mb-2 text-sm font-medium text-aqua-text-secondary">Dil</label>
                <select id="language" className="bg-aqua-light border border-aqua-light text-aqua-text-primary text-sm rounded-lg focus:ring-aqua-accent focus:border-aqua-accent block w-full p-2.5">
                    <option selected>Türkçe</option>
                    <option value="EN">English</option>
                    <option value="DE">Deutsch</option>
                </select>
            </div>
        </div>
      </Card>

      <Card title="Bildirim Tercihleri">
        <div className="space-y-4">
            <ToggleSwitch
                label="Bakım hatırlatmaları"
                enabled={notifications.maintenance}
                onChange={(e) => setNotifications(p => ({ ...p, maintenance: e }))}
            />
            <ToggleSwitch
                label="Kritik su değeri uyarıları"
                enabled={notifications.criticalValues}
                onChange={(e) => setNotifications(p => ({ ...p, criticalValues: e }))}
            />
            <ToggleSwitch
                label="Yemleme zamanı bildirimleri"
                enabled={notifications.feedingTime}
                onChange={(e) => setNotifications(p => ({ ...p, feedingTime: e }))}
            />
        </div>
      </Card>
    </div>
  );
};

export default Settings;