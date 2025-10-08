'use client';

import { useEffect } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-6 h-6 text-green-500" />,
    error: <AlertCircle className="w-6 h-6 text-red-500" />,
    warning: <AlertCircle className="w-6 h-6 text-orange-500" />,
    info: <AlertCircle className="w-6 h-6 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    warning: 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800',
    info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
  };

  return (
    <div
      className={`
        fixed top-20 left-1/2 -translate-x-1/2 z-[9999]
        flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border-2
        ${bgColors[type]}
        animate-slide-down
        max-w-md w-auto
      `}
      style={{
        // Ensure toast stays fixed and isolated from page transforms
        position: 'fixed',
        isolation: 'isolate',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        transform: 'translate(-50%, 0)',
      }}
      role="alert"
    >
      {icons[type]}
      <p className="text-base font-semibold text-gray-800 dark:text-white flex-1">
        {message}
      </p>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}