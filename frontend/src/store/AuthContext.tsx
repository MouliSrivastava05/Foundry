import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

interface User {
  id: number
  name: string
  email: string
  created_at: string
}


interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  isDemo: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  enableDemoMode: () => void
  disableDemoMode: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(localStorage.getItem('isDemo') === 'true')

  useEffect(() => {
    const fetchUser = async () => {
      if (isDemo) {
        setUser({
          id: -1,
          name: 'Demo Account',
          email: 'demo@foundry.ai',
          created_at: new Date().toISOString(),
        })
        setLoading(false)
        return
      }

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await api.get('/auth/me')
        setUser(response.data)
      } catch (err) {
        console.error('Failed to restore auth session', err)
        localStorage.removeItem('token')
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [token, isDemo])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setIsDemo(false)
    localStorage.removeItem('isDemo')
    try {
      const response = await api.post('/auth/login', { email, password })
      const { access_token } = response.data
      localStorage.setItem('token', access_token)
      setToken(access_token)
      
      const meResponse = await api.get('/auth/me')
      setUser(meResponse.data)
    } catch (err) {
      setLoading(false)
      throw err
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true)
    setIsDemo(false)
    localStorage.removeItem('isDemo')
    try {
      await api.post('/auth/signup', { name, email, password })
      // Auto login after successful signup
      const loginResponse = await api.post('/auth/login', { email, password })
      const { access_token } = loginResponse.data
      localStorage.setItem('token', access_token)
      setToken(access_token)
      
      const meResponse = await api.get('/auth/me')
      setUser(meResponse.data)
    } catch (err) {
      setLoading(false)
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('isDemo')
    setToken(null)
    setUser(null)
    setIsDemo(false)
  }

  const enableDemoMode = () => {
    localStorage.setItem('isDemo', 'true')
    localStorage.removeItem('token')
    setToken(null)
    setIsDemo(true)
    setUser({
      id: -1,
      name: 'Demo Account',
      email: 'demo@foundry.ai',
      created_at: new Date().toISOString(),
    })
  }

  const disableDemoMode = () => {
    localStorage.removeItem('isDemo')
    setIsDemo(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isDemo,
        login,
        signup,
        logout,
        enableDemoMode,
        disableDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
