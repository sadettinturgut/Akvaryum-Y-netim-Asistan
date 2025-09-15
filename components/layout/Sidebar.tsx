
import React from 'react';
import { Page } from '../../types';
import { MENU_ITEMS } from '../../constants/navigation';

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-aqua-dark border-r border-aqua-light">
      <div className="flex items-center justify-center h-20 border-b border-aqua-light">
        <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-aqua-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 12.5c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.5c0 4.142-3.358 7.5-7.5 7.5S6 16.642 6 12.5c0-2.454 1.12-4.665 2.894-6.106C10.878 4.607 13.6 3.5 16.5 3.5c2.9 0 5.622 1.107 7.606 2.894C20.88 7.835 21 10.046 21 12.5zM11.5 10.5C11.5 8.015 9.485 6 7 6s-4.5 2.015-4.5 4.5S4.515 15 7 15s4.5-2.015 4.5-4.5z"/>
            </svg>
            <h1 className="text-xl font-bold ml-2 text-aqua-text-primary">AquaAsistan</h1>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {MENU_ITEMS.map((item) => (
          <a
            key={item.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate(item.id);
            }}
            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
              activePage === item.id
                ? 'bg-aqua-accent text-aqua-deep'
                : 'text-aqua-text-secondary hover:bg-aqua-light hover:text-aqua-text-primary'
            }`}
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
