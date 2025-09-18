import React, { useState, useEffect } from 'react';
import {
  FlagIcon,
  ChartBarIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Objective } from '../../types';
import { useNotification } from '../../hooks/useNotification';
import { useObjectives } from '../../hooks/useStorage';
import NotificationModal from '../common/NotificationModal';
import RequestModal from '../common/RequestModal';

const EmployeeObjectivesPage: React.FC = () => {
  const { notification, showSuccess, showInfo, hideNotification } = useNotification();
  const { data: objectives, loading, updateItem: updateObjective, addItem: addObjective } = useObjectives();
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'not_started' | 'in_progress' | 'completed' | 'overdue'>('all');

  // Les données sont maintenant chargées automatiquement par le hook useObjectives

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'project': return <FlagIcon className="h-5 w-5" />;
      case 'technical': return <ChartBarIcon className="h-5 w-5" />;
      case 'learning': return <StarIcon className="h-5 w-5" />;
      case 'behavioral': return <CheckCircleIcon className="h-5 w-5" />;
      default: return <FlagIcon className="h-5 w-5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in_progress': return 'En cours';
      case 'pending': return 'En attente';
      case 'overdue': return 'En retard';
      default: return 'Inconnu';
    }
  };

  const updateProgress = (objectiveId: string, newProgress: number) => {
    const updates = {
      progress: newProgress,
      status: newProgress === 100 ? 'completed' as const : 'in_progress' as const,
      completedDate: newProgress === 100 ? new Date().toISOString().split('T')[0] : undefined
    };
    updateObjective(objectiveId, updates);
  };

  const filteredObjectives = objectives.filter(objective => {
    if (filter === 'all') return true;
    return objective.status === filter;
  });

  const handleObjectiveRequest = (data: any) => {
    console.log('EmployeeObjectivesPage - handleObjectiveRequest appelé', data);
    try {
      // Créer un nouvel objectif avec les données de la demande
      const newObjective: Objective = {
        id: Date.now().toString(),
        employeeId: 'current-user',
        employeeName: 'Moi',
        title: data.title,
        description: data.description,
        category: data.category as 'performance' | 'development' | 'project' | 'behavioral',
        priority: 'medium',
        status: 'not_started',
        startDate: new Date().toISOString().split('T')[0],
        dueDate: data.dueDate,
        progress: 0,
        managerId: 'mgr1',
        managerName: 'Manager Actuel'
      };
      
      // Ajouter l'objectif à la liste
      addObjective(newObjective);
      
      showSuccess(
        'Objectif créé !',
        `Votre objectif "${data.title}" a été créé et sera visible par votre manager.`
      );
      console.log('EmployeeObjectivesPage - Objectif créé et sauvegardé');
    } catch (error) {
      console.error('EmployeeObjectivesPage - Erreur:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-primary"></div>
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
            Suivez vos objectifs et votre progression professionnelle
          </p>
        </div>
        <button 
          onClick={() => setShowRequestModal(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Proposer un objectif
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FlagIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{objectives.length}</p>
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
              <p className="text-2xl font-bold text-gray-900">{objectives.filter(o => o.status === 'completed').length}</p>
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
              <p className="text-2xl font-bold text-gray-900">{objectives.filter(o => o.status === 'in_progress').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 rounded-lg">
              <StarIcon className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taux de réussite</p>
              <p className="text-2xl font-bold text-gray-900">
                {objectives.length > 0 ? Math.round((objectives.filter(o => o.status === 'completed').length / objectives.length) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'all' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tous ({objectives.length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'in_progress' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            En cours ({objectives.filter(o => o.status === 'in_progress').length})
          </button>
          <button
            onClick={() => setFilter('not_started')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'not_started' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            En attente ({objectives.filter(o => o.status === 'not_started').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'completed' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Terminés ({objectives.filter(o => o.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Liste des objectifs */}
      <div className="space-y-4">
        {filteredObjectives.map((objective) => (
          <div key={objective.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                    {getCategoryIcon(objective.category)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{objective.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{objective.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Manager: {objective.managerName}</span>
                      <span>Échéance: {new Date(objective.dueDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(objective.priority)}`}>
                    {objective.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(objective.status)}`}>
                    {getStatusText(objective.status)}
                  </span>
                </div>
              </div>

              {objective.status !== 'not_started' && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progression</span>
                    <span>{objective.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-teal-primary h-3 rounded-full transition-all duration-300"
                      style={{ width: `${objective.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {objective.status === 'in_progress' && (
                    <>
                      <button 
                        onClick={() => {
                          const newProgress = Math.min(100, objective.progress + 20);
                          updateProgress(objective.id, newProgress);
                          showSuccess(
                            'Progression mise à jour',
                            `Votre progression est maintenant de ${newProgress}%.`
                          );
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Avancer (+20%)
                      </button>
                      <button 
                        onClick={() => updateProgress(objective.id, 100)}
                        className="btn-primary text-sm py-1 px-3"
                      >
                        Marquer terminé
                      </button>
                    </>
                  )}
                  {objective.status === 'not_started' && (
                    <button 
                      onClick={() => {
                        updateObjective(objective.id, { status: 'in_progress', progress: 5 });
                      }}
                      className="btn-primary text-sm py-1 px-3"
                    >
                      Commencer
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => {
                    setSelectedObjective(objective);
                    setShowModal(true);
                  }}
                  className="text-teal-600 hover:text-teal-900 text-sm font-medium"
                >
                  Voir détails →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de détails */}
      {showModal && selectedObjective && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{selectedObjective.title}</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedObjective.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Catégorie</h4>
                    <p className="text-gray-600">{selectedObjective.category}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Priorité</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedObjective.priority)}`}>
                      {selectedObjective.priority}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Date de début</h4>
                    <p className="text-gray-600">{new Date(selectedObjective.startDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Date d'échéance</h4>
                    <p className="text-gray-600">{new Date(selectedObjective.dueDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                {selectedObjective.status !== 'not_started' && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Progression</h4>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-teal-primary h-3 rounded-full"
                        style={{ width: `${selectedObjective.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{selectedObjective.progress}% complété</p>
                  </div>
                )}

                {selectedObjective.completedDate && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Date de completion</h4>
                    <p className="text-gray-600">{new Date(selectedObjective.completedDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Fermer
                </button>
                {selectedObjective.status === 'in_progress' && (
                  <button 
                    onClick={() => {
                      const newProgress = Math.min(100, selectedObjective.progress + 20);
                      updateProgress(selectedObjective.id, newProgress);
                      setShowModal(false);
                      showSuccess(
                        'Progression mise à jour',
                        `Votre progression est maintenant de ${newProgress}%.`
                      );
                    }}
                    className="btn-primary"
                  >
                    Avancer (+20%)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de demande d'objectif */}
      <RequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSubmit={handleObjectiveRequest}
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

export default EmployeeObjectivesPage;
