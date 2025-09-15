import React from 'react';
import Card from '../ui/Card';
import { Aquarium, FeedingScheduleItem, FoodStock } from '../../types';

const DayChip: React.FC<{day: string, active: boolean}> = ({ day, active }) => (
    <span className={`px-2 py-0.5 text-xs rounded-full ${active ? 'bg-aqua-accent text-aqua-deep font-bold' : 'bg-aqua-light text-aqua-text-secondary'}`}>
        {day}
    </span>
);

interface FeedingPlanProps {
    aquarium: Aquarium;
}

const FeedingPlan: React.FC<FeedingPlanProps> = ({ aquarium }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card title="Haftalık Yemleme Planı">
                    <div className="space-y-4">
                        {aquarium.feedingSchedule.map(item => (
                            <div key={item.id} className="p-4 bg-aqua-light rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                <div>
                                    <p className="text-aqua-text-primary"><span className="font-bold text-aqua-accent">{item.time}</span> - {item.foodType}</p>
                                    <p className="text-sm text-aqua-text-secondary">{item.amount}</p>
                                </div>
                                <div className="flex gap-1.5 flex-wrap">
                                    {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                                        <DayChip key={day} day={day} active={item.days.includes(day as any)} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                 <Card title="Yem Stok Takibi">
                    <div className="space-y-4">
                        {aquarium.foodStock.map(food => (
                            <div key={food.id}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-aqua-text-primary">{food.name}</span>
                                    <span className="text-sm font-medium text-aqua-text-secondary">{food.remainingPercentage}%</span>
                                </div>
                                <div className="w-full bg-aqua-light rounded-full h-2.5">
                                    <div className="bg-aqua-accent h-2.5 rounded-full" style={{ width: `${food.remainingPercentage}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default FeedingPlan;
