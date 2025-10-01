'use client';

import { useState, useCallback, useMemo } from 'react';
import type { FilterState, FoodItem, DrinkItem } from '@/types';

type ItemType = 'food' | 'drinks';

const DEFAULT_FILTERS: Record<ItemType, FilterState> = {
  food: {
    category: 'all',
    priceMin: 0,
    priceMax: 30,
    priceRange: 'all',
  },
  drinks: {
    category: 'all',
    priceMin: 0,
    priceMax: 15,
    priceRange: 'all',
  },
};

export function useFilters(type: ItemType) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS[type]);

  const updateCategory = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category, priceRange: 'all' }));
  }, []);

  const updatePriceRange = useCallback(
    (min: number, max: number, range: FilterState['priceRange'] = 'all') => {
      setFilters((prev) => ({ ...prev, priceMin: min, priceMax: max, priceRange: range }));
    },
    []
  );

  const setQuickPriceRange = useCallback(
    (range: FilterState['priceRange']) => {
      const maxPrice = type === 'food' ? 30 : 15;

      let min = 0;
      let max = maxPrice;

      switch (range) {
        case 'budget':
          min = 0;
          max = type === 'food' ? 15 : 5;
          break;
        case 'mid':
          min = type === 'food' ? 15 : 5;
          max = type === 'food' ? 20 : 8;
          break;
        case 'premium':
          min = type === 'food' ? 20 : 8;
          max = maxPrice;
          break;
        case 'all':
        default:
          min = 0;
          max = maxPrice;
          break;
      }

      setFilters((prev) => ({ ...prev, priceMin: min, priceMax: max, priceRange: range }));
    },
    [type]
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS[type]);
  }, [type]);

  const filterItems = useCallback(
    <T extends FoodItem | DrinkItem>(items: T[]): T[] => {
      return items.filter((item) => {
        // Category filter
        if (filters.category !== 'all' && item.category !== filters.category) {
          return false;
        }

        // Price filter
        if (item.price < filters.priceMin || item.price > filters.priceMax) {
          return false;
        }

        return true;
      });
    },
    [filters]
  );

  return {
    filters,
    updateCategory,
    updatePriceRange,
    setQuickPriceRange,
    resetFilters,
    filterItems,
  };
}