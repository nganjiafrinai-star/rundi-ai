'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  backendId?: string
  email: string
  name: string
  image?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password?: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
  backendId: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const AUTH_DEBUG = process.env.NEXT_PUBLIC_AUTH_DEBUG === 'true'
const LOCAL_ADMIN_EMAIL = 'admin@nova.io'
const LOCAL_ADMIN_PASSWORD = 'admin123'
const LOCAL_ADMIN_BACKEND_ID = 'be4ff3ae-dc3c-49c1-b3e6-385e81d3a5dd'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [localUser, setLocalUser] = useState<User | null>(null)

  const isLoading = status === 'loading'

  // Check for OAuth session first, then fall back to local auth
  const oauthUser: User | null = session?.user
    ? {
      id: session.user.email || '',
      backendId: session.user.backendId,
      email: session.user.email || '',
      name: session.user.name || 'User',
      image: session.user.image || undefined
    }
    : null

  const user = oauthUser || localUser
  const isAuthenticated = !!user
  const backendId = session?.user?.backendId || localUser?.backendId || null

  // Load local user from localStorage on mount
  useEffect(() => {
    if (!oauthUser) {
      const stored = localStorage.getItem('rundi_user')
      if (stored) {
        try {
          setLocalUser(JSON.parse(stored))
        } catch (e) {
          localStorage.removeItem('rundi_user')
        }
      }
    }
  }, [oauthUser])

  // Email/password login function
  const login = async (email: string, password?: string) => {
    console.log('[Auth] Attempting login with email:', email)
    if (AUTH_DEBUG) {
      console.log('[Auth][debug] Login start:', {
        email,
        hasPassword: !!password,
        passwordLength: typeof password === 'string' ? password.length : 0,
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    if (normalizedEmail === LOCAL_ADMIN_EMAIL && password === LOCAL_ADMIN_PASSWORD) {
      const localAdmin: User = {
        id: LOCAL_ADMIN_BACKEND_ID,
        backendId: LOCAL_ADMIN_BACKEND_ID,
        email: LOCAL_ADMIN_EMAIL,
        name: 'Admin'
      }

      setLocalUser(localAdmin)
      localStorage.setItem('rundi_user', JSON.stringify(localAdmin))
      router.push('/')
      return
    }

    // Authenticate with backend to get real user ID
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          password: password || ''
        })
      })

      const data = await response.json()
      console.log('[Auth] Login response:', data)
      if (AUTH_DEBUG) {
        console.log('[Auth][debug] Login response meta:', {
          ok: response.ok,
          status: response.status,
          keys: Object.keys(data || {}),
        })
      }

      if (!response.ok) {
        let detailsMessage = ''
        if (typeof data.details === 'string') {
          try {
            const parsed = JSON.parse(data.details)
            detailsMessage = parsed?.detail || data.details
          } catch {
            detailsMessage = data.details
          }
        } else if (data.details && typeof data.details === 'object') {
          detailsMessage = data.details.detail || JSON.stringify(data.details)
        }

        throw new Error(detailsMessage || data.error || 'Authentication failed')
      }

      // Extract user ID from backend response
      const backendUserId =
        data.id ||
        data.user_id ||
        data.user?.id ||
        data.data?.id ||
        data.data?.user_id ||
        data.profile?.id ||
        email.trim().toLowerCase()
      if (AUTH_DEBUG) {
        console.log('[Auth][debug] Resolved backend user ID:', backendUserId)
      }

      if (!backendUserId) {
        throw new Error('Backend did not return a user ID')
      }

      const newUser: User = {
        id: backendUserId,
        backendId: backendUserId,
        email: data.email || normalizedEmail,
        name: data.name || normalizedEmail.split('@')[0]
      }

      console.log('[Auth] Setting authenticated user:', newUser)
      setLocalUser(newUser)
      localStorage.setItem('rundi_user', JSON.stringify(newUser))
      router.push('/')
    } catch (error) {
      console.error('[Auth] Authentication failed:', error)
      throw error
    }
  }

  const register = async (email: string, password: string, name?: string) => {
    throw new Error('Registration is disabled. Use admin@nova.io / admin123 to log in.')
  }

  const logout = async () => {
    if (oauthUser) {
      await signOut({ callbackUrl: '/login' })
    } else {
      setLocalUser(null)
      localStorage.removeItem('rundi_user')
      router.push('/login')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated,
        isLoading,
        backendId,
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
