import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardDocumentListIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  UserGroupIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { surveyService, Survey } from '../../services/surveyService';
import { useNotification } from '../../hooks/useNotification';
import NotificationModal from '../common/NotificationModal';
import SurveyModal from './SurveyModal';
import { downloadManager } from '../../utils/downloadManager';

const SurveysPage: React.FC = () => {
  const { notification, showSuccess, showInfo, hideNotification } = useNotification();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = () => {
    try {
      const surveysData = surveyService.getSurveys();
      setSurveys(surveysData);
    } catch (error) {
      console.error('Erreur lors du chargement des sondages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSurvey = (surveyData: Omit<Survey, 'id' | 'createdAt' | 'createdBy'>) => {
    try {
      const newSurvey = surveyService.createSurvey(surveyData, 'hr-manager');
      setSurveys([...surveys, newSurvey]);
      showSuccess(
        'Sondage créé !',
        `Le sondage "${newSurvey.title}" a été créé avec succès.`
      );
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      showInfo('Erreur', 'Impossible de créer le sondage.');
    }
  };

  const handleToggleStatus = (surveyId: string) => {
    const survey = surveys.find(s => s.id === surveyId);
    if (survey) {
      const updatedSurvey = surveyService.updateSurvey(surveyId, { 
        isActive: !survey.isActive 
      });
      if (updatedSurvey) {
        setSurveys(surveys.map(s => s.id === surveyId ? updatedSurvey : s));
        showSuccess(
          'Statut modifié',
          `Le sondage est maintenant ${updatedSurvey.isActive ? 'actif' : 'inactif'}.`
        );
      }
    }
  };

  const handleDeleteSurvey = (surveyId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce sondage ?')) {
      const success = surveyService.deleteSurvey(surveyId);
      if (success) {
        setSurveys(surveys.filter(s => s.id !== surveyId));
        showSuccess('Sondage supprimé', 'Le sondage a été supprimé avec succès.');
      }
    }
  };

  const handleViewStats = (survey: Survey) => {
    setSelectedSurvey(survey);
    setShowStatsModal(true);
  };

  const handleDownloadStats = (survey: Survey) => {
    try {
      console.log('Début téléchargement stats pour:', survey.title);
      const stats = surveyService.getSurveyStats(survey.id);
      console.log('Stats récupérées:', stats);
      
      downloadManager.downloadSurveyStats(survey, stats);
      console.log('Téléchargement lancé');
      
      showSuccess(
        'Export réussi',
        `Le planning a été exporté au format PDF.`
      );
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      showInfo(
        'Erreur de téléchargement',
        'Une erreur est survenue lors de l\'export. Veuillez réessayer.'
      );
    }
  };

  const handleDownloadResponses = (survey: Survey) => {
    try {
      console.log('Début téléchargement réponses pour:', survey.title);
      const responses = surveyService.getSurveyResponses(survey.id);
      console.log('Réponses récupérées:', responses);
      
      downloadManager.downloadSurveyResponses(survey, responses);
      console.log('Téléchargement Excel lancé');
      
      showSuccess(
        'Export réussi',
        `Les réponses ont été exportées au format Excel.`
      );
    } catch (error) {
      console.error('Erreur lors du téléchargement Excel:', error);
      showInfo(
        'Erreur de téléchargement',
        'Une erreur est survenue lors de l\'export Excel. Veuillez réessayer.'
      );
    }
  };

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && survey.isActive) ||
                         (filterStatus === 'inactive' && !survey.isActive);
    return matchesSearch && matchesStatus;
  });

  const renderStatsModal = () => {
    if (!selectedSurvey || !showStatsModal) return null;

    const stats = surveyService.getSurveyStats(selectedSurvey.id);

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div 
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={() => setShowStatsModal(false)}
          />
          
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Statistiques - {selectedSurvey.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownloadStats(selectedSurvey)}
                    className="flex items-center px-3 py-1 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                    title="Télécharger les statistiques (PDF)"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                    PDF
                  </button>
                  <button
                    onClick={() => handleDownloadResponses(selectedSurvey)}
                    className="flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    title="Télécharger les réponses (Excel)"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                    Excel
                  </button>
                  <button
                    onClick={() => setShowStatsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-teal-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-8 w-8 text-teal-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-teal-600">Réponses</p>
                      <p className="text-2xl font-bold text-teal-900">{stats.totalResponses}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <ChartBarIcon className="h-8 w-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-600">Taux de réponse</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.responseRate.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-600">Questions</p>
                      <p className="text-2xl font-bold text-green-900">{selectedSurvey.questions.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {selectedSurvey.questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      {index + 1}. {question.question}
                    </h4>
                    
                    {question.type === 'rating' && stats.questionStats[question.id] && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          Note moyenne: {stats.questionStats[question.id].average.toFixed(1)}/5
                        </p>
                        <div className="flex items-center space-x-2">
                          {[1, 2, 3, 4, 5].map(rating => (
                            <div key={rating} className="text-center">
                              <div className="text-xs text-gray-500">{rating}</div>
                              <div className="w-8 bg-gray-200 rounded">
                                <div 
                                  className="bg-teal-600 rounded h-2"
                                  style={{ 
                                    height: `${Math.max(8, (stats.questionStats[question.id].distribution[rating-1] / stats.totalResponses) * 40)}px`
                                  }}
                                />
                              </div>
                              <div className="text-xs text-gray-600">
                                {stats.questionStats[question.id].distribution[rating-1]}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {question.type === 'multiple_choice' && stats.questionStats[question.id] && (
                      <div className="space-y-2">
                        {Object.entries(stats.questionStats[question.id] as Record<string, number>).map(([option, count]) => (
                          <div key={option} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{option}</span>
                            <div className="flex items-center">
                              <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-teal-600 h-2 rounded-full"
                                  style={{ width: `${(count / stats.totalResponses) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === 'yes_no' && stats.questionStats[question.id] && (
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
                          <span className="text-sm">Oui: {stats.questionStats[question.id].yes}</span>
                        </div>
                        <div className="flex items-center">
                          <XCircleIcon className="h-5 w-5 text-red-500 mr-1" />
                          <span className="text-sm">Non: {stats.questionStats[question.id].no}</span>
                        </div>
                      </div>
                    )}

                    {question.type === 'text' && stats.questionStats[question.id] && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          {stats.questionStats[question.id].totalResponses} réponse(s) libre(s)
                        </p>
                        {stats.questionStats[question.id].responses.slice(0, 3).map((response: string, i: number) => (
                          <div key={i} className="text-sm text-gray-700 italic border-l-2 border-gray-300 pl-2 mb-1">
                            "{response}"
                          </div>
                        ))}
                        {stats.questionStats[question.id].responses.length > 3 && (
                          <p className="text-xs text-gray-500">
                            ... et {stats.questionStats[question.id].responses.length - 3} autre(s) réponse(s)
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ClipboardDocumentListIcon className="h-8 w-8 text-teal-600 mr-3" />
            Gestion des Sondages
          </h1>
          <p className="text-gray-600 mt-1">
            Créez et gérez les sondages pour recueillir les avis des employés
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              // Test direct de téléchargement
              console.log('Test téléchargement direct');
              const testContent = `<!DOCTYPE html><html><head><title>Test</title></head><body><h1>Test de téléchargement</h1><p>Si vous voyez ce fichier, le téléchargement fonctionne !</p></body></html>`;
              const blob = new Blob([testContent], { type: 'text/html' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'test_download.html';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              showSuccess('Test', 'Téléchargement de test lancé');
            }}
            className="btn-secondary flex items-center"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Test DL
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouveau sondage
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par titre ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="input-field"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des sondages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSurveys.map((survey) => (
          <motion.div
            key={survey.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {survey.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {survey.description}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  survey.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {survey.isActive ? 'Actif' : 'Inactif'}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
                  {survey.questions.length} question{survey.questions.length > 1 ? 's' : ''}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Créé le {new Date(survey.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewStats(survey)}
                    className="text-teal-600 hover:text-teal-700 p-1"
                    title="Voir les statistiques"
                  >
                    <ChartBarIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDownloadStats(survey)}
                    className="text-blue-600 hover:text-blue-700 p-1"
                    title="Télécharger statistiques (PDF)"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(survey.id)}
                    className={`p-1 ${
                      survey.isActive 
                        ? 'text-red-600 hover:text-red-700' 
                        : 'text-green-600 hover:text-green-700'
                    }`}
                    title={survey.isActive ? 'Désactiver' : 'Activer'}
                  >
                    {survey.isActive ? <XCircleIcon className="h-4 w-4" /> : <CheckCircleIcon className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteSurvey(survey.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Supprimer"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="text-xs text-gray-500">
                  {surveyService.getSurveyStats(survey.id).totalResponses} réponse(s)
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredSurveys.length === 0 && (
        <div className="text-center py-12">
          <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun sondage trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all' 
              ? 'Aucun sondage ne correspond à vos critères.'
              : 'Commencez par créer votre premier sondage.'
            }
          </p>
        </div>
      )}

      {/* Modals */}
      <SurveyModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateSurvey={handleCreateSurvey}
      />

      {renderStatsModal()}

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={hideNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        confirmText={notification.confirmText}
      />
    </div>
  );
};

export default SurveysPage;
