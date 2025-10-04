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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all">
      {/* Main Row: Item Name + Price */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {cartItem.name || 'Unnamed Item'}
          </h3>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
            {formatPrice(cartItem.finalPrice)} × {cartItem.quantity}
          </p>
        </div>
        <p className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
          {formatPrice(cartItem.finalPrice * cartItem.quantity)}
        </p>
      </div>

      {/* Selected Options */}
      {cartItem.selectedOptions && cartItem.selectedOptions.length > 0 && (
        <div className="space-y-2 mb-4 bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">
          {cartItem.selectedOptions.map((opt, idx) => (
            <div
              key={idx}
              className="text-sm md:text-base text-gray-700 dark:text-gray-300"
            >
              <span className="font-bold">{opt.optionName}:</span>{' '}
              {opt.choices.join(', ')}
              {opt.additionalPrice > 0 && (
                <span className="text-indigo-600 dark:text-indigo-400 font-bold ml-2">
                  +{formatPrice(opt.additionalPrice)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Special Instructions */}
      {cartItem.specialInstructions && (
        <div className="bg-amber-50 dark:bg-amber-900/20 px-4 py-3 rounded-lg border-2 border-amber-300 dark:border-amber-700 mb-4">
          <p className="text-sm md:text-base text-amber-800 dark:text-amber-300">
            <span className="font-bold">{t('note')}:</span>{' '}
            <span className="italic">{cartItem.specialInstructions}</span>
          </p>
        </div>
      )}

      {/* Controls Row: Quantity + Remove */}
      <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200 dark:border-gray-700 gap-4">
        {/* Quantity Controls - Kiosk-optimized 60px touch targets */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
            className="min-w-[60px] min-h-[60px] w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 hover:from-indigo-200 hover:to-indigo-300 dark:hover:from-indigo-800/60 dark:hover:to-indigo-700/60 flex items-center justify-center transition-all shadow-md hover:shadow-lg active:scale-95"
            aria-label="Decrease quantity"
          >
            <Minus className="w-7 h-7 text-indigo-700 dark:text-indigo-300" strokeWidth={3} />
          </button>
          <span className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white min-w-[60px] text-center">
            {cartItem.quantity}
          </span>
          <button
            onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
            className="min-w-[60px] min-h-[60px] w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 flex items-center justify-center transition-all shadow-md hover:shadow-lg active:scale-95"
            aria-label="Increase quantity"
          >
            <Plus className="w-7 h-7 text-white" strokeWidth={3} />
          </button>
        </div>

        {/* Remove Button - Large Kiosk-friendly */}
        <button
          onClick={() => removeFromCart(cartItem.id)}
          className="px-8 py-4 min-h-[60px] rounded-xl bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg md:text-xl font-bold transition-all flex items-center gap-3 shadow-md hover:shadow-lg active:scale-95"
          aria-label="Remove item"
        >
          <Trash2 className="w-6 h-6" strokeWidth={2.5} />
          Remove
        </button>
      </div>
    </div>
  );
}