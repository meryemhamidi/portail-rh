import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { Employee, Objective, Training, VacationRequest, User } from '../types';

// Hook générique pour la persistance
export function useStoredData<T>(
  key: 'employees' | 'objectives' | 'trainings' | 'vacations' | 'users',
  initialData: T[] = []
) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(true);

  // Charger les données au montage
  useEffect(() => {
    const loadData = () => {
      try {
        let loadedData: T[] = [];
        
        switch (key) {
          case 'employees':
            loadedData = storageService.getEmployees() as T[];
            break;
          case 'objectives':
            loadedData = storageService.getObjectives() as T[];
            break;
          case 'trainings':
            loadedData = storageService.getTrainings() as T[];
            break;
          case 'vacations':
            loadedData = storageService.getVacations() as T[];
            break;
          case 'users':
            loadedData = storageService.getUsers() as T[];
            break;
        }
        
        setData(loadedData);
      } catch (error) {
        console.error(`Erreur chargement ${key}:`, error);
        setData(initialData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key, initialData]);

  // Sauvegarder les données
  const saveData = useCallback((newData: T[]) => {
    try {
      switch (key) {
        case 'employees':
          storageService.saveEmployees(newData as Employee[]);
          break;
        case 'objectives':
          storageService.saveObjectives(newData as Objective[]);
          break;
        case 'trainings':
          storageService.saveTrainings(newData as Training[]);
          break;
        case 'vacations':
          storageService.saveVacations(newData as VacationRequest[]);
          break;
        case 'users':
          storageService.saveUsers(newData as User[]);
          break;
      }
      setData(newData);
    } catch (error) {
      console.error(`Erreur sauvegarde ${key}:`, error);
    }
  }, [key]);

  // Ajouter un élément
  const addItem = useCallback((item: T) => {
    const newData = [...data, item];
    saveData(newData);
    return newData;
  }, [data, saveData]);

  // Mettre à jour un élément
  const updateItem = useCallback((id: string, updates: Partial<T>) => {
    const newData = data.map(item => 
      (item as any).id === id ? { ...item, ...updates } : item
    );
    saveData(newData);
    return newData;
  }, [data, saveData]);

  // Supprimer un élément
  const deleteItem = useCallback((id: string) => {
    const newData = data.filter(item => (item as any).id !== id);
    saveData(newData);
    return newData;
  }, [data, saveData]);

  return {
    data,
    loading,
    setData: saveData,
    addItem,
    updateItem,
    deleteItem,
    refresh: () => {
      setLoading(true);
      // Re-trigger useEffect
      setData([]);
    }
  };
}

// Hooks spécialisés
export function useEmployees() {
  return useStoredData<Employee>('employees');
}

export function useObjectives() {
  return useStoredData<Objective>('objectives');
}

export function useTrainings() {
  return useStoredData<Training>('trainings');
}

export function useVacations() {
  return useStoredData<VacationRequest>('vacations');
}

export function useUsers() {
  return useStoredData<User>('users');
}

// Hook pour les statistiques de stockage
export function useStorageInfo() {
  const [info, setInfo] = useState<{ key: string; size: number; items: number }[]>([]);

  const refreshInfo = useCallback(() => {
    const storageInfo = storageService.getStorageInfo();
    setInfo(storageInfo);
  }, []);

  useEffect(() => {
    refreshInfo();
  }, [refreshInfo]);

  return { info, refreshInfo };
}

// Hook pour l'export/import
export function useDataManagement() {
  const exportData = useCallback(() => {
    const data = storageService.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teal-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const importData = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const success = storageService.importAllData(content);
          resolve(success);
        } catch (error) {
          console.error('Erreur import:', error);
          resolve(false);
        }
      };
      reader.readAsText(file);
    });
  }, []);

  const clearAllData = useCallback(() => {
    storageService.clearAllData();
  }, []);

  return { exportData, importData, clearAllData };
}
