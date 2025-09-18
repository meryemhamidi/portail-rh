import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FlagIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import NotificationModal from '../common/NotificationModal';
import { useNotification } from '../../hooks/useNotification';
import { dashboardService } from '../../services/api';

const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { notification, showInfo, hideNotification } = useNotification();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats('manager');
        setStats(response);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Membres Équipe',
      value: stats?.totalEmployees || 12,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      change: '+1 nouveau'
    },
    {
      title: 'Objectifs Actifs',
      value: stats?.teamObjectives || 15,
      icon: FlagIcon,
      color: 'bg-green-500',
      change: '8 terminés'
    },
    {
      title: 'Congés en Attente',
      value: stats?.pendingVacations || 3,
      icon: CalendarIcon,
      color: 'bg-orange-500',
      change: 'À valider'
    },
    {
      title: 'Performance Équipe',
      value: `${stats?.averagePerformance || 91.2}%`,
      icon: ChartBarIcon,
      color: 'bg-teal-500',
      change: '+5.2%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Manager</h1>
          <p className="text-gray-600">Suivi et gestion de votre équipe</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => navigate('/manager/reports')}
            className="btn-secondary"
          >
            Rapport équipe
          </button>
          <button 
            onClick={() => navigate('/manager/objectives')}
            className="btn-primary"
          >
            Nouvel objectif
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const getNavigationPath = () => {
            switch(stat.title) {
              case 'Membres Équipe': return '/manager/team';
              case 'Objectifs Actifs': return '/manager/objectives';
              case 'Congés en Attente': return '/manager/planning';
              case 'Performance Équipe': return '/manager/reports';
              default: return '/manager/team';
            }
          };
          
          return (
            <div 
              key={index} 
              className="card cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => navigate(getNavigationPath())}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Overview */}
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vue d'Ensemble Équipe</h3>
          <div className="space-y-4">
            {/* Team Member */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">KH</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Kenza Hamidi</p>
                  <p className="text-xs text-gray-500">Responsable RH</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">94%</p>
                  <p className="text-xs text-gray-500">Performance</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => {
                      showInfo(
                        'Profil de Kenza Hamidi',
                        'Poste: Responsable RH\nDépartement: Ressources Humaines\nPerformance: 94%\nStatut: Actif\nCompétences: Gestion RH, Recrutement, Formation'
                      );
                    }}
                    className="p-1 text-teal-600 hover:text-teal-800 transition-colors"
                    title="Voir le profil"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">SH</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Simo Hamidi</p>
                  <p className="text-xs text-gray-500">Développeur Full-Stack</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">89%</p>
                  <p className="text-xs text-gray-500">Performance</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => {
                      showInfo(
                        'Profil de Simo Hamidi',
                        'Poste: Développeur Full-Stack\nDépartement: Développement\nPerformance: 89%\nStatut: En amélioration\nCompétences: Python, Django, React, PostgreSQL'
                      );
                    }}
                    className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                    title="Voir le profil"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">YH</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Youssef Hamidi</p>
                  <p className="text-xs text-gray-500">UX/UI Designer</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">96%</p>
                  <p className="text-xs text-gray-500">Performance</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => {
                      showInfo(
                        'Profil de Youssef Hamidi',
                        'Poste: UX/UI Designer\nDépartement: Design\nPerformance: 96%\nStatut: Excellent\nCompétences: Figma, Adobe XD, Prototypage, Design System'
                      );
                    }}
                    className="p-1 text-green-600 hover:text-green-800 transition-colors"
                    title="Voir le profil"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/manager/team')}
            className="mt-4 text-sm text-teal-primary hover:text-teal-700 font-medium transition-colors duration-200"
          >
            Voir toute l'équipe →
          </button>
        </div>

        {/* Objectives Progress */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Objectifs Équipe</h3>
          <div className="space-y-4">
            <div className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onClick={() => navigate('/manager/objectives')}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">Migration API v2</span>
                <span className="text-sm text-gray-600">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Échéance: 25 Jan</p>
            </div>

            <div className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onClick={() => navigate('/manager/objectives')}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">Refonte UI</span>
                <span className="text-sm text-gray-600">60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Échéance: 15 Fév</p>
            </div>

            <div className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onClick={() => navigate('/manager/objectives')}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">Tests Automatisés</span>
                <span className="text-sm text-gray-600">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
              <p className="text-xs text-red-500 mt-1">En retard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Objectif "Migration API" mis à jour
                </p>
                <p className="text-xs text-gray-500">Youssef Hamidi - il y a 2 heures</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-teal-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Congé approuvé pour Simo Hamidi
                </p>
                <p className="text-xs text-gray-500">Du 20 au 25 janvier - il y a 3 heures</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CalendarIcon className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Réunion équipe programmée
                </p>
                <p className="text-xs text-gray-500">Demain 14h - Salle de conférence</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertes & Actions</h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg cursor-pointer hover:bg-red-100 transition-colors" onClick={() => navigate('/manager/objectives')}>
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-sm font-medium text-red-800">
                  1 objectif en retard
                </p>
              </div>
              <p className="text-xs text-red-600 mt-1">
                Tests automatisés - échéance dépassée
              </p>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors" onClick={() => navigate('/manager/team')}>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-sm font-medium text-yellow-800">
                  Évaluation à faire
                </p>
              </div>
              <p className="text-xs text-yellow-600 mt-1">
                Évaluation trimestrielle de Sophie
              </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => navigate('/manager/planning')}>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
                <p className="text-sm font-medium text-blue-800">
                  3 demandes de congé
                </p>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                En attente de validation
              </p>
            </div>
          </div>
        </div>
      </div>

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

export default ManagerDashboard;
