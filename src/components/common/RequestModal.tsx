import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  AcademicCapIcon,
  PaperAirplaneIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RequestData) => void;
  type: 'training' | 'objective';
}

interface RequestData {
  title: string;
  category: string;
  description: string;
  justification?: string;
  dueDate?: string;
}

const RequestModal: React.FC<RequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type
}) => {
  const [formData, setFormData] = useState<RequestData>({
    title: '',
    category: '',
    description: '',
    justification: '',
    dueDate: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const trainingCategories = [
    'Développement',
    'Management',
    'Sécurité',
    'Soft Skills',
    'Design',
    'Marketing',
    'Finance',
    'Autre'
  ];

  const objectiveCategories = [
    'development',
    'performance',
    'project',
    'behavioral'
  ];

  const getCategoryLabel = (category: string, isTraining: boolean) => {
    if (isTraining) return category;
    
    const objectiveLabels: Record<string, string> = {
      'development': 'Développement',
      'performance': 'Performance',
      'project': 'Projet',
      'behavioral': 'Comportemental'
    };
    
    return objectiveLabels[category] || category;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (type === 'training' && !formData.justification?.trim()) {
      newErrors.justification = 'La justification est requise';
    }

    if (type === 'objective' && !formData.dueDate) {
      newErrors.dueDate = 'La date d\'échéance est requise';
    }

    if (type === 'objective' && formData.dueDate && new Date(formData.dueDate) <= new Date()) {
      newErrors.dueDate = 'La date d\'échéance doit être dans le futur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('RequestModal - handleSubmit appelé', { formData, type });
    
    if (!validateForm()) {
      console.log('RequestModal - Validation échouée', errors);
      return;
    }

    console.log('RequestModal - Validation réussie, appel onSubmit');
    onSubmit(formData);
    
    // Reset form
    setFormData({
      title: '',
      category: '',
      description: '',
      justification: '',
      dueDate: ''
    });
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    console.log('RequestModal - handleClose appelé');
    setFormData({
      title: '',
      category: '',
      description: '',
      justification: '',
      dueDate: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const isTraining = type === 'training';
  const categories = isTraining ? trainingCategories : objectiveCategories;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white flex items-center">
                  <AcademicCapIcon className="h-6 w-6 mr-2" />
                  {isTraining ? 'Demander une formation' : 'Proposer un objectif'}
                </h3>
                <button
                  onClick={handleClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white px-6 py-6">
              <div className="space-y-4">
                {/* Titre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isTraining ? 'Titre de la formation' : 'Titre de l\'objectif'} *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                    placeholder={isTraining ? 'Ex: Formation React Avancé' : 'Ex: Améliorer les performances'}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className={`input-field ${errors.category ? 'border-red-500' : ''}`}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {getCategoryLabel(category, isTraining)}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description détaillée *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                    placeholder={isTraining 
                      ? 'Décrivez les compétences que vous souhaitez acquérir...'
                      : 'Décrivez l\'objectif en détail...'
                    }
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Justification (pour formations) */}
                {isTraining && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Justification *
                    </label>
                    <textarea
                      value={formData.justification}
                      onChange={(e) => setFormData(prev => ({ ...prev, justification: e.target.value }))}
                      rows={2}
                      className={`input-field ${errors.justification ? 'border-red-500' : ''}`}
                      placeholder="Expliquez pourquoi cette formation est importante pour votre poste..."
                    />
                    {errors.justification && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.justification}
                      </p>
                    )}
                  </div>
                )}

                {/* Date d'échéance (pour objectifs) */}
                {!isTraining && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date d'échéance souhaitée *
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className={`input-field ${errors.dueDate ? 'border-red-500' : ''}`}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.dueDate && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.dueDate}
                      </p>
                    )}
                  </div>
                )}

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <ExclamationCircleIcon className="h-4 w-4 inline mr-1" />
                    {isTraining 
                      ? 'Votre demande sera examinée par les RH et vous recevrez une réponse sous 48h.'
                      : 'Votre proposition sera examinée par votre manager et vous recevrez une réponse sous 24h.'
                    }
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center"
                >
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  Envoyer la demande
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default RequestModal;
