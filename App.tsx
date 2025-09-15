import React, { useState, useCallback, useMemo } from 'react';
import { Page, Aquarium } from './types';
import { MENU_ITEMS } from './constants/navigation';
import { initialAquariums, initialAchievements } from './data/initialData';

import Sidebar from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';
import Header from './components/layout/Header';

import Dashboard from './components/views/Dashboard';
import MyFish from './components/views/MyFish';
import WaterParameters from './components/views/WaterParameters';
import Equipment from './components/views/Equipment';
import FeedingPlan from './components/views/FeedingPlan';
import Maintenance from './components/views/Maintenance';
import DiseaseGuide from './components/views/DiseaseGuide';
import AiAnalysis from './components/views/AiAnalysis';
import KnowledgeBase from './components/views/KnowledgeBase';
import Achievements from './components/views/Achievements';
import Reports from './components/views/Reports';
import Settings from './components/views/Settings';


const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [aquariums, setAquariums] = useState<Aquarium[]>(initialAquariums);
  const [activeAquariumId, setActiveAquariumId] = useState<string>(initialAquariums[0].id);

  const handlePageChange = useCallback((page: Page) => {
    setActivePage(page);
  }, []);
  
  const handleAquariumChange = useCallback((id: string) => {
    setActiveAquariumId(id);
  }, []);

  const activeAquarium = useMemo(() => {
    return aquariums.find(aq => aq.id === activeAquariumId) || aquariums[0];
  }, [aquariums, activeAquariumId]);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard aquarium={activeAquarium} onNavigate={handlePageChange} />;
      case 'my-fish':
        return <MyFish aquarium={activeAquarium} />;
      case 'water-parameters':
        return <WaterParameters aquarium={activeAquarium} />;
      case 'equipment':
        return <Equipment aquarium={activeAquarium} />;
      case 'feeding-plan':
        return <FeedingPlan aquarium={activeAquarium} />;
      case 'maintenance':
        return <Maintenance aquarium={activeAquarium} />;
      case 'disease-guide':
        return <DiseaseGuide />;
      case 'ai-analysis':
        return <AiAnalysis />;
      case 'knowledge-base':
        return <KnowledgeBase />;
       case 'achievements':
        return <Achievements achievements={initialAchievements} />;
      case 'reports':
        return <Reports aquarium={activeAquarium} />;
      case 'settings':
        return <Settings />;
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
          activeAquariumId={activeAquariumId}
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
