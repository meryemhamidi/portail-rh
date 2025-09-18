import { Employee } from '../types';

export interface SalaryPrediction {
  currentSalary: number;
  predictedIncrease: number;
  newSalary: number;
  confidence: number;
  factors: string[];
  recommendation: string;
}

export interface PerformanceAnalysis {
  employeeId: string;
  currentScore: number;
  predictedScore: number;
  trend: 'up' | 'down' | 'stable';
  recommendations: string[];
  riskFactors: string[];
}

export interface TurnoverRisk {
  employeeId: string;
  riskLevel: 'low' | 'medium' | 'high';
  probability: number;
  factors: string[];
  retentionActions: string[];
}

class AIService {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.openai.com/v1';

  constructor() {
    // En production, utiliser une variable d'environnement
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || null;
  }

  /**
   * Prédiction d'augmentation salariale basée sur les performances
   */
  async predictSalaryIncrease(employee: Employee): Promise<SalaryPrediction> {
    try {
      // Si pas d'API key, utiliser la logique locale
      if (!this.apiKey) {
        return this.localSalaryPrediction(employee);
      }

      // Appel API OpenAI (exemple)
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Tu es un expert RH spécialisé dans l\'analyse salariale. Analyse les données employé et recommande une augmentation.'
            },
            {
              role: 'user',
              content: `Analyse cet employé: ${JSON.stringify(employee)}`
            }
          ],
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error('Erreur API OpenAI');
      }

      const data = await response.json();
      return this.parseAIResponse(data, employee);
    } catch (error) {
      console.warn('Fallback vers prédiction locale:', error);
      return this.localSalaryPrediction(employee);
    }
  }

  /**
   * Analyse prédictive des performances
   */
  async analyzePerformance(employee: Employee): Promise<PerformanceAnalysis> {
    const currentScore = employee.performance || 75;
    const experience = this.calculateExperience(employee.hireDate);
    const skillsCount = employee.skills?.length || 0;

    // Logique prédictive basique
    let predictedScore = currentScore;
    let trend: 'up' | 'down' | 'stable' = 'stable';
    const recommendations: string[] = [];
    const riskFactors: string[] = [];

    // Facteurs d'amélioration
    if (experience > 2 && skillsCount > 5) {
      predictedScore += 5;
      trend = 'up';
      recommendations.push('Candidat idéal pour des responsabilités supplémentaires');
    }

    if (currentScore < 60) {
      riskFactors.push('Performance en dessous de la moyenne');
      recommendations.push('Plan d\'amélioration des performances recommandé');
    }

    if (skillsCount < 3) {
      recommendations.push('Formation complémentaire recommandée');
    }

    return {
      employeeId: employee.id,
      currentScore,
      predictedScore: Math.min(predictedScore, 100),
      trend,
      recommendations,
      riskFactors
    };
  }

  /**
   * Évaluation du risque de turnover
   */
  async assessTurnoverRisk(employee: Employee): Promise<TurnoverRisk> {
    const experience = this.calculateExperience(employee.hireDate);
    const performance = employee.performance || 75;
    const salary = employee.salary || 50000;
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let probability = 0.1;
    const factors: string[] = [];
    const retentionActions: string[] = [];

    // Facteurs de risque
    if (performance < 60) {
      probability += 0.3;
      factors.push('Performance faible');
      retentionActions.push('Plan d\'amélioration des performances');
    }

    if (experience > 5 && salary < 60000) {
      probability += 0.2;
      factors.push('Salaire potentiellement en dessous du marché');
      retentionActions.push('Révision salariale');
    }

    if (experience < 1) {
      probability += 0.15;
      factors.push('Nouvelle recrue - période d\'adaptation');
      retentionActions.push('Programme de mentorat');
    }

    // Déterminer le niveau de risque
    if (probability > 0.4) riskLevel = 'high';
    else if (probability > 0.2) riskLevel = 'medium';

    return {
      employeeId: employee.id,
      riskLevel,
      probability: Math.min(probability, 0.8),
      factors,
      retentionActions
    };
  }

  /**
   * Recommandations RH intelligentes
   */
  async getHRRecommendations(employees: Employee[]): Promise<string[]> {
    const recommendations: string[] = [];
    
    // Analyse globale
    const avgPerformance = employees.reduce((sum, emp) => sum + (emp.performance || 75), 0) / employees.length;
    const lowPerformers = employees.filter(emp => (emp.performance || 75) < 60).length;
    const highPerformers = employees.filter(emp => (emp.performance || 75) > 85).length;

    if (avgPerformance < 70) {
      recommendations.push('📊 Performance globale en baisse - Audit des processus recommandé');
    }

    if (lowPerformers > employees.length * 0.2) {
      recommendations.push('⚠️ Taux élevé de sous-performance - Programme de formation urgent');
    }

    if (highPerformers > employees.length * 0.3) {
      recommendations.push('🌟 Excellent pool de talents - Opportunités de promotion à considérer');
    }

    // Analyse des départs potentiels
    const turnoverRisks = await Promise.all(
      employees.map(emp => this.assessTurnoverRisk(emp))
    );
    
    const highRiskCount = turnoverRisks.filter(risk => risk.riskLevel === 'high').length;
    if (highRiskCount > 0) {
      recommendations.push(`🚨 ${highRiskCount} employé(s) à risque de départ - Actions de rétention urgentes`);
    }

    return recommendations;
  }

  /**
   * Prédiction salariale locale (fallback)
   */
  private localSalaryPrediction(employee: Employee): SalaryPrediction {
    const currentSalary = employee.salary || 50000;
    const performance = employee.performance || 75;
    const experience = this.calculateExperience(employee.hireDate);
    
    let increasePercentage = 0;
    const factors: string[] = [];

    // Logique basique d'augmentation
    if (performance > 85) {
      increasePercentage += 0.08; // 8%
      factors.push('Performance excellente');
    } else if (performance > 75) {
      increasePercentage += 0.05; // 5%
      factors.push('Bonne performance');
    } else if (performance > 60) {
      increasePercentage += 0.03; // 3%
      factors.push('Performance satisfaisante');
    }

    if (experience > 3) {
      increasePercentage += 0.02;
      factors.push('Expérience significative');
    }

    const predictedIncrease = currentSalary * increasePercentage;
    const newSalary = currentSalary + predictedIncrease;
    
    let recommendation = '';
    if (increasePercentage > 0.06) {
      recommendation = 'Augmentation recommandée - Employé performant';
    } else if (increasePercentage > 0.03) {
      recommendation = 'Augmentation modérée appropriée';
    } else {
      recommendation = 'Maintien du salaire ou augmentation minimale';
    }

    return {
      currentSalary,
      predictedIncrease,
      newSalary,
      confidence: 0.75,
      factors,
      recommendation
    };
  }

  /**
   * Parser la réponse de l'API IA
   */
  private parseAIResponse(data: any, employee: Employee): SalaryPrediction {
    // Logique de parsing de la réponse IA
    // Pour l'instant, fallback vers la prédiction locale
    return this.localSalaryPrediction(employee);
  }

  /**
   * Calculer l'expérience en années
   */
  private calculateExperience(hireDate: string): number {
    const hire = new Date(hireDate);
    const now = new Date();
    return Math.floor((now.getTime() - hire.getTime()) / (1000 * 60 * 60 * 24 * 365));
  }
}

export const aiService = new AIService();
