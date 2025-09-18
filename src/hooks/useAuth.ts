import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate async login with setTimeout
    setTimeout(() => {
      try {
        if (!email || !password) {
          throw new Error('Email et mot de passe requis');
        }
        
        // Vérifier le mot de passe
        if (password !== 'Admin123') {
          throw new Error('Mot de passe incorrect');
        }
        
        // Définir les utilisateurs spécifiques avec leurs rôles
        const specificUsers: { [key: string]: { firstName: string; lastName: string; role: UserRole; department: string; position: string; id: string } } = {
          'meryem.hamidi@teal-tech.com': {
            id: '1',
            firstName: 'Meryem',
            lastName: 'Hamidi',
            role: 'admin',
            department: 'Administration',
            position: 'Administrateur Système'
          },
          'kenza.hamidi@teal-tech.com': {
            id: '2',
            firstName: 'Kenza',
            lastName: 'Hamidi',
            role: 'hr',
            department: 'Ressources Humaines',
            position: 'Responsable RH'
          },
          'lina.hamidi@teal-tech.com': {
            id: '3',
            firstName: 'Lina',
            lastName: 'Hamidi',
            role: 'hr',
            department: 'Développement',
            position: 'Chef de Projet RH'
          },
          'youssef.hamidi@teal-tech.com': {
            id: '4',
            firstName: 'Youssef',
            lastName: 'Hamidi',
            role: 'employee',
            department: 'Design',
            position: 'UX/UI Designer'
          },
          'simo.hamidi@teal-tech.com': {
            id: '5',
            firstName: 'Simo',
            lastName: 'Hamidi',
            role: 'employee',
            department: 'Développement',
            position: 'Développeur Full-Stack'
          },
          'nasma.hamidi@teal-tech.com': {
            id: '6',
            firstName: 'Nasma',
            lastName: 'Hamidi',
            role: 'manager',
            department: 'Développement',
            position: 'Manager Équipe'
          }
        };
        
        const userInfo = specificUsers[email.toLowerCase()];
        
        if (!userInfo) {
          throw new Error('Utilisateur non autorisé');
        }
        
        // Create a complete User object matching the types interface
        const userData: User = {
          id: userInfo.id,
          email,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          role: userInfo.role,
          department: userInfo.department,
          position: userInfo.position,
          hireDate: '2024-01-15', // Date d'embauche fixe
          isActive: true
        };
        
        setUser(userData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de connexion');
      } finally {
        setIsLoading(false);
      }
    }, 1000); // Simulate network delay
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const isAuthenticated = user !== null;

  return React.createElement(
    AuthContext.Provider,
    { value: { user, login, logout, updateUser, isLoading, error, isAuthenticated } },
    children
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};