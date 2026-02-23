'use client'

import { useParams, useRouter } from 'next/navigation'
import { useNews } from '@/app/context/newsContext'
import { ChevronLeft, Bookmark, Share2, Calendar, Clock, User } from 'lucide-react'
import { motion } from 'framer-motion'
import React from 'react'
import { NewsArticle } from '@/app/api/types/news.types'
import Link from 'next/link'

export default function NewsDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const { getArticleById, toggleFavorite, favorites, articles } = useNews()
    const [article, setArticle] = React.useState<NewsArticle | null>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const loadArticle = async () => {
            if (id) {
                const found = await getArticleById(id as string)
                setArticle(found || null)
                setLoading(false)
            }
        }
        loadArticle()
    }, [id, getArticleById])

    const isFavorite = article ? favorites.includes(article.id) : false

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-muted-foreground dark:text-gray-400">Amakuru ariko arashakwa...</p>
            </div>
        )
    }

    if (!article) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
                <h2 className="text-2xl font-bold mb-4">Amakuru ntiyabonetse</h2>
                <p className="text-muted-foreground dark:text-gray-400 mb-8">Ntabwo dushoboye kubona aya makuru kuko dushobora kuba twataye aho yari ari.</p>
                <button
                    onClick={() => router.push('/news')}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                    <ChevronLeft size={20} />
                    Subira ku makuru
                </button>
            </div>
        )
    }

    const handleShare = async () => {
        const shareData = {
            title: article.title,
            text: article.description,
            url: article.url,
        }

        if (navigator.share) {
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8"
        >
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-muted-foreground dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 mb-8 transition-colors group"
            >
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span className="font-medium">Inyuma</span>
            </button>

            <article className="bg-card dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-border dark:border-white/5">
                {article.image && (
                    <div className="relative h-[300px] sm:h-[450px] w-full">
                        <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="p-6 sm:p-10">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground dark:text-gray-400 mb-6">
                        <span className="px-3 py-1 bg-green-600/10 text-green-600 rounded-full font-bold uppercase text-[10px] tracking-wider">
                            {article.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            <span>{article.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} />
                            <span>{article.readTime}</span>
                        </div>
                        {article.author && (
                            <div className="flex items-center gap-1.5">
                                <User size={14} />
                                <span>{article.author}</span>
                            </div>
                        )}
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground dark:text-white mb-6 leading-tight">
                        {article.title}
                    </h1>

                    <div className="flex items-center justify-between py-6 border-y border-border dark:border-white/5 mb-8">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-muted-foreground dark:text-gray-300">
                                Source: <a href={article.url} className="text-green-600" target="_blank" rel="noopener noreferrer">{article.source}</a>
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => toggleFavorite(article.id)}
                                className={`p-2.5 rounded-full transition-all border ${isFavorite ? 'bg-green-600 border-green-600 text-white shadow-lg scale-110' : 'bg-muted dark:bg-gray-800 border-border dark:border-white/10 text-muted-foreground dark:text-gray-400 hover:border-green-600 hover:text-green-600'}`}
                            >
                                <Bookmark className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                            </button>
                            <button
                                onClick={handleShare}
                                className="p-2.5 rounded-full bg-muted dark:bg-gray-800 border border-border dark:border-white/10 text-muted-foreground dark:text-gray-400 hover:border-green-600 hover:text-green-600 transition-all shadow-sm"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-muted-foreground dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                            {article.content}
                        </p>
                    </div>
                </div>
            </article>

            {/* Similar News Section */}
            <div className="mt-16">
                <h2 className="text-2xl font-bold text-foreground dark:text-white mb-8 flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-green-600 rounded-full" />
                    Izindi nkuru zishobora kugushimisha
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles
                        .filter(a => a.category === article.category && a.id !== article.id)
                        .slice(0, 3)
                        .map((item) => (
                            <Link
                                key={item.id}
                                href={`/news/${item.id}`}
                                className="group bg-card dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-border dark:border-white/5 hover:shadow-md transition-all flex flex-col h-full"
                            >
                                <div className="relative h-48 w-full overflow-hidden">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-green-600/20 to-green-800/20 flex items-center justify-center">
                                            <span className="text-green-600 font-bold opacity-20">RUNDI AI</span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-[10px] font-bold text-white rounded-lg border border-white/10 uppercase tracking-wider">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5 flex-grow">
                                    <h3 className="font-bold text-foreground dark:text-white group-hover:text-green-600 transition-colors line-clamp-2 mb-3 leading-snug">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground dark:text-gray-400">
                                        <span className="font-bold text-green-600">{item.source}</span>
                                        <span>•</span>
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                </div>
            </div>
        </motion.div>
    )
}
