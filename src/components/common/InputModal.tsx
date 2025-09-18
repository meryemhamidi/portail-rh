import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { 
  PencilIcon,
  UserIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export type InputType = 'text' | 'number' | 'email' | 'textarea' | 'select';

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  inputType?: InputType;
  options?: { value: string; label: string }[];
  validation?: (value: string) => string | null;
  icon?: 'edit' | 'user' | 'document' | 'calendar';
}

const InputModal: React.FC<InputModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  label, 
  placeholder = '',
  defaultValue = '',
  inputType = 'text',
  options = [],
  validation,
  icon = 'edit'
}) => {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
      setError(null);
    }
  }, [isOpen, defaultValue]);

  const getIcon = () => {
    switch (icon) {
      case 'user':
        return <UserIcon className="h-6 w-6 text-teal-600" />;
      case 'document':
        return <DocumentTextIcon className="h-6 w-6 text-teal-600" />;
      case 'calendar':
        return <CalendarIcon className="h-6 w-6 text-teal-600" />;
      default:
        return <PencilIcon className="h-6 w-6 text-teal-600" />;
    }
  };

  const handleSubmit = () => {
    if (validation) {
      const validationError = validation(value);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    
    if (value.trim() === '' && inputType !== 'number') {
      setError('Ce champ est requis');
      return;
    }

    onSubmit(value);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputType !== 'textarea') {
      handleSubmit();
    }
  };

  const renderInput = () => {
    const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent";
    
    switch (inputType) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className={`${baseClasses} h-24 resize-none`}
            autoFocus
          />
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={baseClasses}
            autoFocus
          >
            <option value="">Sélectionner...</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className={baseClasses}
            onKeyPress={handleKeyPress}
            autoFocus
          />
        );
      default:
        return (
          <input
            type={inputType}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className={baseClasses}
            onKeyPress={handleKeyPress}
            autoFocus
          />
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="text-center mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-teal-100 mb-4">
          {getIcon()}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
          {renderInput()}
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Confirmer
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InputModal;
