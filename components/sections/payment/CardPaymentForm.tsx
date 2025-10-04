'use client';

import { useTranslation } from '@/hooks/useTranslation';

interface CardPaymentFormProps {
  cardNumber: string;
  setCardNumber: (value: string) => void;
  cardName: string;
  setCardName: (value: string) => void;
  expiryDate: string;
  setExpiryDate: (value: string) => void;
  cvv: string;
  setCvv: (value: string) => void;
  errors: Record<string, string>;
}

export function CardPaymentForm({
  cardNumber,
  setCardNumber,
  cardName,
  setCardName,
  expiryDate,
  setExpiryDate,
  cvv,
  setCvv,
  errors,
}: CardPaymentFormProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10 border-2 border-indigo-100 dark:border-gray-700">
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {t('card_details')}
      </h3>
      <div className="space-y-8">
        <div>
          <label className="block text-lg md:text-xl font-bold text-gray-900 dark:text-gray-200 mb-3">
            {t('card_number')}
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setCardNumber(value.slice(0, 16));
            }}
            placeholder="1234 5678 9012 3456"
            className={`w-full px-6 py-5 md:py-6 text-xl md:text-2xl border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${errors.cardNumber
                ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600'
              }`}
            maxLength={16}
            aria-label={t('card_number')}
          />
          {errors.cardNumber && (
            <p className="text-red-500 dark:text-red-400 text-base md:text-lg mt-2 font-semibold">{errors.cardNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-lg md:text-xl font-bold text-gray-900 dark:text-gray-200 mb-3">
            {t('cardholder_name')}
          </label>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="John Doe"
            className={`w-full px-6 py-5 md:py-6 text-xl md:text-2xl border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${errors.cardName
                ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600'
              }`}
            aria-label={t('cardholder_name')}
          />
          {errors.cardName && (
            <p className="text-red-500 dark:text-red-400 text-base md:text-lg mt-2 font-semibold">{errors.cardName}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-lg md:text-xl font-bold text-gray-900 dark:text-gray-200 mb-3">
              {t('expiry_date')}
            </label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                  value = value.slice(0, 2) + '/' + value.slice(2, 4);
                }
                setExpiryDate(value);
              }}
              placeholder="MM/YY"
              className={`w-full px-6 py-5 md:py-6 text-xl md:text-2xl border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${errors.expiryDate
                  ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
                }`}
              maxLength={5}
              aria-label={t('expiry_date')}
            />
            {errors.expiryDate && (
              <p className="text-red-500 dark:text-red-400 text-base md:text-lg mt-2 font-semibold">{errors.expiryDate}</p>
            )}
          </div>
          <div>
            <label className="block text-lg md:text-xl font-bold text-gray-900 dark:text-gray-200 mb-3">
              {t('cvv')}
            </label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setCvv(value.slice(0, 4));
              }}
              placeholder="123"
              className={`w-full px-6 py-5 md:py-6 text-xl md:text-2xl border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${errors.cvv
                  ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
                }`}
              maxLength={4}
              aria-label={t('cvv')}
            />
            {errors.cvv && (
              <p className="text-red-500 dark:text-red-400 text-base md:text-lg mt-2 font-semibold">{errors.cvv}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}