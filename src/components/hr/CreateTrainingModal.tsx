import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  AcademicCapIcon,
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useNotification } from '../../hooks/useNotification';

interface Training {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  instructor: string;
  location: string;
  requirements: string;
  objectives: string[];
}

interface CreateTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTraining: (training: Omit<Training, 'id'>) => void;
}

const CreateTrainingModal: React.FC<CreateTrainingModalProps> = ({ isOpen, onClose, onCreateTraining }) => {
  const { showSuccess } = useNotification();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technique',
    duration: 8,
    maxParticipants: 20,
    startDate: '',
    endDate: '',
    instructor: '',
    location: 'Salle de formation A',
    requirements: '',
    objectives: ['']
  });

  const categories = [
    'Technique',
    'Management',
    'Communication',
    'Sécurité',
    'Qualité',
    'Langues',
    'Bureautique',
    'Développement personnel'
  ];

  const locations = [
    'Salle de formation A',
    'Salle de formation B',
    'Salle de conférence',
    'En ligne (Teams)',
    'Externe - À définir'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.startDate || !formData.instructor) {
      return;
    }

    const newTraining = {
      ...formData,
      objectives: formData.objectives.filter(obj => obj.trim() !== '')
    };

    onCreateTraining(newTraining);
    showSuccess(
      'Formation créée !',
      `La formation "${formData.title}" a été créée avec succès.`
    );
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Technique',
      duration: 8,
      maxParticipants: 20,
      startDate: '',
      endDate: '',
      instructor: '',
      location: 'Salle de formation A',
      requirements: '',
      objectives: ['']
    });
    onClose();
  };

  const addObjective = () => {
    setFormData({
      ...formData,
      objectives: [...formData.objectives, '']
    });
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData({
      ...formData,
      objectives: newObjectives
    });
  };

  const removeObjective = (index: number) => {
    const newObjectives = formData.objectives.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      objectives: newObjectives.length > 0 ? newObjectives : ['']
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
            >
              {/* Header */}
              <div className="bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <AcademicCapIcon className="h-6 w-6 text-teal-600 mr-2" />
                    Créer une Nouvelle Formation
                  </h3>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="bg-white px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informations de base */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Informations de base</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titre de la formation *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="input-field"
                        placeholder="Ex: Formation React Avancé"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="input-field"
                        rows={3}
                        placeholder="Description détaillée de la formation..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Catégorie
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="input-field"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Durée (heures)
                        </label>
                        <input
                          type="number"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                          className="input-field"
                          min="1"
                          max="40"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max participants
                        </label>
                        <input
                          type="number"
                          value={formData.maxParticipants}
                          onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 0 })}
                          className="input-field"
                          min="1"
                          max="50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Planning et logistique */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Planning et logistique</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date de début *
                        </label>
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date de fin
                        </label>
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          className="input-field"
                          min={formData.startDate}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Formateur *
                      </label>
                      <input
                        type="text"
                        value={formData.instructor}
                        onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                        className="input-field"
                        placeholder="Nom du formateur"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lieu
                      </label>
                      <select
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="input-field"
                      >
                        {locations.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prérequis
                      </label>
                      <textarea
                        value={formData.requirements}
                        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                        className="input-field"
                        rows={2}
                        placeholder="Connaissances ou expérience requises..."
                      />
                    </div>
                  </div>
                </div>

                {/* Objectifs */}
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Objectifs pédagogiques</h4>
                  <div className="space-y-2">
                    {formData.objectives.map((objective, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={objective}
                          onChange={(e) => updateObjective(index, e.target.value)}
                          className="flex-1 input-field"
                          placeholder={`Objectif ${index + 1}`}
                        />
                        {formData.objectives.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeObjective(index)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addObjective}
                      className="text-teal-600 hover:text-teal-700 text-sm flex items-center"
                    >
                      + Ajouter un objectif
                    </button>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
                    Créer la formation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateTrainingModal;
