import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './components/auth/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminDashboard from './components/dashboards/AdminDashboard';
import HRDashboard from './components/dashboards/HRDashboard';
import ManagerDashboard from './components/dashboards/ManagerDashboard';
import EmployeeDashboard from './components/dashboards/EmployeeDashboard';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages Admin
import UsersPage from './components/admin/UsersPage';
import LogsPage from './components/admin/LogsPage';
import DataManagementPage from './components/admin/DataManagementPage';
import SettingsPage from './components/admin/SettingsPage';

// Pages RH
import EmployeesPage from './components/hr/EmployeesPage';
import VacationsPage from './components/hr/VacationsPage';
import ContractsPage from './components/hr/ContractsPage';
import TrainingsPage from './components/hr/TrainingsPage';
import ReportsPage from './components/hr/ReportsPage';

// Pages Manager
import TeamPage from './components/manager/TeamPage';
import ObjectivesPage from './components/manager/ObjectivesPage';
import PlanningPage from './components/manager/PlanningPage';
import ManagerReportsPage from './components/manager/ManagerReportsPage';

// Pages Employé
import ProfilePage from './components/employee/ProfilePage';
import EmployeeVacationsPage from './components/employee/VacationsPage';
import EmployeeTrainingsPage from './components/employee/TrainingsPage';
import EmployeeObjectivesPage from './components/employee/EmployeeObjectivesPage';
import DocumentsPage from './components/employee/DocumentsPage';
import EmployeeSettingsPage from './components/employee/SettingsPage';

import { ROUTES } from './utils/constants';

// Composant pour protéger les routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN} />;
};

// Composant pour rediriger vers le bon dashboard selon le rôle
const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  switch (user.role) {
    case 'admin':
      return <Navigate to={ROUTES.ADMIN.DASHBOARD} />;
    case 'hr':
      return <Navigate to={ROUTES.HR.DASHBOARD} />;
    case 'manager':
      return <Navigate to={ROUTES.MANAGER.DASHBOARD} />;
    case 'employee':
      return <Navigate to={ROUTES.EMPLOYEE.DASHBOARD} />;
    default:
      return <Navigate to={ROUTES.LOGIN} />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Routes>
            {/* Route de connexion */}
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            
            {/* Redirection du dashboard principal */}
            <Route 
              path={ROUTES.DASHBOARD} 
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              } 
            />

            {/* Routes Admin */}
            <Route 
              path={ROUTES.ADMIN.DASHBOARD} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AdminDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.ADMIN.USERS} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <UsersPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.ADMIN.LOGS} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <LogsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.ADMIN.DATA} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DataManagementPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.ADMIN.SETTINGS} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <SettingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />

            {/* Routes RH */}
            <Route 
              path={ROUTES.HR.DASHBOARD} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <HRDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.HR.EMPLOYEES} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <EmployeesPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.HR.VACATIONS} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <VacationsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.HR.CONTRACTS} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ContractsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.HR.TRAININGS} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <TrainingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.HR.REPORTS} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ReportsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />

            {/* Routes Manager */}
            <Route 
              path={ROUTES.MANAGER.DASHBOARD} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ManagerDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.MANAGER.TEAM} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <TeamPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.MANAGER.OBJECTIVES} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ObjectivesPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.MANAGER.PLANNING} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PlanningPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.MANAGER.REPORTS} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ManagerReportsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />

            {/* Routes Employé */}
            <Route 
              path={ROUTES.EMPLOYEE.DASHBOARD} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <EmployeeDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.EMPLOYEE.TRAININGS} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <EmployeeTrainingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.EMPLOYEE.OBJECTIVES} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <EmployeeObjectivesPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.EMPLOYEE.PROFILE} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProfilePage />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.EMPLOYEE.VACATIONS} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <EmployeeVacationsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.EMPLOYEE.DOCUMENTS} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DocumentsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.EMPLOYEE.SETTINGS} 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <EmployeeSettingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />

            {/* Route par défaut */}
            <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} />} />
            
            {/* Route 404 */}
            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
