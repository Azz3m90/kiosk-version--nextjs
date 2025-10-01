'use client';

import { useKiosk } from '@/context/KioskContext';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { currentTheme, toggleTheme } = useKiosk();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 min-h-[44px] min-w-[44px] bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl group"
      aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Animated Background Slider */}
      <div 
        className={`absolute inset-0 rounded-xl transition-all duration-500 ${
          currentTheme === 'light'
            ? 'bg-gradient-to-r from-amber-400 to-orange-500'
            : 'bg-gradient-to-r from-indigo-600 to-purple-700'
        }`}
      />
      
      {/* Icon Container */}
      <div className="relative flex items-center justify-center w-full">
        {/* Sun Icon */}
        <div
          className={`absolute transition-all duration-500 ${
            currentTheme === 'light'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-0'
          }`}
        >
          <Sun className="w-5 h-5 text-white drop-shadow-md" />
        </div>
        
        {/* Moon Icon */}
        <div
          className={`absolute transition-all duration-500 ${
            currentTheme === 'dark'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-90 scale-0'
          }`}
        >
          <Moon className="w-5 h-5 text-white drop-shadow-md" />
        </div>
      </div>
      
      {/* Optional Label (hidden on small screens) */}
      <span className="relative hidden xl:inline text-white text-sm ml-1 font-bold drop-shadow-md">
        {currentTheme === 'light' ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}