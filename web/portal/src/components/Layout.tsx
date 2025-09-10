import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Shield, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Home,
  PlusCircle,
  BarChart3 
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isAdmin = user?.role === 'admin'
  
  const navigation = [
    { name: 'Dashboard', href: isAdmin ? '/admin' : '/officer', icon: Home },
    { name: 'Citations', href: '/officer/citations', icon: FileText },
    { name: 'Create Citation', href: '/officer/create-citation', icon: PlusCircle },
    ...(isAdmin ? [
      { name: 'Users', href: '/admin/users', icon: Users },
      { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ] : [])
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white shadow">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900">
                Citation Portal
              </span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href !== (isAdmin ? '/admin' : '/officer') && location.pathname.startsWith(item.href))
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 flex-shrink-0 h-6 w-6`}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <div className="h-9 w-9 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.firstName?.[0] || user?.email[0].toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email}
                  </p>
                  <p className="text-xs font-medium text-gray-500 capitalize">
                    {user?.role} {user?.badgeNumber ? `• ${user.badgeNumber}` : ''}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="ml-auto p-1 text-gray-400 hover:text-gray-600"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}