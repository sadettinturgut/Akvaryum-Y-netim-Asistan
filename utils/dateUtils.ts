export const getDaysUntil = (targetDate: string): number => {
    const target = new Date(targetDate);
    // Set target time to the end of the day for accurate "today" calculation
    target.setHours(23, 59, 59, 999);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
