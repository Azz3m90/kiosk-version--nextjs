'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Utensils, Coffee, Receipt, CreditCard, ShoppingCart, ChevronRight } from 'lucide-react';
import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import { restaurantData } from '@/data/restaurant-data';
import { formatPrice } from '@/lib/utils';
import { CartSidebar } from '@/components/ui/CartSidebar';
import type { Step } from '@/types';

const steps: { id: Step; icon: typeof Utensils }[] = [
  { id: 'food', icon: Utensils },
  { id: 'drinks', icon: Coffee },
  { id: 'review', icon: Receipt },
  { id: 'payment', icon: CreditCard },
];

export function Sidebar() {
  const { currentStep, navigateToStep, getOrderSummary, cart } = useKiosk();
  const { t } = useTranslation();
  const summary = getOrderSummary();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Check if cart has any items (required before accessing review/payment)
  const hasItems = cart.length > 0;

  // Determine which steps should be available
  const getStepState = (stepId: Step) => {
    const currentIndex = steps.findIndex((s) => s.id === currentStep);
    const stepIndex = steps.findIndex((s) => s.id === stepId);
    
    // Food and drinks sections are always available
    if (stepId === 'food' || stepId === 'drinks') {
      return 'available';
    }
    
    // Review and payment sections require items in cart
    if (!hasItems) {
      return 'disabled';
    }
    
    // Allow navigation to previous steps and current step
    if (stepIndex <= currentIndex) {
      return 'available';
    }
    
    // Allow next step if we have items
    if (stepIndex === currentIndex + 1) {
      return 'available';
    }
    
    return 'disabled';
  };

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-[320px] bg-white dark:bg-gray-800 border-r-2 border-gray-200 dark:border-gray-700 flex flex-col shadow-xl z-20 transition-colors duration-300">
        {/* Logo Section - Fixed at Top */}
        <div className="flex-shrink-0 text-center p-6 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src={restaurantData.logo}
              alt={restaurantData.name}
              fill
              className="object-contain rounded-full border-4 border-primary-500 shadow-lg"
              priority
            />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{restaurantData.name}</h2>
        </div>

        {/* Scrollable Content - Grows to Fill Space */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Navigation Steps */}
          <nav className="flex flex-col gap-3 mb-4" aria-label="Order steps">
            {steps.map(({ id, icon: Icon }) => {
              const isActive = currentStep === id;
              const stepState = getStepState(id);
              const isAvailable = stepState === 'available';

              return (
                <button
                  key={id}
                  onClick={() => isAvailable && navigateToStep(id)}
                  className={`
                    flex items-center gap-4 px-5 py-5 rounded-xl transition-all duration-200 min-h-[60px]
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105'
                        : isAvailable
                        ? 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 hover:shadow-md border-2 border-gray-200 dark:border-gray-600 cursor-pointer'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-2 border-gray-100 dark:border-gray-700 opacity-50 cursor-not-allowed'
                    }
                  `}
                  disabled={!isAvailable}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <Icon className="w-7 h-7 flex-shrink-0" />
                  <span className="font-semibold text-lg flex-1 text-left">{t(id)}</span>
                  {isActive && <ChevronRight className="w-5 h-5 flex-shrink-0" />}
                </button>
              );
            })}
          </nav>

          {/* View Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={`
              w-full flex items-center gap-4 px-5 py-5 rounded-xl transition-all duration-200 min-h-[70px]
              ${cart.length > 0 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl hover:scale-105 animate-pulse-slow'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
              }
            `}
            aria-label="View cart"
          >
            <ShoppingCart className="w-7 h-7 flex-shrink-0" />
            <div className="flex-1 text-left">
              <div className="font-bold text-lg">{t('viewCart')}</div>
              {cart.length > 0 && (
                <div className="text-sm opacity-90">
                  {summary.itemCount} {t('items')} - {formatPrice(summary.total)}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="font-bold text-lg">{cart.length}</span>
              </div>
            )}
          </button>
        </div>

        {/* Order Summary - Pinned at Bottom */}
        {cart.length > 0 && (
          <div className="flex-shrink-0 p-6 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-5 shadow-lg border-2 border-gray-200 dark:border-gray-600 transition-colors duration-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{t('orderSummary')}</h3>
                <div className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-bold">
                  {summary.itemCount} {t('items')}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('subtotal')}:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{formatPrice(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('tax')}:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{formatPrice(summary.tax)}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900 dark:text-gray-100">{t('total')}:</span>
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500">
                      {formatPrice(summary.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}