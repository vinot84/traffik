import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import OfficerDashboard from './pages/OfficerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Layout from './components/Layout'

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <Layout>
      <Routes>
        <Route 
          path="/" 
          element={
            user?.role === 'admin' ? 
              <Navigate to="/admin" replace /> : 
              <Navigate to="/officer" replace />
          } 
        />
        <Route 
          path="/officer/*" 
          element={user?.role === 'officer' || user?.role === 'admin' ? <OfficerDashboard /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/admin/*" 
          element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" replace />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App