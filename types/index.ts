// Core Types
export type Language = 'en' | 'fr' | 'nl';

export type Theme = 'light' | 'dark';

export type FoodCategory = 'appetizers' | 'mains' | 'desserts';
export type DrinkCategory = 'hot' | 'cold' | 'alcoholic';

export type PaymentMethod = 'card' | 'cash' | 'digital';

export type Step = 'food' | 'drinks' | 'review' | 'payment';

// Option Types
export interface OptionChoice {
  name: string;
  price: number;
}

export interface ItemOption {
  name: string;
  type: 'radio' | 'checkbox';
  required: boolean;
  choices: OptionChoice[];
  maxSelection?: number;
  minSelection?: number;
}

// Menu Item Types
export interface BaseMenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  basePrice?: number;
  image: string;
  hasOptions?: boolean;
  options?: ItemOption[];
}

export interface FoodItem extends BaseMenuItem {
  category: FoodCategory;
}

export interface DrinkItem extends BaseMenuItem {
  category: DrinkCategory;
}

export type MenuItem = FoodItem | DrinkItem;

// Cart Types
export interface SelectedOption {
  optionName: string;
  choices: string[];
  additionalPrice: number;
}

export interface CartItem {
  id: string; // Unique cart item ID
  menuItemId: number;
  name: string;
  description: string;
  basePrice: number;
  finalPrice: number;
  quantity: number;
  image: string;
  selectedOptions?: SelectedOption[];
  specialInstructions?: string;
  type: 'food' | 'drink';
}

// Translation Types
export interface Translations {
  [key: string]: string;
}

export interface LanguageTranslations {
  [key: string]: Translations;
}

// Restaurant Data Types
export interface RestaurantData {
  name: string;
  logo: string;
  foodItems: FoodItem[];
  drinkItems: DrinkItem[];
  translations: LanguageTranslations;
}

// Filter Types
export interface FilterState {
  category: string;
  priceMin: number;
  priceMax: number;
  priceRange: 'all' | 'budget' | 'mid' | 'premium';
}

export interface Filters {
  food: FilterState;
  drinks: FilterState;
}

// Order Summary Types
export interface OrderSummary {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}

// Payment Form Types
export interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

// Context Types
export interface KioskContextType {
  cart: CartItem[];
  currentStep: Step;
  currentLanguage: Language;
  currentTheme: Theme;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  navigateToStep: (step: Step) => void;
  changeLanguage: (lang: Language) => void;
  toggleTheme: () => void;
  getOrderSummary: () => OrderSummary;
  resetKiosk: () => void;
}