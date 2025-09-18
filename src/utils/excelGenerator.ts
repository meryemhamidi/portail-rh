// Utilitaire pour générer des fichiers Excel avec SheetJS
// Note: En production, vous devriez installer xlsx: npm install xlsx

interface ExcelData {
  title: string;
  sheets: ExcelSheet[];
}

interface ExcelSheet {
  name: string;
  data: any[];
  headers?: string[];
}

class ExcelGenerator {
  private tealColor = '#008080';

  generateExcel(data: ExcelData): void {
    // Simulation de génération Excel - En production, utilisez xlsx
    const content = this.generateCSVContent(data);
    this.downloadAsCSV(content, data.title);
  }

  private generateCSVContent(data: ExcelData): string {
    let csvContent = '';
    
    data.sheets.forEach((sheet, index) => {
      if (index > 0) {
        csvContent += '\n\n';
      }
      
      // Titre de la feuille
      csvContent += `"=== ${sheet.name} ==="\n`;
      
      if (sheet.data.length === 0) {
        csvContent += '"Aucune donnée disponible"\n';
        return;
      }

      // En-têtes
      const headers = sheet.headers || Object.keys(sheet.data[0]);
      csvContent += headers.map(header => `"${this.formatHeader(header)}"`).join(',') + '\n';
      
      // Données
      sheet.data.forEach(row => {
        const values = headers.map(header => {
          const value = row[header];
          return `"${this.formatValue(value)}"`;
        });
        csvContent += values.join(',') + '\n';
      });
    });

    return csvContent;
  }

  private formatHeader(header: string): string {
    return header.charAt(0).toUpperCase() + header.slice(1).replace(/([A-Z])/g, ' $1');
  }

  private formatValue(value: any): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'string' && value.includes('T')) {
      // Probablement une date ISO
      try {
        return new Date(value).toLocaleDateString('fr-FR');
      } catch {
        return value;
      }
    }
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value).replace(/"/g, '""'); // Échapper les guillemets
  }

  private downloadAsCSV(content: string, filename: string): void {
    // Ajouter BOM pour Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Méthodes spécialisées pour différents types de données

  generateEmployeeList(employees: any[]): void {
    const data: ExcelData = {
      title: 'Liste_Employes',
      sheets: [{
        name: 'Employés',
        data: employees.map(emp => ({
          nom: emp.name || emp.employeeName,
          email: emp.email,
          poste: emp.position,
          departement: emp.department,
          salaire: emp.salary,
          dateEmbauche: emp.hireDate,
          statut: emp.status
        }))
      }]
    };
    this.generateExcel(data);
  }

  generateVacationList(vacations: any[]): void {
    const data: ExcelData = {
      title: 'Liste_Conges',
      sheets: [{
        name: 'Demandes de Congés',
        data: vacations.map(vacation => ({
          employe: vacation.employeeName,
          type: vacation.type,
          dateDebut: vacation.startDate,
          dateFin: vacation.endDate,
          duree: vacation.duration,
          statut: vacation.status,
          motif: vacation.reason
        }))
      }]
    };
    this.generateExcel(data);
  }

  generateTrainingList(trainings: any[]): void {
    const data: ExcelData = {
      title: 'Liste_Formations',
      sheets: [{
        name: 'Formations',
        data: trainings.map(training => ({
          titre: training.title,
          description: training.description,
          formateur: training.instructor,
          dateDebut: training.startDate,
          dateFin: training.endDate,
          duree: training.duration,
          participants: training.participants?.length || 0,
          statut: training.status
        }))
      }]
    };
    this.generateExcel(data);
  }

  generateSurveyResponses(survey: any, responses: any[]): void {
    const data: ExcelData = {
      title: `Reponses_Sondage_${survey.title}`,
      sheets: [{
        name: 'Réponses',
        data: responses.map(response => {
          const row: any = {
            employe: response.employeeName,
            dateReponse: response.submittedAt
          };
          
          // Ajouter chaque réponse comme colonne
          response.responses.forEach((resp: any, index: number) => {
            const question = survey.questions.find((q: any) => q.id === resp.questionId);
            const questionText = question ? question.question : `Question ${index + 1}`;
            row[`Q${index + 1}_${questionText.substring(0, 30)}`] = resp.answer;
          });
          
          return row;
        })
      }]
    };
    this.generateExcel(data);
  }

  generateContractList(contracts: any[]): void {
    const data: ExcelData = {
      title: 'Liste_Contrats',
      sheets: [{
        name: 'Contrats',
        data: contracts.map(contract => ({
          employe: contract.employeeName,
          poste: contract.position,
          typeContrat: contract.contractType,
          dateDebut: contract.startDate,
          dateFin: contract.endDate,
          salaire: contract.salary,
          statut: contract.status
        }))
      }]
    };
    this.generateExcel(data);
  }

  generateEvaluationList(evaluations: any[]): void {
    const data: ExcelData = {
      title: 'Liste_Evaluations',
      sheets: [{
        name: 'Évaluations',
        data: evaluations.map(evaluation => ({
          employe: evaluation.name,
          poste: evaluation.position,
          manager: evaluation.manager,
          derniereEvaluation: evaluation.lastEvaluation,
          prochaineEvaluation: evaluation.nextEvaluationDue,
          performance: evaluation.performance,
          objectifs: evaluation.objectives?.length || 0,
          statut: evaluation.status
        }))
      }]
    };
    this.generateExcel(data);
  }
}

export const excelGenerator = new ExcelGenerator();
export type { ExcelData, ExcelSheet };
