'use client'

import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import {
  Search,
  SlidersHorizontal,
  Copy,
  Share2,
  Check,
  X,
  ArrowRight,
  Tag,
  Star,
  StarOff
} from 'lucide-react'

import { useChat } from '@/app/context/chatContext'
import { useLanguage } from '@/app/context/languageContext'
import { searchVerbs } from '@/app/api/services/verbs'
import type { VerbEntry } from '@/app/api/types/verbs.types'

type TenseKey = 'kubu' | 'kahises' | 'Kahise' | 'Kazoza'

type Conjugaisons = {
  [key in TenseKey]?: {
    label: string
    rows: Array<{ person: string; form: string }>
  }
} & {
  [key: string]: {
    label: string
    rows: Array<{ person: string; form: string }>
  } | undefined
}

// VerbEntry is imported from '@/app/api/types/verbs.types'

export default function VerbsInterface() {
  const { currentSession, updateSession } = useChat()
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState<'Kirundi'>('Kirundi')
  const [tense, setTense] = useState<string>('Indagihe')
  const [selectedId, setSelectedId] = useState<number>(1)

  const [copied, setCopied] = useState<'inf' | 'table' | null>(null)
  const [sharedOk, setSharedOk] = useState(false)

  const [speechSupported, setSpeechSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechError, setSpeechError] = useState<string | null>(null)

  const [favorites, setFavorites] = useState<Set<number>>(() => new Set([1]))
  const [onlyFavorites, setOnlyFavorites] = useState(false)

  const [verbs, setVerbs] = useState<VerbEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    if (currentSession?.state) {
      const s = currentSession.state
      setQuery(s.query || '')
      setLanguage(s.language || 'Kirundi')
      setTense(s.tense || 'kubu')
      setSelectedId(s.selectedId || 1)
      setOnlyFavorites(!!s.onlyFavorites)
    } else {
      setQuery('')
      setLanguage('Kirundi')
      setTense('kubu')
      setSelectedId(1)
      setOnlyFavorites(false)
    }
  }, [currentSession?.id])

  useEffect(() => {
    if (!currentSession) return

    const timer = setTimeout(() => {
      const state = { query, language, tense, selectedId, onlyFavorites }
      const title = query.trim() ? `Verbs: ${query}` : `Verbs (${language})`

      const preview = query.trim()
        ? `Exploring verb "${query}"`
        : 'Verb conjugation search'

      if (
        currentSession.title !== title ||
        JSON.stringify(currentSession.state) !== JSON.stringify(state)
      ) {
        updateSession(currentSession.id, { state, title, preview })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [query, language, tense, selectedId, onlyFavorites, currentSession?.id])

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setSearching(!!query.trim())
      setError(null)
      try {
        const result = await searchVerbs({ query, limit: 100 } as any)
        setVerbs(result.verbs)
      } catch (err) {
        setError('Failed to load verbs. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
        setSearching(false)
      }
    }
    fetchData()
  }, [query])


  const filtered = useMemo(() => {
    return verbs.filter((v) => {
      const matchesFavorites = onlyFavorites ? favorites.has(v.id) : true
      return matchesFavorites
    })
  }, [verbs, onlyFavorites, favorites])

  const suggestions = useMemo(() => {
    if (!query.trim() || !showSuggestions) return []
    const q = query.toLowerCase().trim()
    return verbs
      .filter(v => v.infinitive.toLowerCase().includes(q) || v.meaning.toLowerCase().includes(q))
      .slice(0, 5)
  }, [verbs, query, showSuggestions])

  const selected = useMemo(() => verbs.find((v) => v.id === selectedId), [verbs, selectedId])

  const isFav = (id?: number) => (id ? favorites.has(id) : false)
  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  useEffect(() => {
    setSpeechSupported(
      typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
    )
  }, [])

  const stopSpeaking = () => {
    if (typeof window === 'undefined') return
    try {
      window.speechSynthesis.cancel()
    } finally {
      setIsSpeaking(false)
    }
  }

  const speak = (text?: string) => {
    if (!text) return
    setSpeechError(null)

    if (!speechSupported) {
      setSpeechError('Speech is not supported in this browser.')
      return
    }

    try {
      stopSpeaking()
      const u = new SpeechSynthesisUtterance(text)
      u.rate = 0.95
      u.onstart = () => setIsSpeaking(true)
      u.onend = () => setIsSpeaking(false)
      u.onerror = () => {
        setIsSpeaking(false)
        setSpeechError('Could not play voice. Try another browser/voice.')
      }
      window.speechSynthesis.speak(u)
    } catch {
      setIsSpeaking(false)
      setSpeechError('Could not start speech.')
    }
  }

  const copyText = async (text: string, key: 'inf' | 'table') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(null), 1200)
    } catch { }
  }

  const shareText = async (text: string) => {
    setSharedOk(false)
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Verbs', text })
        setSharedOk(true)
        setTimeout(() => setSharedOk(false), 1200)
        return
      }
      await navigator.clipboard.writeText(text)
      setSharedOk(true)
      setTimeout(() => setSharedOk(false), 1200)
    } catch { }
  }

  const tenseTabs: { key: TenseKey; label: string }[] = [
    { key: 'kubu', label: 'Kubu' },
    { key: 'kahises', label: "Kahise k'impitakivi" },
    { key: 'Kahise', label: "Kahise k'indengagihe" },
    { key: 'Kazoza', label: 'Kazoza' }
  ] as const

  const groupLabel = (g: string) => {
    return 'Irivuga'
  }

  const currentTable = selected?.conjugaisons?.[tense]
  const sharePayload = selected
    ? `${selected.infinitive} — ${selected.meaning}\n\n${currentTable?.label ?? tense}\n${(currentTable?.rows ?? [])
      .map((r) => `${r.person}: ${r.form}`)
      .join('\n')}`
    : ''

  return (
    <div className="min-sm:h-screen bg-white dark:bg-gray-900 p-6">
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="rounded dark:border-white/10 bg-white dark:bg-gray-800 shadow-sm p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4  text-black/45 dark:text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setQuery(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder={t.search}
                  className="w-full pl-9 pr-3 py-2.5 text-sm  text-slate-900 dark:text-white focus:outline-none"
                />

                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-gray-800 border border-black/10 dark:border-white/10 rounded-lg shadow-lg overflow-hidden">
                    {suggestions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedId(s.id)
                          setQuery(s.infinitive)
                          setShowSuggestions(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-b border-black/5 dark:border-white/5 last:border-0"
                      >
                        <div className="font-semibold">{s.infinitive}</div>
                        <div className="text-xs text-gray-500 truncate">{s.meaning}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-sm  text-slate-900 dark:text-white focus:outline-none">
                Kirundi
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">

              <div className="text-xs text-gray-500 dark:text-gray-400 px-2">{filtered.length} results</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4">
          <div className="rounded dark:border-[#2A2A2A] bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-[#2A2A2A] flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-gray-200">{t.verbs} • {language}</span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">{t.chooseVerb}</span>
            </div>

            <div className="max-h-[420px] overflow-y-auto no-scrollbar">
              {filtered.length === 0 ? (
                <div className="p-6 text-sm text-gray-500 dark:text-gray-400">{t.noVerbsFound}.</div>
              ) : (
                filtered.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedId(v.id)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-100 dark:border-[#2A2A2A] transition ${selected?.id === v.id
                      ? 'bg-[#147E4E]/10 dark:bg-[#147E4E]/20'
                      : 'hover:bg-gray-50 dark:hover:bg-[#2A2A2A]'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white truncate">{v.infinitive}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full border border-gray-200 dark:border-[#2A2A2A] text-gray-600 dark:text-gray-300">
                            {groupLabel(v.group ?? 'other')}
                          </span>
                          {isFav(v.id) && <Star className="w-3.5 h-3.5 text-yellow-500" />}
                        </div>

                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">{v.meaning}</p>
                      </div>

                      <ArrowRight className="w-4 h-4 text-gray-400 mt-1" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="rounded dark:border-[#2A2A2A] bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-[#2A2A2A] flex items-center justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{t.conjugaison}</span>

                  {selected?.group && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full border border-gray-200 dark:border-[#2A2A2A] text-gray-600 dark:text-gray-300">
                      {groupLabel(selected.group)}
                    </span>
                  )}

                  {selected && isFav(selected.id) && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full border border-yellow-300/60 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300">
                      {t.favorites}
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  {selected ? `${selected.infinitive} — ${selected.meaning}` : t.chooseVerb}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => selected?.infinitive && copyText(selected.infinitive, 'inf')}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition"
                  title={t.copyInfinitive}
                >
                  {copied === 'inf' ? (
                    <Check className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                  )}
                </button>

                <button
                  onClick={() => selected && shareText(sharePayload)}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition"
                  title={t.share}
                  disabled={!selected}
                >
                  {sharedOk ? (
                    <Check className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                  ) : (
                    <Share2 className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                  )}
                </button>

                <button
                  onClick={() => selected && toggleFavorite(selected.id)}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition"
                  title={selected && isFav(selected.id) ? 'Kura mu vyishimiwe' : 'Shira mu vyishimiwe'}
                  disabled={!selected}
                >
                  {selected && isFav(selected.id) ? (
                    <Star className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <StarOff className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                  )}
                </button>
              </div>
            </div>

            <div className="overflow-y-auto no-scrollbar max-h-[420px]">
              <div className="px-4 pt-4">
                <div className="flex flex-wrap gap-2">
                  {tenseTabs.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setTense(t.key)}
                      className={`px-3 py-2 text-xs rounded-xl border transition ${tense === t.key
                        ? 'border-[#147E4E] bg-[#147E4E]/10 dark:bg-[#147E4E]/20 text-[#147E4E]'
                        : 'border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2A2A2A]'
                        }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4">
                <div className="rounded-2xl border border-gray-200 dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#2A2A2A] overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-[#2A2A2A] flex items-center justify-between">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                      {currentTable?.label ?? t.conjugaison}
                    </div>

                    <button
                      onClick={() => selected && copyText(sharePayload, 'table')}
                      className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition inline-flex items-center gap-2"
                      title={t.copyTense}
                      disabled={!selected}
                    >
                      {copied === 'table' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {t.copyTense}
                    </button>
                  </div>

                  <div className="divide-y divide-gray-200 dark:divide-[#2A2A2A]">
                    {(currentTable?.rows ?? []).map((r, idx) => (
                      <div key={idx} className="grid grid-cols-[140px_1fr] gap-3 px-4 py-3">
                        <div className="text-xs text-gray-600 dark:text-gray-300">{r.person}</div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{r.form}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {searching && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 dark:bg-black/20 backdrop-blur-[2px]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-4 border border-black/5 dark:border-white/10 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Muriko murahereye...</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Turiko turarondera inyishu zanyu</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
