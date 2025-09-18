// Utilitaire pour générer des PDFs avec jsPDF
// Note: En production, vous devriez installer jsPDF: npm install jspdf

interface PDFData {
  title: string;
  subtitle?: string;
  data: any;
  type: 'report' | 'list' | 'survey' | 'contract' | 'evaluation';
}

class PDFGenerator {
  private tealColor = '#008080';
  private logoBase64 = 'data:image/svg+xml;base64,' + btoa(`
    <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="40" rx="8" fill="#008080"/>
      <text x="60" y="25" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Teal</text>
    </svg>
  `);

  generatePDF(data: PDFData): void {
    console.log('PDFGenerator.generatePDF appelé avec:', data);
    try {
      // Simulation de génération PDF - En production, utilisez jsPDF
      const content = this.generateHTMLContent(data);
      console.log('Contenu HTML généré, longueur:', content.length);
      this.downloadAsHTML(content, data.title);
      console.log('downloadAsHTML appelé');
    } catch (error) {
      console.error('Erreur dans generatePDF:', error);
      throw error;
    }
  }

  private generateHTMLContent(data: PDFData): string {
    const currentDate = new Date().toLocaleDateString('fr-FR');
    
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid ${this.tealColor};
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .logo {
            background: ${this.tealColor};
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 18px;
        }
        
        .company-info {
            text-align: right;
            color: #666;
        }
        
        .title {
            color: ${this.tealColor};
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .subtitle {
            color: #666;
            font-size: 16px;
            margin-bottom: 20px;
        }
        
        .content {
            margin-top: 30px;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section-title {
            color: ${this.tealColor};
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            border-left: 4px solid ${this.tealColor};
            padding-left: 15px;
        }
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        .data-table th,
        .data-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        
        .data-table th {
            background-color: ${this.tealColor};
            color: white;
            font-weight: bold;
        }
        
        .data-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        
        .stat-card {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
        }
        
        .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: ${this.tealColor};
        }
        
        .stat-label {
            color: #666;
            font-size: 14px;
        }
        
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 15px;
            }
            
            .header {
                page-break-inside: avoid;
            }
            
            .section {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">Teal Technology Services</div>
        <div class="company-info">
            <div><strong>Teal Technology Services</strong></div>
            <div>Ressources Humaines</div>
            <div>Date: ${currentDate}</div>
        </div>
    </div>
    
    <div class="title">${data.title}</div>
    ${data.subtitle ? `<div class="subtitle">${data.subtitle}</div>` : ''}
    
    <div class="content">
        ${this.generateContentByType(data)}
    </div>
    
    <div class="footer">
        <p>Document généré automatiquement par Teal Technology Services</p>
        <p>© ${new Date().getFullYear()} Teal Technology Services - Tous droits réservés</p>
    </div>
</body>
</html>`;
  }

  private generateContentByType(data: PDFData): string {
    switch (data.type) {
      case 'report':
        return this.generateReportContent(data.data);
      case 'list':
        return this.generateListContent(data.data);
      case 'survey':
        return this.generateSurveyContent(data.data);
      case 'contract':
        return this.generateContractContent(data.data);
      case 'evaluation':
        return this.generateEvaluationContent(data.data);
      default:
        return this.generateGenericContent(data.data);
    }
  }

  private generateReportContent(data: any): string {
    return `
      <div class="section">
        <div class="section-title">Statistiques Générales</div>
        <div class="grid">
          <div class="stat-card">
            <div class="stat-value">${data.totalEmployees || 156}</div>
            <div class="stat-label">Total Employés</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${data.pendingVacations || 12}</div>
            <div class="stat-label">Congés en Attente</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${data.upcomingTrainings || 8}</div>
            <div class="stat-label">Formations Prévues</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">87.5%</div>
            <div class="stat-label">Performance Moyenne</div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Indicateurs Clés</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Indicateur</th>
              <th>Valeur</th>
              <th>Objectif</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Taux d'absentéisme</td>
              <td>3.1%</td>
              <td>&lt; 5%</td>
              <td>✅ Excellent</td>
            </tr>
            <tr>
              <td>Turnover</td>
              <td>8.2%</td>
              <td>&lt; 10%</td>
              <td>✅ Bon</td>
            </tr>
            <tr>
              <td>Satisfaction</td>
              <td>4.2/5</td>
              <td>&gt; 4.0</td>
              <td>✅ Excellent</td>
            </tr>
            <tr>
              <td>Budget Formation</td>
              <td>68.5%</td>
              <td>70%</td>
              <td>⚠️ À surveiller</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  private generateListContent(data: any[]): string {
    if (!Array.isArray(data) || data.length === 0) {
      return '<div class="section">Aucune donnée disponible</div>';
    }

    const headers = Object.keys(data[0]);
    
    return `
      <div class="section">
        <div class="section-title">Liste des Éléments (${data.length} éléments)</div>
        <table class="data-table">
          <thead>
            <tr>
              ${headers.map(header => `<th>${this.formatHeader(header)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(item => `
              <tr>
                ${headers.map(header => `<td>${this.formatValue(item[header])}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  private generateSurveyContent(data: any): string {
    return `
      <div class="section">
        <div class="section-title">Résultats du Sondage - ${data.surveyTitle || 'Sondage'}</div>
        <div class="grid">
          <div class="stat-card">
            <div class="stat-value">${data.totalResponses || 0}</div>
            <div class="stat-label">Réponses Totales</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${(data.responseRate || 0).toFixed(1)}%</div>
            <div class="stat-label">Taux de Réponse</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${data.questions || 0}</div>
            <div class="stat-label">Questions</div>
          </div>
        </div>
        
        <div style="margin-top: 30px;">
          <h4 style="color: ${this.tealColor}; margin-bottom: 20px;">Analyse Détaillée des Réponses</h4>
          ${data.questionStats ? Object.entries(data.questionStats).map(([questionId, stats]: [string, any], index: number) => {
            if (typeof stats === 'object' && stats !== null) {
              if (stats.average !== undefined) {
                // Question de type rating
                return `
                  <div style="margin-bottom: 25px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb;">
                    <strong style="color: #374151;">Question ${index + 1} - Évaluation</strong>
                    <div style="margin-top: 10px;">
                      <p><strong>Note moyenne:</strong> ${stats.average.toFixed(1)}/5</p>
                      <p><strong>Distribution:</strong></p>
                      <div style="margin-left: 20px;">
                        ${stats.distribution.map((count: number, i: number) => 
                          `<p>⭐ ${i + 1} étoile${i > 0 ? 's' : ''}: ${count} réponse${count > 1 ? 's' : ''}</p>`
                        ).join('')}
                      </div>
                    </div>
                  </div>
                `;
              } else if (stats.yes !== undefined) {
                // Question de type yes/no
                return `
                  <div style="margin-bottom: 25px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb;">
                    <strong style="color: #374151;">Question ${index + 1} - Oui/Non</strong>
                    <div style="margin-top: 10px;">
                      <p>✅ <strong>Oui:</strong> ${stats.yes} réponse${stats.yes > 1 ? 's' : ''}</p>
                      <p>❌ <strong>Non:</strong> ${stats.no} réponse${stats.no > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                `;
              } else if (stats.responses !== undefined) {
                // Question de type text
                return `
                  <div style="margin-bottom: 25px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb;">
                    <strong style="color: #374151;">Question ${index + 1} - Réponses libres</strong>
                    <div style="margin-top: 10px;">
                      <p><strong>Nombre de réponses:</strong> ${stats.totalResponses}</p>
                      ${stats.responses.slice(0, 5).map((response: string) => 
                        `<p style="font-style: italic; margin-left: 20px; border-left: 3px solid ${this.tealColor}; padding-left: 10px;">"${response}"</p>`
                      ).join('')}
                      ${stats.responses.length > 5 ? `<p style="color: #6b7280; margin-left: 20px;">... et ${stats.responses.length - 5} autre(s) réponse(s)</p>` : ''}
                    </div>
                  </div>
                `;
              } else {
                // Question de type multiple choice
                return `
                  <div style="margin-bottom: 25px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb;">
                    <strong style="color: #374151;">Question ${index + 1} - Choix multiple</strong>
                    <div style="margin-top: 10px;">
                      ${Object.entries(stats).map(([option, count]) => 
                        `<p>📊 <strong>${option}:</strong> ${count} réponse${(count as number) > 1 ? 's' : ''}</p>`
                      ).join('')}
                    </div>
                  </div>
                `;
              }
            }
            return '';
          }).join('') : '<p>Aucune statistique disponible</p>'}
        </div>
      </div>
    `;
  }

  private generateContractContent(data: any[]): string {
    return `
      <div class="section">
        <div class="section-title">Contrats à Renouveler</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Employé</th>
              <th>Poste</th>
              <th>Type Contrat</th>
              <th>Date Fin</th>
              <th>Salaire</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(contract => `
              <tr>
                <td>${contract.employeeName}</td>
                <td>${contract.position}</td>
                <td>${contract.contractType}</td>
                <td>${new Date(contract.endDate).toLocaleDateString('fr-FR')}</td>
                <td>${contract.salary.toLocaleString('fr-FR')} DH</td>
                <td>${this.getStatusLabel(contract.status)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  private generateEvaluationContent(data: any[]): string {
    return `
      <div class="section">
        <div class="section-title">Évaluations Programmées</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Employé</th>
              <th>Poste</th>
              <th>Manager</th>
              <th>Dernière Évaluation</th>
              <th>Prochaine Évaluation</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(evaluation => `
              <tr>
                <td>${evaluation.name}</td>
                <td>${evaluation.position}</td>
                <td>${evaluation.manager}</td>
                <td>${new Date(evaluation.lastEvaluation).toLocaleDateString('fr-FR')}</td>
                <td>${new Date(evaluation.nextEvaluationDue).toLocaleDateString('fr-FR')}</td>
                <td>${evaluation.performance.toFixed(1)}/5</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  private generateGenericContent(data: any): string {
    return `
      <div class="section">
        <div class="section-title">Données</div>
        <pre style="background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto;">
${JSON.stringify(data, null, 2)}
        </pre>
      </div>
    `;
  }

  private formatHeader(header: string): string {
    return header.charAt(0).toUpperCase() + header.slice(1).replace(/([A-Z])/g, ' $1');
  }

  private formatValue(value: any): string {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
    if (typeof value === 'number') return value.toLocaleString('fr-FR');
    if (typeof value === 'string' && value.includes('T')) {
      // Probablement une date ISO
      try {
        return new Date(value).toLocaleDateString('fr-FR');
      } catch {
        return value;
      }
    }
    return String(value);
  }

  private getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': '⏳ En attente',
      'approved': '✅ Approuvé',
      'rejected': '❌ Rejeté',
      'expiring': '⚠️ Expire bientôt',
      'renewed': '✅ Renouvelé',
      'terminated': '❌ Terminé',
      'overdue': '🔴 En retard',
      'due_soon': '🟡 Bientôt dû',
      'scheduled': '📅 Programmé',
      'completed': '✅ Terminé'
    };
    return statusMap[status] || status;
  }

  private downloadAsHTML(content: string, filename: string): void {
    console.log('downloadAsHTML appelé avec filename:', filename);
    try {
      const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
      console.log('Blob créé, taille:', blob.size);
      
      const url = URL.createObjectURL(blob);
      console.log('URL créée:', url);
      
      const a = document.createElement('a');
      a.href = url;
      const finalFilename = `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.html`;
      a.download = finalFilename;
      console.log('Nom de fichier final:', finalFilename);
      
      document.body.appendChild(a);
      console.log('Élément <a> ajouté au DOM');
      
      a.click();
      console.log('Click déclenché');
      
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log('Nettoyage terminé');
    } catch (error) {
      console.error('Erreur dans downloadAsHTML:', error);
      throw error;
    }
  }
}

export const pdfGenerator = new PDFGenerator();
export type { PDFData };
