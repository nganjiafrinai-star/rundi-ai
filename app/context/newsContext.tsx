"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { NewsArticle } from '@/app/api/types/news.types';
import { searchNews } from '@/app/api/services/news';

interface NewsContextType {
    articles: NewsArticle[];
    loading: boolean;
    error: string | null;
    activeCategory: string;
    searchQuery: string;
    favorites: string[];
    setActiveCategory: (category: string) => void;
    setSearchQuery: (query: string) => void;
    toggleFavorite: (id: string) => void;
    fetchNews: (force?: boolean) => Promise<void>;
    getArticleById: (id: string) => Promise<NewsArticle | undefined>;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState<string[]>([]);

    // Use a ref to track if we've already fetched for the current state to avoid redundant calls
    const lastFetchParams = useRef({ category: '', query: '' });
    const isInitialMount = useRef(true);

    // Load favorites from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('rundi_news_favorites');
        if (saved) {
            try {
                setFavorites(JSON.parse(saved));
            } catch (e) {
                console.error('Error loading favorites:', e);
            }
        }
    }, []);

    // Save favorites to localStorage
    useEffect(() => {
        if (!isInitialMount.current) {
            localStorage.setItem('rundi_news_favorites', JSON.stringify(favorites));
        }
    }, [favorites]);

    const fetchNews = useCallback(async (force = false) => {
        // If not forcing and params haven't changed, and we have articles, don't fetch
        if (!force &&
            lastFetchParams.current.category === activeCategory &&
            lastFetchParams.current.query === searchQuery &&
            articles.length > 0) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            if (activeCategory === 'favorites') {
                const result = await searchNews({ category: 'all', query: searchQuery });
                const favoritedArticles = result.articles.filter(art => favorites.includes(art.id));
                setArticles(favoritedArticles);
            } else {
                const result = await searchNews({ category: activeCategory as any, query: searchQuery });
                setArticles(result.articles);
            }
            lastFetchParams.current = { category: activeCategory, query: searchQuery };
        } catch (err) {
            setError('Failed to load news. Please try again later.');
            console.error('Error fetching news:', err);
        } finally {
            setLoading(false);
            isInitialMount.current = false;
        }
    }, [activeCategory, searchQuery, favorites, articles.length]);

    // Initial fetch and fetch on filter change
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchNews();
        }, searchQuery ? 500 : 0);

        return () => clearTimeout(timer);
    }, [activeCategory, searchQuery, fetchNews]);

    const toggleFavorite = (id: string) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
        );
    };

    const getArticleById = useCallback(async (id: string): Promise<NewsArticle | undefined> => {
        // 1. Try to find in existing articles
        const existing = articles.find(article => article.id === id);
        if (existing) return existing;

        // 2. If not found, try to decode the ID to get the original URL/ID and search for it
        try {
            const rawId = decodeURIComponent(escape(atob(id.replace(/_/g, '/').replace(/-/g, '+'))));
            const result = await searchNews({ query: rawId });

            // The search might return multiple results, find the exact match
            const article = result.articles.find(a => a.id === id) || result.articles[0];

            if (article) {
                // Add to list so we don't fetch it again
                setArticles(prev => {
                    if (prev.find(p => p.id === article.id)) return prev;
                    return [...prev, article];
                });
                return article;
            }
        } catch (e) {
            console.error('Error fetching article by ID:', e);
        }

        return undefined;
    }, [articles]);

    return (
        <NewsContext.Provider value={{
            articles,
            loading,
            error,
            activeCategory,
            searchQuery,
            favorites,
            setActiveCategory,
            setSearchQuery,
            toggleFavorite,
            fetchNews,
            getArticleById
        }}>
            {children}
        </NewsContext.Provider>
    );
};

export const useNews = () => {
    const context = useContext(NewsContext);
    if (context === undefined) {
        throw new Error('useNews must be used within a NewsProvider');
    }
    return context;
};
