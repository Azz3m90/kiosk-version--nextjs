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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {t('card_details')}
      </h3>
      <div className="space-y-6">
        <div>
          <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
            className={`input ${errors.cardNumber ? 'border-red-500 dark:border-red-500' : ''}`}
            maxLength={16}
          />
          {errors.cardNumber && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.cardNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t('cardholder_name')}
          </label>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="John Doe"
            className={`input ${errors.cardName ? 'border-red-500 dark:border-red-500' : ''}`}
          />
          {errors.cardName && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.cardName}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
              className={`input ${errors.expiryDate ? 'border-red-500 dark:border-red-500' : ''}`}
              maxLength={5}
            />
            {errors.expiryDate && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.expiryDate}</p>
            )}
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
              className={`input ${errors.cvv ? 'border-red-500 dark:border-red-500' : ''}`}
              maxLength={4}
            />
            {errors.cvv && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.cvv}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}