import React, { useState } from 'react';
import Card from '../ui/Card';
import { Aquarium, FeedingScheduleItem, FoodStock } from '../../types';

type Day = 'Pzt' | 'Sal' | 'Çar' | 'Per' | 'Cum' | 'Cmt' | 'Paz';
const ALL_DAYS: Day[] = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const DayChip: React.FC<{day: string, active: boolean, onClick?: () => void}> = ({ day, active, onClick }) => (
    <button type="button" onClick={onClick} className={`px-2 py-0.5 text-xs rounded-full cursor-pointer ${active ? 'bg-aqua-accent text-aqua-deep font-bold' : 'bg-aqua-light text-aqua-text-secondary'}`}>
        {day}
    </button>
);

interface FeedingPlanProps {
    aquarium: Aquarium;
    onUpdateAquarium: (aquarium: Aquarium) => void;
}

const FeedingPlan: React.FC<FeedingPlanProps> = ({ aquarium, onUpdateAquarium }) => {
    const [showScheduleForm, setShowScheduleForm] = useState(false);
    const [newSchedule, setNewSchedule] = useState<Omit<FeedingScheduleItem, 'id'>>({
        time: '09:00', foodType: '', amount: '', days: []
    });
    
    const [showStockForm, setShowStockForm] = useState(false);
    const [newStock, setNewStock] = useState<Omit<FoodStock, 'id'>>({
        name: '', type: 'Pul Yem', remainingPercentage: 100
    });

    // --- Schedule Handlers ---
    const handleScheduleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewSchedule(prev => ({ ...prev, [name]: value }));
    };

    const handleDayToggle = (day: Day) => {
        setNewSchedule(prev => {
            const days = prev.days.includes(day)
                ? prev.days.filter(d => d !== day)
                : [...prev.days, day];
            return { ...prev, days };
        });
    };

    const handleAddSchedule = (e: React.FormEvent) => {
        e.preventDefault();
        const scheduleToAdd: FeedingScheduleItem = { id: Date.now(), ...newSchedule };
        const updatedAquarium = { ...aquarium, feedingSchedule: [...aquarium.feedingSchedule, scheduleToAdd] };
        onUpdateAquarium(updatedAquarium);
        setShowScheduleForm(false);
        setNewSchedule({ time: '09:00', foodType: '', amount: '', days: [] });
    };

    const handleDeleteSchedule = (id: number) => {
        const updatedAquarium = { ...aquarium, feedingSchedule: aquarium.feedingSchedule.filter(s => s.id !== id) };
        onUpdateAquarium(updatedAquarium);
    };

    // --- Stock Handlers ---
    const handleStockInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewStock(prev => ({...prev, [name]: name === 'remainingPercentage' ? parseInt(value) : value }));
    };

    const handleAddStock = (e: React.FormEvent) => {
        e.preventDefault();
        const stockToAdd: FoodStock = { id: Date.now(), ...newStock };
        const updatedAquarium = { ...aquarium, foodStock: [...aquarium.foodStock, stockToAdd] };
        onUpdateAquarium(updatedAquarium);
        setShowStockForm(false);
        setNewStock({ name: '', type: 'Pul Yem', remainingPercentage: 100 });
    };

    const handleDeleteStock = (id: number) => {
        const updatedAquarium = { ...aquarium, foodStock: aquarium.foodStock.filter(s => s.id !== id) };
        onUpdateAquarium(updatedAquarium);
    };


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card title="Haftalık Yemleme Planı">
                    <div className="space-y-4">
                        {aquarium.feedingSchedule.map(item => (
                            <div key={item.id} className="p-4 bg-aqua-light rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3 group relative">
                                <div>
                                    <p className="text-aqua-text-primary"><span className="font-bold text-aqua-accent">{item.time}</span> - {item.foodType}</p>
                                    <p className="text-sm text-aqua-text-secondary">{item.amount}</p>
                                </div>
                                <div className="flex gap-1.5 flex-wrap">
                                    {ALL_DAYS.map(day => <DayChip key={day} day={day} active={item.days.includes(day as any)} />)}
                                </div>
                                <button onClick={() => handleDeleteSchedule(item.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg></button>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setShowScheduleForm(!showScheduleForm)} className="w-full mt-4 text-center py-2 bg-aqua-light hover:bg-opacity-80 rounded-md text-aqua-accent font-semibold">{showScheduleForm ? 'İptal' : 'Yeni Plan Ekle'}</button>
                    {showScheduleForm && (
                        <form onSubmit={handleAddSchedule} className="mt-4 space-y-3 animate-fade-in border-t border-aqua-light pt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <input type="time" name="time" value={newSchedule.time} onChange={handleScheduleInputChange} required className="p-2 bg-aqua-dark rounded-md"/>
                                <input type="text" name="foodType" value={newSchedule.foodType} onChange={handleScheduleInputChange} placeholder="Yem Türü" required className="p-2 bg-aqua-dark rounded-md"/>
                                <input type="text" name="amount" value={newSchedule.amount} onChange={handleScheduleInputChange} placeholder="Miktar" required className="p-2 bg-aqua-dark rounded-md"/>
                            </div>
                            <div className="flex gap-1.5 flex-wrap">
                                {ALL_DAYS.map(day => <DayChip key={day} day={day} active={newSchedule.days.includes(day)} onClick={() => handleDayToggle(day)} />)}
                            </div>
                            <button type="submit" className="w-full bg-aqua-accent text-aqua-deep font-bold py-2 rounded-lg">Planı Kaydet</button>
                        </form>
                    )}
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                 <Card title="Yem Stok Takibi">
                    <div className="space-y-4">
                        {aquarium.foodStock.map(food => (
                            <div key={food.id} className="group relative">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-aqua-text-primary">{food.name}</span>
                                    <span className="text-sm font-medium text-aqua-text-secondary">{food.remainingPercentage}%</span>
                                </div>
                                <div className="w-full bg-aqua-light rounded-full h-2.5">
                                    <div className="bg-aqua-accent h-2.5 rounded-full" style={{ width: `${food.remainingPercentage}%` }}></div>
                                </div>
                                <button onClick={() => handleDeleteStock(food.id)} className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 text-red-500 -mt-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg></button>
                            </div>
                        ))}
                    </div>
                     <button onClick={() => setShowStockForm(!showStockForm)} className="w-full mt-4 text-center py-2 bg-aqua-light hover:bg-opacity-80 rounded-md text-aqua-accent font-semibold">{showStockForm ? 'İptal' : 'Yeni Yem Ekle'}</button>
                     {showStockForm && (
                        <form onSubmit={handleAddStock} className="mt-4 space-y-3 animate-fade-in border-t border-aqua-light pt-4">
                            <input type="text" name="name" value={newStock.name} onChange={handleStockInputChange} placeholder="Yem Adı" required className="p-2 w-full bg-aqua-dark rounded-md"/>
                             <select name="type" value={newStock.type} onChange={handleStockInputChange} className="p-2 w-full bg-aqua-dark rounded-md">
                                <option>Pul Yem</option><option>Canlı Yem</option><option>Dondurulmuş Yem</option><option>Granül Yem</option>
                             </select>
                            <div className="space-y-1">
                                <label className="text-xs text-aqua-text-secondary">Kalan Miktar: {newStock.remainingPercentage}%</label>
                                <input type="range" min="0" max="100" name="remainingPercentage" value={newStock.remainingPercentage} onChange={handleStockInputChange} className="w-full"/>
                            </div>
                             <button type="submit" className="w-full bg-aqua-accent text-aqua-deep font-bold py-2 rounded-lg">Yemi Kaydet</button>
                        </form>
                     )}
                </Card>
            </div>
        </div>
    );
};

export default FeedingPlan;