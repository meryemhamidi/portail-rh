import React, { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { VacationRequest } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import globalDataService from '../../services/globalDataService';
import NotificationModal from '../common/NotificationModal';
import VacationDetailModal from '../common/VacationDetailModal';

const VacationsPage: React.FC = () => {
  const { user } = useAuth();
  const { notification, showSuccess, hideNotification } = useNotification();
  const [requests, setRequests] = useState<VacationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [selectedVacation, setSelectedVacation] = useState<VacationRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    type: 'vacation',
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Charger les demandes de l'employé connecté
  useEffect(() => {
    if (user) {
      loadUserRequests();
      
      // S'abonner aux mises à jour
      const handleUpdate = () => loadUserRequests();
      globalDataService.subscribe('vacation_request_updated', handleUpdate);
      
      return () => {
        globalDataService.unsubscribe('vacation_request_updated', handleUpdate);
      };
    }
  }, [user]);

  const loadUserRequests = () => {
    setLoading(true);
    try {
      const userRequests = globalDataService.getVacationRequests({ 
        employeeId: user?.id 
      });
      setRequests(userRequests);
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon className="h-5 w-5" />;
      case 'rejected': return <XCircleIcon className="h-5 w-5" />;
      case 'pending': return <ClockIcon className="h-5 w-5" />;
      default: return <ExclamationTriangleIcon className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vacation': return 'Congés payés';
      case 'sick': return 'Arrêt maladie';
      case 'personal': return 'Congé personnel';
      case 'maternity': return 'Congé maternité';
      case 'paternity': return 'Congé paternité';
      default: return type;
    }
  };

  const handleSubmitRequest = () => {
    if (!user) return;

    const requestData = {
      employeeId: user.id,
      employeeName: `${user.firstName} ${user.lastName}`,
      type: newRequest.type as any,
      startDate: newRequest.startDate,
      endDate: newRequest.endDate,
      days: calculateDays(newRequest.startDate, newRequest.endDate),
      reason: newRequest.reason,
      daysRequested: calculateDays(newRequest.startDate, newRequest.endDate),
      status: 'pending' as any,
      requestDate: new Date().toISOString().split('T')[0]
    };

    // Ajouter la demande via le service global
    const createdRequest = globalDataService.addVacationRequest(requestData);
    
    // Mettre à jour la liste locale
    setRequests([createdRequest, ...requests]);
    
    // Réinitialiser le formulaire
    setNewRequest({ type: 'vacation', startDate: '', endDate: '', reason: '' });
    setShowNewRequest(false);
    
    // Afficher une confirmation
    showSuccess(
      'Demande soumise !', 
      'Votre demande de congé a été soumise avec succès et est en attente de validation.'
    );
  };

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Statistiques
  const stats = {
    totalDays: 25,
    usedDays: requests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.days, 0),
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    approvedRequests: requests.filter(r => r.status === 'approved').length
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
            Mes Congés
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez vos demandes de congés et consultez votre solde
          </p>
        </div>
        <button
          onClick={() => setShowNewRequest(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nouvelle demande
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Solde total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDays} jours</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Jours utilisés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.usedDays} jours</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Jours restants</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDays - stats.usedDays} jours</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire nouvelle demande */}
      {showNewRequest && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouvelle demande de congé</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de congé
              </label>
              <select
                value={newRequest.type}
                onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value })}
                className="input-field"
              >
                <option value="vacation">Congés payés</option>
                <option value="sick">Arrêt maladie</option>
                <option value="personal">Congé personnel</option>
                <option value="maternity">Congé maternité</option>
                <option value="paternity">Congé paternité</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de jours
              </label>
              <input
                type="text"
                value={newRequest.startDate && newRequest.endDate ? 
                  calculateDays(newRequest.startDate, newRequest.endDate) : ''}
                readOnly
                className="input-field bg-gray-50"
                placeholder="Calculé automatiquement"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={newRequest.startDate}
                onChange={(e) => setNewRequest({ ...newRequest, startDate: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={newRequest.endDate}
                onChange={(e) => setNewRequest({ ...newRequest, endDate: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motif (optionnel)
              </label>
              <textarea
                value={newRequest.reason}
                onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                rows={3}
                className="input-field"
                placeholder="Décrivez le motif de votre demande..."
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowNewRequest(false)}
              className="btn-secondary"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmitRequest}
              disabled={!newRequest.startDate || !newRequest.endDate}
              className="btn-primary"
            >
              Soumettre la demande
            </button>
          </div>
        </div>
      )}

      {/* Liste des demandes */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Historique des demandes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Période
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de demande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {getTypeLabel(request.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(request.startDate).toLocaleDateString('fr-FR')} - {' '}
                      {new Date(request.endDate).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{request.days} jour(s)</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1">
                        {request.status === 'approved' ? 'Approuvé' :
                         request.status === 'rejected' ? 'Rejeté' :
                         request.status === 'pending' ? 'En attente' : request.status}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.requestDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => {
                        setSelectedVacation(request);
                        setShowDetailModal(true);
                      }}
                      className="text-teal-600 hover:text-teal-900 flex items-center"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={hideNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        confirmText={notification.confirmText}
      />

      <VacationDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedVacation(null);
        }}
        vacation={selectedVacation}
      />
    </div>
  );
};

export default VacationsPage;
