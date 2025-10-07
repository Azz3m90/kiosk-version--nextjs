'use client';

import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { FlagIcons } from '@/components/ui/FlagIcons';
import { ShoppingBag, UtensilsCrossed } from 'lucide-react';
import type { Language } from '@/types';

const languages: { code: Language; name: string; label: string }[] = [
  { code: 'en', name: 'English', label: 'EN' },
  { code: 'fr', name: 'Français', label: 'FR' },
  { code: 'nl', name: 'Nederlands', label: 'NL' },
  { code: 'de', name: 'Deutsch', label: 'DE' },
  { code: 'es', name: 'Español', label: 'ES' },
  { code: 'it', name: 'Italiano', label: 'IT' },
];

export function Header() {
  const { changeLanguage, currentLanguage, orderType } = useKiosk();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-primary-500 to-secondary-500 dark:from-gray-800 dark:to-gray-900 px-4 lg:px-6 py-3 shadow-lg transition-colors duration-300">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Title & Order Type */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl lg:text-2xl font-bold text-white drop-shadow-md">
            {t('welcome')}
          </h1>
          
          {/* Order Type Badge - Compact */}
          {orderType && (
            <div className="flex items-center gap-1.5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md">
              {orderType === 'eatin' ? (
                <>
                  <UtensilsCrossed className="w-4 h-4 text-green-600 dark:text-emerald-400" strokeWidth={2.5} />
                  <span className="text-xs font-bold text-green-700 dark:text-emerald-300 hidden sm:inline">
                    {t('eat_in')}
                  </span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-orange-600 dark:text-orange-400" strokeWidth={2.5} />
                  <span className="text-xs font-bold text-orange-700 dark:text-orange-300 hidden sm:inline">
                    {t('take_away')}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: Controls - Compact Layout */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle - Compact */}
          <ThemeToggle />

          {/* Language Selector - Compact & Horizontal */}
          <div className="flex gap-1.5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-1.5 rounded-xl shadow-lg">
            {languages.map(({ code, name, label }) => {
              const FlagIcon = FlagIcons[code];
              return (
                <button
                  key={code}
                  onClick={() => changeLanguage(code)}
                  className={`
                    relative flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 
                    min-w-[50px] touch-manipulation
                    ${
                      currentLanguage === code
                        ? 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-md scale-105 ring-2 ring-primary-300 dark:ring-primary-600'
                        : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
                    }
                  `}
                  title={name}
                  aria-label={`Switch to ${name}`}
                  aria-pressed={currentLanguage === code}
                >
                  {/* Flag Icon - Smaller */}
                  <FlagIcon 
                    width={28} 
                    height={21} 
                    className={`
                      filter drop-shadow-sm transition-all duration-200 mb-0.5
                      ${currentLanguage === code ? 'brightness-110' : 'opacity-80'}
                    `}
                  />
                  
                  {/* Language Code - Smaller */}
                  <span className={`
                    text-[9px] font-bold tracking-wide
                    ${
                      currentLanguage === code 
                        ? 'text-white' 
                        : 'text-gray-600 dark:text-gray-400'
                    }
                  `}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}