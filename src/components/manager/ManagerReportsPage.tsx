import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  ArrowDownTrayIcon,
  UsersIcon,
  TrophyIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const ManagerReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('team_performance');
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { id: 'team_performance', name: 'Performance équipe', icon: TrophyIcon },
    { id: 'team_attendance', name: 'Présence équipe', icon: UsersIcon },
    { id: 'objectives_progress', name: 'Avancement objectifs', icon: ChartBarIcon },
    { id: 'team_vacations', name: 'Congés équipe', icon: CalendarIcon }
  ];

  const mockData = {
    teamPerformance: {
      averageRating: 4.2,
      completedObjectives: 15,
      pendingObjectives: 8,
      teamSize: 6,
      productivityScore: 87
    },
    attendance: {
      presentDays: 142,
      vacationDays: 18,
      sickDays: 3,
      attendanceRate: 94.2
    }
  };

  const generateReport = (reportType?: string, format: string = 'pdf') => {
    setLoading(true);
    
    const reportData = getReportData(reportType || selectedReport);
    
    setTimeout(() => {
      if (format === 'pdf') {
        generatePDFReport(reportData, reportType || selectedReport);
      } else if (format === 'excel') {
        generateExcelReport(reportData, reportType || selectedReport);
      }
      setLoading(false);
    }, 1500);
  };

  const getReportData = (reportType: string) => {
    const baseData = {
      period: selectedPeriod,
      generatedAt: new Date().toLocaleString('fr-FR'),
      manager: 'Manager Actuel',
      team: 'Équipe Développement'
    };

    switch (reportType) {
      case 'team_performance':
        return {
          ...baseData,
          title: 'Rapport Performance Équipe',
          data: {
            averageRating: 4.2,
            completedObjectives: 15,
            pendingObjectives: 8,
            teamMembers: [
              { name: 'Meryem Hamidi', performance: 4.5, objectives: 5 },
              { name: 'Kenza Hamidi', performance: 4.0, objectives: 4 },
              { name: 'Lina Hamidi', performance: 4.1, objectives: 3 }
            ]
          }
        };
      case 'team_attendance':
        return {
          ...baseData,
          title: 'Rapport Présence Équipe',
          data: {
            attendanceRate: 94.2,
            presentDays: 142,
            vacationDays: 18,
            sickDays: 3,
            lateArrivals: 2
          }
        };
      case 'objectives_progress':
        return {
          ...baseData,
          title: 'Avancement des Objectifs',
          data: {
            totalObjectives: 23,
            completedObjectives: 15,
            inProgressObjectives: 6,
            overdueObjectives: 2,
            completionRate: 65.2
          }
        };
      case 'team_vacations':
        return {
          ...baseData,
          title: 'Rapport Congés Équipe',
          data: {
            totalVacationDays: 18,
            pendingRequests: 3,
            approvedRequests: 12,
            upcomingVacations: 5
          }
        };
      default:
        return { ...baseData, title: 'Rapport Équipe', data: mockData.teamPerformance };
    }
  };

  const generatePDFReport = (data: any, reportType: string) => {
    const content = `
=== ${data.title} ===
Manager: ${data.manager}
Équipe: ${data.team}
Période: ${data.period}
Généré le: ${data.generatedAt}

${JSON.stringify(data.data, null, 2)}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manager_${reportType}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateExcelReport = (data: any, reportType: string) => {
    const csvContent = convertToCSV(data);
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manager_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: any) => {
    let csv = `${data.title}\n`;
    csv += `Manager,${data.manager}\n`;
    csv += `Équipe,${data.team}\n`;
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
            Rapports Manager
          </h1>
          <p className="text-gray-600 mt-1">
            Analyses et statistiques de votre équipe
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
            <select className="input-field">
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrophyIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Performance Moy.</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.teamPerformance.averageRating}/5</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Objectifs Complétés</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.teamPerformance.completedObjectives}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taille Équipe</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.teamPerformance.teamSize}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taux Présence</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.attendance.attendanceRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rapports prédéfinis */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Rapports prédéfinis</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center mb-3">
                    <Icon className="h-8 w-8 text-teal-primary" />
                    <h4 className="ml-3 text-sm font-medium text-gray-900">{report.name}</h4>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Rapport détaillé avec analyses et métriques de votre équipe
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

export default ManagerReportsPage;
