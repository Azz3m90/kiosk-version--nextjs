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

  // Full-screen split layout: Left (cart items) + Right (order summary)
  return (
    <section className="fixed inset-0 flex flex-col lg:flex-row bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 animate-fade-in">
      {/* LEFT PANEL - Cart Items (Scrollable) */}
      <div className="flex-1 overflow-y-auto">
        {/* Section Header - Centered */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-6 px-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white text-center">
            {t('review_order')}
          </h2>
        </div>

        <div className="max-w-5xl mx-auto p-4 lg:p-6">
          {/* Cart Items Grid */}
          <div className="space-y-3">
            {cart.map((cartItem) => (
              <CartItemCard key={cartItem.id} cartItem={cartItem} />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Order Summary (Sticky on Desktop) */}
      <div className="lg:overflow-y-auto lg:h-screen">
        <div className="lg:sticky lg:top-0">
          <OrderSummaryPanel />
        </div>
      </div>
    </section>
  );
}