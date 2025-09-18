// Constantes pour l'application Teal Technology Services

export const COMPANY_NAME = 'Teal Technology Services';
export const APP_NAME = 'Portail RH International';

export const COLORS = {
  PRIMARY: '#008080',
  SECONDARY: '#0f766e',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6'
};

export const USER_ROLES = {
  ADMIN: 'admin',
  HR: 'hr',
  MANAGER: 'manager',
  EMPLOYEE: 'employee'
} as const;

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    LOGS: '/admin/logs',
    DATA: '/admin/data',
    SETTINGS: '/admin/settings'
  },
  HR: {
    DASHBOARD: '/hr/dashboard',
    EMPLOYEES: '/hr/employees',
    VACATIONS: '/hr/vacations',
    CONTRACTS: '/hr/contracts',
    TRAININGS: '/hr/trainings',
    REPORTS: '/hr/reports'
  },
  MANAGER: {
    DASHBOARD: '/manager/dashboard',
    TEAM: '/manager/team',
    OBJECTIVES: '/manager/objectives',
    PLANNING: '/manager/planning',
    REPORTS: '/manager/reports'
  },
  EMPLOYEE: {
    DASHBOARD: '/employee/dashboard',
    PROFILE: '/employee/profile',
    VACATIONS: '/employee/vacations',
    TRAININGS: '/employee/trainings',
    OBJECTIVES: '/employee/objectives',
    DOCUMENTS: '/employee/documents',
    SETTINGS: '/employee/settings'
  }
};

export const VACATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

export const TRAINING_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const OBJECTIVE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  OVERDUE: 'overdue'
} as const;

export const DOCUMENT_TYPES = {
  CONTRACT: 'contract',
  PAYSLIP: 'payslip',
  CERTIFICATE: 'certificate',
  OTHER: 'other'
} as const;

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh'
  },
  USERS: '/api/users',
  EMPLOYEES: '/api/employees',
  VACATIONS: '/api/vacations',
  TRAININGS: '/api/trainings',
  OBJECTIVES: '/api/objectives',
  DOCUMENTS: '/api/documents',
  AI_PREDICTIONS: '/api/ai/predictions',
  CHATBOT: '/api/chatbot'
};

export const CHATBOT_RESPONSES = {
  WELCOME: 'Bonjour ! Je suis TealBot, votre assistant RH. Comment puis-je vous aider aujourd\'hui ?',
  ERROR: 'Désolé, je n\'ai pas pu traiter votre demande. Pouvez-vous reformuler ?',
  HELP: 'Je peux vous aider avec les congés, les formations, les documents RH, et bien plus encore !'
};
