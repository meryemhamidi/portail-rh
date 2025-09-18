import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon,
  StarIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  PencilIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
  TrophyIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import NotificationModal from '../common/NotificationModal';
import { useNotification } from '../../hooks/useNotification';
import InputModal from '../common/InputModal';
import { useInputModal } from '../../hooks/useInputModal';
import { Employee } from '../../types';
import EmployeeProfileModal from './EmployeeProfileModal';
import ScheduleMeetingModal from './ScheduleMeetingModal';

const TeamPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { notification, showSuccess, showWarning, hideNotification } = useNotification();
  const { modalState, showTextInput, showNumberInput, hideInputModal } = useInputModal();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetings, setMeetings] = useState<any[]>([]);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      // Simulation de données équipe
      const mockTeamMembers: Employee[] = [
        {
          id: '1',
          email: 'meryem.hamidi@teal-tech.com',
          firstName: 'Meryem',
          lastName: 'Hamidi',
          role: 'employee',
          department: 'Développement',
          position: 'Développeur Senior',
          hireDate: '2023-01-15',
          isActive: true,
          salary: 55000,
          managerId: 'current-manager',
          skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
          performance: 4.2
        },
        {
          id: '2',
          email: 'sophie.martin@teal-tech.com',
          firstName: 'Kenza',
          lastName: 'Hamidi',
          role: 'employee',
          department: 'Développement',
          position: 'Développeuse Frontend',
          hireDate: '2023-03-10',
          isActive: true,
          salary: 48000,
          managerId: 'current-manager',
          skills: ['React', 'Vue.js', 'CSS', 'JavaScript'],
          performance: 4.5
        },
        {
          id: '3',
          email: 'pierre.bernard@teal-tech.com',
          firstName: 'Lina',
          lastName: 'Hamidi',
          role: 'employee',
          department: 'Développement',
          position: 'Développeur Backend',
          hireDate: '2022-09-20',
          isActive: true,
          salary: 52000,
          managerId: 'current-manager',
          skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
          performance: 4.0
        }
      ];
      setTeamMembers(mockTeamMembers);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'équipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'high-performers') return matchesSearch && (member.performance || 0) >= 4.0;
    if (selectedFilter === 'new-hires') return matchesSearch && new Date(member.hireDate) > new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
    
    return matchesSearch;
  });

  const getPerformanceColor = (performance: number) => {
    if (performance >= 4.5) return 'text-green-600 bg-green-100';
    if (performance >= 4.0) return 'text-blue-600 bg-blue-100';
    if (performance >= 3.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const teamStats = {
    totalMembers: teamMembers.length,
    averagePerformance: teamMembers.reduce((acc, m) => acc + (m.performance || 0), 0) / teamMembers.length,
    highPerformers: teamMembers.filter(m => (m.performance || 0) >= 4.0).length,
    newHires: teamMembers.filter(m => new Date(m.hireDate) > new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <UserGroupIcon className="h-8 w-8 text-teal-primary mr-3" />
            Mon Équipe
          </h1>
          <p className="text-gray-600 mt-1">
            Gestion et suivi de votre équipe
          </p>
        </div>
      </div>

      {/* Statistiques équipe */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Membres</p>
              <p className="text-2xl font-bold text-gray-900">{teamStats.totalMembers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Performance Moy.</p>
              <p className="text-2xl font-bold text-gray-900">{teamStats.averagePerformance.toFixed(1)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrophyIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Top Performers</p>
              <p className="text-2xl font-bold text-gray-900">{teamStats.highPerformers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nouveaux</p>
              <p className="text-2xl font-bold text-gray-900">{teamStats.newHires}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un membre de l'équipe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">Tous les membres</option>
            <option value="high-performers">Top performers</option>
            <option value="new-hires">Nouvelles recrues</option>
          </select>
        </div>
      </div>

      {/* Grille des membres d'équipe */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="text-lg font-medium text-teal-600">
                    {member.firstName[0]}{member.lastName[0]}
                  </span>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {member.firstName} {member.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{member.position}</p>
                </div>
                {member.performance && (
                  <div className={`px-2 py-1 text-xs font-medium rounded-full ${getPerformanceColor(member.performance)}`}>
                    <div className="flex items-center">
                      <StarIcon className="h-3 w-3 mr-1" />
                      {member.performance.toFixed(1)}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Embauché le {new Date(member.hireDate).toLocaleDateString('fr-FR')}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Compétences:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {member.skills?.slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                    {member.skills && member.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{member.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    setSelectedEmployee(member);
                    setShowProfileModal(true);
                  }}
                  className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Profil
                </button>
                <button 
                  onClick={() => {
                    setSelectedEmployee(member);
                    setShowMeetingModal(true);
                  }}
                  className="flex-1 btn-primary text-sm py-2 flex items-center justify-center"
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                  1:1
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun membre trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucun membre de l'équipe ne correspond à vos critères.
          </p>
        </div>
      )}

      {/* Modales */}
      <EmployeeProfileModal 
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
      />

      <ScheduleMeetingModal 
        isOpen={showMeetingModal}
        onClose={() => {
          setShowMeetingModal(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onSchedule={(meetingData) => {
          setMeetings([...meetings, { ...meetingData, id: Date.now().toString() }]);
          showSuccess(
            'Entretien planifié !',
            `Entretien 1:1 planifié avec ${meetingData.employeeName} le ${meetingData.date} à ${meetingData.time}`
          );
        }}
      />

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => {
              if (teamMembers.length > 0) {
                setSelectedEmployee(teamMembers[0]);
                setShowMeetingModal(true);
              }
            }}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
          >
            <CalendarIcon className="h-8 w-8 text-teal-primary mb-2" />
            <h4 className="font-medium text-gray-900">Planifier 1:1</h4>
            <p className="text-sm text-gray-500">Programmer des entretiens individuels</p>
          </button>
          <button 
            onClick={() => {
              showTextInput(
                'Évaluer la performance',
                'Nom du membre à évaluer',
                (memberName) => {
                  showNumberInput(
                    'Note de performance',
                    'Nouvelle note (1-5)',
                    (ratingStr) => {
                      const rating = parseFloat(ratingStr);
                      if (rating >= 1 && rating <= 5) {
                        const updatedMembers = teamMembers.map(member => 
                          `${member.firstName} ${member.lastName}` === memberName 
                            ? { ...member, performance: rating }
                            : member
                        );
                        setTeamMembers(updatedMembers);
                        showSuccess(
                          'Performance mise à jour',
                          `Performance de ${memberName} mise à jour: ${rating}/5`
                        );
                      } else {
                        showWarning(
                          'Note invalide',
                          'La note doit être entre 1 et 5'
                        );
                      }
                    },
                    {
                      placeholder: '1-5',
                      validation: (value) => {
                        const num = parseFloat(value);
                        if (isNaN(num) || num < 1 || num > 5) {
                          return 'La note doit être entre 1 et 5';
                        }
                        return null;
                      }
                    }
                  );
                },
                {
                  placeholder: 'Ex: Jean Dupont'
                }
              );
            }}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
          >
            <ChartBarIcon className="h-8 w-8 text-teal-primary mb-2" />
            <h4 className="font-medium text-gray-900">Évaluer performance</h4>
            <p className="text-sm text-gray-500">Mettre à jour les évaluations</p>
          </button>
          <button 
            onClick={() => window.location.href = '/manager/objectives'}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
          >
            <TrophyIcon className="h-8 w-8 text-teal-primary mb-2" />
            <h4 className="font-medium text-gray-900">Définir objectifs</h4>
            <p className="text-sm text-gray-500">Créer de nouveaux objectifs</p>
          </button>
        </div>
      </div>
      {/* Modal de notification */}
      <NotificationModal 
        isOpen={notification.isOpen}
        onClose={hideNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        confirmText={notification.confirmText}
      />

      {/* Modal de saisie */}
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

export default TeamPage;
