'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role?: 'USER' | 'ADMIN'
  avatar?: string
  provider?: 'email' | 'google' | 'facebook'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: {
    name: string
    email: string
    password: string
    phone?: string
    address?: string
  }) => Promise<boolean>
  loginWithSocial: (provider: 'google' | 'facebook') => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error('Failed to parse user data:', error)
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      }
    }
    
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Simple validation for demo
      if (email === 'admin@bgoody.com' && password === 'admin123') {
        const userData: User = {
          id: '1',
          name: 'Admin User',
          email: email,
          role: 'ADMIN',
          provider: 'email'
        }
        
        // Store auth token and user data
        localStorage.setItem('authToken', 'demo-token')
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
    phone?: string
    address?: string
  }): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock registration - in real app, this would call an API
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: 'USER',
        provider: 'email'
      }
      
      // Store auth token and user data
      localStorage.setItem('authToken', `register-token-${Date.now()}`)
      localStorage.setItem('user', JSON.stringify(newUser))
      setUser(newUser)
      
      return true
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }

  const loginWithSocial = async (provider: 'google' | 'facebook'): Promise<boolean> => {
    try {
      // Simulate social login API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock social login data
      const socialUsers = {
        google: {
          id: 'google-123',
          name: 'Google Kullanıcısı',
          email: 'user@gmail.com',
          avatar: 'https://lh3.googleusercontent.com/a/default-user',
          provider: 'google' as const
        },
        facebook: {
          id: 'fb-456',
          name: 'Facebook Kullanıcısı',
          email: 'user@facebook.com',
          avatar: 'https://graph.facebook.com/default-user/picture',
          provider: 'facebook' as const
        }
      }

      const userData = socialUsers[provider]
      
      // Store auth token and user data
      localStorage.setItem('authToken', `social-${provider}-token`)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      
      return true
    } catch (error) {
      console.error('Social login error:', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    loginWithSocial,
    logout,
    isLoading,
    isAuthenticated: !!user
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