import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  StarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { surveyService, Survey, Question } from '../../services/surveyService';
import { useNotification } from '../../hooks/useNotification';
import NotificationModal from '../common/NotificationModal';
import { useAuth } from '../../hooks/useAuth';

const SurveyResponsePage: React.FC = () => {
  const { user } = useAuth();
  const { notification, showSuccess, showInfo, hideNotification } = useNotification();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<{ [questionId: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadActiveSurveys();
  }, []);

  const loadActiveSurveys = () => {
    try {
      const activeSurveys = surveyService.getActiveSurveys();
      setSurveys(activeSurveys);
    } catch (error) {
      console.error('Erreur lors du chargement des sondages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmitSurvey = async () => {
    if (!selectedSurvey || !user) return;

    // Vérifier que toutes les questions obligatoires ont une réponse
    const requiredQuestions = selectedSurvey.questions.filter(q => q.required);
    const missingResponses = requiredQuestions.filter(q => !responses[q.id] || responses[q.id] === '');

    if (missingResponses.length > 0) {
      showInfo(
        'Réponses manquantes',
        'Veuillez répondre à toutes les questions obligatoires avant de soumettre.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const responseData = Object.entries(responses).map(([questionId, answer]) => ({
        questionId,
        answer
      }));

      surveyService.submitSurveyResponse(
        selectedSurvey.id,
        user.email || 'employee',
        user.email || 'Employé',
        responseData
      );

      showSuccess(
        'Réponse enregistrée !',
        'Merci d\'avoir participé à ce sondage. Vos réponses ont été enregistrées avec succès.'
      );

      // Retour à la liste des sondages
      setSelectedSurvey(null);
      setResponses({});
      loadActiveSurveys();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      showInfo('Erreur', 'Une erreur est survenue lors de l\'enregistrement de vos réponses.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestionInput = (question: Question) => {
    const value = responses[question.id] || '';

    switch (question.type) {
      case 'text':
        return (
          <textarea
            value={value}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            className="input-field"
            rows={3}
            placeholder="Tapez votre réponse ici..."
          />
        );

      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'rating':
        return (
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleResponseChange(question.id, rating)}
                className="p-1 hover:scale-110 transition-transform"
              >
                {rating <= (value || 0) ? (
                  <StarIconSolid className="h-8 w-8 text-yellow-400" />
                ) : (
                  <StarIcon className="h-8 w-8 text-gray-300 hover:text-yellow-400" />
                )}
              </button>
            ))}
            <span className="ml-3 text-sm text-gray-600">
              {value ? `${value}/5` : 'Non évalué'}
            </span>
          </div>
        );

      case 'yes_no':
        return (
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name={question.id}
                value="yes"
                checked={value === 'yes'}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Oui</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name={question.id}
                value="no"
                checked={value === 'no'}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Non</span>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (selectedSurvey) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* En-tête du sondage */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedSurvey.title}
              </h1>
              <p className="text-gray-600">
                {selectedSurvey.description}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedSurvey(null);
                setResponses({});
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              ← Retour
            </button>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <ClipboardDocumentListIcon className="h-4 w-4 mr-1" />
            {selectedSurvey.questions.length} question{selectedSurvey.questions.length > 1 ? 's' : ''}
            {selectedSurvey.questions.some(q => q.required) && (
              <span className="ml-4 text-red-500">* Questions obligatoires</span>
            )}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {selectedSurvey.questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {index + 1}. {question.question}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </h3>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  {question.type === 'text' && <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />}
                  {question.type === 'rating' && <StarIcon className="h-4 w-4 mr-1" />}
                  {question.type === 'multiple_choice' && <CheckCircleIcon className="h-4 w-4 mr-1" />}
                  {question.type === 'yes_no' && <CheckCircleIcon className="h-4 w-4 mr-1" />}
                  
                  {question.type === 'text' && 'Réponse libre'}
                  {question.type === 'rating' && 'Évaluation de 1 à 5 étoiles'}
                  {question.type === 'multiple_choice' && 'Choix unique'}
                  {question.type === 'yes_no' && 'Oui ou Non'}
                </div>
              </div>

              {renderQuestionInput(question)}
            </motion.div>
          ))}
        </div>

        {/* Bouton de soumission */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {Object.keys(responses).length} / {selectedSurvey.questions.length} questions répondues
            </div>
            <button
              onClick={handleSubmitSurvey}
              disabled={submitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Envoi en cours...' : 'Soumettre mes réponses'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <ClipboardDocumentListIcon className="h-8 w-8 text-teal-600 mr-3" />
          Sondages Disponibles
        </h1>
        <p className="text-gray-600 mt-1">
          Participez aux sondages pour nous aider à améliorer l'environnement de travail
        </p>
      </div>

      {/* Liste des sondages */}
      {surveys.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {surveys.map((survey) => (
            <motion.div
              key={survey.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedSurvey(survey)}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {survey.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {survey.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <ClipboardDocumentListIcon className="h-4 w-4 mr-1" />
                    {survey.questions.length} question{survey.questions.length > 1 ? 's' : ''}
                  </div>
                  <div className="text-teal-600 font-medium">
                    Participer →
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun sondage disponible</h3>
          <p className="mt-1 text-sm text-gray-500">
            Il n'y a actuellement aucun sondage actif. Revenez plus tard !
          </p>
        </div>
      )}

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

export default SurveyResponsePage;
