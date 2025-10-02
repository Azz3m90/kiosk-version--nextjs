'use client';

import { useKiosk } from '@/context/KioskContext';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { currentTheme, toggleTheme } = useKiosk();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-500 min-h-[44px] min-w-[44px] bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 group overflow-hidden"
      aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Animated Background with Glow Effect */}
      <div 
        className={`absolute inset-0 rounded-xl transition-all duration-700 ease-in-out ${
          currentTheme === 'light'
            ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500'
            : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'
        }`}
      />
      
      {/* Animated Shimmer Effect */}
      <div 
        className={`absolute inset-0 rounded-xl opacity-50 transition-all duration-700 ${
          currentTheme === 'light'
            ? 'bg-gradient-to-r from-transparent via-white to-transparent'
            : 'bg-gradient-to-r from-transparent via-white/20 to-transparent'
        } bg-[length:200%_100%] animate-shimmer`}
      />
      
      {/* Icon Container with Smooth Rotation */}
      <div className="relative flex items-center justify-center w-full">
        {/* Sun Icon with Rays Animation */}
        <div
          className={`absolute transition-all duration-700 ease-in-out ${
            currentTheme === 'light'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-180 scale-50'
          }`}
        >
          <Sun className="w-5 h-5 text-white drop-shadow-lg animate-pulse-slow" />
        </div>
        
        {/* Moon Icon with Glow */}
        <div
          className={`absolute transition-all duration-700 ease-in-out ${
            currentTheme === 'dark'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-180 scale-50'
          }`}
        >
          <Moon className="w-5 h-5 text-white drop-shadow-lg" />
        </div>
      </div>
      
      {/* Optional Label with Fade Effect */}
      <span className={`relative hidden xl:inline text-white text-sm ml-1 font-bold drop-shadow-lg transition-all duration-500 ${
        currentTheme === 'light' ? 'opacity-100' : 'opacity-90'
      }`}>
        {currentTheme === 'light' ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}