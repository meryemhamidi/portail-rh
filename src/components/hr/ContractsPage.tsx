import React, { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  PlusIcon, 
  EyeIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Contract {
  id: string;
  employeeId: string;
  employeeName: string;
  contractType: 'CDI' | 'CDD' | 'Stage' | 'Freelance';
  startDate: string;
  endDate?: string;
  salary: number;
  position: string;
  department: string;
  status: 'active' | 'expired' | 'terminated' | 'draft';
  signedDate?: string;
  renewalDate?: string;
}

const ContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      setLoading(true);
      // Simulation de données de contrats
      const mockContracts: Contract[] = [
        {
          id: '1',
          employeeId: 'emp1',
          employeeName: 'Kenza Hamidi',
          contractType: 'CDI',
          startDate: '2023-01-15',
          salary: 55000,
          position: 'Développeur Senior',
          department: 'Développement',
          status: 'active',
          signedDate: '2023-01-10'
        },
        {
          id: '2',
          employeeId: 'emp2',
          employeeName: 'Kenza Hamidi',
          contractType: 'CDD',
          startDate: '2023-06-01',
          endDate: '2024-05-31',
          salary: 48000,
          position: 'Chef de Projet',
          department: 'Marketing',
          status: 'active',
          signedDate: '2023-05-25',
          renewalDate: '2024-03-01'
        },
        {
          id: '3',
          employeeId: 'emp3',
          employeeName: 'Lina Hamidi',
          contractType: 'Stage',
          startDate: '2024-01-15',
          endDate: '2024-07-15',
          salary: 1200,
          position: 'Stagiaire Développement',
          department: 'Développement',
          status: 'active',
          signedDate: '2024-01-10'
        }
      ];
      setContracts(mockContracts);
    } catch (error) {
      console.error('Erreur lors du chargement des contrats:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || contract.contractType === selectedType;
    const matchesStatus = selectedStatus === 'all' || contract.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      terminated: 'bg-gray-100 text-gray-800',
      draft: 'bg-yellow-100 text-yellow-800'
    };
    const labels = {
      active: 'Actif',
      expired: 'Expiré',
      terminated: 'Résilié',
      draft: 'Brouillon'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      CDI: 'bg-blue-100 text-blue-800',
      CDD: 'bg-orange-100 text-orange-800',
      Stage: 'bg-purple-100 text-purple-800',
      Freelance: 'bg-teal-100 text-teal-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type as keyof typeof colors]}`}>
        {type}
      </span>
    );
  };

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setShowContractModal(true);
  };

  const handleEditContract = (contract: Contract) => {
    setSelectedContract(contract);
    setShowEditModal(true);
  };

  const handleDownloadContract = (contract: Contract) => {
    // Simulation du téléchargement
    const element = document.createElement('a');
    const fileContent = `Contrat de travail\n\nEmployé: ${contract.employeeName}\nType: ${contract.contractType}\nPoste: ${contract.position}\nSalaire: ${contract.salary} DH\nDate de début: ${contract.startDate}`;
    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `contrat_${contract.employeeName.replace(' ', '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCreateContract = () => {
    setShowCreateModal(true);
  };

  const closeModals = () => {
    setShowContractModal(false);
    setShowEditModal(false);
    setShowCreateModal(false);
    setSelectedContract(null);
  };

  const contractStats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    expiringSoon: contracts.filter(c => 
      c.endDate && new Date(c.endDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    ).length,
    cdi: contracts.filter(c => c.contractType === 'CDI').length
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
            <DocumentTextIcon className="h-8 w-8 text-teal-primary mr-3" />
            Gestion des Contrats
          </h1>
          <p className="text-gray-600 mt-1">
            Suivi et gestion des contrats de travail
          </p>
        </div>
        <button 
          onClick={handleCreateContract}
          className="btn-primary flex items-center hover:bg-teal-700 transition-colors duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nouveau contrat
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Contrats</p>
              <p className="text-2xl font-bold text-gray-900">{contractStats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{contractStats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expirent bientôt</p>
              <p className="text-2xl font-bold text-gray-900">{contractStats.expiringSoon}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">CDI</p>
              <p className="text-2xl font-bold text-gray-900">{contractStats.cdi}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alertes */}
      {contractStats.expiringSoon > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex">
            <ClockIcon className="h-5 w-5 text-orange-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">
                {contractStats.expiringSoon} contrat(s) expire(nt) dans les 30 prochains jours
              </h3>
              <p className="text-sm text-orange-700 mt-1">
                Vérifiez les renouvellements nécessaires pour éviter les interruptions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par employé, poste ou département..."
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
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Stage">Stage</option>
            <option value="Freelance">Freelance</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input-field"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="expired">Expiré</option>
            <option value="terminated">Résilié</option>
            <option value="draft">Brouillon</option>
          </select>
        </div>
      </div>

      {/* Table des contrats */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Période
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salaire
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Signature
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-teal-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {contract.employeeName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {contract.position} - {contract.department}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(contract.contractType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>Début: {new Date(contract.startDate).toLocaleDateString('fr-FR')}</div>
                      {contract.endDate && (
                        <div className="text-gray-500">
                          Fin: {new Date(contract.endDate).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.salary.toLocaleString('fr-FR')} DH
                    {contract.contractType === 'Stage' && '/mois'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(contract.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.signedDate ? (
                      <div>
                        <div className="text-green-600">✓ Signé</div>
                        <div className="text-xs text-gray-500">
                          {new Date(contract.signedDate).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    ) : (
                      <span className="text-orange-600">En attente</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleViewContract(contract)}
                        className="text-teal-600 hover:text-teal-900 p-1 rounded hover:bg-teal-50 transition-colors duration-200" 
                        title="Voir le contrat"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditContract(contract)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-200" 
                        title="Modifier le contrat"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDownloadContract(contract)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors duration-200" 
                        title="Télécharger le contrat"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredContracts.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun contrat trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucun contrat ne correspond à vos critères de recherche.
          </p>
        </div>
      )}

      {/* Modal de visualisation du contrat */}
      {showContractModal && selectedContract && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <DocumentTextIcon className="h-6 w-6 text-teal-600 mr-2" />
                Détails du Contrat
              </h3>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Informations employé */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <UserIcon className="h-5 w-5 text-teal-600 mr-2" />
                  Informations Employé
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nom complet</label>
                    <p className="text-gray-900">{selectedContract.employeeName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Poste</label>
                    <p className="text-gray-900">{selectedContract.position}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Département</label>
                    <p className="text-gray-900">{selectedContract.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Type de contrat</label>
                    <div className="mt-1">{getTypeBadge(selectedContract.contractType)}</div>
                  </div>
                </div>
              </div>

              {/* Informations contrat */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <CalendarIcon className="h-5 w-5 text-teal-600 mr-2" />
                  Informations Contractuelles
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date de début</label>
                    <p className="text-gray-900">{new Date(selectedContract.startDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                  {selectedContract.endDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date de fin</label>
                      <p className="text-gray-900">{new Date(selectedContract.endDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Salaire</label>
                    <p className="text-gray-900 font-semibold">
                      {selectedContract.salary.toLocaleString('fr-FR')} DH
                      {selectedContract.contractType === 'Stage' && '/mois'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Statut</label>
                    <div className="mt-1">{getStatusBadge(selectedContract.status)}</div>
                  </div>
                  {selectedContract.signedDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date de signature</label>
                      <p className="text-gray-900">{new Date(selectedContract.signedDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                  )}
                  {selectedContract.renewalDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date de renouvellement</label>
                      <p className="text-gray-900">{new Date(selectedContract.renewalDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => handleDownloadContract(selectedContract)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 flex items-center"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Télécharger
                </button>
                <button
                  onClick={() => {
                    closeModals();
                    handleEditContract(selectedContract);
                  }}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200 flex items-center"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition du contrat */}
      {showEditModal && selectedContract && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <PencilIcon className="h-6 w-6 text-blue-600 mr-2" />
                Modifier le Contrat
              </h3>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'employé</label>
                  <input
                    type="text"
                    defaultValue={selectedContract.employeeName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Poste</label>
                  <input
                    type="text"
                    defaultValue={selectedContract.position}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Département</label>
                  <input
                    type="text"
                    defaultValue={selectedContract.department}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de contrat</label>
                  <select
                    defaultValue={selectedContract.contractType}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Stage">Stage</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
                  <input
                    type="date"
                    defaultValue={selectedContract.startDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
                  <input
                    type="date"
                    defaultValue={selectedContract.endDate || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salaire (DH)</label>
                  <input
                    type="number"
                    defaultValue={selectedContract.salary}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select
                    defaultValue={selectedContract.status}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="active">Actif</option>
                    <option value="expired">Expiré</option>
                    <option value="terminated">Résilié</option>
                    <option value="draft">Brouillon</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de création de contrat */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <PlusIcon className="h-6 w-6 text-teal-600 mr-2" />
                Nouveau Contrat
              </h3>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'employé *</label>
                  <input
                    type="text"
                    placeholder="Nom complet"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Poste *</label>
                  <input
                    type="text"
                    placeholder="Intitulé du poste"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Département *</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" required>
                    <option value="">Sélectionner un département</option>
                    <option value="Développement">Développement</option>
                    <option value="Marketing">Marketing</option>
                    <option value="RH">Ressources Humaines</option>
                    <option value="Finance">Finance</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de contrat *</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" required>
                    <option value="">Sélectionner un type</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Stage">Stage</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de début *</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salaire (DH) *</label>
                  <input
                    type="number"
                    placeholder="Montant en dirhams"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="draft">Brouillon</option>
                    <option value="active">Actif</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200"
                >
                  Créer le contrat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractsPage;
