'use client';

import { useEffect, useState } from 'react';

interface ThemeTransitionProps {
  isTransitioning: boolean;
  theme: 'light' | 'dark';
}

export function ThemeTransition({ isTransitioning, theme }: ThemeTransitionProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isTransitioning) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, 1200); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  if (!show) return null;

  // Light theme: Bright light burst effect
  // Dark theme: Cloud fog sweep effect
  const isLightTheme = theme === 'light';

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden">
      {isLightTheme ? (
        // LIGHT THEME EFFECT - Bright sunburst/flash
        <>
          {/* Central light burst */}
          <div className="light-burst-center" />
          
          {/* Multiple light rays sweeping diagonally */}
          {[0, 1, 2, 3, 4, 5].map((layer) => (
            <div 
              key={layer} 
              className="light-ray-layer" 
              style={{ '--layer': layer } as any}
            />
          ))}
          
          {/* Bright glow layers */}
          <div className="light-glow-layer light-glow-1" />
          <div className="light-glow-layer light-glow-2" />
          <div className="light-glow-layer light-glow-3" />
          
          {/* Sparkle/shimmer overlay */}
          <div className="light-shimmer-overlay" />
        </>
      ) : (
        // DARK THEME EFFECT - Cloud fog sweep
        <>
          {/* Multiple cloud fog layers sweeping diagonally from top-left to bottom-right */}
          {[0, 1, 2, 3, 4, 5].map((layer) => (
            <div 
              key={layer} 
              className="cloud-sweep-layer" 
              style={{ '--layer': layer } as any}
            />
          ))}
          
          {/* Additional fog texture layers for more depth */}
          <div className="fog-texture-layer fog-texture-1" />
          <div className="fog-texture-layer fog-texture-2" />
          <div className="fog-texture-layer fog-texture-3" />
        </>
      )}
    </div>
  );
}