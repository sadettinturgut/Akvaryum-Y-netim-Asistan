import { Aquarium, Achievement } from '../types';

export const initialAquariums: Aquarium[] = [
    {
        id: 'tropical-paradise',
        name: 'Tropikal Cennet',
        fish: [
            { id: 1, name: 'Neon Sürü', species: 'Neon Tetra', count: 15, addedDate: '2023-10-15', imageUrl: 'https://via.placeholder.com/150/64ffda/0b192f?text=Neon', notes: 'Çok aktif ve renkliler.' },
            { id: 2, name: 'L144 Cüce Vatoz', species: 'Ancistrus sp.', count: 2, addedDate: '2023-09-20', imageUrl: 'https://via.placeholder.com/150/8892b0/0b192f?text=Vatoz', notes: 'Geceleri daha aktif oluyorlar.' },
        ],
        waterLogs: [
            { id: 1, date: '2024-05-20', temperature: 25.1, ph: 6.8, tds: 180, no3: 15, kh: 4, gh: 7 },
            { id: 2, date: '2024-05-21', temperature: 25.2, ph: 6.9, tds: 182, no3: 15, kh: 4, gh: 7 },
            { id: 3, date: '2024-05-22', temperature: 25.0, ph: 6.8, tds: 185, no3: 16, kh: 4, gh: 7 },
            { id: 4, date: '2024-05-23', temperature: 25.3, ph: 7.0, tds: 184, no3: 12, kh: 5, gh: 8 },
            { id: 5, date: '2024-05-24', temperature: 25.2, ph: 6.9, tds: 188, no3: 14, kh: 5, gh: 8 },
        ],
        equipment: [
            { id: 1, name: 'Dış Filtre', type: 'Filtre', model: 'Eheim Pro 4+ 250', installDate: '2023-01-10', lastMaintenance: '2024-05-15', maintenanceIntervalDays: 30 },
            { id: 2, name: 'Isıtıcı', type: 'Isıtıcı', model: 'Jager 150W', installDate: '2023-01-10', lastMaintenance: '2024-03-01', maintenanceIntervalDays: 180 },
            { id: 3, name: 'LED Aydınlatma', type: 'Aydınlatma', model: 'Chihiros WRGB II', installDate: '2023-05-20', lastMaintenance: '2024-05-20', maintenanceIntervalDays: 90, isTurnedOn: true },
        ],
        feedingSchedule: [
            { id: 1, time: '08:00', foodType: 'TetraMin Pul Yem', amount: 'Bir tutam', days: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'] },
            { id: 2, time: '20:00', foodType: 'Sera Granügreen', amount: 'Az miktarda', days: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum'] },
        ],
        foodStock: [
            { id: 1, name: 'TetraMin Pul Yem', type: 'Pul Yem', remainingPercentage: 80 },
            { id: 2, name: 'Sera Granügreen', type: 'Granül Yem', remainingPercentage: 65 },
        ],
        maintenanceLogs: [
            { id: 1, date: '2024-05-19', task: '%30 Su Değişimi', notes: 'Dip çekimi yapıldı. Seachem Prime eklendi.' },
            { id: 2, date: '2024-05-15', task: 'Filtre Temizliği', notes: 'Sadece elyaf değiştirildi, biyolojik süngerler akvaryum suyuyla çalkalandı.' },
        ],
        upcomingMaintenance: [
            { id: 1, task: '%30 Su Değişimi', dueDate: '2024-05-26'},
            { id: 2, task: 'Bitki Gübrelemesi', dueDate: '2024-05-25'},
            { id: 3, task: 'Filtre Elyaf Değişimi', dueDate: '2024-05-29'},
        ],
        expenses: [
            { name: 'Yem', value: 400 }, { name: 'Ekipman', value: 1200 }, { name: 'İlaç', value: 150 }, { name: 'Canlı', value: 600 },
        ]
    },
    {
        id: 'shrimp-colony',
        name: 'Karides Kolonisi',
        fish: [
             { id: 3, name: 'Kiraz Karides', species: 'Neocaridina davidi', count: 25, addedDate: '2023-11-01', imageUrl: 'https://via.placeholder.com/150/ff6482/0b192f?text=Karides', notes: 'Sürekli yosunları temizliyorlar.' },
             { id: 4, name: 'Helena Salyangoz', species: 'Anentome helena', count: 5, addedDate: '2023-11-01', imageUrl: 'https://via.placeholder.com/150/fca311/0b192f?text=Helena', notes: 'Adi salyangoz popülasyonunu kontrol ediyorlar.' },
        ],
        waterLogs: [
             { id: 6, date: '2024-05-20', temperature: 22.5, ph: 7.2, tds: 250, no3: 5, kh: 6, gh: 10 },
             { id: 7, date: '2024-05-22', temperature: 22.6, ph: 7.2, tds: 255, no3: 5, kh: 6, gh: 10 },
             { id: 8, date: '2024-05-24', temperature: 22.4, ph: 7.3, tds: 260, no3: 6, kh: 6, gh: 11 },
        ],
        equipment: [
            { id: 4, name: 'Pipo Filtre', type: 'Filtre', model: 'Xinyou XY-2822', installDate: '2023-10-25', lastMaintenance: '2024-05-18', maintenanceIntervalDays: 14 },
            { id: 5, name: 'Mini Isıtıcı', type: 'Isıtıcı', model: 'JBL ProTemp S 25', installDate: '2023-10-25', lastMaintenance: '2024-04-01', maintenanceIntervalDays: 180 },
        ],
        feedingSchedule: [
            { id: 3, time: '10:00', foodType: 'Shrimp King Complete', amount: 'Çok az', days: ['Pzt', 'Çar', 'Cum'] },
        ],
        foodStock: [
            { id: 3, name: 'Shrimp King Complete', type: 'Granül Yem', remainingPercentage: 90 },
        ],
        maintenanceLogs: [
             { id: 3, date: '2024-05-18', task: '%10 Su Değişimi', notes: 'Sadece dinlenmiş su eklendi.' },
        ],
        upcomingMaintenance: [
            { id: 4, task: '%10 Su Değişimi', dueDate: '2024-05-25'},
            { id: 5, task: 'Pipo Filtre Temizliği', dueDate: '2024-06-01'},
        ],
        expenses: [
             { name: 'Yem', value: 250 }, { name: 'Canlı', value: 800 }, { name: 'Aksesuar', value: 300 }
        ]
    }
];

export const initialAchievements: Achievement[] = [
    { id: 1, title: 'Hoş Geldin!', description: 'Uygulamayı ilk kez kullandın.', unlocked: true, icon: '🎉' },
    { id: 2, title: 'İlk Canlı Eklendi', description: 'Akvaryumuna ilk canlı kaydını yaptın.', unlocked: true, icon: '🐠' },
    { id: 3, title: 'Veri Uzmanı', description: 'İlk su değeri ölçümünü kaydettin.', unlocked: true, icon: '🧪' },
    { id: 4, title: 'Bakım Günü', description: 'İlk bakım görevini tamamladın.', unlocked: false, icon: '🔧' },
    { id: 5, title: '3 Ay Sağlıklı Akvaryum', description: 'Akvaryumun 3 ay boyunca stabil kaldı.', unlocked: false, icon: '🏆' },
    { id: 6, title: 'Yapay Zeka Kâşifi', description: 'AI destekli teşhis özelliğini ilk kez kullandın.', unlocked: false, icon: '🤖' },
    { id: 7, title: 'İlk Yavru Büyütme', description: 'Akvaryumunda üreme gerçekleşti ve yavruları kaydettin.', unlocked: false, icon: '🐣' },
];
