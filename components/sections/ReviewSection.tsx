'use client';

import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import { formatPrice } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

export function ReviewSection() {
  const { cart, updateQuantity, removeFromCart, getOrderSummary, navigateToStep } =
    useKiosk();
  const { t } = useTranslation();
  const orderSummary = getOrderSummary();

  if (cart.length === 0) {
    return (
      <section className="animate-fade-in">
        <div className="text-center py-20">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t('cart_empty')}
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            {t('cart_empty_message')}
          </p>
          <button
            onClick={() => navigateToStep('food')}
            className="btn-primary px-8 py-4 text-lg"
          >
            {t('start_ordering')}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="animate-fade-in">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          {t('review_order')}
        </h2>
        <p className="text-gray-600 text-lg">{t('review_subtitle')}</p>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-8">
        {cart.map((cartItem) => (
          <div
            key={cartItem.id}
            className="bg-white rounded-2xl shadow-lg p-6 flex gap-6 items-center hover:shadow-xl transition-shadow"
          >
            {/* Item Image */}
            <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={cartItem.image}
                alt={cartItem.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>

            {/* Item Details */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {cartItem.name}
              </h3>
              {cartItem.selectedOptions && cartItem.selectedOptions.length > 0 && (
                <div className="text-sm text-gray-600 mb-2">
                  {cartItem.selectedOptions.map((opt, idx) => (
                    <span key={idx} className="inline-block mr-2">
                      • {opt.optionName}: {opt.choices.join(', ')}
                      {opt.additionalPrice > 0 && ` (+${formatPrice(opt.additionalPrice)})`}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  updateQuantity(cartItem.id, cartItem.quantity - 1)
                }
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-5 h-5 text-gray-700" />
              </button>
              <span className="text-xl font-bold text-gray-800 w-8 text-center">
                {cartItem.quantity}
              </span>
              <button
                onClick={() =>
                  updateQuantity(cartItem.id, cartItem.quantity + 1)
                }
                className="w-10 h-10 rounded-full bg-primary-500 hover:bg-primary-600 flex items-center justify-center transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-600">
                {formatPrice(cartItem.finalPrice * cartItem.quantity)}
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeFromCart(cartItem.id)}
              className="w-12 h-12 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl shadow-lg p-8">
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
          onClick={() => navigateToStep('payment')}
          className="w-full py-5 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white text-xl font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          {t('proceed_to_checkout')}
        </button>
      </div>
    </section>
  );
}