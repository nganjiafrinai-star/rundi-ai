'use client'

import { useRef, useEffect, useState, type ChangeEvent, type KeyboardEvent, useMemo } from 'react'
import { Send, Bot, Paperclip, ChevronDown, Copy, Share2, Pencil, Check, X } from 'lucide-react'
import { useChat } from '@/app/context/chatContext'
import { useLanguage } from '@/app/context/languageContext'
import { ChatDomain } from '@/app/api/types/chat.types'
import ReactMarkdown from 'react-markdown'
import Footer2 from './footer2'

// Mapping localized categories to backend domains
// Mapping localized categories to backend domains and category names
const getCategoryMetadata = (categoryName: string, t: any): { domain: ChatDomain, category: string } => {
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
    <div className={`leading-relaxed ${isBot ? 'text-slate-900 dark:text-gray-100' : ''}`}>
      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1 mb-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-1 mb-2" {...props} />,
          li: ({ node, ...props }) => <li {...props} />,
          a: ({ node, ...props }) => (
            <a
              className="text-[#147E4E] hover:underline transition-all"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          strong: ({ node, ...props }) => <strong className="font-bold text-slate-800 dark:text-white" {...props} />,
          code: ({ node, ...props }) => (
            <code className="bg-slate-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
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
  sendMessage: () => void
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
}: InputAreaProps) => (
  <div className={`p-2 sm:p-4 ${className}`}>
    <div
      className="mx-auto max-w-[90%] relative rounded
        border dark:border-[#147E4E]-1
        bg-white dark:bg-[#36384F] shadow-sm transition-all w-full"
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full resize-none p-3 pr-12 sm:pr-28 pb-10 sm:pb-9
            text-slate-900 dark:text-gray-100 focus:outline-none min-h-[60px] sm:min-h-[80px] text-sm"
      />

      <div className="absolute left-2 sm:left-3 bottom-2 sm:bottom-3" ref={categoryRef}>
        <button
          type="button"
          onClick={() => setIsCategoryOpen((v) => !v)}
          className="flex items-center gap-1.5 sm:gap-2 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs
            bg-slate-50 dark:bg-black
            text-slate-900 dark:text-gray-100
            border border-slate-200 dark:border-gray-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
        >
          <span className="truncate max-w-[80px] sm:max-w-none">{selectedCategory}</span>
          <ChevronDown className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition ${isCategoryOpen ? 'rotate-180' : ''}`} />
        </button>

        {isCategoryOpen && (
          <div
            className="absolute bottom-full mb-2 w-40 rounded-xl overflow-hidden
            bg-white dark:bg-black/90
            border border-slate-200 dark:border-gray-800 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-200"
          >
            {categories.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => {
                  setSelectedCategory(c)
                  setIsCategoryOpen(false)
                }}
                className={`block w-full px-4 py-2 text-left text-xs cursor-pointer
                  ${selectedCategory === c
                    ? 'bg-[#147E4E]/10 text-white'
                    : 'hover:bg-slate-50 dark:hover:bg-gray-700'
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 flex items-center gap-1 sm:gap-2">
        <div className="relative" ref={attachmentRef}>
          <button
            type="button"
            onClick={() => setIsAttachmentOpen((v) => !v)}
            className="rounded-xl p-1.5 sm:p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          >
            <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {isAttachmentOpen && (
            <div className="absolute bottom-full right-0 mb-2 w-48 rounded-xl bg-white dark:bg-[#36384F] border border-slate-200 dark:border-gray-700 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <button
                onClick={() => {
                  onFileUpload()
                  setIsAttachmentOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                  <Paperclip className="h-4 w-4" />
                </div>
                <span>Document</span>
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={sendMessage}
          disabled={!input.trim() || loading || isTyping}
          className={`rounded-xl p-1.5 sm:p-2 text-white transition cursor-pointer
            ${input.trim() && !loading && !isTyping
              ? 'bg-[#1565c0] hover:bg-[#1565c0] hover:opacity-50'
              : 'bg-[#1565c0]/40 cursor-not-allowed opacity-50'
            }`}
        >
          <Send className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
    </div>

    <Footer2 />
  </div>
)

export default function ChatBoxInterface() {
  const { currentSession, updateSession } = useChat()
  const { t } = useLanguage()

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

  // Deduplication and Lock Refs
  const sendLock = useRef(false)
  const sentFingerprints = useRef<Map<string, Set<string>>>(new Map())

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory, loading, editingMessageId])

  useEffect(() => {
    // Reset UI state on session change
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
        if (idx !== -1) {
          setSelectedCategoryIndex(idx)
        }
      }
      setShowWelcome((s.chatHistory || []).length === 0)
    } else {
      setChatHistory([])
      setSelectedCategoryIndex(0)
      setShowWelcome(true)
    }
  }, [currentSession?.id])

  useEffect(() => {
    if (!currentSession) return

    const timer = setTimeout(() => {
      const bId = currentSession?.state?.backendSessionId
      const state = { chatHistory, selectedCategory, backendSessionId: bId }
      const lastMsg = chatHistory[chatHistory.length - 1]

      const title = lastMsg
        ? lastMsg.text.length > 25
          ? lastMsg.text.substring(0, 25) + '...'
          : lastMsg.text
        : `Chat: ${selectedCategory}`

      const preview = lastMsg ? lastMsg.text.substring(0, 50) : 'New conversation'

      if (currentSession.title !== title || JSON.stringify(currentSession.state) !== JSON.stringify(state)) {
        updateSession(currentSession.id, {
          state: { ...(currentSession.state || {}), ...state },
          title,
          preview,
          updatedAt: new Date()
        })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [chatHistory, selectedCategory, currentSession?.state?.backendSessionId, currentSession?.id])

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

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleShare = async (msg: ChatMsg) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Rundi AI Message',
          text: msg.text,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(msg.text)
        setCopiedId(msg.id)
        setTimeout(() => setCopiedId(null), 2000)
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(msg.text)
          setCopiedId(msg.id)
          setTimeout(() => setCopiedId(null), 2000)
        } catch {
          console.error('Failed to copy')
        }
      }
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
    if (!text || loading || isTyping || !currentSession) return

    // 1. Send Lock and Deduplication
    if (sendLock.current) return

    const sessionId = currentSession.id
    const fingerprint = text.toLowerCase()

    if (!sentFingerprints.current.has(sessionId)) {
      sentFingerprints.current.set(sessionId, new Set())
    }

    if (sentFingerprints.current.get(sessionId)?.has(fingerprint)) {
      console.warn('Duplicate message detected. Ignoring.')
      return
    }

    sendLock.current = true

    if (showWelcome) setShowWelcome(false)

    const userChat: ChatMsg = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: nowTime(),
      category: selectedCategory,
    }

    setChatHistory((prev) => [...prev, userChat])
    setInput('')
    setLoading(true)

    const FIXED_USER_ID = 'be4ff3ae-dc3c-49c1-b3e6-385e81d3a5dd'
    const { domain, category } = getCategoryMetadata(selectedCategory, t)

    let currentBackendId = currentSession?.state?.backendSessionId

    try {
      if (!currentBackendId) {
        // Fallback: Create backend session automatically
        const sessionRes = await fetch("/api/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: FIXED_USER_ID,
            first_message: text
          })
        })

        const sessionData = await sessionRes.json()
        if (!sessionRes.ok) throw new Error(sessionData.error || "Failed to create backend session")

        currentBackendId = sessionData.session_id || sessionData.id || sessionData.data?.session_id
        if (currentBackendId) {
          updateSession(currentSession!.id, {
            state: { ...(currentSession!.state || {}), backendSessionId: currentBackendId }
          })
        } else {
          throw new Error("Backend did not return a session_id")
        }
      }

      // 2. Send message to backend
      const payload = {
        message: text,
        domain: domain,
        category: category,
        language: "rn",
        user_id: FIXED_USER_ID,
        session_id: currentBackendId
      }

      console.log('Final API Payload from UI:', payload)

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()
      let answer = data.answer || data.reply || data.message || JSON.stringify(data)


      answer = answer.replace(/<(think|thought|regex)>[\s\S]*?<\/\1>/gi, '').trim()

      const botChatId = Date.now() + 1
      const botChat: ChatMsg = {
        id: botChatId,
        text: answer,
        sender: 'Rundi AI',
        timestamp: nowTime(),
        category: selectedCategory,
      }

      // Add to fingerprints after successful send
      sentFingerprints.current.get(sessionId)?.add(fingerprint)

      setIsTyping(true)
      setActiveBotId(botChatId)
      setChatHistory((prev) => [...prev, botChat])
    } catch (err: any) {
      const botChat: ChatMsg = {
        id: Date.now() + 1,
        text: err?.message || 'Error contacting server. Check backend connection.',
        sender: 'Rundi AI',
        timestamp: nowTime(),
        category: selectedCategory,
      }
      setChatHistory((prev) => [...prev, botChat])
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
    <div className="flex-1 h-[calc(100vh-3.5rem)] flex flex-col bg-white dark:bg-black">
      {showWelcome ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-transparent to-black/[0.02] dark:to-white/[0.02]">
          <div className="w-full max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl sm:rounded-3xl bg-[#36384F] shadow-lg shadow-[#147E4E]/20">
                <Bot className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-gray-100 tracking-tight">{t.welcome}</h1>
                <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-gray-400">{t.subtitle}</p>
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

          <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 pt-2 sm:pt-3 pb-4 sm:pb-6 custom-scrollbar">
            <div className="mx-auto max-w-3xl flex flex-col gap-2 sm:gap-3 md:gap-4">
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] md:max-w-[75%] lg:max-w-[65%] ${msg.sender === 'Rundi AI' ? 'w-full' : ''}`}>
                    <div
                      className={`rounded-2xl text-sm  ${msg.sender === 'user'
                        ? 'bg-[#1565C0] text-white px-4 py-3 shadow-sm w-fit px-4 py-2 rounded-lg break-words'
                        : 'bg-transparent text-slate-900 dark:text-gray-100 px-0 py-1'
                        }`}
                    >
                      {editingMessageId === msg.id ? (
                        <div className="w-full bg-white dark:bg-[#36384F] border border-slate-200 dark:border-[#147E4E]/30 rounded-2xl shadow-lg ring-1 ring-black/5 p-2 sm:p-3 transition-all animate-in fade-in zoom-in-95 duration-200">
                          <textarea
                            value={editedMessageContent}
                            onChange={(e) => setEditedMessageContent(e.target.value)}
                            className="w-full bg-transparent text-slate-900 dark:text-white rounded-xl p-3 text-sm focus:outline-none resize-none min-h-[100px] sm:min-h-[120px]"
                            autoFocus
                            placeholder="Edit your message..."
                          />
                          <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-gray-800">
                            <button
                              onClick={cancelEdit}
                              className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl text-slate-500 transition text-xs font-medium"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Cancel</span>
                            </button>
                            <button
                              onClick={() => saveEdit(msg.id)}
                              className="flex items-center gap-2 px-4 py-1.5 bg-[#1565C0] text-white rounded-xl hover:bg-[#0D47A1] transition text-xs font-medium shadow-sm shadow-[#1565C0]/20"
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
                      <div
                        className={`mt-1 flex items-center gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                      >
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => copyToClipboard(msg.text, msg.id)}
                            className="p-1.5 sm:p-2 hover:bg-[#147E4E]/10 dark:hover:bg-white/5 rounded-md transition-colors text-gray-400 dark:text-gray-500 hover:text-[#147E4E] dark:hover:text-white"
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
                              className="p-1.5 sm:p-2 hover:bg-[#147E4E]/10 dark:hover:bg-white/5 rounded-md transition-colors text-gray-400 dark:text-gray-500 hover:text-[#147E4E] dark:hover:text-white"
                              title="Share"
                            >
                              <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEdit(msg)}
                              className="p-1.5 sm:p-2 hover:bg-[#147E4E]/10 dark:hover:bg-white/5 rounded-md transition-colors text-gray-400 dark:text-gray-500 hover:text-[#147E4E] dark:hover:text-white"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                          )}
                        </div>

                        <div className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
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
