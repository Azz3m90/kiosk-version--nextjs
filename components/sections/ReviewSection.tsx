'use client';

import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import { formatPrice } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingBag, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export function ReviewSection() {
  const { cart, updateQuantity, removeFromCart, getOrderSummary, navigateToStep } =
    useKiosk();
  const { t } = useTranslation();
  const orderSummary = getOrderSummary();

  // Empty cart state - Full screen centered
  if (cart.length === 0) {
    return (
      <section className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 animate-fade-in">
        <div className="text-center px-8 max-w-2xl">
          <ShoppingBag className="w-40 h-40 text-gray-300 dark:text-gray-600 mx-auto mb-8" />
          <h2 className="text-6xl font-bold text-gray-800 dark:text-white mb-6">
            {t('cart_empty')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-3xl mb-12">
            {t('cart_empty_message')}
          </p>
          <button
            onClick={() => navigateToStep('food')}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-16 py-8 rounded-2xl text-3xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 min-w-[320px]"
          >
            {t('start_ordering')}
          </button>
        </div>
      </section>
    );
  }

  // Full-screen split layout: Left (cart items) + Right (order summary)
  return (
    <section className="fixed inset-0 flex flex-col lg:flex-row bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 animate-fade-in overflow-hidden">
      {/* LEFT PANEL - Cart Items (Scrollable) */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8 lg:p-12">
          {/* Section Header */}
          <div className="mb-10">
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-4">
              {t('review_order')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-2xl lg:text-3xl">
              {t('review_subtitle')}
            </p>
          </div>

          {/* Cart Items Grid */}
          <div className="space-y-6">
            {cart.map((cartItem) => (
              <div
                key={cartItem.id}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 flex gap-8 items-center hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary-300 dark:hover:border-primary-600"
              >
                {/* Item Image - LARGER */}
                <div className="relative w-40 h-40 lg:w-48 lg:h-48 rounded-2xl overflow-hidden flex-shrink-0 ring-4 ring-gray-100 dark:ring-gray-700">
                  <Image
                    src={cartItem.image}
                    alt={cartItem.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 160px, 192px"
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3">
                    {cartItem.name}
                  </h3>
                  
                  {/* Selected Options */}
                  {cartItem.selectedOptions && cartItem.selectedOptions.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {cartItem.selectedOptions.map((opt, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-lg lg:text-xl text-gray-600 dark:text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                          <span>
                            <span className="font-semibold">{opt.optionName}:</span>{' '}
                            {opt.choices.join(', ')}
                            {opt.additionalPrice > 0 && (
                              <span className="text-primary-600 dark:text-primary-400 font-semibold ml-2">
                                +{formatPrice(opt.additionalPrice)}
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Special Instructions */}
                  {cartItem.specialInstructions && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 px-5 py-4 rounded-xl border-2 border-amber-200 dark:border-amber-800">
                      <p className="text-lg lg:text-xl text-amber-700 dark:text-amber-400">
                        <span className="text-2xl mr-2">✏️</span>
                        <span className="font-bold">{t('note')}:</span>{' '}
                        <span className="italic">{cartItem.specialInstructions}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column: Controls + Price */}
                <div className="flex flex-col items-end gap-6">
                  {/* Price Display - LARGER */}
                  <div className="text-right">
                    <p className="text-4xl lg:text-5xl font-bold text-primary-600 dark:text-primary-400">
                      {formatPrice(cartItem.finalPrice * cartItem.quantity)}
                    </p>
                  </div>

                  {/* Quantity Controls - LARGER TOUCH TARGETS */}
                  <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-700 rounded-2xl p-2">
                    <button
                      onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                      className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-8 h-8 lg:w-10 lg:h-10 text-gray-700 dark:text-gray-200" />
                    </button>
                    <span className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white w-16 text-center">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                      className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-primary-500 hover:bg-primary-600 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                    </button>
                  </div>

                  {/* Remove Button - LARGER */}
                  <button
                    onClick={() => removeFromCart(cartItem.id)}
                    className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-8 h-8 lg:w-10 lg:h-10 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Order Summary (Sticky) */}
      <div className="lg:w-[500px] xl:w-[600px] bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900 border-t-4 lg:border-t-0 lg:border-l-4 border-primary-200 dark:border-primary-700 flex flex-col shadow-2xl">
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          {/* Order Summary Header */}
          <div className="mb-10">
            <h3 className="text-5xl font-bold text-gray-800 dark:text-white mb-3">
              {t('order_summary')}
            </h3>
            <p className="text-2xl text-gray-600 dark:text-gray-300">
              {cart.length} {cart.length === 1 ? t('item') : 'items'}
            </p>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-6 mb-8">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-2xl lg:text-3xl">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {t('subtotal')}
              </span>
              <span className="font-bold text-gray-800 dark:text-white">
                {formatPrice(orderSummary.subtotal)}
              </span>
            </div>

            {/* Tax */}
            <div className="flex justify-between items-center text-2xl lg:text-3xl">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {t('tax')} (21%)
              </span>
              <span className="font-bold text-gray-800 dark:text-white">
                {formatPrice(orderSummary.tax)}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t-4 border-gray-300 dark:border-gray-600"></div>

            {/* Total - EXTRA LARGE */}
            <div className="flex justify-between items-center bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg">
              <span className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white">
                {t('total')}
              </span>
              <span className="text-5xl lg:text-6xl font-bold text-primary-600 dark:text-primary-400">
                {formatPrice(orderSummary.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Checkout Button - FIXED AT BOTTOM */}
        <div className="p-8 lg:p-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-t-4 border-primary-200 dark:border-primary-700">
          <button
            onClick={() => navigateToStep('payment')}
            className="w-full py-8 px-8 bg-gradient-to-r from-green-500 to-green-600 text-white text-3xl lg:text-4xl font-bold rounded-2xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-4 min-h-[100px]"
          >
            <CheckCircle className="w-12 h-12" />
            <span>{t('proceed_to_checkout')}</span>
          </button>
        </div>
      </div>
    </section>
  );
}