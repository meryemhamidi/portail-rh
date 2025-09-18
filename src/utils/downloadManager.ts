import { pdfGenerator, PDFData } from './pdfGenerator';
import { excelGenerator, ExcelData } from './excelGenerator';

export type DownloadType = 
  | 'employee_list'
  | 'vacation_list' 
  | 'training_list'
  | 'contract_list'
  | 'evaluation_list'
  | 'survey_responses'
  | 'survey_stats'
  | 'hr_report'
  | 'performance_report'
  | 'generic_report';

export interface DownloadOptions {
  type: DownloadType;
  title: string;
  data: any;
  subtitle?: string;
}

class DownloadManager {
  
  /**
   * Télécharge automatiquement au format approprié selon le type de contenu
   * - PDF pour les rapports, statistiques et documents
   * - Excel pour les listes et données tabulaires
   */
  download(options: DownloadOptions): void {
    const { type, title, data, subtitle } = options;
    
    console.log('DownloadManager.download appelé avec:', { type, title, data });

    // Logique de choix du format selon le type
    if (this.shouldUseExcel(type)) {
      console.log('Choix: Excel pour type', type);
      this.downloadAsExcel(type, title, data);
    } else {
      console.log('Choix: PDF pour type', type);
      this.downloadAsPDF(type, title, data, subtitle);
    }
  }

  private shouldUseExcel(type: DownloadType): boolean {
    // Types qui nécessitent Excel (données tabulaires)
    const excelTypes: DownloadType[] = [
      'employee_list',
      'vacation_list',
      'training_list',
      'contract_list',
      'evaluation_list',
      'survey_responses'
    ];
    
    return excelTypes.includes(type);
  }

  private downloadAsExcel(type: DownloadType, title: string, data: any): void {
    switch (type) {
      case 'employee_list':
        excelGenerator.generateEmployeeList(data);
        break;
        
      case 'vacation_list':
        excelGenerator.generateVacationList(data);
        break;
        
      case 'training_list':
        excelGenerator.generateTrainingList(data);
        break;
        
      case 'contract_list':
        excelGenerator.generateContractList(data);
        break;
        
      case 'evaluation_list':
        excelGenerator.generateEvaluationList(data);
        break;
        
      case 'survey_responses':
        excelGenerator.generateSurveyResponses(data.survey, data.responses);
        break;
        
      default:
        // Fallback générique
        const excelData: ExcelData = {
          title,
          sheets: [{
            name: 'Données',
            data: Array.isArray(data) ? data : [data]
          }]
        };
        excelGenerator.generateExcel(excelData);
    }
  }

  private downloadAsPDF(type: DownloadType, title: string, data: any, subtitle?: string): void {
    console.log('downloadAsPDF appelé avec:', { type, title, data, subtitle });
    
    let pdfType: PDFData['type'] = 'report';
    
    switch (type) {
      case 'survey_stats':
        pdfType = 'survey';
        break;
      case 'hr_report':
      case 'performance_report':
        pdfType = 'report';
        break;
      default:
        pdfType = 'report';
    }

    const pdfData: PDFData = {
      title,
      subtitle,
      data,
      type: pdfType
    };

    console.log('Appel pdfGenerator.generatePDF avec:', pdfData);
    pdfGenerator.generatePDF(pdfData);
    console.log('pdfGenerator.generatePDF terminé');
  }

  // Méthodes de convenance pour les cas d'usage courants

  downloadEmployeeList(employees: any[]): void {
    this.download({
      type: 'employee_list',
      title: 'Liste des Employés',
      data: employees
    });
  }

  downloadVacationList(vacations: any[]): void {
    this.download({
      type: 'vacation_list',
      title: 'Liste des Congés',
      data: vacations
    });
  }

  downloadTrainingList(trainings: any[]): void {
    this.download({
      type: 'training_list',
      title: 'Liste des Formations',
      data: trainings
    });
  }

  downloadContractList(contracts: any[]): void {
    this.download({
      type: 'contract_list',
      title: 'Liste des Contrats',
      data: contracts
    });
  }

  downloadEvaluationList(evaluations: any[]): void {
    this.download({
      type: 'evaluation_list',
      title: 'Liste des Évaluations',
      data: evaluations
    });
  }

  downloadSurveyResponses(survey: any, responses: any[]): void {
    this.download({
      type: 'survey_responses',
      title: `Réponses - ${survey.title}`,
      data: { survey, responses }
    });
  }

  downloadSurveyStats(survey: any, stats: any): void {
    this.download({
      type: 'survey_stats',
      title: `Statistiques - ${survey.title}`,
      data: {
        ...stats,
        surveyTitle: survey.title,
        questions: survey.questions.length,
        questionStats: stats.questionStats
      },
      subtitle: `Analyse des résultats du sondage "${survey.title}"`
    });
  }

  downloadHRReport(reportData: any): void {
    this.download({
      type: 'hr_report',
      title: 'Rapport RH',
      data: reportData,
      subtitle: 'Rapport mensuel des ressources humaines'
    });
  }

  downloadPerformanceReport(performanceData: any): void {
    this.download({
      type: 'performance_report',
      title: 'Rapport de Performance',
      data: performanceData,
      subtitle: 'Analyse des performances des équipes'
    });
  }

  // Méthode pour télécharger avec choix manuel du format
  downloadWithFormat(options: DownloadOptions, format: 'pdf' | 'excel'): void {
    const { type, title, data, subtitle } = options;
    
    if (format === 'excel') {
      this.downloadAsExcel(type, title, data);
    } else {
      this.downloadAsPDF(type, title, data, subtitle);
    }
  }
}

export const downloadManager = new DownloadManager();
