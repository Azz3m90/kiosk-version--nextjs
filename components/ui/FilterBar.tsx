'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { useKiosk } from '@/context/KioskContext';
import { SlidersHorizontal, LayoutGrid, List, DollarSign } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';
import { clsx } from 'clsx';
import type { GridColumns } from '@/types';

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
  const { viewMode, toggleViewMode, gridColumns, setGridColumns } = useKiosk();
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const columnOptions: GridColumns[] = [2, 3, 4, 5];

  const handleColumnSelect = (col: GridColumns) => {
    setGridColumns(col);
    setShowColumnSelector(false);
  };

  // Calculate clamped positions for the active range bar
  const minRatio = Math.max(0, Math.min(1, (priceRange[0] - minPrice) / (maxPrice - minPrice)));
  const maxRatio = Math.max(0, Math.min(1, (priceRange[1] - minPrice) / (maxPrice - minPrice)));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-300">
      {/* Ultra-Compact Single Row Filter Bar */}
      <div className="flex items-center gap-2 p-2.5">
        {/* Category Filters - Compact */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          <div className="flex gap-1.5 flex-wrap flex-1 min-w-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={clsx(
                  'px-3 py-1.5 rounded-md font-medium text-sm transition-all min-h-[36px] whitespace-nowrap',
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 active:bg-gray-200 dark:active:bg-gray-600'
                )}
              >
                {t(category)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Divider */}
        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
        
        {/* Compact Price Filter Button */}
        <button
          onClick={() => setShowPriceFilter(!showPriceFilter)}
          className={clsx(
            'px-2.5 py-1.5 rounded-md text-xs transition-all min-h-[36px] min-w-[36px] flex items-center justify-center flex-shrink-0',
            showPriceFilter 
              ? 'bg-primary-500 text-white shadow-sm' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 active:bg-gray-200 dark:active:bg-gray-600'
          )}
          title={`${t('filter_by_price')}: ${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`}
        >
          <DollarSign className="w-4 h-4" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>

        {/* Integrated View Toggle - Ultra Compact */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Grid Button with Column Selector Popup */}
          <div className="relative">
            <button
              onClick={() => {
                if (viewMode === 'list') {
                  toggleViewMode();
                } else {
                  setShowColumnSelector(!showColumnSelector);
                }
              }}
              className={clsx(
                'min-w-[36px] min-h-[36px] w-9 h-9 rounded-md flex items-center justify-center transition-all relative',
                viewMode === 'grid'
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 active:bg-gray-200 dark:active:bg-gray-600'
              )}
              aria-label={t('grid_view')}
              title={viewMode === 'grid' ? 'Select grid columns' : t('grid_view')}
            >
              <LayoutGrid className="w-4 h-4 stroke-[2.5]" />
              {/* Current columns indicator - only visible in grid mode */}
              {viewMode === 'grid' && (
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                  {gridColumns}
                </span>
              )}
            </button>

            {/* Column Selector Popup - Only in grid mode */}
            {viewMode === 'grid' && showColumnSelector && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowColumnSelector(false)}
                />
                
                {/* Popup */}
                <div className="absolute top-full right-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-4 min-w-[280px] animate-fade-in">
                  <div className="mb-3">
                    <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-1">
                      Grid Layout
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Select columns per row
                    </p>
                  </div>
                  
                  {/* Column Options Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {columnOptions.map((col) => (
                      <button
                        key={col}
                        onClick={() => handleColumnSelect(col)}
                        className={clsx(
                          'min-h-[64px] rounded-xl flex flex-col items-center justify-center gap-2 transition-all font-bold border-2',
                          gridColumns === col
                            ? 'bg-primary-500 text-white border-primary-600 shadow-lg scale-105'
                            : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 active:scale-95'
                        )}
                        aria-label={`${col} columns`}
                      >
                        <span className="text-3xl font-bold">{col}</span>
                        <span className="text-xs">
                          {col === 2 ? 'Wide' : col === 3 ? 'Default' : col === 4 ? 'Compact' : 'Dense'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* List Button */}
          <button
            onClick={viewMode === 'grid' ? toggleViewMode : undefined}
            className={clsx(
              'min-w-[36px] min-h-[36px] w-9 h-9 rounded-md flex items-center justify-center transition-all',
              viewMode === 'list'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 active:bg-gray-200 dark:active:bg-gray-600'
            )}
            aria-label={t('list_view')}
            title={t('list_view')}
          >
            <List className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Collapsible Compact Price Range Filter */}
      {showPriceFilter && (
        <div 
          className="bg-gray-50 dark:bg-gray-700 rounded-b-lg px-3 py-2 border-t border-gray-200 dark:border-gray-600 transition-colors duration-300"
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseMove={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              {t('filter_by_price')}
            </span>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-primary-600 dark:text-primary-400">{formatPrice(priceRange[0])}</span>
              <span className="text-gray-400">-</span>
              <span className="font-bold text-primary-600 dark:text-primary-400">{formatPrice(priceRange[1])}</span>
            </div>
          </div>
          <div className="relative h-6 flex items-center px-2">
            {/* Background track */}
            <div className="absolute left-2 right-2 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
            {/* Active range */}
            <div 
              className="absolute h-1.5 bg-primary-500 rounded-full"
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
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseMove={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              className="absolute left-2 right-2 appearance-none bg-transparent pointer-events-none
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
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseMove={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              className="absolute left-2 right-2 appearance-none bg-transparent pointer-events-none
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
      )}
    </div>
  );
}