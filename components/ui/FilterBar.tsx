'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { SlidersHorizontal } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

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

  // Calculate clamped positions for the active range bar
  const minRatio = Math.max(0, Math.min(1, (priceRange[0] - minPrice) / (maxPrice - minPrice)));
  const maxRatio = Math.max(0, Math.min(1, (priceRange[1] - minPrice) / (maxPrice - minPrice)));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      {/* Category Filters */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          {t('filter_by_category')}
        </h3>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              {t(category)}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-gray-800">
            {t('filter_by_price')}
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-primary-600">{formatPrice(priceRange[0])}</span>
            <span className="text-gray-400">-</span>
            <span className="font-semibold text-primary-600">{formatPrice(priceRange[1])}</span>
          </div>
        </div>
        <div className="relative h-8 flex items-center px-3">
          {/* Background track */}
          <div className="absolute left-3 right-3 h-2 bg-gray-200 rounded-lg"></div>
          {/* Active range */}
          <div 
            className="absolute h-2 bg-primary-500 rounded-lg"
            style={{
              left: `calc(0.75rem + (100% - 1.5rem) * ${minRatio})`,
              width: `calc((100% - 1.5rem) * ${maxRatio - minRatio})`,
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
            className="absolute left-3 right-3 appearance-none bg-transparent pointer-events-none
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                     [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500
                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md 
                     [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto
                     [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white 
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
            className="absolute left-3 right-3 appearance-none bg-transparent pointer-events-none
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                     [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500
                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md 
                     [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto
                     [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white 
                     [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-500
                     [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md 
                     [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto"
            style={{ zIndex: 4 }}
          />
        </div>
      </div>
    </div>
  );
}