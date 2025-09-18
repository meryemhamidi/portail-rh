import { useState, useCallback } from 'react';
import { ActivityLog } from '../types/index';

interface ActivityTrackerHook {
  logActivity: (
    userId: string,
    action: string,
    description: string,
    category: ActivityLog['category'],
    metadata?: Record<string, any>
  ) => void;
  getUserActivities: (userId: string) => ActivityLog[];
  getAllActivities: () => ActivityLog[];
}

// Stockage local des activités (en production, ceci serait dans une base de données)
let activityStorage: ActivityLog[] = [];

export const useActivityTracker = (): ActivityTrackerHook => {
  const [activities, setActivities] = useState<ActivityLog[]>(activityStorage);

  const logActivity = useCallback((
    userId: string,
    action: string,
    description: string,
    category: ActivityLog['category'],
    metadata?: Record<string, any>
  ) => {
    const newActivity: ActivityLog = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      action,
      description,
      timestamp: new Date().toISOString(),
      category,
      metadata
    };

    activityStorage = [newActivity, ...activityStorage];
    setActivities([...activityStorage]);

    // En production, envoyer à l'API
    console.log('Nouvelle activité enregistrée:', newActivity);
  }, []);

  const getUserActivities = useCallback((userId: string) => {
    return activityStorage.filter(activity => activity.userId === userId);
  }, []);

  const getAllActivities = useCallback(() => {
    return activityStorage;
  }, []);

  return {
    logActivity,
    getUserActivities,
    getAllActivities
  };
};

// Hook pour tracker automatiquement les actions communes
export const useAutoActivityTracker = (userId: string) => {
  const { logActivity } = useActivityTracker();

  const trackLogin = useCallback(() => {
    logActivity(
      userId,
      'Connexion',
      'Connexion réussie au portail RH',
      'login',
      { timestamp: new Date().toISOString() }
    );
  }, [userId, logActivity]);

  const trackLogout = useCallback(() => {
    logActivity(
      userId,
      'Déconnexion',
      'Déconnexion du portail RH',
      'login',
      { timestamp: new Date().toISOString() }
    );
  }, [userId, logActivity]);

  const trackProfileUpdate = useCallback((fields: string[]) => {
    logActivity(
      userId,
      'Mise à jour profil',
      `Modification des champs: ${fields.join(', ')}`,
      'profile',
      { updatedFields: fields }
    );
  }, [userId, logActivity]);

  const trackVacationRequest = useCallback((startDate: string, endDate: string, days: number) => {
    logActivity(
      userId,
      'Demande de congé',
      `Demande de congé du ${startDate} au ${endDate} (${days} jours)`,
      'vacation',
      { startDate, endDate, days }
    );
  }, [userId, logActivity]);

  const trackTrainingEnrollment = useCallback((trainingTitle: string) => {
    logActivity(
      userId,
      'Inscription formation',
      `Inscription à la formation: ${trainingTitle}`,
      'training',
      { trainingTitle }
    );
  }, [userId, logActivity]);

  const trackDocumentUpload = useCallback((documentName: string, documentType: string) => {
    logActivity(
      userId,
      'Upload document',
      `Upload du document: ${documentName}`,
      'document',
      { documentName, documentType }
    );
  }, [userId, logActivity]);

  const trackPerformanceUpdate = useCallback((score: number) => {
    logActivity(
      userId,
      'Évaluation performance',
      `Mise à jour du score de performance: ${score}/100`,
      'performance',
      { score }
    );
  }, [userId, logActivity]);

  return {
    trackLogin,
    trackLogout,
    trackProfileUpdate,
    trackVacationRequest,
    trackTrainingEnrollment,
    trackDocumentUpload,
    trackPerformanceUpdate
  };
};
