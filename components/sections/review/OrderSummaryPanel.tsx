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
    <div className="lg:w-[320px] xl:w-[360px] bg-white dark:bg-gray-800 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 flex flex-col shadow-lg lg:min-h-screen">
      <div className="flex-1 p-5 lg:p-6">
        {/* Price Breakdown */}
        <div className="space-y-4 mb-6">
          {/* Subtotal */}
          <div className="flex justify-between items-center text-base lg:text-lg">
            <span className="text-gray-700 dark:text-gray-300">
              {t('subtotal')}:
            </span>
            <span className="font-semibold text-gray-800 dark:text-white">
              {formatPrice(orderSummary.subtotal)}
            </span>
          </div>

          {/* Tax */}
          <div className="flex justify-between items-center text-base lg:text-lg">
            <span className="text-gray-700 dark:text-gray-300">
              {t('tax')} (8.5%):
            </span>
            <span className="font-semibold text-gray-800 dark:text-white">
              {formatPrice(orderSummary.tax)}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-gray-300 dark:border-gray-600 my-4"></div>

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-xl lg:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {t('total')}:
            </span>
            <span className="text-2xl lg:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatPrice(orderSummary.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons - FIXED AT BOTTOM */}
      <div className="p-5 lg:p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 space-y-3">
        <button
          onClick={() => navigateToStep('payment')}
          className="w-full py-3.5 px-6 bg-green-500 hover:bg-green-600 text-white text-base lg:text-lg font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          Proceed to Payment →
        </button>
      </div>
    </div>
  );
}