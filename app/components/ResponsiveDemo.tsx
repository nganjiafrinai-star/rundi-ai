'use client'

import { useBreakpoint, useIsMobile, useIsDesktop, useOrientation, useWindowSize, ResponsiveContainer, ResponsiveGrid, ResponsiveText, ShowOn, spacing, fontSize } from '@/app/utils/responsive'

export default function ResponsiveDemo() {
    const breakpoint = useBreakpoint()
    const isMobile = useIsMobile()
    const isDesktop = useIsDesktop()
    const orientation = useOrientation()
    const { width, height } = useWindowSize()

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <ResponsiveContainer className="py-6">
                    <h1 className={`${fontSize['3xl']} font-bold text-gray-900 dark:text-white`}>
                        Responsive Design Demo
                    </h1>
                    <p className={`${fontSize.base} text-gray-600 dark:text-gray-400 mt-2`}>
                        Demonstrating responsive utilities and patterns
                    </p>
                </ResponsiveContainer>
            </header>

            <main className={spacing.section}>
                <ResponsiveContainer>
                    {/* Device Info Card */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6 mb-8">
                        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
                            Current Device Info
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="text-blue-700 dark:text-blue-300 font-medium">Breakpoint:</span>
                                <p className="text-blue-900 dark:text-blue-100 font-bold text-lg">{breakpoint}</p>
                            </div>
                            <div>
                                <span className="text-blue-700 dark:text-blue-300 font-medium">Device Type:</span>
                                <p className="text-blue-900 dark:text-blue-100 font-bold text-lg">
                                    {isMobile ? 'Mobile' : isDesktop ? 'Desktop' : 'Tablet'}
                                </p>
                            </div>
                            <div>
                                <span className="text-blue-700 dark:text-blue-300 font-medium">Orientation:</span>
                                <p className="text-blue-900 dark:text-blue-100 font-bold text-lg capitalize">{orientation}</p>
                            </div>
                            <div>
                                <span className="text-blue-700 dark:text-blue-300 font-medium">Viewport:</span>
                                <p className="text-blue-900 dark:text-blue-100 font-bold text-lg">
                                    {width}×{height}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Responsive Grid Demo */}
                    <section className="mb-12">
                        <h2 className={`${fontSize.xl} font-bold text-gray-900 dark:text-white mb-6`}>
                            Responsive Grid
                        </h2>
                        <ResponsiveGrid
                            cols={{ mobile: 1, sm: 2, md: 3, lg: 4 }}
                            gap="gap-4 md:gap-6"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                <div
                                    key={num}
                                    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        Card {num}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        This card adapts to different screen sizes
                                    </p>
                                </div>
                            ))}
                        </ResponsiveGrid>
                    </section>

                    {/* Responsive Typography Demo */}
                    <section className="mb-12">
                        <h2 className={`${fontSize.xl} font-bold text-gray-900 dark:text-white mb-6`}>
                            Responsive Typography
                        </h2>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
                            <ResponsiveText as="h1" size={{ mobile: 'text-3xl', md: 'md:text-4xl', lg: 'lg:text-5xl' }} className="font-bold text-gray-900 dark:text-white">
                                Heading 1 - Scales with viewport
                            </ResponsiveText>
                            <ResponsiveText as="h2" size={{ mobile: 'text-2xl', md: 'md:text-3xl', lg: 'lg:text-4xl' }} className="font-bold text-gray-900 dark:text-white">
                                Heading 2 - Responsive sizing
                            </ResponsiveText>
                            <ResponsiveText as="p" size={{ mobile: 'text-base', md: 'md:text-lg' }} className="text-gray-600 dark:text-gray-400">
                                Body text that adjusts for readability across devices. This paragraph demonstrates how text scales appropriately for different screen sizes.
                            </ResponsiveText>
                            <ResponsiveText as="p" size={{ mobile: 'text-sm', md: 'md:text-base' }} className="text-gray-500 dark:text-gray-500">
                                Smaller text for captions or secondary information.
                            </ResponsiveText>
                        </div>
                    </section>

                    {/* Show/Hide Demo */}
                    <section className="mb-12">
                        <h2 className={`${fontSize.xl} font-bold text-gray-900 dark:text-white mb-6`}>
                            Conditional Rendering
                        </h2>
                        <div className="space-y-4">
                            <ShowOn breakpoint="lg" direction="up">
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                    <p className="text-green-900 dark:text-green-100 font-medium">
                                        ✅ This content is only visible on desktop (lg and above)
                                    </p>
                                </div>
                            </ShowOn>

                            <ShowOn breakpoint="lg" direction="down">
                                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                                    <p className="text-orange-900 dark:text-orange-100 font-medium">
                                        📱 This content is only visible on mobile and tablet (below lg)
                                    </p>
                                </div>
                            </ShowOn>

                            <div className="hidden md:block lg:hidden">
                                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                                    <p className="text-purple-900 dark:text-purple-100 font-medium">
                                        📱 This content is only visible on tablets (md to lg)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Responsive Spacing Demo */}
                    <section className="mb-12">
                        <h2 className={`${fontSize.xl} font-bold text-gray-900 dark:text-white mb-6`}>
                            Responsive Spacing
                        </h2>
                        <div className="space-y-6">
                            <div className={`bg-white dark:bg-gray-800 rounded-lg ${spacing.card}`}>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Card with Responsive Padding
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    This card uses <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">spacing.card</code> which applies p-4 sm:p-6 lg:p-8
                                </p>
                            </div>

                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-[2px]">
                                <div className={`bg-white dark:bg-gray-800 rounded-lg ${spacing.card}`}>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        Gradient Border Card
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Demonstrating responsive padding with gradient border
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Responsive Buttons Demo */}
                    <section className="mb-12">
                        <h2 className={`${fontSize.xl} font-bold text-gray-900 dark:text-white mb-6`}>
                            Responsive Buttons
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:text-base font-medium transition-colors min-h-[44px]">
                                Primary Button
                            </button>
                            <button className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm sm:text-base font-medium transition-colors min-h-[44px]">
                                Secondary Button
                            </button>
                            <button className="px-4 py-2 sm:px-6 sm:py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-sm sm:text-base font-medium transition-colors min-h-[44px]">
                                Outline Button
                            </button>
                        </div>
                    </section>

                    {/* Responsive Images Demo */}
                    <section className="mb-12">
                        <h2 className={`${fontSize.xl} font-bold text-gray-900 dark:text-white mb-6`}>
                            Responsive Images
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="h-48 sm:h-64 lg:h-80 w-full overflow-hidden rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500">
                                    <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                                        Responsive Height
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    Height: h-48 sm:h-64 lg:h-80
                                </p>
                            </div>
                            <div>
                                <div className="aspect-video w-full overflow-hidden rounded-lg bg-gradient-to-br from-pink-400 to-purple-500">
                                    <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                                        16:9 Aspect Ratio
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    Using aspect-video class
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Best Practices */}
                    <section>
                        <h2 className={`${fontSize.xl} font-bold text-gray-900 dark:text-white mb-6`}>
                            Best Practices Applied
                        </h2>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <span>Mobile-first approach (styles start with mobile, then scale up)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <span>Minimum 44px touch targets for mobile interactions</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <span>Responsive typography that scales with viewport</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <span>Flexible layouts using CSS Grid and Flexbox</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <span>Consistent spacing system across breakpoints</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <span>Dark mode support at all screen sizes</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <span>Smooth transitions and animations</span>
                                </li>
                            </ul>
                        </div>
                    </section>
                </ResponsiveContainer>
            </main>
        </div>
    )
}
