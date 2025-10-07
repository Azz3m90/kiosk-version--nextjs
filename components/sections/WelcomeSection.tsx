'use client';

import { useKiosk } from '@/context/KioskContext';
import { Languages } from 'lucide-react';
import { FlagIcons } from '@/components/ui/FlagIcons';
import type { Language } from '@/types';

interface LanguageOption {
  code: Language;
  name: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' },
];

export function WelcomeSection() {
  const { changeLanguage, navigateToStep } = useKiosk();

  const handleLanguageSelect = (lang: Language) => {
    changeLanguage(lang);
    navigateToStep('orderType');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-4xl w-full">
        {/* Logo and Welcome Message */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <Languages className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300">
            Please select your language
          </p>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mt-2">
            Veuillez sélectionner votre langue • Selecteer uw taal
          </p>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400">
            Wählen Sie Ihre Sprache • Seleccione su idioma • Seleziona la tua lingua
          </p>
        </div>

        {/* Language Selection Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {languages.map((lang, index) => {
            const FlagIcon = FlagIcons[lang.code];
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 border-2 border-transparent hover:border-blue-500 dark:hover:border-purple-500"
                style={{
                  animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Background Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-600/0 group-hover:from-blue-500/10 group-hover:to-purple-600/10 transition-all duration-300" />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Flag Icon */}
                  <div className="flex justify-center mb-3 md:mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    <FlagIcon 
                      width={80} 
                      height={60} 
                      className="filter drop-shadow-lg rounded-md"
                    />
                  </div>
                  
                  {/* Language Name */}
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                    {lang.name}
                  </h2>
                  
                  {/* Select Text */}
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Tap to select
                  </p>
                </div>

                {/* Hover Ring Effect */}
                <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-500/0 group-hover:ring-blue-500/50 dark:group-hover:ring-purple-500/50 transition-all duration-300" />
              </button>
            );
          })}
        </div>

        {/* Touch Anywhere Hint */}
        <div className="text-center mt-12 animate-pulse">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Touch your preferred language to continue
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}