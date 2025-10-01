'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { SlidersHorizontal } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  minPrice: number;
  maxPrice: number;
}

export function FilterBar({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  minPrice,
  maxPrice,
}: FilterBarProps) {
  const { t } = useTranslation();
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  // Calculate clamped positions for the active range bar
  const minRatio = Math.max(0, Math.min(1, (priceRange[0] - minPrice) / (maxPrice - minPrice)));
  const maxRatio = Math.max(0, Math.min(1, (priceRange[1] - minPrice) / (maxPrice - minPrice)));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-4 transition-colors duration-300">
      {/* Compact Category Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold min-w-fit">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm">{t('filter_by_category')}:</span>
        </div>
        <div className="flex flex-wrap gap-2 flex-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-5 py-2.5 rounded-lg font-semibold text-base transition-all min-h-[44px] ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 active:bg-gray-200 dark:active:bg-gray-600'
              }`}
            >
              {t(category)}
            </button>
          ))}
        </div>
        
        {/* Collapsible Price Filter Toggle */}
        <button
          onClick={() => setShowPriceFilter(!showPriceFilter)}
          className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all min-h-[44px] flex items-center gap-2 ${
            showPriceFilter 
              ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-2 border-primary-300 dark:border-primary-600' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 active:bg-gray-200 dark:active:bg-gray-600'
          }`}
        >
          <span className="text-xs">💰</span>
          <span>{formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</span>
        </button>
      </div>

      {/* Collapsible Price Range Filter */}
      {showPriceFilter && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mt-3 transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {t('filter_by_price')}
            </span>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold text-primary-600 dark:text-primary-400">{formatPrice(priceRange[0])}</span>
              <span className="text-gray-400">-</span>
              <span className="font-bold text-primary-600 dark:text-primary-400">{formatPrice(priceRange[1])}</span>
            </div>
          </div>
          <div className="relative h-8 flex items-center px-2">
            {/* Background track */}
            <div className="absolute left-2 right-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
            {/* Active range */}
            <div 
              className="absolute h-2 bg-primary-500 rounded-lg"
              style={{
                left: `calc(0.5rem + (100% - 1rem) * ${minRatio})`,
                width: `calc((100% - 1rem) * ${maxRatio - minRatio})`,
              }}
            ></div>
            {/* Min range slider */}
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[0]}
              onChange={(e) =>
                onPriceRangeChange([
                  Number(e.target.value),
                  Math.max(Number(e.target.value), priceRange[1]),
                ])
              }
              className="absolute left-2 right-2 appearance-none bg-transparent pointer-events-none
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                       [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500
                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md 
                       [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto
                       [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-white 
                       [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-500
                       [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md 
                       [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto"
              style={{ zIndex: priceRange[0] > maxPrice - (maxPrice - minPrice) / 4 ? 5 : 3 }}
            />
            {/* Max range slider */}
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) =>
                onPriceRangeChange([
                  Math.min(priceRange[0], Number(e.target.value)),
                  Number(e.target.value),
                ])
              }
              className="absolute left-2 right-2 appearance-none bg-transparent pointer-events-none
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                       [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500
                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md 
                       [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto
                       [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-white 
                       [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-500
                       [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md 
                       [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto"
              style={{ zIndex: 4 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}