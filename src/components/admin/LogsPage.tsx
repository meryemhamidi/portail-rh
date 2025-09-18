import React, { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon, 
  ExclamationTriangleIcon,
  EyeIcon,
  ClockIcon,
  ComputerDesktopIcon,
  UserIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface SecurityLog {
  id: string;
  timestamp: string;
  type: 'login' | 'logout' | 'failed_login' | 'permission_change' | 'data_access' | 'system_change';
  user: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details?: string;
}

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [selectedLog, setSelectedLog] = useState<SecurityLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      // Simulation de données de logs
      const mockLogs: SecurityLog[] = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          type: 'failed_login',
          user: 'Inconnu',
          action: 'Tentative de connexion échouée',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          severity: 'high',
          details: '3 tentatives de connexion échouées détectées'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: 'login',
          user: 'admin@teal-tech.com',
          action: 'Connexion réussie',
          ipAddress: '192.168.1.50',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          severity: 'low'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          type: 'permission_change',
          user: 'admin@teal-tech.com',
          action: 'Modification des permissions utilisateur',
          ipAddress: '192.168.1.50',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          severity: 'medium',
          details: 'Permissions modifiées pour hr@teal-tech.com'
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          type: 'data_access',
          user: 'hr@teal-tech.com',
          action: 'Accès aux données employés',
          ipAddress: '192.168.1.75',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          severity: 'low'
        }
      ];
      setLogs(mockLogs);
    } catch (error) {
      console.error('Erreur lors du chargement des logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    const labels = {
      low: 'Faible',
      medium: 'Moyen',
      high: 'Élevé',
      critical: 'Critique'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[severity as keyof typeof colors]}`}>
        {labels[severity as keyof typeof labels]}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      login: UserIcon,
      logout: UserIcon,
      failed_login: ExclamationTriangleIcon,
      permission_change: ShieldCheckIcon,
      data_access: EyeIcon,
      system_change: ComputerDesktopIcon
    };
    const Icon = icons[type as keyof typeof icons] || UserIcon;
    return <Icon className="h-5 w-5" />;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      login: 'Connexion',
      logout: 'Déconnexion',
      failed_login: 'Échec connexion',
      permission_change: 'Changement permissions',
      data_access: 'Accès données',
      system_change: 'Modification système'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const handleLogClick = (log: SecurityLog) => {
    setSelectedLog(log);
    setShowDetails(true);
  };

  const handleExportLogs = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Horodatage,Type,Utilisateur,Action,IP,Sévérité\n" +
      filteredLogs.map(log => 
        `${new Date(log.timestamp).toLocaleString('fr-FR')},${getTypeLabel(log.type)},${log.user},${log.action},${log.ipAddress},${log.severity}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `logs_securite_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBlockIP = (ipAddress: string) => {
    alert(`IP ${ipAddress} bloquée avec succès`);
    // Ici on ajouterait la logique pour bloquer l'IP
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm);
    const matchesType = selectedType === 'all' || log.type === selectedType;
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
    return matchesSearch && matchesType && matchesSeverity;
  });

  const securityStats = {
    total: logs.length,
    critical: logs.filter(l => l.severity === 'critical').length,
    high: logs.filter(l => l.severity === 'high').length,
    failedLogins: logs.filter(l => l.type === 'failed_login').length
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
            <ShieldCheckIcon className="h-8 w-8 text-teal-primary mr-3" />
            Logs & Sécurité
          </h1>
          <p className="text-gray-600 mt-1">
            Surveillance et analyse des événements de sécurité
          </p>
        </div>
      </div>

      {/* Statistiques de sécurité */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total événements</p>
              <p className="text-2xl font-bold text-gray-900">{securityStats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critiques</p>
              <p className="text-2xl font-bold text-gray-900">{securityStats.critical}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShieldCheckIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Élevés</p>
              <p className="text-2xl font-bold text-gray-900">{securityStats.high}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Échecs connexion</p>
              <p className="text-2xl font-bold text-gray-900">{securityStats.failedLogins}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alertes de sécurité */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                3 tentatives de connexion échouées détectées depuis l'IP 192.168.1.100
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Dernière tentative il y a 5 minutes</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleBlockIP('192.168.1.100')}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium"
          >
            Bloquer IP
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="     Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="input-field"
          >
            <option value="all">Tous les types</option>
            <option value="login">Connexions</option>
            <option value="failed_login">Échecs connexion</option>
            <option value="permission_change">Changements permissions</option>
            <option value="data_access">Accès données</option>
            <option value="system_change">Modifications système</option>
          </select>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="input-field"
          >
            <option value="all">Toutes les sévérités</option>
            <option value="low">Faible</option>
            <option value="medium">Moyen</option>
            <option value="high">Élevé</option>
            <option value="critical">Critique</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field"
          >
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="all">Tout</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Actions rapides</h3>
          <div className="flex space-x-3">
            <button
              onClick={handleExportLogs}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Exporter les logs
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* Table des logs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horodatage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sévérité
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleLogClick(log)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.timestamp).toLocaleString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-gray-400 mr-2">
                        {getTypeIcon(log.type)}
                      </div>
                      <span className="text-sm text-gray-900">
                        {getTypeLabel(log.type)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.action}
                    {log.details && (
                      <div className="text-xs text-gray-500 mt-1">{log.details}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {log.ipAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getSeverityBadge(log.severity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun log trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucun événement ne correspond à vos critères de recherche.
          </p>
        </div>
      )}

      {/* Modal de détails */}
      {showDetails && selectedLog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Détails du log</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Horodatage</label>
                  <p className="text-sm text-gray-900">{new Date(selectedLog.timestamp).toLocaleString('fr-FR')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="text-sm text-gray-900">{getTypeLabel(selectedLog.type)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Utilisateur</label>
                  <p className="text-sm text-gray-900">{selectedLog.user}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Action</label>
                  <p className="text-sm text-gray-900">{selectedLog.action}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Adresse IP</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">User Agent</label>
                  <p className="text-sm text-gray-900 break-all">{selectedLog.userAgent}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sévérité</label>
                  <div className="mt-1">{getSeverityBadge(selectedLog.severity)}</div>
                </div>
                {selectedLog.details && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Détails</label>
                    <p className="text-sm text-gray-900">{selectedLog.details}</p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => handleBlockIP(selectedLog.ipAddress)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium"
                >
                  Bloquer cette IP
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded font-medium"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogsPage;
