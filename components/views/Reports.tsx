import React from 'react';
import Card from '../ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Aquarium } from '../../types';

const COLORS = ['#64ffda', '#8892b0', '#ffc658', '#ff6482', '#a2d2ff'];

const StatCard: React.FC<{title: string, value: string, description: string}> = ({title, value, description}) => (
    <Card className="text-center">
        <p className="text-3xl font-bold text-aqua-accent">{value}</p>
        <h4 className="font-semibold text-aqua-text-primary mt-1">{title}</h4>
        <p className="text-xs text-aqua-text-secondary">{description}</p>
    </Card>
);

interface ReportsProps {
    aquarium: Aquarium;
}

const Reports: React.FC<ReportsProps> = ({ aquarium }) => {
    const totalFishCount = aquarium.fish.reduce((sum, f) => sum + f.count, 0);
    const avgTemp = aquarium.waterLogs.length > 0
        ? (aquarium.waterLogs.reduce((sum, log) => sum + log.temperature, 0) / aquarium.waterLogs.length).toFixed(1) + "°C"
        : "N/A";
    const totalExpense = aquarium.expenses.reduce((sum, e) => sum + e.value, 0);

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Ortalama Sıcaklık" value={avgTemp} description="Tüm zamanlar" />
            <StatCard title="Toplam Masraf" value={`${totalExpense}₺`} description="Tüm zamanlar" />
            <StatCard title="Toplam Canlı Sayısı" value={String(totalFishCount)} description="Tüm canlılar dahil" />
        </div>
        <Card title="Masraf Dağılımı Analizi">
            <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={aquarium.expenses}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {aquarium.expenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#112240', borderColor: '#233554' }}/>
                    <Legend wrapperStyle={{ color: '#8892b0' }}/>
                </PieChart>
            </ResponsiveContainer>
            </div>
             <div className="mt-4 border-t border-aqua-light pt-4">
                <h4 className="font-semibold text-aqua-text-primary mb-2">Harcama Detayları</h4>
                <ul className="space-y-1">
                    {aquarium.expenses.map((item, index) => (
                         <li key={index} className="flex justify-between text-aqua-text-secondary">
                            <span>{item.name}</span>
                            <span className="font-mono">{item.value}₺</span>
                         </li>
                    ))}
                    <li className="flex justify-between text-aqua-text-primary font-bold border-t border-aqua-light pt-2 mt-2">
                        <span>TOPLAM</span>
                        <span className="font-mono">{totalExpense}₺</span>
                    </li>
                </ul>
            </div>
        </Card>
        <div className="flex gap-4">
             <button className="flex-1 bg-aqua-light hover:bg-aqua-accent hover:text-aqua-deep font-bold py-3 px-4 rounded-lg transition-all duration-200">PDF Olarak Dışa Aktar</button>
             <button className="flex-1 bg-aqua-light hover:bg-aqua-accent hover:text-aqua-deep font-bold py-3 px-4 rounded-lg transition-all duration-200">Excel Olarak Dışa Aktar</button>
        </div>
    </div>
  );
};

export default Reports;
