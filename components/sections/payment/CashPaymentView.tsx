'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Banknote } from 'lucide-react';

export function CashPaymentView() {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 rounded-2xl shadow-xl p-10 md:p-12 text-center border-2 border-green-100 dark:border-gray-700">
      <div className="bg-green-100 dark:bg-green-900/40 w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto mb-8 flex items-center justify-center">
        <Banknote className="w-20 h-20 md:w-24 md:h-24 text-green-600 dark:text-green-400" />
      </div>
      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {t('pay_at_counter')}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 text-xl md:text-2xl font-semibold max-w-md mx-auto leading-relaxed">
        {t('cash_payment_instructions')}
      </p>
    </div>
  );
}