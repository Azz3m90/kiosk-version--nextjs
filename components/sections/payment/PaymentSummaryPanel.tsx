'use client';

import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import { formatPrice } from '@/lib/utils';

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
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-8 sticky top-8 border-2 border-gray-100 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {t('order_summary')}
        </h3>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-lg">
            <span className="text-gray-700 dark:text-gray-300">{t('subtotal')}:</span>
            <span className="font-semibold text-gray-800 dark:text-white">
              {formatPrice(orderSummary.subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="text-gray-700 dark:text-gray-300">{t('tax')} (21%):</span>
            <span className="font-semibold text-gray-800 dark:text-white">
              {formatPrice(orderSummary.tax)}
            </span>
          </div>
          <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-3 flex justify-between text-2xl">
            <span className="font-bold text-gray-800 dark:text-white">{t('total')}:</span>
            <span className="font-bold text-primary-600 dark:text-primary-400">
              {formatPrice(orderSummary.total)}
            </span>
          </div>
        </div>

        <button
          onClick={onPayment}
          disabled={isProcessing}
          className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
        >
          {isProcessing ? t('processing') : t('complete_payment')}
        </button>
      </div>
    </div>
  );
}