'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { CreditCard, Smartphone, Banknote } from 'lucide-react';

type PaymentMethod = 'card' | 'mobile' | 'cash';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
}: PaymentMethodSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {t('select_payment_method')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => onMethodChange('card')}
          className={`p-6 rounded-xl border-2 transition-all min-h-[120px] active:scale-95 ${
            selectedMethod === 'card'
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 scale-105'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <CreditCard
            className={`w-12 h-12 mx-auto mb-3 ${
              selectedMethod === 'card' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-600'
            }`}
          />
          <p className="font-semibold text-gray-800 dark:text-white">{t('credit_card')}</p>
        </button>
        <button
          onClick={() => onMethodChange('mobile')}
          className={`p-6 rounded-xl border-2 transition-all min-h-[120px] active:scale-95 ${
            selectedMethod === 'mobile'
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 scale-105'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <Smartphone
            className={`w-12 h-12 mx-auto mb-3 ${
              selectedMethod === 'mobile' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-600'
            }`}
          />
          <p className="font-semibold text-gray-800 dark:text-white">{t('mobile_payment')}</p>
        </button>
        <button
          onClick={() => onMethodChange('cash')}
          className={`p-6 rounded-xl border-2 transition-all min-h-[120px] active:scale-95 ${
            selectedMethod === 'cash'
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 scale-105'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <Banknote
            className={`w-12 h-12 mx-auto mb-3 ${
              selectedMethod === 'cash' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-600'
            }`}
          />
          <p className="font-semibold text-gray-800 dark:text-white">{t('cash')}</p>
        </button>
      </div>
    </div>
  );
}