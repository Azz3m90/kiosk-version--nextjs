'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Banknote } from 'lucide-react';

export function CashPaymentView() {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
      <Banknote className="w-24 h-24 text-primary-500 dark:text-primary-400 mx-auto mb-6" />
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        {t('pay_at_counter')}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-lg">{t('cash_payment_instructions')}</p>
    </div>
  );
}