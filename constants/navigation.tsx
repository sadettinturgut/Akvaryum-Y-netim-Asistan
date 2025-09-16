import React from 'react';
import { MenuItem } from '../types';

const iconClass = "h-6 w-6";

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    name: 'Ana Panel',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    id: 'ai-analysis',
    name: 'Yapay Zeka Analizi',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104l-2.29 2.292c-.34.34-.34.89 0 1.232l5.25 5.25c.34.34.89.34 1.232 0l2.29-2.292M14.25 10.896l-5.25-5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
   {
    id: 'my-fish',
    name: 'Balıklarım',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 12.5c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.5c0 4.142-3.358 7.5-7.5 7.5S6 16.642 6 12.5c0-2.454 1.12-4.665 2.894-6.106C10.878 4.607 13.6 3.5 16.5 3.5c2.9 0 5.622 1.107 7.606 2.894C20.88 7.835 21 10.046 21 12.5zM11.5 10.5C11.5 8.015 9.485 6 7 6s-4.5 2.015-4.5 4.5S4.515 15 7 15s4.5-2.015 4.5-4.5z"/>
        </svg>
    ),
  },
  {
    id: 'plants',
    name: 'Bitkilerim',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9.004 9.004 0 008.667-5.992 9.02 9.02 0 00-4.333-7.55C15.006 6.57 12 3 12 3s-3.006 3.57-4.334 4.458c-2.32 1.58-3.5 4.318-4.333 7.55A9.004 9.004 0 0012 21z" />
        </svg>
    ),
  },
  {
    id: 'water-parameters',
    name: 'Su Değerleri',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M12 21a9 9 0 110-18 9 9 0 010 18z" />
      </svg>
    ),
  },
  {
    id: 'maintenance',
    name: 'Bakım Takvimi',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
   {
    id: 'disease-guide',
    name: 'Hastalık Rehberi',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
        </svg>
    ),
  },
   {
    id: 'knowledge-base',
    name: 'Bilgi Kütüphanesi',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: 'equipment',
    name: 'Ekipman Yönetimi',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
  },
  {
    id: 'feeding-plan',
    name: 'Yemleme Planı',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
    ),
  },
  {
    id: 'reports',
    name: 'Raporlama',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'settings',
    name: 'Ayarlar',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
  },
];