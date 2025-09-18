import React, { useState } from 'react';
import {
  CloudArrowDownIcon,
  CloudArrowUpIcon,
  TrashIcon,
  InformationCircleIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useStorageInfo, useDataManagement } from '../../hooks/useStorage';
import { useNotification } from '../../hooks/useNotification';
import NotificationModal from '../common/NotificationModal';

const DataManagementPage: React.FC = () => {
  const { info, refreshInfo } = useStorageInfo();
  const { exportData, importData, clearAllData } = useDataManagement();
  const { notification, showSuccess, showWarning, showError, hideNotification } = useNotification();
  const [importing, setImporting] = useState(false);

  const handleExport = () => {
    try {
      exportData();
      showSuccess(
        'Export réussi !',
        'Toutes les données ont été exportées dans un fichier JSON.'
      );
    } catch (error) {
      showError(
        'Erreur d\'export',
        'Une erreur est survenue lors de l\'export des données.'
      );
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const success = await importData(file);
      if (success) {
        refreshInfo();
        showSuccess(
          'Import réussi !',
          'Les données ont été importées avec succès.'
        );
      } else {
        showError(
          'Erreur d\'import',
          'Le fichier sélectionné n\'est pas valide ou est corrompu.'
        );
      }
    } catch (error) {
      showError(
        'Erreur d\'import',
        'Une erreur est survenue lors de l\'import des données.'
      );
    } finally {
      setImporting(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleClearData = () => {
    if (window.confirm('⚠️ ATTENTION ⚠️\n\nCette action supprimera TOUTES les données de l\'application de manière DÉFINITIVE.\n\nÊtes-vous absolument sûr de vouloir continuer ?')) {
      try {
        clearAllData();
        refreshInfo();
        showWarning(
          'Données supprimées',
          'Toutes les données ont été supprimées. L\'application va se recharger avec les données par défaut.'
        );
        // Recharger la page après 2 secondes
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        showError(
          'Erreur de suppression',
          'Une erreur est survenue lors de la suppression des données.'
        );
      }
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTotalSize = () => {
    return info.reduce((total, item) => total + item.size, 0);
  };

  const getTotalItems = () => {
    return info.reduce((total, item) => total + item.items, 0);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <CloudArrowDownIcon className="h-8 w-8 text-teal-600 mr-3" />
            Gestion des Données
          </h1>
          <p className="text-gray-600 mt-1">
            Sauvegarde, restauration et gestion des données de l'application
          </p>
        </div>
      </div>

      {/* Informations de stockage */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <InformationCircleIcon className="h-5 w-5 text-teal-600 mr-2" />
          Informations de Stockage
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-teal-50 rounded-lg p-4">
            <div className="flex items-center">
              <DocumentArrowDownIcon className="h-8 w-8 text-teal-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-teal-600">Total Éléments</p>
                <p className="text-2xl font-bold text-teal-900">{getTotalItems()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <CloudArrowDownIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Taille Totale</p>
                <p className="text-2xl font-bold text-blue-900">{formatBytes(getTotalSize())}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Statut</p>
                <p className="text-2xl font-bold text-green-900">Actif</p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type de Données
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre d'Éléments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taille
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {info.map((item) => (
                <tr key={item.key}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.key}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.items}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatBytes(item.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.items > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.items > 0 ? 'Données présentes' : 'Vide'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions de gestion */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Actions de Gestion
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Export */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <DocumentArrowDownIcon className="h-6 w-6 text-teal-600 mr-2" />
              <h3 className="font-medium text-gray-900">Exporter les Données</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Téléchargez toutes les données dans un fichier JSON de sauvegarde.
            </p>
            <button
              onClick={handleExport}
              className="w-full btn-primary flex items-center justify-center"
            >
              <CloudArrowDownIcon className="h-4 w-4 mr-2" />
              Exporter
            </button>
          </div>

          {/* Import */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <DocumentArrowUpIcon className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="font-medium text-gray-900">Importer les Données</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Restaurez les données depuis un fichier de sauvegarde JSON.
            </p>
            <label className="w-full btn-secondary flex items-center justify-center cursor-pointer">
              <CloudArrowUpIcon className="h-4 w-4 mr-2" />
              {importing ? 'Import en cours...' : 'Importer'}
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                disabled={importing}
              />
            </label>
          </div>

          {/* Suppression */}
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <div className="flex items-center mb-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="font-medium text-gray-900">Zone Dangereuse</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Supprimez toutes les données de l'application. Cette action est irréversible.
            </p>
            <button
              onClick={handleClearData}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Tout Supprimer
            </button>
          </div>
        </div>
      </div>

      {/* Informations importantes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Informations Importantes</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Les données sont stockées localement dans votre navigateur</li>
              <li>• Exportez régulièrement vos données pour éviter toute perte</li>
              <li>• L'import remplace toutes les données existantes</li>
              <li>• La suppression est définitive et ne peut pas être annulée</li>
            </ul>
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
    </div>
  );
};

export default DataManagementPage;
