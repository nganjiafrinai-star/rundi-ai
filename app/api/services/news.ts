import { get } from '../utils/api-client'
import { API_ENDPOINTS, getEndpointUrl } from '../config/endpoints'
import type {
    NewsArticle,
    NewsSearchFilters,
    NewsSearchResult,
} from '../types/news.types'

function extractArticlesFromPayload(payload: any): any[] {
    if (!payload) return []
    if (payload.response && Array.isArray(payload.response.results)) return payload.response.results
    if (Array.isArray(payload)) return payload
    if (Array.isArray(payload.articles)) return payload.articles
    if (Array.isArray(payload.results)) return payload.results
    if (Array.isArray(payload.items)) return payload.items
    if (Array.isArray(payload.data?.articles)) return payload.data.articles
    if (Array.isArray(payload.data?.results)) return payload.data.results
    if (Array.isArray(payload.data)) return payload.data
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
    const { category = 'all', query = '', language = 'en' } = filters as any

    try {
        const baseUrl = "https://content.guardianapis.com/search"
        const cleanQuery = query.trim()
        const GUARDIAN_API_KEY = "test" // Public test key provided by Guardian documentation

        const attempts: Record<string, string>[] = [
            {
                "api-key": GUARDIAN_API_KEY,
                "show-fields": "all",
                "lang": language,
                ...(cleanQuery ? { q: cleanQuery } : {}),
                ...(category !== 'all' ? { section: category } : {}),
            },
            {
                "api-key": GUARDIAN_API_KEY,
                "show-fields": "thumbnail,trailText,byline",
                "lang": language,
                ...(cleanQuery ? { q: cleanQuery } : {}),
            },
            {
                "api-key": GUARDIAN_API_KEY,
                "lang": language,
            },
        ]

        let lastError: string | null = null

        for (const paramsObj of attempts) {
            const params = new URLSearchParams(paramsObj)
            const requestUrl = `${baseUrl}?${params.toString()}`

            const response = await get<any>(requestUrl)
            if (response.error) {
                lastError = response.error
                continue
            }

            const results = extractArticlesFromPayload(response.data)
            if (!results.length) {
                continue
            }

            const articles: NewsArticle[] = results.map((item: any, index: number) => {
                const rawId = String(item.id || item.webUrl || `${Date.now()}-${index}`)
                const safeId = toSafeArticleId(rawId, index)
                const fields = item.fields || {}

                return {
                    id: safeId,
                    title: item.webTitle || 'Untitled',
                    description: fields.trailText || fields.standfirst || '',
                    content: fields.bodyText || fields.body || '',
                    category: item.sectionName || category,
                    source: 'The Guardian',
                    author: fields.byline || null,
                    date: formatDate(item.webPublicationDate || new Date().toISOString()),
                    readTime: calculateReadTime(fields.bodyText || fields.body || ''),
                    image: fields.thumbnail || null,
                    url: item.webUrl || '#',
                    featured: index === 0,
                }
            })

            return { articles, total: articles.length }
        }

        if (lastError) throw new Error(lastError)
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
