import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  CalendarIcon,
  UserIcon,
  FlagIcon,
  ChartBarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Objective, Employee } from '../../types';

interface EditObjectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  objective: Objective | null;
  teamMembers: Employee[];
  onUpdateObjective: (updatedObjective: Objective) => void;
}

const EditObjectiveModal: React.FC<EditObjectiveModalProps> = ({
  isOpen,
  onClose,
  objective,
  teamMembers,
  onUpdateObjective
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    employeeId: '',
    category: 'development',
    priority: 'medium',
    status: 'not_started',
    startDate: '',
    dueDate: '',
    progress: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (objective) {
      setFormData({
        title: objective.title,
        description: objective.description,
        employeeId: objective.employeeId,
        category: objective.category,
        priority: objective.priority,
        status: objective.status,
        startDate: objective.startDate,
        dueDate: objective.dueDate,
        progress: objective.progress
      });
    }
  }, [objective]);

  const categories = [
    { value: 'development', label: 'Développement' },
    { value: 'performance', label: 'Performance' },
    { value: 'project', label: 'Projet' },
    { value: 'behavioral', label: 'Comportemental' }
  ];

  const priorities = [
    { value: 'low', label: 'Faible', color: 'text-gray-600' },
    { value: 'medium', label: 'Moyenne', color: 'text-yellow-600' },
    { value: 'high', label: 'Élevée', color: 'text-red-600' }
  ];

  const statuses = [
    { value: 'not_started', label: 'Non démarré', color: 'text-gray-600' },
    { value: 'in_progress', label: 'En cours', color: 'text-blue-600' },
    { value: 'completed', label: 'Terminé', color: 'text-green-600' },
    { value: 'overdue', label: 'En retard', color: 'text-red-600' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.employeeId) {
      newErrors.employeeId = 'Un employé doit être assigné';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La date de début est requise';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'La date d\'échéance est requise';
    }

    if (formData.startDate && formData.dueDate && new Date(formData.startDate) >= new Date(formData.dueDate)) {
      newErrors.dueDate = 'La date d\'échéance doit être après la date de début';
    }

    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = 'La progression doit être entre 0 et 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !objective) return;

    const selectedEmployee = teamMembers.find(emp => emp.id === formData.employeeId);
    
    const updatedObjective: Objective = {
      ...objective,
      title: formData.title,
      description: formData.description,
      employeeId: formData.employeeId,
      employeeName: selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : objective.employeeName,
      category: formData.category as 'performance' | 'development' | 'project' | 'behavioral',
      priority: formData.priority as 'low' | 'medium' | 'high',
      status: formData.status as 'not_started' | 'in_progress' | 'completed' | 'overdue',
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      progress: formData.progress,
      completedDate: formData.status === 'completed' && formData.progress === 100 ? new Date().toISOString() : undefined
    };

    onUpdateObjective(updatedObjective);
    onClose();
  };

  const handleProgressChange = (newProgress: number) => {
    setFormData(prev => ({
      ...prev,
      progress: newProgress,
      status: newProgress === 100 ? 'completed' : newProgress > 0 ? 'in_progress' : 'not_started'
    }));
  };

  if (!isOpen || !objective) return null;

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
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
          >
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <FlagIcon className="h-6 w-6 text-teal-600 mr-2" />
                  Modifier l'objectif
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white px-6 py-6">
              <div className="space-y-6">
                {/* Titre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de l'objectif *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                    placeholder="Ex: Améliorer les performances de l'application"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Décrivez l'objectif en détail..."
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Assignation et Catégorie */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <UserIcon className="h-4 w-4 inline mr-1" />
                      Assigné à *
                    </label>
                    <select
                      value={formData.employeeId}
                      onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                      className={`input-field ${errors.employeeId ? 'border-red-500' : ''}`}
                    >
                      <option value="">Sélectionner un employé</option>
                      {teamMembers.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.firstName} {member.lastName} - {member.position}
                        </option>
                      ))}
                    </select>
                    {errors.employeeId && <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="input-field"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Priorité et Statut */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priorité
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                      className="input-field"
                    >
                      {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="input-field"
                    >
                      {statuses.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CalendarIcon className="h-4 w-4 inline mr-1" />
                      Date de début *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className={`input-field ${errors.startDate ? 'border-red-500' : ''}`}
                    />
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CalendarIcon className="h-4 w-4 inline mr-1" />
                      Date d'échéance *
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className={`input-field ${errors.dueDate ? 'border-red-500' : ''}`}
                    />
                    {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
                  </div>
                </div>

                {/* Progression */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ChartBarIcon className="h-4 w-4 inline mr-1" />
                    Progression: {formData.progress}%
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={formData.progress}
                      onChange={(e) => handleProgressChange(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          formData.progress === 100 ? 'bg-green-500' :
                          formData.progress >= 75 ? 'bg-blue-500' :
                          formData.progress >= 50 ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${formData.progress}%` }}
                      />
                    </div>
                  </div>
                  {errors.progress && <p className="text-red-500 text-sm mt-1">{errors.progress}</p>}
                </div>

                {/* Statut automatique */}
                {formData.progress === 100 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm text-green-800">
                        L'objectif sera automatiquement marqué comme terminé
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Mettre à jour
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default EditObjectiveModal;
