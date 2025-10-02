'use client';

import { useMemo } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useFilters } from '@/hooks/useFilters';
import { restaurantData } from '@/data/restaurant-data';
import { MenuItem } from '@/components/ui/MenuItem';
import { FilterBar } from '@/components/ui/FilterBar';
import type { FoodItem } from '@/types';

const foodCategories = ['all', 'appetizers', 'mains', 'desserts'];

export function FoodSection() {
  const { t } = useTranslation();
  const { filters, updateCategory, updatePriceRange } = useFilters('food');

  // Get all food items
  const foodItems = restaurantData.foodItems;

  // Apply filters
  const filteredItems = useMemo(() => {
    return foodItems.filter((item) => {
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
  }, [foodItems, filters]);

  // Get price range for food items
  const { minPrice, maxPrice } = useMemo(() => {
    if (!foodItems || foodItems.length === 0) {
      return { minPrice: 0, maxPrice: 30 };
    }
    const prices = foodItems.map((item) => item.price);
    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices)),
    };
  }, [foodItems]);

  return (
    <section className="animate-fade-in">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3">
          {t('food_title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-base lg:text-lg">{t('food_subtitle')}</p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        categories={foodCategories}
        selectedCategory={filters.category}
        onCategoryChange={updateCategory}
        priceRange={[filters.priceMin, filters.priceMax]}
        onPriceRangeChange={(range) => updatePriceRange(range[0], range[1])}
        minPrice={minPrice}
        maxPrice={maxPrice}
      />

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
          {filteredItems.map((item: FoodItem) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-xl">{t('no_items_found')}</p>
        </div>
      )}
    </section>
  );
}