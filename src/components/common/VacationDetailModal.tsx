import React from 'react';
import Modal from './Modal';
import { 
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { VacationRequest } from '../../types';

interface VacationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacation: VacationRequest | null;
}

const VacationDetailModal: React.FC<VacationDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  vacation 
}) => {
  if (!vacation) return null;

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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'pending': return 'En attente';
      default: return status;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Détails de la demande de congé" size="md">
      <div className="space-y-6">
        {/* En-tête avec statut */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarIcon className="h-6 w-6 text-teal-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              {getTypeLabel(vacation.type)}
            </h3>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vacation.status)}`}>
            {getStatusIcon(vacation.status)}
            <span className="ml-1">{getStatusText(vacation.status)}</span>
          </span>
        </div>

        {/* Informations principales */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Période</p>
                <p className="text-sm text-gray-900">
                  Du {formatDate(vacation.startDate)} au {formatDate(vacation.endDate)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Durée</p>
                <p className="text-sm text-gray-900">{vacation.days} jour(s)</p>
              </div>
            </div>
          </div>

          {vacation.reason && (
            <div className="flex items-start">
              <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Raison</p>
                <p className="text-sm text-gray-900">{vacation.reason}</p>
              </div>
            </div>
          )}
        </div>

        {/* Informations de traitement */}
        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Date de demande:</span>
            <span className="text-sm text-gray-900">{formatDate(vacation.requestDate)}</span>
          </div>

          {vacation.status !== 'pending' && vacation.approvedBy && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Traité par:</span>
                <span className="text-sm text-gray-900 flex items-center">
                  <UserIcon className="h-4 w-4 mr-1" />
                  {vacation.approvedBy}
                </span>
              </div>
              
              {vacation.approvedDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Date de traitement:</span>
                  <span className="text-sm text-gray-900">{formatDate(vacation.approvedDate)}</span>
                </div>
              )}
            </>
          )}

          {vacation.comments && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-800 mb-1">Commentaires:</p>
              <p className="text-sm text-blue-700">{vacation.comments}</p>
            </div>
          )}
        </div>

        {/* Bouton de fermeture */}
        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={onClose}
            className="btn-primary bg-teal-600 hover:bg-teal-700"
          >
            OK
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default VacationDetailModal;
