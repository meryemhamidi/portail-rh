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
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useNotification } from '../../hooks/useNotification';
import NotificationModal from '../common/NotificationModal';
import { Training } from '../../types';
import { trainingService } from '../../services/api';
import DetailsModal from '../common/DetailsModal';

const EmployeeTrainingsPage: React.FC = () => {
  const { notification, showSuccess, showInfo, hideNotification } = useNotification();
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Données simulées
  useEffect(() => {
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
        description: 'Formation sur les bonnes pratiques de sécurité et la protection des données.',
        instructor: 'Pierre Durand',
        duration: 16,
        startDate: '2024-04-15',
        endDate: '2024-04-17',
        status: 'enrolled',
        progress: 0,
        category: 'Sécurité'
      },
      {
        id: '4',
        title: 'Communication Interpersonnelle',
        description: 'Développez vos compétences en communication et en relations humaines.',
        instructor: 'Sophie Leblanc',
        duration: 12,
        startDate: '2024-05-01',
        endDate: '2024-05-02',
        status: 'available',
        progress: 0,
        category: 'Soft Skills'
      }
    ];

    setTimeout(() => {
      setTrainings(mockTrainings);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'enrolled': return 'text-yellow-600 bg-yellow-100';
      case 'available': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminée';
      case 'in_progress': return 'En cours';
      case 'enrolled': return 'Inscrit';
      case 'available': return 'Disponible';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-5 w-5" />;
      case 'in_progress': return <PlayIcon className="h-5 w-5" />;
      case 'enrolled': return <BookOpenIcon className="h-5 w-5" />;
      case 'available': return <AcademicCapIcon className="h-5 w-5" />;
      default: return <ClockIcon className="h-5 w-5" />;
    }
  };

  const filteredTrainings = trainings.filter(training => {
    if (filter === 'all') return true;
    return training.status === filter;
  });

  // Statistiques
  const stats = {
    completed: trainings.filter(t => t.status === 'completed').length,
    inProgress: trainings.filter(t => t.status === 'in_progress').length,
    enrolled: trainings.filter(t => t.status === 'enrolled').length,
    totalHours: trainings.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.duration, 0)
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
            <AcademicCapIcon className="h-8 w-8 text-teal-primary mr-3" />
            Mes Formations
          </h1>
          <p className="text-gray-600 mt-1">
            Suivez vos formations et développez vos compétences
          </p>
        </div>
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
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BookOpenIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inscrites</p>
              <p className="text-2xl font-bold text-gray-900">{stats.enrolled}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Heures totales</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalHours}h</p>
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
            Toutes ({trainings.length})
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'available' 
                ? 'bg-teal-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Disponibles ({trainings.filter(t => t.status === 'available').length})
          </button>
          <button
            onClick={() => setFilter('enrolled')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'enrolled' 
                ? 'bg-teal-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Inscrites ({trainings.filter(t => t.status === 'enrolled').length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'in_progress' 
                ? 'bg-teal-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            En cours ({trainings.filter(t => t.status === 'in_progress').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'completed' 
                ? 'bg-teal-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Terminées ({trainings.filter(t => t.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Liste des formations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTrainings.map((training) => (
          <div key={training.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {training.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {training.description}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(training.status)}`}>
                  {getStatusIcon(training.status)}
                  <span className="ml-1">{getStatusLabel(training.status)}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  {training.instructor}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  {training.duration}h
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {new Date(training.startDate).toLocaleDateString('fr-FR')}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <AcademicCapIcon className="h-4 w-4 mr-2" />
                  {training.category}
                </div>
              </div>

              {/* Barre de progression */}
              {training.status !== 'available' && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progression</span>
                    <span className="text-sm text-gray-600">{training.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-teal-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${training.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center">
                {training.status === 'available' && (
                  <button 
                    onClick={() => {
                      setTrainings(trainings.map(t => 
                        t.id === training.id ? { ...t, status: 'enrolled' } : t
                      ));
                      showSuccess(
                        'Inscription réussie !',
                        `Vous êtes maintenant inscrit(e) à la formation "${training.title}". Vous recevrez bientôt les détails de démarrage.`
                      );
                    }}
                    className="btn-primary text-sm"
                  >
                    S'inscrire
                  </button>
                )}
                {training.status === 'enrolled' && (
                  <button 
                    onClick={() => {
                      setTrainings(trainings.map(t => 
                        t.id === training.id ? { ...t, status: 'in_progress', progress: 10 } : t
                      ));
                      showInfo(
                        'Formation démarrée',
                        `Vous avez commencé la formation "${training.title}". Bonne chance dans votre apprentissage !`
                      );
                    }}
                    className="btn-primary text-sm"
                  >
                    Commencer
                  </button>
                )}
                {training.status === 'in_progress' && (
                  <button 
                    onClick={() => {
                      const newProgress = Math.min(training.progress + 20, 100);
                      const newStatus = newProgress === 100 ? 'completed' : 'in_progress';
                      setTrainings(trainings.map(t => 
                        t.id === training.id ? { ...t, progress: newProgress, status: newStatus } : t
                      ));
                      if (newStatus === 'completed') {
                        showSuccess(
                          'Formation terminée !',
                          `Félicitations ! Vous avez terminé la formation "${training.title}" avec succès.`
                        );
                      } else {
                        showInfo(
                          'Progrès enregistré',
                          `Votre progression dans "${training.title}" est maintenant de ${newProgress}%.`
                        );
                      }
                    }}
                    className="btn-primary text-sm"
                  >
                    Continuer
                  </button>
                )}
                {training.status === 'completed' && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Terminée
                  </div>
                )}
                
                <button 
                  onClick={() => {
                    setSelectedTraining(training);
                    setShowModal(true);
                  }}
                  className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                >
                  Voir détails
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTrainings.length === 0 && (
        <div className="text-center py-12">
          <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune formation</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucune formation ne correspond aux critères sélectionnés.
          </p>
        </div>
      )}

      {/* Modal de détails */}
      <DetailsModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedTraining(null);
        }}
        title={selectedTraining?.title || ''}
        data={selectedTraining || {}}
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
