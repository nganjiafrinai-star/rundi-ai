'use client'

import { X, ExternalLink, Clock, User, Calendar, Bookmark, Share2 } from 'lucide-react'
import { NewsArticle } from '@/app/api/types/news.types'
import { useEffect } from 'react'

interface ArticleModalProps {
    article: NewsArticle
    isOpen: boolean
    onClose: () => void
    onFavoriteToggle?: (id: string, e: React.MouseEvent) => void
    onShare?: (article: NewsArticle, e: React.MouseEvent) => void
    isFavorite?: boolean
}

export default function ArticleModal({
    article,
    isOpen,
    onClose,
    onFavoriteToggle,
    onShare,
    isFavorite
}: ArticleModalProps) {
    // Close modal on Escape key press
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-slate-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-[#0078D4] text-white text-xs font-semibold rounded">
                            {article.category}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-gray-400">
                            {article.source}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        {onFavoriteToggle && (
                            <button
                                onClick={(e) => onFavoriteToggle(article.id, e)}
                                className={`p-2 rounded-full transition-colors ${isFavorite ? 'bg-green-600/10 text-green-600' : 'hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-600 dark:text-gray-400'}`}
                                aria-label="Toggle favorite"
                            >
                                <Bookmark className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                            </button>
                        )}
                        {onShare && (
                            <button
                                onClick={(e) => onShare(article, e)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400 transition-colors"
                                aria-label="Share article"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5 text-slate-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto flex-1">
                    {article.image && (
                        <div className="relative w-full h-64 md:h-96 bg-gray-100 dark:bg-gray-800">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="px-6 py-8 md:px-12 md:py-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-gray-100 mb-4 leading-tight">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-gray-400 mb-6 pb-6 border-b border-slate-200 dark:border-gray-700">
                            {article.author && (
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>{article.author}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{article.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{article.readTime}</span>
                            </div>
                        </div>

                        <p className="text-lg text-slate-700 dark:text-gray-300 mb-6 leading-relaxed">
                            {article.description}
                        </p>

                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <p className="text-slate-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                                {article.content}
                            </p>
                        </div>

                        {article.url && article.url !== '#' && (
                            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-gray-700">
                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                >
                                    <span>Read full article on {article.source}</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
