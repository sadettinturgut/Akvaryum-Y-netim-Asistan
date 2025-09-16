import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Page, Aquarium } from './types';
import { MENU_ITEMS } from './constants/navigation';
import { loadAquariums, saveAquariums } from './utils/storage';

import Sidebar from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';
import Header from './components/layout/Header';
import OnboardingSetup from './components/views/OnboardingSetup';

import Dashboard from './components/views/Dashboard';
import MyFish from './components/views/MyFish';
import Plants from './components/views/Plants';
import WaterParameters from './components/views/WaterParameters';
import Equipment from './components/views/Equipment';
import FeedingPlan from './components/views/FeedingPlan';
import Maintenance from './components/views/Maintenance';
import DiseaseGuide from './components/views/DiseaseGuide';
import AiAnalysis from './components/views/AiAnalysis';
import KnowledgeBase from './components/views/KnowledgeBase';
import Reports from './components/views/Reports';
import Settings from './components/views/Settings';

type Theme = 'dark' | 'neon' | 'natural';

const App: React.FC = () => {
  const [aquariums, setAquariums] = useState<Aquarium[]>(loadAquariums());
  const [activeAquariumId, setActiveAquariumId] = useState<string | null>(aquariums.length > 0 ? aquariums[0].id : null);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('aquariumTheme') as Theme) || 'dark');
  
  useEffect(() => {
    document.body.className = ''; // Reset classes
    document.body.classList.add(`theme-${theme}`, 'bg-aqua-deep', 'text-aqua-text-primary');
    localStorage.setItem('aquariumTheme', theme);
  }, [theme]);

  useEffect(() => {
    saveAquariums(aquariums);
    if (aquariums.length > 0 && !activeAquariumId) {
        setActiveAquariumId(aquariums[0].id);
    }
     if (aquariums.length === 0) {
        setActiveAquariumId(null);
    }
  }, [aquariums, activeAquariumId]);

  const handleUpdateAquarium = useCallback((updatedAquarium: Aquarium) => {
    setAquariums(currentAquariums => {
        const newAquariums = currentAquariums.map(aq =>
            aq.id === updatedAquarium.id ? updatedAquarium : aq
        );
        return newAquariums;
    });
  }, []);
  
  const handleAddAquarium = (newAquarium: Aquarium) => {
      const newAquariums = [...aquariums, newAquarium];
      setAquariums(newAquariums);
      setActiveAquariumId(newAquarium.id);
  };

  const handlePageChange = useCallback((page: Page) => {
    setActivePage(page);
  }, []);
  
  const handleAquariumChange = useCallback((id: string) => {
    setActiveAquariumId(id);
  }, []);

  const [activePage, setActivePage] = useState<Page>('dashboard');

  const activeAquarium = useMemo(() => {
    if (!activeAquariumId || aquariums.length === 0) return null;
    return aquariums.find(aq => aq.id === activeAquariumId);
  }, [aquariums, activeAquariumId]);
  
  if (aquariums.length === 0) {
      return <OnboardingSetup onSetupComplete={handleAddAquarium} />;
  }
  
  if (!activeAquarium) {
      return <div className="w-full h-screen flex items-center justify-center bg-aqua-deep text-aqua-text-primary">Akvaryum yükleniyor...</div>;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard aquarium={activeAquarium} onNavigate={handlePageChange} />;
      case 'my-fish':
        return <MyFish aquarium={activeAquarium} onUpdateAquarium={handleUpdateAquarium} />;
      case 'plants':
        return <Plants aquarium={activeAquarium} onUpdateAquarium={handleUpdateAquarium} />;
      case 'water-parameters':
        return <WaterParameters aquarium={activeAquarium} onUpdateAquarium={handleUpdateAquarium} />;
      case 'equipment':
        return <Equipment aquarium={activeAquarium} onUpdateAquarium={handleUpdateAquarium} />;
      case 'feeding-plan':
        return <FeedingPlan aquarium={activeAquarium} onUpdateAquarium={handleUpdateAquarium} />;
      case 'maintenance':
        return <Maintenance aquarium={activeAquarium} onUpdateAquarium={handleUpdateAquarium} />;
      case 'disease-guide':
        return <DiseaseGuide />;
      case 'ai-analysis':
        return <AiAnalysis />;
      case 'knowledge-base':
        return <KnowledgeBase />;
      case 'reports':
        return <Reports aquarium={activeAquarium} />;
      case 'settings':
        return <Settings theme={theme} onThemeChange={setTheme} />;
      default:
        return <Dashboard aquarium={activeAquarium} onNavigate={handlePageChange} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans">
      <Sidebar activePage={activePage} onNavigate={handlePageChange} />
      
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        <Header 
          aquariums={aquariums}
          activeAquariumId={activeAquariumId || ''}
          onAquariumChange={handleAquariumChange}
        />
        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {renderPage()}
        </div>
      </main>

      <BottomNav activePage={activePage} onNavigate={handlePageChange} />
    </div>
  );
};

export default App;