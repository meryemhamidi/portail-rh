import React, { useState } from 'react';
import Modal from '../common/Modal';
import { VacationRequest } from '../../types';
import { 
  CheckCircleIcon, 
  XCircleIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: VacationRequest | null;
  onApprove: (requestId: string, comments?: string) => void;
  onReject: (requestId: string, comments: string) => void;
}

const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({ 
  isOpen, 
  onClose, 
  request,
  onApprove,
  onReject 
}) => {
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [comments, setComments] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!request) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (action === 'approve') {
      onApprove(request.id, comments);
    } else if (action === 'reject') {
      onReject(request.id, comments);
    }
    handleClose();
  };

  const handleClose = () => {
    setAction(null);
    setComments('');
    setShowConfirmation(false);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDays = () => {
    const start = new Date(request.startDate);
    const end = new Date(request.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (showConfirmation) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Confirmation" size="md">
        <div className="text-center py-6">
          <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
            action === 'approve' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {action === 'approve' ? (
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            ) : (
              <XCircleIcon className="h-6 w-6 text-red-600" />
            )}
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-medium text-gray-900">
              {action === 'approve' ? 'Approuver la demande' : 'Rejeter la demande'}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Êtes-vous sûr de vouloir {action === 'approve' ? 'approuver' : 'rejeter'} cette demande de congé ?
              </p>
              <p className="text-sm font-medium text-gray-900 mt-2">
                {request.employeeId} - {calculateDays()} jour(s)
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setShowConfirmation(false)}
            className="btn-secondary"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={action === 'approve' ? 'btn-primary' : 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium'}
          >
            {action === 'approve' ? 'Approuver' : 'Rejeter'}
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Demande de Congé" size="lg">
      <div className="space-y-6">
        {/* En-tête de la demande */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Demande #{request.id}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Soumise le {formatDate(request.requestDate)}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
              {request.status === 'pending' ? 'En attente' : 
               request.status === 'approved' ? 'Approuvée' : 'Rejetée'}
            </span>
          </div>
        </div>

        {/* Détails de la demande */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarIcon className="h-4 w-4 inline mr-1" />
                Période demandée
              </label>
              <div className="bg-white border rounded-lg p-3">
                <div className="text-sm">
                  <p><strong>Du :</strong> {formatDate(request.startDate)}</p>
                  <p><strong>Au :</strong> {formatDate(request.endDate)}</p>
                  <p className="text-teal-600 font-medium mt-2">
                    <ClockIcon className="h-4 w-4 inline mr-1" />
                    {calculateDays()} jour(s) de congé
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DocumentTextIcon className="h-4 w-4 inline mr-1" />
                Motif
              </label>
              <div className="bg-white border rounded-lg p-3">
                <p className="text-sm text-gray-900">{request.reason}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Informations employé</h4>
              <div className="text-sm text-blue-800">
                <p><strong>ID :</strong> {request.employeeId}</p>
                <p><strong>Demande soumise :</strong> {formatDate(request.requestDate)}</p>
              </div>
            </div>

            {request.status === 'approved' && request.approvedBy && (
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-900 mb-2">Approuvée par</h4>
                <div className="text-sm text-green-800">
                  <p>{request.approvedBy}</p>
                  <p>Le {(request as any).approvalDate ? formatDate((request as any).approvalDate) : 'N/A'}</p>
                </div>
              </div>
            )}

            {request.comments && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Commentaires</h4>
                <p className="text-sm text-gray-700">{request.comments}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions (seulement si en attente) */}
        {request.status === 'pending' && (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commentaires (optionnel)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Ajoutez vos commentaires..."
                rows={3}
                className="input-field"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setAction('reject');
                  if (!comments.trim()) {
                    setComments('Demande rejetée');
                  }
                  setShowConfirmation(true);
                }}
                className="flex items-center px-4 py-2 border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 rounded-md text-sm font-medium"
              >
                <XCircleIcon className="h-4 w-4 mr-2" />
                Rejeter
              </button>
              <button
                type="button"
                onClick={() => {
                  setAction('approve');
                  setShowConfirmation(true);
                }}
                className="btn-primary flex items-center"
              >
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Approuver
              </button>
            </div>
          </form>
        )}

        {/* Actions de fermeture pour les demandes déjà traitées */}
        {request.status !== 'pending' && (
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LeaveRequestModal;
