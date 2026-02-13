import { get } from '../utils/api-client'
import { API_ENDPOINTS, getEndpointUrl } from '../config/endpoints'
import type {
    NewsArticle,
    NewsSearchFilters,
    NewsSearchResult,
} from '../types/news.types'

export async function searchNews(
    filters: NewsSearchFilters = {}
): Promise<NewsSearchResult> {
    const { category = 'all', query = '' } = filters as any

    try {
        const baseUrl = getEndpointUrl('DISCOVER', API_ENDPOINTS.DISCOVER.EVERYTHING)
        const params = new URLSearchParams({
            language: 'fr',
            sort_by: 'publishedAt'
        })

        if (query.trim()) {
            params.append('q', query.trim())
        }

        if (category !== 'all') {
            params.append('category', category)
        }

        const response = await get<any>(`${baseUrl}?${params.toString()}`)

        if (response.data) {
            const results = response.data.articles || response.data.results || []
            const articles: NewsArticle[] = results.map((item: any, index: number) => {
                const rawId = item.article_id || item.url || `${Date.now()}-${index}`;

                let safeId = '';
                try {
                    safeId = btoa(unescape(encodeURIComponent(rawId)))
                        .replace(/\//g, '_')
                        .replace(/\+/g, '-')
                        .replace(/=/g, '');
                } catch (e) {
                    safeId = `news-${Date.now()}-${index}`;
                }

                return {
                    id: safeId,
                    title: item.title || 'Untitled',
                    description: item.description || item.content?.substring(0, 200) || '',
                    content: item.content || item.description || '',
                    category: item.category?.[0] || category,
                    source: item.source_id || item.source?.name || 'Unknown Source',
                    author: item.creator?.[0] || item.author || null,
                    date: formatDate(item.publishedAt || item.pubDate || new Date().toISOString()),
                    readTime: calculateReadTime(item.content || item.description || ''),
                    image: item.image_url || item.urlToImage || null,
                    url: item.link || item.url || '#',
                    featured: index === 0,
                };
            })

            return { articles, total: articles.length }
        }

        if (response.error) throw new Error(response.error)
    } catch (error) {
        console.error('Discover API error:', error)
    }

    return { articles: [], total: 0 }
}


function formatDate(dateString: string): string {
    try {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffHours < 1) return 'Just now'
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`

        return date.toLocaleDateString()
    } catch {
        return 'Recently'
    }
}


function calculateReadTime(content: string): string {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return `${minutes} min read`
}
