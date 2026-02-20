'use client'

import { useRef, useEffect, useState, type ChangeEvent, type KeyboardEvent, useMemo } from 'react'
import { Send, Bot, Paperclip, ChevronDown, Copy, Share2, Pencil, Check, X, ArrowDown, Image, FileText, Loader2, Square } from 'lucide-react'
import { useChat } from '@/app/context/chatContext'
import { useLanguage } from '@/app/context/languageContext'
import { ChatDomain } from '@/app/api/types/chat.types'
import ReactMarkdown from 'react-markdown'
import Footer2 from './footer2'

const CategoryIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 32 32" 
    className={className}
    fill="currentColor"
  >
    <path d="M 15 3 L 15 8 L 17 8 L 17 3 Z M 7.5 6.09375 L 6.09375 7.5 L 9.625 11.0625 L 11.0625 9.625 Z M 24.5 6.09375 L 20.9375 9.625 L 22.375 11.0625 L 25.90625 7.5 Z M 16 9 C 12.144531 9 9 12.144531 9 16 C 9 19.855469 12.144531 23 16 23 C 19.855469 23 23 19.855469 23 16 C 23 12.144531 19.855469 9 16 9 Z M 16 11 C 18.773438 11 21 13.226563 21 16 C 21 18.773438 18.773438 21 16 21 C 13.226563 21 11 18.773438 11 16 C 11 13.226563 13.226563 11 16 11 Z M 3 15 L 3 17 L 8 17 L 8 15 Z M 24 15 L 24 17 L 29 17 L 29 15 Z M 9.625 20.9375 L 6.09375 24.5 L 7.5 25.90625 L 11.0625 22.375 Z M 22.375 20.9375 L 20.9375 22.375 L 24.5 25.90625 L 25.90625 24.5 Z M 15 24 L 15 29 L 17 29 L 17 24 Z" />
  </svg>
)

const getCategoryIcon = () => CategoryIcon

const getCategoryMetadata = (categoryName: string, t: any): { domain: ChatDomain; category: string } => {
  if (categoryName === t.healthChat) return { domain: 'sante', category: 'Santé' }
  if (categoryName === t.breeding) return { domain: 'elevage', category: 'Élevage' }
  if (categoryName === t.commerce) return { domain: 'commerce', category: 'Commerce' }
  if (categoryName === t.agriculture) return { domain: 'agriculture', category: 'Agriculture' }
  return { domain: 'global', category: 'Global' }
}

type ChatMsg = {
  id: string
  content: string
  role: 'user' | 'assistant'
  createdAt: number
  timestamp: string
  category?: string
  replyTo?: string // for assistant only: the userMessageId it responds to
  status?: 'done' | 'streaming' | 'error'
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const TypingIndicator = () => (
  <div className="flex items-center gap-3 px-4 py-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#147E4E]/10 dark:bg-[#147E4E]/20">
      <Bot className="h-4 w-4 text-[#147E4E]" />
    </div>
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 bg-[#147E4E] rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-2 h-2 bg-[#147E4E] rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-2 h-2 bg-[#147E4E] rounded-full animate-bounce" />
    </div>
    <span className="text-sm text-muted-foreground">Rundi AI is thinking...</span>
  </div>
)

const MessageContent = ({ text, isBot = false }: { text: string; isBot?: boolean }) => {
  const filteredText = isBot ? text.replace(/<(think|thought|regex)>[\s\S]*?<\/\1>/gi, '').trim() : text

  return (
    <div className={`leading-relaxed ${isBot ? 'text-foreground dark:text-gray-100' : ''}`}>
      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1 mb-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-1 mb-2" {...props} />,
          li: ({ node, ...props }) => <li {...props} />,
          a: ({ node, ...props }) => (
            <a className="text-[#147E4E] hover:underline transition-all" target="_blank" rel="noopener noreferrer" {...props} />
          ),
          strong: ({ node, ...props }) => <strong className="font-bold text-foreground dark:text-white" {...props} />,
          code: ({ node, ...props }) => (
            <code className="bg-muted dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
          ),
        }}
      >
        {filteredText}
      </ReactMarkdown>
    </div>
  )
}

const TypewriterText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [index, setIndex] = useState(0)

  const cleanText = text.replace(/<(think|thought|regex)>[\s\S]*?<\/\1>/gi, '').trim()

  // Reset state when text prop changes (for regenerating messages)
  useEffect(() => {
    setDisplayedText('')
    setIndex(0)
  }, [cleanText])

  useEffect(() => {
    // Don't start typing if cleanText is empty (placeholder message)
    if (!cleanText) {
      setDisplayedText('')
      return
    }
    
    if (index < cleanText.length) {
      const timeout = setTimeout(() => {
        const chunk = cleanText.slice(index, index + 2)
        setDisplayedText((prev) => prev + chunk)
        setIndex((prev) => prev + 2)
      }, 5)
      return () => clearTimeout(timeout)
    } else if (onComplete && cleanText) {
      onComplete()
    }
  }, [index, cleanText, onComplete])

  // Show empty content if cleanText is empty (regenerating state)
  if (!cleanText) {
    return <div className="leading-relaxed text-foreground dark:text-gray-100"></div>
  }

  return <MessageContent text={displayedText} isBot={true} />
}

interface InputAreaProps {
  input: string
  setInput: (v: string) => void
  loading: boolean
  isTyping: boolean
  sendMessage: (overrideText?: string) => void
  stopBotMessage: () => void
  handleKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void
  selectedCategory: string
  setSelectedCategory: (v: string) => void
  isCategoryOpen: boolean
  setIsCategoryOpen: (v: boolean | ((v: boolean) => boolean)) => void
  categories: readonly string[]
  className?: string
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  categoryRef: React.RefObject<HTMLDivElement | null>
  placeholder?: string
  isAttachmentOpen: boolean
  setIsAttachmentOpen: (v: boolean | ((v: boolean) => boolean)) => void
  attachmentRef: React.RefObject<HTMLDivElement | null>
  onFileUpload: () => void
}

const InputArea = ({
  input,
  setInput,
  loading,
  isTyping,
  sendMessage,
  stopBotMessage,
  handleKeyDown,
  selectedCategory,
  setSelectedCategory,
  isCategoryOpen,
  setIsCategoryOpen,
  categories,
  className = '',
  textareaRef,
  categoryRef,
  placeholder = 'Andike hano...',
  isAttachmentOpen,
  setIsAttachmentOpen,
  attachmentRef,
  onFileUpload,
}: InputAreaProps) => {
  const { t } = useLanguage()

  // Handle click outside and ESC key for categories popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false)
      }
    }

    const handleEscapeKey = (event: Event) => {
      const keyboardEvent = event as globalThis.KeyboardEvent
      if (keyboardEvent.key === 'Escape') {
        setIsCategoryOpen(false)
      }
    }

    if (isCategoryOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isCategoryOpen, setIsCategoryOpen, categoryRef])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const scrollHeight = textareaRef.current.scrollHeight
      const maxHeight = 200
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`
      textareaRef.current.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden'
    }
  }, [input, textareaRef])

  return (
    <div className={`dark:bg-gray-900 ${className}`}>
      <div className="mx-auto max-w-3xl">
        <div
          className="relative rounded-2xl
            border border-border dark:border-[#147E4E]/20 
            bg-card dark:bg-black shadow-lg dark:shadow-2xl
            focus-within:ring-2 focus-within:ring-[#147E4E]/30 focus-within:border-[#147E4E]/50
            transition-all duration-200 flex flex-col backdrop-blur-sm"
        >
          <div className="p-4">
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={1}
                className="w-full resize-none bg-transparent py-2 px-0 
                        text-foreground dark:text-gray-100 focus:outline-none 
                        min-h-[40px] max-h-[200px] 
                        placeholder:text-muted-foreground"
                style={{ minHeight: '40px' }}
              />
            </div>
          </div>

          

          <div className="flex items-center justify-between px-4 pb-2">
            <div className="relative" ref={categoryRef}>
              <button
                type="button"
                onClick={() => setIsCategoryOpen((v) => !v)}
                aria-expanded={isCategoryOpen}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs
                  bg-muted/50 dark:bg-gray-800
                  text-foreground dark:text-gray-100
                  border border-border dark:border-[#147E4E]/20 cursor-pointer 
                  hover:bg-muted dark:hover:bg-[#147E4E]/20 transition-all duration-200"
              >
                <span className="truncate max-w-[100px] font-medium">{selectedCategory}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground dark:text-gray-400 transition-transform duration-200 ${
                    isCategoryOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isCategoryOpen && (
                <div
                  className={`absolute left-0 bottom-full mb-2 w-64 rounded bg-[#1a1b26]
                  border border-white/10 shadow-2xl z-50 p-3
                  transition-all duration-200
                  ${isCategoryOpen 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-2 pointer-events-none'
                  }`}
                  role="menu"
                  style={{
                    animation: isCategoryOpen ? 'fadeInUp 200ms ease-out' : undefined
                  }}
                >
                  <div className="text-white font-semibold text-sm px-2 py-2 mb-1">
                    Super Rundi AI
                  </div>
                  <div className="max-h-[240px] overflow-y-auto space-y-1">
                    {categories.map((categoryName) => {
                      return (
                        <button
                          type="button"
                          key={categoryName}
                          onClick={() => {
                            setSelectedCategory(categoryName)
                            setIsCategoryOpen(false)
                          }}
                          role="menuitem"
                          className={`flex items-center gap-3 px-3 py-2 rounded w-full text-left
                            text-white/90 hover:bg-white/10 transition-colors duration-200
                            cursor-pointer focus:outline-none focus:bg-white/10
                            ${
                              selectedCategory === categoryName
                                ? 'bg-white/10 text-white font-medium'
                                : ''
                            }`}
                        >
                          <CategoryIcon className="w-5 h-5 text-white/80 flex-shrink-0" />
                          <span className="truncate">{categoryName}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative" ref={attachmentRef}>
                <button
                  type="button"
                  onClick={() => setIsAttachmentOpen((v) => !v)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground 
                           hover:bg-muted dark:hover:bg-[#147E4E]/10 hover:text-[#147E4E] 
                           transition-all duration-200 border border-border dark:border-[#147E4E]/20"
                  title="Attach files"
                >
                  <Paperclip className="h-4 w-4" />
                </button>

                {isAttachmentOpen && (
                  <div className="absolute bottom-full right-0 mb-2 w-64 rounded-xl bg-card dark:bg-[#2A2B3D] border border-border dark:border-[#147E4E]/20 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => {
                          onFileUpload()
                          setIsAttachmentOpen(false)
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground dark:text-gray-200 rounded-lg hover:bg-muted dark:hover:bg-[#147E4E]/10 transition-colors"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Upload Document</div>
                          <div className="text-xs text-muted-foreground">PDF, DOC, TXT files</div>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => {
                          onFileUpload()
                          setIsAttachmentOpen(false)
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground dark:text-gray-200 rounded-lg hover:bg-muted dark:hover:bg-[#147E4E]/10 transition-colors"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                          <Image className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Upload Image</div>
                          <div className="text-xs text-muted-foreground">JPG, PNG, GIF files</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                type="button"
                onClick={loading || isTyping ? stopBotMessage : () => sendMessage()}
                disabled={!loading && !isTyping && !input.trim()}
                className={`group flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200
                  ${
                    loading || isTyping
                      ? 'bg-[#147E4E] hover:bg-[#116A41] active:scale-95 shadow-lg hover:shadow-xl'
                      : input.trim() && !loading && !isTyping
                      ? 'bg-[#147E4E] hover:bg-[#116A41] active:scale-95 shadow-lg hover:shadow-xl'
                      : 'bg-muted-foreground/20 dark:bg-gray-700/50 cursor-not-allowed'
                  }`}
              >
                {loading || isTyping ? (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#147E4E" opacity="0.15"/>
                    <rect x="8" y="8" width="8" height="8" rx="1.5" fill="white"/>
                  </svg>
                ) : (
                  <Send className="h-4 w-4 text-white group-hover:translate-x-0.5 transition-transform" />
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="px-4 py-2">
            <p className="text-xs text-muted-foreground/70 text-center">
              Rundi AI can make mistakes. Please double-check responses.
            </p>
          </div>
      </div>
      <footer className="mt-auto w-full bg-gray-50 dark:bg-gray-900 ">
        <div className="max-w-3xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground dark:text-gray-400">
          <p className="font-medium">
            © {new Date().getFullYear()} AFRINAI
          </p>

          <div className="flex items-center gap-6">
            <a
              href="/condition"
              className="hover:text-[#147E4E] dark:hover:text-[#147E4E] transition-colors duration-200 font-medium"
            >
              Conditions d’utilisation
            </a>

            <a
              href="/policy"
              className="hover:text-[#147E4E] dark:hover:text-[#147E4E] transition-colors duration-200 font-medium"
            >
              Politique de confidentialité
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function ChatBoxInterface() {
  const { currentSession, updateSession, createNewSession, activePage } = useChat()
  const { t } = useLanguage()

  const schedule = (fn: () => void) => {
    if (typeof queueMicrotask === 'function') queueMicrotask(fn)
    else Promise.resolve().then(fn)
  }
  const safeUpdateSession = (sessionId: string, updates: any) => {
    schedule(() => updateSession(sessionId, updates))
  }

  const chatCategories = [t.global, t.healthChat, t.breeding, t.commerce, t.agriculture]

  const [chatHistory, setChatHistory] = useState<ChatMsg[]>([])
  const [showWelcome, setShowWelcome] = useState(true)

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0)
  const selectedCategory = chatCategories[selectedCategoryIndex] || chatCategories[0]

  const [isCategoryOpen, setIsCategoryOpen] = useState(false)

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeBotId, setActiveBotId] = useState<string | null>(null)

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editedMessageContent, setEditedMessageContent] = useState('')

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)
  const attachmentRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const FIXED_BACKEND_USER_ID = 'be4ff3ae-dc3c-49c1-b3e6-385e81d3a5dd'
  
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  
  const sendLock = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = () => {
    setIsAutoScrolling(true)
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    setTimeout(() => setIsAutoScrolling(false), 1000)
  }
  
  const handleScroll = () => {
    if (!messagesContainerRef.current || isAutoScrolling) return
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    setShowScrollButton(!isNearBottom)
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory, loading, editingMessageId])

  useEffect(() => {
    setInput('')
    setLoading(false)
    setIsTyping(false)
    setActiveBotId(null)
    setEditingMessageId(null)
    sendLock.current = false

    if (currentSession?.state) {
      const s = currentSession.state
      setChatHistory(s.chatHistory || [])

      if (s.selectedCategory) {
        const idx = chatCategories.indexOf(s.selectedCategory)
        if (idx !== -1) setSelectedCategoryIndex(idx)
      }
      setShowWelcome((s.chatHistory || []).length === 0)
    } else {
      setChatHistory([])
      setSelectedCategoryIndex(0)
      setShowWelcome(true)
    }
  }, [currentSession?.id])

  useEffect(() => {
    if (chatHistory.length > 0 && showWelcome) setShowWelcome(false)
  }, [chatHistory.length, showWelcome])

  const stableStringify = (obj: any) => {
    try {
      return JSON.stringify(obj)
    } catch {
      return ''
    }
  }
  const lastSentRef = useRef<string>('')

  const historySig = useMemo(() => {
    const last = chatHistory[chatHistory.length - 1]
    const lastKey = last ? `${last.id}:${last.role}:${(last.content || '').length}` : 'none'
    return `${chatHistory.length}|${lastKey}`
  }, [chatHistory])

  useEffect(() => {
    if (!currentSession) return

    const bId = currentSession?.state?.backendSessionId
    const nextState = { chatHistory, selectedCategory, backendSessionId: bId }

    const lastBotMsg = [...chatHistory].reverse().find((msg) => msg.role === 'assistant' && msg.content?.trim())

    const nextTitle = lastBotMsg
      ? lastBotMsg.content.length > 25
        ? lastBotMsg.content.substring(0, 25) + '...'
        : lastBotMsg.content
      : `Chat: ${selectedCategory}`

    const botPreviewText = lastBotMsg
      ? lastBotMsg.content.substring(0, 50) + (lastBotMsg.content.length > 50 ? '...' : '')
      : 'Waiting for Rundi AI response...'

    const nextPreview = `Rundi AI: ${botPreviewText}`

    const nextStateKey = stableStringify(nextState)
    const currentStateKey = stableStringify({
      chatHistory: currentSession?.state?.chatHistory,
      selectedCategory: currentSession?.state?.selectedCategory,
      backendSessionId: currentSession?.state?.backendSessionId,
    })

    const payloadKey = `${currentSession.id}|${nextTitle}|${nextPreview}|${nextStateKey}`
    if (lastSentRef.current === payloadKey) return

    const timer = setTimeout(() => {
      const titleChanged = currentSession.title !== nextTitle
      const previewChanged = currentSession.preview !== nextPreview
      const stateChanged = currentStateKey !== nextStateKey

      if (!titleChanged && !previewChanged && !stateChanged) return

      lastSentRef.current = payloadKey
      safeUpdateSession(currentSession.id, {
        state: { ...(currentSession.state || {}), ...nextState },
        title: nextTitle,
        preview: nextPreview,
        updatedAt: new Date(),
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [
    currentSession?.id,
    currentSession?.state?.backendSessionId,
    currentSession?.title,
    currentSession?.preview,
    selectedCategory,
    historySig,
  ])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (categoryRef.current && !categoryRef.current.contains(target)) setIsCategoryOpen(false)
      if (attachmentRef.current && !attachmentRef.current.contains(target)) setIsAttachmentOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const [copiedId, setCopiedId] = useState<string | null>(null)

  const updateMessage = (id: string, newContent: string) => {
    setChatHistory(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, content: newContent } : msg
      )
    )
  }

  const findReplyTo = (userId: string): ChatMsg | null => {
    return chatHistory.find(msg => 
      msg.role === 'assistant' && msg.replyTo === userId
    ) || null
  }

  const replaceAssistantAtIndex = (index: number, newMessage: ChatMsg) => {
    setChatHistory(prev => {
      const next = [...prev]
      next[index] = newMessage
      return next
    })
  }

  const insertAfter = (userId: string, newMessage: ChatMsg) => {
    setChatHistory(prev => {
      const userIndex = prev.findIndex(msg => msg.id === userId)
      if (userIndex === -1) return [...prev, newMessage]
      
      const next = [...prev]
      next.splice(userIndex + 1, 0, newMessage)
      return next
    })
  }

  const copyToClipboardFallback = (text: string) => {
    try {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.setAttribute('readonly', '')
      textArea.style.position = 'fixed'
      textArea.style.top = '0'
      textArea.style.left = '0'
      textArea.style.opacity = '0'
      textArea.style.pointerEvents = 'none'

      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      textArea.setSelectionRange(0, text.length)

      const copied = document.execCommand('copy')
      document.body.removeChild(textArea)
      return copied
    } catch {
      return false
    }
  }

  const copyToClipboard = async (text: string, id: string): Promise<boolean> => {
    let copied = false

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text)
        copied = true
      } catch {
        copied = false
      }
    }

    if (!copied) copied = copyToClipboardFallback(text)

    if (copied) {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } else {
      console.warn('Copy to clipboard failed on this device/browser')
    }

    return copied
  }

  const handleShare = async (msg: ChatMsg) => {
    const shareData = { title: 'Rundi AI Message', text: msg.content }

    try {
      if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
        await navigator.share(shareData)
        return
      }

      const copied = await copyToClipboard(msg.content, msg.id)
      if (!copied) window.prompt('Copy this message:', msg.content)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      const copied = await copyToClipboard(msg.content, msg.id)
      if (!copied) window.prompt('Copy this message:', msg.content)
    }
  }

  const handleEdit = (msg: ChatMsg) => {
    setEditingMessageId(msg.id)
    setEditedMessageContent(msg.content)
  }

  const saveEdit = async (id: string, isResend: boolean = true) => {
    if (!editedMessageContent.trim()) return
    
    console.log('saveEdit called with id:', id, 'content:', editedMessageContent)
    
    // Update the user message content
    setChatHistory(prev => {
      const updated = prev.map(msg => 
        msg.id === id ? { ...msg, content: editedMessageContent } : msg
      )
      console.log('Updated chat history:', updated)
      return updated
    })
    
    if (isResend) {
      setChatHistory(prev => {
        const userIndex = prev.findIndex(msg => msg.id === id)
        if (userIndex === -1) return prev
        
        const assistantReply = prev.find((msg, index) => 
          index > userIndex && 
          msg.role === 'assistant' && 
          msg.replyTo === id
        )
        
        console.log('Found assistant reply to replace:', assistantReply)
        
        if (assistantReply) {
          const newPlaceholder: ChatMsg = {
            id: `assistant-regenerating-${Date.now()}`, 
            content: '', // Ensure completely empty content
            role: 'assistant',
            createdAt: Date.now(),
            timestamp: nowTime(),
            category: selectedCategory,
            replyTo: id,
            status: 'streaming'
          }
          
          const assistantIndex = prev.findIndex(msg => msg.id === assistantReply.id)
          const next = [...prev]
          next.splice(assistantIndex, 1, newPlaceholder) 
          
          // Clear any previous typing state and set new one
          setIsTyping(false)
          setActiveBotId(null)
          
          // Set new typing states after a brief delay to ensure clean reset
          setTimeout(() => {
            setActiveBotId(newPlaceholder.id)
            setIsTyping(true)
          }, 50)
          
          setTimeout(() => regenerateResponse(id, editedMessageContent, newPlaceholder.id), 150)
          
          return next
        }
        return prev
      })
    }
    
    setEditingMessageId(null)
    setEditedMessageContent('')
  }

  const cancelEdit = () => {
    setEditingMessageId(null)
    setEditedMessageContent('')
  }

  const regenerateResponse = async (userMessageId: string, userText: string, placeholderId?: string) => {
    console.log('regenerateResponse called with:', userMessageId, userText, placeholderId)
    
    const session = currentSession ?? createNewSession(activePage)
    if (!session) return
    if (sendLock.current) return

    sendLock.current = true
    setLoading(true)

    abortControllerRef.current = new AbortController()
    const abortSignal = abortControllerRef.current.signal

    const userID = FIXED_BACKEND_USER_ID
    const { domain, category } = getCategoryMetadata(selectedCategory, t)
    let currentBackendId = session?.state?.backendSessionId

    try {
      const payload = { 
        message: userText, 
        domain, 
        category, 
        language: 'rn', 
        user_id: userID, 
        session_id: currentBackendId,
        editedMessageId: userMessageId // Signal this is an edit
      }
      
      console.log('Sending regenerate request:', payload)
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: abortSignal,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Server error: ${response.status}`)
      }

      if (abortSignal.aborted) return

      const data = await response.json()
      let answer = data.answer || data.reply || data.message || JSON.stringify(data)
      answer = answer.replace(/<(think|thought|regex)>[\s\S]*?<\/\1>/gi, '').trim()

      console.log('Received answer:', answer)

      if (abortSignal.aborted) return

      // Update the placeholder with the new response
      setChatHistory(prev => {
        const targetId = placeholderId || prev.find(msg => 
          msg.role === 'assistant' && msg.replyTo === userMessageId
        )?.id
        
        if (targetId) {
          const assistantIndex = prev.findIndex(msg => msg.id === targetId)
          if (assistantIndex !== -1) {
            const updatedAssistant: ChatMsg = {
              id: targetId,
              content: answer,
              role: 'assistant',
              createdAt: Date.now(),
              timestamp: nowTime(),
              category: selectedCategory,
              replyTo: userMessageId,
              status: 'done'
            }
            
            const next = [...prev]
            next[assistantIndex] = updatedAssistant
            console.log('Updated assistant message at index:', assistantIndex)
            return next
          }
        }
        return prev
      })

      setIsTyping(false)
      setActiveBotId(null)
      
    } catch (err: any) {
      console.error('Regenerate error:', err)
      
      if (err.name === 'AbortError' || abortSignal.aborted) return

      // Update placeholder with error message
      setChatHistory(prev => {
        const targetId = placeholderId || prev.find(msg => 
          msg.role === 'assistant' && msg.replyTo === userMessageId
        )?.id
        
        if (targetId) {
          const assistantIndex = prev.findIndex(msg => msg.id === targetId)
          if (assistantIndex !== -1) {
            const errorAssistant: ChatMsg = {
              id: targetId,
              content: err?.message || 'Error contacting server. Check backend connection.',
              role: 'assistant',
              createdAt: Date.now(),
              timestamp: nowTime(),
              category: selectedCategory,
              replyTo: userMessageId,
              status: 'error'
            }
            
            const next = [...prev]
            next[assistantIndex] = errorAssistant
            return next
          }
        }
        return prev
      })
      
      setIsTyping(false)
      setActiveBotId(null)
    } finally {
      if (!abortSignal.aborted) {
        setLoading(false)
        sendLock.current = false
      }
      abortControllerRef.current = null
    }
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const fileName = files[0].name
      setInput((prev) => prev + (prev ? ' ' : '') + `[Attached: ${fileName}] `)
    }
  }

  const stopBotMessage = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    
    setLoading(false)
    setIsTyping(false)
    setActiveBotId(null)
    sendLock.current = false
  }

  const sendMessage = async (overrideText?: string) => {
    const text = typeof overrideText === 'string' ? overrideText.trim() : input.trim()
    if (!text || loading || isTyping) return

    const session = currentSession ?? createNewSession(activePage)
    if (!session) return
    if (sendLock.current) return

    sendLock.current = true
    if (showWelcome) setShowWelcome(false)

    const userID = FIXED_BACKEND_USER_ID

    const userChat: ChatMsg = {
      id: `user-${Date.now()}`,
      content: text,
      role: 'user',
      createdAt: Date.now(),
      timestamp: nowTime(),
      category: selectedCategory,
      status: 'done'
    }

    setChatHistory((prev) => {
      const next = [...prev, userChat]
      safeUpdateSession(session.id, {
        state: {
          ...(session.state || {}),
          chatHistory: next,
          selectedCategory,
          backendSessionId: session?.state?.backendSessionId || null,
        },
        updatedAt: new Date(),
      })
      return next
    })

    setInput('')
    setLoading(true)

    abortControllerRef.current = new AbortController()
    const abortSignal = abortControllerRef.current.signal

    const { domain, category } = getCategoryMetadata(selectedCategory, t)
    let currentBackendId = session?.state?.backendSessionId

    try {
      if (!currentBackendId) {
        const sessionRes = await fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userID, first_message: text }),
          signal: abortSignal,
        })

        const sessionData = await sessionRes.json().catch(() => ({}))
        if (!sessionRes.ok) {
          throw new Error(sessionData.error || `Failed to create backend session: ${sessionRes.status}`)
        }

        currentBackendId = sessionData.session_id || sessionData.id || sessionData?.data?.session_id || null
        if (!currentBackendId) throw new Error('Backend did not return a session id')

        safeUpdateSession(session.id, {
          state: {
            ...(session.state || {}),
            chatHistory: session.state?.chatHistory || [],
            selectedCategory,
            backendSessionId: currentBackendId,
          },
          updatedAt: new Date(),
        })
      }

      const payload = { message: text, domain, category, language: 'rn', user_id: userID, session_id: currentBackendId }
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: abortSignal,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Server error: ${response.status}`)
      }

      if (abortSignal.aborted) {
        return
      }

      const data = await response.json()
      let answer = data.answer || data.reply || data.message || JSON.stringify(data)
      answer = answer.replace(/<(think|thought|regex)>[\s\S]*?<\/\1>/gi, '').trim()

      if (abortSignal.aborted) {
        return
      }

      const botChatId = `assistant-${Date.now()}`
      const botChat: ChatMsg = { 
        id: botChatId, 
        content: answer, 
        role: 'assistant', 
        createdAt: Date.now(),
        timestamp: nowTime(), 
        category: selectedCategory,
        replyTo: userChat.id,
        status: 'done'
      }

      setIsTyping(true)
      setActiveBotId(botChatId)

      setChatHistory((prev) => {
        const next = [...prev, botChat]
        safeUpdateSession(session.id, {
          state: {
            ...(session.state || {}),
            chatHistory: next,
            selectedCategory,
            backendSessionId: currentBackendId || null,
          },
          updatedAt: new Date(),
        })
        return next
      })
    } catch (err: any) {
      if (err.name === 'AbortError' || abortSignal.aborted) {
        return
      }

      const botChat: ChatMsg = {
        id: `error-${Date.now()}`,
        content: err?.message || 'Error contacting server. Check backend connection.',
        role: 'assistant',
        createdAt: Date.now(),
        timestamp: nowTime(),
        category: selectedCategory,
        replyTo: userChat.id,
        status: 'error'
      }
      setChatHistory((prev) => {
        const next = [...prev, botChat]
        safeUpdateSession(session.id, {
          state: {
            ...(session.state || {}),
            chatHistory: next,
            selectedCategory,
            backendSessionId: currentBackendId || null,
          },
          updatedAt: new Date(),
        })
        return next
      })
    } finally {
      if (!abortSignal.aborted) {
        setLoading(false)
        sendLock.current = false
      }
      abortControllerRef.current = null
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (isTyping) {
      e.preventDefault()
      return
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex-1 h-[calc(100vh-3.5rem)] flex flex-col bg-background">
      {showWelcome ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 
                       bg-gray-50 dark:bg-gray-900
                       bg-gradient-to-b from-gray-50 via-gray-50/95 to-gray-50/90
                       dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900/90">
          <div className="w-full max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-6 sm:space-y-8">
              <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-card dark:bg-[#1A1B23] border border-border dark:border-[#147E4E]/20 shadow-sm transition-transform duration-200 hover:scale-105">
                <Bot className="h-8 w-8 sm:h-10 sm:w-10 text-[#147E4E]" />
              </div>
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground dark:text-gray-100">{t.welcome}</h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">{t.subtitle}</p>
              </div>
            </div>

            <InputArea
              input={input}
              setInput={setInput}
              loading={loading}
              isTyping={isTyping}
              sendMessage={sendMessage}
              stopBotMessage={stopBotMessage}
              handleKeyDown={handleKeyDown}
              selectedCategory={selectedCategory}
              setSelectedCategory={(c) => setSelectedCategoryIndex(chatCategories.indexOf(c))}
              isCategoryOpen={isCategoryOpen}
              setIsCategoryOpen={setIsCategoryOpen}
              categories={chatCategories}
              textareaRef={textareaRef}
              categoryRef={categoryRef}
              className="!p-0 !dark:bg-transparent !max-w-3xl"
              placeholder={t.placeholder}
              isAttachmentOpen={isAttachmentOpen}
              setIsAttachmentOpen={setIsAttachmentOpen}
              attachmentRef={attachmentRef}
              onFileUpload={handleFileUpload}
            />
          </div>
        </div>
      ) : (
        <>
          <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" />

          <div 
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="relative flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 pt-4 pb-2 custom-scrollbar
                       bg-gray-50 dark:bg-gray-900
                       bg-gradient-to-b from-gray-50 via-gray-50/95 to-gray-50/90
                       dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900/90"
          >
            <div className="mx-auto max-w-3xl flex flex-col gap-6">
              {chatHistory.map((msg, index) => (
                <div 
                  key={msg.id} 
                  className={`group flex w-full animate-in fade-in slide-in-from-bottom-2 duration-500 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`flex gap-3 max-w-[96%] md:max-w-[90%]`}>
                    {msg.role === 'assistant' && (
                      <div className="flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#147E4E]/10 dark:bg-[#147E4E]/20">
                          <Bot className="h-4 w-4 text-[#147E4E]" />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div
                        className={`rounded-2xl transition-all duration-200 text-chat-message ${
                          msg.role === 'user'
                            ? 'bg-[#147E4E] hover:bg-[#116A41] text-white px-4 py-3 shadow-md hover:shadow-lg ml-auto break-all overflow-hidden whitespace-pre-wrap'
                            : 'bg-white dark:bg-[#1A1B23] text-foreground dark:text-gray-100 px-4 py-3 shadow-sm hover:shadow-md border border-border dark:border-[#147E4E]/10'
                        }`}
                      >
                        {editingMessageId === msg.id ? (
                          <div className="w-full bg-card border border-border dark:border-[#147E4E]/30 rounded-xl shadow-lg p-4 transition-all animate-in fade-in zoom-in-95 duration-200">
                            <textarea
                              value={editedMessageContent}
                              onChange={(e) => setEditedMessageContent(e.target.value)}
                              className="w-full bg-transparent text-foreground dark:text-white rounded-lg p-3 text-base focus:outline-none resize-none min-h-[100px]"
                              autoFocus
                              placeholder="Edit your message..."
                            />
                            <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-border">
                              <button
                                onClick={cancelEdit}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-muted dark:hover:bg-gray-800 rounded-lg text-muted-foreground transition-colors"
                              >
                                <X className="w-4 h-4" />
                                <span>Cancel</span>
                              </button>
                              <button
                                onClick={() => saveEdit(msg.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-[#147E4E] text-white rounded-lg hover:bg-[#116A41] transition-colors shadow-sm"
                              >
                                <Send className="w-4 h-4" />
                                <span>Save & Resend</span>
                              </button>
                            </div>
                          </div>
                        ) : msg.role === 'assistant' && msg.id === activeBotId ? (
                          <TypewriterText text={msg.content} onComplete={() => setIsTyping(false)} />
                        ) : (
                          <MessageContent text={msg.content} isBot={msg.role === 'assistant'} />
                        )}
                      </div>

                      {!editingMessageId && (
                        <div className={`mt-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => copyToClipboard(msg.content, msg.id)}
                              className="p-2 hover:bg-[#147E4E]/10 dark:hover:bg-[#147E4E]/20 rounded-lg transition-all duration-200 text-muted-foreground dark:text-gray-500 hover:text-[#147E4E] dark:hover:text-[#147E4E]"
                              title="Copy message"
                            >
                              {copiedId === msg.id ? (
                                <Check className="h-4 w-4 text-[#147E4E]" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>

                            {msg.role === 'assistant' ? (
                              <button
                                onClick={() => handleShare(msg)}
                                className="p-2 hover:bg-[#147E4E]/10 dark:hover:bg-[#147E4E]/20 rounded-lg transition-all duration-200 text-muted-foreground dark:text-gray-500 hover:text-[#147E4E] dark:hover:text-[#147E4E]"
                                title="Share message"
                              >
                                <Share2 className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEdit(msg)}
                                className="p-2 hover:bg-[#147E4E]/10 dark:hover:bg-[#147E4E]/20 rounded-lg transition-all duration-200 text-muted-foreground dark:text-gray-500 hover:text-[#147E4E] dark:hover:text-[#147E4E]"
                                title="Edit message"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                            )}
                          </div>

                          <div className="text-xs text-muted-foreground dark:text-gray-500 flex items-center gap-2">
                            <span>{msg.timestamp}</span>
                            {msg.role === 'assistant' && msg.category && (
                              <span className="text-[#147E4E]/70 dark:text-[#147E4E]/70">
                                • {msg.category}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="bg-white dark:bg-[#1A1B23] rounded-2xl shadow-sm border border-border dark:border-[#147E4E]/10">
                    <TypingIndicator />
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} className="h-1" />
            
            {showScrollButton && (
              <button
                onClick={scrollToBottom}
                className="fixed bottom-32 right-8 flex h-10 w-10 items-center justify-center rounded-full 
                          bg-card dark:bg-[#1A1B23] border border-border dark:border-[#147E4E]/20 
                          shadow-lg hover:shadow-xl transition-all duration-200 
                          text-muted-foreground hover:text-[#147E4E] hover:border-[#147E4E]/30
                          animate-in fade-in slide-in-from-bottom-2 duration-200 z-10"
                title="Scroll to bottom"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
            )}
          </div>

          <InputArea
            input={input}
            setInput={setInput}
            loading={loading}
            isTyping={isTyping}
            sendMessage={sendMessage}
            stopBotMessage={stopBotMessage}
            handleKeyDown={handleKeyDown}
            selectedCategory={selectedCategory}
            setSelectedCategory={(c) => setSelectedCategoryIndex(chatCategories.indexOf(c))}
            isCategoryOpen={isCategoryOpen}
            setIsCategoryOpen={setIsCategoryOpen}
            categories={chatCategories}
            textareaRef={textareaRef}
            categoryRef={categoryRef}
            placeholder={t.placeholder}
            isAttachmentOpen={isAttachmentOpen}
            setIsAttachmentOpen={setIsAttachmentOpen}
            attachmentRef={attachmentRef}
            onFileUpload={handleFileUpload}
          />
        </>
      )}
    </div>
  )
}

const styles = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  if (!document.head.querySelector('style[data-categories-popup]')) {
    styleSheet.setAttribute('data-categories-popup', 'true')
    document.head.appendChild(styleSheet)
  }
}
