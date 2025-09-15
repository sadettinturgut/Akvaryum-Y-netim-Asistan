import React, { useState } from 'react';
import Card from '../ui/Card';
import { Fish, Aquarium } from '../../types';

interface MyFishProps {
    aquarium: Aquarium;
}

const MyFish: React.FC<MyFishProps> = ({ aquarium }) => {
    const [fishList, setFishList] = useState<Fish[]>(aquarium.fish);
    const [showForm, setShowForm] = useState(false);
    const [newFish, setNewFish] = useState<Omit<Fish, 'id' | 'imageUrl'>>({ name: '', species: '', count: 1, addedDate: '', notes: ''});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewFish(prev => ({...prev, [name]: name === 'count' ? parseInt(value) : value }));
    };

    const handleAddFish = (e: React.FormEvent) => {
        e.preventDefault();
        const fishToAdd: Fish = {
            id: Date.now(),
            ...newFish,
            imageUrl: `https://via.placeholder.com/150/ccd6f6/0b192f?text=${newFish.name.substring(0,6)}`,
        };
        setFishList(prev => [fishToAdd, ...prev]);
        setNewFish({ name: '', species: '', count: 1, addedDate: '', notes: ''});
        setShowForm(false);
        // Note: In a real app, this would update the global state in App.tsx
    };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-aqua-text-primary">{aquarium.name} Sakinleri</h2>
            <button
                onClick={() => setShowForm(!showForm)}
                className="bg-aqua-accent text-aqua-deep font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-200"
            >
                {showForm ? 'İptal' : 'Yeni Balık Ekle'}
            </button>
        </div>

        {showForm && (
            <Card>
                <form onSubmit={handleAddFish} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <input type="text" name="name" placeholder="Balık Adı (örn: Neon Sürü)" value={newFish.name} onChange={handleInputChange} required className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none" />
                         <input type="text" name="species" placeholder="Tür (örn: Paracheirodon innesi)" value={newFish.species} onChange={handleInputChange} required className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none" />
                         <input type="number" name="count" placeholder="Sayı" value={newFish.count} onChange={handleInputChange} required min="1" className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none" />
                         <input type="date" name="addedDate" value={newFish.addedDate} onChange={handleInputChange} required className="p-2 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none" />
                    </div>
                    <textarea name="notes" placeholder="Notlar (davranış, gözlem vb.)" value={newFish.notes} onChange={handleInputChange} className="w-full p-2 h-24 bg-aqua-light rounded-md focus:ring-aqua-accent focus:ring-2 outline-none"></textarea>
                    <button type="submit" className="w-full bg-aqua-accent text-aqua-deep font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-200">Ekle</button>
                </form>
            </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fishList.map(fish => (
                 <Card key={fish.id} className="flex flex-col">
                    <img src={fish.imageUrl} alt={fish.name} className="rounded-lg h-40 w-full object-cover mb-4"/>
                    <h3 className="text-xl font-bold text-aqua-text-primary">{fish.name}</h3>
                    <p className="text-aqua-accent font-mono text-sm mb-2">{fish.species}</p>
                    <div className="text-aqua-text-secondary text-sm space-y-1 mt-auto pt-2">
                       <p><strong>Sayı:</strong> {fish.count}</p>
                       <p><strong>Eklenme Tarihi:</strong> {fish.addedDate}</p>
                       {fish.notes && <p className="mt-2 italic">"{fish.notes}"</p>}
                    </div>
                </Card>
            ))}
        </div>
    </div>
  );
};

export default MyFish;
