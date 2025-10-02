'use client';

import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { FlagIcons } from '@/components/ui/FlagIcons';
import type { Language } from '@/types';

const languages: { code: Language; name: string; label: string }[] = [
  { code: 'en', name: 'English', label: 'EN' },
  { code: 'fr', name: 'Français', label: 'FR' },
  { code: 'nl', name: 'Nederlands', label: 'NL' },
];

export function Header() {
  const { changeLanguage, currentLanguage } = useKiosk();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-primary-500 to-secondary-500 dark:from-gray-800 dark:to-gray-900 px-6 lg:px-8 py-5 shadow-lg transition-colors duration-300">
      <div className="flex items-center justify-between gap-4">
        {/* Title */}
        <h1 className="text-2xl lg:text-3xl font-bold text-white drop-shadow-md">
          {t('welcome')}
        </h1>

        {/* Controls Container */}
        <div className="flex items-center gap-4 flex-wrap justify-end">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Language Selector - Kiosk optimized with larger touch targets */}
          <div className="flex gap-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl">
            {languages.map(({ code, name, label }) => {
              const FlagIcon = FlagIcons[code];
              return (
                <button
                  key={code}
                  onClick={() => changeLanguage(code)}
                  className={`
                    relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 
                    min-w-[80px] min-h-[80px] touch-manipulation
                    ${
                      currentLanguage === code
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg transform scale-110 ring-4 ring-primary-300 dark:ring-primary-700'
                        : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 hover:transform hover:scale-105 shadow-md'
                    }
                  `}
                  title={name}
                  aria-label={`Switch to ${name}`}
                  aria-pressed={currentLanguage === code}
                >
                  {/* Flag Icon */}
                  <div className="mb-1">
                    <FlagIcon 
                      width={48} 
                      height={36} 
                      className={`
                        filter drop-shadow-md transition-all duration-200
                        ${currentLanguage === code ? 'brightness-110' : ''}
                      `}
                    />
                  </div>
                  
                  {/* Language Code Label */}
                  <span className={`
                    text-xs font-bold mt-1 tracking-wide
                    ${
                      currentLanguage === code 
                        ? 'text-white' 
                        : 'text-gray-700 dark:text-gray-200'
                    }
                  `}>
                    {label}
                  </span>
                  
                  {/* Active Indicator */}
                  {currentLanguage === code && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}