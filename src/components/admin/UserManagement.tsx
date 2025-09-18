import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useNotification } from '../../hooks/useNotification';
import NotificationModal from '../common/NotificationModal';
import { UserProfile, CreateUserRequest, UserRole } from '../../types/index';
import { UserStorageService } from '../../services/userStorage';

interface UserManagementProps {
  currentUser: UserProfile;
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
  const { notification, showSuccess, showInfo, hideNotification } = useNotification();
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Charger les utilisateurs depuis le stockage persistant
  useEffect(() => {
    // Initialiser les utilisateurs par défaut si nécessaire
    UserStorageService.initializeDefaultUsers(currentUser?.id || 'admin-1');
    
    // Charger les utilisateurs existants
    const storedUsers = UserStorageService.getUsers();
    setUsers(storedUsers);
  }, [currentUser]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      // Supprimer du stockage persistant
      UserStorageService.deleteUser(userId);
      
      // Mettre à jour l'état local
      const updatedUsers = UserStorageService.getUsers();
      setUsers(updatedUsers);
    }
  };

  const handleCreateUser = (userData: CreateUserRequest) => {
    const newUserId = Date.now().toString();
    const newUser: UserProfile = {
      id: newUserId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'employee',
      department: userData.department,
      position: userData.position,
      hireDate: new Date().toISOString().split('T')[0],
      isActive: true,
      phone: userData.phone,
      createdBy: currentUser?.id || '',
      createdAt: new Date().toISOString(),
      profileCompleteness: 30, // Profil de base créé
      activityHistory: [
        {
          id: `act_${Date.now()}`,
          userId: newUserId,
          action: 'Création du compte',
          description: `Compte créé`,
          timestamp: new Date().toISOString(),
          category: 'system',
          metadata: { createdBy: currentUser?.id || '' }
        }
      ],
      preferences: {
        language: 'fr',
        theme: 'light',
        notifications: { email: true, push: false, sms: false },
        privacy: { profileVisible: true, activityVisible: false }
      }
    };

    try {
      // Sauvegarder dans le stockage persistant
      UserStorageService.addUser(newUser);
      
      // Mettre à jour l'état local
      const updatedUsers = UserStorageService.getUsers();
      setUsers(updatedUsers);
      setShowAddUser(false);
      
      // Notification de succès
      showSuccess(
        'Utilisateur créé',
        `L'utilisateur ${newUser.firstName} ${newUser.lastName} a été créé avec succès !`
      );
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      showInfo('Erreur lors de la création de l\'utilisateur', 'Erreur lors de la création de l\'utilisateur');
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'hr': return 'bg-blue-100 text-blue-800';
      case 'manager': return 'bg-green-100 text-green-800';
      case 'employee': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'hr': return 'RH';
      case 'manager': return 'Manager';
      case 'employee': return 'Employé';
      default: return 'Employé';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600">Gérez les comptes utilisateurs et leurs activités</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddUser(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nouvel Utilisateur</span>
        </motion.button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou département..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
              className="input-field"
            >
              <option value="all">   Tous les rôles</option>
              <option value="admin">Administrateur</option>
              <option value="hr">RH</option>
              <option value="manager">Manager</option>
              <option value="employee">Employé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Département
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière activité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-teal-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastActivity ? new Date(user.lastActivity).toLocaleDateString('fr-FR') : 'Jamais'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-teal-600 h-2 rounded-full" 
                          style={{ width: `${user.profileCompleteness}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{user.profileCompleteness}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserDetails(true);
                        }}
                        className="text-teal-600 hover:text-teal-900"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          showInfo(
                            'Modifier l\'utilisateur',
                            `Fonctionnalité de modification pour ${user.firstName} ${user.lastName} sera bientôt disponible. Vous pourrez mettre à jour le rôle, les informations personnelles et les permissions.`
                          );
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
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

export default UserManagement;
