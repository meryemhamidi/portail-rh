import axios from 'axios';
import { User, Employee, VacationRequest, Training, Objective, AIPredicton } from '../types';

// Configuration de l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/api/auth/logout');
    localStorage.removeItem('authToken');
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/api/auth/me');
    return response.data;
  }
};

// Services utilisateurs
export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/api/users');
    return response.data;
  },

  createUser: async (userData: Partial<User>): Promise<User> => {
    const response = await api.post('/api/users', userData);
    return response.data;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/api/users/${id}`);
  }
};

// Services employés
export const employeeService = {
  getEmployees: async (): Promise<Employee[]> => {
    const response = await api.get('/api/employees');
    return response.data;
  },

  getEmployee: async (id: string): Promise<Employee> => {
    const response = await api.get(`/api/employees/${id}`);
    return response.data;
  },

  updateEmployee: async (id: string, data: Partial<Employee>): Promise<Employee> => {
    const response = await api.put(`/api/employees/${id}`, data);
    return response.data;
  }
};

// Services congés
export const vacationService = {
  getVacations: async (): Promise<VacationRequest[]> => {
    const response = await api.get('/api/vacations');
    return response.data;
  },

  createVacationRequest: async (data: Partial<VacationRequest>): Promise<VacationRequest> => {
    const response = await api.post('/api/vacations', data);
    return response.data;
  },

  updateVacationStatus: async (id: string, status: string, comments?: string): Promise<VacationRequest> => {
    const response = await api.put(`/api/vacations/${id}`, { status, comments });
    return response.data;
  }
};

// Services formations
export const trainingService = {
  getTrainings: async (): Promise<Training[]> => {
    const response = await api.get('/api/trainings');
    return response.data;
  },

  createTraining: async (data: Partial<Training>): Promise<Training> => {
    const response = await api.post('/api/trainings', data);
    return response.data;
  },

  updateTraining: async (id: string, data: Partial<Training>): Promise<Training> => {
    const response = await api.put(`/api/trainings/${id}`, data);
    return response.data;
  }
};

// Services objectifs
export const objectiveService = {
  getObjectives: async (employeeId?: string): Promise<Objective[]> => {
    const url = employeeId ? `/api/objectives?employeeId=${employeeId}` : '/api/objectives';
    const response = await api.get(url);
    return response.data;
  },

  createObjective: async (data: Partial<Objective>): Promise<Objective> => {
    const response = await api.post('/api/objectives', data);
    return response.data;
  },

  updateObjective: async (id: string, data: Partial<Objective>): Promise<Objective> => {
    const response = await api.put(`/api/objectives/${id}`, data);
    return response.data;
  }
};

// Services IA prédictive
export const aiService = {
  getSalaryPredictions: async (): Promise<AIPredicton[]> => {
    const response = await api.get('/api/ai/predictions/salary');
    return response.data;
  },

  getEmployeePrediction: async (employeeId: string): Promise<AIPredicton> => {
    const response = await api.get(`/api/ai/predictions/salary/${employeeId}`);
    return response.data;
  }
};

// Service chatbot
export const chatbotService = {
  sendMessage: async (message: string): Promise<string> => {
    const response = await api.post('/api/chatbot', { message });
    return response.data.response;
  }
};

// Service dashboard
export const dashboardService = {
  getStats: async (role: string) => {
    const response = await api.get(`/api/dashboard/stats?role=${role}`);
    return response.data;
  }
};

export default api;
