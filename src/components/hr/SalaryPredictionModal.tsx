import React, { useState, useEffect } from 'react';
import { XMarkIcon, CurrencyEuroIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { aiService, SalaryPrediction } from '../../services/aiService';
import { Employee } from '../../types';

interface SalaryPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const SalaryPredictionModal: React.FC<SalaryPredictionModalProps> = ({
  isOpen,
  onClose,
  employee
}) => {
  const [prediction, setPrediction] = useState<SalaryPrediction | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && employee) {
      loadPrediction();
    }
  }, [isOpen, employee]);

  const loadPrediction = async () => {
    if (!employee) return;
    
    setLoading(true);
    try {
      const result = await aiService.predictSalaryIncrease(employee);
      setPrediction(result);
    } catch (error) {
      console.error('Erreur lors de la prédiction salariale:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIncreasePercentage = () => {
    if (!prediction) return 0;
    return ((prediction.predictedIncrease / prediction.currentSalary) * 100).toFixed(1);
  };

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <CurrencyEuroIcon className="h-6 w-6 text-teal-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Prédiction Salariale - {employee.firstName} {employee.lastName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : prediction ? (
          <div className="space-y-6">
            {/* Résumé */}
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Salaire Actuel</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {prediction.currentSalary.toLocaleString()} DH
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Augmentation Suggérée</p>
                  <p className="text-2xl font-bold text-green-600">
                    +{prediction.predictedIncrease.toLocaleString()} DH
                  </p>
                  <p className="text-sm text-green-600">
                    (+{getIncreasePercentage()}%)
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Nouveau Salaire</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {prediction.newSalary.toLocaleString()} DH
                  </p>
                </div>
              </div>
            </div>

            {/* Niveau de confiance */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Niveau de Confiance</h4>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-teal-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${prediction.confidence * 100}%` }}
                  ></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {Math.round(prediction.confidence * 100)}%
                </span>
              </div>
            </div>

            {/* Facteurs d'analyse */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
                Facteurs d'Analyse
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {prediction.factors.map((factor, index) => (
                  <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommandation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Recommandation</h4>
              <p className="text-blue-800">{prediction.recommendation}</p>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  // Ici on pourrait ajouter une logique pour appliquer l'augmentation
                  alert(`Augmentation de ${prediction.predictedIncrease.toLocaleString()}DH notée pour ${employee.firstName} ${employee.lastName}`);
                  onClose();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700"
              >
                Appliquer l'Augmentation
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Erreur lors du chargement de la prédiction</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryPredictionModal;
