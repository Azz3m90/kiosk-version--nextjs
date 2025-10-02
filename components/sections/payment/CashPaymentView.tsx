'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Banknote } from 'lucide-react';

export function CashPaymentView() {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <Banknote className="w-24 h-24 text-primary-500 mx-auto mb-6" />
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        {t('pay_at_counter')}
      </h3>
      <p className="text-gray-600">{t('cash_payment_instructions')}</p>
    </div>
  );
}