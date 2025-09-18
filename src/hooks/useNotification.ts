import { useState } from 'react';
import { NotificationType } from '../components/common/NotificationModal';

interface NotificationState {
  isOpen: boolean;
  type: NotificationType;
  title: string;
  message: string;
  confirmText?: string;
}

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    confirmText: 'OK'
  });

  const showNotification = (
    type: NotificationType, 
    title: string, 
    message: string, 
    confirmText = 'OK'
  ) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message,
      confirmText
    });
  };

  const showSuccess = (title: string, message: string, confirmText = 'Parfait !') => {
    showNotification('success', title, message, confirmText);
  };

  const showWarning = (title: string, message: string, confirmText = 'Compris') => {
    showNotification('warning', title, message, confirmText);
  };

  const showError = (title: string, message: string, confirmText = 'OK') => {
    showNotification('error', title, message, confirmText);
  };

  const showInfo = (title: string, message: string, confirmText = 'OK') => {
    showNotification('info', title, message, confirmText);
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  return {
    notification,
    showNotification,
    showSuccess,
    showWarning,
    showError,
    showInfo,
    hideNotification
  };
};
