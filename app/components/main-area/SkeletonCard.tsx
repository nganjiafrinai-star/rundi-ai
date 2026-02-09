'use client'


export function FeaturedArticleSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm animate-pulse">
            <div className="relative h-[450px] bg-gray-200 dark:bg-gray-700">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
                    <div className="w-32 h-6 bg-gray-300 dark:bg-gray-600 rounded-lg" />
                    <div className="space-y-3">
                        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
                    </div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-full" />
                    <div className="flex items-center justify-between pt-4">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48" />
                        <div className="flex gap-2">
                            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full" />
                            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full" />
                            <div className="w-24 h-10 bg-white/20 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function ArticleCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm animate-pulse">
            <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                <div className="absolute top-4 left-4 w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
            </div>

            <div className="p-5 space-y-4">
                <div className="space-y-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </div>

                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
            </div>
        </div>
    )
}

export function SideHeadlineSkeleton() {
    return (
        <div className="flex gap-4 items-start py-2 animate-pulse">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
        </div>
    )
}

export function DiscoverLoadingSkeleton() {
    return (
        <div className="max-w-[1800px] mx-auto px-4 sm:px-10 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <FeaturedArticleSkeleton />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <ArticleCardSkeleton key={index} />
                        ))}
                    </div>
                </div>

                <aside className="lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-transparent dark:border-white/10 animate-pulse">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                            </div>
                        </div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-transparent dark:border-white/10">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6" />
                        <div className="space-y-6">
                            {[...Array(5)].map((_, index) => (
                                <SideHeadlineSkeleton key={index} />
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export function DictionaryListSkeleton() {
    return (
        <div className="space-y-0 animate-pulse">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="px-4 py-4 border-b border-black/5 dark:border-white/10 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                        </div>
                    </div>
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded mt-1" />
                </div>
            ))}
        </div>
    )
}

export function DictionaryDetailSkeleton() {
    return (
        <div className="p-4 space-y-4 animate-pulse">
            <div className="rounded border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-gray-900/60 p-4 space-y-3">
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                </div>
            </div>

            {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded border border-black/10 dark:border-white/10 p-4 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                    <div className="space-y-2">
                        <div className="h-12 bg-black/[0.03] dark:bg-gray-900/60 rounded w-full" />
                    </div>
                </div>
            ))}
        </div>
    )
}
