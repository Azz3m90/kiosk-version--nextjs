'use client';

import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import { formatPrice } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

export function OrderSummaryPanel() {
  const { cart, getOrderSummary, navigateToStep } = useKiosk();
  const { t } = useTranslation();
  const orderSummary = getOrderSummary();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg h-full flex flex-col">
      {/* Summary Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          {t('order_summary')}
        </h3>
      </div>

      {/* Price Breakdown */}
      <div className="p-4 space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {t('subtotal')}:
          </span>
          <span className="font-semibold text-gray-800 dark:text-white">
            {formatPrice(orderSummary.subtotal)}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {t('tax')} (8.5%):
          </span>
          <span className="font-semibold text-gray-800 dark:text-white">
            {formatPrice(orderSummary.tax)}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 dark:border-gray-600 my-2"></div>

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
            {t('total')}:
          </span>
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            {formatPrice(orderSummary.total)}
          </span>
        </div>
      </div>

      {/* Proceed to Payment Button - Directly under summary */}
      <div className="p-4 mt-auto">
        <button
          onClick={() => navigateToStep('payment')}
          className="w-full py-4 px-4 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-base font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <CheckCircle className="w-5 h-5" />
          Proceed to Payment →
        </button>
      </div>
    </div>
  );
}