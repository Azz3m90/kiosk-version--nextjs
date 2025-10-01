'use client';

import { useState } from 'react';
import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import { formatPrice } from '@/lib/utils';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import type { MenuItem as MenuItemType, ItemOption, OptionChoice, SelectedOption } from '@/types';

interface ItemOptionsModalProps {
  item: MenuItemType;
  onClose: () => void;
}

export function ItemOptionsModal({ item, onClose }: ItemOptionsModalProps) {
  const { addToCart } = useKiosk();
  const { t } = useTranslation();
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  const toggleChoice = (optionName: string, choice: OptionChoice, optionType: 'radio' | 'checkbox') => {
    setSelectedChoices((prev) => {
      const currentChoices = prev[optionName] || [];
      
      if (optionType === 'radio') {
        // For radio, replace with the new choice
        return { ...prev, [optionName]: [choice.name] };
      } else {
        // For checkbox, toggle the choice
        const exists = currentChoices.includes(choice.name);
        if (exists) {
          return { ...prev, [optionName]: currentChoices.filter(c => c !== choice.name) };
        } else {
          return { ...prev, [optionName]: [...currentChoices, choice.name] };
        }
      }
    });
  };

  const calculateTotalPrice = () => {
    let optionsPrice = 0;
    
    if (item.options) {
      item.options.forEach((option) => {
        const selectedForOption = selectedChoices[option.name] || [];
        selectedForOption.forEach((choiceName) => {
          const choice = option.choices.find((c) => c.name === choiceName);
          if (choice) {
            optionsPrice += choice.price;
          }
        });
      });
    }
    
    return (item.price + optionsPrice) * quantity;
  };

  const handleAddToCart = () => {
    let optionsPrice = 0;
    const selectedOptionsList: SelectedOption[] = [];
    
    if (item.options) {
      item.options.forEach((option) => {
        const selectedForOption = selectedChoices[option.name] || [];
        if (selectedForOption.length > 0) {
          let additionalPrice = 0;
          selectedForOption.forEach((choiceName) => {
            const choice = option.choices.find((c) => c.name === choiceName);
            if (choice) {
              additionalPrice += choice.price;
            }
          });
          
          selectedOptionsList.push({
            optionName: option.name,
            choices: selectedForOption,
            additionalPrice,
          });
          
          optionsPrice += additionalPrice;
        }
      });
    }
    
    const finalPrice = item.price + optionsPrice;
    
    const cartItem = {
      id: `${item.id}-${Date.now()}`,
      menuItemId: item.id,
      name: item.name,
      description: item.description,
      basePrice: item.price,
      finalPrice: finalPrice,
      quantity: quantity,
      image: item.image,
      selectedOptions: selectedOptionsList,
      type: ('category' in item && ['appetizers', 'mains', 'desserts'].includes(item.category)) ? 'food' as const : 'drink' as const,
    };
    
    addToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="relative h-64">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-16rem)]">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{item.name}</h2>
          <p className="text-gray-600 mb-6">{item.description}</p>

          {/* Options */}
          {item.options && item.options.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {t('customize_your_order')}
              </h3>
              <div className="space-y-6">
                {item.options.map((option, optionIndex) => (
                  <div key={optionIndex}>
                    <h4 className="font-semibold text-gray-700 mb-3">
                      {option.name} {option.required && <span className="text-red-500">*</span>}
                    </h4>
                    <div className="space-y-2">
                      {option.choices.map((choice, choiceIndex) => {
                        const isSelected = (selectedChoices[option.name] || []).includes(choice.name);
                        return (
                          <button
                            key={choiceIndex}
                            onClick={() => toggleChoice(option.name, choice, option.type)}
                            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                              isSelected
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-800">
                                {choice.name}
                              </span>
                              <span className="text-primary-600 font-bold">
                                {choice.price > 0 ? `+${formatPrice(choice.price)}` : t('free')}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-800 mb-3">
              {t('special_instructions')}
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder={t('special_instructions_placeholder')}
              className="input-field min-h-[100px] resize-none"
              maxLength={200}
            />
            <p className="text-sm text-gray-500 mt-2">
              {specialInstructions.length}/200
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-800 mb-3">
              {t('quantity')}
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-6 h-6 text-gray-700" />
              </button>
              <span className="text-2xl font-bold text-gray-800 w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 rounded-full bg-primary-500 hover:bg-primary-600 flex items-center justify-center transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3"
          >
            <ShoppingCart className="w-6 h-6" />
            <span>
              {t('add_to_cart')} - {formatPrice(calculateTotalPrice())}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}