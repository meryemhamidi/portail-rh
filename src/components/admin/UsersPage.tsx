import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  UsersIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  PencilIcon,
  TrashIcon 
} from '@heroicons/react/24/outline';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';
import { User, UserRole } from '../../types';
import { serviceManager } from '../../services/serviceManager';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const userServiceInstance = await serviceManager.getUserService();
      const data = await userServiceInstance.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: any) => {
    try {
      const userServiceInstance = await serviceManager.getUserService();
      const newUser = await userServiceInstance.createUser(userData);
      setUsers(prev => [newUser, ...prev]);
      
      const status = serviceManager.getStatus();
      const message = status.useFirebase 
        ? `Utilisateur ${userData.firstName} ${userData.lastName} créé avec succès !\nUn email de réinitialisation de mot de passe a été envoyé.`
        : `Utilisateur ${userData.firstName} ${userData.lastName} créé avec succès !\n(Mode démonstration - Firebase non configuré)`;
      
      alert(message);
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de la création de l\'utilisateur');
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (userData: any) => {
    try {
      const userServiceInstance = await serviceManager.getUserService();
      const updatedUser = await userServiceInstance.updateUser(userData);
      
      setUsers(prev => prev.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      
      const status = serviceManager.getStatus();
      const message = status.useFirebase 
        ? `Utilisateur ${userData.firstName} ${userData.lastName} modifié avec succès !`
        : `Utilisateur ${userData.firstName} ${userData.lastName} modifié avec succès !\n(Mode démonstration - Firebase non configuré)`;
      
      alert(message);
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de la modification de l\'utilisateur');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      hr: 'bg-blue-100 text-blue-800',
      manager: 'bg-green-100 text-green-800',
      employee: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      admin: 'Administrateur',
      hr: 'RH',
      manager: 'Manager',
      employee: 'Employé'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[role as keyof typeof colors]}`}>
        {labels[role as keyof typeof labels]}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? 'Actif' : 'Inactif'}
      </span>
    );
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
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez les comptes utilisateurs et leurs permissions
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center"
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Nouvel utilisateur
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
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShieldCheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Actifs</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Employés</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'employee').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="input-field"
          >
            <option value="all">Tous les rôles</option>
            <option value="admin">Administrateur</option>
            <option value="hr">RH</option>
            <option value="manager">Manager</option>
            <option value="employee">Employé</option>
          </select>
        </div>
      </div>

      {/* Table des utilisateurs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'embauche
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {user.avatar ? (
                          <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-teal-600">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                        )}
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
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.isActive)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user.hireDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="text-teal-600 hover:text-teal-900"
                        title="Modifier l'utilisateur"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstName} ${user.lastName} ?`)) {
                            setUsers(prev => prev.filter(u => u.id !== user.id));
                            alert(`Utilisateur ${user.firstName} ${user.lastName} supprimé avec succès !`);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer l'utilisateur"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun utilisateur trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucun utilisateur ne correspond à vos critères de recherche.
          </p>
        </div>
      )}

      {/* Modal de création d'utilisateur */}
      <CreateUserModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateUser={handleCreateUser}
      />

      {/* Modal de modification d'utilisateur */}
      <EditUserModal 
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        onUpdateUser={handleUpdateUser}
        user={selectedUser}
      />
    </div>
  );
};

export default UsersPage;
