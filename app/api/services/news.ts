import { get } from '../utils/api-client'
import { API_ENDPOINTS, getEndpointUrl } from '../config/endpoints'
import type {
    NewsArticle,
    NewsSearchFilters,
    NewsSearchResult,
} from '../types/news.types'

function extractArticlesFromPayload(payload: any): any[] {
    if (!payload) return []
    
    // Handle the specific API schema: { totalArticles: number, articles: [...] }
    if (payload.articles && Array.isArray(payload.articles)) {
        return payload.articles
    }
    
    // Fallback to other possible structures
    if (payload.response && Array.isArray(payload.response.results)) return payload.response.results
    if (Array.isArray(payload.results)) return payload.results
    if (Array.isArray(payload.items)) return payload.items
    if (Array.isArray(payload.news)) return payload.news
    if (Array.isArray(payload.data?.articles)) return payload.data.articles
    if (Array.isArray(payload.data?.results)) return payload.data.results
    if (Array.isArray(payload.data?.news)) return payload.data.news
    if (Array.isArray(payload.data)) return payload.data
    if (Array.isArray(payload)) return payload
    
    return []
}

function toSafeArticleId(rawId: string, index: number): string {
    try {
        return btoa(unescape(encodeURIComponent(rawId)))
            .replace(/\//g, '_')
            .replace(/\+/g, '-')
            .replace(/=/g, '')
    } catch {
        return `news-${Date.now()}-${index}`
    }
}

export async function searchNews(
    filters: NewsSearchFilters = {}
): Promise<NewsSearchResult> {
    const { category = 'all', query = 'science', language = 'fr' } = filters as any

    try {
        const baseUrl = "http://192.168.1.223:8006/news/search"
        const cleanQuery = query.trim() || 'science'
        
        const params = new URLSearchParams({
            q: cleanQuery,
            lang: language,
            country: 'fr',
            max: '10'
        })

        const requestUrl = `${baseUrl}?${params.toString()}`

        const response = await get<any>(requestUrl)
        if (response.error) {
            throw new Error(response.error)
        }

        const results = extractArticlesFromPayload(response.data)
        if (!results.length) {
            return { articles: [], total: 0 }
        }

        const articles: NewsArticle[] = results.map((item: any, index: number) => {
            const rawId = String(item.url || `${Date.now()}-${index}`)
            const safeId = toSafeArticleId(rawId, index)

            return {
                id: safeId,
                title: item.title || 'Untitled',
                description: item.description || '',
                content: item.content || item.description || '',
                category: category || 'general',
                source: item.source?.name || 'Local News',
                author: null,
                date: formatDate(item.publishedAt || new Date().toISOString()),
                readTime: calculateReadTime(item.content || item.description || ''),
                image: item.image || null,
                url: item.url || '#',
                featured: index === 0,
            }
        })

        return { 
            articles, 
            total: response.data?.totalArticles || articles.length 
        }

    } catch (error) {
        console.error('News API error:', error)
        
        const fallbackArticles: NewsArticle[] = [
            {
                id: 'fallback-1',
                title: 'Latest Science News',
                description: 'Stay updated with the latest developments in science and technology.',
                content: 'Breaking news and updates from the world of science.',
                category: 'science',
                source: 'Local News',
                author: 'News Team',
                date: 'Just now',
                readTime: '2 min read',
                image: null,
                url: '#',
                featured: true,
            }
        ]
        return { articles: fallbackArticles, total: fallbackArticles.length }
    }
}

export async function getTopHeadlines(
    category: string = 'general',
    language: string = 'fr'
): Promise<NewsSearchResult> {
    try {
        const baseUrl = "http://192.168.1.223:8006/news/top-headlines"
        
        const params = new URLSearchParams({
            category: category,
            lang: language,
            country: 'fr',
            max: '10'
        })

        const requestUrl = `${baseUrl}?${params.toString()}`

        const response = await get<any>(requestUrl)
        if (response.error) {
            throw new Error(response.error)
        }

        const results = extractArticlesFromPayload(response.data)
        if (!results.length) {
            return { articles: [], total: 0 }
        }

        const articles: NewsArticle[] = results.map((item: any, index: number) => {
            const rawId = String(item.url || `top-${Date.now()}-${index}`)
            const safeId = toSafeArticleId(rawId, index)

            return {
                id: safeId,
                title: item.title || 'Untitled',
                description: item.description || '',
                content: item.content || item.description || '',
                category: category || 'general',
                source: item.source?.name || 'Local News',
                author: null,
                date: formatDate(item.publishedAt || new Date().toISOString()),
                readTime: calculateReadTime(item.content || item.description || ''),
                image: item.image || null,
                url: item.url || '#',
                featured: index === 0,
            }
        })

        return { 
            articles, 
            total: response.data?.totalArticles || articles.length 
        }

    } catch (error) {
        console.error('Top Headlines API error:', error)
        
        // Fallback to mock data if API fails
        const fallbackArticles: NewsArticle[] = [
            {
                id: 'top-fallback-1',
                title: 'Top News Headlines',
                description: 'Stay updated with the latest top news headlines.',
                content: 'Breaking news and top stories from around the world.',
                category: category,
                source: 'Local News',
                author: 'News Team',
                date: 'Just now',
                readTime: '3 min read',
                image: null,
                url: '#',
                featured: true,
            }
        ]
        return { articles: fallbackArticles, total: fallbackArticles.length }
    }
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
