import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  ArrowDownTrayIcon,
  CalendarIcon,
  UsersIcon,
  DocumentChartBarIcon,
  PresentationChartLineIcon,
  ClockIcon,
  CurrencyEuroIcon
} from '@heroicons/react/24/outline';

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: ChartBarIcon },
    { id: 'employees', name: 'Rapport employés', icon: UsersIcon },
    { id: 'vacations', name: 'Rapport congés', icon: CalendarIcon },
    { id: 'trainings', name: 'Rapport formations', icon: DocumentChartBarIcon },
    { id: 'payroll', name: 'Rapport paie', icon: CurrencyEuroIcon }
  ];

  const mockData = {
    overview: {
      totalEmployees: 156,
      newHires: 8,
      departures: 3,
      vacationDays: 245,
      trainingHours: 320,
      averageSalary: 52000
    },
    trends: [
      { month: 'Jan', employees: 148, vacations: 45, trainings: 12 },
      { month: 'Fév', employees: 152, vacations: 38, trainings: 18 },
      { month: 'Mar', employees: 156, vacations: 52, trainings: 15 }
    ]
  };

  const generateReport = (reportType?: string, format: string = 'pdf') => {
    setLoading(true);
    
    // Données selon le type de rapport
    const reportData = getReportData(reportType || selectedReport);
    
    setTimeout(() => {
      if (format === 'pdf') {
        generatePDFReport(reportData, reportType || selectedReport);
      } else if (format === 'excel') {
        generateExcelReport(reportData, reportType || selectedReport);
      } else if (format === 'csv') {
        generateCSVReport(reportData, reportType || selectedReport);
      }
      setLoading(false);
    }, 1500);
  };

  const getReportData = (reportType: string) => {
    const baseData = {
      period: selectedPeriod,
      generatedAt: new Date().toLocaleString('fr-FR'),
      company: 'Teal Technology Services'
    };

    switch (reportType) {
      case 'overview':
        return {
          ...baseData,
          title: 'Vue d\'ensemble RH',
          data: mockData.overview,
          trends: mockData.trends
        };
      case 'employees':
        return {
          ...baseData,
          title: 'Rapport Employés',
          data: {
            totalEmployees: 156,
            newHires: 8,
            departures: 3,
            departments: [
              { name: 'Développement', count: 45 },
              { name: 'Marketing', count: 28 },
              { name: 'Ventes', count: 32 },
              { name: 'RH', count: 15 },
              { name: 'Finance', count: 20 },
              { name: 'Support', count: 16 }
            ]
          }
        };
      case 'vacations':
        return {
          ...baseData,
          title: 'Rapport Congés',
          data: {
            totalVacationDays: 245,
            pendingRequests: 12,
            approvedRequests: 89,
            rejectedRequests: 3,
            averageVacationDays: 18.5
          }
        };
      case 'trainings':
        return {
          ...baseData,
          title: 'Rapport Formations',
          data: {
            totalTrainingHours: 320,
            completedTrainings: 45,
            ongoingTrainings: 23,
            plannedTrainings: 18,
            trainingBudget: 125000
          }
        };
      case 'payroll':
        return {
          ...baseData,
          title: 'Rapport Paie',
          data: {
            totalPayroll: 8112000,
            averageSalary: 52000,
            salaryIncrease: 3.2,
            bonuses: 456000,
            benefits: 789000
          }
        };
      default:
        return { ...baseData, title: 'Rapport Général', data: mockData.overview };
    }
  };

  const generatePDFReport = (data: any, reportType: string) => {
    // Simulation de génération PDF
    const content = `
=== ${data.title} ===
Entreprise: ${data.company}
Période: ${data.period}
Généré le: ${data.generatedAt}

${JSON.stringify(data.data, null, 2)}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateExcelReport = (data: any, reportType: string) => {
    const csvContent = convertToCSV(data);
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateCSVReport = (data: any, reportType: string) => {
    generateExcelReport(data, reportType); // Même logique pour CSV
  };

  const convertToCSV = (data: any) => {
    let csv = `${data.title}\n`;
    csv += `Entreprise,${data.company}\n`;
    csv += `Période,${data.period}\n`;
    csv += `Généré le,${data.generatedAt}\n\n`;
    
    if (data.data) {
      csv += 'Métrique,Valeur\n';
      Object.entries(data.data).forEach(([key, value]) => {
        csv += `${key},${value}\n`;
      });
    }
    
    return csv;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ChartBarIcon className="h-8 w-8 text-teal-primary mr-3" />
            Rapports RH
          </h1>
          <p className="text-gray-600 mt-1">
            Analyses et statistiques des ressources humaines
          </p>
        </div>
        <button 
          onClick={(e) => {
            e.preventDefault();
            generateReport(selectedReport, 'pdf');
          }}
          disabled={loading}
          className="btn-primary flex items-center"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
          )}
          Exporter PDF
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de rapport
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="input-field"
            >
              {reportTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input-field"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            <select 
              className="input-field"
              onChange={(e) => {
                const format = e.target.value;
                // Le format sera utilisé lors de la génération
              }}
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Employés</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.overview.totalEmployees}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Embauches</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.overview.newHires}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Départs</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.overview.departures}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">J. Congés</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.overview.vacationDays}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">H. Formation</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.overview.trainingHours}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 rounded-lg">
              <CurrencyEuroIcon className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Salaire Moy.</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.overview.averageSalary.toLocaleString('fr-FR')}DH</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des effectifs</h3>
          <div className="h-64 flex items-end justify-around bg-gray-50 rounded p-4">
            {mockData.trends.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="bg-teal-primary rounded-t w-12"
                  style={{ height: `${(item.employees / 160) * 200}px` }}
                ></div>
                <span className="text-sm text-gray-600 mt-2">{item.month}</span>
                <span className="text-xs text-gray-500">{item.employees}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par département</h3>
          <div className="space-y-4">
            {[
              { name: 'Développement', count: 45, color: 'bg-blue-500' },
              { name: 'Marketing', count: 28, color: 'bg-green-500' },
              { name: 'Ventes', count: 32, color: 'bg-yellow-500' },
              { name: 'RH', count: 15, color: 'bg-purple-500' },
              { name: 'Finance', count: 20, color: 'bg-red-500' },
              { name: 'Support', count: 16, color: 'bg-teal-500' }
            ].map((dept, index) => (
              <div key={index} className="flex items-center">
                <div className="w-24 text-sm text-gray-600">{dept.name}</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-4">
                    <div 
                      className={`${dept.color} h-4 rounded-full`}
                      style={{ width: `${(dept.count / 45) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-8 text-sm text-gray-900 font-medium">{dept.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rapports prédéfinis */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Rapports prédéfinis</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center mb-3">
                    <Icon className="h-8 w-8 text-teal-primary" />
                    <h4 className="ml-3 text-sm font-medium text-gray-900">{report.name}</h4>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Rapport détaillé avec analyses et métriques clés
                  </p>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      generateReport(report.id, 'pdf');
                    }}
                    disabled={loading}
                    className="w-full btn-secondary text-sm py-2"
                  >
                    {loading ? 'Génération...' : 'Générer'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
