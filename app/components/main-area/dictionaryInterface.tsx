'use client'

import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import {
  Search,
  SlidersHorizontal,
  Star,
  StarOff,
  Copy,
  ArrowRight,
  Check,
  Share2,
} from 'lucide-react'
import { DictionaryListSkeleton, DictionaryDetailSkeleton } from './SkeletonCard'

import { useChat } from '@/app/context/chatContext'
import { useLanguage } from '@/app/context/languageContext'
import { searchDictionary } from '@/app/api/services/dictionary'
import type { DictionaryEntry } from '@/app/api/types/dictionary.types'
import Footer2 from '../footer2'

export default function DictionaryInterface() {
  const { currentSession, updateSession } = useChat()
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState<'Kirundi' | 'Français' | 'English'>('Kirundi')
  const [posFilter, setPosFilter] = useState<'all' | DictionaryEntry['pos']>('all')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [selectedId, setSelectedId] = useState<number>(1)

  const [data, setData] = useState<DictionaryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Load state from session
  useEffect(() => {
    if (currentSession?.state) {
      const s = currentSession.state
      setQuery(s.query || '')
      setLanguage(s.language || 'Kirundi')
      setPosFilter(s.posFilter || 'all')
      setOnlyFavorites(!!s.onlyFavorites)
      setSelectedId(s.selectedId || 1)
    } else {
      setQuery('')
      setLanguage('Kirundi')
      setPosFilter('all')
      setOnlyFavorites(false)
      setSelectedId(1)
    }
  }, [currentSession?.id])

  // Sync state to session
  useEffect(() => {
    if (!currentSession) return

    const timer = setTimeout(() => {
      const state = { query, language, posFilter, onlyFavorites, selectedId }
      const title = query.trim() ? `Search: ${query}` : `Dictionary (${language})`
      const preview = query.trim() ? `Searching for "${query}"` : 'Dictionary search'

      if (
        currentSession.title !== title ||
        JSON.stringify(currentSession.state) !== JSON.stringify(state)
      ) {
        updateSession(currentSession.id, { state, title, preview })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [query, language, posFilter, onlyFavorites, selectedId, currentSession?.id])

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      if (data.length > 0) setSearching(true)
      else setLoading(true)

      setError(null)
      try {
        const result = await searchDictionary({ query, limit: 100 } as any)
        setData(result.entries)
      } catch (err) {
        setError('Failed to load dictionary data. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
        setSearching(false)
      }
    }

    const timer = setTimeout(() => {
      fetchData()
    }, query ? 400 : 0)

    return () => clearTimeout(timer)
  }, [query])

  const [copied, setCopied] = useState<'word' | 'definition' | null>(null)
  const [sharedOk, setSharedOk] = useState(false)

  const BG_LIGHT = 'bg-background'
  const SURFACE_LIGHT = 'bg-card'
  const BORDER = 'border border-border'
  const TEXT = 'text-foreground'
  const MUTED = 'text-muted-foreground'
  const MUTED2 = 'text-muted-foreground/80'
  const SOFT = 'bg-secondary'
  const SELECTED_ROW = 'bg-accent/20 dark:bg-[#143e24]'
  const SELECTED_PILL =
    'bg-accent/20 text-[#0F3D22] dark:bg-[#143e24] dark:text-[#BFF3D2]'

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return data
      .filter((e) => (posFilter === 'all' ? true : e.pos === posFilter))
      .filter((e) => (onlyFavorites ? favorites.has(e.id) : true))
      .filter((e) => {
        if (!q) return true
        const haystack = `${e.word} ${e.meaning} ${e.synonyms.join(' ')} ${e.tags.join(
          ' '
        )}`.toLowerCase()
        return haystack.includes(q)
      })
  }, [data, query, posFilter, onlyFavorites, favorites])

  const suggestions = useMemo(() => {
    if (!query.trim() || !showSuggestions) return []
    const q = query.toLowerCase().trim()
    return data
      .filter(
        (e) =>
          e.word.toLowerCase().includes(q) || e.meaning.toLowerCase().includes(q)
      )
      .slice(0, 5)
  }, [data, query, showSuggestions])

  const selected = useMemo(
    () => filtered.find((x) => x.id === selectedId) ?? filtered[0],
    [filtered, selectedId]
  )

  useEffect(() => {
    if (!filtered.length) return
    if (!filtered.some((x) => x.id === selectedId)) setSelectedId(filtered[0].id)
  }, [filtered, selectedId])

  const copy = async (text: string, kind: 'word' | 'definition') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(kind)
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
        setCopied(kind)
        setTimeout(() => setCopied(null), 1200)
      } catch {}
    }
  }

  const share = async (text: string) => {
    setSharedOk(false)
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Dictionary', text })
        setSharedOk(true)
        setTimeout(() => setSharedOk(false), 1200)
        return
      }
      await navigator.clipboard.writeText(text)
      setSharedOk(true)
      setTimeout(() => setSharedOk(false), 1200)
    } catch {}
  }

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const isFav = (id?: number) => (id ? favorites.has(id) : false)

  const posLabel = (pos: DictionaryEntry['pos']) =>
    pos === 'noun' ? 'Noun' : pos === 'verb' ? 'Verb' : pos === 'adj' ? 'Adjective' : 'Adverb'

  const sharePayload = selected
    ? `${selected.word} (${posLabel(selected.pos)}) — ${selected.meaning}\n\nExamples:\n${selected.examples
        .map((x) => `• ${x}`)
        .join('\n')}\n\nSynonyms: ${selected.synonyms.join(', ')}\nTags: ${selected.tags.join(', ')}`
    : ''

  return (
    <div className={`min-h-[calc(100vh-3.5rem)] p-4 md:p-6 ${BG_LIGHT} flex flex-col`}>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="flex-1 max-w-3xl mx-auto space-y-6">
        <div className={`rounded ${BORDER} ${SURFACE_LIGHT} shadow-sm p-4`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className={`w-4 h-4 ${MUTED2} absolute left-4 top-1/2 -translate-y-1/2`} />
                <input
                  value={query}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setQuery(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder={t.search}
                  className={`w-full pl-11 pr-4 py-2.5 text-sm bg-input border border-border rounded outline-none ${TEXT}
                    placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all`}
                />

                {suggestions.length > 0 && (
                  <div className={`absolute top-full left-0 right-0 z-10 mt-2 ${BORDER} rounded shadow-lg overflow-hidden ${SURFACE_LIGHT}`}>
                    {suggestions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedId(s.id)
                          setQuery(s.word)
                          setShowSuggestions(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-accent ${TEXT} border-b border-border last:border-0`}
                      >
                        <div className="font-semibold">{s.word}</div>
                        <div className="text-xs opacity-60 truncate">{s.meaning}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className={`px-3 py-2.5 text-sm rounded ${TEXT}`}>Kirundi</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded border border-border bg-input hover:bg-accent transition-colors">
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                <select
                  value={posFilter}
                  onChange={(e) => setPosFilter(e.target.value as any)}
                  className={`text-sm bg-transparent outline-none ${TEXT} font-medium cursor-pointer`}
                >
                  <option value="all">{t.allPosts}</option>
                  <option value="noun">izina</option>
                  <option value="verb">irivuga</option>
                  <option value="adj">inyito</option>
                  <option value="adv">Inshinga</option>
                </select>
              </div>

              <button
                onClick={() => setOnlyFavorites((v) => !v)}
                className={[
                  'px-4 py-2 text-xs rounded border border-border transition flex items-center gap-2 font-medium',
                  onlyFavorites ? `${SELECTED_PILL}` : `${SOFT} ${TEXT} hover:bg-accent`,
                ].join(' ')}
              >
                {onlyFavorites ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{onlyFavorites ? 'Favorites' : 'All'}</span>
              </button>
            </div>

            <div className={`text-xs ${MUTED} px-2`}>
              {loading ? '...' : `${filtered.length} results`}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4">
          <div className={`rounded ${BORDER} ${SURFACE_LIGHT} shadow-sm overflow-hidden`}>
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <span className={`text-xs font-semibold ${TEXT}`}>{language}</span>
              <span className={`text-[11px] ${MUTED2}`}>fyondako</span>
            </div>

            <div className="max-h-105 overflow-y-auto no-scrollbar">
              {loading ? (
                <DictionaryListSkeleton />
              ) : error ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-red-500 mb-2">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className={`text-xs font-semibold px-3 py-1.5 rounded ${SOFT} ${TEXT}`}
                  >
                    Retry
                  </button>
                </div>
              ) : filtered.length === 0 ? (
                <div className={`p-6 text-sm ${MUTED}`}>{t.noResults}.</div>
              ) : (
                filtered.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setSelectedId(e.id)}
                    className={[
                      'w-full text-left px-4 py-3 border-b border-border transition',
                      selected?.id === e.id ? SELECTED_ROW : 'hover:bg-accent',
                    ].join(' ')}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold truncate ${TEXT}`}>{e.word}</span>
                          <span className={`text-[11px] px-2 py-0.5 rounded-full ${BORDER} ${MUTED} bg-transparent`}>
                            {e.rawPos || posLabel(e.pos)}
                          </span>
                          {isFav(e.id) && <Star className="w-3.5 h-3.5 text-yellow-500" />}
                        </div>
                      </div>
                      <ArrowRight className={`w-4 h-4 ${MUTED2} mt-1`} />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className={`rounded ${BORDER} ${SURFACE_LIGHT} shadow-sm overflow-hidden`}>
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`text-xs font-semibold ${TEXT}`}>{t.definition}</span>
                {selected?.pos && (
                  <span className={`text-[11px] px-2 py-0.5 rounded ${BORDER} ${MUTED} bg-transparent`}>
                    {selected.rawPos || posLabel(selected.pos)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => selected?.word && copy(selected.word, 'word')}
                  className="p-2 rounded hover:bg-accent transition"
                  title={`${t.copy} word`}
                >
                  {copied === 'word' ? <Check className={`w-4 h-4 ${TEXT}`} /> : <Copy className={`w-4 h-4 ${TEXT}`} />}
                </button>

                <button
                  onClick={() => selected && share(sharePayload)}
                  className="p-2 rounded hover:bg-accent transition disabled:opacity-40"
                  title={t.share}
                  disabled={!selected}
                >
                  {sharedOk ? <Check className={`w-4 h-4 ${TEXT}`} /> : <Share2 className={`w-4 h-4 ${TEXT}`} />}
                </button>

                <button
                  onClick={() => selected && toggleFavorite(selected.id)}
                  className="p-2 rounded hover:bg-accent transition"
                  title={selected && isFav(selected.id) ? 'Remove favorite' : 'Add favorite'}
                >
                  {selected && isFav(selected.id) ? (
                    <Star className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <StarOff className={`w-4 h-4 ${TEXT}`} />
                  )}
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto no-scrollbar max-h-105">
              {loading ? (
                <DictionaryDetailSkeleton />
              ) : (
                <>
                  <div className={`rounded ${SOFT} ${BORDER} p-4`}>
                    <h2 className={`text-xl font-bold truncate ${TEXT}`}>
                      {selected?.word ?? 'Hadi ijambo rizoseruka hano'}
                    </h2>
                    <p className={`text-sm mt-2 leading-relaxed ${MUTED}`}>
                      {selected?.meaning ?? 'Hitamo ijambo mu rutonde kugira urabe insiguro yaryo.'}
                    </p>
                  </div>

                  <div className={`rounded ${BORDER} ${SURFACE_LIGHT} p-4`}>
                    <p className={`text-xs font-semibold mb-3 ${TEXT}`}>Uturorero:</p>
                    {selected?.examples?.length ? (
                      <ul className="space-y-2">
                        {selected.examples.map((ex, i) => (
                          <li key={i} className={`text-sm rounded ${SOFT} ${BORDER} p-3 ${TEXT}`}>
                            {ex}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`text-sm ${MUTED}`}>Nta karorero gahari.</p>
                    )}
                  </div>

                  <div className={`rounded ${BORDER} ${SURFACE_LIGHT} p-4`}>
                    <p className={`text-xs font-semibold mb-3 ${TEXT}`}>Ivyitiranwa:</p>
                    {selected?.synonyms?.length ? (
                      <ul className="space-y-2">
                        {selected.synonyms.map((syn, i) => (
                          <li key={i} className={`text-sm rounded ${SOFT} ${BORDER} p-3 ${TEXT}`}>
                            {syn}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`text-sm ${MUTED}`}>Nta vyitiranwa bihari.</p>
                    )}
                  </div>

                  <div className={`rounded ${BORDER} ${SURFACE_LIGHT} p-4`}>
                    <p className={`text-xs font-semibold mb-3 ${TEXT}`}>imvugo:</p>
                    {selected?.expressions?.length ? (
                      <ul className="space-y-2">
                        {selected.expressions.map((exp, i) => (
                          <li key={i} className={`text-sm rounded ${SOFT} p-3 ${TEXT}`}>
                            {exp}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`text-sm ${MUTED}`}>Nta mvugo zihari.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
          
      <Footer2 />

      </div>

    </div>
  )
}
