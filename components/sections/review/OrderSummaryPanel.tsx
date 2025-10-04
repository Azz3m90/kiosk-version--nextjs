'use client';

import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Receipt, CreditCard, CheckCircle2 } from 'lucide-react';

export function OrderSummaryPanel() {
  const { cart, getOrderSummary, navigateToStep } = useKiosk();
  const { t } = useTranslation();
  const orderSummary = getOrderSummary();

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden sticky top-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 px-6 py-5">
        <div className="flex items-center gap-3 text-white">
          <Receipt className="w-8 h-8" strokeWidth={2.5} />
          <div>
            <h3 className="text-2xl font-bold">Order Summary</h3>
            <p className="text-indigo-100 text-base">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="p-6 space-y-5">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-lg md:text-xl text-gray-700 dark:text-gray-300 font-medium">
            {t('subtotal')}:
          </span>
          <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {formatPrice(orderSummary.subtotal)}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between items-center">
          <span className="text-lg md:text-xl text-gray-700 dark:text-gray-300 font-medium">
            {t('tax')} (8.5%):
          </span>
          <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {formatPrice(orderSummary.tax)}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-dashed border-gray-300 dark:border-gray-600 my-4"></div>

        {/* Total - Extra Prominent */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-xl p-5 border-2 border-indigo-200 dark:border-indigo-800">
          <div className="flex justify-between items-center">
            <span className="text-2xl md:text-3xl font-bold text-indigo-700 dark:text-indigo-300">
              {t('total')}:
            </span>
            <span className="text-3xl md:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {formatPrice(orderSummary.total)}
            </span>
          </div>
        </div>

        {/* Item Count Badge */}
        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 pt-2">
          <ShoppingCart className="w-5 h-5" />
          <span className="text-base font-medium">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
          </span>
        </div>
      </div>

      {/* Action Button - Kiosk-optimized */}
      <div className="px-6 pb-6">
        <button
          onClick={() => navigateToStep('payment')}
          className="w-full min-h-[72px] py-5 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 active:scale-[0.98] text-white text-xl md:text-2xl font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          aria-label="Proceed to payment"
        >
          <CreditCard className="w-7 h-7" strokeWidth={2.5} />
          Proceed to Payment
          <CheckCircle2 className="w-7 h-7" strokeWidth={2.5} />
        </button>
      </div>

      {/* Security Badge */}
      <div className="bg-gray-100 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium">Secure Payment Processing</span>
        </div>
      </div>
    </div>
  );
}