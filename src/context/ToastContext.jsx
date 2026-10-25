import { createContext, useCallback, useContext, useState } from 'react';
import { FiCheckCircle, FiAlertCircle, FiXCircle, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

const toastStyles = {
  success: { icon: FiCheckCircle, classes: 'border-nour-sage bg-nour-sage-light text-nour-teal-dark' },
  error: { icon: FiXCircle, classes: 'border-nour-terracotta bg-nour-terracotta-light text-nour-terracotta' },
  info: { icon: FiAlertCircle, classes: 'border-nour-teal bg-nour-teal-light text-nour-teal-dark' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (message, type = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[70] flex w-80 flex-col gap-2">
        {toasts.map((toast) => {
          const { icon: Icon, classes } = toastStyles[toast.type] || toastStyles.info;
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 rounded-soft border-2 px-4 py-3 shadow-doodle-lg animate-fade-up ${classes}`}
            >
              <Icon size={20} className="mt-0.5 shrink-0" />
              <p className="flex-1 text-sm font-medium">{toast.message}</p>
              <button onClick={() => dismiss(toast.id)} aria-label="Fermer" className="opacity-50 hover:opacity-100">
                <FiX size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast doit être utilisé dans un ToastProvider');
  return context;
};
