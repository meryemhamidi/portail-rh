import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  CalendarIcon,
  UserIcon,
  CheckIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import globalDataService from '../../services/globalDataService';
import { useNotification } from '../../hooks/useNotification';
import { pdfGenerator } from '../../utils/pdfGenerator';

interface VacationRequest {
  id: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  type: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  days: number;
}

interface VacationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VacationRequestModal: React.FC<VacationRequestModalProps> = ({ isOpen, onClose }) => {
  const { showSuccess, showInfo } = useNotification();
  const [requests, setRequests] = useState<VacationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<VacationRequest | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadPendingRequests();
    }
  }, [isOpen]);

  const loadPendingRequests = () => {
    try {
      // Simuler des demandes de congé en attente
      const mockRequests: VacationRequest[] = [
        {
          id: '1',
          employeeName: 'Kenza Hamidi',
          startDate: '2024-03-15',
          endDate: '2024-03-22',
          type: 'Congés payés',
          reason: 'Vacances familiales',
          status: 'pending',
          requestDate: '2024-02-28',
          days: 6
        },
        {
          id: '2',
          employeeName: 'Simo Benali',
          startDate: '2024-03-20',
          endDate: '2024-03-21',
          type: 'Congé maladie',
          reason: 'Rendez-vous médical',
          status: 'pending',
          requestDate: '2024-03-01',
          days: 2
        },
        {
          id: '3',
          employeeName: 'Youssef Alami',
          startDate: '2024-04-01',
          endDate: '2024-04-05',
          type: 'Congés payés',
          reason: 'Voyage personnel',
          status: 'pending',
          requestDate: '2024-02-25',
          days: 5
        },
        {
          id: '4',
          employeeName: 'Fatima Zahra',
          startDate: '2024-03-25',
          endDate: '2024-03-26',
          type: 'Congé personnel',
          reason: 'Événement familial',
          status: 'pending',
          requestDate: '2024-03-02',
          days: 2
        }
      ];
      setRequests(mockRequests);
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      setRequests(requests.map(r => 
        r.id === requestId ? { ...r, status: 'approved' as const } : r
      ));
      showSuccess(
        'Demande approuvée',
        `La demande de congé de ${request.employeeName} a été approuvée.`
      );
    }
  };

  const handleReject = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      setRequests(requests.map(r => 
        r.id === requestId ? { ...r, status: 'rejected' as const } : r
      ));
      showInfo(
        'Demande rejetée',
        `La demande de congé de ${request.employeeName} a été rejetée.`
      );
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Congés payés': return 'bg-green-100 text-green-800';
      case 'Congé maladie': return 'bg-red-100 text-red-800';
      case 'Congé personnel': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
            >
              {/* Header */}
              <div className="bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <CalendarIcon className="h-6 w-6 text-teal-600 mr-2" />
                    Demandes de Congé à Traiter
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {pendingRequests.length} demande{pendingRequests.length > 1 ? 's' : ''} en attente de validation
                </p>
              </div>

              {/* Content */}
              <div className="bg-white px-6 py-6 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Demandes en attente */}
                    {pendingRequests.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                          <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
                          En attente de validation
                        </h4>
                        <div className="space-y-3">
                          {pendingRequests.map((request) => (
                            <motion.div
                              key={request.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center mb-2">
                                    <UserIcon className="h-4 w-4 text-gray-500 mr-2" />
                                    <span className="font-medium text-gray-900">{request.employeeName}</span>
                                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(request.type)}`}>
                                      {request.type}
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                                    <div className="flex items-center">
                                      <CalendarIcon className="h-4 w-4 mr-1" />
                                      Du {new Date(request.startDate).toLocaleDateString('fr-FR')}
                                    </div>
                                    <div className="flex items-center">
                                      <CalendarIcon className="h-4 w-4 mr-1" />
                                      Au {new Date(request.endDate).toLocaleDateString('fr-FR')}
                                    </div>
                                    <div>
                                      <strong>{request.days}</strong> jour{request.days > 1 ? 's' : ''}
                                    </div>
                                    <div>
                                      Demandé le {new Date(request.requestDate).toLocaleDateString('fr-FR')}
                                    </div>
                                  </div>

                                  <div className="flex items-start">
                                    <DocumentTextIcon className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                                    <span className="text-sm text-gray-700">{request.reason}</span>
                                  </div>
                                </div>

                                <div className="flex space-x-2 ml-4">
                                  <button
                                    onClick={() => handleApprove(request.id)}
                                    className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                                  >
                                    <CheckIcon className="h-4 w-4 mr-1" />
                                    Approuver
                                  </button>
                                  <button
                                    onClick={() => handleReject(request.id)}
                                    className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                                  >
                                    <XCircleIcon className="h-4 w-4 mr-1" />
                                    Rejeter
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Demandes traitées */}
                    {processedRequests.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                          <CheckIcon className="h-5 w-5 text-green-600 mr-2" />
                          Récemment traitées
                        </h4>
                        <div className="space-y-3">
                          {processedRequests.map((request) => (
                            <div
                              key={request.id}
                              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <UserIcon className="h-4 w-4 text-gray-500 mr-2" />
                                  <span className="font-medium text-gray-900">{request.employeeName}</span>
                                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                                    {request.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {request.days} jour{request.days > 1 ? 's' : ''} • {request.type}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {pendingRequests.length === 0 && processedRequests.length === 0 && (
                      <div className="text-center py-8">
                        <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune demande</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Il n'y a actuellement aucune demande de congé à traiter.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between">
                <button
                  onClick={() => {
                    pdfGenerator.generatePDF({
                      title: 'Rapport - Demandes de Congé',
                      subtitle: `Généré le ${new Date().toLocaleDateString('fr-FR')}`,
                      data: requests,
                      type: 'list'
                    });
                    showSuccess('PDF généré', 'Le rapport des demandes de congé a été téléchargé.');
                  }}
                  className="btn-primary"
                >
                  Télécharger PDF
                </button>
                <button
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VacationRequestModal;
