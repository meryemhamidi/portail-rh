import { Employee, Objective, Training, VacationRequest } from '../types';

// Service global pour gérer les données partagées entre les rôles
class GlobalDataService {
  private static instance: GlobalDataService;
  private vacationRequests: VacationRequest[] = [];
  private objectives: Objective[] = [];
  private notifications: any[] = [];
  private listeners: { [key: string]: Function[] } = {};

  private constructor() {
    this.loadInitialData();
  }

  static getInstance(): GlobalDataService {
    if (!GlobalDataService.instance) {
      GlobalDataService.instance = new GlobalDataService();
    }
    return GlobalDataService.instance;
  }

  // Système d'événements pour notifier les changements
  subscribe(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  unsubscribe(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  private emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  // Gestion des demandes de congés
  addVacationRequest(request: Omit<VacationRequest, 'id'>): VacationRequest {
    const newRequest: VacationRequest = {
      ...request,
      id: Date.now().toString(),
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0]
    };
    
    this.vacationRequests.push(newRequest);
    this.saveToStorage();
    
    // Notifier les RH d'une nouvelle demande
    this.addNotification({
      type: 'vacation_request',
      title: 'Nouvelle demande de congé',
      message: `${request.employeeName} a soumis une demande de congé`,
      targetRole: 'hr',
      data: newRequest
    });
    
    this.emit('vacation_request_added', newRequest);
    return newRequest;
  }

  getVacationRequests(filters?: { employeeId?: string; status?: string }): VacationRequest[] {
    let requests = [...this.vacationRequests];
    
    if (filters?.employeeId) {
      requests = requests.filter(req => req.employeeId === filters.employeeId);
    }
    
    if (filters?.status) {
      requests = requests.filter(req => req.status === filters.status);
    }
    
    return requests.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
  }

  updateVacationRequest(id: string, updates: Partial<VacationRequest>): VacationRequest | null {
    const index = this.vacationRequests.findIndex(req => req.id === id);
    if (index === -1) return null;
    
    const oldRequest = this.vacationRequests[index];
    this.vacationRequests[index] = { ...oldRequest, ...updates };
    
    // Si le statut change, notifier l'employé
    if (updates.status && updates.status !== oldRequest.status) {
      this.addNotification({
        type: 'vacation_status_update',
        title: 'Mise à jour de votre demande de congé',
        message: `Votre demande de congé a été ${updates.status === 'approved' ? 'approuvée' : 'rejetée'}`,
        targetRole: 'employee',
        targetUserId: oldRequest.employeeId,
        data: this.vacationRequests[index]
      });
    }
    
    this.saveToStorage();
    this.emit('vacation_request_updated', this.vacationRequests[index]);
    return this.vacationRequests[index];
  }

  // Gestion des objectifs
  addObjective(objective: Omit<Objective, 'id'>): Objective {
    const newObjective: Objective = {
      ...objective,
      id: Date.now().toString()
    };
    
    this.objectives.push(newObjective);
    this.saveToStorage();
    
    // Notifier l'employé d'un nouvel objectif
    this.addNotification({
      type: 'objective_assigned',
      title: 'Nouvel objectif assigné',
      message: `Un nouvel objectif vous a été assigné: ${objective.title}`,
      targetRole: 'employee',
      targetUserId: objective.employeeId,
      data: newObjective
    });
    
    this.emit('objective_added', newObjective);
    return newObjective;
  }

  getObjectives(filters?: { employeeId?: string; managerId?: string }): Objective[] {
    let objectives = [...this.objectives];
    
    if (filters?.employeeId) {
      objectives = objectives.filter(obj => obj.employeeId === filters.employeeId);
    }
    
    if (filters?.managerId) {
      objectives = objectives.filter(obj => obj.managerId === filters.managerId);
    }
    
    return objectives;
  }

  updateObjective(id: string, updates: Partial<Objective>): Objective | null {
    const index = this.objectives.findIndex(obj => obj.id === id);
    if (index === -1) return null;
    
    const oldObjective = this.objectives[index];
    this.objectives[index] = { ...oldObjective, ...updates };
    
    // Notifier le manager des mises à jour de progression
    if (updates.progress !== undefined && updates.progress !== oldObjective.progress) {
      this.addNotification({
        type: 'objective_progress_update',
        title: 'Mise à jour de progression',
        message: `${oldObjective.employeeName} a mis à jour la progression de "${oldObjective.title}" à ${updates.progress}%`,
        targetRole: 'manager',
        targetUserId: oldObjective.managerId,
        data: this.objectives[index]
      });
    }
    
    this.saveToStorage();
    this.emit('objective_updated', this.objectives[index]);
    return this.objectives[index];
  }

  // Gestion des notifications
  addNotification(notification: {
    type: string;
    title: string;
    message: string;
    targetRole: string;
    targetUserId?: string;
    data?: any;
  }) {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };
    
    this.notifications.push(newNotification);
    this.saveToStorage();
    this.emit('notification_added', newNotification);
  }

  getNotifications(filters?: { role?: string; userId?: string; unreadOnly?: boolean }): any[] {
    let notifications = [...this.notifications];
    
    if (filters?.role) {
      notifications = notifications.filter(notif => 
        notif.targetRole === filters.role || notif.targetRole === 'all'
      );
    }
    
    if (filters?.userId) {
      notifications = notifications.filter(notif => 
        !notif.targetUserId || notif.targetUserId === filters.userId
      );
    }
    
    if (filters?.unreadOnly) {
      notifications = notifications.filter(notif => !notif.read);
    }
    
    return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  markNotificationAsRead(id: string) {
    const notification = this.notifications.find(notif => notif.id === id);
    if (notification) {
      notification.read = true;
      this.saveToStorage();
      this.emit('notification_updated', notification);
    }
  }

  // Persistance des données
  private saveToStorage() {
    try {
      localStorage.setItem('teal_vacation_requests', JSON.stringify(this.vacationRequests));
      localStorage.setItem('teal_objectives', JSON.stringify(this.objectives));
      localStorage.setItem('teal_notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }

  private loadInitialData() {
    try {
      // Charger les demandes de congés
      const savedVacations = localStorage.getItem('teal_vacation_requests');
      if (savedVacations) {
        this.vacationRequests = JSON.parse(savedVacations);
      } else {
        // Données initiales pour démonstration
        this.vacationRequests = [
          {
            id: '1',
            employeeId: 'emp1',
            employeeName: 'Kenza Hamidi',
            startDate: '2024-02-15',
            endDate: '2024-02-25',
            type: 'paid',
            reason: 'Vacances d\'été en famille',
            status: 'pending',
            daysRequested: 8,
            days: 8,
            requestDate: '2024-02-01',
            comments: 'Demande pour congés annuels'
          }
        ];
      }

      // Charger les objectifs
      const savedObjectives = localStorage.getItem('teal_objectives');
      if (savedObjectives) {
        this.objectives = JSON.parse(savedObjectives);
      }

      // Charger les notifications
      const savedNotifications = localStorage.getItem('teal_notifications');
      if (savedNotifications) {
        this.notifications = JSON.parse(savedNotifications);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
  }

  // Méthodes utilitaires
  clearAllData() {
    this.vacationRequests = [];
    this.objectives = [];
    this.notifications = [];
    localStorage.removeItem('teal_vacation_requests');
    localStorage.removeItem('teal_objectives');
    localStorage.removeItem('teal_notifications');
  }

  getStats() {
    return {
      totalVacationRequests: this.vacationRequests.length,
      pendingVacationRequests: this.vacationRequests.filter(req => req.status === 'pending').length,
      totalObjectives: this.objectives.length,
      completedObjectives: this.objectives.filter(obj => obj.status === 'completed').length,
      unreadNotifications: this.notifications.filter(notif => !notif.read).length
    };
  }
}

export default GlobalDataService.getInstance();
