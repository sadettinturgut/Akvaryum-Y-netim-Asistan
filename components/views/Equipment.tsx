import React, { useState } from 'react';
import Card from '../ui/Card';
import { EquipmentItem, Aquarium, FilterMedium } from '../../types';
import { getDaysRemainingForMaintenance, toISODateString } from '../../utils/dateUtils';

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
    onUpdateAquarium: (aquarium: Aquarium) => void;
}

const Equipment: React.FC<EquipmentProps> = ({ aquarium, onUpdateAquarium }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newEquipment, setNewEquipment] = useState<Omit<EquipmentItem, 'id' | 'lastMaintenance'>>({
        name: '',
        type: 'Filtre',
        model: '',
        installDate: new Date().toISOString().split('T')[0],
        maintenanceIntervalDays: 30,
        media: [],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewEquipment(prev => ({...prev, [name]: name === 'maintenanceIntervalDays' ? parseInt(value) : value }));
    };
    
    // --- Filter Media Handlers ---
    const handleAddMedium = () => {
        const newMedium: FilterMedium = {
            id: Date.now(),
            name: 'Elyaf',
            lastChangeDate: newEquipment.installDate,
            changeIntervalDays: 14
        };
        setNewEquipment(prev => ({...prev, media: [...(prev.media || []), newMedium]}));
    };
    
    const handleMediumChange = (id: number, field: keyof FilterMedium, value: string | number) => {
        setNewEquipment(prev => ({
            ...prev,
            media: (prev.media || []).map(m => m.id === id ? {...m, [field]: value} : m)
        }));
    };
    
    const handleRemoveMedium = (id: number) => {
        setNewEquipment(prev => ({
            ...prev,
            media: (prev.media || []).filter(m => m.id !== id)
        }));
    };
    // --- End Filter Media Handlers ---


    const handleAddEquipment = (e: React.FormEvent) => {
        e.preventDefault();
        const equipmentToAdd: EquipmentItem = {
            id: Date.now(),
            ...newEquipment,
            lastMaintenance: newEquipment.installDate, // İlk bakım tarihi kurulum tarihidir
            isTurnedOn: newEquipment.type === 'Aydınlatma' ? true : undefined,
        };
        const updatedAquarium = {
            ...aquarium,
            equipment: [...aquarium.equipment, equipmentToAdd]
        };
        onUpdateAquarium(updatedAquarium);
        setShowAddForm(false);
        setNewEquipment({name: '', type: 'Filtre', model: '', installDate: new Date().toISOString().split('T')[0], maintenanceIntervalDays: 30, media: []});
    };
    
    const handleDeleteEquipment = (id: number) => {
        if (window.confirm("Bu ekipmanı silmek istediğinizden emin misiniz?")) {
            const updatedEquipment = aquarium.equipment.filter(item => item.id !== id);
            onUpdateAquarium({ ...aquarium, equipment: updatedEquipment });
        }
    };

    const handleMaintenanceDone = (id: number) => {
        const updatedEquipment = aquarium.equipment.map(item => 
            item.id === id 
            ? { ...item, lastMaintenance: new Date().toISOString().split('T')[0] } 
            : item
        );
        onUpdateAquarium({ ...aquarium, equipment: updatedEquipment });
    };
    
    const handleMediumMaintenanceDone = (equipmentId: number, mediumId: number) => {
        const updatedEquipment = aquarium.equipment.map(item => {
            if (item.id === equipmentId) {
                return {
                    ...item,
                    media: (item.media || []).map(m => 
                        m.id === mediumId ? {...m, lastChangeDate: toISODateString(new Date())} : m
                    )
                }
            }
            return item;
        });
        onUpdateAquarium({ ...aquarium, equipment: updatedEquipment });
    };

    const handleToggle = (id: number, newState: boolean) => {
        const updatedEquipment = aquarium.equipment.map(item =>
            item.id === id ? { ...item, isTurnedOn: newState } : item
        );
        onUpdateAquarium({ ...aquarium, equipment: updatedEquipment });
    };


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Ekipman Yönetimi</h2>
                <button onClick={() => setShowAddForm(!showAddForm)} className="bg-aqua-accent text-aqua-deep font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-200">
                    {showAddForm ? 'İptal' : 'Yeni Ekipman Ekle'}
                </button>
            </div>

            {showAddForm && (
                <Card title="Yeni Ekipman Ekle">
                    <form onSubmit={handleAddEquipment} className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" name="name" value={newEquipment.name} onChange={handleInputChange} placeholder="Ekipman Adı (örn: Dış Filtre)" required className="p-2 bg-aqua-light rounded-md w-full" />
                            <input type="text" name="model" value={newEquipment.model} onChange={handleInputChange} placeholder="Model (örn: Eheim Pro 4+)" required className="p-2 bg-aqua-light rounded-md w-full" />
                            <select name="type" value={newEquipment.type} onChange={handleInputChange} className="p-2 bg-aqua-light rounded-md w-full">
                                <option>Filtre</option>
                                <option>Isıtıcı</option>
                                <option>Aydınlatma</option>
                                <option>Hava Motoru</option>
                            </select>
                            <input type="date" name="installDate" value={newEquipment.installDate} onChange={handleInputChange} required className="p-2 bg-aqua-light rounded-md w-full" />
                            <div className="flex items-center gap-2">
                                <input type="number" name="maintenanceIntervalDays" value={newEquipment.maintenanceIntervalDays} onChange={handleInputChange} required min="1" className="p-2 bg-aqua-light rounded-md w-full" />
                                <span className="text-aqua-text-secondary text-sm">günde bir bakım</span>
                            </div>
                        </div>

                        {newEquipment.type === 'Filtre' && (
                            <div className="border-t border-aqua-light pt-4 space-y-3">
                                <h4 className="text-md font-semibold text-aqua-text-primary">Filtrasyon Malzemeleri</h4>
                                {(newEquipment.media || []).map((medium, index) => (
                                    <div key={medium.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center p-2 bg-aqua-deep rounded-md">
                                        <select value={medium.name} onChange={(e) => handleMediumChange(medium.id, 'name', e.target.value)} className="p-2 bg-aqua-light rounded-md w-full">
                                            <option>Elyaf</option><option>Sünger</option><option>Seramik Halka</option><option>Biyoball</option><option>Substrat</option><option>Aktif Karbon</option>
                                        </select>
                                        <div className="flex items-center gap-2">
                                            <input type="number" value={medium.changeIntervalDays} onChange={(e) => handleMediumChange(medium.id, 'changeIntervalDays', parseInt(e.target.value))} min="1" className="p-2 bg-aqua-light rounded-md w-full" />
                                            <span className="text-aqua-text-secondary text-xs">gün</span>
                                        </div>
                                        <input type="date" value={medium.lastChangeDate} onChange={(e) => handleMediumChange(medium.id, 'lastChangeDate', e.target.value)} className="p-2 bg-aqua-light rounded-md w-full" />
                                        <button type="button" onClick={() => handleRemoveMedium(medium.id)} className="text-red-500 hover:text-red-400 justify-self-end">Malzemeyi Kaldır</button>
                                    </div>
                                ))}
                                <button type="button" onClick={handleAddMedium} className="w-full text-sm text-center py-2 bg-aqua-light hover:bg-opacity-80 rounded-md text-aqua-accent font-semibold">Yeni Malzeme Ekle</button>
                            </div>
                        )}
                        <button type="submit" className="w-full bg-aqua-accent text-aqua-deep font-bold py-2 px-4 rounded-lg">Ekipmanı Kaydet</button>
                    </form>
                </Card>
            )}

            <Card title="Mevcut Ekipmanlar">
                <div className="space-y-4">
                    {aquarium.equipment.length > 0 ? aquarium.equipment.map(item => {
                        const daysRemaining = getDaysRemainingForMaintenance(item.lastMaintenance, item.maintenanceIntervalDays);
                        const urgency = daysRemaining < 7 ? 'urgent' : daysRemaining < 15 ? 'warning' : 'normal';
                        const urgencyColorClass = { urgent: 'border-red-500/50 bg-red-900/20', warning: 'border-yellow-500/50 bg-yellow-900/20', normal: 'border-aqua-light' }[urgency];

                        return (
                            <div key={item.id} className={`p-4 rounded-lg border ${urgencyColorClass} group`}>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-aqua-text-primary">{item.name} <span className="text-sm font-normal text-aqua-text-secondary">- {item.type}</span></h3>
                                        <p className="text-sm text-aqua-text-secondary">{item.model}</p>
                                        <p className="text-xs mt-1 text-aqua-text-secondary">Son Genel Bakım: {new Date(item.lastMaintenance).toLocaleDateString('tr-TR')}</p>
                                    </div>
                                    <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                                        {item.type === 'Aydınlatma' && ( <div className="flex items-center gap-2"><span className="text-sm text-aqua-text-secondary">Durum:</span><ToggleSwitch enabled={!!item.isTurnedOn} onChange={(e) => handleToggle(item.id, e)} /></div> )}
                                        <div className="text-center">
                                            <p className={`text-xl font-bold ${daysRemaining <= 0 ? 'text-red-400' : 'text-green-400'}`}>{daysRemaining > 0 ? daysRemaining : 'GEÇTİ'}</p>
                                            <p className="text-xs text-aqua-text-secondary">gün kaldı</p>
                                        </div>
                                        <button onClick={() => handleMaintenanceDone(item.id)} className="bg-aqua-light text-aqua-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-aqua-accent hover:text-aqua-deep transition-colors duration-200">Bakım Yapıldı</button>
                                    </div>
                                    <button onClick={() => handleDeleteEquipment(item.id)} className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-800/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700" aria-label="Ekipmanı sil">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                                {item.type === 'Filtre' && (item.media || []).length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-aqua-light space-y-2">
                                        {(item.media || []).map(medium => {
                                            const mediumDaysLeft = getDaysRemainingForMaintenance(medium.lastChangeDate, medium.changeIntervalDays);
                                            return (
                                                <div key={medium.id} className="flex justify-between items-center text-sm p-2 bg-aqua-light rounded-md">
                                                    <div>
                                                        <p className="font-semibold text-aqua-text-primary">{medium.name}</p>
                                                        <p className="text-xs text-aqua-text-secondary">Son Değişim: {new Date(medium.lastChangeDate).toLocaleDateString('tr-TR')}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`font-bold ${mediumDaysLeft <= 3 ? 'text-red-400' : 'text-aqua-text-secondary'}`}>{mediumDaysLeft > 0 ? `${mediumDaysLeft} gün kaldı` : 'Değişim Zamanı!'}</span>
                                                        <button onClick={() => handleMediumMaintenanceDone(item.id, medium.id)} className="text-xs bg-aqua-dark text-aqua-accent font-semibold py-1 px-3 rounded-lg hover:bg-opacity-80">Değiştirildi</button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }) : <p className="text-aqua-text-secondary text-center py-4">Henüz ekipman eklenmemiş.</p>}
                </div>
            </Card>
        </div>
    );
};

export default Equipment;