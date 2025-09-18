import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UsersIcon, 
  ShieldCheckIcon, 
  ServerIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { dashboardService } from '../../services/api';
import UserManagement from '../admin/UserManagement';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users'>('dashboard');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats('admin');
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
      title: 'Total Utilisateurs',
      value: stats?.totalEmployees || 0,
      icon: UsersIcon,
      color: 'bg-blue-500',
      change: '+5.2%'
    },
    {
      title: 'Utilisateurs Actifs',
      value: stats?.activeEmployees || 0,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      change: '+2.1%'
    },
    {
      title: 'Alertes Sécurité',
      value: stats?.securityIncidents || 0,
      icon: ShieldCheckIcon,
      color: 'bg-red-500',
      change: '-12.3%'
    },
    {
      title: 'Système',
      value: 'Opérationnel',
      icon: ServerIcon,
      color: 'bg-teal-500',
      change: '99.9%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header avec navigation par onglets */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrateur</h1>
          <p className="text-gray-600">Vue d'ensemble du système Teal Technology Services</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => {
              // Créer les données Excel avec en-têtes
              const excelData = [
                ['Statistiques Administrateur - ' + new Date().toLocaleDateString('fr-FR')],
                [''],
                ['Métrique', 'Valeur', 'Variation'],
                ['Total Utilisateurs', stats?.totalUsers || 0, '-5.2%'],
                ['Utilisateurs Actifs', stats?.activeUsers || 0, '+2.1%'],
                ['Alertes Sécurité', stats?.securityAlerts || 0, '-12.3%'],
                ['Système', 'Opérationnel', '99.9%'],
                [''],
                ['État du Système'],
                ['API Backend', 'Opérationnel'],
                ['Base de données', 'Opérationnel'],
                ['Authentification', 'Opérationnel'],
                ['Stockage', 'Maintenance'],
                [''],
                ['Activité Récente'],
                ['Nouvel utilisateur créé', 'Meryem Hamidi - il y a 5 minutes'],
                ['Sauvegarde terminée', 'Backup automatique - il y a 2 heures'],
                ['Mise à jour système', 'Version 1.2.0 installée - hier']
              ];

              // Convertir en CSV (compatible Excel)
              const csvContent = excelData.map(row => 
                row.map(cell => `"${cell}"`).join(',')
              ).join('\n');

              const blob = new Blob(['\ufeff' + csvContent], { 
                type: 'text/csv;charset=utf-8;' 
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `admin_export_${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="btn-secondary"
          >
            Exporter les données
          </button>
          <button 
            onClick={() => navigate('/admin/settings')}
            className="btn-primary"
          >
            Paramètres système
          </button>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CogIcon className="h-5 w-5" />
              <span>Vue d'ensemble</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <UsersIcon className="h-5 w-5" />
              <span>Gestion des Utilisateurs</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Contenu conditionnel */}
      {activeTab === 'users' ? (
        user && <UserManagement currentUser={user as any} />
      ) : (
        <div className="space-y-6">

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

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">État du Système</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Backend</span>
              <span className="flex items-center text-green-600">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Opérationnel
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Base de données</span>
              <span className="flex items-center text-green-600">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Opérationnel
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Authentification</span>
              <span className="flex items-center text-green-600">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Opérationnel
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Stockage</span>
              <span className="flex items-center text-yellow-600">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                Maintenance
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Nouvel utilisateur créé</p>
                <p className="text-xs text-gray-500">Meryem Hamidi - il y a 5 minutes</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Sauvegarde terminée</p>
                <p className="text-xs text-gray-500">Backup automatique - il y a 2 heures</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Mise à jour système</p>
                <p className="text-xs text-gray-500">Version 1.2.0 installée - hier</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Alerts */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertes de Sécurité</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
            <p className="text-sm text-yellow-800">
              3 tentatives de connexion échouées détectées depuis l'IP 192.168.1.100
            </p>
          </div>
          <button 
            onClick={() => navigate('/admin/logs')}
            className="mt-2 text-sm text-yellow-700 hover:text-yellow-900 font-medium"
          >
            Voir les détails →
          </button>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
