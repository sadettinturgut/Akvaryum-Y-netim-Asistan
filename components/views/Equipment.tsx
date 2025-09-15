import React, { useState } from 'react';
import Card from '../ui/Card';
import { EquipmentItem, Aquarium } from '../../types';

const getDaysRemaining = (lastDate: string, interval: number) => {
    const last = new Date(lastDate);
    const next = new Date(last.setDate(last.getDate() + interval));
    const today = new Date();
    const diffTime = next.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const ToggleSwitch: React.FC<{ enabled: boolean, onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-aqua-accent' : 'bg-aqua-light'}`}
    >
        <span className={`inline-block w-4 h-4 transform bg-aqua-deep rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);


interface EquipmentProps {
    aquarium: Aquarium;
}

const Equipment: React.FC<EquipmentProps> = ({ aquarium }) => {
    const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>(aquarium.equipment);

    const handleMaintenanceDone = (id: number) => {
        setEquipmentList(prevList => prevList.map(item => 
            item.id === id 
            ? { ...item, lastMaintenance: new Date().toISOString().split('T')[0] } 
            : item
        ));
    };

    const handleToggle = (id: number, newState: boolean) => {
        setEquipmentList(prevList => prevList.map(item =>
            item.id === id ? { ...item, isTurnedOn: newState } : item
        ));
    };


    return (
        <Card title="Ekipman ve Bakım Takvimi">
            <div className="space-y-4">
                {equipmentList.map(item => {
                    const daysRemaining = getDaysRemaining(item.lastMaintenance, item.maintenanceIntervalDays);
                    const urgency = daysRemaining < 7 ? 'urgent' : daysRemaining < 15 ? 'warning' : 'normal';
                    const urgencyColorClass = {
                        urgent: 'border-red-500/50 bg-red-900/20',
                        warning: 'border-yellow-500/50 bg-yellow-900/20',
                        normal: 'border-aqua-light'
                    }[urgency];
                    const urgencyTextClass = {
                        urgent: 'text-red-400',
                        warning: 'text-yellow-400',
                        normal: 'text-green-400'
                    }[urgency];

                    return (
                        <div key={item.id} className={`p-4 rounded-lg border ${urgencyColorClass} flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-aqua-text-primary">{item.name} <span className="text-sm font-normal text-aqua-text-secondary">- {item.type}</span></h3>
                                <p className="text-sm text-aqua-text-secondary">{item.model}</p>
                                <p className="text-xs mt-1 text-aqua-text-secondary">Son Bakım: {item.lastMaintenance}</p>
                            </div>
                             <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                               {item.type === 'Aydınlatma' && (
                                   <div className="flex items-center gap-2">
                                        <span className="text-sm text-aqua-text-secondary">Durum:</span>
                                        <ToggleSwitch enabled={!!item.isTurnedOn} onChange={(e) => handleToggle(item.id, e)} />
                                   </div>
                                )}
                                <div className="text-center">
                                    <p className={`text-xl font-bold ${urgencyTextClass}`}>{daysRemaining > 0 ? daysRemaining : 'GEÇTİ'}</p>
                                    <p className="text-xs text-aqua-text-secondary">gün kaldı</p>
                                </div>
                                <button
                                    onClick={() => handleMaintenanceDone(item.id)}
                                    className="bg-aqua-light text-aqua-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-aqua-accent hover:text-aqua-deep transition-colors duration-200"
                                >
                                    Bakım
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default Equipment;
