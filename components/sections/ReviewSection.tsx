'use client';

import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
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
    <section className="flex flex-col h-[calc(100vh-180px)] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-lg animate-fade-in">
      {/* Section Header - Centered */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 px-4 rounded-t-2xl flex-shrink-0">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white text-center">
          {t('review_order')}
        </h2>
      </div>

      {/* Content Area - Split Layout - Scrollable */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* LEFT PANEL - Cart Items (Scrollable) */}
        <div className="flex-1 p-3 lg:p-4 overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-2">
            {cart.map((cartItem) => (
              <CartItemCard key={cartItem.id} cartItem={cartItem} />
            ))}
          </div>
        </div>

        {/* RIGHT PANEL - Order Summary (Scrollable on Mobile, Sticky on Desktop) */}
        <div className="lg:w-80 lg:border-l lg:border-gray-200 lg:dark:border-gray-700 flex-shrink-0 overflow-y-auto">
          <div className="lg:sticky lg:top-0 p-3 lg:p-4">
            <OrderSummaryPanel />
          </div>
        </div>
      </div>
    </section>
  );
}