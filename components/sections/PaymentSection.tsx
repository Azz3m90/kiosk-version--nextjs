'use client';

import { useState } from 'react';
import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import { formatPrice, validateCardNumber, validateCVV } from '@/lib/utils';
import { CreditCard, Smartphone, Banknote, CheckCircle } from 'lucide-react';

type PaymentMethod = 'card' | 'mobile' | 'cash';

export function PaymentSection() {
  const { getOrderSummary, clearCart, navigateToStep } = useKiosk();
  const { t } = useTranslation();
  const orderSummary = getOrderSummary();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod === 'card') {
      if (!cardNumber || !validateCardNumber(cardNumber)) {
        newErrors.cardNumber = t('invalid_card_number');
      }
      if (!cardName.trim()) {
        newErrors.cardName = t('card_name_required');
      }
      if (!expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
        newErrors.expiryDate = t('invalid_expiry_date');
      }
      if (!cvv || !validateCVV(cvv)) {
        newErrors.cvv = t('invalid_cvv');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setPaymentSuccess(true);

    // Clear cart and redirect after success
    setTimeout(() => {
      clearCart();
      navigateToStep('food');
      setPaymentSuccess(false);
    }, 3000);
  };

  if (paymentSuccess) {
    return (
      <section className="animate-fade-in">
        <div className="text-center py-20">
          <CheckCircle className="w-32 h-32 text-green-500 mx-auto mb-6 animate-scale-in" />
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            {t('payment_success')}
          </h2>
          <p className="text-gray-600 text-xl">{t('payment_success_message')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="animate-fade-in">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          {t('payment_title')}
        </h2>
        <p className="text-gray-600 text-lg">{t('payment_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          {/* Payment Method Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {t('select_payment_method')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard
                  className={`w-12 h-12 mx-auto mb-3 ${
                    paymentMethod === 'card'
                      ? 'text-primary-600'
                      : 'text-gray-400'
                  }`}
                />
                <p className="font-semibold text-gray-800">{t('credit_card')}</p>
              </button>
              <button
                onClick={() => setPaymentMethod('mobile')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  paymentMethod === 'mobile'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Smartphone
                  className={`w-12 h-12 mx-auto mb-3 ${
                    paymentMethod === 'mobile'
                      ? 'text-primary-600'
                      : 'text-gray-400'
                  }`}
                />
                <p className="font-semibold text-gray-800">{t('mobile_payment')}</p>
              </button>
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Banknote
                  className={`w-12 h-12 mx-auto mb-3 ${
                    paymentMethod === 'cash'
                      ? 'text-primary-600'
                      : 'text-gray-400'
                  }`}
                />
                <p className="font-semibold text-gray-800">{t('cash')}</p>
              </button>
            </div>
          </div>

          {/* Card Payment Form */}
          {paymentMethod === 'card' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {t('card_details')}
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className={`input-field ${errors.cardNumber ? 'border-red-500' : ''}`}
                    maxLength={16}
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('cardholder_name')}
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    className={`input-field ${errors.cardName ? 'border-red-500' : ''}`}
                  />
                  {errors.cardName && (
                    <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className={`input-field ${errors.expiryDate ? 'border-red-500' : ''}`}
                      maxLength={5}
                    />
                    {errors.expiryDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className={`input-field ${errors.cvv ? 'border-red-500' : ''}`}
                      maxLength={4}
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Payment */}
          {paymentMethod === 'mobile' && (
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
          )}

          {/* Cash Payment */}
          {paymentMethod === 'cash' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <Banknote className="w-24 h-24 text-primary-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {t('pay_at_counter')}
              </h3>
              <p className="text-gray-600">{t('cash_payment_instructions')}</p>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl shadow-lg p-8 sticky top-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {t('order_summary')}
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-lg">
                <span className="text-gray-700">{t('subtotal')}:</span>
                <span className="font-semibold text-gray-800">
                  {formatPrice(orderSummary.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-700">{t('tax')} (21%):</span>
                <span className="font-semibold text-gray-800">
                  {formatPrice(orderSummary.tax)}
                </span>
              </div>
              <div className="border-t-2 border-gray-300 pt-3 flex justify-between text-2xl">
                <span className="font-bold text-gray-800">{t('total')}:</span>
                <span className="font-bold text-primary-600">
                  {formatPrice(orderSummary.total)}
                </span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? t('processing') : t('complete_payment')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}