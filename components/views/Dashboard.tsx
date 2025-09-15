import React from 'react';
import Card from '../ui/Card';
import WaterParameterChart from '../ui/WaterParameterChart';
import { Page, Aquarium } from '../../types';
import { getDaysUntil } from '../../utils/dateUtils';

const QuickActionButton: React.FC<{ children: React.ReactNode, icon: JSX.Element, onClick?: () => void }> = ({ children, icon, onClick }) => (
    <button onClick={onClick} className="flex-1 flex items-center justify-center text-center px-4 py-3 bg-aqua-light hover:bg-aqua-accent hover:text-aqua-deep rounded-lg transition-all duration-200 cursor-pointer">
        {icon}
        <span className="ml-2 font-semibold">{children}</span>
    </button>
);

const WaterParam: React.FC<{ label: string; value: string | number; unit: string }> = ({ label, value, unit }) => (
    <div className="flex justify-between items-baseline">
        <span className="text-aqua-text-secondary">{label}</span>
        <p className="text-lg font-bold text-aqua-text-primary">{value} <span className="text-sm text-aqua-text-secondary">{unit}</span></p>
    </div>
);

interface DashboardProps {
  onNavigate: (page: Page) => void;
  aquarium: Aquarium;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, aquarium }) => {
  const latestLog = aquarium.waterLogs.length > 0 ? aquarium.waterLogs[0] : null;

  const chartData = aquarium.waterLogs.slice(0, 7).map(log => ({
    name: new Date(log.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
    sicaklik: log.temperature,
    pH: log.ph,
  })).reverse();

  const chartLines = [
      { dataKey: "sicaklik" as const, stroke: "#64ffda", name: "Sıcaklık (°C)" },
      { dataKey: "pH" as const, stroke: "#8892b0", name: "pH" }
  ];
  
  const isPhCritical = latestLog && (latestLog.ph < 6.5 || latestLog.ph > 7.5);

  return (
    <div className="space-y-6">
      {isPhCritical && (
        <Card className="!bg-red-900/50 border border-red-500/50">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-300 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="font-bold text-red-300">Kritik Değer Uyarısı</h4>
              <p className="text-sm text-red-300">Mevcut pH değeri ({latestLog?.ph}) kritik seviyede. Lütfen kontrol edin.</p>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <QuickActionButton icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8.75 3.75a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5zM11.25 3.75a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5zM3.5 8.75a.75.75 0 01.75-.75h11.5a.75.75 0 010 1.5H4.25a.75.75 0 01-.75-.75zM12 11.75a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5zM9.5 11.75a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"/></svg>} onClick={() => onNavigate('feeding-plan')}>
            Yem Ver
        </QuickActionButton>
         <QuickActionButton icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M15.5 3A2.5 2.5 0 0013 5.5v2.879a.5.5 0 01-.146.353l-4.209 4.21a2.5 2.5 0 103.536 3.535l4.209-4.21a.5.5 0 01.354-.147H19.5a.5.5 0 00.5-.5v-2a.5.5 0 00-.5-.5h-2.121A2.5 2.5 0 0015.5 3zM4 4.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-2zM4 9.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zM4 12.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5z" clipRule="evenodd" /></svg>} onClick={() => onNavigate('maintenance')}>
            Su Değiştir
        </QuickActionButton>
        <QuickActionButton icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" /></svg>} onClick={() => onNavigate('water-parameters')}>
            Değer Gir
        </QuickActionButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Water Parameters */}
        <Card title="Canlı Su Değerleri" className="lg:col-span-1 space-y-3">
            {latestLog ? (
                <>
                    <WaterParam label="Sıcaklık" value={latestLog.temperature} unit="°C"/>
                    <WaterParam label="pH" value={latestLog.ph} unit=""/>
                    <WaterParam label="TDS" value={latestLog.tds} unit="ppm"/>
                    <WaterParam label="NO₃" value={latestLog.no3} unit="mg/L"/>
                    <WaterParam label="KH" value={latestLog.kh} unit="dKH"/>
                    <WaterParam label="GH" value={latestLog.gh} unit="dGH"/>
                </>
            ) : <p className="text-aqua-text-secondary">Henüz su değeri kaydı yok.</p>}
        </Card>

        {/* Chart */}
        <Card title="Haftalık Trendler" className="lg:col-span-2">
            <WaterParameterChart data={chartData} lines={chartLines} />
        </Card>

        {/* Daily Tasks */}
        <Card title="Günlük Görevler" className="lg:col-span-2">
            <ul className="space-y-3">
                <li className="flex items-center justify-between p-3 bg-aqua-light rounded-md">
                    <span className="text-aqua-text-primary">Sabah Yemlemesi</span>
                    <span className="text-xs font-bold text-aqua-accent bg-aqua-deep px-2 py-1 rounded-full">08:00</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-aqua-light rounded-md">
                    <span className="text-aqua-text-primary">Aydınlatma Kontrolü</span>
                    <span className="text-xs font-bold text-aqua-accent bg-aqua-deep px-2 py-1 rounded-full">TAMAMLANDI</span>
                </li>
                 <li className="flex items-center justify-between p-3 bg-red-900/50 rounded-md">
                    <span className="text-red-300">Akşam Yemlemesi</span>
                    <span className="text-xs font-bold text-red-300 bg-red-900 px-2 py-1 rounded-full">20:00 - BEKLİYOR</span>
                </li>
            </ul>
        </Card>

        {/* Upcoming Maintenance */}
        <Card title="Yaklaşan Bakımlar" className="lg:col-span-1">
            <ul className="space-y-3 text-aqua-text-secondary">
                 {aquarium.upcomingMaintenance.slice(0, 3).map(task => {
                    const days = getDaysUntil(task.dueDate);
                    return (
                        <li key={task.id} className="flex justify-between">
                            <span>{task.task}</span> 
                            <span className="font-bold text-aqua-text-primary">{days === 0 ? "Bugün" : days === 1 ? "Yarın" : `${days} gün sonra`}</span>
                        </li>
                    )
                 })}
            </ul>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
