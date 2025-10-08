'use client';

import { useEffect, useRef, useState } from 'react';
import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from '@/hooks/useTranslation';
import type { Step } from '@/types';

interface SwipeNavigationProps {
  children: React.ReactNode;
}

const stepOrder: Step[] = ['food', 'drinks', 'review', 'payment'];

export function SwipeNavigation({ children }: SwipeNavigationProps) {
  const { currentStep, navigateToStep, cart, showToast } = useKiosk();
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [swipeStartTime, setSwipeStartTime] = useState<number>(0);

  // Minimum swipe distance (in px) to trigger navigation
  const minSwipeDistance = 50;
  // Velocity threshold (px/ms) for fast swipes - allows shorter distance swipes
  const minSwipeVelocity = 0.3;
  // Guaranteed swipe distance - ANY swipe over this ALWAYS works
  const guaranteedSwipeDistance = 50;

  const currentIndex = stepOrder.indexOf(currentStep);
  const canSwipeLeft = currentIndex < stepOrder.length - 1;
  const canSwipeRight = currentIndex > 0;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setSwipeStartTime(Date.now());
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const currentTouch = e.targetTouches[0].clientX;
    const diff = currentTouch - touchStart;
    
    // Progressive resistance - more natural feel like iOS
    const maxDrag = 200;
    let limitedDiff = diff;
    
    if (diff > 0) {
      if (!canSwipeRight) {
        // Strong progressive resistance when can't swipe right
        const resistance = 1 - Math.min(Math.abs(diff) / 200, 0.8);
        limitedDiff = diff * resistance * 0.4;
      } else {
        // Progressive resistance for valid swipes - feels more natural
        if (Math.abs(diff) > 100) {
          const excess = Math.abs(diff) - 100;
          limitedDiff = 100 + excess * 0.5;
        }
        limitedDiff = Math.min(limitedDiff, maxDrag);
      }
    } else if (diff < 0) {
      if (!canSwipeLeft) {
        // Strong progressive resistance when can't swipe left
        const resistance = 1 - Math.min(Math.abs(diff) / 200, 0.8);
        limitedDiff = diff * resistance * 0.4;
      } else {
        // Progressive resistance for valid swipes
        if (Math.abs(diff) > 100) {
          const excess = Math.abs(diff) - 100;
          limitedDiff = -(100 + excess * 0.5);
        }
        limitedDiff = Math.max(limitedDiff, -maxDrag);
      }
    }
    
    setDragOffset(limitedDiff);
    setTouchEnd(currentTouch);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    const distance = touchStart - touchEnd;
    const swipeDuration = Date.now() - swipeStartTime;
    const velocity = Math.abs(distance) / swipeDuration; // px per ms
    
    // Check if swipe meets distance OR velocity threshold (allows fast flicks)
    // ANY swipe over guaranteedSwipeDistance ALWAYS triggers, regardless of speed
    const isLeftSwipe = 
      Math.abs(distance) >= guaranteedSwipeDistance && distance > 0 || // Guaranteed trigger
      distance > minSwipeDistance || // Normal trigger
      (distance > 20 && velocity > minSwipeVelocity); // Fast flick trigger
      
    const isRightSwipe = 
      Math.abs(distance) >= guaranteedSwipeDistance && distance < 0 || // Guaranteed trigger
      distance < -minSwipeDistance || // Normal trigger
      (distance < -20 && velocity > minSwipeVelocity); // Fast flick trigger

    if (isRightSwipe && canSwipeRight) {
      // Swipe right - go to previous page
      setIsTransitioning(true);
      setTimeout(() => {
        navigateToStep(stepOrder[currentIndex - 1]);
        setIsTransitioning(false);
      }, 250);
    } else if (isLeftSwipe && canSwipeLeft) {
      const nextStep = stepOrder[currentIndex + 1];
      
      // Check if trying to navigate to review/payment with empty cart
      if ((nextStep === 'review' || nextStep === 'payment') && cart.length === 0) {
        showToast(t('cart_empty_warning'), 'warning');
        setTouchStart(null);
        setTouchEnd(null);
        setIsDragging(false);
        setDragOffset(0);
        return;
      }
      
      // Swipe left - go to next page
      setIsTransitioning(true);
      setTimeout(() => {
        navigateToStep(nextStep);
        setIsTransitioning(false);
      }, 250);
    }

    // Reset with smooth bounce-back animation
    setTouchStart(null);
    setTouchEnd(null);
    setIsDragging(false);
    setDragOffset(0);
  };

  // Mouse events for desktop testing
  const onMouseDown = (e: React.MouseEvent) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
    setSwipeStartTime(Date.now());
    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (touchStart === null || !isDragging) return;
    
    const diff = e.clientX - touchStart;
    
    // Progressive resistance - same as touch
    const maxDrag = 200;
    let limitedDiff = diff;
    
    if (diff > 0) {
      if (!canSwipeRight) {
        const resistance = 1 - Math.min(Math.abs(diff) / 200, 0.8);
        limitedDiff = diff * resistance * 0.4;
      } else {
        if (Math.abs(diff) > 100) {
          const excess = Math.abs(diff) - 100;
          limitedDiff = 100 + excess * 0.5;
        }
        limitedDiff = Math.min(limitedDiff, maxDrag);
      }
    } else if (diff < 0) {
      if (!canSwipeLeft) {
        const resistance = 1 - Math.min(Math.abs(diff) / 200, 0.8);
        limitedDiff = diff * resistance * 0.4;
      } else {
        if (Math.abs(diff) > 100) {
          const excess = Math.abs(diff) - 100;
          limitedDiff = -(100 + excess * 0.5);
        }
        limitedDiff = Math.max(limitedDiff, -maxDrag);
      }
    }
    
    setDragOffset(limitedDiff);
    setTouchEnd(e.clientX);
  };

  const onMouseUp = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    const distance = touchStart - touchEnd;
    const swipeDuration = Date.now() - swipeStartTime;
    const velocity = Math.abs(distance) / swipeDuration;
    
    // ANY swipe over guaranteedSwipeDistance ALWAYS triggers, regardless of speed
    const isLeftSwipe = 
      Math.abs(distance) >= guaranteedSwipeDistance && distance > 0 || // Guaranteed trigger
      distance > minSwipeDistance || // Normal trigger
      (distance > 20 && velocity > minSwipeVelocity); // Fast flick trigger
      
    const isRightSwipe = 
      Math.abs(distance) >= guaranteedSwipeDistance && distance < 0 || // Guaranteed trigger
      distance < -minSwipeDistance || // Normal trigger
      (distance < -20 && velocity > minSwipeVelocity); // Fast flick trigger

    if (isRightSwipe && canSwipeRight) {
      setIsTransitioning(true);
      setTimeout(() => {
        navigateToStep(stepOrder[currentIndex - 1]);
        setIsTransitioning(false);
      }, 250);
    } else if (isLeftSwipe && canSwipeLeft) {
      const nextStep = stepOrder[currentIndex + 1];
      
      // Check if trying to navigate to review/payment with empty cart
      if ((nextStep === 'review' || nextStep === 'payment') && cart.length === 0) {
        showToast(t('cart_empty_warning'), 'warning');
        setTouchStart(null);
        setTouchEnd(null);
        setIsDragging(false);
        setDragOffset(0);
        return;
      }
      
      setIsTransitioning(true);
      setTimeout(() => {
        navigateToStep(nextStep);
        setIsTransitioning(false);
      }, 250);
    }

    setTouchStart(null);
    setTouchEnd(null);
    setIsDragging(false);
    setDragOffset(0);
  };

  const onMouseLeave = () => {
    if (isDragging) {
      setTouchStart(null);
      setTouchEnd(null);
      setIsDragging(false);
      setDragOffset(0);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative touch-pan-y select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
    >
      {/* Content with drag effect - smoother animations */}
      <div
        style={{
          transform: `translateX(${dragOffset}px)`,
          transition: isDragging 
            ? 'none' 
            : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Smoother easing
          opacity: isTransitioning ? 0.8 : 1,
        }}
      >
        {children}
      </div>

      {/* Swipe indicator overlay - improved visibility and feedback */}
      {isDragging && Math.abs(dragOffset) > 10 && (
        <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-between px-4 sm:px-8">
          {/* Left arrow - shown when dragging right */}
          {dragOffset > 10 && canSwipeRight && (
            <div 
              className="bg-gradient-to-r from-blue-500/40 to-blue-600/30 backdrop-blur-lg rounded-full p-6 sm:p-8 shadow-2xl border-2 border-blue-400/50 transition-all duration-200"
              style={{
                opacity: Math.min(Math.abs(dragOffset) / 60, 1),
                transform: `scale(${0.7 + Math.min(Math.abs(dragOffset) / 150, 0.4)})`,
              }}
            >
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 text-white drop-shadow-2xl"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
          )}

          {/* Right arrow - shown when dragging left */}
          {dragOffset < -10 && canSwipeLeft && (
            <div 
              className="ml-auto bg-gradient-to-l from-blue-500/40 to-blue-600/30 backdrop-blur-lg rounded-full p-6 sm:p-8 shadow-2xl border-2 border-blue-400/50 transition-all duration-200"
              style={{
                opacity: Math.min(Math.abs(dragOffset) / 60, 1),
                transform: `scale(${0.7 + Math.min(Math.abs(dragOffset) / 150, 0.4)})`,
              }}
            >
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 text-white drop-shadow-2xl"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Hint arrows - subtle indicators when not dragging */}
      {!isDragging && (
        <div className="fixed inset-0 pointer-events-none z-20 flex items-center justify-between px-4 opacity-20 dark:opacity-10">
          {canSwipeRight && (
            <div className="animate-pulse">
              <svg
                className="w-8 h-8 text-gray-400 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
          )}
          {canSwipeLeft && (
            <div className="ml-auto animate-pulse">
              <svg
                className="w-8 h-8 text-gray-400 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  );
}