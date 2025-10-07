'use client';

import { useMemo } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useFilters } from '@/hooks/useFilters';
import { useKiosk } from '@/context/KioskContext';
import { restaurantData } from '@/data/restaurant-data';
import { MenuItem } from '@/components/ui/MenuItem';
import { FilterBar } from '@/components/ui/FilterBar';
import { NavigationButtons } from '@/components/ui/NavigationButtons';
import { ViewToggle } from '@/components/ui/ViewToggle';
import type { DrinkItem } from '@/types';

const drinkCategories = ['all', 'hot', 'cold', 'alcoholic'];

export function DrinksSection() {
  const { t } = useTranslation();
  const { filters, updateCategory, updatePriceRange } = useFilters('drinks');
  const { viewMode } = useKiosk();

  // Get all drink items
  const drinkItems = restaurantData.drinkItems;

  // Apply filters
  const filteredItems = useMemo(() => {
    return drinkItems.filter((item) => {
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
  }, [drinkItems, filters]);

  // Get price range for drink items
  const { minPrice, maxPrice } = useMemo(() => {
    if (!drinkItems || drinkItems.length === 0) {
      return { minPrice: 0, maxPrice: 15 };
    }
    const prices = drinkItems.map((item) => item.price);
    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices)),
    };
  }, [drinkItems]);

  return (
    <section className="animate-fade-in">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3">
          {t('drinks_title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-base lg:text-lg">{t('drinks_subtitle')}</p>
      </div>

      {/* Filter Bar and View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <FilterBar
          categories={drinkCategories}
          selectedCategory={filters.category}
          onCategoryChange={updateCategory}
          priceRange={[filters.priceMin, filters.priceMax]}
          onPriceRangeChange={(range) => updatePriceRange(range[0], range[1])}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
        <ViewToggle />
      </div>

      {/* Items Display - Grid or List */}
      {filteredItems.length > 0 ? (
        viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
            {filteredItems.map((item: DrinkItem) => (
              <MenuItem key={item.id} item={item} viewMode="grid" />
            ))}
          </div>
        ) : (
          // List View
          <div className="flex flex-col gap-4">
            {filteredItems.map((item: DrinkItem) => (
              <MenuItem key={item.id} item={item} viewMode="list" />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-xl">{t('no_items_found')}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <NavigationButtons currentStep="drinks" />
    </section>
  );
}