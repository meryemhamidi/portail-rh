import { User } from '../types';

// Calculer l'ancienneté d'un utilisateur en jours
export const getUserSeniority = (hireDate: string): number => {
  const hire = new Date(hireDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - hire.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  console.log(`Debug: hireDate=${hireDate}, seniority=${diffDays} jours`);
  return diffDays;
};

// Générer des données adaptées selon l'ancienneté
export const getAdaptedUserData = (user: User) => {
  const seniority = getUserSeniority(user.hireDate);
  const isNewUser = seniority <= 1; // Nouveau si embauché aujourd'hui ou hier
  
  console.log(`Debug: User ${user.firstName}, seniority=${seniority}, isNewUser=${isNewUser}`);
  
  if (isNewUser) {
    return {
      // Données pour nouveaux utilisateurs
      vacationDaysLeft: 25, // Congés complets pour l'année
      usedVacationDays: 0,
      completedObjectives: 0,
      personalObjectives: 0, // Pas encore d'objectifs assignés
      completedTrainings: 0,
      pendingRequests: 0,
      objectives: [],
      notifications: [
        {
          id: '1',
          type: 'welcome',
          title: 'Bienvenue chez Teal Technology Services !',
          message: 'Votre compte a été créé avec succès. Prenez le temps de découvrir votre espace personnel.',
          timestamp: new Date().toISOString(),
          isNew: true
        },
        {
          id: '2',
          type: 'info',
          title: 'Complétez votre profil',
          message: 'N\'oubliez pas de compléter vos informations personnelles dans la section Mon Profil.',
          timestamp: new Date().toISOString(),
          isNew: true
        }
      ],
      upcomingEvents: [
        {
          id: '1',
          title: 'Réunion d\'accueil',
          description: 'Présentation de l\'équipe et des processus',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Demain
          type: 'meeting'
        }
      ]
    };
  } else {
    // Données pour utilisateurs expérimentés (données actuelles)
    return {
      vacationDaysLeft: 18,
      usedVacationDays: 7,
      completedObjectives: 3,
      personalObjectives: 5,
      completedTrainings: 4,
      pendingRequests: 1,
      objectives: [
        {
          id: '1',
          title: 'Développement API REST',
          progress: 100,
          status: 'completed',
          dueDate: '2024-01-10'
        },
        {
          id: '2',
          title: 'Formation React Advanced',
          progress: 75,
          status: 'in_progress',
          dueDate: '2024-01-31'
        },
        {
          id: '3',
          title: 'Code Review Process',
          progress: 45,
          status: 'in_progress',
          dueDate: '2024-01-20'
        }
      ],
      notifications: [
        {
          id: '1',
          type: 'success',
          title: 'Congé approuvé',
          message: 'Votre demande du 20-25 janvier a été approuvée',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Il y a 2h
          isNew: false
        },
        {
          id: '2',
          type: 'info',
          title: 'Nouvelle formation',
          message: 'Formation "React Advanced" assignée',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Il y a 1 jour
          isNew: false
        }
      ],
      upcomingEvents: [
        {
          id: '1',
          title: 'Réunion équipe',
          description: 'Demain 14h00 - Salle de conférence',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          type: 'meeting'
        },
        {
          id: '2',
          title: 'Formation React',
          description: 'Vendredi 10h00 - En ligne',
          date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'training'
        }
      ]
    };
  }
};

// Générer un message de bienvenue personnalisé
export const getWelcomeMessage = (user: User): string => {
  const seniority = getUserSeniority(user.hireDate);
  
  if (seniority <= 1) {
    return `Bienvenue ${user.firstName} ! Votre aventure chez Teal Technology Services commence aujourd'hui.`;
  } else if (seniority <= 7) {
    return `Bonjour ${user.firstName} ! Vous êtes avec nous depuis ${seniority} jour${seniority > 1 ? 's' : ''}. Prenez le temps de vous familiariser avec votre espace.`;
  } else if (seniority <= 30) {
    return `Bonjour ${user.firstName} ! Vous êtes avec nous depuis ${Math.floor(seniority / 7)} semaine${Math.floor(seniority / 7) > 1 ? 's' : ''}. Comment se passe votre intégration ?`;
  } else {
    return `Bienvenue dans votre espace personnel, ${user.firstName} !`;
  }
};
