import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  PencilIcon,
  CameraIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { Employee } from '../../types';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<Employee | null>(null);
  const [editData, setEditData] = useState<Partial<Employee>>({});

  useEffect(() => {
    if (user) {
      // Convertir les données utilisateur en données employé avec des informations supplémentaires
      const employeeData: Employee = {
        ...user,
        skills: ['JavaScript', 'React', 'Node.js'],
        performance: 4.2
      };
      setProfileData(employeeData);
      setEditData(employeeData);
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      const updatedProfile = { ...profileData, ...editData } as Employee;
      setProfileData(updatedProfile);
      
      // Mettre à jour les données utilisateur dans le contexte d'authentification
      if (editData.firstName || editData.lastName || editData.email) {
        updateUser({
          firstName: editData.firstName || profileData?.firstName,
          lastName: editData.lastName || profileData?.lastName,
          email: editData.email || profileData?.email
        });
      }
      
      setIsEditing(false);
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData(profileData || {});
    setIsEditing(false);
  };

  if (!profileData) {
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
            <UserIcon className="h-8 w-8 text-teal-primary mr-3" />
            Mon Profil
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez vos informations personnelles et professionnelles
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Modifier
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="btn-secondary flex items-center"
            >
              <XMarkIcon className="h-5 w-5 mr-2" />
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn-primary flex items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <CheckIcon className="h-5 w-5 mr-2" />
              )}
              Sauvegarder
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations personnelles */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.firstName || ''}
                    onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.lastName || ''}
                    onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.lastName}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="text-gray-900">{profileData.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informations professionnelles */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations professionnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poste
                </label>
                <div className="flex items-center">
                  <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="text-gray-900">{profileData.position}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Département
                </label>
                <p className="text-gray-900">{profileData.department}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'embauche
                </label>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="text-gray-900">
                    {new Date(profileData.hireDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  profileData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {profileData.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
          </div>

          {/* Compétences */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compétences</h3>
            <div className="flex flex-wrap gap-2">
              {profileData.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
            {isEditing && (
              <div className="mt-4">
                <button 
                  onClick={() => {
                    const newSkill = prompt('Nouvelle compétence:');
                    if (newSkill && profileData.skills) {
                      const updatedSkills = [...profileData.skills, newSkill];
                      setProfileData({ ...profileData, skills: updatedSkills });
                      setEditData({ ...editData, skills: updatedSkills });
                    }
                  }}
                  className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                >
                  + Ajouter une compétence
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Photo de profil */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Photo de profil</h3>
            <div className="flex flex-col items-center">
              <div className="relative">
                {profileData.avatar ? (
                  <img
                    className="h-24 w-24 rounded-full object-cover"
                    src={profileData.avatar}
                    alt="Photo de profil"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-teal-100 flex items-center justify-center">
                    <span className="text-2xl font-medium text-teal-600">
                      {profileData.firstName[0]}{profileData.lastName[0]}
                    </span>
                  </div>
                )}
                {isEditing && (
                  <button 
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const result = e.target?.result as string;
                            setEditData({ ...editData, avatar: result });
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }}
                    className="absolute bottom-0 right-0 p-1 bg-teal-primary text-white rounded-full hover:bg-teal-700"
                  >
                    <CameraIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                {profileData.firstName} {profileData.lastName}
              </p>
              <p className="text-xs text-gray-500">{profileData.position}</p>
            </div>
          </div>

          {/* Performance */}
          {profileData.performance && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-primary mb-2">
                  {profileData.performance.toFixed(1)}/5
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-teal-primary h-2 rounded-full"
                    style={{ width: `${(profileData.performance / 5) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">Évaluation globale</p>
              </div>
            </div>
          )}

          {/* Actions rapides */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.href = '/employee/vacations'}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-teal-primary mr-3" />
                  <span className="text-sm font-medium">Demander des congés</span>
                </div>
              </button>
              <button 
                onClick={() => window.location.href = '/employee/trainings'}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <AcademicCapIcon className="h-5 w-5 text-teal-primary mr-3" />
                  <span className="text-sm font-medium">Voir les formations</span>
                </div>
              </button>
              <button 
                onClick={() => window.location.href = '/employee/objectives'}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <BriefcaseIcon className="h-5 w-5 text-teal-primary mr-3" />
                  <span className="text-sm font-medium">Mes objectifs</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
