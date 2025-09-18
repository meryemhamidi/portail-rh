import { useState } from 'react';
import { InputType } from '../components/common/InputModal';

interface InputModalState {
  isOpen: boolean;
  title: string;
  label: string;
  placeholder: string;
  defaultValue: string;
  inputType: InputType;
  options: { value: string; label: string }[];
  validation?: (value: string) => string | null;
  icon: 'edit' | 'user' | 'document' | 'calendar';
  onSubmit: (value: string) => void;
}

export const useInputModal = () => {
  const [modalState, setModalState] = useState<InputModalState>({
    isOpen: false,
    title: '',
    label: '',
    placeholder: '',
    defaultValue: '',
    inputType: 'text',
    options: [],
    icon: 'edit',
    onSubmit: () => {}
  });

  const showInputModal = (config: {
    title: string;
    label: string;
    placeholder?: string;
    defaultValue?: string;
    inputType?: InputType;
    options?: { value: string; label: string }[];
    validation?: (value: string) => string | null;
    icon?: 'edit' | 'user' | 'document' | 'calendar';
    onSubmit: (value: string) => void;
  }) => {
    setModalState({
      isOpen: true,
      title: config.title,
      label: config.label,
      placeholder: config.placeholder || '',
      defaultValue: config.defaultValue || '',
      inputType: config.inputType || 'text',
      options: config.options || [],
      validation: config.validation,
      icon: config.icon || 'edit',
      onSubmit: config.onSubmit
    });
  };

  const hideInputModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  // Méthodes de convenance pour différents types de saisie
  const showTextInput = (title: string, label: string, onSubmit: (value: string) => void, options?: {
    placeholder?: string;
    defaultValue?: string;
    validation?: (value: string) => string | null;
  }) => {
    showInputModal({
      title,
      label,
      placeholder: options?.placeholder,
      defaultValue: options?.defaultValue,
      validation: options?.validation,
      inputType: 'text',
      icon: 'edit',
      onSubmit
    });
  };

  const showNumberInput = (title: string, label: string, onSubmit: (value: string) => void, options?: {
    placeholder?: string;
    defaultValue?: string;
    validation?: (value: string) => string | null;
  }) => {
    showInputModal({
      title,
      label,
      placeholder: options?.placeholder,
      defaultValue: options?.defaultValue,
      validation: options?.validation,
      inputType: 'number',
      icon: 'edit',
      onSubmit
    });
  };

  const showSelectInput = (title: string, label: string, options: { value: string; label: string }[], onSubmit: (value: string) => void, config?: {
    defaultValue?: string;
    validation?: (value: string) => string | null;
  }) => {
    showInputModal({
      title,
      label,
      defaultValue: config?.defaultValue,
      validation: config?.validation,
      inputType: 'select',
      options,
      icon: 'edit',
      onSubmit
    });
  };

  const showTextareaInput = (title: string, label: string, onSubmit: (value: string) => void, options?: {
    placeholder?: string;
    defaultValue?: string;
    validation?: (value: string) => string | null;
  }) => {
    showInputModal({
      title,
      label,
      placeholder: options?.placeholder,
      defaultValue: options?.defaultValue,
      validation: options?.validation,
      inputType: 'textarea',
      icon: 'document',
      onSubmit
    });
  };

  return {
    modalState,
    showInputModal,
    hideInputModal,
    showTextInput,
    showNumberInput,
    showSelectInput,
    showTextareaInput
  };
};
