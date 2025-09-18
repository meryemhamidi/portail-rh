import React, { useState } from 'react';
import {
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  CloudIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      companyName: 'Teal Technology Services',
      timezone: 'Africa/Casablanca',
      language: 'fr',
      dateFormat: 'DD/MM/YYYY',
      currency: 'MAD'
    },
    security: {
      passwordMinLength: 8,
      passwordRequireSpecialChars: true,
      sessionTimeout: 30,
      twoFactorAuth: false,
      loginAttempts: 3,
      accountLockoutDuration: 15
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      vacationApproval: true,
      systemAlerts: true,
      weeklyReports: true
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionPeriod: 30,
      cloudBackup: true,
      lastBackup: '2024-01-15T10:30:00Z'
    }
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Simulation de sauvegarde
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'general', name: 'Général', icon: CogIcon },
    { id: 'security', name: 'Sécurité', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'backup', name: 'Sauvegarde', icon: CloudIcon }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom de l'entreprise
          </label>
          <input
            type="text"
            value={settings.general.companyName}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, companyName: e.target.value }
            })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuseau horaire
          </label>
          <select
            value={settings.general.timezone}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, timezone: e.target.value }
            })}
            className="input-field"
          >
            <option value="Africa/Casablanca">Africa/Casablanca (GMT+1)</option>
            <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
            <option value="Europe/London">Europe/London (GMT+0)</option>
            <option value="America/New_York">America/New_York (GMT-5)</option>
            <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Langue par défaut
          </label>
          <select
            value={settings.general.language}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, language: e.target.value }
            })}
            className="input-field"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Format de date
          </label>
          <select
            value={settings.general.dateFormat}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, dateFormat: e.target.value }
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
            value={settings.general.currency}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, currency: e.target.value }
            })}
            className="input-field"
          >
            <option value="MAD">Dirham Marocain (DH)</option>
            <option value="EUR">Euro (€)</option>
            <option value="USD">Dollar US ($)</option>
            <option value="GBP">Livre Sterling (£)</option>
            <option value="CHF">Franc Suisse (CHF)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Longueur minimale du mot de passe
          </label>
          <input
            type="number"
            min="6"
            max="20"
            value={settings.security.passwordMinLength}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, passwordMinLength: parseInt(e.target.value) }
            })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timeout de session (minutes)
          </label>
          <input
            type="number"
            min="5"
            max="480"
            value={settings.security.sessionTimeout}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
            })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tentatives de connexion max
          </label>
          <input
            type="number"
            min="3"
            max="10"
            value={settings.security.loginAttempts}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, loginAttempts: parseInt(e.target.value) }
            })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Durée de verrouillage (minutes)
          </label>
          <input
            type="number"
            min="5"
            max="60"
            value={settings.security.accountLockoutDuration}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, accountLockoutDuration: parseInt(e.target.value) }
            })}
            className="input-field"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Caractères spéciaux requis</h4>
            <p className="text-sm text-gray-500">Exiger des caractères spéciaux dans les mots de passe</p>
          </div>
          <button
            onClick={() => setSettings({
              ...settings,
              security: { ...settings.security, passwordRequireSpecialChars: !settings.security.passwordRequireSpecialChars }
            })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.security.passwordRequireSpecialChars ? 'bg-teal-primary' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.security.passwordRequireSpecialChars ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Authentification à deux facteurs</h4>
            <p className="text-sm text-gray-500">Activer l'A2F pour tous les utilisateurs</p>
          </div>
          <button
            onClick={() => setSettings({
              ...settings,
              security: { ...settings.security, twoFactorAuth: !settings.security.twoFactorAuth }
            })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.security.twoFactorAuth ? 'bg-teal-primary' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {[
          { key: 'emailNotifications', label: 'Notifications par email', desc: 'Recevoir les notifications par email' },
          { key: 'smsNotifications', label: 'Notifications SMS', desc: 'Recevoir les notifications par SMS' },
          { key: 'pushNotifications', label: 'Notifications push', desc: 'Recevoir les notifications push dans le navigateur' },
          { key: 'vacationApproval', label: 'Approbations de congés', desc: 'Notifications pour les demandes de congés' },
          { key: 'systemAlerts', label: 'Alertes système', desc: 'Notifications pour les événements système' },
          { key: 'weeklyReports', label: 'Rapports hebdomadaires', desc: 'Recevoir un résumé hebdomadaire par email' }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between">
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
                settings.notifications[item.key as keyof typeof settings.notifications] ? 'bg-teal-primary' : 'bg-gray-200'
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

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <CloudIcon className="h-5 w-5 text-blue-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Dernière sauvegarde: {new Date(settings.backup.lastBackup).toLocaleString('fr-FR')}
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Statut: Réussie - Toutes les données ont été sauvegardées avec succès
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fréquence de sauvegarde
          </label>
          <select
            value={settings.backup.backupFrequency}
            onChange={(e) => setSettings({
              ...settings,
              backup: { ...settings.backup, backupFrequency: e.target.value }
            })}
            className="input-field"
          >
            <option value="hourly">Toutes les heures</option>
            <option value="daily">Quotidienne</option>
            <option value="weekly">Hebdomadaire</option>
            <option value="monthly">Mensuelle</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Période de rétention (jours)
          </label>
          <input
            type="number"
            min="7"
            max="365"
            value={settings.backup.retentionPeriod}
            onChange={(e) => setSettings({
              ...settings,
              backup: { ...settings.backup, retentionPeriod: parseInt(e.target.value) }
            })}
            className="input-field"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Sauvegarde automatique</h4>
            <p className="text-sm text-gray-500">Activer les sauvegardes automatiques</p>
          </div>
          <button
            onClick={() => setSettings({
              ...settings,
              backup: { ...settings.backup, autoBackup: !settings.backup.autoBackup }
            })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.backup.autoBackup ? 'bg-teal-primary' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.backup.autoBackup ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Sauvegarde cloud</h4>
            <p className="text-sm text-gray-500">Sauvegarder dans le cloud pour plus de sécurité</p>
          </div>
          <button
            onClick={() => setSettings({
              ...settings,
              backup: { ...settings.backup, cloudBackup: !settings.backup.cloudBackup }
            })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.backup.cloudBackup ? 'bg-teal-primary' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.backup.cloudBackup ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex space-x-4">
        <button 
          onClick={() => {
            if (window.confirm('Créer une sauvegarde maintenant ? Cette opération peut prendre quelques minutes.')) {
              alert('Sauvegarde en cours... Vous recevrez une notification une fois terminée.');
              // Simulation de mise à jour de la dernière sauvegarde
              setSettings(prev => ({
                ...prev,
                backup: { ...prev.backup, lastBackup: new Date().toISOString() }
              }));
            }
          }}
          className="btn-secondary"
        >
          Créer une sauvegarde maintenant
        </button>
        <button 
          onClick={() => {
            const backupDate = prompt('Entrez la date de la sauvegarde à restaurer (YYYY-MM-DD) :');
            if (backupDate) {
              if (window.confirm(`Êtes-vous sûr de vouloir restaurer la sauvegarde du ${backupDate} ? Cette action est irréversible.`)) {
                alert(`Restauration de la sauvegarde du ${backupDate} en cours... Le système redémarrera automatiquement.`);
              }
            }
          }}
          className="btn-secondary"
        >
          Restaurer une sauvegarde
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <CogIcon className="h-8 w-8 text-teal-primary mr-3" />
            Paramètres Système
          </h1>
          <p className="text-gray-600 mt-1">
            Configuration générale et paramètres avancés du système
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
                      ? 'border-teal-primary text-teal-primary'
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
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'backup' && renderBackupSettings()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
