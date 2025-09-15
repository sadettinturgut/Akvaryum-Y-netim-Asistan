import React from 'react';
import Card from '../ui/Card';
import { Aquarium } from '../../types';
import { getDaysUntil } from '../../utils/dateUtils';


interface MaintenanceProps {
    aquarium: Aquarium;
}

const Maintenance: React.FC<MaintenanceProps> = ({ aquarium }) => {
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Yaklaşan Görevler ve Takvim">
                <ul className="space-y-3">
                    {aquarium.upcomingMaintenance.map(task => {
                        const daysRemaining = getDaysUntil(task.dueDate);
                        const urgency = daysRemaining < 1 ? 'urgent' : daysRemaining < 4 ? 'warning' : 'normal';
                        const urgencyBgClass = {
                            urgent: 'bg-red-900/50',
                            warning: 'bg-yellow-900/20',
                            normal: 'bg-aqua-light'
                        }[urgency];
                        const urgencyTextClass = {
                            urgent: 'text-red-300',
                            warning: 'text-yellow-300',
                            normal: 'text-aqua-accent'
                        }[urgency];

                        const remainingText = daysRemaining < 0 ? 'Gecikti' : daysRemaining === 0 ? 'Bugün' : daysRemaining === 1 ? 'Yarın' : `${daysRemaining} gün sonra`;

                        return (
                            <li key={task.id} className={`flex items-center justify-between p-3 ${urgencyBgClass} rounded-md`}>
                                <div>
                                    <p className="text-aqua-text-primary">{task.task}</p>
                                    <p className="text-xs text-aqua-text-secondary">{task.dueDate}</p>
                                </div>
                                <span className={`text-sm font-bold ${urgencyTextClass}`}>{remainingText}</span>
                            </li>
                        )
                    })}
                </ul>
            </Card>
            <Card title="Yapılan İşlemlerin Geçmişi">
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                     {aquarium.maintenanceLogs.map(log => (
                        <div key={log.id} className="p-3 border-l-4 border-aqua-accent bg-aqua-light rounded-r-md">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-aqua-text-primary">{log.task}</p>
                                <p className="text-xs text-aqua-text-secondary">{log.date}</p>
                            </div>
                            <p className="text-sm text-aqua-text-secondary mt-1">{log.notes}</p>
                        </div>
                     ))}
                </div>
            </Card>
        </div>
    );
};

export default Maintenance;
