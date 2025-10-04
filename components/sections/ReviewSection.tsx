'use client';

import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import { NavigationButtons } from '@/components/ui/NavigationButtons';
import { EmptyCartState } from './review/EmptyCartState';
import { CartItemCard } from './review/CartItemCard';
import { OrderSummaryPanel } from './review/OrderSummaryPanel';

export function ReviewSection() {
  const { cart } = useKiosk();
  const { t } = useTranslation();

  // Empty cart state
  if (cart.length === 0) {
    return <EmptyCartState />;
  }

  // Split layout: Left (cart items) + Right (order summary)
  return (
    <section className="flex flex-col min-h-[calc(100vh-140px)] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-lg animate-fade-in">
      {/* Section Header - Large and Clear */}
      <div className="bg-white dark:bg-gray-800 border-b-2 border-indigo-200 dark:border-indigo-700 py-6 px-6 rounded-t-2xl flex-shrink-0">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white text-center">
          {t('review_order')}
        </h2>
      </div>

      {/* Content Area - Split Layout - More Spacious */}
      <div className="flex flex-col lg:flex-row flex-1 gap-6 p-6">
        {/* LEFT PANEL - Cart Items (Auto-height, no forced scroll) */}
        <div className="flex-1 space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 custom-scrollbar">
          {cart.map((cartItem) => (
            <CartItemCard key={cartItem.id} cartItem={cartItem} />
          ))}
        </div>

        {/* RIGHT PANEL - Order Summary (Prominent and Fixed Width) */}
        <div className="lg:w-96 flex-shrink-0">
          <OrderSummaryPanel />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex-shrink-0 px-6 py-4 bg-white dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 rounded-b-2xl">
        <NavigationButtons currentStep="review" />
      </div>
    </section>
  );
}