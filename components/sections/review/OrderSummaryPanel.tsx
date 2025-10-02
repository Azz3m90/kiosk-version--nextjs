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
    <div className="bg-white dark:bg-gray-800 flex flex-col shadow-lg lg:min-h-screen">
      <div className="flex-1 p-4">
        {/* Price Breakdown */}
        <div className="space-y-3">
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
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => navigateToStep('payment')}
          className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2"
        >
          Proceed to Payment →
        </button>
      </div>
    </div>
  );
}