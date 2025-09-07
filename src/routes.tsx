import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { SessionPage } from './pages/session/SessionPage';
import { CitationDetailPage } from './pages/citations/CitationDetailPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleGuard } from './components/auth/RoleGuard';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register', 
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'session',
        element: <SessionPage />,
      },
      {
        path: 'citations/:id',
        element: <CitationDetailPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'admin/*',
        element: (
          <RoleGuard allowedRoles={['admin']}>
            <AdminDashboard />
          </RoleGuard>
        ),
      },
    ],
  },
]);