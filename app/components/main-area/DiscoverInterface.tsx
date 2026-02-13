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


// --- Weather Logic ---
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
      const resp = await fetch(`http://192.168.1.21:8005/weather/${encodeURIComponent(city.toLowerCase())}`, {
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
            className="w-full bg-white/10 border border-white/20 hover:border-white/40 focus:border-white/60 rounded-full py-1.5 pl-9 pr-4 text-[10px] text-white placeholder:text-blue-100/60 focus:outline-none transition-all"
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
const WatchlistCard = () => {
  const trends = [
    { name: 'GPT-5 Specs', change: '+12.4%', up: true },
    { name: 'Burundi Tech Hub', change: '+5.2%', up: true },
    { name: 'AI Regulation', change: '-2.1%', up: false },
    { name: 'Mining Tech', change: '+8.7%', up: true },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-100 dark:border-white/5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          Watchlist Suggestions
        </h3>
        <button className="text-xs text-green-600 font-bold hover:underline">View All</button>
      </div>
      <div className="space-y-4">
        {trends.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-gray-900/50 hover:bg-slate-100 dark:hover:bg-gray-900 transition-colors cursor-pointer">
            <span className="text-sm font-bold text-slate-700 dark:text-gray-300">{item.name}</span>
            <div className={`flex items-center gap-1 text-xs font-bold ${item.up ? 'text-green-600' : 'text-red-500'}`}>
              {item.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {item.change}
            </div>
          </div>
        ))}
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
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-green-600" />
          Top News Headlines
        </h3>
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            className="p-1.5 rounded-full bg-slate-100 dark:bg-gray-900 text-slate-600 dark:text-gray-400 hover:text-green-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            className="p-1.5 rounded-full bg-slate-100 dark:bg-gray-900 text-slate-600 dark:text-gray-400 hover:text-green-600 transition-colors"
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

      <div className="p-3 bg-slate-50 dark:bg-gray-900/30 flex justify-center gap-1.5">
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
    favorites,
    setActiveCategory,
    setSearchQuery,
    toggleFavorite,
  } = useNews();

  const categories = [
    'all', 'technology', 'business', 'health', 'world', 'sports',
    'entertainment', 'travel', 'science', 'politics', 'environment',
    'education', 'food', 'fashion', 'local', 'economy', 'finance',
    'gaming', 'ai', 'space'
  ]

  const scrollContainerRef = useRef<HTMLDivElement>(null)

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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const featuredArticle = articles.length > 0 ? articles[0] : null
  const otherArticles = articles.length > 1 ? articles.slice(1, 7) : []
  const remainingArticles = articles.length > 7 ? articles.slice(7) : []

  return (
    <div className="min-h-screen text-base bg-white dark:bg-gray-800 focus:outline-none">
      {/* Search and Categories Header */}
      <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-white/5">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-10 py-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-start gap-6">
            <div className="flex items-center gap-2 w-full max-w-2xl">
              <div className="relative flex-1 justify-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Kura amakuru ukoresheje ijambo..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-gray-800 rounded text-sm text-slate-900 dark:text-white "
                />
              </div>
            </div>
          </div>

          <div className="relative flex items-center group">
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 z-10 p-1.5 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={scrollContainerRef}
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

            <button
              onClick={() => scroll('right')}
              className="absolute right-0 z-10 p-1.5 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
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
                        <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                          {featuredArticle.title}
                        </h1>
                        <p className="text-gray-200 mb-4 line-clamp-2 text-base opacity-90">
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
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-500 transition-colors leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed opacity-80">
                          {article.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-[11px] text-gray-500 dark:text-gray-500 font-medium">
                            {article.source} • {article.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(article.id); }}
                              className={`p-1.5 rounded-lg transition-colors ${favorites.includes(article.id) ? 'bg-green-600/10 text-green-600 dark:bg-green-600/20 dark:text-green-500' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
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
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {article.title}
                    </h3>
                    <div className="text-[10px] text-gray-500 line-clamp-1">{article.source} • {article.date}</div>
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
