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
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        {t('select_payment_method')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => onMethodChange('card')}
          className={`p-6 rounded-xl border-2 transition-all ${
            selectedMethod === 'card'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <CreditCard
            className={`w-12 h-12 mx-auto mb-3 ${
              selectedMethod === 'card' ? 'text-primary-600' : 'text-gray-400'
            }`}
          />
          <p className="font-semibold text-gray-800">{t('credit_card')}</p>
        </button>
        <button
          onClick={() => onMethodChange('mobile')}
          className={`p-6 rounded-xl border-2 transition-all ${
            selectedMethod === 'mobile'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Smartphone
            className={`w-12 h-12 mx-auto mb-3 ${
              selectedMethod === 'mobile' ? 'text-primary-600' : 'text-gray-400'
            }`}
          />
          <p className="font-semibold text-gray-800">{t('mobile_payment')}</p>
        </button>
        <button
          onClick={() => onMethodChange('cash')}
          className={`p-6 rounded-xl border-2 transition-all ${
            selectedMethod === 'cash'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Banknote
            className={`w-12 h-12 mx-auto mb-3 ${
              selectedMethod === 'cash' ? 'text-primary-600' : 'text-gray-400'
            }`}
          />
          <p className="font-semibold text-gray-800">{t('cash')}</p>
        </button>
      </div>
    </div>
  );
}