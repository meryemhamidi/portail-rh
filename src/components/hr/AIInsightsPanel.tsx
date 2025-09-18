import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  ExclamationTriangleIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { aiService, SalaryPrediction, PerformanceAnalysis, TurnoverRisk } from '../../services/aiService';
import { Employee } from '../../types';

interface AIInsightsPanelProps {
  employees: Employee[];
  selectedEmployee?: Employee | null;
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ employees, selectedEmployee }) => {
  const [salaryPrediction, setSalaryPrediction] = useState<SalaryPrediction | null>(null);
  const [performanceAnalysis, setPerformanceAnalysis] = useState<PerformanceAnalysis | null>(null);
  const [turnoverRisk, setTurnoverRisk] = useState<TurnoverRisk | null>(null);
  const [hrRecommendations, setHrRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedEmployee) {
      loadEmployeeInsights(selectedEmployee);
    } else {
      loadGlobalInsights();
    }
  }, [selectedEmployee, employees]);

  const loadEmployeeInsights = async (employee: Employee) => {
    setLoading(true);
    try {
      const [salary, performance, turnover] = await Promise.all([
        aiService.predictSalaryIncrease(employee),
        aiService.analyzePerformance(employee),
        aiService.assessTurnoverRisk(employee)
      ]);

      setSalaryPrediction(salary);
      setPerformanceAnalysis(performance);
      setTurnoverRisk(turnover);
    } catch (error) {
      console.error('Erreur lors du chargement des insights employé:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGlobalInsights = async () => {
    setLoading(true);
    try {
      const recommendations = await aiService.getHRRecommendations(employees);
      setHrRecommendations(recommendations);
      
      // Reset individual insights
      setSalaryPrediction(null);
      setPerformanceAnalysis(null);
      setTurnoverRisk(null);
    } catch (error) {
      console.error('Erreur lors du chargement des insights globaux:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowTrendingUpIcon className="h-4 w-4 text-red-500 transform rotate-180" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <ChartBarIcon className="h-6 w-6 text-teal-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">
          {selectedEmployee ? `Insights IA - ${selectedEmployee.firstName} ${selectedEmployee.lastName}` : 'Insights IA Globaux'}
        </h3>
      </div>

      {selectedEmployee ? (
        <div className="space-y-6">
          {/* Prédiction Salariale */}
          {salaryPrediction && (
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 className="font-semibold text-blue-900 mb-2">💰 Prédiction Salariale</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Salaire actuel:</span>
                  <p className="font-semibold">{salaryPrediction.currentSalary.toLocaleString()} DH</p>
                </div>
                <div>
                  <span className="text-gray-600">Augmentation suggérée:</span>
                  <p className="font-semibold text-green-600">+{salaryPrediction.predictedIncrease.toLocaleString()} DH</p>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-gray-600 text-sm">Recommandation:</span>
                <p className="text-sm font-medium">{salaryPrediction.recommendation}</p>
              </div>
              <div className="mt-2">
                <span className="text-gray-600 text-sm">Facteurs:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {salaryPrediction.factors.map((factor, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Analyse Performance */}
          {performanceAnalysis && (
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                📈 Analyse Performance
                {getTrendIcon(performanceAnalysis.trend)}
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Score actuel:</span>
                  <p className="font-semibold">{performanceAnalysis.currentScore}/100</p>
                </div>
                <div>
                  <span className="text-gray-600">Score prédit:</span>
                  <p className="font-semibold">{performanceAnalysis.predictedScore}/100</p>
                </div>
              </div>
              {performanceAnalysis.recommendations.length > 0 && (
                <div className="mt-3">
                  <span className="text-gray-600 text-sm">Recommandations:</span>
                  <ul className="text-sm mt-1 space-y-1">
                    {performanceAnalysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <LightBulbIcon className="h-3 w-3 text-yellow-500 mt-0.5 mr-1 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Risque Turnover */}
          {turnoverRisk && (
            <div className={`border rounded-lg p-4 ${
              turnoverRisk.riskLevel === 'high' ? 'border-red-200 bg-red-50' :
              turnoverRisk.riskLevel === 'medium' ? 'border-yellow-200 bg-yellow-50' :
              'border-green-200 bg-green-50'
            }`}>
              <h4 className="font-semibold mb-2 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                🔄 Risque de Turnover
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getRiskColor(turnoverRisk.riskLevel)}`}>
                  {turnoverRisk.riskLevel.toUpperCase()}
                </span>
              </h4>
              <div className="text-sm">
                <span className="text-gray-600">Probabilité de départ:</span>
                <p className="font-semibold">{Math.round(turnoverRisk.probability * 100)}%</p>
              </div>
              {turnoverRisk.factors.length > 0 && (
                <div className="mt-3">
                  <span className="text-gray-600 text-sm">Facteurs de risque:</span>
                  <ul className="text-sm mt-1 space-y-1">
                    {turnoverRisk.factors.map((factor, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-1">•</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {turnoverRisk.retentionActions.length > 0 && (
                <div className="mt-3">
                  <span className="text-gray-600 text-sm">Actions de rétention:</span>
                  <ul className="text-sm mt-1 space-y-1">
                    {turnoverRisk.retentionActions.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <LightBulbIcon className="h-3 w-3 text-yellow-500 mt-0.5 mr-1 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Insights Globaux */
        <div className="space-y-4">
          <div className="flex items-center text-gray-600 mb-4">
            <UserGroupIcon className="h-5 w-5 mr-2" />
            <span className="text-sm">Analyse de {employees.length} employés</span>
          </div>
          
          {hrRecommendations.length > 0 ? (
            <div className="space-y-3">
              {hrRecommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start p-3 bg-teal-50 border border-teal-200 rounded-lg">
                  <LightBulbIcon className="h-5 w-5 text-teal-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-teal-800">{recommendation}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ChartBarIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Sélectionnez un employé pour voir les insights détaillés</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIInsightsPanel;
