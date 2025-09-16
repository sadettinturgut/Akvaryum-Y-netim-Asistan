import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import { Aquarium, WaterLog, MaintenanceLog, Fish, FeedingScheduleItem } from '../../types';

// Helper to format date to YYYY-MM-DD, respecting local date
const toISODateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Helper to get day of the week in Turkish from a YYYY-MM-DD string
const getDayOfWeek = (dateString: string): ('Pzt' | 'Sal' | 'Çar' | 'Per' | 'Cum' | 'Cmt' | 'Paz') => {
    // Adding T12:00:00 to avoid timezone issues where it might flip to the previous day
    const date = new Date(`${dateString}T12:00:00`); 
    const jsDayIndex = date.getDay(); // 0 for Sunday, 1 for Monday...
    const dayMap: { [key: number]: ('Pzt' | 'Sal' | 'Çar' | 'Per' | 'Cum' | 'Cmt' | 'Paz')} = {
        1: 'Pzt', 
        2: 'Sal', 
        3: 'Çar', 
        4: 'Per', 
        5: 'Cum', 
        6: 'Cmt',
        0: 'Paz'
    };
    return dayMap[jsDayIndex];
};


const ActivitySection: React.FC<{ title: string; icon: JSX.Element; children: React.ReactNode; emptyText?: string }> = ({ title, icon, children, emptyText }) => {
    const childrenArray = React.Children.toArray(children);
    // FIX: The `.some` check was redundant and caused a type error because `React.Children.toArray` filters out booleans.
    const hasContent = childrenArray.length > 0;
    
    const content = hasContent 
        ? <div className="space-y-2">{children}</div>
        : <p className="text-aqua-text-secondary text-sm">{emptyText || 'Bu tarihte kayıtlı aktivite bulunamadı.'}</p>;

    return (
        <Card>
            <div className="flex items-center mb-4">
                <span className="text-aqua-accent mr-3">{icon}</span>
                <h3 className="text-lg font-semibold text-aqua-text-primary">{title}</h3>
            </div>
            {content}
        </Card>
    );
};


interface ReportsProps {
    aquarium: Aquarium;
}

const Reports: React.FC<ReportsProps> = ({ aquarium }) => {
    const [selectedDate, setSelectedDate] = useState(toISODateString(new Date()));

    const dailyData = useMemo(() => {
        const waterLogs: WaterLog[] = aquarium.waterLogs.filter(log => log.date === selectedDate);
        const maintenanceLogs: MaintenanceLog[] = aquarium.maintenanceLogs.filter(log => log.date === selectedDate);
        const newFish: Fish[] = aquarium.fish.filter(f => f.addedDate === selectedDate);
        
        const dayOfWeek = getDayOfWeek(selectedDate);
        const feedings: FeedingScheduleItem[] = aquarium.feedingSchedule.filter(item => item.days.includes(dayOfWeek));

        return { waterLogs, maintenanceLogs, newFish, feedings };
    }, [selectedDate, aquarium]);

    const WaterIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M12 21a9 9 0 110-18 9 9 0 010 18z" /></svg>;
    const MaintenanceIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
    const FishIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 12.5c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.5c0 4.142-3.358 7.5-7.5 7.5S6 16.642 6 12.5c0-2.454 1.12-4.665 2.894-6.106C10.878 4.607 13.6 3.5 16.5 3.5c2.9 0 5.622 1.107 7.606 2.894C20.88 7.835 21 10.046 21 12.5zM11.5 10.5C11.5 8.015 9.485 6 7 6s-4.5 2.015-4.5 4.5S4.515 15 7 15s4.5-2.015 4.5-4.5z"/></svg>;
    const FeedingIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>;

    return (
        <div className="space-y-6">
            <Card>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-2xl font-bold text-aqua-text-primary">Günlük Aktivite Raporu</h2>
                    <input 
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none text-aqua-text-primary"
                    />
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActivitySection title="Su Değeri Ölçümleri" icon={WaterIcon} emptyText="Bu tarihte su değeri ölçümü yapılmadı.">
                    {dailyData.waterLogs.map(log => (
                        <div key={log.id} className="text-sm bg-aqua-light p-2 rounded-md">
                            <p>Sıcaklık: {log.temperature}°C, pH: {log.ph}, TDS: {log.tds}ppm, NO₃: {log.no3}mg/L, KH: {log.kh}dKH, GH: {log.gh}dGH</p>
                        </div>
                    ))}
                </ActivitySection>
                
                <ActivitySection title="Bakım Aktiviteleri" icon={MaintenanceIcon} emptyText="Bu tarihte bakım aktivitesi kaydedilmedi.">
                    {dailyData.maintenanceLogs.map(log => (
                        <div key={log.id} className="text-sm p-2 bg-aqua-light rounded-md list-none">
                            <p className="font-semibold text-aqua-text-primary">{log.task}</p>
                            <p className="text-xs text-aqua-text-secondary italic">"{log.notes}"</p>
                        </div>
                    ))}
                </ActivitySection>

                <ActivitySection title="Yemleme Planı" icon={FeedingIcon} emptyText="Bu gün için yemleme planı yok.">
                    {dailyData.feedings.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm p-2 bg-aqua-light rounded-md list-none">
                            <div>
                                <span className="font-bold text-aqua-accent">{item.time}</span>
                                <span className="text-aqua-text-primary"> - {item.foodType}</span>
                            </div>
                            <span className="text-xs text-aqua-text-secondary">{item.amount}</span>
                        </div>
                    ))}
                </ActivitySection>

                <ActivitySection title="Yeni Eklenen Canlılar" icon={FishIcon} emptyText="Bu tarihte yeni canlı eklenmedi.">
                    {dailyData.newFish.map(fish => (
                        <div key={fish.id} className="text-sm p-2 bg-aqua-light rounded-md list-none">
                            <p className="font-semibold text-aqua-text-primary">{fish.name} ({fish.count} adet)</p>
                            <p className="text-xs text-aqua-text-secondary">{fish.species}</p>
                        </div>
                    ))}
                </ActivitySection>
            </div>

            <div className="flex gap-4 mt-2">
                 <button className="flex-1 bg-aqua-light hover:bg-aqua-accent hover:text-aqua-deep font-bold py-3 px-4 rounded-lg transition-all duration-200">Raporu PDF Olarak Dışa Aktar</button>
                 <button className="flex-1 bg-aqua-light hover:bg-aqua-accent hover:text-aqua-deep font-bold py-3 px-4 rounded-lg transition-all duration-200">Raporu Excel Olarak Dışa Aktar</button>
            </div>
        </div>
    );
};

export default Reports;