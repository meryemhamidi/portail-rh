import React, { useState, useEffect } from 'react';
import {
  AcademicCapIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { Training } from '../../types';
import { useNotification } from '../../hooks/useNotification';
import NotificationModal from '../common/NotificationModal';
import CreateTrainingModal from './CreateTrainingModal';
import { trainingService } from '../../services/api';

const TrainingsPage: React.FC = () => {
  const { notification, showInfo, showSuccess, hideNotification } = useNotification();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

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
          description: 'Approfondissement des concepts React avec hooks, context et performance',
          instructor: 'Lina Hamidi',
          duration: 24,
          startDate: '2024-02-15',
          endDate: '2024-02-17',
          location: 'Salle de formation A',
          maxParticipants: 15,
          currentParticipants: 12,
          status: 'scheduled',
          category: 'Technique',
          cost: 1200,
          participants: ['emp1', 'emp2', 'emp3']
        },
        {
          id: '2',
          title: 'Management et Leadership',
          description: 'Développer ses compétences managériales et de leadership',
          instructor: 'Marie Dubois',
          duration: 16,
          startDate: '2024-02-20',
          endDate: '2024-02-22',
          location: 'Salle de conférence',
          maxParticipants: 20,
          currentParticipants: 18,
          status: 'ongoing',
          category: 'Management',
          cost: 800
        },
        {
          id: '3',
          title: 'Sécurité Informatique',
          description: 'Bonnes pratiques de sécurité et protection des données',
          instructor: 'Pierre Leroy',
          duration: 12,
          startDate: '2024-01-10',
          endDate: '2024-01-12',
          location: 'En ligne',
          maxParticipants: 25,
          currentParticipants: 25,
          status: 'completed',
          category: 'Sécurité',
          cost: 600
        }
      ];
      setTrainings(mockTrainings);
    } catch (error) {
      console.error('Erreur lors du chargement des formations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTraining = (trainingData: any) => {
    const newTraining = {
      ...trainingData,
      id: `training_${Date.now()}`,
      status: 'upcoming' as const,
      enrolledCount: 0,
      cost: 500 // Coût par défaut
    };
    setTrainings([...trainings, newTraining]);
  };

  const filteredTrainings = trainings.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || training.status === filterStatus;
    const matchesCategory = selectedCategory === 'all' || training.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    const labels = {
      scheduled: 'Programmée',
      ongoing: 'En cours',
      completed: 'Terminée',
      cancelled: 'Annulée'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const categories = Array.from(new Set(trainings.map(t => t.category)));
  
  const trainingStats = {
    total: trainings.length,
    scheduled: trainings.filter(t => t.status === 'scheduled').length,
    ongoing: trainings.filter(t => t.status === 'ongoing').length,
    totalParticipants: trainings.reduce((acc, t) => acc + (t.currentParticipants || 0), 0)
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
            Gestion des Formations
          </h1>
          <p className="text-gray-600 mt-1">
            Organisation et suivi des programmes de formation
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nouvelle formation
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Formations</p>
              <p className="text-2xl font-bold text-gray-900">{trainingStats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-gray-900">{trainingStats.ongoing}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Programmées</p>
              <p className="text-2xl font-bold text-gray-900">{trainingStats.scheduled}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Participants</p>
              <p className="text-2xl font-bold text-gray-900">{trainingStats.totalParticipants}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par titre, description ou formateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field"
          >
            <option value="all">Tous les statuts</option>
            <option value="scheduled">Programmée</option>
            <option value="ongoing">En cours</option>
            <option value="completed">Terminée</option>
            <option value="cancelled">Annulée</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grille des formations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainings.map((training) => (
          <div key={training.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-8 w-8 text-teal-primary" />
                  <span className="ml-2 text-sm text-gray-500">{training.category}</span>
                </div>
                {getStatusBadge(training.status)}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {training.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {training.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  Formateur: {training.instructor}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {new Date(training.startDate).toLocaleDateString('fr-FR')} - {new Date(training.endDate).toLocaleDateString('fr-FR')}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {training.location}
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm">
                  <span className="text-gray-500">Participants: </span>
                  <span className="font-medium">
                    {training.currentParticipants}/{training.maxParticipants}
                  </span>
                </div>
                {training.cost && (
                  <div className="text-sm font-medium text-gray-900">
                    {training.cost.toLocaleString('fr-FR')} DH
                  </div>
                )}
              </div>
              
              {/* Barre de progression */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Inscriptions</span>
                  <span>{Math.round(((training.currentParticipants || 0) / (training.maxParticipants || 1)) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-teal-primary h-2 rounded-full"
                    style={{ width: `${((training.currentParticipants || 0) / (training.maxParticipants || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => showInfo(
                    'Détails de la formation',
                    `Formation: ${training.title}\nDurée: ${training.duration}\nInstructeur: ${training.instructor}\nParticipants: ${training.currentParticipants}/${training.maxParticipants}`
                  )}
                  className="flex-1 btn-secondary text-sm py-2"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Voir
                </button>
                <button 
                  onClick={() => showInfo(
                    'Formation modifiée',
                    `Les détails de la formation "${training.title}" ont été mis à jour avec succès.`
                  )}
                  className="flex-1 btn-primary text-sm py-2"
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Modifier
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTrainings.length === 0 && (
        <div className="text-center py-12">
          <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune formation trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucune formation ne correspond à vos critères de recherche.
          </p>
        </div>
      )}
      {/* Modal de notification */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={hideNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        confirmText={notification.confirmText}
      />

      {/* Modal de création de formation */}
      <CreateTrainingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTraining={handleCreateTraining}
      />
    </div>
  );
};

export default TrainingsPage;
