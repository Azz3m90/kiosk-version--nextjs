'use client';

import { useState, useEffect } from 'react';
import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Trash2, X, Edit2 } from 'lucide-react';
import Image from 'next/image';
import { ConfirmDialog } from './ConfirmDialog';
import { ItemOptionsModal } from './ItemOptionsModal';
import { restaurantData } from '@/data/restaurant-data';
import type { CartItem, MenuItem } from '@/types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, removeFromCart, getOrderSummary, navigateToStep } = useKiosk();
  const { t } = useTranslation();
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [itemToEdit, setItemToEdit] = useState<{ cartItem: CartItem; menuItem: MenuItem } | null>(null);

  const orderSummary = getOrderSummary();

  // Function to get menu item from restaurant data
  const getMenuItem = (menuItemId: number): MenuItem | undefined => {
    return [...restaurantData.foodItems, ...restaurantData.drinkItems].find(
      item => item.id === menuItemId
    );
  };

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      // Save original overflow style
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      
      // Get scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Lock scroll and compensate for scrollbar
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // Cleanup: restore scroll when sidebar closes
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);

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

  const handleEditClick = (cartItem: CartItem) => {
    const menuItem = getMenuItem(cartItem.menuItemId);
    if (menuItem) {
      setItemToEdit({ cartItem, menuItem });
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
        className={`fixed top-0 right-0 h-screen w-[520px] bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
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
              <ShoppingCart className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
              <p className="text-gray-500 dark:text-gray-400 text-xl font-medium">{t('cart_empty')}</p>
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
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 flex gap-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
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
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate">
                      {cartItem.name}
                    </h3>
                    <p className="text-base text-gray-600 dark:text-gray-300">
                      {t('quantity')}: <span className="font-semibold">{cartItem.quantity}</span>
                    </p>
                    {cartItem.selectedOptions &&
                      cartItem.selectedOptions.length > 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {cartItem.selectedOptions
                            .map((opt) => opt.optionName)
                            .join(', ')}
                        </p>
                      )}
                    {cartItem.specialInstructions && (
                      <p className="text-sm text-amber-600 dark:text-amber-400 italic mt-1 line-clamp-2">
                        ✏️ {cartItem.specialInstructions}
                      </p>
                    )}
                    <p className="text-primary-600 dark:text-primary-400 font-bold text-xl mt-2">
                      {formatPrice(cartItem.finalPrice * cartItem.quantity)}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEditClick(cartItem)}
                      className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-xl flex items-center justify-center transition-colors"
                      aria-label="Edit item"
                    >
                      <Edit2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </button>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveClick(cartItem.id)}
                      className="w-12 h-12 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-xl flex items-center justify-center transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
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

        {/* Edit Item Modal */}
        {itemToEdit && (
          <ItemOptionsModal
            item={itemToEdit.menuItem}
            cartItemToEdit={itemToEdit.cartItem}
            onClose={() => setItemToEdit(null)}
          />
        )}

        {/* Footer - Compact */}
        {cart.length > 0 && (
          <div className="border-t-2 border-gray-200 dark:border-gray-700 p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 flex-shrink-0">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">{t('subtotal')}:</span>
                <span className="font-semibold">
                  {formatPrice(orderSummary.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">{t('tax')} (21%):</span>
                <span className="font-semibold">
                  {formatPrice(orderSummary.tax)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-300 dark:border-gray-600">
                <span>{t('total')}:</span>
                <span className="text-primary-600 dark:text-primary-400 text-xl">
                  {formatPrice(orderSummary.total)}
                </span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 px-5 bg-gradient-to-r from-green-500 to-green-600 text-white text-base font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              {t('proceed_to_checkout')}
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-5 mt-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {t('continue_shopping')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}