'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, name?: string) => void
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem('rundi_user')
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (e) {
          console.error('Failed to parse stored user', e)
          localStorage.removeItem('rundi_user')
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = (email: string, name: string = 'User') => {
    const newUser = {
      id: Math.random().toString(36).substring(7),
      email,
      name,
    }
    setUser(newUser)
    localStorage.setItem('rundi_user', JSON.stringify(newUser))
    router.push('/')
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('rundi_user')
    localStorage.removeItem('chat-sessions')
    router.push('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
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
