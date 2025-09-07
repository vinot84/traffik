import { useState } from 'react';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { SessionPage } from './pages/session/SessionPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { CitationDetailPage } from './pages/citations/CitationDetailPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

type Page = 'login' | 'dashboard' | 'session' | 'profile' | 'citation' | 'admin';
type UserRole = 'driver' | 'officer' | 'admin';

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('driver');

  const handleLogin = (role: UserRole = 'driver') => {
    setIsAuthenticated(true);
    setUserRole(role);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  const handleNavigation = (page: Page) => {
    if (isAuthenticated) {
      setCurrentPage(page);
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-blue-600" />
            <span className="font-semibold">Traafik</span>
          </div>
          
          <nav className="flex items-center gap-6">
            <button 
              onClick={() => handleNavigation('dashboard')}
              className={`text-sm font-medium hover:text-blue-600 ${currentPage === 'dashboard' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => handleNavigation('session')}
              className={`text-sm font-medium hover:text-blue-600 ${currentPage === 'session' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              Session
            </button>
            <button 
              onClick={() => handleNavigation('citation')}
              className={`text-sm font-medium hover:text-blue-600 ${currentPage === 'citation' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              Citations
            </button>
            <button 
              onClick={() => handleNavigation('profile')}
              className={`text-sm font-medium hover:text-blue-600 ${currentPage === 'profile' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              Profile
            </button>
            {userRole === 'admin' && (
              <button 
                onClick={() => handleNavigation('admin')}
                className={`text-sm font-medium hover:text-blue-600 ${currentPage === 'admin' ? 'text-blue-600' : 'text-gray-600'}`}
              >
                Admin
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        {currentPage === 'dashboard' && <DashboardPage userRole={userRole} onNavigate={handleNavigation} />}
        {currentPage === 'session' && <SessionPage />}
        {currentPage === 'profile' && <ProfilePage />}
        {currentPage === 'citation' && <CitationDetailPage />}
        {currentPage === 'admin' && <AdminDashboard />}
      </main>
    </div>
  );
}