import React, { useState } from 'react';
import {
  UserIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import { useNotification } from '../../hooks/useNotification';
import NotificationModal from '../common/NotificationModal';
import { useAuth } from '../../hooks/useAuth';

const EmployeeSettingsPage: React.FC = () => {
  const { notification, showSuccess, showInfo, hideNotification } = useNotification();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'notifications' | 'privacy'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [settings, setSettings] = useState({
    profile: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '+212 6 12 34 56 78',
      address: 'Casablanca, Maroc',
      birthDate: '1990-05-15'
    },
    preferences: {
      language: 'fr',
      timezone: 'Africa/Casablanca',
      dateFormat: 'DD/MM/YYYY',
      currency: 'MAD',
      theme: 'light'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      vacationReminders: true,
      trainingAlerts: true,
      payslipNotifications: true
    },
    privacy: {
      profileVisibility: 'team',
      showEmail: false,
      showPhone: false,
      dataSharing: false
    }
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs: Array<{
    id: 'profile' | 'security' | 'preferences' | 'notifications' | 'privacy';
    name: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'profile', name: 'Profil', icon: UserIcon },
    { id: 'preferences', name: 'Préférences', icon: CogIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Confidentialité', icon: ShieldCheckIcon }
  ];

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
          <UserIcon className="h-10 w-10 text-teal-600" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Photo de profil</h3>
          <p className="text-sm text-gray-500">Téléchargez une photo pour personnaliser votre profil</p>
          <button 
            onClick={() => showInfo(
              'Changer la photo',
              'La fonctionnalité de téléchargement de photo sera bientôt disponible. Vous pourrez personnaliser votre profil avec une image.'
            )}
            className="mt-2 btn-secondary text-sm"
          >
            Changer la photo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prénom
          </label>
          <input
            type="text"
            value={settings.profile.firstName}
            onChange={(e) => setSettings({
              ...settings,
              profile: { ...settings.profile, firstName: e.target.value }
            })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom
          </label>
          <input
            type="text"
            value={settings.profile.lastName}
            onChange={(e) => setSettings({
              ...settings,
              profile: { ...settings.profile, lastName: e.target.value }
            })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={settings.profile.email}
            onChange={(e) => setSettings({
              ...settings,
              profile: { ...settings.profile, email: e.target.value }
            })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone
          </label>
          <input
            type="tel"
            value={settings.profile.phone}
            onChange={(e) => setSettings({
              ...settings,
              profile: { ...settings.profile, phone: e.target.value }
            })}
            className="input-field"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse
          </label>
          <input
            type="text"
            value={settings.profile.address}
            onChange={(e) => setSettings({
              ...settings,
              profile: { ...settings.profile, address: e.target.value }
            })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de naissance
          </label>
          <input
            type="date"
            value={settings.profile.birthDate}
            onChange={(e) => setSettings({
              ...settings,
              profile: { ...settings.profile, birthDate: e.target.value }
            })}
            className="input-field"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe actuel
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
            />
          </div>
        </div>
        <button 
          onClick={() => showSuccess(
            'Mot de passe mis à jour',
            'Votre mot de passe a été modifié avec succès. Vous devrez utiliser le nouveau mot de passe lors de votre prochaine connexion.'
          )}
          className="mt-4 btn-secondary"
        >
          Mettre à jour le mot de passe
        </button>
      </div>
    </div>
  );

  const renderPreferencesSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Langue
          </label>
          <select
            value={settings.preferences.language}
            onChange={(e) => setSettings({
              ...settings,
              preferences: { ...settings.preferences, language: e.target.value }
            })}
            className="input-field"
          >
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuseau horaire
          </label>
          <select
            value={settings.preferences.timezone}
            onChange={(e) => setSettings({
              ...settings,
              preferences: { ...settings.preferences, timezone: e.target.value }
            })}
            className="input-field"
          >
            <option value="Africa/Casablanca">Africa/Casablanca (GMT+1)</option>
            <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
            <option value="Europe/London">Europe/London (GMT+0)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Format de date
          </label>
          <select
            value={settings.preferences.dateFormat}
            onChange={(e) => setSettings({
              ...settings,
              preferences: { ...settings.preferences, dateFormat: e.target.value }
            })}
            className="input-field"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Devise
          </label>
          <select
            value={settings.preferences.currency}
            onChange={(e) => setSettings({
              ...settings,
              preferences: { ...settings.preferences, currency: e.target.value }
            })}
            className="input-field"
          >
            <option value="MAD">Dirham Marocain (DH)</option>
            <option value="EUR">Euro (€)</option>
            <option value="USD">Dollar US ($)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thème
          </label>
          <select
            value={settings.preferences.theme}
            onChange={(e) => setSettings({
              ...settings,
              preferences: { ...settings.preferences, theme: e.target.value }
            })}
            className="input-field"
          >
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
            <option value="auto">Automatique</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {[
          { key: 'emailNotifications', label: 'Notifications par email', desc: 'Recevoir les notifications importantes par email' },
          { key: 'pushNotifications', label: 'Notifications push', desc: 'Recevoir les notifications dans le navigateur' },
          { key: 'vacationReminders', label: 'Rappels de congés', desc: 'Notifications pour vos demandes de congés' },
          { key: 'trainingAlerts', label: 'Alertes de formation', desc: 'Notifications pour les nouvelles formations' },
          { key: 'payslipNotifications', label: 'Notifications de paie', desc: 'Être notifié lors de la mise à disposition des fiches de paie' }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">{item.label}</h4>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
            <button
              onClick={() => setSettings({
                ...settings,
                notifications: { 
                  ...settings.notifications, 
                  [item.key]: !settings.notifications[item.key as keyof typeof settings.notifications]
                }
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications[item.key as keyof typeof settings.notifications] ? 'bg-teal-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications[item.key as keyof typeof settings.notifications] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Visibilité du profil</h4>
          <p className="text-sm text-gray-500 mb-3">Qui peut voir votre profil complet</p>
          <select
            value={settings.privacy.profileVisibility}
            onChange={(e) => setSettings({
              ...settings,
              privacy: { ...settings.privacy, profileVisibility: e.target.value }
            })}
            className="input-field"
          >
            <option value="public">Tous les employés</option>
            <option value="team">Mon équipe uniquement</option>
            <option value="managers">Managers uniquement</option>
            <option value="private">Privé</option>
          </select>
        </div>

        {[
          { key: 'showEmail', label: 'Afficher mon email', desc: 'Permettre aux autres de voir votre adresse email' },
          { key: 'showPhone', label: 'Afficher mon téléphone', desc: 'Permettre aux autres de voir votre numéro de téléphone' },
          { key: 'dataSharing', label: 'Partage de données', desc: 'Autoriser le partage de données anonymisées pour améliorer le service' }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">{item.label}</h4>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
            <button
              onClick={() => setSettings({
                ...settings,
                privacy: { 
                  ...settings.privacy, 
                  [item.key]: !settings.privacy[item.key as keyof typeof settings.privacy]
                }
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.privacy[item.key as keyof typeof settings.privacy] ? 'bg-teal-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.privacy[item.key as keyof typeof settings.privacy] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-red-600 mb-4">Zone de danger</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800">Supprimer mon compte</h4>
          <p className="text-sm text-red-600 mt-1">
            Cette action est irréversible. Toutes vos données seront supprimées définitivement.
          </p>
          <button 
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
                alert('Demande de suppression envoyée aux administrateurs.');
              }
            }}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
          >
            Demander la suppression
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <CogIcon className="h-8 w-8 text-teal-600 mr-3" />
            Mes Paramètres
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez vos préférences personnelles et paramètres de compte
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`btn-primary flex items-center ${saved ? 'bg-green-600' : ''}`}
        >
          {saved ? (
            <>
              <CheckIcon className="h-5 w-5 mr-2" />
              Sauvegardé
            </>
          ) : (
            'Sauvegarder'
          )}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Onglets */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-teal-600 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          {activeTab === 'profile' && renderProfileSettings()}
          {activeTab === 'preferences' && renderPreferencesSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'privacy' && renderPrivacySettings()}
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
    </div>
  );
};

export default EmployeeSettingsPage;
