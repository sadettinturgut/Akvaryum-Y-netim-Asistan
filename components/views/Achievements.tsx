import React from 'react';
import Card from '../ui/Card';
import { Achievement } from '../../types';

interface AchievementsProps {
    achievements: Achievement[];
}

const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalCount = achievements.length;

    return (
        <div className="space-y-6">
            <Card>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-aqua-text-primary">Başarımlar</h2>
                        <p className="text-aqua-text-secondary">Toplam {totalCount} başarımdan {unlockedCount} tanesini kazandın.</p>
                    </div>
                    <div className="w-full sm:w-1/3 mt-3 sm:mt-0">
                         <div className="w-full bg-aqua-light rounded-full h-2.5">
                            <div className="bg-aqua-accent h-2.5 rounded-full" style={{ width: `${(unlockedCount/totalCount) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map(ach => (
                    <Card key={ach.id} className={`transition-opacity ${!ach.unlocked ? 'opacity-40' : ''}`}>
                        <div className="flex items-start gap-4">
                            <div className="text-4xl">{ach.icon}</div>
                            <div>
                                <h3 className={`font-bold ${ach.unlocked ? 'text-aqua-accent' : 'text-aqua-text-primary'}`}>{ach.title}</h3>
                                <p className="text-sm text-aqua-text-secondary">{ach.description}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Achievements;
