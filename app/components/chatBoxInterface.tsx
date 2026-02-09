'use client'

import { useRef, useEffect, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { Send, Bot, Paperclip, ChevronDown, Copy, Share2, Pencil, Check } from 'lucide-react'
import { useChat } from '@/app/context/chatContext'
import { useLanguage } from '@/app/context/languageContext'
import ReactMarkdown from 'react-markdown'

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

const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index])
        setIndex((prev) => prev + 1)
      }, 10)
      return () => clearTimeout(timeout)
    }
  }, [index, text])

  return <MessageContent text={displayedText} isBot={true} />
}

interface InputAreaProps {
  input: string
  setInput: (v: string) => void
  loading: boolean
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
}

const InputArea = ({
  input,
  setInput,
  loading,
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
}: InputAreaProps) => (
  <div className={`p-4 ${className}`}>
    <div
      className="mx-auto max-w-3xl relative rounded-2xl
        border border-slate-200 dark:border-gray-800
        bg-white dark:bg-gray-800 shadow-sm transition-all"
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full resize-none bg-transparent p-4 pr-28 pb-16
            text-slate-900 dark:text-gray-100 focus:outline-none min-h-[120px]"
      />

      <div className="absolute left-3 bottom-3" ref={categoryRef}>
        <button
          type="button"
          onClick={() => setIsCategoryOpen((v) => !v)}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs
            bg-slate-50 dark:bg-gray-900
            text-slate-900 dark:text-gray-100
            border border-slate-200 dark:border-gray-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
        >
          {selectedCategory}
          <ChevronDown className={`h-4 w-4 transition ${isCategoryOpen ? 'rotate-180' : ''}`} />
        </button>

        {isCategoryOpen && (
          <div
            className="absolute bottom-full mb-2 w-40 rounded-xl overflow-hidden
            bg-white dark:bg-gray-800
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
                    ? 'bg-[#147E4E]/10 text-[#147E4E]'
                    : 'hover:bg-slate-50 dark:hover:bg-gray-700'
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="absolute right-3 bottom-3 flex items-center gap-2">
        <button
          type="button"
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className={`rounded-xl p-2 text-white transition cursor-pointer
            ${input.trim() && !loading
              ? 'bg-[#147E4E] hover:bg-[#0F6A3F]'
              : 'bg-[#147E4E]/40 cursor-not-allowed'
            }`}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
)

export default function ChatBoxInterface() {
  const { currentSession, updateSession } = useChat()
  const { t } = useLanguage()

  const chatCategories = [t.global, t.healthChat, t.breeding, t.commerce, t.agriculture]

  const [chatHistory, setChatHistory] = useState<ChatMsg[]>([])
  const [showWelcome, setShowWelcome] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState(chatCategories[0])
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeBotId, setActiveBotId] = useState<number | null>(null)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory, loading])

  useEffect(() => {
    if (currentSession?.state) {
      const s = currentSession.state
      setChatHistory(s.chatHistory || [])
      setSelectedCategory(s.selectedCategory || chatCategories[0])
      setShowWelcome((s.chatHistory || []).length === 0)
    } else {
      setChatHistory([])
      setSelectedCategory(chatCategories[0])
      setShowWelcome(true)
      setActiveBotId(null)
    }
  }, [currentSession?.id, t]) // Trigger reset on language change to update defaults

  useEffect(() => {
    if (!currentSession) return

    const timer = setTimeout(() => {
      const state = { chatHistory, selectedCategory }
      const lastMsg = chatHistory[chatHistory.length - 1]

      const title = lastMsg
        ? lastMsg.text.length > 25
          ? lastMsg.text.substring(0, 25) + '...'
          : lastMsg.text
        : `Chat: ${selectedCategory}`

      const preview = lastMsg ? lastMsg.text.substring(0, 50) : 'New conversation'

      if (
        currentSession.title !== title ||
        JSON.stringify(currentSession.state) !== JSON.stringify(state)
      ) {
        updateSession(currentSession.id, { state, title, preview })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [chatHistory, selectedCategory, currentSession?.id])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false)
      }
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
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Rundi AI Message',
          text: msg.text,
          url: window.location.href,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      copyToClipboard(msg.text, msg.id)
      alert('Link copied to clipboard (Sharing not supported in this browser)')
    }
  }

  const handleEdit = (msg: ChatMsg) => {
    setInput(msg.text)
    textareaRef.current?.focus()
  }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

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

    try {
      const { sendChatMessage } = await import('@/app/api/services/chat')
      const answer = await sendChatMessage(text, selectedCategory)

      const botChatId = Date.now() + 1
      const botChat: ChatMsg = {
        id: botChatId,
        text: answer,
        sender: 'Rundi AI',
        timestamp: nowTime(),
        category: selectedCategory,
      }

      setActiveBotId(botChatId)
      setChatHistory((prev) => [...prev, botChat])
    } catch (err: any) {
      const botChat: ChatMsg = {
        id: Date.now() + 1,
        text: err?.message || 'Error contacting server (check CORS / URL / backend running).',
        sender: 'Rundi AI',
        timestamp: nowTime(),
        category: selectedCategory,
      }
      setChatHistory((prev) => [...prev, botChat])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex-1 h-[calc(100vh-3.5rem)] flex flex-col bg-white dark:bg-gray-900 relative">
      {showWelcome ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-transparent to-black/[0.02] dark:to-white/[0.02]">
          <div className="w-full max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#147E4E] shadow-lg shadow-[#147E4E]/20">
                <Bot className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-gray-100 tracking-tight">
                  {t.welcome}
                </h1>
                <p className="text-xl text-slate-600 dark:text-gray-400">{t.subtitle}</p>
              </div>
            </div>
            <InputArea
              input={input}
              setInput={setInput}
              loading={loading}
              sendMessage={sendMessage}
              handleKeyDown={handleKeyDown}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              isCategoryOpen={isCategoryOpen}
              setIsCategoryOpen={setIsCategoryOpen}
              categories={chatCategories}
              textareaRef={textareaRef}
              categoryRef={categoryRef}
              className="!p-0"
              placeholder={t.placeholder}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
            <div className="mx-auto max-w-3xl space-y-6">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[82%] ${msg.sender === 'Rundi AI' ? 'w-full' : ''}`}>
                    <div
                      className={`rounded-2xl text-sm ${msg.sender === 'user'
                        ? 'bg-[#147E4E] text-white px-4 py-3 shadow-sm'
                        : 'bg-transparent text-slate-900 dark:text-gray-100 px-0 py-1'
                        }`}
                    >
                      {msg.sender === 'Rundi AI' && msg.id === activeBotId ? (
                        <TypewriterText text={msg.text} />
                      ) : (
                        <MessageContent text={msg.text} isBot={msg.sender === 'Rundi AI'} />
                      )}
                    </div>

                    <div
                      className={`mt-1 flex items-center gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => copyToClipboard(msg.text, msg.id)}
                          className="p-1 hover:bg-[#147E4E]/10 dark:hover:bg-white/5 rounded-md transition-colors text-gray-400 dark:text-gray-500 hover:text-[#147E4E] dark:hover:text-white"
                          title="Copy"
                        >
                          {copiedId === msg.id ? (
                            <Check className="h-3.5 w-3.5 text-[#147E4E]" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>

                        {msg.sender === 'Rundi AI' ? (
                          <button
                            onClick={() => handleShare(msg)}
                            className="p-1 hover:bg-[#147E4E]/10 dark:hover:bg-white/5 rounded-md transition-colors text-gray-400 dark:text-gray-500 hover:text-[#147E4E] dark:hover:text-white"
                            title="Share"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEdit(msg)}
                            className="p-1 hover:bg-[#147E4E]/10 dark:hover:bg-white/5 rounded-md transition-colors text-gray-400 dark:text-gray-500 hover:text-[#147E4E] dark:hover:text-white"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="text-[10px] text-gray-400 dark:text-gray-500">
                        {msg.timestamp} • {msg.category}
                      </div>
                    </div>
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

              <div ref={messagesEndRef} />
            </div>
          </div>
          <InputArea
            input={input}
            setInput={setInput}
            loading={loading}
            sendMessage={sendMessage}
            handleKeyDown={handleKeyDown}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            isCategoryOpen={isCategoryOpen}
            setIsCategoryOpen={setIsCategoryOpen}
            categories={chatCategories}
            textareaRef={textareaRef}
            categoryRef={categoryRef}
            placeholder={t.placeholder}
          />
        </>
      )}
    </div>
  )
}
