'use client';

import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Step } from '@/types';
import { useState } from 'react';

interface NavigationButtonsProps {
  currentStep: Step;
  showNext?: boolean;
  showPrevious?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  nextDisabled?: boolean;
  showProgress?: boolean;
}

const stepOrder: Step[] = ['food', 'drinks', 'review', 'payment'];

const stepIcons = {
  food: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    />
  ),
  drinks: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
    />
  ),
  review: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
    />
  ),
  payment: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3v-8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  ),
};

const stepLabels = {
  food: 'food_title',
  drinks: 'drinks_title',
  review: 'review_title',
  payment: 'payment_title',
};

export function NavigationButtons({
  currentStep,
  showNext = true,
  showPrevious = true,
  onNext,
  onPrevious,
  nextLabel,
  previousLabel,
  nextDisabled = false,
  showProgress = true,
}: NavigationButtonsProps) {
  const { navigateToStep, cart } = useKiosk();
  const { t } = useTranslation();
  const [isPrevPressed, setIsPrevPressed] = useState(false);
  const [isNextPressed, setIsNextPressed] = useState(false);

  const currentIndex = stepOrder.indexOf(currentStep);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < stepOrder.length - 1;

  // Check if next is disabled due to empty cart
  const isNextDisabledByCart =
    hasNext &&
    cart.length === 0 &&
    (stepOrder[currentIndex + 1] === 'review' || stepOrder[currentIndex + 1] === 'payment');

  const isNextReallyDisabled = nextDisabled || isNextDisabledByCart;

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else if (hasPrevious) {
      const previousStep = stepOrder[currentIndex - 1];
      navigateToStep(previousStep);
    }
  };

  const handleNext = () => {
    if (isNextReallyDisabled) return;

    if (onNext) {
      onNext();
    } else if (hasNext) {
      const nextStep = stepOrder[currentIndex + 1];
      // Only allow navigation to review/payment if cart has items
      if ((nextStep === 'review' || nextStep === 'payment') && cart.length === 0) {
        return;
      }
      navigateToStep(nextStep);
    }
  };

  return (
    <div className="mt-12 space-y-6">
      {/* Progress Indicator */}
      {showProgress && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-2 border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">
              {t('order_progress') || 'Order Progress'}
            </h3>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {t('step')} {currentIndex + 1} {t('of')} {stepOrder.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-6">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${((currentIndex + 1) / stepOrder.length) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="grid grid-cols-4 gap-2">
            {stepOrder.map((step, index) => {
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;
              const isUpcoming = index > currentIndex;

              return (
                <button
                  key={step}
                  onClick={() => {
                    // Allow navigation to previous steps only
                    if (index < currentIndex) {
                      navigateToStep(step);
                    }
                  }}
                  disabled={isUpcoming || isCurrent}
                  className={`
                    relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300
                    ${isCurrent ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500 dark:border-blue-400 scale-105' : ''}
                    ${isCompleted ? 'bg-green-50 dark:bg-green-900/30 border-2 border-green-400 dark:border-green-600 hover:scale-105 cursor-pointer' : ''}
                    ${isUpcoming ? 'bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 opacity-60 cursor-not-allowed' : ''}
                  `}
                  aria-label={`${t(stepLabels[step])} - ${isCurrent ? t('current_step') : isCompleted ? t('completed') : t('upcoming')}`}
                >
                  {/* Check mark for completed steps */}
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}

                  <svg
                    className={`w-7 h-7 mb-1 transition-colors ${isCurrent ? 'text-blue-600 dark:text-blue-400' :
                        isCompleted ? 'text-green-600 dark:text-green-400' :
                          'text-gray-400 dark:text-gray-500'
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {stepIcons[step]}
                  </svg>
                  <span className={`text-xs font-semibold text-center ${isCurrent ? 'text-blue-700 dark:text-blue-300' :
                      isCompleted ? 'text-green-700 dark:text-green-300' :
                        'text-gray-500 dark:text-gray-400'
                    }`}>
                    {t(stepLabels[step])}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center gap-6">
        {/* Previous Button */}
        {showPrevious && hasPrevious ? (
          <button
            onClick={handlePrevious}
            onMouseDown={() => setIsPrevPressed(true)}
            onMouseUp={() => setIsPrevPressed(false)}
            onMouseLeave={() => setIsPrevPressed(false)}
            onTouchStart={() => setIsPrevPressed(true)}
            onTouchEnd={() => setIsPrevPressed(false)}
            className={`
              group flex items-center justify-center gap-3 
              min-h-[72px] px-10 py-5
              bg-gradient-to-r from-gray-100 to-gray-200 
              hover:from-gray-200 hover:to-gray-300
              dark:from-gray-700 dark:to-gray-600 
              dark:hover:from-gray-600 dark:hover:to-gray-500
              text-gray-800 dark:text-gray-100 
              font-bold text-xl
              rounded-2xl 
              transition-all duration-200 
              transform hover:scale-105 active:scale-100
              shadow-lg hover:shadow-2xl
              border-2 border-gray-300 dark:border-gray-500
              ${isPrevPressed ? 'scale-100 shadow-inner' : ''}
            `}
            aria-label={`${t('go_to_previous_step')}: ${currentIndex > 0 ? t(stepLabels[stepOrder[currentIndex - 1]]) : ''}`}
          >
            <svg
              className="w-7 h-7 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="tracking-wide">{previousLabel || t('previous')}</span>
          </button>
        ) : (
          <div className="min-w-[200px]"></div>
        )}

        {/* Next Button */}
        {showNext && hasNext && (
          <button
            onClick={handleNext}
            disabled={isNextReallyDisabled}
            onMouseDown={() => !isNextReallyDisabled && setIsNextPressed(true)}
            onMouseUp={() => setIsNextPressed(false)}
            onMouseLeave={() => setIsNextPressed(false)}
            onTouchStart={() => !isNextReallyDisabled && setIsNextPressed(true)}
            onTouchEnd={() => setIsNextPressed(false)}
            className={`
              group flex items-center justify-center gap-3 
              min-h-[72px] px-10 py-5
              font-bold text-xl
              rounded-2xl 
              transition-all duration-200 
              shadow-lg
              border-2
              ${isNextReallyDisabled
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-60 border-gray-400 dark:border-gray-500'
                : `bg-gradient-to-r from-blue-600 to-blue-700 
                     hover:from-blue-700 hover:to-blue-800 
                     dark:from-blue-600 dark:to-blue-700
                     dark:hover:from-blue-700 dark:hover:to-blue-800
                     text-white
                     transform hover:scale-105 active:scale-100
                     hover:shadow-2xl
                     border-blue-500 dark:border-blue-400
                     ${isNextPressed ? 'scale-100 shadow-inner' : ''}`
              }
            `}
            aria-label={`${t('go_to_next_step')}: ${hasNext ? t(stepLabels[stepOrder[currentIndex + 1]]) : ''}`}
            aria-disabled={isNextReallyDisabled}
          >
            <span className="tracking-wide">{nextLabel || t('next')}</span>
            <svg
              className={`w-7 h-7 transition-transform ${!isNextReallyDisabled ? 'group-hover:translate-x-1' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M9 5l7 7-7 7"
              />
            </svg>

            {/* Tooltip for disabled state */}
            {isNextDisabledByCart && (
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                {t('add_items_to_continue') || 'Add items to your cart to continue'}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 dark:bg-gray-700"></div>
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
}