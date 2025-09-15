import React, { useState } from 'react';
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


const Settings: React.FC = () => {
    const [notifications, setNotifications] = useState({
        maintenance: true,
        criticalValues: true,
        feedingTime: false,
    });
    const [theme, setTheme] = useState<'dark' | 'neon' | 'natural'>('dark');

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card title="Kullanıcı Profili">
          <div className="flex items-center space-x-4">
              <img src="https://i.pravatar.cc/80" alt="User Avatar" className="w-20 h-20 rounded-full"/>
              <div>
                  <h3 className="text-xl font-bold text-aqua-text-primary">Akvaryum Meraklısı</h3>
                  <p className="text-aqua-text-secondary">Toplam Akvaryum Sayısı: 2</p>
                  <button className="text-sm text-aqua-accent mt-1 hover:underline">Profili Düzenle</button>
              </div>
          </div>
      </Card>
      
       <Card title="Akvaryum Profilleri">
            <p className="text-aqua-text-secondary text-sm mb-3">Akvaryumlarınız arasında geçiş yapabilir ve ayarlarını yönetebilirsiniz.</p>
            <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-aqua-light rounded-md">
                    <span className="font-semibold">Tropikal Cennet</span>
                    <button className="text-xs text-aqua-accent hover:underline">Yönet</button>
                </div>
                 <div className="flex justify-between items-center p-3 bg-aqua-light rounded-md">
                    <span className="font-semibold">Karides Kolonisi</span>
                    <button className="text-xs text-aqua-accent hover:underline">Yönet</button>
                </div>
            </div>
             <button className="w-full mt-4 text-center py-2 bg-aqua-light hover:bg-opacity-80 rounded-md text-aqua-accent font-semibold">Yeni Akvaryum Ekle</button>
       </Card>

      <Card title="Görünüm ve Tema">
        <div className="space-y-4">
            <div>
                <label className="block mb-2 text-sm font-medium text-aqua-text-secondary">Tema Seçimi</label>
                <div className="flex gap-2 sm:gap-4">
                    <button onClick={() => setTheme('dark')} className={`flex-1 py-2 text-sm sm:text-base rounded-lg ${theme === 'dark' ? 'bg-aqua-accent text-aqua-deep' : 'bg-aqua-light'}`}>Karanlık</button>
                    <button onClick={() => setTheme('neon')} className={`flex-1 py-2 text-sm sm:text-base rounded-lg ${theme === 'neon' ? 'bg-aqua-accent text-aqua-deep' : 'bg-aqua-light'}`}>Neon</button>
                    <button onClick={() => setTheme('natural')} className={`flex-1 py-2 text-sm sm:text-base rounded-lg ${theme === 'natural' ? 'bg-aqua-accent text-aqua-deep' : 'bg-aqua-light'}`}>Doğal</button>
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
