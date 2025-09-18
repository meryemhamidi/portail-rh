import React, { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  PlusIcon, 
  DocumentArrowDownIcon,
  ClockIcon,
  UserGroupIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import InputModal from '../common/InputModal';
import { useInputModal } from '../../hooks/useInputModal';
import NotificationModal from '../common/NotificationModal';
import { useNotification } from '../../hooks/useNotification';
import { VacationRequest } from '../../types';
import { vacationService } from '../../services/api';
import LeaveRequestModal from './LeaveRequestModal';

interface PlanningEvent {
  id: string;
  title: string;
  type: 'meeting' | 'vacation' | 'training' | 'deadline';
  startDate: string;
  endDate?: string;
  participants: string[];
  description: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

const PlanningPage: React.FC = () => {
  const [events, setEvents] = useState<PlanningEvent[]>([]);
  const [requests, setRequests] = useState<VacationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const { notification, showSuccess, showInfo, hideNotification } = useNotification();
  const { modalState, showTextInput, showSelectInput, hideInputModal } = useInputModal();
  const [selectedRequest, setSelectedRequest] = useState<VacationRequest | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  useEffect(() => {
    loadPlanningEvents();
  }, []);

  const loadPlanningEvents = async () => {
    try {
      const mockEvents: PlanningEvent[] = [
        {
          id: '1',
          title: 'Réunion équipe développement',
          type: 'meeting',
          startDate: '2024-02-15 09:00',
          endDate: '2024-02-15 10:30',
          participants: ['Meryem Hamidi', 'Kenza Hamidi'],
          description: 'Point hebdomadaire sur l\'avancement des projets',
          status: 'scheduled'
        },
        {
          id: '2',
          title: 'Congés - Meryem Hamidi',
          type: 'vacation',
          startDate: '2024-02-20 00:00',
          endDate: '2024-02-25 23:59',
          participants: ['Meryem Hamidi'],
          description: 'Congés annuels',
          status: 'scheduled'
        },
        {
          id: '3',
          title: 'Formation React Avancé',
          type: 'training',
          startDate: '2024-02-28 14:00',
          endDate: '2024-02-28 17:00',
          participants: ['Équipe Dev'],
          description: 'Formation sur les hooks avancés et l\'optimisation',
          status: 'scheduled'
        }
      ];
      setEvents(mockEvents);

      const mockRequests: VacationRequest[] = [
        {
          id: '1',
          employeeId: '1',
          employeeName: 'Meryem Hamidi',
          startDate: '2024-02-20',
          endDate: '2024-02-25',
          days: 5,
          type: 'vacation',
          reason: 'Congés annuels',
          status: 'pending',
          requestDate: '2024-02-10'
        }
      ];
      setRequests(mockRequests);
    } catch (error) {
      console.error('Erreur lors du chargement du planning:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <UserGroupIcon className="h-4 w-4 text-blue-600" />;
      case 'vacation': return <CalendarIcon className="h-4 w-4 text-green-600" />;
      case 'training': return <PencilIcon className="h-4 w-4 text-purple-600" />;
      case 'deadline': return <ClockIcon className="h-4 w-4 text-red-600" />;
      default: return <CalendarIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <ClockIcon className="h-4 w-4 text-yellow-600" />;
      case 'cancelled': return <XCircleIcon className="h-4 w-4 text-red-600" />;
      default: return <CalendarIcon className="h-4 w-4 text-blue-600" />;
    }
  };

  const addNewEvent = () => {
    showTextInput(
      'Nouvel événement',
      'Titre de l\'événement',
      (title) => {
        showSelectInput(
          'Type d\'événement',
          'Sélectionnez le type',
          [
            { value: 'meeting', label: 'Réunion' },
            { value: 'vacation', label: 'Congé' },
            { value: 'training', label: 'Formation' },
            { value: 'deadline', label: 'Échéance' }
          ],
          (type) => {
            showTextInput(
              'Date de début',
              'Date et heure (YYYY-MM-DD HH:MM)',
              (startDate) => {
                showTextInput(
                  'Description',
                  'Description de l\'événement',
                  (description) => {
                    const newEvent: PlanningEvent = {
                      id: Date.now().toString(),
                      title,
                      type: type as any,
                      startDate,
                      participants: [],
                      description,
                      status: 'scheduled'
                    };
                    setEvents([...events, newEvent]);
                    showSuccess(
                      'Événement créé',
                      `L'événement "${title}" a été ajouté au planning.`
                    );
                  },
                  { placeholder: 'Description détaillée...' }
                );
              },
              { 
                placeholder: '2024-03-15 14:30',
                validation: (value) => {
                  const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
                  if (!dateRegex.test(value)) {
                    return 'Format requis: YYYY-MM-DD HH:MM';
                  }
                  return null;
                }
              }
            );
          }
        );
      },
      { placeholder: 'Ex: Réunion équipe développement' }
    );
  };

  const exportPlanning = () => {
    showSelectInput(
      'Export du planning',
      'Sélectionnez le format d\'export',
      [
        { value: 'pdf', label: 'PDF' },
        { value: 'csv', label: 'CSV' },
        { value: 'excel', label: 'Excel' }
      ],
      (format) => {
        const planningData = {
          title: 'Planning de l\'Équipe',
          date: new Date().toLocaleDateString('fr-FR'),
          events: events,
          requests: requests
        };
        console.log('Export planning:', planningData);
        showSuccess(
          'Export réussi',
          `Le planning a été exporté au format ${format.toUpperCase()}.`
        );
      }
    );
  };

  const updateEventStatus = (eventId: string) => {
    showSelectInput(
      'Modifier le statut',
      'Nouveau statut de l\'événement',
      [
        { value: 'scheduled', label: 'Programmé' },
        { value: 'in_progress', label: 'En cours' },
        { value: 'completed', label: 'Terminé' },
        { value: 'cancelled', label: 'Annulé' }
      ],
      (newStatus) => {
        setEvents(events.map(e => 
          e.id === eventId ? { ...e, status: newStatus as any } : e
        ));
        showInfo(
          'Statut mis à jour',
          `Le statut de l'événement a été modifié.`
        );
      }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <CalendarIcon className="h-8 w-8 text-teal-primary mr-3" />
            Planning de l'Équipe
          </h1>
          <p className="text-gray-600 mt-1">
            Gestion du planning et des événements de l'équipe
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={addNewEvent}
            className="btn-secondary flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nouvel événement
          </button>
          <button 
            onClick={exportPlanning}
            className="btn-primary"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Exporter planning
          </button>
        </div>
      </div>

      {/* Filtres et vue */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date sélectionnée
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vue
              </label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as 'week' | 'month')}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="week">Semaine</option>
                <option value="month">Mois</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Événements à venir */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Événements à venir</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  {getTypeIcon(event.type)}
                  <div>
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500">
                        📅 {event.startDate} - {event.endDate || event.startDate}
                      </span>
                      <span className="text-xs text-gray-500">
                        👥 {event.participants.length} participant(s)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(event.status)}
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => updateEventStatus(event.id)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      title="Modifier"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setEvents(events.filter(e => e.id !== event.id));
                        showInfo('Événement supprimé', 'L\'événement a été retiré du planning.');
                      }}
                      className="text-red-600 hover:text-red-900 p-1 rounded"
                      title="Supprimer"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="text-center py-8">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun événement</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Commencez par ajouter un nouvel événement au planning.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Demandes de congé */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Demandes de congé</h2>
          <button 
            onClick={() => {
              showTextInput(
                'Nouvelle demande de congé',
                'Nom de l\'employé',
                (employeeName) => {
                  showTextInput(
                    'Date de début',
                    'Date de début (YYYY-MM-DD)',
                    (startDate) => {
                      showTextInput(
                        'Date de fin',
                        'Date de fin (YYYY-MM-DD)',
                        (endDate) => {
                          showTextInput(
                            'Motif',
                            'Motif de la demande',
                            (reason) => {
                              const start = new Date(startDate);
                              const end = new Date(endDate);
                              const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                              
                              const newRequest: VacationRequest = {
                                id: Date.now().toString(),
                                employeeId: Date.now().toString(),
                                employeeName,
                                startDate,
                                endDate,
                                days,
                                type: 'vacation',
                                reason,
                                status: 'pending',
                                requestDate: new Date().toISOString().split('T')[0]
                              };
                              setRequests([...requests, newRequest]);
                              showSuccess('Demande créée', `La demande de congé pour ${employeeName} a été soumise.`);
                            },
                            { placeholder: 'Ex: Congés annuels' }
                          );
                        },
                        { 
                          placeholder: '2024-03-20',
                          validation: (value) => {
                            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                            if (!dateRegex.test(value)) {
                              return 'Format requis: YYYY-MM-DD';
                            }
                            return null;
                          }
                        }
                      );
                    },
                    { 
                      placeholder: '2024-03-15',
                      validation: (value) => {
                        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                        if (!dateRegex.test(value)) {
                          return 'Format requis: YYYY-MM-DD';
                        }
                        return null;
                      }
                    }
                  );
                },
                { placeholder: 'Ex: Meryem Hamidi' }
              );
            }}
            className="btn-secondary text-sm"
          >
            Nouvelle demande
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <UserIcon className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">{request.employeeName}</h3>
                    <p className="text-sm text-gray-600">{request.reason}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500">
                        📅 {request.startDate} - {request.endDate}
                      </span>
                      <span className="text-xs text-gray-500">
                        📊 {request.days} jour(s)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.status === 'approved' ? 'Approuvé' :
                     request.status === 'rejected' ? 'Rejeté' : 'En attente'}
                  </span>
                  {request.status === 'pending' && (
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => {
                          setRequests(requests.map(r => 
                            r.id === request.id ? { ...r, status: 'approved' } : r
                          ));
                          showSuccess('Demande approuvée', `La demande de ${request.employeeName} a été approuvée.`);
                        }}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Approuver"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setRequests(requests.map(r => 
                            r.id === request.id ? { ...r, status: 'rejected' } : r
                          ));
                          showInfo('Demande rejetée', `La demande de ${request.employeeName} a été rejetée.`);
                        }}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Rejeter"
                      >
                        <XCircleIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="text-center py-8">
                <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune demande</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Aucune demande de congé en attente.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}

      <NotificationModal 
        isOpen={notification.isOpen}
        onClose={hideNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        confirmText={notification.confirmText}
      />

      <InputModal 
        isOpen={modalState.isOpen}
        onClose={hideInputModal}
        onSubmit={modalState.onSubmit}
        title={modalState.title}
        label={modalState.label}
        placeholder={modalState.placeholder}
        defaultValue={modalState.defaultValue}
        inputType={modalState.inputType}
        options={modalState.options}
        validation={modalState.validation}
        icon={modalState.icon}
      />
    </div>
  );
};

export default PlanningPage;
