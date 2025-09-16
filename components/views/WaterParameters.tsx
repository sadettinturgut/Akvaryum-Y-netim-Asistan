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
    onUpdateAquarium: (aquarium: Aquarium) => void;
}

const WaterParameters: React.FC<WaterParametersProps> = ({ aquarium, onUpdateAquarium }) => {
    const [newLog, setNewLog] = useState<Omit<WaterLog, 'id'>>({ date: new Date().toISOString().split('T')[0], temperature: 25, ph: 7, tds: 180, no3: 10, kh: 4, gh: 7});
    const [deviceMessage, setDeviceMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    const [isReadingDevice, setIsReadingDevice] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewLog(prev => ({ ...prev, [name]: name === 'date' ? value : parseFloat(value) }));
    };

    const handleAddLog = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedAquarium = {
            ...aquarium,
            waterLogs: [{ id: Date.now(), ...newLog }, ...aquarium.waterLogs]
        };
        onUpdateAquarium(updatedAquarium);
        setNewLog({ date: new Date().toISOString().split('T')[0], temperature: 25, ph: 7, tds: 180, no3: 10, kh: 4, gh: 7});
    };

    const handleDeleteLog = (logId: number) => {
        if(window.confirm("Bu kaydı silmek istediğinizden emin misiniz?")) {
            const updatedLogs = aquarium.waterLogs.filter(log => log.id !== logId);
            onUpdateAquarium({ ...aquarium, waterLogs: updatedLogs });
        }
    };
    
    // --- Live Data Reading Simulation ---
    const mockReadSensor = (): Promise<Omit<WaterLog, 'id' | 'date'>> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 70% chance of success
                if (Math.random() > 0.3) {
                    const data = {
                        temperature: parseFloat((24 + Math.random() * 2).toFixed(1)),
                        ph: parseFloat((6.5 + Math.random()).toFixed(1)),
                        tds: Math.floor(150 + Math.random() * 50),
                        no3: Math.floor(5 + Math.random() * 10),
                        kh: Math.floor(3 + Math.random() * 3),
                        gh: Math.floor(6 + Math.random() * 4),
                    };
                    resolve(data);
                } else {
                    reject(new Error("Cihaz bulunamadı veya veri okunamadı."));
                }
            }, 1500); // 1.5 second delay
        });
    };

    const handleReadFromDevice = async () => {
        setIsReadingDevice(true);
        setDeviceMessage(null);
        try {
            const sensorData = await mockReadSensor();
            setNewLog(prev => ({ ...prev, ...sensorData }));
            setDeviceMessage({ type: 'success', text: "Veriler cihazdan başarıyla okundu!"});
        } catch (error: any) {
            setDeviceMessage({ type: 'error', text: error.message });
        } finally {
            setIsReadingDevice(false);
        }
    };
    // --- End of Simulation ---

    const chartData = aquarium.waterLogs.map(log => ({
        name: new Date(log.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
        sicaklik: log.temperature,
        pH: log.ph,
        TDS: log.tds,
        NO3: log.no3
    })).reverse();


    return (
        <div className="space-y-6">
            <Card title="Yeni Su Değeri Ekle">
                <form onSubmit={handleAddLog} className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 items-end">
                        <label className="flex flex-col"> <span className="text-xs text-aqua-text-secondary mb-1">Tarih</span> <input type="date" name="date" value={newLog.date} onChange={handleInputChange} className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none w-full" /></label>
                        <label className="flex flex-col"> <span className="text-xs text-aqua-text-secondary mb-1">Sıcaklık</span> <input type="number" step="0.1" name="temperature" value={newLog.temperature} onChange={handleInputChange} className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none w-full" /></label>
                        <label className="flex flex-col"> <span className="text-xs text-aqua-text-secondary mb-1">pH</span> <input type="number" step="0.1" name="ph" value={newLog.ph} onChange={handleInputChange} className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none w-full" /></label>
                        <label className="flex flex-col"> <span className="text-xs text-aqua-text-secondary mb-1">TDS</span> <input type="number" name="tds" value={newLog.tds} onChange={handleInputChange} className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none w-full" /></label>
                        <label className="flex flex-col"> <span className="text-xs text-aqua-text-secondary mb-1">NO₃</span> <input type="number" name="no3" value={newLog.no3} onChange={handleInputChange} className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none w-full" /></label>
                        <label className="flex flex-col"> <span className="text-xs text-aqua-text-secondary mb-1">KH</span> <input type="number" name="kh" value={newLog.kh} onChange={handleInputChange} className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none w-full" /></label>
                        <label className="flex flex-col"> <span className="text-xs text-aqua-text-secondary mb-1">GH</span> <input type="number" name="gh" value={newLog.gh} onChange={handleInputChange} className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none w-full" /></label>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                         <button type="submit" className="flex-1 bg-aqua-accent text-aqua-deep font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-200 h-10">Manuel Ekle</button>
                         <button type="button" onClick={handleReadFromDevice} disabled={isReadingDevice} className="flex-1 bg-aqua-light text-aqua-text-primary font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-200 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-wait">
                            {isReadingDevice ? (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>
                            )}
                            {isReadingDevice ? 'Okunuyor...' : 'Cihazdan Oku'}
                         </button>
                    </div>
                    {deviceMessage && (
                        <p className={`text-sm text-center mt-2 ${deviceMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            {deviceMessage.text}
                        </p>
                    )}
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
                                <th className="p-2 text-aqua-text-secondary">Eylem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {aquarium.waterLogs.map(log => (
                                <tr key={log.id} className="border-b border-aqua-light hover:bg-aqua-light">
                                    <td className="p-2">{new Date(log.date).toLocaleDateString('tr-TR')}</td>
                                    <td className="p-2">{log.temperature}°C</td>
                                    <td className="p-2">{log.ph}</td>
                                    <td className="p-2">{log.tds} ppm</td>
                                    <td className="p-2">{log.no3} mg/L</td>
                                    <td className="p-2">{log.kh} dKH</td>
                                    <td className="p-2">{log.gh} dGH</td>
                                    <td className="p-2">
                                        <button onClick={() => handleDeleteLog(log.id)} className="text-red-500 hover:text-red-400" aria-label="Kaydı sil">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </td>
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