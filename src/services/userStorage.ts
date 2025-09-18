import { UserProfile } from '../types/index';

// Clé pour le localStorage
const USERS_STORAGE_KEY = 'teal_users';

// Stockage persistant des utilisateurs
export class UserStorageService {
  // Charger les utilisateurs depuis le localStorage
  static getUsers(): UserProfile[] {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      return [];
    }
  }

  // Sauvegarder les utilisateurs dans le localStorage
  static saveUsers(users: UserProfile[]): void {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des utilisateurs:', error);
    }
  }

  // Ajouter un utilisateur
  static addUser(user: UserProfile): void {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  }

  // Supprimer un utilisateur
  static deleteUser(userId: string): void {
    const users = this.getUsers();
    const filteredUsers = users.filter(user => user.id !== userId);
    this.saveUsers(filteredUsers);
  }

  // Mettre à jour un utilisateur
  static updateUser(userId: string, updates: Partial<UserProfile>): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      this.saveUsers(users);
    }
  }

  // Obtenir un utilisateur par ID
  static getUserById(userId: string): UserProfile | null {
    const users = this.getUsers();
    return users.find(user => user.id === userId) || null;
  }

  // Vider tous les utilisateurs (pour reset)
  static clearAllUsers(): void {
    localStorage.removeItem(USERS_STORAGE_KEY);
  }

  // Initialiser avec des données par défaut si aucun utilisateur n'existe
  static initializeDefaultUsers(currentUserId: string): void {
    const existingUsers = this.getUsers();
    
    // Si aucun utilisateur n'existe, créer des utilisateurs par défaut
    if (existingUsers.length === 0) {
      const defaultUsers: UserProfile[] = [
        {
          id: '1',
          email: 'Meryem.Hamidi@teal-tech.com',
          firstName: 'Meryem',
          lastName: 'Hamidi',
          role: 'employee',
          department: 'IT',
          position: 'Développeur',
          hireDate: '2024-01-15',
          isActive: true,
          createdBy: currentUserId,
          createdAt: '2024-01-15T10:00:00Z',
          lastActivity: '2025-01-08T15:30:00Z',
          profileCompleteness: 85,
          activityHistory: [
            {
              id: 'act1',
              userId: '1',
              action: 'Connexion',
              description: 'Connexion réussie au portail',
              timestamp: '2025-01-08T15:30:00Z',
              category: 'login'
            },
            {
              id: 'act2',
              userId: '1',
              action: 'Mise à jour profil',
              description: 'Modification des informations personnelles',
              timestamp: '2025-01-08T14:15:00Z',
              category: 'profile'
            }
          ],
          preferences: {
            language: 'fr',
            theme: 'light',
            notifications: { email: true, push: true, sms: false },
            privacy: { profileVisible: true, activityVisible: false }
          }
        },
        {
          id: '2',
          email: 'Kenza.Hamidi@teal-tech.com',
          firstName: 'Kenza',
          lastName: 'Hamidi',
          role: 'manager',
          department: 'RH',
          position: 'Responsable RH',
          hireDate: '2023-06-01',
          isActive: true,
          createdBy: currentUserId,
          createdAt: '2023-06-01T09:00:00Z',
          lastActivity: '2025-01-08T16:45:00Z',
          profileCompleteness: 95,
          activityHistory: [
            {
              id: 'act3',
              userId: '2',
              action: 'Validation congé',
              description: 'Validation de la demande de congé #123',
              timestamp: '2025-01-08T16:45:00Z',
              category: 'vacation'
            }
          ],
          preferences: {
            language: 'fr',
            theme: 'light',
            notifications: { email: true, push: true, sms: true },
            privacy: { profileVisible: true, activityVisible: true }
          }
        }
      ];

      this.saveUsers(defaultUsers);
    }
  }
}
