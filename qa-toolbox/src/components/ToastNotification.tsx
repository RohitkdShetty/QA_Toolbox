import React from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { LucideIcon } from './LucideIcon';

export const ToastNotification: React.FC = () => {
  const { toasts, removeToast } = useApp();

  const getToastStyles = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500/30 text-emerald-800 dark:text-emerald-300',
          icon: 'Check',
          iconColor: 'text-emerald-500',
        };
      case 'error':
        return {
          bg: 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-500/30 text-rose-800 dark:text-rose-300',
          icon: 'X',
          iconColor: 'text-rose-500',
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-500/30 text-blue-800 dark:text-blue-300',
          icon: 'Info',
          iconColor: 'text-blue-500',
        };
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border backdrop-blur-md shadow-lg ${styles.bg}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg bg-white/40 dark:bg-black/20 ${styles.iconColor}`}>
                  <LucideIcon name={styles.icon} size={16} />
                </div>
                <span className="text-sm font-medium">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition"
              >
                <LucideIcon name="X" size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
