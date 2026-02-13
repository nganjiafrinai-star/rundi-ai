'use client'

import React, { useState, useEffect } from 'react'
import { Sun, Cloud, Droplets, Wind, Search, RefreshCw } from 'lucide-react'

// --- Interfaces & Types ---
export interface WeatherApiResponse {
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

export interface WeatherUIModel {
    location: string;
    country: string;
    temperature: number;
    condition: string;
    humidity: string;
    windSpeed: string;
}

// --- Adapters & Mappers ---
const mapWeatherApiToUI = (raw: WeatherApiResponse): WeatherUIModel => {
    return {
        location: raw.name || 'Bujumbura',
        country: raw.sys?.country || 'Burundi',
        temperature: Math.round(raw.main?.temp ?? 0),
        condition: raw.weather?.[0]?.main || 'Clear',
        humidity: `${raw.main?.humidity ?? 0}%`,
        windSpeed: `${raw.wind?.speed ?? 0} km/h`,
    };
}

// --- API Service ---
const fetchWeatherData = async (city: string = 'Bujumbura'): Promise<WeatherApiResponse> => {
    const response = await fetch(`http://192.168.1.21:8005/weather/${encodeURIComponent(city.toLowerCase())}`, {
        headers: {
            'accept': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Weather API failed: ${response.statusText}`);
    }

    return response.json();
}

// --- Component ---
const WeatherCard = () => {
    const [weather, setWeather] = useState<WeatherUIModel | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const performFetch = async (city: string = 'Bujumbura') => {
        setLoading(true)
        setError(null)
        try {
            const data = await fetchWeatherData(city)
            setWeather(mapWeatherApiToUI(data))
        } catch (err) {
            console.error('Weather Component Error:', err)
            setError('Ntitwashoboye kubona amakuru y\'ikirere. Gerageza kandi.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            performFetch(searchQuery.trim() || 'Bujumbura')
        }, 500)

        return () => clearTimeout(timer)
    }, [searchQuery])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        performFetch(searchQuery.trim() || 'Bujumbura')
    }

    // Loading State
    if (loading && !weather) {
        return (
            <div className="h-full min-h-[220px] bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 relative z-10">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-100/50" />
                    <p className="text-sm font-medium text-blue-100/80">Ikirere kiriko kirakurwa...</p>
                </div>
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </div>
        )
    }

    return (
        <div className="h-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative min-h-[220px] transition-all duration-500">
            <div className="relative z-10 flex flex-col h-full">
                {/* Search Header */}
                <form onSubmit={handleSearch} className="mb-4 relative group">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search city or country..."
                        className="w-full bg-white/10 border border-white/20 hover:border-white/40 focus:border-white/60 rounded-full py-1.5 pl-9 pr-4 text-xs text-white placeholder:text-blue-100/60 focus:outline-none focus:bg-white/15 transition-all"
                    />
                    <Search className="w-4 h-4 text-blue-100/60 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
                    {loading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <RefreshCw className="w-3 h-3 animate-spin text-blue-200" />
                        </div>
                    )}
                </form>

                {error && (
                    <div className="flex-1 flex flex-col items-center justify-center py-2 text-center">
                        <p className="text-xs mb-4 text-blue-50/90 max-w-[200px] leading-relaxed italic">{error}</p>
                        <button
                            onClick={() => performFetch(searchQuery || 'Bujumbura')}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 active:scale-95 rounded-xl text-[10px] font-bold transition-all flex items-center gap-2 border border-white/10"
                        >
                            <RefreshCw className="w-3 h-3" /> Retry
                        </button>
                    </div>
                )}

                {!error && weather && (
                    <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-black tracking-tight">{weather.location}</h3>
                                <div className="flex items-center gap-1.5 text-blue-100/80 text-xs font-semibold mt-0.5">
                                    <span className="uppercase tracking-wider opacity-80">{weather.country}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-start justify-end">
                                    <span className="text-4xl font-black tabular-nums">{weather.temperature}</span>
                                    <span className="text-xl font-bold mt-1 ml-0.5">°C</span>
                                </div>
                                <p className="text-blue-100/90 text-[10px] font-bold uppercase tracking-widest mt-1">{weather.condition}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-6">
                            <div className="relative">
                                {weather.condition.toLowerCase().includes('sun') || weather.condition.toLowerCase().includes('clear') ? (
                                    <Sun className="w-14 h-14 text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.5)] animate-pulse" />
                                ) : (
                                    <Cloud className="w-14 h-14 text-blue-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 flex-1 border-l border-white/10 pl-4">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5">
                                        <Droplets className="w-3.5 h-3.5 text-blue-200" />
                                        <span className="text-[10px] font-bold text-blue-100/60 uppercase tracking-tighter">Humidity</span>
                                    </div>
                                    <p className="text-sm font-bold tabular-nums">{weather.humidity}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5">
                                        <Wind className="w-3.5 h-3.5 text-blue-200" />
                                        <span className="text-[10px] font-bold text-blue-100/60 uppercase tracking-tighter">Wind</span>
                                    </div>
                                    <p className="text-sm font-bold tabular-nums">{weather.windSpeed}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white/10 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl opacity-30" />
        </div>
    )
}

export default WeatherCard
