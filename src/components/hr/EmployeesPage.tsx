import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  PlusIcon, 
  PencilIcon, 
  EyeIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  ChartBarIcon,
  CalendarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { Employee } from '../../types';
import { employeeService } from '../../services/api';
import EditEmployeeModal from './EditEmployeeModal';
import AIInsightsPanel from './AIInsightsPanel';
import { useNotification } from '../../hooks/useNotification';
import NotificationModal from '../common/NotificationModal';

const EmployeesPage: React.FC = () => {
  const { notification, showSuccess, showInfo, hideNotification } = useNotification();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      // Simulation de données employés
      const mockEmployees: Employee[] = [
        {
          id: '1',
          email: 'meryem.hamidi@teal-tech.com',
          firstName: 'Meryem',
          lastName: 'Hamidi',
          role: 'employee',
          department: 'Développement',
          position: 'Développeur Senior',
          hireDate: '2023-01-15',
          isActive: true,
          salary: 55000,
          managerId: 'mgr1',
          skills: ['React', 'Node.js', 'TypeScript'],
          performance: 4.2
        },
        {
          id: '2',
          email: 'marie.martin@teal-tech.com',
          firstName: 'Marie',
          lastName: 'Martin',
          role: 'manager',
          department: 'Marketing',
          position: 'Chef de Produit',
          hireDate: '2022-03-10',
          isActive: true,
          salary: 65000,
          skills: ['Marketing Digital', 'Analytics', 'Stratégie'],
          performance: 4.5
        },
        {
          id: '3',
          email: 'pierre.bernard@teal-tech.com',
          firstName: 'Pierre',
          lastName: 'Bernard',
          role: 'employee',
          department: 'Ventes',
          position: 'Commercial Senior',
          hireDate: '2021-09-20',
          isActive: true,
          salary: 48000,
          managerId: 'mgr2',
          skills: ['Négociation', 'CRM', 'Prospection'],
          performance: 4.0
        }
      ];
      setEmployees(mockEmployees);
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleUpdateEmployee = async (employeeData: any) => {
    try {
      const updatedEmployee = {
        ...employeeData,
        id: employeeData.id
      };
      
      setEmployees(prev => prev.map(emp => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      ));
      
      alert(`Employé ${employeeData.firstName} ${employeeData.lastName} modifié avec succès !`);
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de la modification de l\'employé');
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && employee.isActive) ||
                         (selectedStatus === 'inactive' && !employee.isActive);
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departments = Array.from(new Set(employees.map(e => e.department)));
  
  const getPerformanceColor = (performance: number) => {
    if (performance >= 4.5) return 'text-green-600 bg-green-100';
    if (performance >= 4.0) return 'text-blue-600 bg-blue-100';
    if (performance >= 3.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
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
            <UsersIcon className="h-8 w-8 text-teal-primary mr-3" />
            Gestion des Employés
          </h1>
          <p className="text-gray-600 mt-1">
            Vue d'ensemble et gestion des employés de l'entreprise
          </p>
        </div>
        <button 
          onClick={() => {
            showInfo(
              'Ajouter un employé',
              'La fonctionnalité d\'ajout d\'employé sera bientôt disponible. Vous pourrez créer de nouveaux profils employés avec toutes les informations nécessaires : coordonnées, poste, département, et plus encore.'
            );
          }}
          className="btn-primary flex items-center"
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Nouvel employé
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Employés</p>
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Performance Moy.</p>
              <p className="text-2xl font-bold text-gray-900">
                {(employees.reduce((acc, e) => acc + (e.performance || 0), 0) / employees.length).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Départements</p>
              <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nouvelles Embauches</p>
              <p className="text-2xl font-bold text-gray-900">
                {employees.filter(e => new Date(e.hireDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou poste..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="input-field"
          >
            <option value="all">Tous les départements</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input-field"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>
      </div>

      {/* Table des employés */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Poste
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Département
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salaire
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Embauche
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {employee.avatar ? (
                          <img className="h-10 w-10 rounded-full" src={employee.avatar} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-teal-600">
                              {employee.firstName[0]}{employee.lastName[0]}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.position}</div>
                    <div className="text-sm text-gray-500">
                      {employee.skills?.slice(0, 2).join(', ')}
                      {employee.skills && employee.skills.length > 2 && '...'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {employee.performance && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPerformanceColor(employee.performance)}`}>
                        {employee.performance.toFixed(1)}/5
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.salary ? `${employee.salary.toLocaleString('fr-FR')} DH` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(employee.hireDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => setSelectedEmployee(employee)}
                        className="text-teal-600 hover:text-teal-900"
                        title="Voir les insights IA"
                      >
                        <ChartBarIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditEmployee(employee)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Modifier"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun employé trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucun employé ne correspond à vos critères de recherche.
          </p>
        </div>
      )}

      {/* Panneau Insights IA */}
      <div className="mt-8">
        <AIInsightsPanel 
          employees={employees}
          selectedEmployee={selectedEmployee}
        />
      </div>

      {/* Modal de modification d'employé */}
      <EditEmployeeModal 
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedEmployee(null);
        }}
        onUpdateEmployee={handleUpdateEmployee}
        employee={selectedEmployee}
      />

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

export default EmployeesPage;
