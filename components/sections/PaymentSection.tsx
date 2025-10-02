'use client';

import { useState } from 'react';
import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import { validateCardNumber, validateCVV } from '@/lib/utils';
import { NavigationButtons } from '@/components/ui/NavigationButtons';
import { PaymentSuccessMessage } from './payment/PaymentSuccessMessage';
import { PaymentMethodSelector } from './payment/PaymentMethodSelector';
import { CardPaymentForm } from './payment/CardPaymentForm';
import { MobilePaymentView } from './payment/MobilePaymentView';
import { CashPaymentView } from './payment/CashPaymentView';
import { PaymentSummaryPanel } from './payment/PaymentSummaryPanel';

type PaymentMethod = 'card' | 'mobile' | 'cash';

export function PaymentSection() {
  const { clearCart, navigateToStep } = useKiosk();
  const { t } = useTranslation();

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
    return <PaymentSuccessMessage />;
  }

  return (
    <section className="flex flex-col h-[calc(100vh-180px)] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-lg animate-fade-in">
      {/* Section Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-6 rounded-t-2xl flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t('payment_title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{t('payment_subtitle')}</p>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
            />

            {/* Card Payment Form */}
            {paymentMethod === 'card' && (
              <CardPaymentForm
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                cardName={cardName}
                setCardName={setCardName}
                expiryDate={expiryDate}
                setExpiryDate={setExpiryDate}
                cvv={cvv}
                setCvv={setCvv}
                errors={errors}
              />
            )}

            {/* Mobile Payment */}
            {paymentMethod === 'mobile' && <MobilePaymentView />}

            {/* Cash Payment */}
            {paymentMethod === 'cash' && <CashPaymentView />}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <PaymentSummaryPanel
              onPayment={handlePayment}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex-shrink-0 px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
        <NavigationButtons currentStep="payment" />
      </div>
    </section>
  );
}