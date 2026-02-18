'use client'

import { useRef, useEffect, useState, type ChangeEvent, type KeyboardEvent, useMemo } from 'react'
import { Send, Bot, Paperclip, ChevronDown, Copy, Share2, Pencil, Check, X } from 'lucide-react'
import { useChat } from '@/app/context/chatContext'
import { useLanguage } from '@/app/context/languageContext'
import { ChatDomain } from '@/app/api/types/chat.types'
import ReactMarkdown from 'react-markdown'
import Footer2 from './footer2'

const getCategoryMetadata = (categoryName: string, t: any): { domain: ChatDomain; category: string } => {
  if (categoryName === t.healthChat) return { domain: 'sante', category: 'Santé' }
  if (categoryName === t.breeding) return { domain: 'elevage', category: 'Élevage' }
  if (categoryName === t.commerce) return { domain: 'commerce', category: 'Commerce' }
  if (categoryName === t.agriculture) return { domain: 'agriculture', category: 'Agriculture' }
  return { domain: 'global', category: 'Global' }
}

type ChatMsg = {
  id: number
  text: string
  sender: 'user' | 'Rundi AI'
  timestamp: string
  category?: string
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 px-1 py-1">
    <div className="w-1.5 h-1.5 bg-[#147E4E] rounded-full animate-bounce [animation-delay:-0.3s]" />
    <div className="w-1.5 h-1.5 bg-[#147E4E] rounded-full animate-bounce [animation-delay:-0.15s]" />
    <div className="w-1.5 h-1.5 bg-[#147E4E] rounded-full animate-bounce" />
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

  useEffect(() => {
    if (index < cleanText.length) {
      const timeout = setTimeout(() => {
        const chunk = cleanText.slice(index, index + 2)
        setDisplayedText((prev) => prev + chunk)
        setIndex((prev) => prev + 2)
      }, 5)
      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [index, cleanText, onComplete])

  return <MessageContent text={displayedText} isBot={true} />
}

interface InputAreaProps {
  input: string
  setInput: (v: string) => void
  loading: boolean
  isTyping: boolean
  sendMessage: (overrideText?: string) => void
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
    <div className={`p-2 sm:p-4 ${className}`}>
      <div
        className="mx-auto max-w-[90%] relative rounded-3xl
          border border-border dark:border-[#147E4E]/20
          bg-input shadow-sm dark:shadow-none 
          focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2
          transition-all duration-200 w-full flex flex-col"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="w-full resize-none bg-transparent p-4 sm:p-5 rounded
              text-foreground dark:text-gray-100 focus:outline-none min-h-[50px] max-h-[200px] text-sm custom-scrollbar"
        />

        <div className="flex items-center justify-between px-3 pb-3 sm:px-4 sm:pb-4 mt-1">
          <div className="relative" ref={categoryRef}>
            <button
              type="button"
              onClick={() => setIsCategoryOpen((v) => !v)}
              className="flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-2 text-[10px] sm:text-xs
                bg-muted dark:bg-black/20
                text-foreground dark:text-gray-100
                border border-border dark:border-white/10 cursor-pointer hover:bg-input-hover dark:hover:bg-white/5 transition-colors"
            >
              <span className="truncate max-w-[80px] sm:max-w-[120px] font-medium">{selectedCategory}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground dark:text-gray-400 transition-transform duration-200 ${
                  isCategoryOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isCategoryOpen && (
              <div
                className="absolute bottom-full left-0 mb-2 w-48 rounded-xl overflow-hidden
                bg-card dark:bg-[#2A2B3D]
                border border-border dark:border-white/10 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-1">
                  {categories.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => {
                        setSelectedCategory(c)
                        setIsCategoryOpen(false)
                      }}
                      className={`block w-full px-3 py-2 text-left text-xs rounded-lg cursor-pointer transition-colors
                        ${
                          selectedCategory === c
                            ? 'bg-[#147E4E]/10 text-[#147E4E] font-medium dark:text-[#147E4E]'
                            : 'text-muted-foreground dark:text-gray-200 hover:bg-accent dark:hover:bg-white/5'
                        }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative" ref={attachmentRef}>
              <button
                type="button"
                onClick={() => setIsAttachmentOpen((v) => !v)}
                className="rounded-full p-2.5 sm:p-3 text-muted-foreground hover:bg-input-hover dark:hover:bg-white/5 cursor-pointer transition-colors border border-border sm:border-transparent"
                title="Attach file"
              >
                <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              {isAttachmentOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-48 rounded-2xl bg-card dark:bg-[#2A2B3D] border border-border dark:border-white/10 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 p-1">
                  <button
                    onClick={() => {
                      onFileUpload()
                      setIsAttachmentOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs sm:text-sm text-muted-foreground dark:text-gray-200 rounded-xl hover:bg-muted dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="p-1.5 bg-green-500/10 dark:bg-green-900/30 rounded-md text-[#147E4E]">
                      <Paperclip className="h-3.5 w-3.5" />
                    </div>
                    <span>Document</span>
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading || isTyping}
              className={`rounded-full p-2.5 sm:p-3 text-white transition-all cursor-pointer shadow-sm
                ${
                  input.trim() && !loading && !isTyping
                    ? 'bg-[#147E4E] hover:bg-[#116A41] active:scale-95'
                    : 'bg-muted-foreground/30 dark:bg-gray-700 cursor-not-allowed opacity-50'
                }`}
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>

      <Footer2 />
    </div>
  )
}

export default function ChatBoxInterface() {
  const { currentSession, updateSession, createNewSession, activePage } = useChat()
  const { t } = useLanguage()

  // ✅ ALWAYS defer provider updates to avoid "Cannot update ChatProvider while rendering ChatBoxInterface"
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
  const [activeBotId, setActiveBotId] = useState<number | null>(null)

  const [editingMessageId, setEditingMessageId] = useState<number | null>(null)
  const [editedMessageContent, setEditedMessageContent] = useState('')

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)
  const attachmentRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const FIXED_BACKEND_USER_ID = 'be4ff3ae-dc3c-49c1-b3e6-385e81d3a5dd'

  const sendLock = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
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
    const lastKey = last ? `${last.id}:${last.sender}:${(last.text || '').length}` : 'none'
    return `${chatHistory.length}|${lastKey}`
  }, [chatHistory])

  useEffect(() => {
    if (!currentSession) return

    const bId = currentSession?.state?.backendSessionId
    const nextState = { chatHistory, selectedCategory, backendSessionId: bId }

    const lastBotMsg = [...chatHistory].reverse().find((msg) => msg.sender === 'Rundi AI' && msg.text?.trim())

    const nextTitle = lastBotMsg
      ? lastBotMsg.text.length > 25
        ? lastBotMsg.text.substring(0, 25) + '...'
        : lastBotMsg.text
      : `Chat: ${selectedCategory}`

    const botPreviewText = lastBotMsg
      ? lastBotMsg.text.substring(0, 50) + (lastBotMsg.text.length > 50 ? '...' : '')
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

  const [copiedId, setCopiedId] = useState<number | null>(null)

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

  const copyToClipboard = async (text: string, id: number): Promise<boolean> => {
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
    const shareData = { title: 'Rundi AI Message', text: msg.text }

    try {
      if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
        await navigator.share(shareData)
        return
      }

      const copied = await copyToClipboard(msg.text, msg.id)
      if (!copied) window.prompt('Copy this message:', msg.text)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      const copied = await copyToClipboard(msg.text, msg.id)
      if (!copied) window.prompt('Copy this message:', msg.text)
    }
  }

  const handleEdit = (msg: ChatMsg) => {
    setEditingMessageId(msg.id)
    setEditedMessageContent(msg.text)
  }

  const saveEdit = (id: number) => {
    if (!editedMessageContent.trim()) return
    setChatHistory((prev) => prev.map((msg) => (msg.id === id ? { ...msg, text: editedMessageContent } : msg)))
    const newText = editedMessageContent
    setEditingMessageId(null)
    setEditedMessageContent('')
    sendMessage(newText)
  }

  const cancelEdit = () => {
    setEditingMessageId(null)
    setEditedMessageContent('')
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
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: nowTime(),
      category: selectedCategory,
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

    const { domain, category } = getCategoryMetadata(selectedCategory, t)
    let currentBackendId = session?.state?.backendSessionId

    try {
      if (!currentBackendId) {
        const sessionRes = await fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userID, first_message: text }),
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
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()
      let answer = data.answer || data.reply || data.message || JSON.stringify(data)
      answer = answer.replace(/<(think|thought|regex)>[\s\S]*?<\/\1>/gi, '').trim()

      const botChatId = Date.now() + 1
      const botChat: ChatMsg = { id: botChatId, text: answer, sender: 'Rundi AI', timestamp: nowTime(), category: selectedCategory }

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
      const botChat: ChatMsg = {
        id: Date.now() + 1,
        text: err?.message || 'Error contacting server. Check backend connection.',
        sender: 'Rundi AI',
        timestamp: nowTime(),
        category: selectedCategory,
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
      setLoading(false)
      sendLock.current = false
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
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
          <div className="w-full max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-6 sm:space-y-8">
              <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-background border border-border shadow-sm transition-transform duration-200 hover:scale-105">
                <Bot className="h-8 w-8 sm:h-10 sm:w-10 text-[#147E4E]" />
              </div>
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground dark:text-gray-100 tracking-tight">{t.welcome}</h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground dark:text-gray-400 tracking-normal leading-relaxed max-w-2xl mx-auto">{t.subtitle}</p>
              </div>
            </div>

            <InputArea
              input={input}
              setInput={setInput}
              loading={loading}
              isTyping={isTyping}
              sendMessage={sendMessage}
              handleKeyDown={handleKeyDown}
              selectedCategory={selectedCategory}
              setSelectedCategory={(c) => setSelectedCategoryIndex(chatCategories.indexOf(c))}
              isCategoryOpen={isCategoryOpen}
              setIsCategoryOpen={setIsCategoryOpen}
              categories={chatCategories}
              textareaRef={textareaRef}
              categoryRef={categoryRef}
              className="!p-0"
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

          <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 pt-2 sm:pt-3 pb-4 sm:pb-6 custom-scrollbar bg-background">
            <div className="mx-auto max-w-3xl flex flex-col gap-2 sm:gap-3 md:gap-4">
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] md:max-w-[75%] lg:max-w-[65%] ${msg.sender === 'Rundi AI' ? 'w-full' : ''}`}>
                    <div
                      className={`rounded-3xl text-sm ${
                        msg.sender === 'user'
                          ? 'bg-[#147E4E] text-white px-5 py-2.5 shadow-sm w-fit break-words ml-auto'
                          : 'bg-transparent text-foreground dark:text-gray-100 px-0 py-1'
                      }`}
                    >
                      {editingMessageId === msg.id ? (
                        <div className="w-full bg-card border border-border dark:border-[#147E4E]/30 rounded-2xl shadow-lg ring-1 ring-black/5 p-2 sm:p-3 transition-all animate-in fade-in zoom-in-95 duration-200">
                          <textarea
                            value={editedMessageContent}
                            onChange={(e) => setEditedMessageContent(e.target.value)}
                            className="w-full bg-transparent text-foreground dark:text-white rounded-xl p-3 text-sm focus:outline-none resize-none min-h-[100px] sm:min-h-[120px]"
                            autoFocus
                            placeholder="Edit your message..."
                          />
                          <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-border">
                            <button
                              onClick={cancelEdit}
                              className="flex items-center gap-2 px-3 py-1.5 hover:bg-accent dark:hover:bg-gray-800 rounded-xl text-muted-foreground transition text-xs font-medium"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Cancel</span>
                            </button>
                            <button
                              onClick={() => saveEdit(msg.id)}
                              className="flex items-center gap-2 px-4 py-1.5 bg-[#147E4E] text-white rounded-full hover:bg-[#116A41] transition text-xs font-medium shadow-sm"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Save & Resend</span>
                            </button>
                          </div>
                        </div>
                      ) : msg.sender === 'Rundi AI' && msg.id === activeBotId ? (
                        <TypewriterText text={msg.text} onComplete={() => setIsTyping(false)} />
                      ) : (
                        <MessageContent text={msg.text} isBot={msg.sender === 'Rundi AI'} />
                      )}
                    </div>

                    {!editingMessageId && (
                      <div className={`mt-1 flex items-center gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => copyToClipboard(msg.text, msg.id)}
                            className="p-1.5 sm:p-2 hover:bg-[#147E4E]/10 dark:hover:bg-white/5 rounded-md transition-colors text-muted-foreground dark:text-gray-500 hover:text-[#147E4E] dark:hover:text-white"
                            title="Copy"
                          >
                            {copiedId === msg.id ? (
                              <Check className="h-4 w-4 sm:h-5 sm:w-5 text-[#147E4E]" />
                            ) : (
                              <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                            )}
                          </button>

                          {msg.sender === 'Rundi AI' ? (
                            <button
                              onClick={() => handleShare(msg)}
                              className="p-1.5 sm:p-2 hover:bg-[#147E4E]/10 dark:hover:bg-white/5 rounded-md transition-colors text-muted-foreground dark:text-gray-500 hover:text-[#147E4E] dark:hover:text-white"
                              title="Share"
                            >
                              <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEdit(msg)}
                              className="p-1.5 sm:p-2 hover:bg-[#147E4E]/10 dark:hover:bg-white/5 rounded-md transition-colors text-muted-foreground dark:text-gray-500 hover:text-[#147E4E] dark:hover:text-white"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                          )}
                        </div>

                        <div className="text-[10px] sm:text-xs text-muted-foreground dark:text-gray-500">
                          {msg.timestamp} • {msg.category}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[82%] rounded-2xl px-1 py-1 text-sm bg-transparent">
                    <TypingIndicator />
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} className="h-0" />
          </div>

          <InputArea
            input={input}
            setInput={setInput}
            loading={loading}
            isTyping={isTyping}
            sendMessage={sendMessage}
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
