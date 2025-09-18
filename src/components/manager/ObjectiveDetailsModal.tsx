import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Objective } from '../../types';
import { 
  FlagIcon, 
  UserIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TagIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface ObjectiveDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  objective: Objective | null;
  onUpdateProgress?: (objectiveId: string, newProgress: number) => void;
}

const ObjectiveDetailsModal: React.FC<ObjectiveDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  objective,
  onUpdateProgress 
}) => {
  const [editingProgress, setEditingProgress] = useState(false);
  const [newProgress, setNewProgress] = useState(0);

  if (!objective) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'not_started': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'bg-green-100 text-green-800';
      case 'development': return 'bg-purple-100 text-purple-800';
      case 'project': return 'bg-blue-100 text-blue-800';
      case 'behavioral': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'in_progress': return <ClockIcon className="h-5 w-5 text-blue-600" />;
      case 'overdue': return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      default: return <FlagIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDaysRemaining = () => {
    const today = new Date();
    const dueDate = new Date(objective.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleProgressUpdate = () => {
    if (onUpdateProgress && newProgress >= 0 && newProgress <= 100) {
      onUpdateProgress(objective.id, newProgress);
      setEditingProgress(false);
    }
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Détails de l'objectif" size="lg">
      <div className="space-y-6">
        {/* En-tête avec titre et statut */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FlagIcon className="h-6 w-6 text-teal-600 mr-2" />
              {objective.title}
            </h2>
            <div className="flex items-center space-x-2">
              {getStatusIcon(objective.status)}
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(objective.status)}`}>
                {objective.status === 'completed' ? 'Terminé' :
                 objective.status === 'in_progress' ? 'En cours' :
                 objective.status === 'overdue' ? 'En retard' : 'Non commencé'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-1" />
              <span className="font-medium">{objective.employeeName}</span>
            </div>
            <div className="flex items-center">
              <TagIcon className="h-4 w-4 mr-1" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(objective.category)}`}>
                {objective.category === 'performance' ? 'Performance' :
                 objective.category === 'development' ? 'Développement' :
                 objective.category === 'project' ? 'Projet' : 'Comportemental'}
              </span>
            </div>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(objective.priority)}`}>
                Priorité {objective.priority === 'high' ? 'Élevée' : 
                         objective.priority === 'medium' ? 'Moyenne' : 'Faible'}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <DocumentTextIcon className="h-5 w-5 text-gray-600 mr-2" />
            Description
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed">{objective.description}</p>
          </div>
        </div>

        {/* Progression */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ChartBarIcon className="h-5 w-5 text-gray-600 mr-2" />
              Progression
            </h3>
            {!editingProgress && (
              <button
                onClick={() => {
                  setNewProgress(objective.progress);
                  setEditingProgress(true);
                }}
                className="text-teal-600 hover:text-teal-800 text-sm flex items-center"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Modifier
              </button>
            )}
          </div>

          {editingProgress ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newProgress}
                  onChange={(e) => setNewProgress(parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center"
                />
                <span className="text-gray-600">%</span>
                <button
                  onClick={handleProgressUpdate}
                  className="btn-primary text-sm"
                >
                  Valider
                </button>
                <button
                  onClick={() => setEditingProgress(false)}
                  className="btn-secondary text-sm"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-teal-600">{objective.progress}%</span>
                <span className="text-sm text-gray-600">
                  {objective.progress === 100 ? 'Objectif terminé !' : 
                   objective.progress >= 75 ? 'Presque terminé' :
                   objective.progress >= 50 ? 'En bonne voie' :
                   objective.progress >= 25 ? 'En cours' : 'À peine commencé'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-teal-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${objective.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Dates et délais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <CalendarIcon className="h-5 w-5 text-gray-600 mr-2" />
              Dates importantes
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Date de début :</span>
                <span className="font-medium">{formatDate(objective.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date d'échéance :</span>
                <span className="font-medium">{formatDate(objective.dueDate)}</span>
              </div>
              {objective.completedDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Terminé le :</span>
                  <span className="font-medium text-green-600">{formatDate(objective.completedDate)}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <ClockIcon className="h-5 w-5 text-gray-600 mr-2" />
              Délai restant
            </h4>
            <div className="text-center p-4 rounded-lg border-2 border-dashed border-gray-300">
              {objective.status === 'completed' ? (
                <div className="text-green-600">
                  <CheckCircleIcon className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-semibold">Objectif terminé</p>
                </div>
              ) : daysRemaining > 0 ? (
                <div className={daysRemaining <= 7 ? 'text-orange-600' : 'text-blue-600'}>
                  <p className="text-2xl font-bold">{daysRemaining}</p>
                  <p className="text-sm">jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''}</p>
                </div>
              ) : (
                <div className="text-red-600">
                  <ExclamationTriangleIcon className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-semibold">En retard</p>
                  <p className="text-sm">{Math.abs(daysRemaining)} jour{Math.abs(daysRemaining) > 1 ? 's' : ''} de retard</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Fermer
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ObjectiveDetailsModal;
