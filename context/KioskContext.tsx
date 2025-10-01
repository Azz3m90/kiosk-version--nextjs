'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type {
  CartItem,
  Step,
  Language,
  KioskContextType,
  OrderSummary,
} from '@/types';
import { TAX_RATE } from '@/data/restaurant-data';

const KioskContext = createContext<KioskContextType | undefined>(undefined);

export function KioskProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>('food');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const addToCart = useCallback((item: CartItem) => {
    setCart((prevCart) => {
      // Check if exact same item with same options exists
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const newCart = [...prevCart];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + item.quantity,
        };
        return newCart;
      }

      // Add new item
      return [...prevCart, item];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const navigateToStep = useCallback((step: Step) => {
    setCurrentStep(step);
    // Scroll to top when changing steps
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const changeLanguage = useCallback((lang: Language) => {
    setCurrentLanguage(lang);
  }, []);

  const getOrderSummary = useCallback((): OrderSummary => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.finalPrice * item.quantity,
      0
    );
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return {
      subtotal,
      tax,
      total,
      itemCount,
    };
  }, [cart]);

  const resetKiosk = useCallback(() => {
    setCart([]);
    setCurrentStep('food');
    setCurrentLanguage('en');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const value = useMemo(
    () => ({
      cart,
      currentStep,
      currentLanguage,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      navigateToStep,
      changeLanguage,
      getOrderSummary,
      resetKiosk,
    }),
    [
      cart,
      currentStep,
      currentLanguage,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      navigateToStep,
      changeLanguage,
      getOrderSummary,
      resetKiosk,
    ]
  );

  return (
    <KioskContext.Provider value={value}>{children}</KioskContext.Provider>
  );
}

export function useKiosk() {
  const context = useContext(KioskContext);
  if (context === undefined) {
    throw new Error('useKiosk must be used within a KioskProvider');
  }
  return context;
}