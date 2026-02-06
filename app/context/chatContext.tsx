'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export type Message = {
    id: string
    content: string
    timestamp: Date
    isUser: boolean
    page: 'dashboard' | 'traduction' | 'dictionary' | 'verbs'
}

export type ChatSession = {
    id: string
    title: string
    page: 'dashboard' | 'traduction' | 'dictionary' | 'verbs'
    timestamp: Date
    messages: Message[]
    preview: string
    state?: any
}

interface ChatContextType {
    activePage: 'dashboard' | 'traduction' | 'dictionary' | 'verbs'
    setActivePage: (page: 'dashboard' | 'traduction' | 'dictionary' | 'verbs') => void
    chatSessions: ChatSession[]
    currentSession: ChatSession | null
    setCurrentSession: (session: ChatSession | null) => void
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
    createNewSession: (page: 'dashboard' | 'traduction' | 'dictionary' | 'verbs') => void
    updateSession: (sessionId: string, updates: Partial<ChatSession>) => void
    deleteSession: (sessionId: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
    const [activePage, setActivePage] = useState<'dashboard' | 'traduction' | 'dictionary' | 'verbs'>('dashboard')
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
    const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
    const [hasHydrated, setHasHydrated] = useState(false)


    useEffect(() => {
        const loadFromStorage = () => {
            try {
                const saved = localStorage.getItem('chat-sessions')
                if (saved) {
                    const parsed = JSON.parse(saved)
                    const sessions = parsed.map((s: any) => ({
                        ...s,
                        timestamp: new Date(s.timestamp),
                        messages: s.messages.map((m: any) => ({
                            ...m,
                            timestamp: new Date(m.timestamp)
                        }))
                    }))
                    setChatSessions(sessions)


                    if (sessions.length > 0 && !currentSession) {
                        setCurrentSession(sessions[0])
                        setActivePage(sessions[0].page)
                    }
                }
            } catch (err) {
                console.error('Failed to load chat sessions:', err)
            } finally {
                setHasHydrated(true)
            }
        }

        loadFromStorage()
    }, [])


    useEffect(() => {
        if (hasHydrated) {
            try {
                localStorage.setItem('chat-sessions', JSON.stringify(chatSessions))
            } catch (err) {
                console.error('Failed to save chat sessions:', err)
            }
        }
    }, [chatSessions, hasHydrated])

    const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
        if (!currentSession) {
            createNewSession(message.page)
            return
        }

        const newMessage: Message = {
            ...message,
            id: Date.now().toString(),
            timestamp: new Date()
        }

        const updatedSession = {
            ...currentSession,
            messages: [...currentSession.messages, newMessage],
            preview: newMessage.content.substring(0, 50) + (newMessage.content.length > 50 ? '...' : ''),
            timestamp: new Date()
        }

        setCurrentSession(updatedSession)
        setChatSessions(prev =>
            prev.map(session =>
                session.id === currentSession.id ? updatedSession : session
            )
        )
    }

    const createNewSession = (page: 'dashboard' | 'traduction' | 'dictionary' | 'verbs') => {
        const sessionId = Date.now().toString()
        const newSession: ChatSession = {
            id: sessionId,
            title: `New ${page.charAt(0).toUpperCase() + page.slice(1)} Chat`,
            page,
            timestamp: new Date(),
            messages: [],
            preview: 'New conversation started...'
        }

        const updatedSessions = [newSession, ...chatSessions]
        setChatSessions(updatedSessions)
        setCurrentSession(newSession)
        setActivePage(page)
    }

    const updateSession = (sessionId: string, updates: Partial<ChatSession>) => {
        setChatSessions((prev) =>
            prev.map((session) => (session.id === sessionId ? { ...session, ...updates } : session))
        )
        if (currentSession?.id === sessionId) {
            setCurrentSession((prev) => (prev ? { ...prev, ...updates } : null))
        }
    }

    const deleteSession = (sessionId: string) => {
        const updatedSessions = chatSessions.filter((session) => session.id !== sessionId)
        setChatSessions(updatedSessions)

        if (currentSession?.id === sessionId) {
            if (updatedSessions.length > 0) {
                setCurrentSession(updatedSessions[0])
                setActivePage(updatedSessions[0].page)
            } else {
                setCurrentSession(null)
            }
        }
    }

    return (
        <ChatContext.Provider
            value={{
                activePage,
                setActivePage,
                chatSessions,
                currentSession,
                setCurrentSession,
                addMessage,
                createNewSession,
                updateSession,
                deleteSession,
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export function useChat() {
    const context = useContext(ChatContext)
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider')
    }
    return context
}