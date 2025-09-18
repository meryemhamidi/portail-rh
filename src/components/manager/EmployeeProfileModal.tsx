import React from 'react';
import Modal from '../common/Modal';
import { Employee } from '../../types';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  StarIcon,
  ChartBarIcon,
  AcademicCapIcon,
  ClockIcon,
  PencilIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  CurrencyEuroIcon
} from '@heroicons/react/24/outline';

interface EmployeeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({ isOpen, onClose, employee }) => {
  if (!employee) return null;

  const getPerformanceColor = (performance: number) => {
    if (performance >= 4.5) return 'text-green-600 bg-green-100';
    if (performance >= 4.0) return 'text-blue-600 bg-blue-100';
    if (performance >= 3.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Profil Employé" size="lg">
      <div className="space-y-6">
        {/* Header avec photo et infos principales */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="h-16 w-16 rounded-full bg-teal-500 flex items-center justify-center">
            <span className="text-xl font-bold text-white">
              {employee.firstName[0]}{employee.lastName[0]}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-gray-600">{employee.position}</p>
            <div className="flex items-center mt-2">
              {employee.performance && (
                <div className={`px-3 py-1 text-sm font-medium rounded-full ${getPerformanceColor(employee.performance)}`}>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 mr-1" />
                    {employee.performance.toFixed(1)}/5
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informations détaillées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Informations Personnelles</h4>
            
            <div className="flex items-center space-x-3">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">{employee.email}</p>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <PhoneIcon className="h-4 w-4 mr-2" />
              {(employee as any).phone || 'Non renseigné'}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPinIcon className="h-4 w-4 mr-2" />
              {(employee as any).address || 'Non renseigné'}
            </div>

            <div className="flex items-center space-x-3">
              <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Département</p>
                <p className="text-sm font-medium text-gray-900">{employee.department}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date d'embauche</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(employee.hireDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            {employee.salary && (
              <div className="flex items-center space-x-3">
                <span className="text-lg text-gray-400">DH</span>
                <div>
                  <p className="text-sm text-gray-500">Salaire</p>
                  <p className="text-sm font-medium text-gray-900">
                    {employee.salary.toLocaleString('fr-FR')} DH/an
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Compétences & Performance</h4>
            
            {employee.skills && employee.skills.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Compétences</p>
                <div className="flex flex-wrap gap-2">
                  {employee.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {employee.performance && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Performance</p>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(employee.performance / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {employee.performance.toFixed(1)}/5
                  </span>
                </div>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500 mb-2">Statut</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                employee.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {employee.isActive ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Fermer
          </button>
          <button
            onClick={() => {
              // Logique pour éditer le profil
              alert('Fonctionnalité d\'édition à implémenter');
            }}
            className="btn-primary"
          >
            Modifier le profil
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EmployeeProfileModal;
