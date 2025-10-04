'use client';

import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import { formatPrice } from '@/lib/utils';
import { Smartphone } from 'lucide-react';

interface PaymentSummaryPanelProps {
  onPayment: () => void;
  isProcessing: boolean;
}

export function PaymentSummaryPanel({
  onPayment,
  isProcessing,
}: PaymentSummaryPanelProps) {
  const { getOrderSummary } = useKiosk();
  const { t } = useTranslation();
  const orderSummary = getOrderSummary();

  return (
    <div className="lg:col-span-1">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl sticky top-8 border-2 border-indigo-200 dark:border-gray-700 overflow-hidden">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 p-6 md:p-8">
          <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Smartphone className="w-8 h-8" />
            {t('order_summary')}
          </h3>
        </div>

        {/* Summary Content */}
        <div className="p-6 md:p-8">
          <div className="space-y-5 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-lg md:text-xl text-gray-700 dark:text-gray-300 font-semibold">{t('subtotal')}:</span>
              <span className="font-bold text-xl md:text-2xl text-gray-900 dark:text-gray-100">
                {formatPrice(orderSummary.subtotal)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg md:text-xl text-gray-700 dark:text-gray-300 font-semibold">{t('tax')} (21%):</span>
              <span className="font-bold text-xl md:text-2xl text-gray-900 dark:text-gray-100">
                {formatPrice(orderSummary.tax)}
              </span>
            </div>

            {/* Total - Extra Prominent */}
            <div className="border-t-4 border-indigo-200 dark:border-indigo-800 pt-6 mt-6">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-6 border-2 border-indigo-200 dark:border-indigo-700">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-2xl md:text-3xl text-gray-900 dark:text-gray-100">{t('total')}:</span>
                  <span className="font-bold text-3xl md:text-4xl text-indigo-600 dark:text-indigo-400">
                    {formatPrice(orderSummary.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Complete Payment Button - Large & Prominent */}
          <button
            onClick={onPayment}
            disabled={isProcessing}
            aria-label={isProcessing ? t('processing') : t('complete_payment')}
            className="w-full min-h-[72px] py-6 text-xl md:text-2xl font-bold rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-green-500 dark:focus:ring-green-400"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t('processing')}
              </span>
            ) : (
              t('complete_payment')
            )}
          </button>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
            <svg className="w-5 h-5 text-green-600 dark:text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm md:text-base font-medium">Secure Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
}