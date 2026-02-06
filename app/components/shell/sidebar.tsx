'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useChat } from '@/app/context/chatContext'
import { useModal } from '../../context/modal/modalContext'
import { useLanguage } from '@/app/context/languageContext'
import { Archive, Pin, PinOff, Pencil, Trash2 } from 'lucide-react'

interface SideNavProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  onMobileClose?: () => void
}

type HistoryMeta = {
  pinned?: boolean
  customTitle?: string
  archived?: boolean
}

type HistoryMetaMap = Record<string, HistoryMeta>

const META_KEY = 'rundi.history.meta.v1'

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
    // ignore
  }
}

export default function SideNav({ isCollapsed, onToggleCollapse, onMobileClose }: SideNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // session dots menu
  const [openDotsForId, setOpenDotsForId] = useState<string | number | null>(null)
  const dotsMenuRef = useRef<HTMLDivElement>(null)

  // local meta (pin/rename/archive) stored in localStorage
  const [meta, setMeta] = useState<HistoryMetaMap>({})

  const pathname = usePathname()
  const router = useRouter()

  const { openModal } = useModal()
  const { chatSessions, currentSession, setCurrentSession, createNewSession, deleteSession } = useChat() as any
  const { t } = useLanguage()

  const currentPage = pathname?.split('/')[1] || 'dashboard'

  // load meta on mount
  useEffect(() => {
    setMeta(readMeta())
  }, [])

  // helper to update meta
  const updateMeta = (sessionId: string | number, patch: HistoryMeta) => {
    const key = String(sessionId)
    setMeta((prev) => {
      const next = { ...prev, [key]: { ...(prev[key] || {}), ...patch } }
      writeMeta(next)
      return next
    })
  }

  const filteredSessions = useMemo(() => {
    const list = (chatSessions || []).filter((s: any) => s.page === currentPage)


    const notArchived = list.filter((s: any) => !meta[String(s.id)]?.archived)

    // Show sessions that have messages (Chat) OR a meaningful state (Trad/Dict/Verbs)
    const withContent = notArchived.filter((s: any) => {
      const hasMessages = s.messages && s.messages.length > 0
      const hasState = s.state && Object.values(s.state).some(v => v && String(v).trim().length > 0)
      return hasMessages || hasState
    })

    const withMeta = withContent.map((s: any) => {
      const m = meta[String(s.id)]
      return {
        ...s,
        __pinned: !!m?.pinned,
        __title: (m?.customTitle?.trim() ? m.customTitle : s.title) ?? s.title,
      }
    })

    withMeta.sort((a: any, b: any) => {
      if (a.__pinned !== b.__pinned) return a.__pinned ? -1 : 1
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

    return withMeta
  }, [chatSessions, currentPage, meta])

  // ✅ Create a default area automatically (first time you land on a page with no history)
  const initRef = useRef<Record<string, boolean>>({})
  useEffect(() => {
    if (!currentPage) return
    if (initRef.current[currentPage]) return

    if (Array.isArray(chatSessions) && filteredSessions.length === 0) {
      initRef.current[currentPage] = true
      createNewSession(currentPage as any)
    }
  }, [chatSessions, filteredSessions.length, currentPage, createNewSession])

  const toggleUserMenu = () => setIsMenuOpen((v) => !v)

  // close user menu on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsMenuOpen(false)
    }
    if (isMenuOpen) document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [isMenuOpen])

  // close dots menu on outside click / escape
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (dotsMenuRef.current && !dotsMenuRef.current.contains(e.target as Node)) setOpenDotsForId(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDotsForId(null)
    }

    if (openDotsForId != null) {
      document.addEventListener('mousedown', onDown)
      document.addEventListener('keydown', onKey)
    }
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [openDotsForId])

  const handleNewChat = () => {
    // Avoid creating multiple empty sessions FOR THE SAME PAGE
    if (currentSession &&
      currentSession.page === currentPage &&
      (!currentSession.messages || currentSession.messages.length === 0) &&
      (!currentSession.state || Object.keys(currentSession.state).length === 0)) {
      if (onMobileClose) onMobileClose()
      return
    }
    createNewSession(currentPage as any)
    if (onMobileClose) onMobileClose()
  }

  // Auto-switch currentSession when changing pages via top icons
  useEffect(() => {
    if (!currentPage) return

    // If we're on a session that doesn't match the current page, 
    // try to find the latest session with content for this page, or create a new one.
    if (!currentSession || currentSession.page !== currentPage) {
      const pageSessions = (chatSessions || []).filter((s: any) => s.page === currentPage)

      const sessionWithContent = pageSessions.find((s: any) => {
        const hasMessages = s.messages && s.messages.length > 0
        const hasState = s.state && Object.values(s.state).some(v => v && String(v).trim().length > 0)
        return hasMessages || hasState
      })

      if (sessionWithContent) {
        setCurrentSession(sessionWithContent)
      } else if (pageSessions.length > 0) {
        // Fallback to latest empty if no content found
        // Sort by timestamp and take the latest
        const latest = [...pageSessions].sort((a: any, b: any) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0]
        setCurrentSession(latest)
      } else {
        // No sessions for this page yet, start a fresh one
        createNewSession(currentPage as any)
      }
    }
  }, [currentPage, chatSessions.length])

  const handleSessionClick = (session: any) => {
    setCurrentSession(session)
    setOpenDotsForId(null)
    if (onMobileClose) onMobileClose()
  }

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const handleMenuItemClick = (item: 'settings' | 'download' | 'help') => {
    setIsMenuOpen(false)
    openModal(item)
    if (onMobileClose) onMobileClose()
  }

  const onPinToggle = (session: any) => {
    const key = String(session.id)
    const pinned = !!meta[key]?.pinned
    updateMeta(session.id, { pinned: !pinned })
    setOpenDotsForId(null)
  }

  const onRename = (session: any) => {
    const currentTitle = meta[String(session.id)]?.customTitle?.trim() || session.__title || session.title || ''
    const nextTitle = window.prompt(t.renamePrompt, currentTitle)?.trim()
    if (!nextTitle) return
    updateMeta(session.id, { customTitle: nextTitle })
    setOpenDotsForId(null)

    try {
      if (typeof (useChat() as any).renameSession === 'function') {
        ; (useChat() as any).renameSession(session.id, nextTitle)
      }
    } catch {
      // ignore
    }
  }

  const onArchiver = (session: any) => {
    updateMeta(session.id, { archived: true })
    setOpenDotsForId(null)
    if (currentSession?.id === session.id) setCurrentSession(null)
  }

  const onDelete = (session: any) => {
    setOpenDotsForId(null)
    deleteSession(session.id)

    const key = String(session.id)
    setMeta((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      writeMeta(next)
      return next
    })
  }

  return (
    <aside
      className={`flex h-screen flex-col bg-slate-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-r border-slate-200 dark:border-gray-800 transition-all duration-300 ${isCollapsed ? 'lg:w-16' : 'w-[280px]'
        }`}
    >
      {/* ✅ Mobile header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center">
            <span className="text-slate-900 dark:text-gray-100 font-semibold text-lg tracking-tight">Rundi AI</span>
          </div>
        )}
        <button
          type="button"
          onClick={onMobileClose}
          className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
          aria-label="Close sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:flex items-center justify-between px-4 py-4">
        {!isCollapsed && (
          <div className="flex items-center">
            <span className="text-slate-900 dark:text-gray-100 font-semibold tracking-tight">Rundi AI</span>
          </div>
        )}

        <button
          type="button"
          onClick={onToggleCollapse}
          className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect height="18" width="18" x="3" y="3" rx="2" />
              <line x1="9" x2="9" y1="3" y2="21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect height="18" width="18" x="3" y="3" rx="2" />
              <line x1="9" x2="9" y1="3" y2="21" />
              <polyline points="7 12 5 10 3 12" />
            </svg>
          )}
        </button>
      </div>

      {/* New interface */}
      <div className="px-4 pb-3 mt-2">
        {isCollapsed ? (
          <button
            type="button"
            onClick={handleNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#147E4E] hover:bg-[#0F6A3F] dark:bg-[#147E4E] dark:hover:opacity-70 p-3 hover:opacity-90 transition-all duration-200 cursor-pointer"
            aria-label={t.newInterface}
            title={t.newInterface}
          >
            <span className="text-lg text-white">+</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNewChat}
            className="flex w-full items-center justify-center gap-2 rounded dark:bg-green-600 bg-primary hover:bg-primary/90 dark:hover:opacity-90 px-4 py-3 text-sm font-medium hover:opacity-90 hover:shadow-md dark:hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <span className="text-base text-white">+</span>
            <span className="text-white">{t.newInterface}</span>
          </button>
        )}
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {!isCollapsed ? (
          <div className="space-y-1">
            <div className="px-2 py-3">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t.recentSearches}
              </h3>
            </div>

            {filteredSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-500 dark:text-gray-400">
                <p className="text-sm font-medium text-center">{t.noHistory}</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredSessions.map((session: any) => {
                  const isActive = currentSession?.id === session.id
                  const isPinned = !!meta[String(session.id)]?.pinned

                  return (
                    <div
                      key={session.id}
                      onClick={() => handleSessionClick(session)}
                      className={`
                        group relative flex items-center gap-3 rounded p-1 cursor-pointer transition-all duration-150
                        ${isActive
                          ? 'bg-[#147E4E]/10 dark:bg-[#147E4E]/20 p-2'
                          : 'hover:bg-slate-200/50 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">{session.__title}</p>

                          {isPinned && (
                            <span
                              className="inline-flex items-center justify-center rounded-md bg-[#147E4E]/15 text-[#147E4E] dark:bg-[#147E4E]/20"
                              title="Pinned"
                            >
                              <Pin className="h-3.5 w-3.5 fill-[#147E4E]" />
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.preview}</p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500">{formatTime(session.timestamp)}</span>

                        {/* dots button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenDotsForId((prev) => (prev === session.id ? null : session.id))
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-gray-200 dark:hover:bg-[#2A2A2A] transition-opacity cursor-pointer"
                          aria-label="History actions"
                          title="Actions"
                        >
                          <svg className="w-4 h-4 text-gray-500 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="5" cy="12" r="1.8" />
                            <circle cx="12" cy="12" r="1.8" />
                            <circle cx="19" cy="12" r="1.8" />
                          </svg>
                        </button>

                        {/* popup */}
                        {openDotsForId === session.id && (
                          <div
                            ref={dotsMenuRef}
                            className="absolute right-3 top-[54px] w-52 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2A2A2A] rounded shadow-lg overflow-hidden z-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => onRename(session)}
                              className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                            >
                              <Pencil className="h-4 w-4" />
                              <span>{t.rename}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onPinToggle(session)}
                              className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[#2A2A2A] text-gray-700 dark:text-gray-200"
                            >
                              {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                              <span>{isPinned ? t.unpin : t.pin}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onArchiver(session)}
                              className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[#2A2A2A] text-gray-700 dark:text-gray-200"
                            >
                              <Archive className="h-4 w-4" />
                              <span>{t.archive}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onDelete(session)}
                              className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>{t.delete}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3 py-4">
            {filteredSessions.slice(0, 3).map((session: any) => (
              <button
                key={session.id}
                onClick={() => handleSessionClick(session)}
                className={`
                  grid h-9 w-9 place-items-center rounded-lg text-sm cursor-pointer
                  ${currentSession?.id === session.id ? 'ring-2 ring-[#147E4E]' : ''}
                  ${session.page === 'dashboard'
                    ? 'bg-[#147E4E]/15 dark:bg-[#147E4E]/20 text-[#147E4E]'
                    : session.page === 'traduction'
                      ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300'
                      : session.page === 'dictionary'
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                        : 'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300'
                  }
                `}
                title={session.__title || session.title}
              >
                {session.page.charAt(0).toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 shadow dark:border-[#2A2A2A] relative" ref={menuRef}>
        {!isCollapsed && isMenuOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-[#2A2A2A] z-50 overflow-hidden">
            <button
              onClick={() => handleMenuItemClick('settings')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-[#2A2A2A] cursor-pointer"
            >
              <span>{t.settings}</span>
            </button>

            <button
              onClick={() => handleMenuItemClick('download')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-[#2A2A2A] cursor-pointer"
            >
              <span>{t.downloadApp}</span>
            </button>

            <button
              onClick={() => {
                setIsMenuOpen(false)
                router.push('/login')
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-sm text-red-600 dark:text-red-400 cursor-pointer"
            >
              <span className="font-medium">{t.logout}</span>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={toggleUserMenu}
          className="flex items-center gap-3 w-full text-left hover:bg-gray-50 dark:hover:bg-[#2A2A2A] rounded-lg p-2 transition-colors cursor-pointer"
          aria-label="Open user menu"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#147E4E] text-white font-semibold text-sm">
            A
          </div>

          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-900 dark:text-gray-100">Amiel Nganji</span>
              <span className="text-xs text-slate-500 dark:text-gray-400">{t.account}</span>
            </div>
          )}

          {!isCollapsed && <span className="ml-auto text-slate-500 dark:text-gray-400">{isMenuOpen ? '▲' : '▼'}</span>}
        </button>
      </div>
    </aside>
  )
}
