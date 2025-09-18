import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useNotification } from '../../hooks/useNotification';
import { pdfGenerator } from '../../utils/pdfGenerator';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  manager: string;
  lastEvaluation: string;
  nextEvaluationDue: string;
  status: 'overdue' | 'due_soon' | 'scheduled' | 'completed';
  performance: number;
}

interface EvaluationPlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EvaluationPlanningModal: React.FC<EvaluationPlanningModalProps> = ({ isOpen, onClose }) => {
  const { showSuccess, showInfo } = useNotification();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadEmployeesForEvaluation();
    }
  }, [isOpen]);

  const loadEmployeesForEvaluation = () => {
    try {
      // Simuler des employés nécessitant une évaluation
      const mockEmployees: Employee[] = [
        {
          id: '1',
          name: 'Kenza Hamidi',
          position: 'Développeuse Senior',
          department: 'IT',
          manager: 'Ahmed Benali',
          lastEvaluation: '2023-03-15',
          nextEvaluationDue: '2024-03-15',
          status: 'overdue',
          performance: 4.2
        },
        {
          id: '2',
          name: 'Simo Benali',
          position: 'Chef de Projet',
          department: 'Management',
          manager: 'Fatima Zahra',
          lastEvaluation: '2023-04-10',
          nextEvaluationDue: '2024-04-10',
          status: 'due_soon',
          performance: 3.8
        },
        {
          id: '3',
          name: 'Youssef Alami',
          position: 'Consultant RH',
          department: 'RH',
          manager: 'Lina Hamidi',
          lastEvaluation: '2023-02-20',
          nextEvaluationDue: '2024-02-20',
          status: 'overdue',
          performance: 4.5
        },
        {
          id: '4',
          name: 'Fatima Zahra',
          position: 'Analyste Marketing',
          department: 'Marketing',
          manager: 'Omar Alami',
          lastEvaluation: '2023-05-01',
          nextEvaluationDue: '2024-05-01',
          status: 'due_soon',
          performance: 3.9
        },
        {
          id: '5',
          name: 'Ahmed Benali',
          position: 'Développeur Frontend',
          department: 'IT',
          manager: 'Kenza Hamidi',
          lastEvaluation: '2023-06-15',
          nextEvaluationDue: '2024-06-15',
          status: 'scheduled',
          performance: 4.1
        }
      ];
      setEmployees(mockEmployees);
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleEvaluation = (employeeId: string, date: string) => {
    const employee = employees.find(e => e.id === employeeId);
    if (employee && date) {
      setEmployees(employees.map(e => 
        e.id === employeeId ? { ...e, status: 'scheduled' as const, nextEvaluationDue: date } : e
      ));
      showSuccess(
        'Évaluation programmée',
        `L'évaluation de ${employee.name} a été programmée pour le ${new Date(date).toLocaleDateString('fr-FR')}.`
      );
    }
  };

  const handleBulkSchedule = () => {
    if (selectedEmployees.length === 0 || !selectedDate) {
      showInfo('Sélection requise', 'Veuillez sélectionner des employés et une date.');
      return;
    }

    selectedEmployees.forEach(employeeId => {
      handleScheduleEvaluation(employeeId, selectedDate);
    });

    setSelectedEmployees([]);
    setSelectedDate('');
    showSuccess(
      'Évaluations programmées',
      `${selectedEmployees.length} évaluation${selectedEmployees.length > 1 ? 's ont' : ' a'} été programmée${selectedEmployees.length > 1 ? 's' : ''}.`
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'due_soon': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'overdue': return 'En retard';
      case 'due_soon': return 'Bientôt due';
      case 'scheduled': return 'Programmée';
      case 'completed': return 'Terminée';
      default: return 'Inconnu';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue': return <ClockIcon className="h-4 w-4 text-red-600" />;
      case 'due_soon': return <CalendarIcon className="h-4 w-4 text-yellow-600" />;
      case 'scheduled': return <CheckCircleIcon className="h-4 w-4 text-blue-600" />;
      case 'completed': return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      default: return <ClockIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const overdueEmployees = employees.filter(e => e.status === 'overdue');
  const dueSoonEmployees = employees.filter(e => e.status === 'due_soon');
  const scheduledEmployees = employees.filter(e => e.status === 'scheduled');

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
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full"
            >
              {/* Header */}
              <div className="bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-teal-600 mr-2" />
                    Planification des Évaluations
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {overdueEmployees.length + dueSoonEmployees.length} évaluation{overdueEmployees.length + dueSoonEmployees.length > 1 ? 's' : ''} à programmer
                </p>
              </div>

              {/* Bulk Actions */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Programmer en lot
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="input-field text-sm"
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <button
                        onClick={handleBulkSchedule}
                        disabled={selectedEmployees.length === 0 || !selectedDate}
                        className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Programmer ({selectedEmployees.length})
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="bg-white px-6 py-6 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Évaluations en retard */}
                    {overdueEmployees.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                          <ClockIcon className="h-5 w-5 text-red-600 mr-2" />
                          Évaluations en retard ({overdueEmployees.length})
                        </h4>
                        <div className="space-y-3">
                          {overdueEmployees.map((employee) => (
                            <motion.div
                              key={employee.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${getStatusColor(employee.status)}`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start">
                                  <input
                                    type="checkbox"
                                    checked={selectedEmployees.includes(employee.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedEmployees([...selectedEmployees, employee.id]);
                                      } else {
                                        setSelectedEmployees(selectedEmployees.filter(id => id !== employee.id));
                                      }
                                    }}
                                    className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                  />
                                  <div className="ml-3 flex-1">
                                    <div className="flex items-center mb-2">
                                      <UserIcon className="h-4 w-4 text-gray-500 mr-2" />
                                      <span className="font-medium text-gray-900">{employee.name}</span>
                                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(employee.status)}`}>
                                        {getStatusIcon(employee.status)}
                                        <span className="ml-1">{getStatusLabel(employee.status)}</span>
                                      </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                                      <div>
                                        <span className="text-gray-600">Poste:</span>
                                        <div className="font-medium">{employee.position}</div>
                                      </div>
                                      <div>
                                        <span className="text-gray-600">Département:</span>
                                        <div className="font-medium">{employee.department}</div>
                                      </div>
                                      <div>
                                        <span className="text-gray-600">Manager:</span>
                                        <div className="font-medium">{employee.manager}</div>
                                      </div>
                                      <div>
                                        <span className="text-gray-600">Dernière éval:</span>
                                        <div className="font-medium">{new Date(employee.lastEvaluation).toLocaleDateString('fr-FR')}</div>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <div>
                                        <span className="text-sm text-gray-600">Performance actuelle:</span>
                                        <div className="mt-1">{renderStars(employee.performance)}</div>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-sm text-gray-600">Due le:</span>
                                        <div className="font-medium text-red-600">
                                          {new Date(employee.nextEvaluationDue).toLocaleDateString('fr-FR')}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="ml-4">
                                  <input
                                    type="date"
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        handleScheduleEvaluation(employee.id, e.target.value);
                                      }
                                    }}
                                    className="input-field text-sm"
                                    min={new Date().toISOString().split('T')[0]}
                                  />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Évaluations bientôt dues */}
                    {dueSoonEmployees.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                          <CalendarIcon className="h-5 w-5 text-yellow-600 mr-2" />
                          Évaluations bientôt dues ({dueSoonEmployees.length})
                        </h4>
                        <div className="space-y-3">
                          {dueSoonEmployees.map((employee) => (
                            <div
                              key={employee.id}
                              className={`border rounded-lg p-4 ${getStatusColor(employee.status)}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedEmployees.includes(employee.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedEmployees([...selectedEmployees, employee.id]);
                                      } else {
                                        setSelectedEmployees(selectedEmployees.filter(id => id !== employee.id));
                                      }
                                    }}
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                  />
                                  <UserIcon className="h-4 w-4 text-gray-500 ml-3 mr-2" />
                                  <div>
                                    <span className="font-medium text-gray-900">{employee.name}</span>
                                    <div className="text-sm text-gray-600">
                                      {employee.position} • Due le {new Date(employee.nextEvaluationDue).toLocaleDateString('fr-FR')}
                                    </div>
                                  </div>
                                </div>
                                <input
                                  type="date"
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleScheduleEvaluation(employee.id, e.target.value);
                                    }
                                  }}
                                  className="input-field text-sm"
                                  min={new Date().toISOString().split('T')[0]}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Évaluations programmées */}
                    {scheduledEmployees.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                          <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                          Évaluations programmées ({scheduledEmployees.length})
                        </h4>
                        <div className="space-y-3">
                          {scheduledEmployees.map((employee) => (
                            <div
                              key={employee.id}
                              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <CheckCircleIcon className="h-4 w-4 text-blue-600 mr-2" />
                                  <span className="font-medium text-gray-900">{employee.name}</span>
                                  <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                    Programmée
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  Prévue le {new Date(employee.nextEvaluationDue).toLocaleDateString('fr-FR')}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {employees.length === 0 && (
                      <div className="text-center py-8">
                        <ArrowTrendingUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune évaluation à programmer</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Toutes les évaluations sont à jour.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    {selectedEmployees.length} employé{selectedEmployees.length > 1 ? 's' : ''} sélectionné{selectedEmployees.length > 1 ? 's' : ''}
                  </div>
                  <button
                    onClick={() => {
                      pdfGenerator.generatePDF({
                        title: 'Rapport - Planning des Évaluations',
                        subtitle: `Généré le ${new Date().toLocaleDateString('fr-FR')}`,
                        data: employees,
                        type: 'evaluation'
                      });
                      showSuccess('PDF généré', 'Le planning des évaluations a été téléchargé.');
                    }}
                    className="btn-primary text-sm"
                  >
                    Télécharger PDF
                  </button>
                </div>
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

export default EvaluationPlanningModal;
