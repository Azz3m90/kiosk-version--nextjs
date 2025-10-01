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

  // Determine which steps should be available
  const getStepState = (stepId: Step) => {
    const currentIndex = steps.findIndex((s) => s.id === currentStep);
    const stepIndex = steps.findIndex((s) => s.id === stepId);
    
    // Allow navigation to previous steps and current step
    // For next steps: only allow if cart has items or it's the food step
    if (stepIndex <= currentIndex) {
      return 'available';
    } else if (stepId === 'drinks' && summary.itemCount > 0) {
      return 'available';
    } else if ((stepId === 'review' || stepId === 'payment') && summary.itemCount > 0) {
      return 'available';
    }
    return 'disabled';
  };

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-[320px] bg-white border-r-2 border-gray-200 flex flex-col p-6 gap-4 overflow-y-auto shadow-xl z-20">
        {/* Logo Section */}
        <div className="text-center pb-6 border-b-2 border-gray-200">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src={restaurantData.logo}
              alt={restaurantData.name}
              fill
              className="object-contain rounded-full border-4 border-primary-500 shadow-lg"
              priority
            />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{restaurantData.name}</h2>
        </div>

        {/* Navigation Steps */}
        <nav className="flex flex-col gap-3" aria-label="Order steps">
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
                      ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md border-2 border-gray-200 cursor-pointer'
                      : 'bg-gray-50 text-gray-400 border-2 border-gray-100 opacity-50 cursor-not-allowed'
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

        {/* View Cart Button - Always Visible */}
        <button
          onClick={() => setIsCartOpen(true)}
          className={`
            flex items-center gap-4 px-5 py-5 rounded-xl transition-all duration-200 min-h-[70px]
            ${cart.length > 0 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl hover:scale-105 animate-pulse-slow'
              : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-gray-200'
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

        {/* Order Summary */}
        {cart.length > 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 shadow-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-gray-900">{t('orderSummary')}</h3>
              <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-bold">
                {summary.itemCount} {t('items')}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('subtotal')}:</span>
                <span className="font-semibold">{formatPrice(summary.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('tax')}:</span>
                <span className="font-semibold">{formatPrice(summary.tax)}</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">{t('total')}:</span>
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">
                    {formatPrice(summary.total)}
                  </span>
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