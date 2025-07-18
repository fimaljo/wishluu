'use client';

import { useState, useEffect } from 'react';

export type NotificationType = 'success' | 'info' | 'error' | 'warning';

export interface NotificationProps {
  message: string;
  type: NotificationType;
  duration?: number; // Auto-hide duration in milliseconds, 0 for no auto-hide
  onClose?: () => void;
}

export function Notification({
  message,
  type,
  duration = 4000,
  onClose,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // Wait for animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300); // Wait for animation to complete
  };

  if (!isVisible) return null;

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
          icon: '🎉',
          title: 'Success!',
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-red-600',
          icon: '❌',
          title: 'Error',
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-yellow-500 to-orange-600',
          icon: '⚠️',
          title: 'Warning',
        };
      case 'info':
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
          icon: '💡',
          title: 'Info',
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-300 ${styles.bg} text-white`}
    >
      <div className='flex items-center space-x-2'>
        <div className='text-2xl'>{styles.icon}</div>
        <div>
          <div className='font-semibold'>{styles.title}</div>
          <div className='text-sm opacity-90'>{message}</div>
        </div>
        <button
          onClick={handleClose}
          className='ml-4 text-white hover:text-gray-200 transition-colors'
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// Hook for managing notifications
export function useNotification() {
  const [notification, setNotification] = useState<NotificationProps | null>(
    null
  );

  const showNotification = (props: Omit<NotificationProps, 'onClose'>) => {
    setNotification({
      ...props,
      onClose: () => setNotification(null),
    });
  };

  const showSuccess = (message: string, duration?: number) => {
    showNotification({
      message,
      type: 'success',
      ...(duration !== undefined && { duration }),
    });
  };

  const showError = (message: string, duration?: number) => {
    showNotification({
      message,
      type: 'error',
      ...(duration !== undefined && { duration }),
    });
  };

  const showInfo = (message: string, duration?: number) => {
    showNotification({
      message,
      type: 'info',
      ...(duration !== undefined && { duration }),
    });
  };

  const showWarning = (message: string, duration?: number) => {
    showNotification({
      message,
      type: 'warning',
      ...(duration !== undefined && { duration }),
    });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return {
    notification,
    showNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    hideNotification,
  };
}
