import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useNotification } from '../../hooks/useNotification';
import { pdfGenerator } from '../../utils/pdfGenerator';

interface Contract {
  id: string;
  employeeName: string;
  position: string;
  department: string;
  contractType: string;
  startDate: string;
  endDate: string;
  salary: number;
  status: 'expiring' | 'renewed' | 'terminated';
  daysUntilExpiry: number;
}

interface ContractRenewalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContractRenewalModal: React.FC<ContractRenewalModalProps> = ({ isOpen, onClose }) => {
  const { showSuccess, showInfo } = useNotification();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadExpiringContracts();
    }
  }, [isOpen]);

  const loadExpiringContracts = () => {
    try {
      // Simuler des contrats à renouveler
      const mockContracts: Contract[] = [
        {
          id: '1',
          employeeName: 'Kenza Hamidi',
          position: 'Développeuse Senior',
          department: 'IT',
          contractType: 'CDI',
          startDate: '2022-03-15',
          endDate: '2024-03-15',
          salary: 45000,
          status: 'expiring',
          daysUntilExpiry: 15
        },
        {
          id: '2',
          employeeName: 'Simo Benali',
          position: 'Chef de Projet',
          department: 'Management',
          contractType: 'CDD',
          startDate: '2023-01-10',
          endDate: '2024-04-10',
          salary: 42000,
          status: 'expiring',
          daysUntilExpiry: 45
        },
        {
          id: '3',
          employeeName: 'Youssef Alami',
          position: 'Consultant RH',
          department: 'RH',
          contractType: 'Freelance',
          startDate: '2023-06-01',
          endDate: '2024-03-20',
          salary: 38000,
          status: 'expiring',
          daysUntilExpiry: 20
        },
        {
          id: '4',
          employeeName: 'Fatima Zahra',
          position: 'Analyste Marketing',
          department: 'Marketing',
          contractType: 'CDD',
          startDate: '2023-02-15',
          endDate: '2024-03-25',
          salary: 35000,
          status: 'expiring',
          daysUntilExpiry: 25
        }
      ];
      setContracts(mockContracts);
    } catch (error) {
      console.error('Erreur lors du chargement des contrats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRenewContract = (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    if (contract) {
      setContracts(contracts.map(c => 
        c.id === contractId ? { ...c, status: 'renewed' as const } : c
      ));
      showSuccess(
        'Contrat renouvelé',
        `Le contrat de ${contract.employeeName} a été marqué pour renouvellement.`
      );
    }
  };

  const handleTerminateContract = (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    if (contract) {
      setContracts(contracts.map(c => 
        c.id === contractId ? { ...c, status: 'terminated' as const } : c
      ));
      showInfo(
        'Contrat terminé',
        `Le contrat de ${contract.employeeName} a été marqué pour non-renouvellement.`
      );
    }
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 15) return 'bg-red-100 text-red-800 border-red-200';
    if (days <= 30) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getUrgencyIcon = (days: number) => {
    if (days <= 15) return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
    if (days <= 30) return <ClockIcon className="h-5 w-5 text-yellow-600" />;
    return <CalendarIcon className="h-5 w-5 text-blue-600" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'renewed': return 'bg-green-100 text-green-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      case 'expiring': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const expiringContracts = contracts.filter(c => c.status === 'expiring');
  const processedContracts = contracts.filter(c => c.status !== 'expiring');

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
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full"
            >
              {/* Header */}
              <div className="bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <DocumentTextIcon className="h-6 w-6 text-teal-600 mr-2" />
                    Contrats à Renouveler
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {expiringContracts.length} contrat{expiringContracts.length > 1 ? 's' : ''} nécessite{expiringContracts.length > 1 ? 'nt' : ''} une attention
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
                    {/* Contrats expirant */}
                    {expiringContracts.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                          <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
                          Contrats expirant bientôt
                        </h4>
                        <div className="space-y-3">
                          {expiringContracts.map((contract) => (
                            <motion.div
                              key={contract.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${getUrgencyColor(contract.daysUntilExpiry)}`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center mb-3">
                                    {getUrgencyIcon(contract.daysUntilExpiry)}
                                    <div className="ml-3">
                                      <div className="flex items-center">
                                        <UserIcon className="h-4 w-4 text-gray-500 mr-2" />
                                        <span className="font-medium text-gray-900">{contract.employeeName}</span>
                                        <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-white bg-opacity-50">
                                          {contract.contractType}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-700 mt-1">
                                        {contract.position} • {contract.department}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                                    <div>
                                      <span className="text-gray-600">Début:</span>
                                      <div className="font-medium">{new Date(contract.startDate).toLocaleDateString('fr-FR')}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Fin:</span>
                                      <div className="font-medium">{new Date(contract.endDate).toLocaleDateString('fr-FR')}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Salaire:</span>
                                      <div className="font-medium">{contract.salary.toLocaleString('fr-FR')} DH</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Expire dans:</span>
                                      <div className="font-medium text-red-600">
                                        {contract.daysUntilExpiry} jour{contract.daysUntilExpiry > 1 ? 's' : ''}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col space-y-2 ml-4">
                                  <button
                                    onClick={() => setSelectedContract(contract)}
                                    className="flex items-center px-3 py-1 bg-white bg-opacity-50 text-gray-700 rounded-md hover:bg-opacity-75 transition-colors text-sm"
                                  >
                                    <EyeIcon className="h-4 w-4 mr-1" />
                                    Détails
                                  </button>
                                  <button
                                    onClick={() => handleRenewContract(contract.id)}
                                    className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                                  >
                                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                                    Renouveler
                                  </button>
                                  <button
                                    onClick={() => handleTerminateContract(contract.id)}
                                    className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                                  >
                                    <XMarkIcon className="h-4 w-4 mr-1" />
                                    Terminer
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contrats traités */}
                    {processedContracts.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                          <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                          Récemment traités
                        </h4>
                        <div className="space-y-3">
                          {processedContracts.map((contract) => (
                            <div
                              key={contract.id}
                              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <UserIcon className="h-4 w-4 text-gray-500 mr-2" />
                                  <span className="font-medium text-gray-900">{contract.employeeName}</span>
                                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contract.status)}`}>
                                    {contract.status === 'renewed' ? 'Renouvelé' : 'Terminé'}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {contract.position} • {contract.contractType}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {expiringContracts.length === 0 && processedContracts.length === 0 && (
                      <div className="text-center py-8">
                        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun contrat à renouveler</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Tous les contrats sont à jour pour le moment.
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
                      title: 'Rapport - Contrats à Renouveler',
                      subtitle: `Généré le ${new Date().toLocaleDateString('fr-FR')}`,
                      data: contracts,
                      type: 'contract'
                    });
                    showSuccess('PDF généré', 'Le rapport des contrats a été téléchargé.');
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

export default ContractRenewalModal;
