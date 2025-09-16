import React, { useState } from 'react';
import { Aquarium } from '../../types';
import Card from '../ui/Card';

interface OnboardingSetupProps {
    onSetupComplete: (aquarium: Aquarium) => void;
}

const OnboardingSetup: React.FC<OnboardingSetupProps> = ({ onSetupComplete }) => {
    const [name, setName] = useState('');
    const [width, setWidth] = useState('');
    const [length, setLength] = useState('');
    const [height, setHeight] = useState('');
    const [type, setType] = useState<'Tropikal Tatlı Su' | 'Bitkili (Aquascape)' | 'Japon Balığı' | 'Ciklet' | 'Karides & Salyangoz' | 'Tuzlu Su Resif'>('Tropikal Tatlı Su');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !width || !length || !height) {
            setError('Lütfen tüm alanları doldurun.');
            return;
        }

        const newAquarium: Aquarium = {
            id: `aq-${Date.now()}`,
            name,
            width: parseInt(width),
            length: parseInt(length),
            height: parseInt(height),
            type,
            fish: [],
            plants: [],
            waterLogs: [],
            equipment: [],
            feedingSchedule: [],
            foodStock: [],
            maintenanceLogs: [],
            upcomingMaintenance: [],
            expenses: []
        };
        onSetupComplete(newAquarium);
    };

    return (
        <div className="min-h-screen bg-aqua-deep flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-2xl">
                 <div className="flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-aqua-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 12.5c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.5c0 4.142-3.358 7.5-7.5 7.5S6 16.642 6 12.5c0-2.454 1.12-4.665 2.894-6.106C10.878 4.607 13.6 3.5 16.5 3.5c2.9 0 5.622 1.107 7.606 2.894C20.88 7.835 21 10.046 21 12.5zM11.5 10.5C11.5 8.015 9.485 6 7 6s-4.5 2.015-4.5 4.5S4.515 15 7 15s4.5-2.015 4.5-4.5z"/>
                    </svg>
                    <h1 className="text-3xl font-bold ml-3 text-aqua-text-primary">AquaAsistan'a Hoş Geldiniz</h1>
                </div>
                <Card>
                    <h2 className="text-xl font-semibold text-center text-aqua-text-primary mb-2">Başlarken</h2>
                    <p className="text-center text-aqua-text-secondary mb-6">Uygulamayı kişiselleştirmek için lütfen ilk akvaryumunuzun bilgilerini girin.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block mb-1 text-sm font-medium text-aqua-text-secondary">Akvaryum Adı</label>
                            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Örn: Oturma Odası Akvaryumu" className="w-full p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="length" className="block mb-1 text-sm font-medium text-aqua-text-secondary">Uzunluk (cm)</label>
                                <input id="length" type="number" value={length} onChange={e => setLength(e.target.value)} placeholder="100" className="w-full p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none" />
                            </div>
                            <div>
                                <label htmlFor="width" className="block mb-1 text-sm font-medium text-aqua-text-secondary">Genişlik (cm)</label>
                                <input id="width" type="number" value={width} onChange={e => setWidth(e.target.value)} placeholder="40" className="w-full p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none" />
                            </div>
                            <div>
                                <label htmlFor="height" className="block mb-1 text-sm font-medium text-aqua-text-secondary">Yükseklik (cm)</label>
                                <input id="height" type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="50" className="w-full p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none" />
                            </div>
                        </div>

                         <div>
                            <label htmlFor="type" className="block mb-1 text-sm font-medium text-aqua-text-secondary">Akvaryum Türü</label>
                            <select id="type" value={type} onChange={e => setType(e.target.value as any)} className="w-full p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none appearance-none">
                                <option>Tropikal Tatlı Su</option>
                                <option>Bitkili (Aquascape)</option>
                                <option>Japon Balığı</option>
                                <option>Ciklet</option>
                                <option>Karides & Salyangoz</option>
                                <option>Tuzlu Su Resif</option>
                            </select>
                        </div>
                        
                        {error && <p className="text-red-400 text-center text-sm">{error}</p>}

                        <button type="submit" className="w-full bg-aqua-accent text-aqua-deep font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-200">Akvaryumu Oluştur ve Başla</button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default OnboardingSetup;
