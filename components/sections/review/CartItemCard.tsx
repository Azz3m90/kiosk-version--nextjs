'use client';

import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import { formatPrice } from '@/lib/utils';
import { Trash2, Plus, Minus, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import type { CartItem } from '@/types';

interface CartItemCardProps {
  cartItem: CartItem;
}

export function CartItemCard({ cartItem }: CartItemCardProps) {
  const { updateQuantity, removeFromCart } = useKiosk();
  const { t } = useTranslation();

  // Debug: Log cart item to console
  console.log('CartItemCard rendering:', cartItem);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 lg:p-5 border border-gray-200 dark:border-gray-700">
      {/* Main Row: Item Name + Price */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-base lg:text-lg font-bold text-gray-800 dark:text-white mb-1">
            {cartItem.name || 'Unnamed Item'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatPrice(cartItem.finalPrice)} × {cartItem.quantity}
          </p>
        </div>
        <p className="text-lg lg:text-xl font-bold text-gray-800 dark:text-white ml-4">
          {formatPrice(cartItem.finalPrice * cartItem.quantity)}
        </p>
      </div>

      {/* Selected Options */}
      {cartItem.selectedOptions && cartItem.selectedOptions.length > 0 && (
        <div className="space-y-1 mb-3 pl-0">
          {cartItem.selectedOptions.map((opt, idx) => (
            <div
              key={idx}
              className="text-xs lg:text-sm text-gray-600 dark:text-gray-400"
            >
              <span className="font-semibold">{opt.optionName}:</span>{' '}
              {opt.choices.join(', ')}
              {opt.additionalPrice > 0 && (
                <span className="text-primary-600 dark:text-primary-400 font-semibold ml-1">
                  +{formatPrice(opt.additionalPrice)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Special Instructions */}
      {cartItem.specialInstructions && (
        <div className="bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-md border border-amber-200 dark:border-amber-800 mb-3">
          <p className="text-xs lg:text-sm text-amber-700 dark:text-amber-400">
            <span className="font-bold">{t('note')}:</span>{' '}
            <span className="italic">{cartItem.specialInstructions}</span>
          </p>
        </div>
      )}

      {/* Controls Row: Quantity + Remove */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 flex items-center justify-center transition-all"
            aria-label="Decrease quantity"
          >
            <Minus className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600 dark:text-indigo-400" />
          </button>
          <span className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white w-12 text-center">
            {cartItem.quantity}
          </span>
          <button
            onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-indigo-500 hover:bg-indigo-600 flex items-center justify-center transition-all"
            aria-label="Increase quantity"
          >
            <Plus className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </button>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => removeFromCart(cartItem.id)}
          className="px-4 py-2 lg:px-6 lg:py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm lg:text-base font-semibold transition-all flex items-center gap-2"
          aria-label="Remove item"
        >
          Remove
        </button>
      </div>
    </div>
  );
}