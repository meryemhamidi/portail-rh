import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  FlagIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { Objective, Employee } from '../../types';
import NotificationModal from '../common/NotificationModal';
import { useNotification } from '../../hooks/useNotification';
import { objectiveService } from '../../services/api';
import CreateObjectiveModal from './CreateObjectiveModal';
import ObjectiveDetailsModal from './ObjectiveDetailsModal';
import EditObjectiveModal from './EditObjectiveModal';

const ObjectivesPage: React.FC = () => {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const { notification, showSuccess, showInfo, hideNotification } = useNotification();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);
  const [teamMembers, setTeamMembers] = useState<Employee[]>([]);

  useEffect(() => {
    loadObjectives();
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    // Simulation de données équipe
    const mockTeamMembers: Employee[] = [
      {
        id: '1',
        email: 'meryem.hamidi@teal-tech.com',
        firstName: 'Meryem',
        lastName: 'Hamidi',
        role: 'employee',
        department: 'Développement',
        position: 'Développeur Senior',
        hireDate: '2023-01-15',
        isActive: true,
        salary: 55000,
        managerId: 'current-manager',
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
        performance: 4.2
      },
      {
        id: '2',
        email: 'kenza.hamidi@teal-tech.com',
        firstName: 'Kenza',
        lastName: 'Hamidi',
        role: 'employee',
        department: 'Développement',
        position: 'Développeuse Frontend',
        hireDate: '2023-03-10',
        isActive: true,
        salary: 48000,
        managerId: 'current-manager',
        skills: ['React', 'Vue.js', 'CSS', 'JavaScript'],
        performance: 4.5
      },
      {
        id: '3',
        email: 'simo.hamidi@teal-tech.com',
        firstName: 'Simo',
        lastName: 'Hamidi',
        role: 'employee',
        department: 'Développement',
        position: 'Développeur Backend',
        hireDate: '2022-09-20',
        isActive: true,
        salary: 52000,
        managerId: 'current-manager',
        skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
        performance: 4.0
      },
      {
        id: '4',
        email: 'youssef.hamidi@teal-tech.com',
        firstName: 'Youssef',
        lastName: 'Hamidi',
        role: 'employee',
        department: 'Design',
        position: 'UX/UI Designer',
        hireDate: '2023-02-01',
        isActive: true,
        salary: 50000,
        managerId: 'current-manager',
        skills: ['Figma', 'Adobe XD', 'Prototypage', 'Design System'],
        performance: 4.6
      }
    ];
    setTeamMembers(mockTeamMembers);
  };

  const loadObjectives = async () => {
    try {
      // Simulation de données d'objectifs
      const mockObjectives: Objective[] = [
        {
          id: '1',
          title: 'Améliorer les performances de l\'application',
          description: 'Optimiser les temps de chargement et réduire l\'utilisation mémoire de 30%',
          employeeId: '1',
          employeeName: 'Meryem Hamidi',
          category: 'performance',
          priority: 'high',
          status: 'in_progress',
          startDate: '2024-01-15',
          dueDate: '2024-03-15',
          progress: 65,
          managerId: 'mgr1',
          managerName: 'Manager Test'
        } as Objective,
        {
          id: '2',
          title: 'Formation React Native',
          description: 'Suivre une formation complète sur React Native pour développer des applications mobiles',
          employeeId: '2',
          employeeName: 'Kenza Hamidi',
          category: 'development',
          priority: 'medium',
          status: 'in_progress',
          startDate: '2024-02-01',
          dueDate: '2024-04-01',
          progress: 40,
          managerId: 'mgr1',
          managerName: 'Manager Test'
        } as Objective,
        {
          id: '3',
          title: 'Migration vers PostgreSQL',
          description: 'Migrer la base de données de MySQL vers PostgreSQL pour améliorer les performances',
          employeeId: '3',
          employeeName: 'Simo Hamidi',
          category: 'project',
          priority: 'high',
          status: 'completed',
          startDate: '2023-12-01',
          dueDate: '2024-01-31',
          progress: 100,
          completedDate: '2024-01-28',
          managerId: 'mgr1',
          managerName: 'Manager Test'
        } as Objective,
        {
          id: '4',
          title: 'Refonte du design system',
          description: 'Créer un nouveau design system cohérent pour toutes les applications',
          employeeId: '4',
          employeeName: 'Youssef Hamidi',
          category: 'project',
          priority: 'medium',
          status: 'not_started',
          startDate: '2024-03-01',
          dueDate: '2024-05-01',
          progress: 0,
          managerId: 'mgr1',
          managerName: 'Manager Test'
        } as Objective,
        {
          id: '5',
          title: 'Améliorer la communication d\'équipe',
          description: 'Participer activement aux réunions et améliorer la collaboration',
          employeeId: '1',
          employeeName: 'Meryem Hamidi',
          category: 'behavioral',
          priority: 'low',
          status: 'overdue',
          startDate: '2023-11-01',
          dueDate: '2024-01-01',
          progress: 20,
          managerId: 'mgr1',
          managerName: 'Manager Test'
        } as Objective
      ];
      setObjectives(mockObjectives);
    } catch (error) {
      console.error('Erreur lors du chargement des objectifs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcul des statistiques
  const objectiveStats = {
    total: objectives.length,
    completed: objectives.filter(obj => obj.status === 'completed').length,
    inProgress: objectives.filter(obj => obj.status === 'in_progress').length,
    overdue: objectives.filter(obj => obj.status === 'overdue').length,
    averageProgress: objectives.length > 0 ? objectives.reduce((sum, obj) => sum + obj.progress, 0) / objectives.length : 0
  };

  // Filtrage des objectifs
  const filteredObjectives = objectives.filter(objective => {
    const matchesSearch = objective.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         objective.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         objective.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || objective.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || objective.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'completed': { label: 'Terminé', color: 'bg-green-100 text-green-800' },
      'in_progress': { label: 'En cours', color: 'bg-blue-100 text-blue-800' },
      'not_started': { label: 'Non démarré', color: 'bg-gray-100 text-gray-800' },
      'overdue': { label: 'En retard', color: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.not_started;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'high': { label: 'Élevée', color: 'bg-red-100 text-red-800' },
      'medium': { label: 'Moyenne', color: 'bg-yellow-100 text-yellow-800' },
      'low': { label: 'Faible', color: 'bg-gray-100 text-gray-800' }
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance':
        return <ChartBarIcon className="h-5 w-5 text-teal-600" />;
      case 'development':
        return <FlagIcon className="h-5 w-5 text-teal-600" />;
      case 'project':
        return <CalendarIcon className="h-5 w-5 text-teal-600" />;
      case 'behavioral':
        return <CheckCircleIcon className="h-5 w-5 text-teal-600" />;
      default:
        return <FlagIcon className="h-5 w-5 text-teal-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
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
            Objectifs de l'Équipe
          </h1>
          <p className="text-gray-600 mt-1">
            Suivi et gestion des objectifs de votre équipe
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nouvel objectif
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FlagIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{objectiveStats.total}</p>
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
              <p className="text-2xl font-bold text-gray-900">{objectiveStats.inProgress}</p>
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
              <p className="text-2xl font-bold text-gray-900">{objectiveStats.completed}</p>
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
              <p className="text-2xl font-bold text-gray-900">{objectiveStats.overdue}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Progression</p>
              <p className="text-2xl font-bold text-gray-900">{objectiveStats.averageProgress.toFixed(0)}%</p>
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
                placeholder="Rechercher par titre, employé ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input-field"
          >
            <option value="all">Tous les statuts</option>
            <option value="not_started">Non démarré</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminé</option>
            <option value="overdue">En retard</option>
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="input-field"
          >
            <option value="all">Toutes les priorités</option>
            <option value="high">Élevée</option>
            <option value="medium">Moyenne</option>
            <option value="low">Faible</option>
          </select>
        </div>
      </div>

      {/* Liste des objectifs */}
      <div className="space-y-4">
        {filteredObjectives.map((objective) => (
          <div key={objective.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    {getCategoryIcon(objective.category)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {objective.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {objective.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Assigné à: <span className="font-medium">{objective.employeeName}</span></span>
                      <span>Échéance: {new Date(objective.dueDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getPriorityBadge(objective.priority)}
                  {getStatusBadge(objective.status)}
                </div>
              </div>

              {/* Barre de progression */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progression</span>
                  <span>{objective.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      objective.progress === 100 ? 'bg-green-500' :
                      objective.progress >= 75 ? 'bg-blue-500' :
                      objective.progress >= 50 ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${objective.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Début: {new Date(objective.startDate).toLocaleDateString('fr-FR')}
                  </div>
                  {objective.completedDate && (
                    <div className="flex items-center text-green-600">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Terminé le {new Date(objective.completedDate).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setSelectedObjective(objective);
                      setShowDetailsModal(true);
                    }}
                    className="text-teal-600 hover:text-teal-900 p-1 rounded"
                    title="Voir détails"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedObjective(objective);
                      setShowEditModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                    title="Modifier l'objectif"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredObjectives.length === 0 && (
        <div className="text-center py-12">
          <FlagIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun objectif trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucun objectif ne correspond à vos critères de recherche.
          </p>
        </div>
      )}

      {/* Modal de création d'objectif */}
      <CreateObjectiveModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        teamMembers={teamMembers}
        onCreateObjective={(objectiveData) => {
          setObjectives([...objectives, objectiveData]);
          setShowCreateModal(false);
        }}
      />

      {/* Modal de détails d'objectif */}
      <ObjectiveDetailsModal 
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedObjective(null);
        }}
        objective={selectedObjective}
        onUpdateProgress={(objectiveId, newProgress) => {
          setObjectives(objectives.map(obj => 
            obj.id === objectiveId 
              ? { ...obj, progress: newProgress, status: newProgress === 100 ? 'completed' : 'in_progress' }
              : obj
          ));
        }}
      />

      {/* Modal de modification d'objectif */}
      <EditObjectiveModal 
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedObjective(null);
        }}
        objective={selectedObjective}
        teamMembers={teamMembers}
        onUpdateObjective={(updatedObjective) => {
          setObjectives(objectives.map(obj => 
            obj.id === updatedObjective.id ? updatedObjective : obj
          ));
          showSuccess(
            'Objectif mis à jour',
            `L'objectif "${updatedObjective.title}" a été mis à jour avec succès.`
          );
        }}
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
