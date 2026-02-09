'use client'

import { useEffect, useMemo, useState, useRef, type ChangeEvent } from 'react'
import {
  ArrowLeftRight,
  Copy,
  Check,
  Share2,
} from 'lucide-react'
import { useChat } from '@/app/context/chatContext'
import { useLanguage } from '@/app/context/languageContext'
import { searchTranslationWords } from '@/app/api/services/translation'
import type { DictionaryEntry } from '@/app/api/types/dictionary.types'

type Lang = 'Français' | 'English' | 'Kirundi' | 'Swahili'

export default function TraductionInterface() {
  const { currentSession, updateSession } = useChat()
  const { t } = useLanguage()

  const [fromLang, setFromLang] = useState<Lang>('Kirundi')
  const [toLang, setToLang] = useState<Lang>('English')
  const [sourceText, setSourceText] = useState('')
  const [translatedText, setTranslatedText] = useState('')

  const [copied, setCopied] = useState<'source' | 'target' | null>(null)
  const [shared, setShared] = useState<'source' | 'target' | null>(null)


  const [isTranslating, setIsTranslating] = useState(false)
  const [translateError, setTranslateError] = useState<string | null>(null)

  const [suggestions, setSuggestions] = useState<DictionaryEntry[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false)

  const justSwapped = useRef(false)

  const otherLangs = useMemo<Lang[]>(() => ['Français', 'English', 'Swahili'], [])
  const allLangs = useMemo<Lang[]>(() => ['Kirundi', 'Français', 'English', 'Swahili'], [])

  useEffect(() => {
    if (currentSession?.state) {
      const s = currentSession.state
      setFromLang(s.fromLang || 'Kirundi')
      setToLang(s.toLang || 'English')
      setSourceText(s.sourceText || '')
      setTranslatedText(s.translatedText || '')
    } else {
      setFromLang('Kirundi')
      setToLang('English')
      setSourceText('')
      setTranslatedText('')
    }
  }, [currentSession?.id])

  useEffect(() => {
    if (!currentSession) return

    const timer = setTimeout(() => {
      const state = { fromLang, toLang, sourceText, translatedText }
      const title = sourceText.trim()
        ? sourceText.length > 25
          ? sourceText.substring(0, 25) + '...'
          : sourceText
        : `Translation (${fromLang} → ${toLang})`

      const preview = sourceText.trim() ? sourceText.substring(0, 50) : 'Empty translation'

      if (
        currentSession.title !== title ||
        JSON.stringify(currentSession.state) !== JSON.stringify(state)
      ) {
        updateSession(currentSession.id, { state, title, preview })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [fromLang, toLang, sourceText, translatedText, currentSession?.id])

  const ACCENT = '#147E4E' // Corrected to brand green
  const BG_LIGHT = 'bg-white'
  const BG_DARK = 'dark:bg-gray-900'
  const SURFACE_LIGHT = 'bg-white'
  const SURFACE_DARK = 'dark:bg-gray-800'
  const BORDER = 'border border-gray-100 dark:border-gray-800'
  const TEXT = 'text-slate-900 dark:text-gray-100'
  const MUTED = 'text-slate-500 dark:text-gray-400'
  const MUTED2 = 'text-slate-400 dark:text-gray-500'
  const SOFT = 'bg-gray-50/50 dark:bg-gray-900/60'
  const SOFT2 = 'bg-gray-100/50 dark:bg-gray-800/10'



  const swap = () => {
    const tempText = sourceText
    const tempLang = fromLang
    setSourceText(translatedText)
    setTranslatedText(tempText)
    setFromLang(toLang)
    setToLang(tempLang)
    setTranslateError(null)
    justSwapped.current = true
  }

  const translate = async () => {
    const text = sourceText.trim()
    if (!text) {
      setTranslatedText('')
      return
    }

    setIsTranslating(true)
    setTranslateError(null)

    try {
      const { translateText } = await import('@/app/api/services/translation')
      const result = await translateText(text, fromLang, toLang)
      setTranslatedText(result.text)
    } catch (err: any) {
      setTranslateError(err?.message || 'Translation failed.')
    } finally {
      setIsTranslating(false)
    }
  }


  useEffect(() => {
    if (justSwapped.current) {
      justSwapped.current = false
      return
    }

    const timer = setTimeout(() => {
      translate()
    }, 600)

    return () => clearTimeout(timer)
  }, [sourceText, toLang, fromLang])

  // Fetch suggestions when sourceText changes (only if fromLang is Kirundi)
  useEffect(() => {
    if (fromLang !== 'Kirundi' || !sourceText.trim() || sourceText.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const fetchSuggestions = async () => {
      setIsSearchingSuggestions(true)
      try {
        const results = await searchTranslationWords(sourceText, 10)
        const mappedResults: DictionaryEntry[] = results.map((raw: any, index: number) => ({
          id: raw.id || index,
          word: raw.ijambo || raw.word || '',
          meaning: raw.insiguro || raw.meaning || '',
          pos: 'noun',
          rawPos: raw.ubwoko || '',
          examples: raw.akarorero || [],
          synonyms: raw.ivyitiranwa || [],
          expressions: raw.imvugo || [],
          tags: []
        }))
        setSuggestions(mappedResults)
        setShowSuggestions(mappedResults.length > 0)
      } catch (err) {
        console.error('Failed to fetch suggestions:', err)
      } finally {
        setIsSearchingSuggestions(false)
      }
    }

    const timer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timer)
  }, [sourceText, fromLang])

  const copyText = async (text: string, key: 'source' | 'target') => {
    if (!text?.trim()) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(null), 1200)
    } catch {
      try {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        setCopied(key)
        setTimeout(() => setCopied(null), 1200)
      } catch {

      }
    }
  }

  const shareText = async (text: string, key: 'source' | 'target', label: string) => {
    if (!text?.trim()) return

    const shareData: ShareData = {
      title: 'Rundi AI Translation',
      text: `${label}\n\n${text}`,
    }

    try {
      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        await (navigator as any).share(shareData)
        setShared(key)
        setTimeout(() => setShared(null), 1200)
      } else {
        await copyText(text, key)
        setShared(key)
        setTimeout(() => setShared(null), 1200)
      }
    } catch {
      try {
        await copyText(text, key)
        setShared(key)
        setTimeout(() => setShared(null), 1200)
      } catch {

      }
    }
  }



  return (
    <div className={`min-h-[calc(100vh-3.5rem)] p-4 md:p-6 ${BG_LIGHT} ${BG_DARK}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className={`rounded ${BORDER} ${SURFACE_LIGHT} ${SURFACE_DARK} shadow-sm p-4`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={fromLang}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  const val = e.target.value as Lang
                  setFromLang(val)
                  if (val === 'Kirundi') {
                    if (toLang === 'Kirundi') setToLang('English')
                  } else {
                    setToLang('Kirundi')
                  }
                }}
                className={`px-3 py-2 text-sm rounded outline-none ${SOFT} ${TEXT} font-medium border border-transparent focus:border-[#147E4E] transition-all`}
              >
                {allLangs.map((l) => {
                  if (toLang !== 'Kirundi' && l !== 'Kirundi') return null
                  return (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  )
                })}
              </select>

              <button
                onClick={swap}
                className={`p-2 rounded hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition cursor-pointer`}
                title="Swap languages"
              >
                <ArrowLeftRight className={`w-4 h-4 ${TEXT}`} />
              </button>

              <select
                value={toLang}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  const val = e.target.value as Lang
                  setToLang(val)
                  if (val === 'Kirundi') {
                    if (fromLang === 'Kirundi') setFromLang('English')
                  } else {
                    setFromLang('Kirundi')
                  }
                }}
                className={`px-3 py-2 text-sm rounded outline-none ${SOFT} ${TEXT} font-medium border border-transparent focus:border-[#147E4E] transition-all`}
              >
                {allLangs.map((l) => {
                  if (fromLang !== 'Kirundi' && l !== 'Kirundi') return null
                  return (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  )
                })}
              </select>
            </div>

            {isTranslating && (
              <div className="flex items-center gap-2 text-xs text-[#147E4E] animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#147E4E]" />
                {t.translating || 'Translating...'}
              </div>
            )}
          </div>

          {translateError && (
            <div
              className={`mt-3 rounded ${BORDER} ${SOFT} px-3 py-2 text-xs text-red-600 dark:text-red-400`}
            >
              {translateError}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className={`h-full rounded ${BORDER} ${SURFACE_LIGHT} ${SURFACE_DARK} shadow-sm overflow-hidden`}>
            <div className="px-4 py-3 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
              <span className={`text-xs font-semibold ${TEXT}`}>{t.from}: {fromLang}</span>

              <div className="flex items-center gap-1">

                <button
                  onClick={() => copyText(sourceText, 'source')}
                  disabled={!sourceText.trim()}
                  className="p-2 rounded hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition disabled:opacity-40"
                  title="Copy"
                >
                  {copied === 'source' ? (
                    <Check className={`w-4 h-4 ${TEXT}`} />
                  ) : (
                    <Copy className={`w-4 h-4 ${TEXT}`} />
                  )}
                </button>

                <button
                  onClick={() => shareText(sourceText, 'source', `${t.from} (${fromLang})`)}
                  disabled={!sourceText.trim()}
                  className="p-2 rounded-xl hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition disabled:opacity-40"
                  title={t.share}
                >
                  {shared === 'source' ? (
                    <Check className={`w-4 h-4 ${TEXT}`} />
                  ) : (
                    <Share2 className={`w-4 h-4 ${TEXT}`} />
                  )}
                </button>
              </div>
            </div>

            <div className="p-4 relative">
              <textarea
                value={sourceText}
                onChange={(e) => {
                  setSourceText(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true)
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder={t.placeholder}
                className={`w-full h-[220px] resize-none rounded-2xl p-4 outline-none ${SOFT} ${BORDER} ${TEXT}
                  placeholder:text-black/35 dark:placeholder:text-white/35`}
                maxLength={4000}
              />

              {showSuggestions && suggestions.length > 0 && fromLang === 'Kirundi' && (
                <div className="absolute top-14 left-4 right-4 z-50 bg-white dark:bg-gray-800 border border-black/10 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 border-b border-black/5 dark:border-white/5 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Suggestions
                  </div>
                  <div className="max-h-[200px] overflow-y-auto no-scrollbar">
                    {suggestions.map((s) => (
                      <button
                        key={s.id}
                        onMouseDown={(e) => {
                          e.preventDefault() // Prevent blur
                          setSourceText(s.word)
                          setShowSuggestions(false)
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-green-50 dark:hover:bg-green-900/10 text-gray-900 dark:text-white border-b border-black/5 dark:border-white/5 last:border-0 transition-colors flex flex-col gap-0.5"
                      >
                        <div className="font-semibold text-[#147E4E] dark:text-green-400">{s.word}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate italic">{s.meaning}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className={`flex items-center justify-between text-xs ${MUTED2} mt-1`}>
                <span />
                <span>{sourceText.length}/4000</span>
              </div>
            </div>
          </div>

          <div className={`h-full rounded ${BORDER} ${SURFACE_LIGHT} ${SURFACE_DARK} shadow-sm overflow-hidden`}>
            <div className="px-4 py-3 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
              <span className={`text-xs font-semibold ${TEXT}`}>{t.to}: {toLang}</span>

              <div className="flex items-center gap-1">

                <button
                  onClick={() => copyText(translatedText, 'target')}
                  disabled={!translatedText.trim()}
                  className="p-2 rounded hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition disabled:opacity-40"
                  title="Copy"
                >
                  {copied === 'target' ? (
                    <Check className={`w-4 h-4 ${TEXT}`} />
                  ) : (
                    <Copy className={`w-4 h-4 ${TEXT}`} />
                  )}
                </button>

                <button
                  onClick={() => shareText(translatedText, 'target', `To (${toLang})`)}
                  disabled={!translatedText.trim()}
                  className="p-2 rounded hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition disabled:opacity-40"
                  title="Share"
                >
                  {shared === 'target' ? (
                    <Check className={`w-4 h-4 ${TEXT}`} />
                  ) : (
                    <Share2 className={`w-4 h-4 ${TEXT}`} />
                  )}
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className={`w-full min-h-[220px] rounded p-4 ${SOFT} ${BORDER}`}>
                {translatedText.trim() ? (
                  <p className={`text-sm whitespace-pre-line leading-relaxed ${TEXT}`}>{translatedText}</p>
                ) : (
                  <div className={`h-[220px] flex items-center justify-center text-sm ${MUTED}`}>
                    {isTranslating ? 'Translating...' : 'Translation will appear here…'}
                  </div>
                )}
              </div>

              <div className={`mt-2 flex items-center justify-between text-xs ${MUTED2}`}>
                <span />
                <span>{translatedText.length}/8000</span>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}
