import { User, UserRole } from '../types';

// Service mock pour remplacer Firebase en cas d'erreur de permissions
export class MockUserService {
  private users: User[] = [
    {
      id: '1',
      firstName: 'Meryem',
      lastName: 'Hamidi',
      email: 'Meryem.Hamidi@teal-tech.com',
      role: 'admin',
      department: 'Administration',
      position: 'Administrateur Système',
      isActive: true,
      hireDate: '2024-01-15T00:00:00.000Z',
      phone: '+212 6 12 34 56 78',
      address: 'Casablanca, Maroc'
    } as User,
    {
      id: '2',
      firstName: 'Kenza',
      lastName: 'Hamidi',
      email: 'Kenza.Hamidi@teal-tech.com',
      role: 'hr',
      department: 'Ressources Humaines',
      position: 'Responsable RH',
      isActive: true,
      hireDate: '2024-02-01T00:00:00.000Z',
      phone: '+212 6 87 65 43 21',
      address: 'Rabat, Maroc'
    } as User,
    {
      id: '3',
      firstName: 'Lina',
      lastName: 'Hamidi',
      email: 'Lina.Hamidi@teal-tech.com',
      role: 'hr',
      department: 'Développement',
      position: 'Chef de Projet RH',
      isActive: true,
      hireDate: '2024-01-20T00:00:00.000Z',
      phone: '+212 6 11 22 33 44',
      address: 'Casablanca, Maroc'
    } as User,
    {
      id: '4',
      firstName: 'Youssef',
      lastName: 'Hamidi',
      email: 'Youssef.Hamidi@teal-tech.com',
      role: 'employee',
      department: 'Design',
      position: 'UX/UI Designer',
      isActive: true,
      hireDate: '2024-01-25T00:00:00.000Z',
      phone: '+212 6 33 44 55 66',
      address: 'Casablanca, Maroc'
    } as User,
    {
      id: '5',
      firstName: 'Simo',
      lastName: 'Hamidi',
      email: 'Simo.Hamidi@teal-tech.com',
      role: 'employee',
      department: 'Développement',
      position: 'Développeur Full-Stack',
      isActive: true,
      hireDate: '2024-01-30T00:00:00.000Z',
      phone: '+212 6 77 88 99 00',
      address: 'Rabat, Maroc'
    } as User,
    {
      id: '6',
      firstName: 'Nasma',
      lastName: 'Hamidi',
      email: 'Nasma.Hamidi@teal-tech.com',
      role: 'manager',
      department: 'Développement',
      position: 'Manager Équipe',
      isActive: true,
      hireDate: '2024-01-10T00:00:00.000Z',
      phone: '+212 6 55 44 33 22',
      address: 'Casablanca, Maroc'
    } as User
  ];

  // Simuler un délai réseau
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Créer un nouvel utilisateur
  async createUser(userData: any): Promise<User> {
    await this.delay();
    
    const newUser: User = {
      id: Date.now().toString(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      position: userData.position,
      isActive: true,
      hireDate: new Date().toISOString(),
      ...(userData.phone && { phone: userData.phone }),
      ...(userData.address && { address: userData.address }),
      ...(userData.birthDate && { birthDate: userData.birthDate })
    };

    this.users.unshift(newUser);
    return newUser;
  }

  // Récupérer tous les utilisateurs
  async getUsers(): Promise<User[]> {
    await this.delay();
    return [...this.users];
  }

  // Récupérer un utilisateur par ID
  async getUserById(id: string): Promise<User | null> {
    await this.delay();
    return this.users.find(user => user.id === id) || null;
  }

  // Mettre à jour un utilisateur
  async updateUser(userData: Partial<User> & { id: string }): Promise<User> {
    await this.delay();
    const index = this.users.findIndex(user => user.id === userData.id);
    if (index === -1) {
      throw new Error('Utilisateur non trouvé');
    }

    const updatedUser = {
      ...this.users[index],
      ...userData,
      id: userData.id // Ensure ID is preserved
    } as User;

    this.users[index] = updatedUser;
    return updatedUser;
  }

  // Récupérer les utilisateurs par rôle
  async getUsersByRole(role: UserRole): Promise<User[]> {
    await this.delay();
    return this.users.filter(user => user.role === role);
  }

  // Récupérer les utilisateurs par département
  async getUsersByDepartment(department: string): Promise<User[]> {
    await this.delay();
    return this.users.filter(user => user.department === department);
  }

  // Supprimer un utilisateur
  async deleteUser(id: string): Promise<void> {
    await this.delay();
    const index = this.users.findIndex(user => user.id === id);
    if (index > -1) {
      this.users.splice(index, 1);
    }
  }

  // Activer/désactiver un utilisateur
  async toggleUserStatus(id: string, isActive: boolean): Promise<void> {
    await this.delay();
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users[index].isActive = isActive;
    }
  }
}

export const mockUserService = new MockUserService();
