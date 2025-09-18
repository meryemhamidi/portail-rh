import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any>;
  type: 'objective' | 'training' | 'generic';
}

const DetailsModal: React.FC<DetailsModalProps> = ({ isOpen, onClose, title, data, type }) => {
  if (!isOpen) return null;

  const renderObjectiveDetails = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Description</h4>
        <p className="text-gray-600">{data.description}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Progression</h4>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
              <div 
                className="bg-teal-primary h-2 rounded-full" 
                style={{ width: `${data.progress}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900">{data.progress}%</span>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Échéance</h4>
          <p className="text-gray-600">{new Date(data.dueDate).toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-gray-900 mb-1">Statut</h4>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          data.status === 'completed' ? 'bg-green-100 text-green-800' :
          data.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
          data.status === 'overdue' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {data.status === 'completed' ? 'Terminé' :
           data.status === 'in_progress' ? 'En cours' :
           data.status === 'overdue' ? 'En retard' : 'En attente'}
        </span>
      </div>
      
      {data.feedback && data.feedback.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Commentaires</h4>
          <div className="space-y-2">
            {data.feedback.map((comment: any, index: number) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">{comment.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {comment.from} - {new Date(comment.date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTrainingDetails = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Description</h4>
        <p className="text-gray-600">{data.description}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Date de début</h4>
          <p className="text-gray-600">{new Date(data.startDate).toLocaleDateString('fr-FR')}</p>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Date de fin</h4>
          <p className="text-gray-600">{new Date(data.endDate).toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-gray-900 mb-1">Formateur</h4>
        <p className="text-gray-600">{data.instructor}</p>
      </div>
      
      <div>
        <h4 className="font-medium text-gray-900 mb-1">Statut</h4>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          data.status === 'completed' ? 'bg-green-100 text-green-800' :
          data.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
          data.status === 'cancelled' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {data.status === 'completed' ? 'Terminée' :
           data.status === 'in_progress' ? 'En cours' :
           data.status === 'cancelled' ? 'Annulée' : 'Programmée'}
        </span>
      </div>
      
      {data.progress !== undefined && (
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Progression</h4>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
              <div 
                className="bg-teal-primary h-2 rounded-full" 
                style={{ width: `${data.progress}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900">{data.progress}%</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderGenericDetails = () => (
    <div className="space-y-4">
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <h4 className="font-medium text-gray-900 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </h4>
          <p className="text-gray-600">
            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mt-4">
              {type === 'objective' && renderObjectiveDetails()}
              {type === 'training' && renderTrainingDetails()}
              {type === 'generic' && renderGenericDetails()}
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="btn-secondary w-full sm:w-auto"
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
