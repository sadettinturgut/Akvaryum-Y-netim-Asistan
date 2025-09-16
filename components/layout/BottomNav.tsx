import React from 'react';
import { Page } from '../../types';
import { MENU_ITEMS } from '../../constants/navigation';

interface BottomNavProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate }) => {
  // Show only a subset of items on the bottom nav for clarity
  const navItems = MENU_ITEMS.filter(item => ['dashboard', 'my-fish', 'plants', 'maintenance', 'ai-analysis'].includes(item.id));

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-aqua-dark border-t border-aqua-light shadow-lg z-50">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <a
            key={item.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate(item.id);
            }}
            className={`flex flex-col items-center justify-center w-full py-2 px-1 text-xs transition-colors duration-200 ${
              activePage === item.id
                ? 'text-aqua-accent'
                : 'text-aqua-text-secondary hover:text-aqua-accent'
            }`}
          >
            {item.icon}
            <span className="mt-1 text-center leading-tight">{item.name}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;