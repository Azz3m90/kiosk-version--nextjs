'use client';

import { useState } from 'react';
import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { ConfirmDialog } from './ConfirmDialog';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, removeFromCart, getOrderSummary, navigateToStep } = useKiosk();
  const { t } = useTranslation();
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const orderSummary = getOrderSummary();

  const handleCheckout = () => {
    navigateToStep('review');
    onClose();
  };

  const handleRemoveClick = (cartId: string) => {
    setItemToRemove(cartId);
  };

  const confirmRemove = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove);
      setItemToRemove(null);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Slides from RIGHT */}
      <div
        className={`fixed top-0 right-0 h-screen w-[420px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-white" />
            <h2 className="text-2xl font-bold text-white">
              {t('your_cart')} ({cart.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            aria-label="Close cart"
          >
            <X className="w-7 h-7 text-white" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <p className="text-gray-500 text-xl font-medium">{t('cart_empty')}</p>
              <button
                onClick={onClose}
                className="mt-6 px-8 py-4 bg-primary-500 text-white rounded-xl text-lg font-semibold hover:bg-primary-600 transition-colors"
              >
                {t('continue_shopping')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((cartItem) => (
                <div
                  key={cartItem.id}
                  className="bg-gray-50 rounded-xl p-5 flex gap-4 hover:bg-gray-100 transition-colors"
                >
                  {/* Item Image */}
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={cartItem.image}
                      alt={cartItem.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-800 truncate">
                      {cartItem.name}
                    </h3>
                    <p className="text-base text-gray-600">
                      {t('quantity')}: <span className="font-semibold">{cartItem.quantity}</span>
                    </p>
                    {cartItem.selectedOptions &&
                      cartItem.selectedOptions.length > 0 && (
                        <p className="text-sm text-gray-500 truncate">
                          {cartItem.selectedOptions
                            .map((opt) => opt.optionName)
                            .join(', ')}
                        </p>
                      )}
                    <p className="text-primary-600 font-bold text-xl mt-2">
                      {formatPrice(cartItem.finalPrice * cartItem.quantity)}
                    </p>
                  </div>

                  {/* Remove Button - LARGER for kiosk */}
                  <button
                    onClick={() => handleRemoveClick(cartItem.id)}
                    className="w-12 h-12 bg-red-100 hover:bg-red-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={itemToRemove !== null}
          onClose={() => setItemToRemove(null)}
          onConfirm={confirmRemove}
          title={t('remove')}
          message="Are you sure you want to remove this item from your cart?"
          confirmText={t('remove')}
          cancelText={t('back')}
          variant="danger"
        />

        {/* Footer - LARGER for kiosk */}
        {cart.length > 0 && (
          <div className="border-t-2 border-gray-200 p-6 bg-gradient-to-b from-gray-50 to-white flex-shrink-0">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-lg text-gray-700">
                <span className="font-medium">{t('subtotal')}:</span>
                <span className="font-semibold">
                  {formatPrice(orderSummary.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-lg text-gray-700">
                <span className="font-medium">{t('tax')} (21%):</span>
                <span className="font-semibold">
                  {formatPrice(orderSummary.tax)}
                </span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-gray-900 pt-3 border-t-2 border-gray-300">
                <span>{t('total')}:</span>
                <span className="text-primary-600 text-3xl">
                  {formatPrice(orderSummary.total)}
                </span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-5 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white text-xl font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              {t('proceed_to_checkout')}
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 px-6 mt-3 bg-gray-100 text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              {t('continue_shopping')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}