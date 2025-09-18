import React from 'react';
import Modal from './Modal';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export type NotificationType = 'success' | 'warning' | 'info' | 'error';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: NotificationType;
  title: string;
  message: string;
  confirmText?: string;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ 
  isOpen, 
  onClose, 
  type, 
  title, 
  message,
  confirmText = 'OK'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-12 w-12 text-green-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-12 w-12 text-yellow-600" />;
      case 'error':
        return <XCircleIcon className="h-12 w-12 text-red-600" />;
      default:
        return <InformationCircleIcon className="h-12 w-12 text-blue-600" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          button: 'btn-primary bg-green-600 hover:bg-green-700'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          button: 'btn-primary bg-yellow-600 hover:bg-yellow-700'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          button: 'btn-primary bg-red-600 hover:bg-red-700'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          button: 'btn-primary'
        };
    }
  };

  const colors = getColors();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="text-center">
        <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${colors.bg} ${colors.border} border-2 mb-4`}>
          {getIcon()}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {title}
        </h3>
        
        <div className="text-gray-600 mb-6 whitespace-pre-line">
          {message}
        </div>
        
        <button
          onClick={onClose}
          className={`${colors.button} w-full`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default NotificationModal;
