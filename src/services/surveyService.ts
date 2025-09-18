interface Question {
  id: string;
  type: 'text' | 'multiple_choice' | 'rating' | 'yes_no';
  question: string;
  options?: string[];
  required: boolean;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  responses?: SurveyResponse[];
}

interface SurveyResponse {
  id: string;
  surveyId: string;
  employeeId: string;
  employeeName: string;
  responses: { questionId: string; answer: any }[];
  submittedAt: string;
}

class SurveyService {
  private readonly STORAGE_KEY = 'teal_surveys';
  private readonly RESPONSES_KEY = 'teal_survey_responses';

  // Récupérer tous les sondages
  getSurveys(): Survey[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultSurveys();
    } catch (error) {
      console.error('Erreur lors de la récupération des sondages:', error);
      return this.getDefaultSurveys();
    }
  }

  // Sauvegarder les sondages
  private saveSurveys(surveys: Survey[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(surveys));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des sondages:', error);
    }
  }

  // Créer un nouveau sondage
  createSurvey(surveyData: Omit<Survey, 'id' | 'createdAt' | 'createdBy'>, createdBy: string): Survey {
    const surveys = this.getSurveys();
    
    const newSurvey: Survey = {
      ...surveyData,
      id: `survey_${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy,
      responses: []
    };

    surveys.push(newSurvey);
    this.saveSurveys(surveys);
    
    return newSurvey;
  }

  // Mettre à jour un sondage
  updateSurvey(surveyId: string, updates: Partial<Survey>): Survey | null {
    const surveys = this.getSurveys();
    const index = surveys.findIndex(s => s.id === surveyId);
    
    if (index !== -1) {
      surveys[index] = { ...surveys[index], ...updates };
      this.saveSurveys(surveys);
      return surveys[index];
    }
    
    return null;
  }

  // Supprimer un sondage
  deleteSurvey(surveyId: string): boolean {
    const surveys = this.getSurveys();
    const filteredSurveys = surveys.filter(s => s.id !== surveyId);
    
    if (filteredSurveys.length !== surveys.length) {
      this.saveSurveys(filteredSurveys);
      // Supprimer aussi les réponses associées
      this.deleteResponsesBySurvey(surveyId);
      return true;
    }
    
    return false;
  }

  // Récupérer un sondage par ID
  getSurveyById(surveyId: string): Survey | null {
    const surveys = this.getSurveys();
    return surveys.find(s => s.id === surveyId) || null;
  }

  // Récupérer les sondages actifs
  getActiveSurveys(): Survey[] {
    return this.getSurveys().filter(s => s.isActive);
  }

  // Gestion des réponses
  getSurveyResponses(surveyId?: string): SurveyResponse[] {
    try {
      const stored = localStorage.getItem(this.RESPONSES_KEY);
      const responses = stored ? JSON.parse(stored) : [];
      return surveyId ? responses.filter((r: SurveyResponse) => r.surveyId === surveyId) : responses;
    } catch (error) {
      console.error('Erreur lors de la récupération des réponses:', error);
      return [];
    }
  }

  private saveResponses(responses: SurveyResponse[]): void {
    try {
      localStorage.setItem(this.RESPONSES_KEY, JSON.stringify(responses));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des réponses:', error);
    }
  }

  // Soumettre une réponse à un sondage
  submitSurveyResponse(
    surveyId: string, 
    employeeId: string, 
    employeeName: string, 
    responses: { questionId: string; answer: any }[]
  ): SurveyResponse {
    const allResponses = this.getSurveyResponses();
    
    const newResponse: SurveyResponse = {
      id: `response_${Date.now()}`,
      surveyId,
      employeeId,
      employeeName,
      responses,
      submittedAt: new Date().toISOString()
    };

    allResponses.push(newResponse);
    this.saveResponses(allResponses);
    
    return newResponse;
  }

  // Supprimer les réponses d'un sondage
  private deleteResponsesBySurvey(surveyId: string): void {
    const responses = this.getSurveyResponses();
    const filteredResponses = responses.filter(r => r.surveyId !== surveyId);
    this.saveResponses(filteredResponses);
  }

  // Obtenir les statistiques d'un sondage
  getSurveyStats(surveyId: string): {
    totalResponses: number;
    responseRate: number;
    questionStats: { [questionId: string]: any };
  } {
    const survey = this.getSurveyById(surveyId);
    const responses = this.getSurveyResponses(surveyId);
    
    if (!survey) {
      return { totalResponses: 0, responseRate: 0, questionStats: {} };
    }

    const totalEmployees = 156; // Nombre d'employés (à récupérer depuis le service employés)
    const totalResponses = responses.length;
    const responseRate = (totalResponses / totalEmployees) * 100;

    const questionStats: { [questionId: string]: any } = {};

    survey.questions.forEach(question => {
      const questionResponses = responses
        .map(r => r.responses.find(resp => resp.questionId === question.id))
        .filter(Boolean);

      switch (question.type) {
        case 'rating':
          const ratings = questionResponses.map(r => Number(r?.answer)).filter(r => !isNaN(r));
          questionStats[question.id] = {
            average: ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0,
            distribution: [1, 2, 3, 4, 5].map(rating => 
              ratings.filter(r => r === rating).length
            )
          };
          break;

        case 'multiple_choice':
          const choices = questionResponses.map(r => r?.answer).filter(Boolean);
          const choiceCount: { [key: string]: number } = {};
          choices.forEach(choice => {
            choiceCount[choice] = (choiceCount[choice] || 0) + 1;
          });
          questionStats[question.id] = choiceCount;
          break;

        case 'yes_no':
          const yesNoResponses = questionResponses.map(r => r?.answer).filter(Boolean);
          questionStats[question.id] = {
            yes: yesNoResponses.filter(r => r === 'yes').length,
            no: yesNoResponses.filter(r => r === 'no').length
          };
          break;

        case 'text':
          questionStats[question.id] = {
            totalResponses: questionResponses.length,
            responses: questionResponses.map(r => r?.answer).filter(Boolean)
          };
          break;
      }
    });

    return {
      totalResponses,
      responseRate,
      questionStats
    };
  }

  // Sondages par défaut pour la démo
  private getDefaultSurveys(): Survey[] {
    return [
      {
        id: 'survey_demo_1',
        title: 'Satisfaction au travail 2024',
        description: 'Évaluez votre satisfaction générale au travail et aidez-nous à améliorer l\'environnement de travail.',
        isActive: true,
        createdAt: '2024-01-15T10:00:00.000Z',
        createdBy: 'hr-manager',
        questions: [
          {
            id: 'q1',
            type: 'rating',
            question: 'Comment évaluez-vous votre satisfaction générale au travail ?',
            required: true
          },
          {
            id: 'q2',
            type: 'multiple_choice',
            question: 'Quel aspect de votre travail appréciez-vous le plus ?',
            options: ['L\'équipe', 'Les projets', 'L\'autonomie', 'La formation', 'L\'environnement'],
            required: true
          },
          {
            id: 'q3',
            type: 'yes_no',
            question: 'Recommanderiez-vous notre entreprise comme lieu de travail ?',
            required: true
          },
          {
            id: 'q4',
            type: 'text',
            question: 'Quelles améliorations suggéreriez-vous ?',
            required: false
          }
        ],
        responses: []
      },
      {
        id: 'survey_demo_2',
        title: 'Formation et développement',
        description: 'Aidez-nous à identifier vos besoins en formation et développement professionnel.',
        isActive: false,
        createdAt: '2024-02-01T14:30:00.000Z',
        createdBy: 'hr-manager',
        questions: [
          {
            id: 'q5',
            type: 'multiple_choice',
            question: 'Dans quel domaine souhaiteriez-vous vous former ?',
            options: ['Technique', 'Management', 'Communication', 'Langues', 'Autre'],
            required: true
          },
          {
            id: 'q6',
            type: 'rating',
            question: 'Comment évaluez-vous les formations actuellement proposées ?',
            required: true
          }
        ],
        responses: []
      }
    ];
  }
}

export const surveyService = new SurveyService();
export type { Survey, Question, SurveyResponse };
