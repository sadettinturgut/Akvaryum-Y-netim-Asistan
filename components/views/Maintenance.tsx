import React, { useState } from 'react';
import Card from '../ui/Card';
import { Aquarium, UpcomingMaintenanceTask, MaintenanceLog } from '../../types';
import { getDaysUntil, toISODateString } from '../../utils/dateUtils';


interface MaintenanceProps {
    aquarium: Aquarium;
    onUpdateAquarium: (aquarium: Aquarium) => void;
}

const Maintenance: React.FC<MaintenanceProps> = ({ aquarium, onUpdateAquarium }) => {
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newTask, setNewTask] = useState<Omit<UpcomingMaintenanceTask, 'id'>>({
        task: '', dueDate: toISODateString(new Date())
    });

    const handleTaskInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewTask(prev => ({ ...prev, [name]: value }));
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        const taskToAdd: UpcomingMaintenanceTask = { id: Date.now(), ...newTask };
        const updatedAquarium = { ...aquarium, upcomingMaintenance: [...aquarium.upcomingMaintenance, taskToAdd] };
        onUpdateAquarium(updatedAquarium);
        setShowTaskForm(false);
        setNewTask({ task: '', dueDate: toISODateString(new Date()) });
    };

    const handleCompleteTask = (task: UpcomingMaintenanceTask) => {
        // Add to history
        const newLog: MaintenanceLog = {
            id: Date.now(),
            date: toISODateString(new Date()),
            task: task.task,
            notes: 'Görev takvimden tamamlandı.'
        };
        // Remove from upcoming
        const updatedUpcoming = aquarium.upcomingMaintenance.filter(t => t.id !== task.id);
        const updatedAquarium = { 
            ...aquarium, 
            upcomingMaintenance: updatedUpcoming,
            maintenanceLogs: [newLog, ...aquarium.maintenanceLogs]
        };
        onUpdateAquarium(updatedAquarium);
    };

    const handleDeleteTask = (taskId: number) => {
        const updatedUpcoming = aquarium.upcomingMaintenance.filter(t => t.id !== taskId);
        onUpdateAquarium({ ...aquarium, upcomingMaintenance: updatedUpcoming });
    };
    
    const handleDeleteLog = (logId: number) => {
        const updatedLogs = aquarium.maintenanceLogs.filter(l => l.id !== logId);
        onUpdateAquarium({ ...aquarium, maintenanceLogs: updatedLogs });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Yaklaşan Görevler ve Takvim">
                <button onClick={() => setShowTaskForm(!showTaskForm)} className="w-full mb-4 text-center py-2 bg-aqua-light hover:bg-opacity-80 rounded-md text-aqua-accent font-semibold">{showTaskForm ? 'İptal' : 'Yeni Görev Ekle'}</button>
                {showTaskForm && (
                    <form onSubmit={handleAddTask} className="flex gap-2 mb-4 animate-fade-in">
                        <input type="text" name="task" value={newTask.task} onChange={handleTaskInputChange} placeholder="Görev (örn: Su değişimi)" required className="flex-grow p-2 bg-aqua-dark rounded-md"/>
                        <input type="date" name="dueDate" value={newTask.dueDate} onChange={handleTaskInputChange} required className="p-2 bg-aqua-dark rounded-md"/>
                        <button type="submit" className="bg-aqua-accent text-aqua-deep px-4 rounded-lg font-bold">Ekle</button>
                    </form>
                )}
                <ul className="space-y-3">
                    {aquarium.upcomingMaintenance.length > 0 ? aquarium.upcomingMaintenance.map(task => {
                        const daysRemaining = getDaysUntil(task.dueDate);
                        const urgency = daysRemaining < 1 ? 'urgent' : daysRemaining < 4 ? 'warning' : 'normal';
                        const urgencyBgClass = { urgent: 'bg-red-900/50', warning: 'bg-yellow-900/20', normal: 'bg-aqua-light' }[urgency];
                        const urgencyTextClass = { urgent: 'text-red-300', warning: 'text-yellow-300', normal: 'text-aqua-accent' }[urgency];
                        const remainingText = daysRemaining < 0 ? 'Gecikti' : daysRemaining === 0 ? 'Bugün' : daysRemaining === 1 ? 'Yarın' : `${daysRemaining} gün sonra`;

                        return (
                             <li key={task.id} className={`p-3 ${urgencyBgClass} rounded-md group`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-aqua-text-primary">{task.task}</p>
                                        <p className="text-xs text-aqua-text-secondary">{new Date(task.dueDate).toLocaleDateString('tr-TR')}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-bold ${urgencyTextClass}`}>{remainingText}</span>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                            <button onClick={() => handleCompleteTask(task)} className="p-1 bg-green-500 rounded-full text-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></button>
                                            <button onClick={() => handleDeleteTask(task.id)} className="p-1 bg-red-500 rounded-full text-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )
                    }) : <p className="text-aqua-text-secondary text-center py-4">Yaklaşan bir görev yok.</p>}
                </ul>
            </Card>
            <Card title="Yapılan İşlemlerin Geçmişi">
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                     {aquarium.maintenanceLogs.length > 0 ? aquarium.maintenanceLogs.map(log => (
                        <div key={log.id} className="p-3 border-l-4 border-aqua-accent bg-aqua-light rounded-r-md group relative">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-aqua-text-primary">{log.task}</p>
                                <p className="text-xs text-aqua-text-secondary">{new Date(log.date).toLocaleDateString('tr-TR')}</p>
                            </div>
                            <p className="text-sm text-aqua-text-secondary mt-1">{log.notes}</p>
                            <button onClick={() => handleDeleteLog(log.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg></button>
                        </div>
                     )) : <p className="text-aqua-text-secondary text-center py-4">Geçmiş bakım kaydı bulunamadı.</p>}
                </div>
            </Card>
        </div>
    );
};

export default Maintenance;