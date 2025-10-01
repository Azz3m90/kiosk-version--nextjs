'use client';

import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import type { Language } from '@/types';

const languages: { code: Language; flag: string; name: string }[] = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'nl', flag: '🇳🇱', name: 'Nederlands' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'it', flag: '🇮🇹', name: 'Italiano' },
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
        <div className="flex items-center gap-3 flex-wrap justify-end">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Language Selector */}
          <div className="flex flex-wrap gap-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-2 rounded-2xl shadow-xl max-w-[600px]">
            {languages.map(({ code, flag, name }) => (
              <button
                key={code}
                onClick={() => changeLanguage(code)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-xl font-semibold transition-all duration-200 min-w-[80px]
                  ${
                    currentLanguage === code
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:transform hover:scale-105'
                  }
                `}
                title={name}
                aria-label={`Switch to ${name}`}
              >
                <span className="text-xl" role="img" aria-label={name}>
                  {flag}
                </span>
                <span className="hidden xl:inline text-sm">{name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}