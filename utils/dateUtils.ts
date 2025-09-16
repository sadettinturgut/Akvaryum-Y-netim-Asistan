export const getDaysUntil = (targetDate: string): number => {
    const target = new Date(targetDate);
    // Set target time to the end of the day for accurate "today" calculation
    target.setHours(23, 59, 59, 999);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getDaysRemainingForMaintenance = (lastDate: string, interval: number): number => {
    const last = new Date(lastDate);
    const next = new Date(last.getFullYear(), last.getMonth(), last.getDate() + interval);
    const today = new Date();
    const diffTime = next.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getCurrentDayOfWeekTR = (): ('Pzt' | 'Sal' | 'Çar' | 'Per' | 'Cum' | 'Cmt' | 'Paz') => {
    const jsDayIndex = new Date().getDay(); // 0 for Sunday, 1 for Monday...
    const dayMap: { [key: number]: ('Pzt' | 'Sal' | 'Çar' | 'Per' | 'Cum' | 'Cmt' | 'Paz')} = {
        1: 'Pzt', 2: 'Sal', 3: 'Çar', 4: 'Per', 5: 'Cum', 6: 'Cmt', 0: 'Paz'
    };
    return dayMap[jsDayIndex];
};

export const toISODateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};
