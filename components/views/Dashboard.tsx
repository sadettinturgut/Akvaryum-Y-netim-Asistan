import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import { Page, Aquarium, AiHealthReport } from '../../types';
import { getAiHealthReport } from '../../services/geminiService';
import { getDaysRemainingForMaintenance, getDaysUntil, getCurrentDayOfWeekTR, toISODateString } from '../../utils/dateUtils';

const QuickActionButton: React.FC<{ children: React.ReactNode, icon: JSX.Element, onClick?: () => void }> = ({ children, icon, onClick }) => (
    <button onClick={onClick} className="flex-1 flex items-center justify-center text-center px-4 py-3 bg-aqua-light hover:bg-aqua-accent hover:text-aqua-deep rounded-lg transition-all duration-200 cursor-pointer">
        {icon}
        <span className="ml-2 font-semibold">{children}</span>
    </button>
);

const HealthScore: React.FC<{ score: number }> = ({ score }) => {
    const circumference = 2 * Math.PI * 52;
    const offset = circumference - (score / 100) * circumference;
    const scoreColor = score > 85 ? 'text-green-400' : score > 60 ? 'text-yellow-400' : 'text-red-400';
    const strokeColor = score > 85 ? 'stroke-green-400' : score > 60 ? 'stroke-yellow-400' : 'stroke-red-400';

    return (
        <div className="relative flex items-center justify-center w-40 h-40">
            <svg className="absolute w-full h-full" viewBox="0 0 120 120">
                <circle className="stroke-current text-aqua-light" strokeWidth="8" fill="transparent" r="52" cx="60" cy="60" />
                <circle
                    className={`stroke-current ${strokeColor} transition-all duration-1000 ease-in-out`}
                    strokeWidth="8" strokeLinecap="round" fill="transparent" r="52" cx="60" cy="60"
                    style={{ strokeDasharray: circumference, strokeDashoffset: offset, transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
            </svg>
            <div className="flex flex-col items-center">
                <span className={`text-4xl font-bold ${scoreColor}`}>{score}</span>
                <span className="text-sm text-aqua-text-secondary">Sağlık Puanı</span>
            </div>
        </div>
    );
};

interface DashboardProps {
  onNavigate: (page: Page) => void;
  aquarium: Aquarium;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, aquarium }) => {
    const [report, setReport] = useState<AiHealthReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAiHealthReport(aquarium);
            setReport(result);
        } catch (err: any) {
            setError(err.message || 'Rapor alınamadı.');
        } finally {
            setLoading(false);
        }
    };

    const overviewData = useMemo(() => {
        const volume = (aquarium.width * aquarium.length * aquarium.height) / 1000;
        const fishCount = aquarium.fish.reduce((sum, f) => sum + f.count, 0);
        const plantCount = (aquarium.plants || []).reduce((sum, p) => sum + p.count, 0);
        const lastLog = aquarium.waterLogs[0];
        return { volume, fishCount, plantCount, lastLog };
    }, [aquarium]);

    const notifications = useMemo(() => {
        const alerts: {type: 'warning' | 'critical', message: string}[] = [];
        aquarium.equipment.forEach(item => {
            const daysLeft = getDaysRemainingForMaintenance(item.lastMaintenance, item.maintenanceIntervalDays);
            if (daysLeft <= 0) {
                 alerts.push({type: 'critical', message: `${item.name} için bakım gecikti.`});
            } else if (daysLeft <= 7) {
                 alerts.push({type: 'warning', message: `${item.name} bakımına son ${daysLeft} gün.`});
            }
        });
        aquarium.upcomingMaintenance.forEach(task => {
            const daysLeft = getDaysUntil(task.dueDate);
            if (daysLeft < 0) {
                alerts.push({type: 'critical', message: `'${task.task}' görevi gecikti.`});
            } else if (daysLeft <= 2) {
                 alerts.push({type: 'warning', message: `'${task.task}' görevi yaklaşıyor.`});
            }
        });
        if (overviewData.lastLog && overviewData.lastLog.no3 > 20) {
            alerts.push({type: 'critical', message: `Nitrat (NO₃) seviyesi yüksek: ${overviewData.lastLog.no3} mg/L.`});
        }
        return alerts;
    }, [aquarium, overviewData.lastLog]);

    const todaysTasks = useMemo(() => {
        const tasks: { type: string, text: string }[] = [];
        const todayStr = toISODateString(new Date());
        const todayDayName = getCurrentDayOfWeekTR();
        aquarium.feedingSchedule.forEach(feed => {
            if (feed.days.includes(todayDayName)) tasks.push({type: 'Yemleme', text: `${feed.time} - ${feed.foodType}`});
        });
        aquarium.upcomingMaintenance.forEach(task => {
            if (task.dueDate === todayStr) tasks.push({type: 'Bakım', text: task.task});
        });
        return tasks;
    }, [aquarium]);
    
  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row gap-4">
            <QuickActionButton icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8.75 3.75a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5zM11.25 3.75a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5zM3.5 8.75a.75.75 0 01.75-.75h11.5a.75.75 0 010 1.5H4.25a.75.75 0 01-.75-.75zM12 11.75a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5zM9.5 11.75a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"/></svg>} onClick={() => onNavigate('feeding-plan')}>Yem Ver</QuickActionButton>
            <QuickActionButton icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M15.5 3A2.5 2.5 0 0013 5.5v2.879a.5.5 0 01-.146.353l-4.209 4.21a2.5 2.5 0 103.536 3.535l4.209-4.21a.5.5 0 01.354-.147H19.5a.5.5 0 00.5-.5v-2a.5.5 0 00-.5-.5h-2.121A2.5 2.5 0 0015.5 3zM4 4.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-.5-.5h-2a.5.5 0 01-.5-.5v-2zM4 9.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zM4 12.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5z" clipRule="evenodd" /></svg>} onClick={() => onNavigate('maintenance')}>Su Değiştir</QuickActionButton>
            <QuickActionButton icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" /></svg>} onClick={() => onNavigate('water-parameters')}>Değer Gir</QuickActionButton>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Genel Bakış">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div><p className="text-2xl font-bold text-aqua-accent">{overviewData.volume.toFixed(0)} L</p><p className="text-sm text-aqua-text-secondary">Hacim</p></div>
                    <div><p className="text-2xl font-bold text-aqua-accent">{overviewData.fishCount}</p><p className="text-sm text-aqua-text-secondary">Balık</p></div>
                    <div><p className="text-2xl font-bold text-aqua-accent">{overviewData.plantCount}</p><p className="text-sm text-aqua-text-secondary">Bitki</p></div>
                    <div>
                        <p className="text-2xl font-bold text-aqua-accent">{overviewData.lastLog ? `${overviewData.lastLog.temperature}°C` : 'N/A'}</p>
                        <p className="text-sm text-aqua-text-secondary">Sıcaklık</p>
                    </div>
                </div>
            </Card>
            <Card title="Bugünün Görevleri">
                {todaysTasks.length > 0 ? (
                    <ul className="space-y-2">
                        {todaysTasks.map((task, i) => (
                            <li key={i} className="flex items-center"><span className={`text-xs font-bold mr-2 px-2 py-0.5 rounded-full ${task.type === 'Yemleme' ? 'bg-green-800/50 text-green-300' : 'bg-blue-800/50 text-blue-300'}`}>{task.type}</span><span className="text-aqua-text-secondary">{task.text}</span></li>
                        ))}
                    </ul>
                ) : <p className="text-aqua-text-secondary text-sm">Bugün için planlanmış bir görev yok.</p>}
            </Card>
        </div>

        {notifications.length > 0 && (
             <Card title="Uyarılar ve Bildirimler" titleIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}>
                 <ul className="space-y-2">
                     {notifications.map((n, i) => (
                         <li key={i} className={`flex items-start p-2 rounded-md ${n.type === 'critical' ? 'bg-red-900/30' : 'bg-yellow-900/20'}`}>
                             <span className={`mr-2 mt-1 ${n.type === 'critical' ? 'text-red-400' : 'text-yellow-400'}`}>•</span>
                             <span className="text-aqua-text-secondary">{n.message}</span>
                         </li>
                     ))}
                 </ul>
             </Card>
        )}

      <Card title="Yapay Zeka Akvaryum Sağlık Analizi">
        {loading && (
            <div className="flex justify-center items-center p-8"><svg className="animate-spin h-8 w-8 text-aqua-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p className="ml-4 text-aqua-text-secondary">Akvaryum sağlığınız analiz ediliyor...</p></div>
        )}
        {error && <p className="text-red-400 text-center">{error}</p>}
        {!loading && !report && (
             <div className="text-center p-4">
                 <p className="text-aqua-text-secondary mb-4">Akvaryumunuzun genel sağlık durumunu, canlı yükünü ve su değerlerini yapay zeka ile analiz edin.</p>
                 <button onClick={handleAnalyze} className="bg-aqua-accent text-aqua-deep font-bold py-2 px-5 rounded-lg hover:bg-opacity-80 transition-all duration-200">Analiz Yap</button>
            </div>
        )}
        {report && (
            <div className="animate-fade-in">
                <div className="flex flex-col lg:flex-row gap-6 items-center">
                    <div className="flex-shrink-0"><HealthScore score={report.score} /></div>
                    <div className="flex-1 text-center lg:text-left">
                        <h3 className="text-xl font-bold text-aqua-text-primary">Genel Durum</h3>
                        <p className="text-aqua-text-secondary mt-1">{report.summary}</p>
                    </div>
                     <button onClick={handleAnalyze} className="bg-aqua-light text-aqua-text-primary text-sm font-semibold py-2 px-4 rounded-lg hover:bg-aqua-accent hover:text-aqua-deep transition-colors duration-200">Tekrar Analiz Et</button>
                </div>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 border-t border-aqua-light pt-6">
                    <Card><h4 className="font-semibold text-green-400 mb-2">Olumlu Gözlemler</h4><ul className="space-y-1 list-disc list-inside text-aqua-text-secondary">{report.positives.map((item,i) => <li key={i}>{item}</li>)}</ul></Card>
                    <Card><h4 className="font-semibold text-yellow-400 mb-2">Eyleme Geçirilebilir Öneriler</h4><ul className="space-y-1 list-disc list-inside text-aqua-text-secondary">{report.recommendations.map((item,i) => <li key={i}>{item}</li>)}</ul></Card>
                 </div>
            </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
