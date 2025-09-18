import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  CalendarIcon, 
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  FlagIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { UserRole } from '../../types';
import { ROUTES } from '../../utils/constants';
import Logo from '../common/Logo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, userRole }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getMenuItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          { name: 'Dashboard', href: ROUTES.ADMIN.DASHBOARD, icon: HomeIcon },
          { name: 'Utilisateurs', href: ROUTES.ADMIN.USERS, icon: UsersIcon },
          { name: 'Logs & Sécurité', href: ROUTES.ADMIN.LOGS, icon: ShieldCheckIcon },
          { name: 'Gestion Données', href: ROUTES.ADMIN.DATA, icon: DocumentTextIcon },
          { name: 'Paramètres', href: ROUTES.ADMIN.SETTINGS, icon: CogIcon },
        ];
      
      case 'hr':
        return [
          { name: 'Dashboard', href: ROUTES.HR.DASHBOARD, icon: HomeIcon },
          { name: 'Employés', href: ROUTES.HR.EMPLOYEES, icon: UsersIcon },
          { name: 'Congés', href: ROUTES.HR.VACATIONS, icon: CalendarIcon },
          { name: 'Contrats', href: ROUTES.HR.CONTRACTS, icon: DocumentTextIcon },
          { name: 'Formations', href: ROUTES.HR.TRAININGS, icon: AcademicCapIcon },
          { name: 'Rapports', href: ROUTES.HR.REPORTS, icon: ChartBarIcon },
        ];
      
      case 'manager':
        return [
          { name: 'Dashboard', href: ROUTES.MANAGER.DASHBOARD, icon: HomeIcon },
          { name: 'Mon Équipe', href: ROUTES.MANAGER.TEAM, icon: UserGroupIcon },
          { name: 'Objectifs', href: ROUTES.MANAGER.OBJECTIVES, icon: FlagIcon },
          { name: 'Planning', href: ROUTES.MANAGER.PLANNING, icon: ClockIcon },
          { name: 'Rapports', href: ROUTES.MANAGER.REPORTS, icon: ChartBarIcon },
        ];
      
      case 'employee':
        return [
          { name: 'Dashboard', href: ROUTES.EMPLOYEE.DASHBOARD, icon: HomeIcon },
          { name: 'Mon Profil', href: ROUTES.EMPLOYEE.PROFILE, icon: UsersIcon },
          { name: 'Mes Congés', href: ROUTES.EMPLOYEE.VACATIONS, icon: CalendarIcon },
          { name: 'Mes Formations', href: ROUTES.EMPLOYEE.TRAININGS, icon: AcademicCapIcon },
          { name: 'Mes Objectifs', href: ROUTES.EMPLOYEE.OBJECTIVES, icon: FlagIcon },
          { name: 'Documents', href: ROUTES.EMPLOYEE.DOCUMENTS, icon: ClipboardDocumentListIcon },
        ];
      
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 bg-white shadow-xl transform transition-all duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isHovered ? 'w-64' : 'w-16'}
          lg:${isHovered ? 'w-64' : 'w-16'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`flex items-center h-16 border-b border-gray-200 ${isHovered ? 'justify-between px-6' : 'justify-center px-2'}`}>
            <div className="flex items-center">
              <img 
                src="/teal-logo-new.svg" 
                alt="Teal Technology Services" 
                className="h-8 w-auto mr-3"
              />
              {isHovered && (
                <div>
                  <h1 className="text-base font-semibold text-gray-900">
                    Teal Technology
                  </h1>
                  <p className="text-sm text-gray-500">
                    Services
                  </p>
                </div>
              )}
            </div>
            {isHovered && (
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className={`flex-1 py-6 space-y-2 overflow-y-auto ${isHovered ? 'px-4' : 'px-2'}`}>
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? 'active' : ''} ${!isHovered ? 'justify-center px-2' : ''}`
                }
                onClick={() => {
                  // Fermer la sidebar sur mobile après navigation
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                title={!isHovered ? item.name : undefined}
              >
                <item.icon className={`h-5 w-5 ${isHovered ? 'mr-3' : ''}`} />
                {isHovered && (
                  <span className="whitespace-nowrap">{item.name}</span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          {isHovered && (
            <div className="p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                <p>© 2025 Teal Technology</p>
                <p className="mt-1">Version 1.0.0</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
