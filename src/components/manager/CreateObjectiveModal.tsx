import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Employee } from '../../types';
import { 
  FlagIcon, 
  UserIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface CreateObjectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamMembers: Employee[];
  onCreateObjective: (objectiveData: any) => void;
}

const CreateObjectiveModal: React.FC<CreateObjectiveModalProps> = ({ 
  isOpen, 
  onClose, 
  teamMembers,
  onCreateObjective 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    employeeId: '',
    category: 'project',
    priority: 'medium',
    dueDate: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const categories = [
    { id: 'project', name: 'Projet', color: 'bg-blue-100 text-blue-800' },
    { id: 'performance', name: 'Performance', color: 'bg-green-100 text-green-800' },
    { id: 'development', name: 'Développement', color: 'bg-purple-100 text-purple-800' },
    { id: 'behavioral', name: 'Comportemental', color: 'bg-orange-100 text-orange-800' }
  ];

  const priorities = [
    { id: 'low', name: 'Faible', color: 'bg-gray-100 text-gray-800' },
    { id: 'medium', name: 'Moyenne', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'high', name: 'Élevée', color: 'bg-red-100 text-red-800' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: {[key: string]: string} = {};
    if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.employeeId) newErrors.employeeId = 'Veuillez sélectionner un employé';
    if (!formData.dueDate) newErrors.dueDate = 'La date d\'échéance est requise';

    // Vérifier que la date d'échéance est dans le futur
    if (formData.dueDate && new Date(formData.dueDate) <= new Date()) {
      newErrors.dueDate = 'La date d\'échéance doit être dans le futur';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedEmployee = teamMembers.find(member => member.id === formData.employeeId);
    
    const objectiveData = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      employeeId: formData.employeeId,
      employeeName: selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : '',
      category: formData.category,
      priority: formData.priority,
      status: 'not_started',
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      progress: 0,
      managerId: 'current-manager',
      managerName: 'Manager Actuel'
    };

    onCreateObjective(objectiveData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      employeeId: '',
      category: 'project',
      priority: 'medium',
      dueDate: '',
      startDate: new Date().toISOString().split('T')[0]
    });
    setErrors({});
    onClose();
  };

  const objectiveTemplates = [
    {
      title: 'Améliorer les performances',
      description: 'Augmenter la productivité et la qualité du travail',
      category: 'performance'
    },
    {
      title: 'Développer de nouvelles compétences',
      description: 'Acquérir des compétences techniques ou comportementales',
      category: 'development'
    },
    {
      title: 'Finaliser le projet',
      description: 'Mener à bien le projet dans les délais impartis',
      category: 'project'
    },
    {
      title: 'Améliorer la collaboration',
      description: 'Renforcer le travail d\'équipe et la communication',
      category: 'behavioral'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Créer un nouvel objectif" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sélection employé */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <UserIcon className="h-4 w-4 inline mr-1" />
            Assigné à *
          </label>
          <select
            value={formData.employeeId}
            onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
            className={`input-field ${errors.employeeId ? 'border-red-500' : ''}`}
          >
            <option value="">Sélectionner un employé</option>
            {teamMembers.map(member => (
              <option key={member.id} value={member.id}>
                {member.firstName} {member.lastName} - {member.position}
              </option>
            ))}
          </select>
          {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>}
        </div>

        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FlagIcon className="h-4 w-4 inline mr-1" />
            Titre de l'objectif *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Ex: Développer le module de facturation"
            className={`input-field ${errors.title ? 'border-red-500' : ''}`}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description détaillée *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Décrivez l'objectif en détail..."
            rows={4}
            className={`input-field ${errors.description ? 'border-red-500' : ''}`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Catégorie et Priorité */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="input-field"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priorité
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              className="input-field"
            >
              {priorities.map(priority => (
                <option key={priority.id} value={priority.id}>
                  {priority.name}
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
              Date de début
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="h-4 w-4 inline mr-1" />
              Date d'échéance *
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              className={`input-field ${errors.dueDate ? 'border-red-500' : ''}`}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
          </div>
        </div>

        {/* Templates d'objectifs */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h5 className="text-sm font-medium text-gray-900 mb-3">Modèles d'objectifs :</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {objectiveTemplates.map((template, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setFormData({
                  ...formData, 
                  title: template.title,
                  description: template.description,
                  category: template.category
                })}
                className="text-left p-3 hover:bg-gray-100 rounded border text-sm"
              >
                <div className="font-medium text-gray-900">{template.title}</div>
                <div className="text-gray-600 text-xs mt-1">{template.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="btn-secondary"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Créer l'objectif
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateObjectiveModal;
