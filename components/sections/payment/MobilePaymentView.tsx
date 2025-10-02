'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Smartphone } from 'lucide-react';

export function MobilePaymentView() {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <Smartphone className="w-24 h-24 text-primary-500 mx-auto mb-6" />
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        {t('scan_qr_code')}
      </h3>
      <p className="text-gray-600 mb-6">{t('mobile_payment_instructions')}</p>
      <div className="w-64 h-64 bg-gray-200 rounded-xl mx-auto flex items-center justify-center">
        <p className="text-gray-500">{t('qr_code_placeholder')}</p>
      </div>
    </div>
  );
}