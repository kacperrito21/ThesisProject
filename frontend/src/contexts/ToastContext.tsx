'use client'
import { createContext, useContext, useState } from 'react';
import ToastMessage from '@/components/ToasMessage'

type Toast = { message: string; type: 'success' | 'error' } | null;

const ToastContext = createContext<{
  toast: Toast;
  showToast: (toast: Toast) => void;
}>({
  toast: null,
  showToast: () => {},
});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (toast: Toast) => {
    setToast(toast);
  };

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
      {toast && <ToastMessage message={toast.message} type={toast.type} duration={5000} onClose={() => setToast(null)} />}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
