'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { CheckCircle } from 'lucide-react';

export function PaymentSuccessMessage() {
  const { t } = useTranslation();

  return (
    <section className="animate-fade-in flex items-center justify-center min-h-[60vh]">
      <div className="text-center py-20 px-8 max-w-2xl">
        <div className="bg-green-100 dark:bg-green-900/40 w-40 h-40 md:w-48 md:h-48 rounded-full mx-auto mb-10 flex items-center justify-center animate-scale-in">
          <CheckCircle className="w-32 h-32 md:w-40 md:h-40 text-green-600 dark:text-green-400" strokeWidth={2.5} />
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {t('payment_success')}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-2xl md:text-3xl font-semibold leading-relaxed">
          {t('payment_success_message')}
        </p>
      </div>
    </section>
  );
}