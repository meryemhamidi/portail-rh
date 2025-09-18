import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarIcon, 
  DocumentTextIcon, 
  FlagIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { dashboardService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { getAdaptedUserData, getWelcomeMessage } from '../../utils/userDataUtils';

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user) {
          // Utiliser les données adaptées selon l'ancienneté de l'utilisateur
          const adaptedData = getAdaptedUserData(user);
          setStats(adaptedData);
        } else {
          const response = await dashboardService.getStats('employee');
          setStats(response);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Congés Restants',
      value: `${stats?.vacationDaysLeft || 0} jours`,
      icon: CalendarIcon,
      color: 'bg-blue-500',
      subtitle: `${stats?.usedVacationDays || 0} utilisés`
    },
    {
      title: 'Mes Objectifs',
      value: `${stats?.completedObjectives || 0}/${stats?.personalObjectives || 0}`,
      icon: FlagIcon,
      color: 'bg-green-500',
      subtitle: 'Terminés'
    },
    {
      title: 'Formations',
      value: stats?.completedTrainings || 0,
      icon: AcademicCapIcon,
      color: 'bg-purple-500',
      subtitle: 'Complétées'
    },
    {
      title: 'Demandes',
      value: stats?.pendingRequests || 0,
      icon: ClockIcon,
      color: 'bg-orange-500',
      subtitle: 'En attente'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Dashboard</h1>
          <p className="text-gray-600">{user ? getWelcomeMessage(user) : 'Bienvenue dans votre espace personnel'}</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => navigate('/employee/documents')}
            className="btn-secondary"
          >
            Mes documents
          </button>
          <button 
            onClick={() => navigate('/employee/vacations')}
            className="btn-primary"
          >
            Nouvelle demande
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Objectives */}
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mes Objectifs</h3>
          <div className="space-y-4">
            {stats?.objectives && stats.objectives.length > 0 ? (
              stats.objectives.map((objective: any) => (
                <div key={objective.id} className={`p-4 border rounded-lg ${
                  objective.status === 'completed' ? 'bg-green-50 border-green-200' :
                  objective.status === 'in_progress' ? 'bg-blue-50 border-blue-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{objective.title}</h4>
                    {objective.status === 'completed' ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : objective.status === 'in_progress' ? (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">En cours</span>
                    ) : (
                      <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${
                        objective.status === 'completed' ? 'bg-green-500' :
                        objective.status === 'in_progress' ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`} 
                      style={{ width: `${objective.progress}%` }}
                    ></div>
                  </div>
                  <p className={`text-xs ${
                    objective.status === 'completed' ? 'text-green-600' :
                    objective.status === 'in_progress' ? 'text-blue-600' :
                    'text-yellow-600'
                  }`}>
                    {objective.status === 'completed' ? 
                      `Terminé le ${new Date(objective.dueDate).toLocaleDateString('fr-FR')}` :
                      `${objective.progress}% complété - Échéance: ${new Date(objective.dueDate).toLocaleDateString('fr-FR')}`
                    }
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FlagIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun objectif assigné</h4>
                <p className="text-gray-600 mb-4">
                  Vos objectifs apparaîtront ici une fois qu'ils seront définis par votre manager.
                </p>
                <p className="text-sm text-gray-500">
                  En attendant, prenez le temps de vous familiariser avec votre environnement de travail.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/employee/vacations')}
              className="w-full flex items-center p-3 text-left bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors"
            >
              <CalendarIcon className="h-5 w-5 text-teal-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-teal-900">Demander des congés</p>
                <p className="text-xs text-teal-600">{stats?.vacationDaysLeft || 25} jours disponibles</p>
              </div>
            </button>

            <button 
              onClick={() => navigate('/employee/documents')}
              className="w-full flex items-center p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-900">Mes documents</p>
                <p className="text-xs text-blue-600">Fiches de paie, contrats</p>
              </div>
            </button>

            <button 
              onClick={() => navigate('/employee/trainings')}
              className="w-full flex items-center p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
            >
              <AcademicCapIcon className="h-5 w-5 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-purple-900">Formations</p>
                <p className="text-xs text-purple-600">Catalogue disponible</p>
              </div>
            </button>

            <button 
              onClick={() => navigate('/employee/objectives')}
              className="w-full flex items-center p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
            >
              <ChartBarIcon className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-900">Mon évaluation</p>
                <p className="text-xs text-green-600">Voir mes performances</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
          <div className="space-y-3">
            {stats?.notifications && stats.notifications.length > 0 ? (
              stats.notifications.map((notification: any) => (
                <div key={notification.id} className={`flex items-start space-x-3 p-3 rounded-lg ${
                  notification.type === 'welcome' ? 'bg-teal-50' :
                  notification.type === 'success' ? 'bg-green-50' :
                  notification.type === 'info' ? 'bg-blue-50' :
                  'bg-yellow-50'
                }`}>
                  {notification.type === 'welcome' ? (
                    <CheckCircleIcon className="h-5 w-5 text-teal-500 mt-0.5" />
                  ) : notification.type === 'success' ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : notification.type === 'info' ? (
                    <AcademicCapIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                  ) : (
                    <ExclamationCircleIcon className="h-5 w-5 text-yellow-500 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.timestamp).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">Aucune notification pour le moment</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prochains Événements</h3>
          <div className="space-y-3">
            {stats?.upcomingEvents && stats.upcomingEvents.length > 0 ? (
              stats.upcomingEvents.map((event: any) => (
                <div key={event.id} className={`flex items-center space-x-3 p-3 border-l-4 rounded-lg ${
                  event.type === 'meeting' ? 'border-teal-500 bg-teal-50' :
                  event.type === 'training' ? 'border-blue-500 bg-blue-50' :
                  'border-green-500 bg-green-50'
                }`}>
                  {event.type === 'meeting' ? (
                    <CalendarIcon className="h-5 w-5 text-teal-600" />
                  ) : event.type === 'training' ? (
                    <AcademicCapIcon className="h-5 w-5 text-blue-600" />
                  ) : (
                    <FlagIcon className="h-5 w-5 text-green-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <CalendarIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Aucun événement programmé</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
