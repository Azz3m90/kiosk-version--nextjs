'use client';

import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import type { Step } from '@/types';
import { UtensilsCrossed, Wine, ClipboardCheck, CreditCard } from 'lucide-react';

const stepOrder: Step[] = ['food', 'drinks', 'review', 'payment'];

const stepIcons = {
  food: UtensilsCrossed,
  drinks: Wine,
  review: ClipboardCheck,
  payment: CreditCard,
};

const stepTranslationKeys = {
  food: 'food_title',
  drinks: 'drinks_title',
  review: 'review_order',
  payment: 'payment',
};

export function PageIndicator() {
  const { currentStep, navigateToStep, cart, showToast } = useKiosk();
  const { t } = useTranslation();

  const currentIndex = stepOrder.indexOf(currentStep);

  const handleStepClick = (step: Step) => {
    // Check if trying to navigate to review/payment with empty cart
    if ((step === 'review' || step === 'payment') && cart.length === 0) {
      showToast(t('cart_empty_warning'), 'warning');
      return;
    }
    navigateToStep(step);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-4 py-3 rounded-full shadow-xl border border-gray-200 dark:border-gray-700">
      {stepOrder.map((step, index) => {
        const Icon = stepIcons[step];
        const isActive = index === currentIndex;
        const isPast = index < currentIndex;
        const translationKey = stepTranslationKeys[step];

        return (
          <button
            key={step}
            onClick={() => handleStepClick(step)}
            className={`
              relative flex items-center justify-center transition-all duration-500 touch-manipulation
              ${isActive 
                ? 'w-auto px-5 h-12 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-full scale-125 shadow-2xl animate-pulse-slow' 
                : 'w-10 h-10 rounded-full hover:scale-110'
              }
              ${isPast && !isActive
                ? 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50'
                : !isActive && 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }
            `}
            style={isActive ? {
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.6), 0 10px 40px rgba(0, 0, 0, 0.3)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
            } : undefined}
            title={t(translationKey)}
            aria-label={t(translationKey)}
            aria-current={isActive ? 'page' : undefined}
          >
            {/* Animated ring for active page */}
            {isActive && (
              <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping-slow" 
                style={{ animationDuration: '2s' }}
              />
            )}

            {/* Icon */}
            <Icon
              className={`
                transition-all duration-500
                ${isActive 
                  ? 'w-6 h-6 text-white drop-shadow-lg' 
                  : 'w-5 h-5'
                }
                ${isPast && !isActive
                  ? 'text-green-600 dark:text-green-400'
                  : !isActive && 'text-gray-600 dark:text-gray-400'
                }
              `}
              strokeWidth={isActive ? 3 : 2.5}
            />

            {/* Active page label */}
            {isActive && (
              <span className="ml-2.5 text-base font-extrabold text-white whitespace-nowrap drop-shadow-md tracking-wide">
                {t(translationKey)}
              </span>
            )}

            {/* Checkmark for completed steps */}
            {isPast && !isActive && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>
        );
      })}

      {/* Swipe hint text - subtle */}
      <div className="ml-2 pl-2 border-l border-gray-300 dark:border-gray-600">
        <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
          ← {t('swipe')} →
        </p>
      </div>
    </div>
  );
}