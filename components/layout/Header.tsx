import React, { useState } from 'react';
import { Aquarium } from '../../types';

interface HeaderProps {
  aquariums: Aquarium[];
  activeAquariumId: string;
  onAquariumChange: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({ aquariums, activeAquariumId, onAquariumChange }) => {
  const activeAquarium = aquariums.find(aq => aq.id === activeAquariumId);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (id: string) => {
    onAquariumChange(id);
    setIsOpen(false);
  }

  return (
    <header className="flex-shrink-0 bg-aqua-dark h-16 md:h-20 flex items-center justify-between px-4 md:px-8 border-b border-aqua-light">
      <div className="relative">
        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-aqua-text-primary">{activeAquarium?.name || 'Akvaryum Seç'}</h2>
          <svg className={`w-5 h-5 text-aqua-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        {isOpen && (
           <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-aqua-light ring-1 ring-black ring-opacity-5 z-50">
             <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                {aquariums.map(aq => (
                   <a
                     key={aq.id}
                     href="#"
                     onClick={(e) => { e.preventDefault(); handleSelect(aq.id); }}
                     className={`block px-4 py-2 text-sm ${activeAquariumId === aq.id ? 'text-aqua-accent' : 'text-aqua-text-primary'} hover:bg-aqua-dark`}
                     role="menuitem"
                   >
                     {aq.name}
                   </a>
                ))}
             </div>
           </div>
        )}
      </div>
    </header>
  );
};

export default Header;
