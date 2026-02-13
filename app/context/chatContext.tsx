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
    isArchived?: boolean
    isPinned?: boolean
    customTitle?: string
    updatedAt: Date
}

export type HistoryMeta = {
    pinned?: boolean
    customTitle?: string
    archived?: boolean
}

export type HistoryMetaMap = Record<string, HistoryMeta>

const META_KEY = 'rundi.history.meta.v1'

interface ChatContextType {
    activePage: 'dashboard' | 'traduction' | 'dictionary' | 'verbs'
    setActivePage: (page: 'dashboard' | 'traduction' | 'dictionary' | 'verbs') => void
    chatSessions: ChatSession[]
    currentSession: ChatSession | null
    setCurrentSession: (session: ChatSession | null) => void
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
    createNewSession: (page: 'dashboard' | 'traduction' | 'dictionary' | 'verbs') => ChatSession
    updateSession: (sessionId: string, updates: Partial<ChatSession>) => void
    deleteSession: (sessionId: string) => void
    archiveSession: (sessionId: string) => void
    unarchiveSession: (sessionId: string) => void
    pinSession: (sessionId: string, pinned: boolean) => void
    renameSession: (sessionId: string, title: string) => void
    meta: HistoryMetaMap
    updateMeta: (sessionId: string | number, patch: HistoryMeta) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

function readMeta(): HistoryMetaMap {
    if (typeof window === 'undefined') return {}
    try {
        const raw = window.localStorage.getItem(META_KEY)
        return raw ? (JSON.parse(raw) as HistoryMetaMap) : {}
    } catch {
        return {}
    }
}

function writeMeta(next: HistoryMetaMap) {
    if (typeof window === 'undefined') return
    try {
        window.localStorage.setItem(META_KEY, JSON.stringify(next))
    } catch {
    }
}

export function ChatProvider({ children }: { children: ReactNode }) {
    const [activePage, setActivePage] = useState<'dashboard' | 'traduction' | 'dictionary' | 'verbs'>('dashboard')
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
    const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
    const [hasHydrated, setHasHydrated] = useState(false)
    const [meta, setMeta] = useState<HistoryMetaMap>({})


    useEffect(() => {
        const loadFromStorage = () => {
            try {
                const initialMeta = readMeta()
                setMeta(initialMeta)

                const saved = localStorage.getItem('chat-sessions')
                if (saved) {
                    const parsed = JSON.parse(saved)

                    const sessions = parsed.map((s: any) => {
                        const m = initialMeta[String(s.id)] || {}
                        return {
                            ...s,
                            isArchived: s.isArchived ?? m.archived,
                            isPinned: s.isPinned ?? m.pinned,
                            customTitle: s.customTitle ?? m.customTitle,
                            timestamp: new Date(s.timestamp),
                            updatedAt: new Date(s.updatedAt || s.timestamp),
                            messages: (s.messages || []).map((m: any) => ({
                                ...m,
                                timestamp: new Date(m.timestamp)
                            }))
                        }
                    })
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

    const updateMeta = (sessionId: string | number, patch: HistoryMeta) => {
        const key = String(sessionId)
        setMeta((prev) => {
            const next = { ...prev, [key]: { ...(prev[key] || {}), ...patch } }
            writeMeta(next)
            return next
        })
    }

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

        const updatedSession: ChatSession = {
            ...currentSession,
            messages: [...currentSession.messages, newMessage],
            preview: newMessage.content.substring(0, 50) + (newMessage.content.length > 50 ? '...' : ''),
            timestamp: currentSession.timestamp, // Keep creation timestamp
            updatedAt: new Date() // Update activity timestamp
        }

        setCurrentSession(updatedSession)
        setChatSessions(prev => {
            const filtered = prev.filter(s => s.id !== currentSession.id)
            return [updatedSession, ...filtered]
        })
    }

    const createNewSession = (page: 'dashboard' | 'traduction' | 'dictionary' | 'verbs'): ChatSession => {
        const sessionId = Date.now().toString()
        const newSession: ChatSession = {
            id: sessionId,
            title: `New ${page.charAt(0).toUpperCase() + page.slice(1)} Chat`,
            page,
            timestamp: new Date(),
            updatedAt: new Date(),
            messages: [],
            preview: 'New conversation started...',
            state: { chatHistory: [], selectedCategory: '' }
        }

        const updatedSessions = [newSession, ...chatSessions]
        setChatSessions(updatedSessions)
        setCurrentSession(newSession)
        setActivePage(page)
        return newSession
    }

    const updateSession = (sessionId: string, updates: Partial<ChatSession>) => {
        setChatSessions((prev) => {
            const session = prev.find(s => s.id === sessionId)
            if (!session) return prev
            const updated = { ...session, ...updates, updatedAt: updates.updatedAt || new Date() }
            const filtered = prev.filter(s => s.id !== sessionId)
            return [updated, ...filtered]
        })
        if (currentSession?.id === sessionId) {
            setCurrentSession((prev) => (prev ? { ...prev, ...updates, updatedAt: updates.updatedAt || new Date() } : null))
        }
    }

    const deleteSession = (sessionId: string) => {
        const updatedSessions = chatSessions.filter((session) => session.id !== sessionId)
        setChatSessions(updatedSessions)

        setMeta((prev) => {
            const next = { ...prev }
            delete next[String(sessionId)]
            writeMeta(next)
            return next
        })

        if (currentSession?.id === sessionId) {
            if (updatedSessions.length > 0) {
                setCurrentSession(updatedSessions[0])
                setActivePage(updatedSessions[0].page)
            } else {
                setCurrentSession(null)
            }
        }
    }

    const archiveSession = (sessionId: string) => {
        updateSession(sessionId, { isArchived: true })
        updateMeta(sessionId, { archived: true })
    }

    const unarchiveSession = (sessionId: string) => {
        updateSession(sessionId, { isArchived: false })
        updateMeta(sessionId, { archived: false })
    }

    const pinSession = (sessionId: string, isPinned: boolean) => {
        updateSession(sessionId, { isPinned })
        updateMeta(sessionId, { pinned: isPinned })
    }

    const renameSession = (sessionId: string, customTitle: string) => {
        updateSession(sessionId, { customTitle })
        updateMeta(sessionId, { customTitle })
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
                archiveSession,
                unarchiveSession,
                pinSession,
                renameSession,
                meta,
                updateMeta
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