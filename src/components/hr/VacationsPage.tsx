import React, { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  CheckIcon, 
  XMarkIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { VacationRequest } from '../../types';
import globalDataService from '../../services/globalDataService';
import { useNotification } from '../../hooks/useNotification';
import NotificationModal from '../common/NotificationModal';

const VacationsPage: React.FC = () => {
  const { notification, showSuccess, showInfo, hideNotification } = useNotification();
  const [vacations, setVacations] = useState<VacationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadVacations();
  }, []);

  const loadVacations = async () => {
    try {
      setLoading(true);
      
      // Charger toutes les demandes de congés depuis le service global
      const allVacations = globalDataService.getVacationRequests();
      setVacations(allVacations);
      
      // S'abonner aux mises à jour
      const handleUpdate = () => {
        const updatedVacations = globalDataService.getVacationRequests();
        setVacations(updatedVacations);
      };
      
      globalDataService.subscribe('vacation_request_added', handleUpdate);
      globalDataService.subscribe('vacation_request_updated', handleUpdate);
      
    } catch (error) {
      console.error('Erreur lors du chargement des congés:', error);
      // Fallback avec données simulées
      const mockVacations: VacationRequest[] = [
        {
          id: '2',
          employeeId: 'emp2',
          employeeName: 'Kenza Hamidi',
          startDate: '2024-01-20',
          endDate: '2024-01-22',
          type: 'sick',
          reason: 'Maladie - grippe',
          status: 'approved',
          approvedBy: 'hr@teal-tech.com',
          approvedDate: '2024-01-19',
          daysRequested: 2,
          days: 2,
          requestDate: '2024-01-18'
        },
        {
          id: '3',
          employeeId: 'emp3',
          employeeName: 'Lina Hamidi',
          startDate: '2024-03-01',
          endDate: '2024-03-15',
          type: 'paid',
          reason: 'Voyage de noces',
          status: 'rejected',
          approvedBy: 'manager@teal-tech.com',
          approvedDate: '2024-01-10',
          daysRequested: 10,
          days: 10,
          requestDate: '2024-01-05',
          comments: 'Période trop chargée, reporter à avril'
        }
      ];
      setVacations(mockVacations);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (vacationId: string) => {
    try {
      const updatedRequest = globalDataService.updateVacationRequest(vacationId, {
        status: 'approved',
        approvedBy: 'RH Manager',
        approvedDate: new Date().toISOString().split('T')[0]
      });
      
      if (updatedRequest) {
        // Mise à jour locale immédiate
        setVacations(prev => prev.map(v => 
          v.id === vacationId ? updatedRequest : v
        ));
        showSuccess('Demande approuvée', 'La demande de congé a été approuvée avec succès!');
      }
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
    }
  };

  const handleReject = async (vacationId: string) => {
    try {
      const updatedRequest = globalDataService.updateVacationRequest(vacationId, {
        status: 'rejected',
        approvedBy: 'RH Manager',
        approvedDate: new Date().toISOString().split('T')[0],
        comments: 'Demande rejetée par RH'
      });
      
      if (updatedRequest) {
        // Mise à jour locale immédiate
        setVacations(prev => prev.map(v => 
          v.id === vacationId ? updatedRequest : v
        ));
        showInfo('Demande rejetée', 'La demande de congé a été rejetée.');
      }
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
    }
  };

  const filteredVacations = vacations.filter(vacation => {
    const matchesSearch = vacation.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vacation.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || vacation.status === selectedStatus;
    const matchesType = selectedType === 'all' || vacation.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    const labels = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      paid: 'bg-blue-100 text-blue-800',
      unpaid: 'bg-gray-100 text-gray-800',
      sick: 'bg-orange-100 text-orange-800',
      maternity: 'bg-pink-100 text-pink-800',
      paternity: 'bg-purple-100 text-purple-800'
    };
    const labels = {
      paid: 'Congés payés',
      unpaid: 'Sans solde',
      sick: 'Maladie',
      maternity: 'Maternité',
      paternity: 'Paternité'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type as keyof typeof colors]}`}>
        {labels[type as keyof typeof labels]}
      </span>
    );
  };

  const vacationStats = {
    total: vacations.length,
    pending: vacations.filter(v => v.status === 'pending').length,
    approved: vacations.filter(v => v.status === 'approved').length,
    totalDays: vacations.filter(v => v.status === 'approved').reduce((acc, v) => acc + (v.daysRequested || 0), 0)
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
            <CalendarIcon className="h-8 w-8 text-teal-primary mr-3" />
            Gestion des Congés
          </h1>
          <p className="text-gray-600 mt-1">
            Approbation et suivi des demandes de congés
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Demandes</p>
              <p className="text-2xl font-bold text-gray-900">{vacationStats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Attente</p>
              <p className="text-2xl font-bold text-gray-900">{vacationStats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approuvées</p>
              <p className="text-2xl font-bold text-gray-900">{vacationStats.approved}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Jours Approuvés</p>
              <p className="text-2xl font-bold text-gray-900">{vacationStats.totalDays}</p>
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
                placeholder="Rechercher par employé ou motif..."
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
            <option value="pending">En attente</option>
            <option value="approved">Approuvé</option>
            <option value="rejected">Rejeté</option>
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="input-field"
          >
            <option value="all">Tous les types</option>
            <option value="paid">Congés payés</option>
            <option value="unpaid">Sans solde</option>
            <option value="sick">Maladie</option>
            <option value="maternity">Maternité</option>
            <option value="paternity">Paternité</option>
          </select>
        </div>
      </div>

      {/* Table des congés */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Période
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motif
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVacations.map((vacation) => (
                <tr key={vacation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-teal-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {vacation.employeeName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>{new Date(vacation.startDate).toLocaleDateString('fr-FR')}</div>
                      <div className="text-gray-500">au {new Date(vacation.endDate).toLocaleDateString('fr-FR')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(vacation.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vacation.daysRequested || 0} jour{(vacation.daysRequested || 0) > 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(vacation.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {vacation.reason}
                    {vacation.comments && (
                      <div className="text-xs text-gray-500 mt-1">{vacation.comments}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {vacation.status === 'pending' && (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleApprove(vacation.id)}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Approuver"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleReject(vacation.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Rejeter"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    {vacation.status !== 'pending' && vacation.approvedBy && (
                      <div className="text-xs text-gray-500">
                        Par {vacation.approvedBy}
                        <br />
                        {vacation.approvedDate && new Date(vacation.approvedDate).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredVacations.length === 0 && (
        <div className="text-center py-12">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune demande trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucune demande de congé ne correspond à vos critères.
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
    </div>
  );
};

export default VacationsPage;
