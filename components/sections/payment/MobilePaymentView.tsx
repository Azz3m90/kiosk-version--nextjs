'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Smartphone } from 'lucide-react';

export function MobilePaymentView() {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-900/20 rounded-2xl shadow-xl p-10 md:p-12 text-center border-2 border-indigo-100 dark:border-gray-700">
      <div className="bg-indigo-100 dark:bg-indigo-900/40 w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto mb-8 flex items-center justify-center">
        <Smartphone className="w-20 h-20 md:w-24 md:h-24 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {t('scan_qr_code')}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 mb-10 text-xl md:text-2xl font-semibold max-w-md mx-auto">
        {t('mobile_payment_instructions')}
      </p>
      <div className="w-72 h-72 md:w-80 md:h-80 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl mx-auto flex items-center justify-center border-4 border-indigo-200 dark:border-indigo-800 shadow-inner">
        <p className="text-gray-600 dark:text-gray-400 font-bold text-xl md:text-2xl">{t('qr_code_placeholder')}</p>
      </div>
    </div>
  );
}