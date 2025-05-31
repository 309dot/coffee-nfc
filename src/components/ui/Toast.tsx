import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-black/80 text-white px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm">
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}

// Toast hook for easier usage
export function useToast() {
  const [toast, setToast] = useState({
    message: '',
    isVisible: false,
  });

  const showToast = (message: string) => {
    setToast({
      message,
      isVisible: true,
    });
  };

  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      isVisible: false,
    }));
  };

  return {
    toast,
    showToast,
    hideToast,
  };
} 