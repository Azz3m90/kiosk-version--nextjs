'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type {
  CartItem,
  Step,
  Language,
  Theme,
  ViewMode,
  GridColumns,
  KioskContextType,
  OrderSummary,
  OrderType,
  ToastMessage,
} from '@/types';
import { TAX_RATE } from '@/data/restaurant-data';
import { ThemeTransition } from '@/components/ui/ThemeTransition';
import { Toast } from '@/components/ui/Toast';

const KioskContext = createContext<KioskContextType | undefined>(undefined);

export function KioskProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [gridColumns, setGridColumns] = useState<GridColumns>(3);
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [isThemeTransitioning, setIsThemeTransitioning] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // DISABLED: Load preferences from localStorage on mount
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const savedLanguage = localStorage.getItem('kiosk_language') as Language;
  //     const savedOrderType = localStorage.getItem('kiosk_orderType') as OrderType;
  //     
  //     console.log('Loading from localStorage:', { savedLanguage, savedOrderType });
  //     
  //     if (savedLanguage) {
  //       setCurrentLanguage(savedLanguage);
  //     }
  //     
  //     if (savedOrderType) {
  //       setOrderType(savedOrderType);
  //     }
  //     
  //     // Skip to food section if both are saved
  //     if (savedLanguage && savedOrderType) {
  //       setCurrentStep('food');
  //       console.log('Skipping to food section with saved preferences');
  //     }
  //   }
  // }, []);

  // Apply theme to document with cloud fog transition
  useEffect(() => {
    const root = document.documentElement;
    
    // Trigger theme transition animation
    setIsThemeTransitioning(true);
    
    // Add transition class to body for smoother effect
    document.body.classList.add('theme-transitioning');
    
    // Apply theme change
    if (currentTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Remove transition class after animation
    const transitionTimer = setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
      setIsThemeTransitioning(false);
    }, 1200);
    
    return () => clearTimeout(transitionTimer);
  }, [currentTheme]);

  const addToCart = useCallback((item: CartItem) => {
    console.log('Adding item to cart:', item);
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
        console.log('Updated cart:', newCart);
        return newCart;
      }

      // Add new item
      const newCart = [...prevCart, item];
      console.log('New cart:', newCart);
      return newCart;
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

  const updateCartItem = useCallback((itemId: string, updatedItem: CartItem) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...updatedItem, id: itemId } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const navigateToStep = useCallback((step: Step) => {
    // Allow navigation to all pages (cart requirement removed for swipe navigation)
    setCurrentStep(step);
    // Scroll to top when changing steps
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const changeLanguage = useCallback((lang: Language) => {
    setCurrentLanguage(lang);
    // DISABLED: Persist to localStorage
    // if (typeof window !== 'undefined') {
    //   localStorage.setItem('kiosk_language', lang);
    //   console.log('Saved language to localStorage:', lang);
    // }
  }, []);

  const handleSetOrderType = useCallback((type: OrderType) => {
    setOrderType(type);
    // DISABLED: Persist to localStorage
    // if (typeof window !== 'undefined') {
    //   localStorage.setItem('kiosk_orderType', type);
    //   console.log('Saved order type to localStorage:', type);
    // }
  }, []);

  const toggleTheme = useCallback(() => {
    setCurrentTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'));
  }, []);

  const handleSetGridColumns = useCallback((columns: GridColumns) => {
    setGridColumns(columns);
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

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const resetKiosk = useCallback(() => {
    setCart([]);
    setCurrentStep('welcome');
    setCurrentLanguage('en');
    setCurrentTheme('light');
    setViewMode('grid');
    setGridColumns(3);
    setOrderType(null);
    setToast(null);
    
    // DISABLED: Clear localStorage when resetting
    // if (typeof window !== 'undefined') {
    //   localStorage.removeItem('kiosk_language');
    //   localStorage.removeItem('kiosk_orderType');
    // }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const value = useMemo(
    () => ({
      cart,
      currentStep,
      currentLanguage,
      currentTheme,
      viewMode,
      gridColumns,
      orderType,
      toast,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateCartItem,
      clearCart,
      navigateToStep,
      changeLanguage,
      setOrderType: handleSetOrderType,
      toggleTheme,
      toggleViewMode,
      setGridColumns: handleSetGridColumns,
      getOrderSummary,
      resetKiosk,
      showToast,
      hideToast,
    }),
    [
      cart,
      currentStep,
      currentLanguage,
      currentTheme,
      viewMode,
      gridColumns,
      orderType,
      toast,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateCartItem,
      clearCart,
      navigateToStep,
      changeLanguage,
      handleSetOrderType,
      toggleTheme,
      toggleViewMode,
      handleSetGridColumns,
      getOrderSummary,
      resetKiosk,
      showToast,
      hideToast,
    ]
  );

  return (
    <KioskContext.Provider value={value}>
      {children}
      <ThemeTransition isTransitioning={isThemeTransitioning} theme={currentTheme} />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </KioskContext.Provider>
  );
}

export function useKiosk() {
  const context = useContext(KioskContext);
  if (context === undefined) {
    throw new Error('useKiosk must be used within a KioskProvider');
  }
  return context;
}