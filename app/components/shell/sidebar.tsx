'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import { useChat } from '@/app/context/chatContext'
import { useModal } from '../../context/modal/modalContext'
import { useLanguage } from '@/app/context/languageContext'
import { useAuth } from '@/app/context/authContext'
import { Archive, Pin, PinOff, Pencil, Trash2, LogOut } from 'lucide-react'

interface SideNavProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  onMobileClose?: () => void
}

export default function SideNav({ isCollapsed, onToggleCollapse, onMobileClose }: SideNavProps) {
  const pathname = usePathname()
  const { t } = useLanguage()
  const { user, logout } = useAuth()
  const { openModal } = useModal()

  const {
    chatSessions,
    currentSession,
    setCurrentSession,
    createNewSession,
    deleteSession,
    archiveSession,
    pinSession,
    renameSession,
    updateSession,
    meta,
    updateMeta,
  } = useChat()

  // user menu
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // session dots menu
  const [openDotsForId, setOpenDotsForId] = useState<string | number | null>(null)
  const [dotsMenuPos, setDotsMenuPos] = useState({ top: 0, left: 0 })
  const [mounted, setMounted] = useState(false)
  const dotsMenuRef = useRef<HTMLDivElement>(null)
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null)

  const currentPage = pathname?.split('/')[1] || 'dashboard'

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (openDotsForId === null) return
    const updatePosition = () => {
      if (activeTriggerRef.current) {
        const rect = activeTriggerRef.current.getBoundingClientRect()
        setDotsMenuPos({ top: rect.top, left: rect.right })
      }
    }
    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [openDotsForId])
  const FIXED_BACKEND_USER_ID = 'be4ff3ae-dc3c-49c1-b3e6-385e81d3a5dd'

  const filteredSessions = useMemo(() => {
    const list = (chatSessions || []).filter((s: any) => s.page === currentPage)

    const notArchived = list.filter((s: any) => {
      const localArchived = !!meta[String(s.id)]?.archived
      const storeArchived = !!s.isArchived
      return !(storeArchived || localArchived)
    })

    const withContent = notArchived.filter((s: any) => {
      const hasMessages = s.messages && s.messages.length > 0
      const hasState = s.state && Object.values(s.state).some((v: any) => v && String(v).trim().length > 0)
      return hasMessages || hasState
    })

    const processed = withContent.map((s: any) => {
      const localPinned = !!meta[String(s.id)]?.pinned
      const storePinned = !!s.isPinned
      const localTitle = meta[String(s.id)]?.customTitle?.trim()
      const storeTitle = s.customTitle?.trim()
      const history = Array.isArray(s?.state?.chatHistory) ? s.state.chatHistory : []

      // Find the first meaningful bot message for the title
      const firstBotMessage = history.find((m: any) => m?.sender === 'Rundi AI' && m?.text?.trim())
      const lastBotMessage = [...history].reverse().find((m: any) => m?.sender === 'Rundi AI' && m?.text?.trim())

      const botPreview = lastBotMessage
        ? `${String(lastBotMessage.text).substring(0, 50)}${String(lastBotMessage.text).length > 50 ? '...' : ''}`
        : String(s.preview || '').replace(/^Rundi AI:\s*/i, '')

      // Priority: Custom Title -> Bot's First Message -> Default Title
      let displayTitle = (storeTitle || localTitle || s.title) ?? s.title
      if (!storeTitle && !localTitle && firstBotMessage) {
        displayTitle = firstBotMessage.text.substring(0, 30) + (firstBotMessage.text.length > 30 ? '...' : '')
      }

      return {
        ...s,
        __pinned: storePinned || localPinned,
        __title: displayTitle,
        __preview: botPreview,
      }
    })

    processed.sort((a: any, b: any) => {
      if (a.__pinned !== b.__pinned) return a.__pinned ? -1 : 1
      const timeA = new Date(a.updatedAt || a.timestamp).getTime()
      const timeB = new Date(b.updatedAt || b.timestamp).getTime()
      return timeB - timeA
    })

    return processed
  }, [chatSessions, currentPage, meta])

  const initRef = useRef<Record<string, boolean>>({})
  useEffect(() => {
    if (!currentPage) return
    if (initRef.current[currentPage]) return

    if (Array.isArray(chatSessions) && filteredSessions.length === 0) {
      initRef.current[currentPage] = true
      createNewSession(currentPage as any)
    }
  }, [chatSessions, filteredSessions.length, currentPage, createNewSession])

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (menuRef.current && !menuRef.current.contains(target)) setIsMenuOpen(false)
    }
    if (isMenuOpen) document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [isMenuOpen])

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

  const handleNewChat = async () => {
    const userID = FIXED_BACKEND_USER_ID

    if (
      currentSession &&
      currentSession.page === currentPage &&
      (!currentSession.messages || currentSession.messages.length === 0) &&
      (!currentSession.state || Object.keys(currentSession.state).length === 0)
    ) {
      if (onMobileClose) onMobileClose()
      return
    }

    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userID,
          first_message: "New session"
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to create backend session")
      }

      const backendSessionId = data.session_id || data.id || data?.data?.session_id
      // Even if backendSessionId is null (e.g. fresh start), we proceed

      const newSession = createNewSession(currentPage as any)
      if (newSession) {
        updateSession(newSession.id, {
          state: {
            chatHistory: [],
            selectedCategory: (t as any)[currentPage] || 'Global',
            backendSessionId: backendSessionId || null,
          }
        })
        setCurrentSession(newSession)
      }

    } catch (err: any) {
      console.error("New chat error:", err)
      alert(err?.message || 'Failed to create backend session')
    }

    if (onMobileClose) onMobileClose()
  }

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

  const onPinToggle = async (session: any) => {
    const nextPinned = !(session.isPinned || meta[String(session.id)]?.pinned)
    try {
      await pinSession(session.id, nextPinned)
      setOpenDotsForId(null)
    } catch {
      // ignore
    }
  }

  const onRename = async (session: any) => {
    const currentTitle =
      session.customTitle?.trim() ||
      meta[String(session.id)]?.customTitle?.trim() ||
      session.__title ||
      session.title ||
      ''
    const nextTitle = window.prompt(t.renamePrompt, currentTitle)?.trim()
    if (!nextTitle) return

    try {
      await renameSession(session.id, nextTitle)
      setOpenDotsForId(null)
    } catch {
      // ignore
    }
  }

  const onArchiver = async (session: any) => {
    try {
      await archiveSession(session.id)
      setOpenDotsForId(null)
      if (currentSession?.id === session.id) setCurrentSession(null)
    } catch {
      // ignore
    }
  }

  const onDelete = async (session: any) => {
    const ok = window.confirm((t as any).deleteConfirm ?? 'Delete this conversation?')
    if (!ok) return

    setOpenDotsForId(null)
    try {
      await deleteSession(session.id)
      if (currentSession?.id === session.id) setCurrentSession(null)
    } catch {
      // ignore
    }
  }

  const newInterfaceRadius = isCollapsed ? 'rounded-full' : 'rounded'
  const userProfileRadius = isCollapsed ? 'rounded-full' : 'rounded-lg'

  return (
    <aside
      className={`flex h-screen flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ${isCollapsed ? 'lg:w-16' : 'w-[280px]'
        }`}
    >
      {/*  Mobile header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center">
            <span className="text-sidebar-foreground font-semibold text-lg tracking-tight">Rundi AI</span>
          </div>
        )}
        <button
          type="button"
          onClick={onMobileClose}
          className="rounded-md p-2 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-pointer"
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
            <span className="text-sidebar-foreground font-semibold tracking-tight">Rundi AI</span>
          </div>
        )}

        <button
          type="button"
          onClick={onToggleCollapse}
          className="rounded-md p-2 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-pointer"
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

      {/* New interface collapsed */}
      <div className="px-4 pb-3 mt-2">
        {isCollapsed ? (
          <button
            type="button"
            onClick={handleNewChat}
            className={`flex items-center justify-center ${newInterfaceRadius} bg-[#147e4e] hover:opacity-90 dark:bg-[#147e4e] dark:hover:opacity-70 transition-all duration-200 cursor-pointer w-10 h-10 mx-auto`}
            aria-label={t.newInterface}
            title={t.newInterface}
          >
            <span className="text-lg text-white">+</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNewChat}
            className={`flex w-full items-center justify-center gap-2 ${newInterfaceRadius} bg-[#147e4e] hover:opacity-90 dark:bg-[#147e4e] dark:hover:opacity-90 px-4 py-3 text-sm font-medium hover:shadow-md dark:hover:shadow-lg transition-all duration-200 cursor-pointer`}
          >
            <span className="text-base text-white">+</span>
            <span className="text-white">{t.newInterface}</span>
          </button>
        )}
      </div>

      {/* History */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-2"
        onScroll={() => {
          if (isMenuOpen) setIsMenuOpen(false)
        }}
      >
        {!isCollapsed ? (
          <div className="space-y-1">
            <div className="px-2 py-3">
              <h3 className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                {t.recentSearches}
              </h3>
            </div>

            {filteredSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-sidebar-foreground/50">
                <p className="text-sm font-medium text-center">{t.noHistory}</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredSessions.map((session: any) => {
                  const isActive = currentSession?.id === session.id
                  const isPinned = !!(session.isPinned || meta[String(session.id)]?.pinned)

                  return (
                    <div
                      key={session.id}
                      onClick={() => handleSessionClick(session)}
                      className={`
                        group relative flex items-center gap-3 rounded-xl p-2 cursor-pointer transition-all duration-200
                        ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border shadow-sm' : 'hover:bg-sidebar-accent/50 dark:hover:bg-sidebar-accent/70 text-sidebar-foreground'}
                      `}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={[
                              'text-sm font-medium transition-all duration-200',
                              'focus-visible:outline-none active:outline-none focus:ring-0 active:ring-0 outline-none border-none',
                              isActive
                                ? 'text-sidebar-accent-foreground'
                                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:translate-y-[-1px]',
                            ].join(' ')}
                          >
                            {session.__title}
                          </p>

                          {isPinned && (
                            <span
                              className="inline-flex items-center justify-center rounded-md bg-sidebar-accent text-sidebar-accent-foreground"
                              title="Pinned"
                            >
                              <Pin className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-sidebar-foreground/50 truncate">{session.__preview || session.preview}</p>
                      </div>

                      <div className="flex flex-col items-end gap-2">

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            activeTriggerRef.current = e.currentTarget
                            setOpenDotsForId((prev) => (prev === session.id ? null : session.id))
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-sidebar-accent transition-opacity cursor-pointer"
                          aria-label="History actions"
                          title="Actions"
                        >
                          <svg className="w-4 h-4 text-sidebar-foreground/50 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="5" cy="12" r="1.8" />
                            <circle cx="12" cy="12" r="1.8" />
                            <circle cx="19" cy="12" r="1.8" />
                          </svg>
                        </button>

                        {openDotsForId === session.id && mounted && createPortal(
                          <div
                            ref={dotsMenuRef}
                            className="fixed w-52 bg-card dark:bg-popover border border-border dark:border-border rounded shadow-lg overflow-hidden z-[9999]"
                            style={{
                              bottom: `calc(100vh - ${dotsMenuPos.top - 4}px)`,
                              left: `${dotsMenuPos.left - 208}px`,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => { onRename(session); setOpenDotsForId(null); }}
                              className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm hover:bg-sidebar-accent text-sidebar-foreground"
                            >
                              <Pencil className="h-4 w-4" />
                              <span>{t.rename}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => { onPinToggle(session); setOpenDotsForId(null); }}
                              className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm hover:bg-sidebar-accent text-sidebar-foreground"
                            >
                              {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                              <span>{isPinned ? t.unpin : t.pin}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => { onArchiver(session); setOpenDotsForId(null); }}
                              className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm hover:bg-sidebar-accent text-sidebar-foreground"
                            >
                              <Archive className="h-4 w-4" />
                              <span>{t.archive}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => { onDelete(session); setOpenDotsForId(null); }}
                              className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>{t.delete}</span>
                            </button>
                          </div>,
                          document.body
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
                  ${currentSession?.id === session.id ? 'ring-2 ring-sidebar-ring' : ''}
                  ${session.page === 'dashboard'
                    ? 'bg-card dark:bg-popover text-sidebar-foreground border border-sidebar-border'
                    : session.page === 'traduction'
                      ? 'bg-card dark:bg-popover text-sidebar-foreground border border-sidebar-border'
                      : session.page === 'dictionary'
                        ? 'bg-card dark:bg-popover text-sidebar-foreground border border-sidebar-border'
                        : 'bg-card dark:bg-popover text-sidebar-foreground border border-sidebar-border'
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

      <div className="p-4 shadow relative" ref={menuRef}>
        {isMenuOpen && (
          <div
            className={`
              absolute bottom-full mb-2 z-50 overflow-hidden
              bg-card dark:bg-popover
              border border-sidebar-border
              rounded-lg shadow-lg
              ${isCollapsed ? 'left-14 w-56' : 'left-0 right-0 mx-4'}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => handleMenuItemClick('settings')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-sidebar-accent transition-colors text-sm text-sidebar-foreground border-b border-sidebar-border cursor-pointer"
            >
              <span>{t.settings}</span>
            </button>

            <button
              onClick={() => handleMenuItemClick('download')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-sidebar-accent transition-colors text-sm text-sidebar-foreground border-b border-sidebar-border cursor-pointer"
            >
              <span>{t.downloadApp}</span>
            </button>

            <button
              onClick={() => {
                setIsMenuOpen(false)
                logout()
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-sm text-red-600 dark:text-red-400 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">{t.logout}</span>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsMenuOpen((v) => !v)}
          className={`
            flex items-center gap-3 w-full text-left hover:bg-sidebar-accent transition-colors cursor-pointer
            ${userProfileRadius}
            ${isCollapsed ? 'w-10 h-10 p-0 justify-center mx-auto' : 'p-2'}
          `}
          aria-label="Open user menu"
          title={user?.name || 'User'}
        >
          <div
            className={`
              flex h-8 w-8 items-center justify-center bg-[#147e4e] text-white font-semibold text-sm
              ${isCollapsed ? 'rounded-full' : 'rounded-full'}
            `}
          >
            {user?.name?.charAt(0) || 'U'}
          </div>

          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-sidebar-foreground truncate max-w-[150px]">
                {user?.name || 'User'}
              </span>
              <span className="text-xs text-sidebar-foreground/50 truncate max-w-[150px]">
                {user?.email || (t as any).account}
              </span>
            </div>
          )}

          {!isCollapsed && <span className="ml-auto text-sidebar-foreground/50">{isMenuOpen ? '▲' : '▼'}</span>}
        </button>
      </div>
    </aside>
  )
}
