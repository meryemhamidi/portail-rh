import React, { useState, useEffect } from 'react';
import { 
  FlagIcon, 
  CalendarIcon, 
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  PencilIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import NotificationModal from '../common/NotificationModal';
import { useNotification } from '../../hooks/useNotification';
import { Objective } from '../../types';
import { objectiveService } from '../../services/api';
import DetailsModal from '../common/DetailsModal';

const ObjectivesPage: React.FC = () => {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { notification, showSuccess, showInfo, hideNotification } = useNotification();

  // Données simulées
  useEffect(() => {
    const mockObjectives: Objective[] = [
      {
        id: '1',
        title: 'Améliorer les performances de l\'application',
        description: 'Optimiser le temps de chargement des pages principales de moins de 2 secondes.',
        employeeId: 'emp1',
        employeeName: 'Vous',
        managerId: 'manager1',
        managerName: 'Marie Dubois',
        startDate: '2024-03-01',
        dueDate: '2024-06-30',
        status: 'in_progress',
        progress: 75,
        priority: 'high',
        category: 'performance'
      },
      {
        id: '2',
        title: 'Compléter la formation React',
        description: 'Terminer le parcours de formation React avancé et obtenir la certification.',
        employeeId: 'emp1',
        employeeName: 'Vous',
        managerId: 'manager1',
        managerName: 'Marie Dubois',
        startDate: '2024-02-01',
        dueDate: '2024-04-15',
        status: 'completed',
        progress: 100,
        priority: 'medium',
        category: 'development'
      },
      {
        id: '3',
        title: 'Documenter les APIs',
        description: 'Créer une documentation complète pour toutes les APIs du projet.',
        employeeId: 'emp1',
        employeeName: 'Vous',
        managerId: 'manager1',
        managerName: 'Marie Dubois',
        startDate: '2024-04-01',
        dueDate: '2024-05-20',
        status: 'not_started',
        progress: 0,
        priority: 'medium',
        category: 'project'
      },
      {
        id: '4',
        title: 'Mentorer un junior',
        description: 'Accompagner un développeur junior dans son intégration et ses premiers projets.',
        employeeId: 'emp1',
        employeeName: 'Vous',
        managerId: 'manager1',
        managerName: 'Marie Dubois',
        startDate: '2024-01-15',
        dueDate: '2024-12-31',
        status: 'in_progress',
        progress: 40,
        priority: 'low',
        category: 'behavioral'
      }
    ];

    setTimeout(() => {
      setObjectives(mockObjectives);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'not_started': return 'text-gray-600 bg-gray-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in_progress': return 'En cours';
      case 'not_started': return 'Non commencé';
      case 'overdue': return 'En retard';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-5 w-5" />;
      case 'in_progress': return <ClockIcon className="h-5 w-5" />;
      case 'not_started': return <FlagIcon className="h-5 w-5" />;
      case 'overdue': return <ExclamationTriangleIcon className="h-5 w-5" />;
      default: return <FlagIcon className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return priority;
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'completed';
  };

  const filteredObjectives = objectives.filter(objective => {
    if (filter === 'all') return true;
    if (filter === 'overdue') return isOverdue(objective.dueDate, objective.status);
    return objective.status === filter;
  });

  // Statistiques
  const stats = {
    total: objectives.length,
    completed: objectives.filter(o => o.status === 'completed').length,
    inProgress: objectives.filter(o => o.status === 'in_progress').length,
    overdue: objectives.filter(o => isOverdue(o.dueDate, o.status)).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FlagIcon className="h-8 w-8 text-teal-primary mr-3" />
            Mes Objectifs
          </h1>
          <p className="text-gray-600 mt-1">
            Suivez vos objectifs et votre progression
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Terminés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En retard</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-teal-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous ({objectives.length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'in_progress' 
                ? 'bg-teal-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            En cours ({objectives.filter(o => o.status === 'in_progress').length})
          </button>
          <button
            onClick={() => setFilter('not_started')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'not_started' 
                ? 'bg-teal-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Non commencés ({objectives.filter(o => o.status === 'not_started').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'completed' 
                ? 'bg-teal-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Terminés ({objectives.filter(o => o.status === 'completed').length})
          </button>
          <button
            onClick={() => setFilter('overdue')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'overdue' 
                ? 'bg-teal-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            En retard ({objectives.filter(o => isOverdue(o.dueDate, o.status)).length})
          </button>
        </div>
      </div>

      {/* Liste des objectifs */}
      <div className="space-y-4">
        {filteredObjectives.map((objective) => (
          <div key={objective.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 mr-3">
                      {objective.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(objective.priority)}`}>
                      {getPriorityLabel(objective.priority)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {objective.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium mr-2">
                      {objective.category}
                    </span>
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Échéance: {new Date(objective.dueDate).toLocaleDateString('fr-FR')}
                    {isOverdue(objective.dueDate, objective.status) && (
                      <span className="ml-2 text-red-600 font-medium">(En retard)</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${getStatusColor(objective.status)}`}>
                    {getStatusIcon(objective.status)}
                    <span className="ml-1">{getStatusLabel(objective.status)}</span>
                  </span>
                  <button 
                    onClick={() => {
                      setSelectedObjective(objective);
                      setShowModal(true);
                    }}
                    className="text-teal-600 hover:text-teal-800 flex items-center text-sm"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Voir détails
                  </button>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progression</span>
                  <span className="text-sm text-gray-600">{objective.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      objective.status === 'completed' ? 'bg-green-500' :
                      isOverdue(objective.dueDate, objective.status) ? 'bg-red-500' :
                      'bg-teal-primary'
                    }`}
                    style={{ width: `${objective.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Actions */}
              {objective.status !== 'completed' && (
                <div className="flex justify-end space-x-2">
                  {objective.status === 'not_started' && (
                    <button 
                      onClick={() => {
                        setObjectives(prev => prev.map(obj => 
                          obj.id === objective.id 
                            ? { ...obj, status: 'in_progress', progress: 10 }
                            : obj
                        ));
                        showSuccess(
                          'Objectif commencé !',
                          `Objectif "${objective.title}" commencé ! Vous pouvez maintenant suivre votre progression.`
                        );
                      }}
                      className="btn-primary text-sm"
                    >
                      Commencer
                    </button>
                  )}
                  {objective.status === 'in_progress' && (
                    <button 
                      onClick={() => {
                        const newProgress = prompt(`Progression actuelle: ${objective.progress}%\nEntrez la nouvelle progression (0-100):`, objective.progress.toString());
                        if (newProgress && !isNaN(Number(newProgress))) {
                          const progressValue = Math.min(100, Math.max(0, Number(newProgress)));
                          const newStatus = progressValue === 100 ? 'completed' : 'in_progress';
                          
                          setObjectives(prev => prev.map(obj => 
                            obj.id === objective.id 
                              ? { ...obj, progress: progressValue, status: newStatus }
                              : obj
                          ));
                          
                          if (progressValue === 100) {
                            showSuccess(
                              'Félicitations !',
                              `Objectif "${objective.title}" terminé !`
                            );
                          } else {
                            showInfo(
                              'Progression mise à jour',
                              `Progression mise à jour: ${progressValue}%`
                            );
                          }
                        }
                      }}
                      className="btn-secondary text-sm"
                    >
                      Mettre à jour
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredObjectives.length === 0 && (
        <div className="text-center py-12">
          <FlagIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun objectif</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucun objectif ne correspond aux critères sélectionnés.
          </p>
        </div>
      )}

      {/* Modal de détails */}
      <DetailsModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedObjective(null);
        }}
        title={selectedObjective?.title || ''}
        data={selectedObjective || {}}
        type="objective"
      />

      {/* Modal de notification */}
      <NotificationModal 
        isOpen={notification.isOpen}
        onClose={hideNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        confirmText={notification.confirmText}
      />
    </div>
  );
};

export default ObjectivesPage;
