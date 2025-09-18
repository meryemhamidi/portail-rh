// Types pour l'application Teal Technology Services

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  position: string;
  hireDate: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
}

export type UserRole = 'admin' | 'hr' | 'manager' | 'employee';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Employee extends User {
  managerId?: string;
  salary?: number;
  vacationDays?: number;
  usedVacationDays?: number;
  performance?: number;
  trainings?: Training[];
  documents?: Document[];
  skills?: string[];
}

export interface PerformanceData {
  score: number;
  lastEvaluation: string;
  objectives: Objective[];
  feedback: Feedback[];
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
}

export interface Training {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  instructor: string;
}

export interface VacationRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  approvedBy?: string;
  approvalDate?: string;
  comments?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'contract' | 'payslip' | 'certificate' | 'attestation' | 'other';
  url: string;
  uploadDate: string;
  size: number;
}

export interface Feedback {
  id: string;
  from: string;
  message: string;
  date: string;
  rating?: number;
}

export interface AIPredicton {
  employeeId: string;
  salaryIncreaseProb: number;
  factors: {
    performance: number;
    seniority: number;
    training: number;
    absenteeism: number;
  };
  recommendation: string;
  confidence: number;
}

export interface ChatMessage {
  id: string;
  message: string;
  isBot: boolean;
  timestamp: string;
  userId?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  pendingVacations: number;
  upcomingTrainings: number;
  averagePerformance: number;
  turnoverRate: number;
  absenteeismRate: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// Nouveaux types pour la gestion des utilisateurs et historique
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  description: string;
  timestamp: string;
  category: 'login' | 'profile' | 'vacation' | 'training' | 'document' | 'performance' | 'system';
  metadata?: Record<string, any>;
}

export interface UserProfile extends User {
  activityHistory: ActivityLog[];
  createdBy?: string;
  createdAt: string;
  lastActivity?: string;
  profileCompleteness: number;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: 'fr' | 'en';
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisible: boolean;
    activityVisible: boolean;
  };
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  department: string;
  position: string;
  phone?: string;
  temporaryPassword?: string;
}
