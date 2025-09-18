// Service de persistance localStorage pour Teal Technology Services
import { Employee, Objective, Training, VacationRequest, User } from '../types';

class StorageService {
  private readonly STORAGE_KEYS = {
    EMPLOYEES: 'teal-employees',
    OBJECTIVES: 'teal-objectives',
    TRAININGS: 'teal-trainings',
    VACATIONS: 'teal-vacations',
    USERS: 'teal-users',
    SURVEYS: 'teal-surveys',
    SURVEY_RESPONSES: 'teal-survey-responses',
    CONTRACTS: 'teal-contracts',
    DOCUMENTS: 'teal-documents',
    EVALUATIONS: 'teal-evaluations'
  };

  // Méthodes génériques de stockage
  private setItem<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`✅ Données sauvegardées: ${key}`, data.length, 'éléments');
    } catch (error) {
      console.error(`❌ Erreur sauvegarde ${key}:`, error);
    }
  }

  private getItem<T>(key: string, defaultData: T[] = []): T[] {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log(`📖 Données chargées: ${key}`, parsed.length, 'éléments');
        return parsed;
      }
    } catch (error) {
      console.error(`❌ Erreur chargement ${key}:`, error);
    }
    return defaultData;
  }

  // === EMPLOYÉS ===
  saveEmployees(employees: Employee[]): void {
    this.setItem(this.STORAGE_KEYS.EMPLOYEES, employees);
  }

  getEmployees(): Employee[] {
    return this.getItem<Employee>(this.STORAGE_KEYS.EMPLOYEES, this.getDefaultEmployees());
  }

  addEmployee(employee: Employee): Employee[] {
    const employees = this.getEmployees();
    employees.push(employee);
    this.saveEmployees(employees);
    return employees;
  }

  updateEmployee(id: string, updates: Partial<Employee>): Employee[] {
    const employees = this.getEmployees();
    const index = employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      employees[index] = { ...employees[index], ...updates };
      this.saveEmployees(employees);
    }
    return employees;
  }

  deleteEmployee(id: string): Employee[] {
    const employees = this.getEmployees().filter(emp => emp.id !== id);
    this.saveEmployees(employees);
    return employees;
  }

  // === OBJECTIFS ===
  saveObjectives(objectives: Objective[]): void {
    this.setItem(this.STORAGE_KEYS.OBJECTIVES, objectives);
  }

  getObjectives(): Objective[] {
    return this.getItem<Objective>(this.STORAGE_KEYS.OBJECTIVES, this.getDefaultObjectives());
  }

  addObjective(objective: Objective): Objective[] {
    const objectives = this.getObjectives();
    objectives.push(objective);
    this.saveObjectives(objectives);
    return objectives;
  }

  updateObjective(id: string, updates: Partial<Objective>): Objective[] {
    const objectives = this.getObjectives();
    const index = objectives.findIndex(obj => obj.id === id);
    if (index !== -1) {
      objectives[index] = { ...objectives[index], ...updates };
      this.saveObjectives(objectives);
    }
    return objectives;
  }

  deleteObjective(id: string): Objective[] {
    const objectives = this.getObjectives().filter(obj => obj.id !== id);
    this.saveObjectives(objectives);
    return objectives;
  }

  // === FORMATIONS ===
  saveTrainings(trainings: Training[]): void {
    this.setItem(this.STORAGE_KEYS.TRAININGS, trainings);
  }

  getTrainings(): Training[] {
    return this.getItem<Training>(this.STORAGE_KEYS.TRAININGS, this.getDefaultTrainings());
  }

  addTraining(training: Training): Training[] {
    const trainings = this.getTrainings();
    trainings.push(training);
    this.saveTrainings(trainings);
    return trainings;
  }

  updateTraining(id: string, updates: Partial<Training>): Training[] {
    const trainings = this.getTrainings();
    const index = trainings.findIndex(t => t.id === id);
    if (index !== -1) {
      trainings[index] = { ...trainings[index], ...updates };
      this.saveTrainings(trainings);
    }
    return trainings;
  }

  // === CONGÉS ===
  saveVacations(vacations: VacationRequest[]): void {
    this.setItem(this.STORAGE_KEYS.VACATIONS, vacations);
  }

  getVacations(): VacationRequest[] {
    return this.getItem<VacationRequest>(this.STORAGE_KEYS.VACATIONS, this.getDefaultVacations());
  }

  addVacation(vacation: VacationRequest): VacationRequest[] {
    const vacations = this.getVacations();
    vacations.push(vacation);
    this.saveVacations(vacations);
    return vacations;
  }

  updateVacation(id: string, updates: Partial<VacationRequest>): VacationRequest[] {
    const vacations = this.getVacations();
    const index = vacations.findIndex(v => v.id === id);
    if (index !== -1) {
      vacations[index] = { ...vacations[index], ...updates };
      this.saveVacations(vacations);
    }
    return vacations;
  }

  // === UTILISATEURS ===
  saveUsers(users: User[]): void {
    this.setItem(this.STORAGE_KEYS.USERS, users);
  }

  getUsers(): User[] {
    return this.getItem<User>(this.STORAGE_KEYS.USERS, this.getDefaultUsers());
  }

  addUser(user: User): User[] {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
    return users;
  }

  updateUser(id: string, updates: Partial<User>): User[] {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.saveUsers(users);
    }
    return users;
  }

  deleteUser(id: string): User[] {
    const users = this.getUsers().filter(u => u.id !== id);
    this.saveUsers(users);
    return users;
  }

  // === DONNÉES PAR DÉFAUT ===
  private getDefaultEmployees(): Employee[] {
    return [
      {
        id: '1',
        email: 'meryem.hamidi@teal-tech.com',
        firstName: 'Meryem',
        lastName: 'Hamidi',
        role: 'admin',
        department: 'Administration',
        position: 'Administrateur Système',
        hireDate: '2023-01-15',
        isActive: true,
        salary: 65000,
        managerId: undefined,
        skills: ['Administration', 'Gestion', 'Leadership'],
        performance: 4.8
      },
      {
        id: '2',
        email: 'kenza.hamidi@teal-tech.com',
        firstName: 'Kenza',
        lastName: 'Hamidi',
        role: 'hr',
        department: 'Ressources Humaines',
        position: 'Responsable RH',
        hireDate: '2023-02-01',
        isActive: true,
        salary: 58000,
        managerId: '1',
        skills: ['Recrutement', 'Formation', 'Gestion RH'],
        performance: 4.6
      },
      {
        id: '3',
        email: 'nasma.hamidi@teal-tech.com',
        firstName: 'Nasma',
        lastName: 'Hamidi',
        role: 'manager',
        department: 'Développement',
        position: 'Chef de Projet',
        hireDate: '2022-11-15',
        isActive: true,
        salary: 62000,
        managerId: '1',
        skills: ['Management', 'Scrum', 'Leadership'],
        performance: 4.7
      },
      {
        id: '4',
        email: 'youssef.hamidi@teal-tech.com',
        firstName: 'Youssef',
        lastName: 'Hamidi',
        role: 'employee',
        department: 'Développement',
        position: 'Développeur Senior',
        hireDate: '2023-03-10',
        isActive: true,
        salary: 55000,
        managerId: '3',
        skills: ['React', 'Node.js', 'TypeScript'],
        performance: 4.5
      },
      {
        id: '5',
        email: 'simo.hamidi@teal-tech.com',
        firstName: 'Simo',
        lastName: 'Hamidi',
        role: 'employee',
        department: 'Développement',
        position: 'Développeur Frontend',
        hireDate: '2023-04-01',
        isActive: true,
        salary: 48000,
        managerId: '3',
        skills: ['React', 'Vue.js', 'CSS'],
        performance: 4.2
      }
    ];
  }

  private getDefaultObjectives(): Objective[] {
    return [
      {
        id: '1',
        employeeId: '4',
        employeeName: 'Youssef Hamidi',
        title: 'Développer le module de facturation',
        description: 'Créer un système de facturation automatisé intégrant les APIs de paiement',
        category: 'development',
        priority: 'high',
        status: 'in_progress',
        startDate: '2024-01-15',
        dueDate: '2024-03-15',
        progress: 65,
        managerId: '3',
        managerName: 'Nasma Hamidi'
      },
      {
        id: '2',
        employeeId: '5',
        employeeName: 'Simo Hamidi',
        title: 'Améliorer les performances UI',
        description: 'Optimiser les temps de chargement et réduire la consommation de ressources',
        category: 'performance',
        priority: 'medium',
        status: 'in_progress',
        startDate: '2024-02-01',
        dueDate: '2024-04-01',
        progress: 40,
        managerId: '3',
        managerName: 'Nasma Hamidi'
      }
    ];
  }

  private getDefaultTrainings(): Training[] {
    return [
      {
        id: '1',
        title: 'Formation React Avancé',
        description: 'Approfondissez vos connaissances en React avec les hooks et patterns avancés',
        startDate: '2024-03-15',
        endDate: '2024-03-22',
        status: 'scheduled',
        instructor: 'Lina Hamidi',
        duration: 40,
        category: 'Développement'
      },
      {
        id: '2',
        title: 'Gestion de Projet Agile',
        description: 'Maîtrisez les méthodologies Scrum et Kanban',
        startDate: '2024-04-01',
        endDate: '2024-04-05',
        status: 'scheduled',
        instructor: 'Kenza Hamidi',
        duration: 24,
        category: 'Management'
      }
    ];
  }

  private getDefaultVacations(): VacationRequest[] {
    return [
      {
        id: '1',
        employeeId: '4',
        employeeName: 'Youssef Hamidi',
        startDate: '2024-03-01',
        endDate: '2024-03-05',
        days: 5,
        type: 'vacation',
        reason: 'Congés annuels',
        status: 'pending',
        requestDate: '2024-02-15'
      },
      {
        id: '2',
        employeeId: '5',
        employeeName: 'Simo Hamidi',
        startDate: '2024-04-10',
        endDate: '2024-04-12',
        days: 3,
        type: 'personal',
        reason: 'Congés personnels',
        status: 'approved',
        requestDate: '2024-02-20',
        approvedBy: '2',
        approvedDate: '2024-02-22'
      }
    ];
  }

  private getDefaultUsers(): User[] {
    return this.getDefaultEmployees();
  }

  // === UTILITAIRES ===
  clearAllData(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('🗑️ Toutes les données ont été effacées');
  }

  exportAllData(): string {
    const data = {
      employees: this.getEmployees(),
      objectives: this.getObjectives(),
      trainings: this.getTrainings(),
      vacations: this.getVacations(),
      users: this.getUsers(),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  importAllData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.employees) this.saveEmployees(data.employees);
      if (data.objectives) this.saveObjectives(data.objectives);
      if (data.trainings) this.saveTrainings(data.trainings);
      if (data.vacations) this.saveVacations(data.vacations);
      if (data.users) this.saveUsers(data.users);
      
      console.log('✅ Import des données réussi');
      return true;
    } catch (error) {
      console.error('❌ Erreur import:', error);
      return false;
    }
  }

  getStorageInfo(): { key: string; size: number; items: number }[] {
    return Object.entries(this.STORAGE_KEYS).map(([name, key]) => {
      const data = localStorage.getItem(key);
      return {
        key: name,
        size: data ? new Blob([data]).size : 0,
        items: data ? JSON.parse(data).length : 0
      };
    });
  }
}

export const storageService = new StorageService();
export default storageService;
