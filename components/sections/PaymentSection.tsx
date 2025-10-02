'use client';

import { useState } from 'react';
import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import { validateCardNumber, validateCVV } from '@/lib/utils';
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
    <section className="animate-fade-in">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          {t('payment_title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">{t('payment_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
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
        <PaymentSummaryPanel
          onPayment={handlePayment}
          isProcessing={isProcessing}
        />
      </div>
    </section>
  );
}