import React, { useState, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import globalDataService from '../../services/globalDataService';
import { ROUTES } from '../../config/routes';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  targetRole: string;
  targetUserId?: string;
  data?: any;
}

const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadNotifications();
      
      // S'abonner aux nouvelles notifications
      const handleNewNotification = () => loadNotifications();
      globalDataService.subscribe('notification_added', handleNewNotification);
      
      return () => {
        globalDataService.unsubscribe('notification_added', handleNewNotification);
      };
    }
  }, [user]);

  const loadNotifications = () => {
    if (!user) return;
    
    const userNotifications = globalDataService.getNotifications({
      role: user.role,
      userId: user.id
    });
    
    setNotifications(userNotifications.slice(0, 10)); // Limiter à 10 notifications
    setUnreadCount(userNotifications.filter(n => !n.read).length);
  };

  const markAsRead = (notificationId: string) => {
    globalDataService.markNotificationAsRead(notificationId);
    loadNotifications();
  };

  const markAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        globalDataService.markNotificationAsRead(notification.id);
      }
    });
    loadNotifications();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'vacation_request':
        return '🏖️';
      case 'vacation_status_update':
        return '✨';
      case 'objective_assigned':
        return '🚀';
      case 'objective_progress_update':
        return '⚡';
      default:
        return '💼';
    }
  };

  const getNavigationPath = (notification: Notification) => {
    switch (notification.type) {
      case 'vacation_request':
      case 'vacation_status_update':
        return user?.role === 'hr' ? ROUTES.HR.VACATIONS : ROUTES.EMPLOYEE.VACATIONS;
      case 'objective_assigned':
      case 'objective_progress_update':
        return user?.role === 'manager' ? ROUTES.MANAGER.OBJECTIVES : ROUTES.EMPLOYEE.OBJECTIVES;
      default:
        return null;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    const path = getNavigationPath(notification);
    if (path) {
      setShowDropdown(false);
      navigate(path);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)}j`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`relative p-2 rounded-lg transition-all duration-200 ${
          unreadCount > 0 
            ? 'text-teal-600 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 animate-pulse' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`}
      >
        <BellIcon className={`h-6 w-6 transition-transform duration-200 ${
          unreadCount > 0 ? 'scale-110' : 'scale-100'
        }`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <span className="mr-2">🔔</span>
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-1 bg-white text-teal-600 text-xs font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-white hover:text-teal-100 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full transition-all duration-200"
                >
                  Tout marquer lu
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-2">📭</div>
                <p className="text-gray-500 font-medium">Aucune notification</p>
                <p className="text-gray-400 text-sm mt-1">Vous êtes à jour !</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const hasNavigation = getNavigationPath(notification) !== null;
                return (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-50 transition-all duration-200 ${
                      hasNavigation ? 'cursor-pointer hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50' : 'cursor-default'
                    } ${
                      !notification.read ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-teal-500' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => hasNavigation ? handleNotificationClick(notification) : markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 text-2xl p-2 rounded-full ${
                        !notification.read ? 'bg-white shadow-sm' : 'bg-gray-100'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-semibold truncate ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </p>
                          <div className="flex items-center space-x-2">
                            {hasNavigation && (
                              <span className="text-teal-500 text-xs">→</span>
                            )}
                            {!notification.read && (
                              <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-400">
                            {formatTime(notification.timestamp)}
                          </p>
                          {hasNavigation && (
                            <span className="text-xs text-teal-600 font-medium">Cliquer pour voir</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => setShowDropdown(false)}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-800 py-2 rounded-lg hover:bg-white transition-all duration-200"
              >
                Fermer les notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Overlay pour fermer le dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
