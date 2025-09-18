// Configuration des routes pour l'application Teal Portail RH

export const ROUTES = {
  // Routes publiques
  LOGIN: '/login',
  
  // Routes Admin
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    SETTINGS: '/admin/settings',
    LOGS: '/admin/logs'
  },
  
  // Routes RH
  HR: {
    DASHBOARD: '/hr/dashboard',
    EMPLOYEES: '/hr/employees',
    VACATIONS: '/hr/vacations',
    TRAININGS: '/hr/trainings',
    CONTRACTS: '/hr/contracts',
    REPORTS: '/hr/reports'
  },
  
  // Routes Manager
  MANAGER: {
    DASHBOARD: '/manager/dashboard',
    TEAM: '/manager/team',
    OBJECTIVES: '/manager/objectives',
    PLANNING: '/manager/planning',
    REPORTS: '/manager/reports'
  },
  
  // Routes Employé
  EMPLOYEE: {
    DASHBOARD: '/employee/dashboard',
    PROFILE: '/employee/profile',
    VACATIONS: '/employee/vacations',
    TRAININGS: '/employee/trainings',
    DOCUMENTS: '/employee/documents',
    OBJECTIVES: '/employee/objectives',
    SETTINGS: '/employee/settings'
  }
};

// Routes par défaut selon le rôle
export const DEFAULT_ROUTES = {
  admin: ROUTES.ADMIN.DASHBOARD,
  hr: ROUTES.HR.DASHBOARD,
  manager: ROUTES.MANAGER.DASHBOARD,
  employee: ROUTES.EMPLOYEE.DASHBOARD
};

// Routes publiques (accessibles sans authentification)
export const PUBLIC_ROUTES = [
  ROUTES.LOGIN
];

// Fonction utilitaire pour obtenir la route par défaut selon le rôle
export const getDefaultRouteForRole = (role: string): string => {
  return DEFAULT_ROUTES[role as keyof typeof DEFAULT_ROUTES] || ROUTES.LOGIN;
};
