'use client'

import React from 'react'
import WeatherCard from '@/app/components/main-area/WeatherCard'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function WeatherPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-slate-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="font-medium">Subira Dashboard</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Weather App</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-1">
                        <WeatherCard />
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-100 dark:border-white/5 shadow-sm space-y-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">About Weather App</h2>
                        <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                            Aya ni amakuru agezweho yerekeye ikirere mu Burundi no mu bindi bihugu.
                            Koresha agasanduku k'isuzuma (search) kugira ngo umenye uko ikirere cyifashe ahandi hantu.
                        </p>
                        <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Powered By</h3>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                Rundi-AI Weather Services
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
