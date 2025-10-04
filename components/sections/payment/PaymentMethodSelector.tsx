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
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 md:p-12 border-2 border-indigo-100 dark:border-gray-700">
      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-10 flex items-center gap-4">
        <CreditCard className="w-10 h-10 md:w-12 md:h-12 text-indigo-600 dark:text-indigo-400" />
        {t('select_payment_method')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <button
          onClick={() => onMethodChange('card')}
          aria-label={t('credit_card')}
          className={`p-10 md:p-12 rounded-3xl border-3 transition-all min-h-[200px] md:min-h-[240px] active:scale-95 hover:scale-105 flex flex-col items-center justify-center ${selectedMethod === 'card'
            ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 dark:border-indigo-400 scale-105 shadow-2xl ring-4 ring-indigo-200 dark:ring-indigo-800'
            : 'border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 bg-gray-50 dark:bg-gray-700/50 shadow-lg'
            }`}
        >
          <CreditCard
            className={`w-20 h-20 md:w-24 md:h-24 mb-6 ${selectedMethod === 'card' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
              }`}
          />
          <p className="font-bold text-2xl md:text-3xl text-gray-900 dark:text-gray-100">{t('credit_card')}</p>
        </button>
        <button
          onClick={() => onMethodChange('mobile')}
          aria-label={t('mobile_payment')}
          className={`p-10 md:p-12 rounded-3xl border-3 transition-all min-h-[200px] md:min-h-[240px] active:scale-95 hover:scale-105 flex flex-col items-center justify-center ${selectedMethod === 'mobile'
            ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 dark:border-indigo-400 scale-105 shadow-2xl ring-4 ring-indigo-200 dark:ring-indigo-800'
            : 'border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 bg-gray-50 dark:bg-gray-700/50 shadow-lg'
            }`}
        >
          <Smartphone
            className={`w-20 h-20 md:w-24 md:h-24 mb-6 ${selectedMethod === 'mobile' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
              }`}
          />
          <p className="font-bold text-2xl md:text-3xl text-gray-900 dark:text-gray-100">{t('mobile_payment')}</p>
        </button>
        <button
          onClick={() => onMethodChange('cash')}
          aria-label={t('cash')}
          className={`p-10 md:p-12 rounded-3xl border-3 transition-all min-h-[200px] md:min-h-[240px] active:scale-95 hover:scale-105 flex flex-col items-center justify-center ${selectedMethod === 'cash'
            ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 dark:border-indigo-400 scale-105 shadow-2xl ring-4 ring-indigo-200 dark:ring-indigo-800'
            : 'border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 bg-gray-50 dark:bg-gray-700/50 shadow-lg'
            }`}
        >
          <Banknote
            className={`w-20 h-20 md:w-24 md:h-24 mb-6 ${selectedMethod === 'cash' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
              }`}
          />
          <p className="font-bold text-2xl md:text-3xl text-gray-900 dark:text-gray-100">{t('cash')}</p>
        </button>
      </div>
    </div>
  );
}