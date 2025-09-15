import React, { useState } from 'react';
import Card from '../ui/Card';
import { WaterLog, Aquarium } from '../../types';
import WaterParameterChart from '../ui/WaterParameterChart';

const chartLines = [
    { dataKey: "sicaklik" as const, stroke: "#64ffda", name: "Sıcaklık (°C)" },
    { dataKey: "pH" as const, stroke: "#8892b0", name: "pH" },
    { dataKey: "TDS" as const, stroke: "#ffc658", name: "TDS (ppm)" },
];

interface WaterParametersProps {
    aquarium: Aquarium;
}

const WaterParameters: React.FC<WaterParametersProps> = ({ aquarium }) => {
    const [logs, setLogs] = useState<WaterLog[]>(aquarium.waterLogs);
    const [newLog, setNewLog] = useState<Omit<WaterLog, 'id'>>({ date: new Date().toISOString().split('T')[0], temperature: 25, ph: 7, tds: 180, no3: 10, kh: 4, gh: 7});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewLog(prev => ({ ...prev, [name]: name === 'date' ? value : parseFloat(value) }));
    };

    const handleAddLog = (e: React.FormEvent) => {
        e.preventDefault();
        setLogs(prev => [{ id: Date.now(), ...newLog }, ...prev]);
        // Note: In a real app, this would update the global state in App.tsx
    };
    
    const chartData = logs.map(log => ({
        name: new Date(log.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
        sicaklik: log.temperature,
        pH: log.ph,
        TDS: log.tds,
        NO3: log.no3
    })).reverse();


    return (
        <div className="space-y-6">
            <Card title="Yeni Su Değeri Ekle">
                <form onSubmit={handleAddLog} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 items-end">
                    <label className="flex flex-col"> <span className="text-xs text-aqua-text-secondary mb-1">Tarih</span> <input type="date" name="date" value={newLog.date} onChange={handleInputChange} className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none w-full" /></label>
                    <label className="flex flex-col"> <span className="text-xs text-aqua-text-secondary mb-1">Sıcaklık</span> <input type="number" step="0.1" name="temperature" value={newLog.temperature} onChange={handleInputChange} className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none w-full" /></label>
                    <label className="flex flex-col"> <span className="text-xs text-aqua-text-secondary mb-1">pH</span> <input type="number" step="0.1" name="ph" value={newLog.ph} onChange={handleInputChange} className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none w-full" /></label>
                    <label className="flex flex-col"> <span className="text-xs text-aqua-text-secondary mb-1">TDS</span> <input type="number" name="tds" value={newLog.tds} onChange={handleInputChange} className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none w-full" /></label>
                    <label className="flex flex-col"> <span className="text-xs text-aqua-text-secondary mb-1">NO₃</span> <input type="number" name="no3" value={newLog.no3} onChange={handleInputChange} className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none w-full" /></label>
                    <label className="flex flex-col"> <span className="text-xs text-aqua-text-secondary mb-1">KH</span> <input type="number" name="kh" value={newLog.kh} onChange={handleInputChange} className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none w-full" /></label>
                    <label className="flex flex-col"> <span className="text-xs text-aqua-text-secondary mb-1">GH</span> <input type="number" name="gh" value={newLog.gh} onChange={handleInputChange} className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none w-full" /></label>
                    <button type="submit" className="bg-aqua-accent text-aqua-deep font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-200 h-10">Ekle</button>
                </form>
            </Card>

            <Card title="Değer Trendleri">
                <WaterParameterChart data={chartData} lines={chartLines} />
            </Card>

            <Card title="Ölçüm Geçmişi">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-aqua-light">
                                <th className="p-2 text-aqua-text-secondary">Tarih</th>
                                <th className="p-2 text-aqua-text-secondary">Sıcaklık</th>
                                <th className="p-2 text-aqua-text-secondary">pH</th>
                                <th className="p-2 text-aqua-text-secondary">TDS</th>
                                <th className="p-2 text-aqua-text-secondary">NO₃</th>
                                <th className="p-2 text-aqua-text-secondary">KH</th>
                                <th className="p-2 text-aqua-text-secondary">GH</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id} className="border-b border-aqua-light hover:bg-aqua-light">
                                    <td className="p-2">{log.date}</td>
                                    <td className="p-2">{log.temperature}°C</td>
                                    <td className="p-2">{log.ph}</td>
                                    <td className="p-2">{log.tds} ppm</td>
                                    <td className="p-2">{log.no3} mg/L</td>
                                    <td className="p-2">{log.kh} dKH</td>
                                    <td className="p-2">{log.gh} dGH</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default WaterParameters;
