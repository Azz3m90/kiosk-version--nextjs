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

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden">
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
    </div>
  );
}