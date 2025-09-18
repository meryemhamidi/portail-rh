import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Employee } from '../../types';
import { 
  CalendarIcon, 
  ClockIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSchedule: (meetingData: any) => void;
}

const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({ 
  isOpen, 
  onClose, 
  employee, 
  onSchedule 
}) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: '60',
    location: '',
    agenda: '',
    notes: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: {[key: string]: string} = {};
    if (!formData.date) newErrors.date = 'La date est requise';
    if (!formData.time) newErrors.time = 'L\'heure est requise';
    if (!formData.agenda) newErrors.agenda = 'L\'agenda est requis';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Créer l'objet de rendez-vous
    const meetingData = {
      employeeId: employee?.id,
      employeeName: `${employee?.firstName} ${employee?.lastName}`,
      date: formData.date,
      time: formData.time,
      duration: parseInt(formData.duration),
      location: formData.location || 'Bureau Manager',
      agenda: formData.agenda,
      notes: formData.notes,
      type: '1:1',
      status: 'scheduled'
    };

    onSchedule(meetingData);
    
    // Reset form
    setFormData({
      date: '',
      time: '',
      duration: '60',
      location: '',
      agenda: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setFormData({
      date: '',
      time: '',
      duration: '60',
      location: '',
      agenda: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  if (!employee) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Planifier un entretien 1:1" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Employé sélectionné */}
        <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-teal-500 flex items-center justify-center">
              <span className="text-white font-medium">
                {employee.firstName[0]}{employee.lastName[0]}
              </span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                {employee.firstName} {employee.lastName}
              </h4>
              <p className="text-sm text-gray-600">{employee.position}</p>
            </div>
          </div>
        </div>

        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="h-4 w-4 inline mr-1" />
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className={`input-field ${errors.date ? 'border-red-500' : ''}`}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ClockIcon className="h-4 w-4 inline mr-1" />
              Heure *
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              className={`input-field ${errors.time ? 'border-red-500' : ''}`}
            />
            {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durée (minutes)
            </label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              className="input-field"
            >
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 heure</option>
              <option value="90">1h30</option>
              <option value="120">2 heures</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lieu
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="Bureau Manager, Salle de réunion..."
              className="input-field"
            />
          </div>
        </div>

        {/* Agenda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <ChatBubbleLeftRightIcon className="h-4 w-4 inline mr-1" />
            Agenda de l'entretien *
          </label>
          <textarea
            value={formData.agenda}
            onChange={(e) => setFormData({...formData, agenda: e.target.value})}
            placeholder="Points à aborder lors de l'entretien..."
            rows={3}
            className={`input-field ${errors.agenda ? 'border-red-500' : ''}`}
          />
          {errors.agenda && <p className="text-red-500 text-xs mt-1">{errors.agenda}</p>}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes additionnelles
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Notes ou préparations spécifiques..."
            rows={2}
            className="input-field"
          />
        </div>

        {/* Suggestions d'agenda */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Suggestions d'agenda :</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
            <button
              type="button"
              onClick={() => setFormData({...formData, agenda: 'Bilan des objectifs en cours\nDifficultés rencontrées\nBesoins de formation\nPerspectives d\'évolution'})}
              className="text-left p-2 hover:bg-gray-100 rounded border"
            >
              • Bilan performance
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, agenda: 'Retour sur les projets récents\nNouvelles responsabilités\nCollaboration équipe\nAméliorations suggérées'})}
              className="text-left p-2 hover:bg-gray-100 rounded border"
            >
              • Suivi projet
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, agenda: 'Objectifs de carrière\nCompétences à développer\nFormations souhaitées\nPlan de développement'})}
              className="text-left p-2 hover:bg-gray-100 rounded border"
            >
              • Développement
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, agenda: 'Bien-être au travail\nÉquilibre vie pro/perso\nRelations équipe\nSuggestions d\'amélioration'})}
              className="text-left p-2 hover:bg-gray-100 rounded border"
            >
              • Bien-être
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="btn-secondary"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Planifier l'entretien
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ScheduleMeetingModal;
