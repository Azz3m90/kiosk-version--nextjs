'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import { formatPrice } from '@/lib/utils';
import { X, Plus, Minus, ShoppingCart, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import Image from 'next/image';
import type { MenuItem as MenuItemType, ItemOption, OptionChoice, SelectedOption, CartItem } from '@/types';

interface ItemOptionsModalProps {
  item: MenuItemType;
  initialQuantity?: number;
  cartItemToEdit?: CartItem; // For edit mode
  onClose: () => void;
}

export function ItemOptionsModal({ item, initialQuantity = 1, cartItemToEdit, onClose }: ItemOptionsModalProps) {
  const { addToCart, updateCartItem } = useKiosk();
  const { t } = useTranslation();
  const isEditMode = !!cartItemToEdit;
  
  // Initialize state from cartItemToEdit if in edit mode
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string[]>>(() => {
    if (cartItemToEdit?.selectedOptions) {
      const initialChoices: Record<string, string[]> = {};
      cartItemToEdit.selectedOptions.forEach(opt => {
        initialChoices[opt.optionName] = opt.choices;
      });
      return initialChoices;
    }
    return {};
  });
  const [specialInstructions, setSpecialInstructions] = useState(cartItemToEdit?.specialInstructions || '');
  const [quantity, setQuantity] = useState(cartItemToEdit?.quantity || initialQuantity);
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Handle mounting for portal (SSR safety)
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    // Save original overflow style
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    // Get scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Lock scroll and hide scrollbar
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    // Cleanup: restore scroll when modal closes
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);

  // Calculate wizard steps dynamically based on item options
  const hasOptions = item.options && item.options.length > 0;
  const steps = [
    'overview',
    ...(hasOptions ? ['options'] : []),
    'customize',
    'review'
  ];

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

  const canProceed = () => {
    // Check if required options are selected
    if (steps[currentStep] === 'options' && item.options) {
      return item.options.every((option) => {
        if (option.required) {
          const selectedForOption = selectedChoices[option.name] || [];
          return selectedForOption.length > 0;
        }
        return true;
      });
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
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
      id: isEditMode ? cartItemToEdit.id : `${item.id}-${Date.now()}`,
      menuItemId: item.id,
      name: item.name,
      description: item.description,
      basePrice: item.price,
      finalPrice: finalPrice,
      quantity: quantity,
      image: item.image,
      selectedOptions: selectedOptionsList,
      specialInstructions: specialInstructions || undefined,
      type: ('category' in item && ['appetizers', 'mains', 'desserts'].includes(item.category)) ? 'food' as const : 'drink' as const,
    };
    
    if (isEditMode) {
      updateCartItem(cartItemToEdit.id, cartItem);
    } else {
      addToCart(cartItem);
    }
    onClose();
  };

  // Don't render on server or before mount
  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 z-[100] animate-fade-in">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-14 h-14 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        aria-label="Close"
      >
        <X className="w-7 h-7 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-700">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 ease-out"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Step Indicator */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
              index < currentStep 
                ? 'bg-primary-500 border-primary-500' 
                : index === currentStep 
                ? 'bg-white dark:bg-gray-800 border-primary-500 scale-110' 
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
            }`}>
              {index < currentStep ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <span className={`text-sm font-bold ${
                  index === currentStep ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-600'
                }`}>
                  {index + 1}
                </span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-1 rounded-full transition-all ${
                index < currentStep ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="h-full pt-24 pb-32 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6">
          
          {/* Step 1: Overview */}
          {steps[currentStep] === 'overview' && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">{item.name}</h1>
                <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{item.description}</p>
              </div>
              <div className="relative w-full max-w-3xl mx-auto aspect-video rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
              <div className="text-center mt-8">
                <div className="inline-block bg-white dark:bg-gray-800 rounded-2xl shadow-lg px-8 py-6">
                  <p className="text-gray-600 dark:text-gray-400 text-xl mb-2">{t('base_price')}</p>
                  <p className="text-5xl font-bold text-primary-600 dark:text-primary-400">{formatPrice(item.price)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Options */}
          {steps[currentStep] === 'options' && (
            <div className="animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
                  {t('customize_your_order')}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  {t('select_options_below')}
                </p>
              </div>
              <div className="space-y-8 max-w-4xl mx-auto">
                {item.options?.map((option, optionIndex) => (
                  <div key={optionIndex} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                      {option.name} 
                      {option.required && <span className="text-red-500 ml-2">*</span>}
                      <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-3">
                        {option.type === 'radio' ? t('select_one') : t('select_multiple')}
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {option.choices.map((choice, choiceIndex) => {
                        const isSelected = (selectedChoices[option.name] || []).includes(choice.name);
                        return (
                          <button
                            key={choiceIndex}
                            onClick={() => toggleChoice(option.name, choice, option.type)}
                            className={`min-h-[60px] p-3.5 rounded-2xl border-4 transition-all text-left ${
                              isSelected
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 scale-[1.02] shadow-lg'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 active:scale-95'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                isSelected 
                                  ? 'border-primary-500 bg-primary-500' 
                                  : 'border-gray-400 dark:border-gray-600'
                              }`}>
                                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                              </div>
                              <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                                <span className="text-xs font-semibold text-gray-800 dark:text-white leading-tight flex-1 min-w-0">
                                  {choice.name}
                                </span>
                                <span className={`text-xs font-bold whitespace-nowrap flex-shrink-0 ${
                                  isSelected 
                                    ? 'text-primary-600 dark:text-primary-400' 
                                    : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                  {choice.price > 0 ? `+${formatPrice(choice.price)}` : t('free')}
                                </span>
                              </div>
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

          {/* Step 3: Customize (Quantity & Instructions) */}
          {steps[currentStep] === 'customize' && (
            <div className="animate-fade-in max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
                  {t('finalize_your_order')}
                </h2>
              </div>

              {/* Quantity */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10 mb-8">
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                  {t('quantity')}
                </h3>
                <div className="flex items-center justify-center gap-8">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-90 flex items-center justify-center transition-all shadow-lg"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-10 h-10 text-gray-700 dark:text-gray-300" />
                  </button>
                  <div className="text-center min-w-[120px]">
                    <div className="text-7xl font-bold text-primary-600 dark:text-primary-400">
                      {quantity}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-xl mt-2">
                      {quantity === 1 ? t('item') : t('items')}
                    </div>
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-20 h-20 rounded-full bg-primary-500 hover:bg-primary-600 active:scale-90 flex items-center justify-center transition-all shadow-lg"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-10 h-10 text-white" />
                  </button>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10">
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                  {t('special_instructions')}
                </h3>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder={t('special_instructions_placeholder')}
                  className="w-full min-h-[200px] p-6 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white text-xl resize-none focus:outline-none focus:ring-4 focus:ring-primary-500/50 transition-all"
                  maxLength={200}
                />
                <p className="text-right text-gray-500 dark:text-gray-400 mt-3 text-lg">
                  {specialInstructions.length}/200
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {steps[currentStep] === 'review' && (
            <div className="animate-fade-in max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
                  {t('review_your_order')}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  {t('check_before_adding')}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
                {/* Item Image */}
                <div className="relative w-full h-64">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                  />
                </div>

                <div className="p-10">
                  {/* Item Details */}
                  <h3 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">{item.name}</h3>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{item.description}</p>

                  {/* Selected Options */}
                  {item.options && Object.keys(selectedChoices).length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{t('your_selections')}</h4>
                      <div className="space-y-3">
                        {item.options.map((option) => {
                          const selectedForOption = selectedChoices[option.name] || [];
                          if (selectedForOption.length === 0) return null;
                          
                          return (
                            <div key={option.name} className="flex justify-between items-start bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                              <div>
                                <span className="font-semibold text-gray-700 dark:text-gray-300">{option.name}:</span>
                                <div className="text-gray-600 dark:text-gray-400 mt-1">
                                  {selectedForOption.map((choiceName, idx) => {
                                    const choice = option.choices.find(c => c.name === choiceName);
                                    return (
                                      <div key={idx} className="flex items-center gap-2">
                                        <span>• {choiceName}</span>
                                        {choice && choice.price > 0 && (
                                          <span className="text-primary-600 dark:text-primary-400 font-semibold">
                                            +{formatPrice(choice.price)}
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Special Instructions */}
                  {specialInstructions && (
                    <div className="mb-8">
                      <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{t('special_instructions')}</h4>
                      <p className="text-xl text-gray-600 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-4">
                        {specialInstructions}
                      </p>
                    </div>
                  )}

                  {/* Quantity & Price */}
                  <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                    <div className="flex justify-between items-center text-2xl">
                      <span className="text-gray-700 dark:text-gray-300">{t('quantity')}</span>
                      <span className="font-bold text-gray-800 dark:text-white">{quantity}</span>
                    </div>
                    <div className="flex justify-between items-center text-2xl">
                      <span className="text-gray-700 dark:text-gray-300">{t('base_price')}</span>
                      <span className="font-bold text-gray-800 dark:text-white">{formatPrice(item.price)}</span>
                    </div>
                    {calculateTotalPrice() !== item.price * quantity && (
                      <div className="flex justify-between items-center text-2xl">
                        <span className="text-gray-700 dark:text-gray-300">{t('extras')}</span>
                        <span className="font-bold text-primary-600 dark:text-primary-400">
                          +{formatPrice(calculateTotalPrice() - (item.price * quantity))}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-4xl font-bold border-t-2 border-gray-200 dark:border-gray-700 pt-4">
                      <span className="text-gray-800 dark:text-white">{t('total')}</span>
                      <span className="text-primary-600 dark:text-primary-400">{formatPrice(calculateTotalPrice())}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 p-6 shadow-2xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-5 py-4 rounded-2xl text-lg font-bold transition-all ${
              currentStep === 0
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500 active:scale-95'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            {t('previous')}
          </button>

          {/* Step Info */}
          <div className="text-center flex-shrink-0">
            <div className="text-xs text-gray-500 dark:text-gray-400">{t('step')}</div>
            <div className="text-xl font-bold text-gray-800 dark:text-white">
              {currentStep + 1} / {steps.length}
            </div>
          </div>

          {/* Next/Add Button */}
          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-5 py-4 rounded-2xl text-lg font-bold transition-all ${
                !canProceed()
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-primary-500 text-white hover:bg-primary-600 active:scale-95 shadow-lg'
              }`}
            >
              {t('next')}
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 active:scale-95 transition-all shadow-xl"
            >
              <ShoppingCart className="w-6 h-6" />
              {isEditMode ? t('update_item') : t('add_to_cart')} - {formatPrice(calculateTotalPrice())}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}