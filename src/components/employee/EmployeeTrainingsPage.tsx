import React, { useState, useEffect } from 'react';
import {
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
  CheckCircleIcon,
  PlayIcon,
  CalendarIcon,
  UserGroupIcon,
  StarIcon,
  MagnifyingGlassIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useNotification } from '../../hooks/useNotification';
import NotificationModal from '../common/NotificationModal';
import RequestModal from '../common/RequestModal';
import { Training } from '../../types';
import { trainingService } from '../../services/api';
import DetailsModal from '../common/DetailsModal';

const EmployeeTrainingsPage: React.FC = () => {
  const { notification, showSuccess, showInfo, hideNotification } = useNotification();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'available' | 'enrolled' | 'completed'>('all');

  useEffect(() => {
    loadTrainings();
  }, []);

  const loadTrainings = async () => {
    try {
      setLoading(true);
      const mockTrainings: Training[] = [
        {
          id: '1',
          title: 'Formation React Avancé',
          description: 'Approfondissez vos connaissances en React avec les hooks, le context et les patterns avancés.',
          instructor: 'Lina Hamidi',
          duration: 40,
          startDate: '2024-03-15',
          endDate: '2024-03-22',
          status: 'completed',
          progress: 100,
          category: 'Développement'
        },
        {
          id: '2',
          title: 'Gestion de Projet Agile',
          description: 'Maîtrisez les méthodologies Scrum et Kanban pour une gestion de projet efficace.',
          instructor: 'Kenza Hamidi',
          duration: 24,
          startDate: '2024-04-01',
          endDate: '2024-04-05',
          status: 'in_progress',
          progress: 65,
          category: 'Management'
        },
        {
          id: '3',
          title: 'Sécurité Informatique',
          description: 'Apprenez les bonnes pratiques de sécurité pour protéger vos applications.',
          instructor: 'Meryem Hamidi',
          duration: 16,
          startDate: '2024-05-10',
          endDate: '2024-05-12',
          status: 'scheduled',
          progress: 0,
          category: 'Sécurité'
        },
        {
          id: '4',
          title: 'Communication Interpersonnelle',
          description: 'Développez vos compétences en communication pour améliorer vos relations professionnelles.',
          instructor: 'Lina Hamidi',
          duration: 12,
          startDate: '2024-06-01',
          endDate: '2024-06-02',
          status: 'scheduled',
          progress: 0,
          category: 'Soft Skills'
        }
      ];
      setTrainings(mockTrainings);
    } catch (error) {
      console.error('Erreur lors du chargement des formations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminée';
      case 'in_progress': return 'En cours';
      case 'scheduled': return 'Planifiée';
      default: return 'Inconnue';
    }
  };

  const filteredTrainings = trainings.filter(training => {
    if (filter === 'all') return true;
    if (filter === 'available') return training.status === 'scheduled';
    if (filter === 'enrolled') return training.status === 'in_progress';
    if (filter === 'completed') return training.status === 'completed';
    return true;
  });

  const enrollInTraining = (trainingId: string) => {
    setTrainings(trainings.map(t => 
      t.id === trainingId 
        ? { ...t, status: 'in_progress', progress: 5 }
        : t
    ));
  };

  const handleRequestSubmit = (data: any) => {
    showSuccess(
      'Demande envoyée !',
      `Votre demande de formation "${data.title}" a été envoyée aux RH. Vous recevrez une réponse sous 48h.`
    );
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
            <AcademicCapIcon className="h-8 w-8 text-teal-primary mr-3" />
            Mes Formations
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez vos formations et développez vos compétences
          </p>
        </div>
        <button 
          onClick={() => setShowRequestModal(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Demander une formation
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Terminées</p>
              <p className="text-2xl font-bold text-gray-900">{trainings.filter(t => t.status === 'completed').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <PlayIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-gray-900">{trainings.filter(t => t.status === 'in_progress').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Planifiées</p>
              <p className="text-2xl font-bold text-gray-900">{trainings.filter(t => t.status === 'scheduled').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Heures totales</p>
              <p className="text-2xl font-bold text-gray-900">{trainings.reduce((acc, t) => acc + t.duration, 0)}h</p>
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
            Toutes ({trainings.length})
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'available' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Disponibles ({trainings.filter(t => t.status === 'scheduled').length})
          </button>
          <button
            onClick={() => setFilter('enrolled')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'enrolled' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            En cours ({trainings.filter(t => t.status === 'in_progress').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'completed' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Terminées ({trainings.filter(t => t.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Liste des formations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainings.map((training) => (
          <div key={training.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <BookOpenIcon className="h-8 w-8 text-teal-primary" />
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{training.title}</h3>
                    <p className="text-sm text-gray-500">{training.category}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(training.status)}`}>
                  {getStatusText(training.status)}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{training.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  {training.duration} heures
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  Instructeur: {training.instructor}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <AcademicCapIcon className="h-4 w-4 mr-2" />
                  {new Date(training.startDate).toLocaleDateString('fr-FR')} - {new Date(training.endDate).toLocaleDateString('fr-FR')}
                </div>
              </div>

              {training.status === 'in_progress' && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progression</span>
                    <span>{training.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-teal-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${training.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                {training.status === 'scheduled' && (
                  <button 
                    onClick={() => enrollInTraining(training.id)}
                    className="flex-1 btn-primary text-sm py-2"
                  >
                    S'inscrire
                  </button>
                )}
                {training.status === 'in_progress' && (
                  <button 
                    onClick={() => {
                      setSelectedTraining(training);
                      setShowModal(true);
                    }}
                    className="flex-1 btn-primary text-sm py-2"
                  >
                    Continuer
                  </button>
                )}
                {training.status === 'completed' && (
                  <button 
                    onClick={() => {
                      alert(`Certificat de formation:\n\n${training.title}\nTerminée le: ${training.endDate}\nDurée: ${training.duration}h\nInstructeur: ${training.instructor}`);
                    }}
                    className="flex-1 btn-secondary text-sm py-2"
                  >
                    Certificat
                  </button>
                )}
                <button 
                  onClick={() => {
                    setSelectedTraining(training);
                    setShowModal(true);
                  }}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  Détails
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de détails */}
      {showModal && selectedTraining && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{selectedTraining.title}</h3>
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
                  <p className="text-gray-600">{selectedTraining.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Durée</h4>
                    <p className="text-gray-600">{selectedTraining.duration} heures</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Instructeur</h4>
                    <p className="text-gray-600">{selectedTraining.instructor}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Catégorie</h4>
                    <p className="text-gray-600">{selectedTraining.category}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Statut</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTraining.status)}`}>
                      {getStatusText(selectedTraining.status)}
                    </span>
                  </div>
                </div>

                {selectedTraining.status === 'in_progress' && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Progression</h4>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-teal-primary h-3 rounded-full"
                        style={{ width: `${selectedTraining.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{selectedTraining.progress}% complété</p>
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
                {selectedTraining.status === 'scheduled' && (
                  <button 
                    onClick={() => {
                      enrollInTraining(selectedTraining.id);
                      setShowModal(false);
                    }}
                    className="btn-primary"
                  >
                    S'inscrire
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de demande de formation */}
      <RequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSubmit={handleRequestSubmit}
        type="training"
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

export default EmployeeTrainingsPage;
