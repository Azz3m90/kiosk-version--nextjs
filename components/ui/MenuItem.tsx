'use client';

import { useState } from 'react';
import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import { formatPrice } from '@/lib/utils';
import { Plus, Star } from 'lucide-react';
import Image from 'next/image';
import type { MenuItem as MenuItemType } from '@/types';
import { ItemOptionsModal } from './ItemOptionsModal';

interface MenuItemProps {
  item: MenuItemType;
}

export function MenuItem({ item }: MenuItemProps) {
  const { addToCart } = useKiosk();
  const { t } = useTranslation();
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const handleAddToCart = () => {
    if (item.options && item.options.length > 0) {
      setShowOptionsModal(true);
    } else {
      const cartItem = {
        id: `${item.id}-${Date.now()}`,
        menuItemId: item.id,
        name: item.name,
        description: item.description,
        basePrice: item.price,
        finalPrice: item.price,
        quantity: 1,
        image: item.image,
        selectedOptions: [],
        type: ('category' in item && ['appetizers', 'mains', 'desserts'].includes(item.category)) ? 'food' as const : 'drink' as const,
      };
      addToCart(cartItem);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group flex flex-col h-full">
        {/* Item Image */}
        <div className="relative h-48 lg:h-56 overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Category Badge */}
          <div className="absolute top-4 left-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {t(item.category)}
            </span>
          </div>
          {/* Rating Badge */}
          {item.rating && (
            <div className="absolute top-4 right-4 bg-yellow-400 px-3 py-1 rounded-full flex items-center gap-1">
              <Star className="w-4 h-4 fill-white text-white" />
              <span className="text-sm font-bold text-white">{item.rating}</span>
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 line-clamp-1">
            {item.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 h-10">
            {item.description}
          </p>

          {/* Price and Add Button */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {formatPrice(item.price)}
            </span>
            <button
              onClick={handleAddToCart}
              className="btn-primary px-6 py-3 flex items-center gap-2 group-hover:scale-105 transition-transform"
              aria-label={`Add ${item.name} to cart`}
            >
              <Plus className="w-5 h-5" />
              <span>{t('add')}</span>
            </button>
          </div>

          {/* Options Indicator */}
          {item.options && item.options.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
              {t('customizable')}
            </p>
          )}
        </div>
      </div>

      {/* Options Modal */}
      {showOptionsModal && (
        <ItemOptionsModal
          item={item}
          onClose={() => setShowOptionsModal(false)}
        />
      )}
    </>
  );
}