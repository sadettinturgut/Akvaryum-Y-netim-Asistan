import { Aquarium } from '../types';

const STORAGE_KEY = 'aquaAsistanAquariums';

export const saveAquariums = (aquariums: Aquarium[]): void => {
    try {
        const serializedState = JSON.stringify(aquariums);
        localStorage.setItem(STORAGE_KEY, serializedState);
    } catch (error) {
        console.error("Akvaryumlar yerel depolamaya kaydedilemedi", error);
    }
};

export const loadAquariums = (): Aquarium[] => {
    try {
        const serializedState = localStorage.getItem(STORAGE_KEY);
        if (serializedState === null) {
            return [];
        }
        return JSON.parse(serializedState);
    } catch (error) {
        console.error("Akvaryumlar yerel depolamadan yüklenemedi", error);
        return [];
    }
};
