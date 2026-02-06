
export type NewsCategory = 'technology' | 'business' | 'health' | 'world' | 'sports' | 'entertainment' | 'travel' | 'education'

export interface NewsArticle {
    id: string
    title: string
    description: string
    content: string
    category: string
    source: string
    author: string | null
    date: string
    readTime: string
    image: string | null
    url: string
    featured?: boolean
}

export interface NewsSearchFilters {
    category?: NewsCategory | 'all'
    language?: string
    country?: string
    query?: string
}

export interface NewsSearchResult {
    articles: NewsArticle[]
    total: number
}
