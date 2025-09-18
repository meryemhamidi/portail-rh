import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  QuestionMarkCircleIcon,
  ListBulletIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

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
}

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSurvey: (survey: Omit<Survey, 'id' | 'createdAt' | 'createdBy'>) => void;
}

const SurveyModal: React.FC<SurveyModalProps> = ({ isOpen, onClose, onCreateSurvey }) => {
  const [surveyData, setSurveyData] = useState({
    title: '',
    description: '',
    isActive: true
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState<'info' | 'questions' | 'preview'>('info');

  const questionTypes = [
    { value: 'text', label: 'Réponse libre', icon: '📝' },
    { value: 'multiple_choice', label: 'Choix multiple', icon: '☑️' },
    { value: 'rating', label: 'Évaluation (1-5)', icon: '⭐' },
    { value: 'yes_no', label: 'Oui/Non', icon: '✅' }
  ];

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type: 'text',
      question: '',
      required: false,
      options: []
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    ));
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const addOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newOptions = [...(question.options || []), ''];
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = question.options.filter((_, index) => index !== optionIndex);
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const handleSubmit = () => {
    if (surveyData.title && questions.length > 0) {
      onCreateSurvey({
        ...surveyData,
        questions
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setSurveyData({ title: '', description: '', isActive: true });
    setQuestions([]);
    setCurrentStep('info');
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'info':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre du sondage *
              </label>
              <input
                type="text"
                value={surveyData.title}
                onChange={(e) => setSurveyData({ ...surveyData, title: e.target.value })}
                className="input-field"
                placeholder="Ex: Satisfaction au travail 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={surveyData.description}
                onChange={(e) => setSurveyData({ ...surveyData, description: e.target.value })}
                className="input-field"
                rows={4}
                placeholder="Décrivez l'objectif de ce sondage..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={surveyData.isActive}
                onChange={(e) => setSurveyData({ ...surveyData, isActive: e.target.checked })}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Activer immédiatement le sondage
              </label>
            </div>
          </div>
        );

      case 'questions':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Questions du sondage</h3>
              <button
                onClick={addQuestion}
                className="btn-secondary flex items-center text-sm"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Ajouter une question
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-gray-600">
                      Question {index + 1}
                    </span>
                    <button
                      onClick={() => removeQuestion(question.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                        className="input-field"
                        placeholder="Tapez votre question ici..."
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Type de question</label>
                        <select
                          value={question.type}
                          onChange={(e) => updateQuestion(question.id, { 
                            type: e.target.value as Question['type'],
                            options: e.target.value === 'multiple_choice' ? [''] : undefined
                          })}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          {questionTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.icon} {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`required-${question.id}`}
                          checked={question.required}
                          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                          className="h-3 w-3 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`required-${question.id}`} className="ml-1 text-xs text-gray-600">
                          Obligatoire
                        </label>
                      </div>
                    </div>

                    {question.type === 'multiple_choice' && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-xs text-gray-600">Options de réponse</label>
                          <button
                            onClick={() => addOption(question.id)}
                            className="text-xs text-teal-600 hover:text-teal-700"
                          >
                            + Ajouter option
                          </button>
                        </div>
                        {question.options?.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                              className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                            <button
                              onClick={() => removeOption(question.id, optionIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <TrashIcon className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {questions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <QuestionMarkCircleIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Aucune question ajoutée</p>
                <p className="text-sm">Cliquez sur "Ajouter une question" pour commencer</p>
              </div>
            )}
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-6">
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-teal-800 mb-2">{surveyData.title}</h3>
              <p className="text-teal-700 text-sm mb-3">{surveyData.description}</p>
              <div className="flex items-center text-sm text-teal-600">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                {questions.length} question{questions.length > 1 ? 's' : ''}
                {surveyData.isActive && ' • Actif'}
              </div>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto">
              {questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">
                      {index + 1}. {question.question}
                    </h4>
                    {question.required && (
                      <span className="text-xs text-red-500 font-medium">Obligatoire</span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Type: {questionTypes.find(t => t.value === question.type)?.label}
                    {question.options && question.options.length > 0 && (
                      <div className="mt-2">
                        <span className="font-medium">Options:</span>
                        <ul className="list-disc list-inside ml-2 mt-1">
                          {question.options.map((option, i) => (
                            <li key={i}>{option || `Option ${i + 1}`}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'info':
        return surveyData.title.trim() !== '';
      case 'questions':
        return questions.length > 0 && questions.every(q => q.question.trim() !== '');
      case 'preview':
        return true;
      default:
        return false;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
            >
              {/* Header */}
              <div className="bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Créer un nouveau sondage
                    </h3>
                    <div className="flex items-center mt-2 space-x-4">
                      {['info', 'questions', 'preview'].map((step, index) => (
                        <div key={step} className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            currentStep === step 
                              ? 'bg-teal-600 text-white' 
                              : index < ['info', 'questions', 'preview'].indexOf(currentStep)
                                ? 'bg-teal-100 text-teal-600'
                                : 'bg-gray-200 text-gray-500'
                          }`}>
                            {index + 1}
                          </div>
                          <span className={`ml-2 text-sm ${
                            currentStep === step ? 'text-teal-600 font-medium' : 'text-gray-500'
                          }`}>
                            {step === 'info' ? 'Informations' : step === 'questions' ? 'Questions' : 'Aperçu'}
                          </span>
                          {index < 2 && <div className="w-8 h-0.5 bg-gray-200 mx-4" />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="bg-white px-6 py-6">
                {renderStepContent()}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between">
                <button
                  onClick={() => {
                    if (currentStep === 'info') {
                      handleClose();
                    } else if (currentStep === 'questions') {
                      setCurrentStep('info');
                    } else {
                      setCurrentStep('questions');
                    }
                  }}
                  className="btn-secondary"
                >
                  {currentStep === 'info' ? 'Annuler' : 'Précédent'}
                </button>

                <button
                  onClick={() => {
                    if (currentStep === 'info') {
                      setCurrentStep('questions');
                    } else if (currentStep === 'questions') {
                      setCurrentStep('preview');
                    } else {
                      handleSubmit();
                    }
                  }}
                  disabled={!canProceed()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentStep === 'preview' ? 'Créer le sondage' : 'Suivant'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SurveyModal;
