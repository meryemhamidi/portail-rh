import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  CalendarIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  ExclamationCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import globalDataService from '../../services/globalDataService';
import NotificationModal from '../common/NotificationModal';
import SalaryPredictionModal from '../hr/SalaryPredictionModal';
import SurveyModal from '../hr/SurveyModal';
import VacationRequestModal from '../hr/VacationRequestModal';
import ContractRenewalModal from '../hr/ContractRenewalModal';
import EvaluationPlanningModal from '../hr/EvaluationPlanningModal';
import { Employee } from '../../types';
import { surveyService, Survey } from '../../services/surveyService';
import { pdfGenerator } from '../../utils/pdfGenerator';
import { downloadManager } from '../../utils/downloadManager';

const HRDashboard: React.FC = () => {
  const { user } = useAuth();
  const { notification, showInfo, showSuccess, hideNotification } = useNotification();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [showVacationModal, setShowVacationModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = globalDataService.getStats();
        setStats(response);
        
        // Charger les sondages
        const surveysData = surveyService.getSurveys();
        setSurveys(surveysData);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleCreateSurvey = (surveyData: Omit<Survey, 'id' | 'createdAt' | 'createdBy'>) => {
    try {
      const newSurvey = surveyService.createSurvey(surveyData, user?.email || 'hr-manager');
      setSurveys([...surveys, newSurvey]);
      showSuccess(
        'Sondage créé avec succès !',
        `Le sondage "${newSurvey.title}" a été créé et ${newSurvey.isActive ? 'est maintenant actif' : 'est en attente d\'activation'}.`
      );
    } catch (error) {
      console.error('Erreur lors de la création du sondage:', error);
      showInfo('Erreur', 'Une erreur est survenue lors de la création du sondage.');
    }
  };

  const handleDownloadHRReport = () => {
    const reportData = {
      totalEmployees: stats?.totalEmployees || 156,
      pendingVacations: stats?.pendingVacations || 12,
      upcomingTrainings: stats?.upcomingTrainings || 8,
      generatedAt: new Date().toISOString(),
      generatedBy: user?.email || 'RH Manager'
    };
    
    downloadManager.downloadHRReport(reportData);
    showSuccess(
      'Rapport téléchargé',
      'Le rapport RH mensuel a été téléchargé au format PDF.'
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Employés',
      value: stats?.totalEmployees || 156,
      icon: UsersIcon,
      color: 'bg-blue-500',
      change: '+3.2%'
    },
    {
      title: 'Congés en Attente',
      value: stats?.pendingVacations || 12,
      icon: CalendarIcon,
      color: 'bg-orange-500',
      change: '+8.1%'
    },
    {
      title: 'Formations Prévues',
      value: stats?.upcomingTrainings || 8,
      icon: AcademicCapIcon,
      color: 'bg-green-500',
      change: '+15.3%'
    },
    {
      title: 'Performance Moyenne',
      value: `${stats?.averagePerformance || 87.5}%`,
      icon: ChartBarIcon,
      color: 'bg-teal-500',
      change: '+2.4%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Ressources Humaines</h1>
          <p className="text-gray-600">Gestion et suivi des ressources humaines</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleDownloadHRReport}
            className="btn-secondary flex items-center"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Exporter rapport
          </button>
          <button 
            onClick={() => setShowSurveyModal(true)}
            className="btn-primary"
          >
            Nouveau sondage
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
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Actions */}
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions en Attente</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center">
                <ExclamationCircleIcon className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Demandes de congé à valider</p>
                  <p className="text-xs text-gray-500">12 demandes en attente</p>
                </div>
              </div>
              <button 
                onClick={() => setShowVacationModal(true)}
                className="text-sm text-teal-primary hover:text-teal-700 font-medium"
              >
                Traiter →
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Contrats à renouveler</p>
                  <p className="text-xs text-gray-500">8 contrats ce mois</p>
                </div>
              </div>
              <button 
                onClick={() => setShowContractModal(true)}
                className="text-sm text-teal-primary hover:text-teal-700 font-medium"
              >
                Voir →
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center">
                <ArrowTrendingUpIcon className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Évaluations annuelles</p>
                  <p className="text-xs text-gray-500">23 évaluations à programmer</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEvaluationModal(true)}
                className="text-sm text-teal-primary hover:text-teal-700 font-medium"
              >
                Planifier →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicateurs Clés</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Taux d'absentéisme</span>
                <span className="text-sm font-medium text-gray-900">3.1%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '96.9%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Turnover</span>
                <span className="text-sm font-medium text-gray-900">8.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Satisfaction</span>
                <span className="text-sm font-medium text-gray-900">4.2/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Budget Formation</span>
                <span className="text-sm font-medium text-gray-900">68.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '68.5%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Nouvelle demande de congé - Kenza Hamidi
              </p>
              <p className="text-sm text-gray-500">
                Congés d'été du 15 au 30 juillet 2024
              </p>
              <p className="text-xs text-gray-400 mt-1">Il y a 5 minutes</p>
            </div>
            <button 
              onClick={() => window.location.href = '/hr/vacations'}
              className="text-sm text-teal-primary hover:text-teal-700 font-medium"
            >
              Traiter
            </button>
          </div>

          <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Formation terminée - Sécurité informatique
              </p>
              <p className="text-sm text-gray-500">
                15 employés ont terminé la formation
              </p>
              <p className="text-xs text-gray-400 mt-1">Il y a 2 heures</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Évaluation soumise - Pierre Dubois
              </p>
              <p className="text-sm text-gray-500">
                Évaluation annuelle 2024 complétée
              </p>
              <p className="text-xs text-gray-400 mt-1">Il y a 4 heures</p>
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

      {/* Modal de création de sondage */}
      <SurveyModal
        isOpen={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        onCreateSurvey={handleCreateSurvey}
      />

      {/* Modal de traitement des congés */}
      <VacationRequestModal
        isOpen={showVacationModal}
        onClose={() => setShowVacationModal(false)}
      />

      {/* Modal de renouvellement des contrats */}
      <ContractRenewalModal
        isOpen={showContractModal}
        onClose={() => setShowContractModal(false)}
      />

      {/* Modal de planification des évaluations */}
      <EvaluationPlanningModal
        isOpen={showEvaluationModal}
        onClose={() => setShowEvaluationModal(false)}
      />
    </div>
  );
};

export default HRDashboard;
