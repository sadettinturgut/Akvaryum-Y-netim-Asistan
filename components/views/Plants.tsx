import React, { useState } from 'react';
import Card from '../ui/Card';
import { Plant, Aquarium } from '../../types';
import { getAiPlantInfo } from '../../services/geminiService';

interface PlantsProps {
    aquarium: Aquarium;
    onUpdateAquarium: (aquarium: Aquarium) => void;
}

const Plants: React.FC<PlantsProps> = ({ aquarium, onUpdateAquarium }) => {
    const [showForm, setShowForm] = useState(false);
    const [newPlant, setNewPlant] = useState<Omit<Plant, 'id' | 'imageUrl'>>({ name: '', species: '', count: 1, addedDate: new Date().toISOString().split('T')[0], notes: ''});
    
    // AI Feature State
    const [aiSearchTerm, setAiSearchTerm] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const [isAiDataFetched, setIsAiDataFetched] = useState(false);

    const handleAiFetch = async () => {
        if (!aiSearchTerm.trim()) {
            setAiError('Lütfen bir bitki adı girin.');
            return;
        }
        setAiLoading(true);
        setAiError(null);
        try {
            const plantInfo = await getAiPlantInfo(aiSearchTerm);
            setNewPlant(prev => ({
                ...prev,
                name: plantInfo.name,
                species: plantInfo.species,
                notes: plantInfo.notes,
            }));
            setIsAiDataFetched(true);
        } catch (err: any) {
            setAiError(err.message || 'Bilgiler alınamadı.');
        } finally {
            setAiLoading(false);
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setAiSearchTerm('');
        setNewPlant({ name: '', species: '', count: 1, addedDate: new Date().toISOString().split('T')[0], notes: ''});
        setAiLoading(false);
        setAiError(null);
        setIsAiDataFetched(false);
    };

    const handleToggleForm = () => {
        if (showForm) {
            resetForm();
        } else {
            setShowForm(true);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewPlant(prev => ({...prev, [name]: name === 'count' ? parseInt(value) : value }));
    };

    const handleAddPlant = (e: React.FormEvent) => {
        e.preventDefault();
        const plantToAdd: Plant = {
            id: Date.now(),
            ...newPlant,
            imageUrl: `https://via.placeholder.com/150/4caf50/0b192f?text=${newPlant.name.replace(/\s/g, '+').substring(0,6)}`,
        };
        const updatedAquarium = {
            ...aquarium,
            plants: [plantToAdd, ...(aquarium.plants || [])],
        };
        onUpdateAquarium(updatedAquarium);
        resetForm();
    };

    const handleDeletePlant = (plantId: number) => {
        if (window.confirm("Bu bitkiyi silmek istediğinizden emin misiniz?")) {
            const updatedPlantsList = (aquarium.plants || []).filter(p => p.id !== plantId);
            const updatedAquarium = {
                ...aquarium,
                plants: updatedPlantsList,
            };
            onUpdateAquarium(updatedAquarium);
        }
    };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-aqua-text-primary">{aquarium.name} Bitkileri</h2>
            <button
                onClick={handleToggleForm}
                className="bg-aqua-accent text-aqua-deep font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-200"
            >
                {showForm ? 'İptal' : 'Yeni Bitki Ekle'}
            </button>
        </div>

        {showForm && (
            <Card>
                <form onSubmit={handleAddPlant} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="ai-search" className="text-sm font-medium text-aqua-text-secondary">Aranacak Bitki Adı</label>
                        <div className="flex gap-2">
                            <input
                                id="ai-search"
                                type="text"
                                value={aiSearchTerm}
                                onChange={(e) => setAiSearchTerm(e.target.value)}
                                placeholder="Örn: Anubias Nana"
                                className="flex-grow p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none"
                                disabled={aiLoading || isAiDataFetched}
                            />
                            <button
                                type="button"
                                onClick={handleAiFetch}
                                disabled={aiLoading || isAiDataFetched}
                                className="bg-aqua-accent text-aqua-deep font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-200 disabled:bg-aqua-light disabled:cursor-not-allowed flex items-center justify-center w-40"
                            >
                                {aiLoading ? (
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    "Bilgileri Getir"
                                )}
                            </button>
                        </div>
                        {aiError && <p className="text-red-400 text-sm mt-1">{aiError}</p>}
                    </div>

                    {isAiDataFetched && (
                        <div className="border-t border-aqua-light pt-4 mt-4 space-y-4 animate-fade-in">
                            <h3 className="text-lg font-semibold text-aqua-text-primary">Bitki Bilgileri</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" name="name" placeholder="Bitki Adı" value={newPlant.name} onChange={handleInputChange} required className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none" />
                                <input type="text" name="species" placeholder="Tür" value={newPlant.species} onChange={handleInputChange} required className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none" />
                                <input type="number" name="count" placeholder="Sayı" value={newPlant.count} onChange={handleInputChange} required min="1" className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none" />
                                <input type="date" name="addedDate" value={newPlant.addedDate} onChange={handleInputChange} required className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none" />
                            </div>
                            <textarea name="notes" placeholder="Notlar (ışık ihtiyacı, durumu vb.)" value={newPlant.notes} onChange={handleInputChange} className="w-full p-2 h-24 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none"></textarea>
                            <button type="submit" className="w-full bg-aqua-accent text-aqua-deep font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-200">Bitkiyi Akvaryuma Ekle</button>
                        </div>
                    )}
                </form>
            </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(aquarium.plants || []).map(plant => (
                 <Card key={plant.id} className="flex flex-col relative group">
                    <button 
                        onClick={() => handleDeletePlant(plant.id)}
                        className="absolute top-3 right-3 bg-red-800/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                        aria-label="Bitkiyi sil"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <img src={plant.imageUrl} alt={plant.name} className="rounded-lg h-40 w-full object-cover mb-4"/>
                    <h3 className="text-xl font-bold text-aqua-text-primary">{plant.name}</h3>
                    <p className="text-aqua-accent font-mono text-sm mb-2">{plant.species}</p>
                    <div className="text-aqua-text-secondary text-sm space-y-1 mt-auto pt-2">
                       <p><strong>Sayı:</strong> {plant.count}</p>
                       <p><strong>Eklenme Tarihi:</strong> {new Date(plant.addedDate).toLocaleDateString('tr-TR')}</p>
                       {plant.notes && <p className="mt-2 italic">"{plant.notes}"</p>}
                    </div>
                </Card>
            ))}
        </div>
    </div>
  );
};

export default Plants;