'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, TrendingUp, Bookmark, Share2, ExternalLink, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useLanguage } from '@/app/context/languageContext'
import { searchNews } from '@/app/api/services/news'
import { NewsArticle } from '@/app/api/types/news.types'
import ArticleModal from './ArticleModal'
import { DiscoverLoadingSkeleton } from './SkeletonCard'

export default function DiscoverInterface() {
  const { t } = useLanguage()

  const categories = [
    'all', 'technology', 'business', 'health', 'world', 'sports',
    'entertainment', 'travel', 'science', 'politics', 'environment',
    'education', 'food', 'fashion', 'local', 'economy', 'finance',
    'gaming', 'ai', 'space'
  ]
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [refreshKey, setRefreshKey] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('rundi_news_favorites')
    if (saved) {
      try {
        setFavorites(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading favorites:', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('rundi_news_favorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    )
  }

  const handleShare = async (article: NewsArticle, e: React.MouseEvent) => {
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

  useEffect(() => {
    const fetchNewsData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await searchNews({
          category: activeCategory as any,
          query: searchQuery
        })
        setArticles(result.articles)
      } catch (err) {
        setError('Failed to load news. Please try again later.')
        console.error('Error fetching news:', err)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchNewsData()
    }, searchQuery ? 500 : 0)

    return () => clearTimeout(timer)
  }, [activeCategory, refreshKey, searchQuery])


  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedArticle(null), 200)
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % (articles.slice(0, 5).length || 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + (articles.slice(0, 5).length || 1)) % (articles.slice(0, 5).length || 1))
  }

  const featuredArticle = articles.length > 0 ? articles[0] : null
  const otherArticles = articles.length > 1 ? articles.slice(1, 7) : []
  const remainingArticles = articles.length > 7 ? articles.slice(7) : []
  const topNews = articles.slice(0, 8)

  return (
    <div className="min-h-screen text-base bg-white dark:bg-gray-900 focus:outline-none">
      <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-white/5">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-10 py-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-center gap-6">
            <div className="flex items-center gap-2 w-full max-w-2xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Kura amakuru ukoresheje ijambo..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-gray-800 rounded-lg text-sm transition-all text-slate-900 dark:text-white border-none focus:ring-1 focus:ring-green-500"
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
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${activeCategory === category
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700'
                    }`}
                >
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

      <div className="max-w-[1800px] mx-auto px-4 sm:px-10 py-6">
        {loading && <DiscoverLoadingSkeleton />}

        {error && !loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={() => setActiveCategory('all')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-[#005A9E] transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <div className="space-y-8">
            <div className="lg:hidden relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-slate-100 dark:border-white/5">
              <div className="relative h-[60vh] min-h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => handleArticleClick(articles[currentSlide])}
                  >
                    {articles[currentSlide].image ? (
                      <img
                        src={articles[currentSlide].image}
                        alt={articles[currentSlide].title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-800" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <span className="inline-block px-2 py-0.5 bg-green-600 text-[10px] font-bold rounded mb-2 uppercase">
                        {articles[currentSlide].category}
                      </span>
                      <h2 className="text-xl font-bold mb-2 line-clamp-2">
                        {articles[currentSlide].title}
                      </h2>
                      <p className="text-sm text-gray-300 mb-4 line-clamp-2 opacity-90">
                        {articles[currentSlide].description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-green-500">
                          {articles[currentSlide].source}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="absolute top-4 right-4 flex gap-1.5 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-md">
                {articles.slice(0, 5).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${currentSlide === idx ? 'bg-green-500 w-4' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                {featuredArticle && (
                  <article
                    onClick={() => handleArticleClick(featuredArticle)}
                    className="bg-white dark:bg-gray-800 rounded overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer border border-slate-100 dark:border-white/5"
                  >
                    <div className="relative h-[400px] xl:h-[500px] overflow-hidden">
                      {featuredArticle.image ? (
                        <img
                          src={featuredArticle.image}
                          alt={featuredArticle.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-800" />
                      )}
                      <div className="absolute inset-0 from-black/90 via-black/30 to-transparent" />

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
                              onClick={(e) => toggleFavorite(featuredArticle.id, e)}
                              className={`p-3 rounded backdrop-blur-md transition-all border border-white/10 ${favorites.includes(featuredArticle.id) ? 'bg-[#0078D4] text-white scale-110 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            >
                              <Bookmark className={`w-5 h-5 ${favorites.includes(featuredArticle.id) ? 'fill-current' : ''}`} />
                            </button>
                            <button
                              onClick={(e) => handleShare(featuredArticle, e)}
                              className="p-3 rounded bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-all border border-white/10"
                            >
                              <Share2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {otherArticles.map((article) => (
                    <article
                      key={article.id}
                      onClick={() => handleArticleClick(article)}
                      className="bg-white dark:bg-gray-800 rounded overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer border border-transparent dark:hover:border-white/5"
                    >
                      <div className="relative h-56 overflow-hidden">
                        {article.image ? (
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-800" />
                        )}
                        <span className="absolute top-4 left-4 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded border border-white/10">
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
                              onClick={(e) => toggleFavorite(article.id, e)}
                              className={`p-1.5 rounded-lg transition-colors ${favorites.includes(article.id) ? 'bg-green-600/10 text-green-600 dark:bg-green-600/20 dark:text-green-500' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
                            >
                              <Bookmark className={`w-4 h-4 ${favorites.includes(article.id) ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <aside className="lg:col-span-4 space-y-6">
                <div className="bg-slate-50/50 dark:bg-gray-800 rounded-xl p-6 border border-slate-200 dark:border-transparent">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-gray-100 mb-6 border-b border-slate-200 dark:border-gray-800 pb-3">
                    Top News Headlines
                  </h2>
                  <div className="space-y-6">
                    {topNews.map((article, index) => (
                      <div
                        key={index}
                        onClick={() => handleArticleClick(article)}
                        className="group cursor-pointer flex gap-4 items-center"
                      >
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 rounded overflow-hidden bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-white/10">
                            {article.image ? (
                              <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-green-600/20 to-green-800/20 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-green-600/40" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 group-hover:text-green-600 dark:group-hover:text-green-500 transition-colors line-clamp-2 leading-snug">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] items-center uppercase font-bold text-green-600">
                              {article.source}
                            </span>
                            <span className="text-[10px] text-gray-400">• {article.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}

        {!loading && !error && articles.length > 0 && remainingArticles.length > 0 && (
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-l-4 border-green-600 pl-4">More Stories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {remainingArticles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="bg-white dark:bg-gray-800 rounded overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="relative h-40 overflow-hidden">
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                </article>
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

      {selectedArticle && (
        <ArticleModal
          article={selectedArticle as NewsArticle}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onFavoriteToggle={toggleFavorite}
          onShare={handleShare}
          isFavorite={favorites.includes(selectedArticle.id)}
          allArticles={articles}
          onArticleClick={handleArticleClick}
        />
      )}
    </div>
  )
}
