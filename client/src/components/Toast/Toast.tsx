import React from 'react';
import { useToast, ToastType } from '../../context/ToastContext';
import styles from './Toast.module.css';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'danger':
        return '⚠️';
      case 'warning':
        return '🔔';
      default:
        return 'ℹ️';
    }
  };

  return (
    <aside className={styles.toastContainer} aria-live="polite" aria-label="Notification banners">
      {toasts.map(toast => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`} role="status">
          <span className={styles.icon} aria-hidden="true">
            {getIcon(toast.type)}
          </span>
          <span className={styles.message}>{toast.message}</span>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </aside>
  );
};
