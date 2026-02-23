'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  Search,
  Cloud,
  Sun,
  Wind,
  Droplets,
  ArrowUpRight,
  ArrowDownRight,
  Newspaper,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { NewsArticle } from '@/app/api/types/news.types'
import { DiscoverLoadingSkeleton } from './SkeletonCard'
import { useNews } from '@/app/context/newsContext'


interface WeatherApiResponse {
  name: string;
  coord: { [key: string]: any };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: { all: number };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  dt: number;
}

interface WeatherUIModel {
  location: string;
  country: string;
  temperature: number;
  condition: string;
  humidity: string;
  windSpeed: string;
}

const mapWeatherApiToUI = (raw: WeatherApiResponse): WeatherUIModel => ({
  location: raw.name || 'Bujumbura',
  country: raw.sys?.country || 'Burundi',
  temperature: Math.round(raw.main?.temp ?? 0),
  condition: raw.weather?.[0]?.main || 'Clear',
  humidity: `${raw.main?.humidity ?? 0}%`,
  windSpeed: `${raw.wind?.speed ?? 0} km/h`,
})

const WeatherCard = () => {
  const [weather, setWeather] = useState<WeatherUIModel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchWeather = async (city: string = 'Bujumbura') => {
    setLoading(true)
    setError(null)
    try {
      const resp = await fetch(`/api/weather?city=${encodeURIComponent(city)}`, {
        headers: { 'accept': 'application/json' }
      })
      if (!resp.ok) throw new Error('API Error')
      const data: WeatherApiResponse = await resp.json()
      setWeather(mapWeatherApiToUI(data))
    } catch (err) {
      console.error(err)
      setError('Ikosa ryabaye mu kuraba ikirere.')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchWeather(searchQuery.trim() || 'Bujumbura')
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchWeather(searchQuery.trim() || 'Bujumbura')
  }

  return (
    <div className="h-full bg-gradient-to-br dark:bg-[#147E4E] rounded-2xl p-6 text-white shadow-lg overflow-hidden relative min-h-[220px]">
      <div className="relative z-10 flex flex-col h-full">
        {/* Search Field */}
        <form onSubmit={handleSubmit} className="mb-4 relative group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city or country..."
            className="w-full bg-white/10 border border-white/20 hover:border-white/40 focus:border-white/60 rounded-full py-1.5 pl-9 pr-4 text-sm text-white placeholder:text-blue-100/60 focus:outline-none transition-all"
          />
          <Search className="w-3.5 h-3.5 text-blue-100/60 absolute left-3 top-1/2 -translate-y-1/2" />
          {loading && (
            <RefreshCw className="w-3 h-3 text-white animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
          )}
        </form>

        {error && !loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <p className="text-[10px] text-blue-100">{error}</p>
            <button
              onClick={() => fetchWeather(searchQuery || 'Bujumbura')}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-[10px] uppercase font-bold"
            >
              Retry
            </button>
          </div>
        ) : weather ? (
          <>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold truncate max-w-[120px]">{weather.location}</h3>
                <p className="text-blue-100 text-xs opacity-80">{weather.country}</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black">{weather.temperature}°C</p>
                <p className="text-blue-100 text-[10px] mt-1 font-bold uppercase tracking-wider">{weather.condition}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 mt-auto">
              {weather.condition.toLowerCase().includes('sun') || weather.condition.toLowerCase().includes('clear') ? (
                <Sun className="w-12 h-12 text-yellow-300 animate-pulse" />
              ) : (
                <Cloud className="w-12 h-12 text-blue-100" />
              )}
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 opacity-70">
                    <Droplets className="w-3 h-3 text-blue-200" />
                    <span className="text-[9px] font-bold uppercase">Humidity</span>
                  </div>
                  <span className="text-sm font-bold">{weather.humidity}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 opacity-70">
                    <Wind className="w-3 h-3 text-blue-200" />
                    <span className="text-[9px] font-bold uppercase">Wind</span>
                  </div>
                  <span className="text-sm font-bold">{weather.windSpeed}</span>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
    </div>
  )
}
type SlideKey = 'suggestions' | 'markets' | 'crypto'

interface WatchItem {
  name: string
  change: string
  up: boolean
}

const WATCHLIST_SLIDES: { key: SlideKey; title: string }[] = [
  { key: 'suggestions', title: 'Watchlist Suggestions' },
  { key: 'markets', title: 'Markets' },
  { key: 'crypto', title: 'Cryptocurrencies' },
]

const MARKET_SYMBOLS = ['AAPL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'GOOGL'] as const
const MAX_WATCH_ITEMS = 6
const TIMEOUT_MS = 10000
const MAX_RETRIES = 3

const FALLBACK_TRENDS: WatchItem[] = [
  { name: 'Tech Innovation Surge', change: '+8.4%', up: true },
  { name: 'Green Energy Breakthrough', change: '+12.7%', up: true },
  { name: 'AI Market Disruption', change: '+5.9%', up: true },
  { name: 'Digital Currency Updates', change: '-1.2%', up: false },
  { name: 'Healthcare Advances', change: '+7.3%', up: true },
  { name: 'Climate Policy News', change: '+3.8%', up: true },
]

const WatchlistCard = () => {
  const [activeSlide, setActiveSlide] = useState(0)
  const [cache, setCache] = useState<Record<SlideKey, WatchItem[]>>({
    suggestions: [],
    markets: [],
    crypto: [],
  })
  const [loadingMap, setLoadingMap] = useState<Record<SlideKey, boolean>>({
    suggestions: false,
    markets: false,
    crypto: false,
  })
  const [errorMap, setErrorMap] = useState<Record<SlideKey, string | null>>({
    suggestions: null,
    markets: null,
    crypto: null,
  })

  const currentSlide = WATCHLIST_SLIDES[activeSlide]
  const slideItems = cache[currentSlide.key] ?? []
  const isLoading = !!loadingMap[currentSlide.key]
  const slideError = errorMap[currentSlide.key]

  const goToSlide = (direction: 'prev' | 'next') => {
    setActiveSlide((prev) => {
      if (direction === 'prev') {
        return (prev - 1 + WATCHLIST_SLIDES.length) % WATCHLIST_SLIDES.length
      }
      return (prev + 1) % WATCHLIST_SLIDES.length
    })
  }

  const mapMarketItem = (symbol: string, change: number): WatchItem => ({
    name: symbol,
    change: `${change.toFixed(2)}%`,
    up: change >= 0,
  })

  const fetchSlideData = React.useCallback(async (key: SlideKey, retryCount: number = 0) => {
    const setError = (target: SlideKey | SlideKey[], message: string) => {
      const keys = Array.isArray(target) ? target : [target]
      setErrorMap((prev) => {
        const next = { ...prev }
        keys.forEach((k) => {
          next[k] = message
        })
        return next
      })
    }

    if (key === 'suggestions') {
      if (loadingMap.suggestions) return
      setLoadingMap((prev) => ({ ...prev, suggestions: true }))
      setErrorMap((prev) => ({ ...prev, suggestions: null }))
      
      try {
        const apiKey = process.env.NEXT_PUBLIC_GNEWS_API_KEY
        
        if (!apiKey) {
          console.log('No GNews API key available, using fallback trends')
          setCache((prev) => ({ ...prev, suggestions: FALLBACK_TRENDS }))
          return
        }
        
        const response = await fetch(`https://gnews.io/api/v4/search?q=investment%20trends&apikey=${apiKey}`, {
          headers: {
            'Accept': 'application/json',
          },
        })
        
        if (!response.ok) {
          if (response.status === 403) {
            console.log('GNews API access forbidden (likely quota exceeded), using fallback trends')
            setCache((prev) => ({ ...prev, suggestions: FALLBACK_TRENDS }))
            return
          } else if (response.status === 429) {
            throw new Error('API rate limit exceeded. Using cached trends.')
          } else {
            throw new Error(`API temporarily unavailable (${response.status})`)
          }
        }
        
        const data = await response.json()
        
        const mappedSuggestions: WatchItem[] = (data.articles || [])
          .slice(0, MAX_WATCH_ITEMS)
          .map((article: any, index: number) => {
            const title = article.title || `News ${index + 1}`
            const publishedAt = new Date(article.publishedAt || Date.now())
            const isRecent = (Date.now() - publishedAt.getTime()) < (24 * 60 * 60 * 1000) 
            const randomTrend = (Math.random() * 12) + 3
            const changePercent = randomTrend.toFixed(1)
            const isUp = isRecent || Math.random() > 0.4 
            
            return {
              name: title.length > 55 ? title.substring(0, 52) + '...' : title,
              change: `${isUp ? '+' : '-'}${changePercent}%`,
              up: isUp,
            }
          })
          
        setCache((prev) => ({ ...prev, suggestions: mappedSuggestions }))
      } catch (err) {
        console.error('GNews API error:', err)
        // For user-facing errors, provide helpful messages and always fallback to trends
        const message = err instanceof Error ? err.message : 'API temporarily unavailable'
        console.log('Using fallback investment trends due to API error')
        setError('suggestions', message)
        setCache((prev) => ({ ...prev, suggestions: FALLBACK_TRENDS }))
      } finally {
        setLoadingMap((prev) => ({ ...prev, suggestions: false }))
      }
      return
    }

    if (loadingMap[key]) return

    setLoadingMap((prev) => ({ ...prev, [key]: true }))
    setErrorMap((prev) => ({ ...prev, [key]: null }))

    try {
      if (key === 'crypto') {
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)
          
          const resp = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h,7d', {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
            },
          })
          
          clearTimeout(timeoutId)
          
          if (!resp.ok) {
            if (resp.status === 429) {
              throw new Error('Rate limit exceeded. Please try again later.')
            }
            throw new Error(`Crypto API error: ${resp.status} ${resp.statusText}`)
          }
          
          const data = await resp.json()
          
          if (!Array.isArray(data)) {
            throw new Error('Invalid cryptocurrency data format')
          }
          
          const mapped: WatchItem[] = data
            .slice(0, MAX_WATCH_ITEMS)
            .map((item: any) => {
              const pct = Number(item.price_change_percentage_24h ?? 0)
              const symbol = String(item.symbol ?? '').toUpperCase()
              const name = item.name || `Coin ${symbol}`
              
              return {
                name: `${name} (${symbol})`,
                change: `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`,
                up: pct >= 0,
              }
            })
          
          if (mapped.length === 0) {
            throw new Error('No cryptocurrency data available')
          }
            
          setCache((prev) => ({ ...prev, crypto: mapped }))
          return
        } catch (cryptoErr) {
          if (retryCount < MAX_RETRIES && !(cryptoErr instanceof Error && cryptoErr.name === 'AbortError')) {
            console.log(`Retrying crypto fetch, attempt ${retryCount + 1}/${MAX_RETRIES}`)
            setTimeout(() => {
              fetchSlideData(key, retryCount + 1)
            }, Math.pow(2, retryCount) * 1000)
            return
          }
          throw cryptoErr
        }
      }

      if (key === 'markets') {
        try {
          const token = process.env.NEXT_PUBLIC_FINNHUB_KEY ?? 'd69ija9r01qm5rv42b90d69ija9r01qm5rv42b9g'
          if (!token) throw new Error('Missing Finnhub API key')
          
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)
          
          const quotes = await Promise.all(
            MARKET_SYMBOLS.map(async (symbol) => {
              try {
                const resp = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${token}`, {
                  signal: controller.signal,
                  headers: {
                    'Accept': 'application/json',
                  },
                })
                
                if (!resp.ok) {
                  console.warn(`Failed to fetch ${symbol}: ${resp.status}`)
                  return null
                }
                
                const data = await resp.json()
                
                if (data.error) {
                  console.warn(`API error for ${symbol}:`, data.error)
                  return null
                }
                
                const current = Number(data?.c ?? 0)
                const prevClose = Number(data?.pc ?? 0)
                
                if (current === 0 || prevClose === 0) {
                  console.warn(`Invalid data for ${symbol}: current=${current}, previous=${prevClose}`)
                  return null
                }
                
                const percent = ((current - prevClose) / prevClose) * 100
                return mapMarketItem(symbol, percent)
              } catch (err) {
                console.warn(`Error fetching ${symbol}:`, err)
                return null
              }
            })
          )
          
          clearTimeout(timeoutId)
          
          const validQuotes = quotes.filter(Boolean) as WatchItem[]
          
          if (validQuotes.length === 0) {
            throw new Error('No market data available')
          }
          
          setCache((prev) => ({ ...prev, markets: validQuotes.slice(0, MAX_WATCH_ITEMS) }))
          return
        } catch (marketErr) {
          // Retry logic for markets
          if (retryCount < MAX_RETRIES && !(marketErr instanceof Error && marketErr.name === 'AbortError')) {
            console.log(`Retrying markets fetch, attempt ${retryCount + 1}/${MAX_RETRIES}`)
            setTimeout(() => {
              fetchSlideData(key, retryCount + 1)
            }, Math.pow(2, retryCount) * 1000)
            return
          }
          throw marketErr
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load data'
      setError(key, message)
    } finally {
      setLoadingMap((prev) => ({ ...prev, [key]: false }))
    }
  }, [loadingMap])

  React.useEffect(() => {
    const key = WATCHLIST_SLIDES[activeSlide].key
    if (cache[key]?.length) return
    fetchSlideData(key)
  }, [activeSlide, cache, fetchSlideData])

  const renderSkeleton = () => (
    <div className="space-y-2 sm:space-y-3">
      {Array.from({ length: MAX_WATCH_ITEMS }).map((_, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 shadow-sm animate-pulse"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 dark:bg-gray-600 rounded-full" />
            <div className="space-y-1 sm:space-y-2">
              <div className="h-3 sm:h-4 w-28 sm:w-32 bg-gray-200 dark:bg-gray-600 rounded" />
              <div className="h-2 sm:h-3 w-16 sm:w-20 bg-gray-100 dark:bg-gray-700 rounded hidden sm:block" />
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="h-3 sm:h-4 w-12 sm:w-16 bg-gray-200 dark:bg-gray-600 rounded ml-auto" />
            <div className="h-2 sm:h-3 w-8 sm:w-12 bg-gray-100 dark:bg-gray-700 rounded ml-auto hidden sm:block" />
          </div>
        </div>
      ))}
    </div>
  )

  const renderList = () => (
    <div className="space-y-2 sm:space-y-3">
      {slideItems.slice(0, MAX_WATCH_ITEMS).map((item, idx) => (
        <div
          key={`${item.name}-${idx}`}
          className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 hover:border-gray-200 dark:hover:border-gray-500 hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                item.up ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {item.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-black dark:text-white truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {item.name}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 hidden sm:block">
                {currentSlide.key === 'suggestions' ? 'Investment News' : 
                 currentSlide.key === 'crypto' ? 'Cryptocurrency' :
                 currentSlide.key === 'markets' ? 'Stock Symbol' : 'Market Item'}
              </p>
            </div>
          </div>
          
          <div className="text-right flex-shrink-0 ml-2 sm:ml-3">
            <div className={`flex items-center gap-1 sm:gap-1.5 text-sm font-bold ${
              item.up ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
            }`}>
              {item.up ? (
                <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span className="text-xs sm:text-sm">{item.change}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 hidden sm:block">
              {item.up ? '↗ Rising' : '↘ Falling'}
            </p>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-200 hover:shadow-xl">
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6">
        <h3 className="font-bold text-black dark:text-white flex items-center gap-3">
          <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-500" />
          </div>
          <div>
            <div className="text-base sm:text-lg">{currentSlide.title}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {currentSlide.key === 'suggestions' ? 'Live investment news' : 'Real-time market data'}
            </div>
          </div>
        </h3>
        <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Page</div>
            <span className="text-xs font-semibold text-black dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              {activeSlide + 1}/{WATCHLIST_SLIDES.length}
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              aria-label={`Refresh ${currentSlide.title.toLowerCase()}`}
              onClick={() => fetchSlideData(currentSlide.key)}
              disabled={isLoading}
              className="p-2 sm:p-2.5 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 touch-manipulation"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              aria-label="Previous slide"
              onClick={() => goToSlide('prev')}
              className="p-2 sm:p-2.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 touch-manipulation"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              aria-label="Next slide"
              onClick={() => goToSlide('next')}
              className="p-2 sm:p-2.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 touch-manipulation"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-[280px] sm:min-h-[300px] flex flex-col justify-center">
        {isLoading
          ? renderSkeleton()
          : slideError
            ? (
              <div className="rounded-xl border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-400 p-4 sm:p-6 flex flex-col items-center gap-3 sm:gap-4 text-center">
                <div className="p-2 sm:p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-black dark:text-white mb-1 text-sm sm:text-base">Using Trending Topics</h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 px-2">
                    {slideError.includes('403') || slideError.includes('quota') || slideError.includes('forbidden') 
                      ? 'News API unavailable - showing popular investment trends' 
                      : 'Showing trending topics while we reconnect to news feeds'}
                  </p>
                </div>
                {!slideError.includes('403') && !slideError.includes('quota') && !slideError.includes('forbidden') && (
                  <button
                    onClick={() => fetchSlideData(currentSlide.key)}
                    className="px-4 py-2.5 sm:py-2 rounded-lg bg-yellow-600 dark:bg-yellow-700 text-white text-sm font-semibold hover:bg-yellow-700 dark:hover:bg-yellow-600 transition-colors flex items-center gap-2 touch-manipulation"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                )}
              </div>
            )
            : slideItems.length > 0
              ? renderList()
              : (
                <div className="text-center py-8 sm:py-12">
                  <div className="p-3 sm:p-4 rounded-full bg-gray-100 dark:bg-gray-700 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h4 className="font-semibold text-black dark:text-white mb-1 text-sm sm:text-base">No data available</h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Check back later for market updates</p>
                </div>
              )}
      </div>
    </div>
  )
}

const HeadlinesSlider = ({ articles }: { articles: NewsArticle[] }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const topNews = articles.slice(0, 5)

  if (topNews.length === 0) return null

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentSlide((prev) => (prev + 1) % topNews.length)
  }

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentSlide((prev) => (prev - 1 + topNews.length) % topNews.length)
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col transition-colors duration-200">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-green-600" />
          Top News Headlines
        </h3>
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            className="p-1.5 rounded-full bg-secondary dark:bg-secondary text-slate-600 dark:text-gray-400 hover:text-green-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            className="p-1.5 rounded-full bg-secondary dark:bg-secondary text-slate-600 dark:text-gray-400 hover:text-green-600 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative h-64 sm:h-72">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Link href={`/news/${topNews[currentSlide].id}`} className="block h-full relative group">
              {topNews[currentSlide].image ? (
                <img
                  src={topNews[currentSlide].image!}
                  alt={topNews[currentSlide].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-2 block">
                  {topNews[currentSlide].source}
                </span>
                <h4 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-green-400 transition-colors">
                  {topNews[currentSlide].title}
                </h4>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-3 bg-secondary dark:bg-secondary/30 flex justify-center gap-1.5">
        {topNews.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-6 bg-green-600' : 'w-2 bg-slate-300 dark:bg-gray-700'}`}
          />
        ))}
      </div>
    </div>
  )
}

// --- Main Interface ---

export default function DiscoverInterface() {
  const {
    articles,
    loading,
    error,
    activeCategory,
    searchQuery,
    newsLanguage,
    favorites,
    setActiveCategory,
    setSearchQuery,
    setNewsLanguage,
    toggleFavorite,
  } = useNews();

  const categories = [
    'all', 'technology', 'business', 'health', 'world', 'sports',
    'entertainment', 'travel', 'science', 'politics', 'environment',
    'education', 'food', 'fashion', 'local', 'economy', 'finance',
    'gaming', 'ai', 'space'
  ]

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [hasScrolledRight, setHasScrolledRight] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setHasScrolledRight(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth)
    }
  }

  // Check scroll position on mount
  React.useEffect(() => {
    checkScrollPosition()
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
      
      // Check scroll position after animation completes
      setTimeout(checkScrollPosition, 300)
    }
  }

  const handleShare = async (article: NewsArticle, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const shareData = {
      title: article.title,
      text: article.description,
      url: article.url,
    }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${article.title}\n${article.url}`)
        alert('Link copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy text: ', err)
      }
    }
  }

  const featuredArticle = articles.length > 0 ? articles[0] : null
  const otherArticles = articles.length > 1 ? articles.slice(1, 7) : []
  const remainingArticles = articles.length > 7 ? articles.slice(7) : []

  return (
    <div className="min-h-screen text-base bg-background focus:outline-none transition-colors duration-200">
      {/* Search and Categories Header */}
      <div
        className={[
          'w-full border-b border-border bg-background',
          'transition-colors duration-200',
        ].join(' ')}
      >
        <div className={[
          'max-w-[1800px] mx-auto px-4 sm:px-10 py-4 space-y-4',
        ].join(' ')}>
          <div className="flex flex-col md:flex-row md:items-center justify-start gap-6">
            <div className="flex items-center gap-2 w-full max-w-2xl">
              <div className="relative flex-1 justify-center">
                <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Kura amakuru ukoresheje ijambo..."
                  className="w-full pl-11 pr-4 py-2 bg-input border border-border rounded-full text-sm text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="relative flex items-center group">
            {hasScrolledRight && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 z-10 p-1.5 rounded-full bg-card dark:bg-gray-800 shadow-lg border border-border dark:border-white/10 text-muted-foreground dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            <div
              ref={scrollContainerRef}
              onScroll={checkScrollPosition}
              className="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-8 items-center no-scrollbar"
              style={{ scrollBehavior: 'smooth' }}
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeCategory === category
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700'
                    }`}
                >
                  {category === 'favorites' && <Bookmark className="w-3 h-3" />}
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {canScrollRight && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 z-10 p-1.5 rounded-full bg-card dark:bg-gray-800 shadow-lg border border-border dark:border-white/10 text-muted-foreground dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-10 py-8">
        {loading && <DiscoverLoadingSkeleton />}

        {error && !loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={() => setActiveCategory('all')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (News Feed) */}
            <div className="lg:col-span-8 space-y-8 order-2 lg:order-1">
              <div className="space-y-8">
                {featuredArticle && (
                  <Link
                    href={`/news/${featuredArticle.id}`}
                    className="block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer border border-slate-100 dark:border-white/5"
                  >
                    <div className="relative h-[400px] xl:h-[500px] overflow-hidden">
                      {featuredArticle.image ? (
                        <img
                          src={featuredArticle.image}
                          alt={featuredArticle.title}
                          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-800" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <span className="inline-block px-3 py-1 bg-green-600 text-xs font-bold rounded mb-3 tracking-wider uppercase">
                          Featured: {featuredArticle.category}
                        </span>
                        <h1 className="text-2xl md:text-3xl font-semibold mb-3 leading-tight tracking-tight">
                          {featuredArticle.title}
                        </h1>
                        <p className="text-gray-200 mb-4 line-clamp-2 text-lg leading-7 opacity-90">
                          {featuredArticle.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 text-sm text-gray-300">
                            <span className="font-bold flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              {featuredArticle.source}
                            </span>
                            <span>{featuredArticle.date}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(featuredArticle.id); }}
                              className={`p-3 rounded-xl backdrop-blur-md transition-all border border-white/10 ${favorites.includes(featuredArticle.id) ? 'bg-green-600 text-white scale-110 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            >
                              <Bookmark className={`w-5 h-5 ${favorites.includes(featuredArticle.id) ? 'fill-current' : ''}`} />
                            </button>
                            <button
                              onClick={(e) => handleShare(featuredArticle, e)}
                              className="p-3 rounded-xl bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-all border border-white/10"
                            >
                              <Share2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {otherArticles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/news/${article.id}`}
                      className="block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer border border-transparent dark:hover:border-white/5"
                    >
                      <div className="relative h-56 overflow-hidden">
                        {article.image ? (
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-800" />
                        )}
                        <span className="absolute top-4 left-4 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-lg border border-white/10">
                          {article.category}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-medium text-foreground dark:text-white mb-2 line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-500 transition-colors leading-6">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground dark:text-gray-400 mb-3 line-clamp-2 leading-6 opacity-80">
                          {article.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-[11px] text-muted-foreground dark:text-gray-500 font-medium">
                            {article.source} • {article.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(article.id); }}
                              className={`p-1.5 rounded-lg transition-colors ${favorites.includes(article.id) ? 'bg-green-600/10 text-green-600 dark:bg-green-600/20 dark:text-green-500' : 'hover:bg-muted dark:hover:bg-gray-800 text-muted-foreground dark:text-gray-400'}`}
                            >
                              <Bookmark className={`w-4 h-4 ${favorites.includes(article.id) ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (Widgets) */}
            <aside className="lg:col-span-4 space-y-8 order-1 lg:order-2">
              <WeatherCard />
              <WatchlistCard />
              <HeadlinesSlider articles={articles} />
            </aside>
          </div>
        )}

        {!loading && !error && (articles.length > 7) && (
          <div className="mt-12 space-y-8">
            <h2 className="text-2xl font-bold text-foreground dark:text-white flex items-center gap-3">
              <div className="w-1.5 h-8 bg-green-600 rounded-full" />
              More Stories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {remainingArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.id}`}
                  className="block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer border border-slate-100 dark:border-white/5"
                >
                  <div className="relative h-40 overflow-hidden">
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-800" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-green-600 transition-colors leading-6">
                      {article.title}
                    </h3>
                    <div className="text-sm text-gray-500 line-clamp-1">{article.source} • {article.date}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-gray-600 dark:text-gray-400">No articles found for this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
