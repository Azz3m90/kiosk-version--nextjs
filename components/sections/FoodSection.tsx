'use client';

import { useMemo } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useFilters } from '@/hooks/useFilters';
import { useKiosk } from '@/context/KioskContext';
import { restaurantData } from '@/data/restaurant-data';
import { MenuItem } from '@/components/ui/MenuItem';
import { FilterBar } from '@/components/ui/FilterBar';
import type { FoodItem } from '@/types';

const foodCategories = ['all', 'appetizers', 'mains', 'desserts'];

export function FoodSection() {
  const { t } = useTranslation();
  const { filters, updateCategory, updatePriceRange } = useFilters('food');
  const { viewMode, gridColumns } = useKiosk();

  // Dynamic grid classes and item constraints based on column count
  const getGridClass = () => {
    switch (gridColumns) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 5:
        return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  // Get item wrapper constraints for optimal sizing
  const getItemConstraints = () => {
    switch (gridColumns) {
      case 2:
        return 'max-w-md mx-auto'; // Max 448px - prevents items from being too wide
      case 3:
        return 'max-w-sm mx-auto'; // Max 384px - default balanced size
      case 4:
        return 'max-w-xs mx-auto'; // Max 320px - compact but still usable
      case 5:
        return ''; // No constraints for 5 columns - let grid handle sizing
      default:
        return 'max-w-sm mx-auto';
    }
  };

  // Get gap size based on column count
  const getGapClass = () => {
    switch (gridColumns) {
      case 2:
        return 'gap-6'; // Spacious for 2 columns
      case 3:
        return 'gap-6'; // Standard spacing
      case 4:
        return 'gap-4'; // Tighter for 4 columns
      case 5:
        return 'gap-2'; // Very compact for 5 columns
      default:
        return 'gap-6';
    }
  };

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
    <section className="animate-fade-in pb-28">
      {/* Compact Section Header */}
      <div className="mb-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
          {t('food_title')}
        </h2>
      </div>

      {/* Compact Filter Bar with Integrated View Toggle */}
      <div className="mb-4">
        <FilterBar
          categories={foodCategories}
          selectedCategory={filters.category}
          onCategoryChange={updateCategory}
          priceRange={[filters.priceMin, filters.priceMax]}
          onPriceRangeChange={(range) => updatePriceRange(range[0], range[1])}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
      </div>

      {/* Items Display - Grid or List */}
      {filteredItems.length > 0 ? (
        viewMode === 'grid' ? (
          // Grid View - Dynamic columns with item constraints
          <div className={`grid ${getGridClass()} ${getGapClass()}`}>
            {filteredItems.map((item: FoodItem) => (
              <div key={item.id} className={`w-full ${getItemConstraints()}`}>
                <MenuItem item={item} viewMode="grid" gridColumns={gridColumns} />
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="flex flex-col gap-4">
            {filteredItems.map((item: FoodItem) => (
              <MenuItem key={item.id} item={item} viewMode="list" />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-xl">{t('no_items_found')}</p>
        </div>
      )}
    </section>
  );
}