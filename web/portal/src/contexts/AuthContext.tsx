import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

interface User {
  id: string
  email: string
  role: 'admin' | 'officer' | 'user'
  firstName?: string
  lastName?: string
  badgeNumber?: string
  department?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const userData = localStorage.getItem('userData')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } catch (error) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userData')
      }
    }
    
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${baseURL}/auth/v1/auth/login`, {
        email,
        password
      })

      const { user: userData, accessToken } = response.data.data
      
      setUser(userData)
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('userData', JSON.stringify(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      
    } catch (error) {
      throw new Error('Invalid credentials')
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userData')
    delete axios.defaults.headers.common['Authorization']
  }

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}