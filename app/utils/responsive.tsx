/**
 * Responsive Utilities and Hooks for Rundi AI
 * 
 * This file provides utilities and React hooks for handling responsive behavior
 * across the application.
 */

'use client'

import { useEffect, useState } from 'react'

// Breakpoint values (matching Tailwind defaults)
export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
} as const

export type Breakpoint = keyof typeof BREAKPOINTS

/**
 * Hook to detect current breakpoint
 * @returns Current breakpoint name
 */
export function useBreakpoint(): Breakpoint | 'mobile' {
    const [breakpoint, setBreakpoint] = useState<Breakpoint | 'mobile'>('mobile')

    useEffect(() => {
        const updateBreakpoint = () => {
            const width = window.innerWidth

            if (width >= BREAKPOINTS['2xl']) {
                setBreakpoint('2xl')
            } else if (width >= BREAKPOINTS.xl) {
                setBreakpoint('xl')
            } else if (width >= BREAKPOINTS.lg) {
                setBreakpoint('lg')
            } else if (width >= BREAKPOINTS.md) {
                setBreakpoint('md')
            } else if (width >= BREAKPOINTS.sm) {
                setBreakpoint('sm')
            } else {
                setBreakpoint('mobile')
            }
        }

        updateBreakpoint()
        window.addEventListener('resize', updateBreakpoint)
        return () => window.removeEventListener('resize', updateBreakpoint)
    }, [])

    return breakpoint
}

/**
 * Hook to check if viewport is at or above a specific breakpoint
 * @param breakpoint - Breakpoint to check
 * @returns Boolean indicating if viewport is at or above breakpoint
 */
export function useMediaQuery(breakpoint: Breakpoint): boolean {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const query = `(min-width: ${BREAKPOINTS[breakpoint]}px)`
        const media = window.matchMedia(query)

        const updateMatch = () => setMatches(media.matches)
        updateMatch()

        media.addEventListener('change', updateMatch)
        return () => media.removeEventListener('change', updateMatch)
    }, [breakpoint])

    return matches
}

/**
 * Hook to detect if device is mobile (< lg breakpoint)
 * @returns Boolean indicating if device is mobile
 */
export function useIsMobile(): boolean {
    const isLg = useMediaQuery('lg')
    return !isLg
}

/**
 * Hook to detect if device is tablet (md to lg)
 * @returns Boolean indicating if device is tablet
 */
export function useIsTablet(): boolean {
    const isMd = useMediaQuery('md')
    const isLg = useMediaQuery('lg')
    return isMd && !isLg
}

/**
 * Hook to detect if device is desktop (>= lg)
 * @returns Boolean indicating if device is desktop
 */
export function useIsDesktop(): boolean {
    return useMediaQuery('lg')
}

/**
 * Hook to get window dimensions
 * @returns Object with width and height
 */
export function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    })

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return windowSize
}

/**
 * Hook to detect device orientation
 * @returns 'portrait' or 'landscape'
 */
export function useOrientation(): 'portrait' | 'landscape' {
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

    useEffect(() => {
        const updateOrientation = () => {
            setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
        }

        updateOrientation()
        window.addEventListener('resize', updateOrientation)
        return () => window.removeEventListener('resize', updateOrientation)
    }, [])

    return orientation
}

/**
 * Utility function to generate responsive className
 * @param base - Base className
 * @param responsive - Object with breakpoint-specific classNames
 * @returns Combined className string
 */
export function responsiveClass(
    base: string,
    responsive?: Partial<Record<Breakpoint, string>>
): string {
    if (!responsive) return base

    const classes = [base]

    Object.entries(responsive).forEach(([breakpoint, className]) => {
        if (className) {
            classes.push(`${breakpoint}:${className}`)
        }
    })

    return classes.join(' ')
}

/**
 * Utility to check if touch device
 * @returns Boolean indicating if device supports touch
 */
export function isTouchDevice(): boolean {
    if (typeof window === 'undefined') return false
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * Container component with responsive padding
 */
export function ResponsiveContainer({
    children,
    className = '',
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
            {children}
        </div>
    )
}

/**
 * Responsive grid component
 */
export function ResponsiveGrid({
    children,
    cols = { mobile: 1, sm: 2, md: 3, lg: 4 },
    gap = 'gap-4 sm:gap-6 lg:gap-8',
    className = '',
}: {
    children: React.ReactNode
    cols?: { mobile?: number; sm?: number; md?: number; lg?: number; xl?: number }
    gap?: string
    className?: string
}) {
    const gridCols = `grid-cols-${cols.mobile || 1} ${cols.sm ? `sm:grid-cols-${cols.sm}` : ''} ${cols.md ? `md:grid-cols-${cols.md}` : ''
        } ${cols.lg ? `lg:grid-cols-${cols.lg}` : ''} ${cols.xl ? `xl:grid-cols-${cols.xl}` : ''}`

    return <div className={`grid ${gridCols} ${gap} ${className}`}>{children}</div>
}

/**
 * Responsive text component
 */
export function ResponsiveText({
    children,
    as: Component = 'p',
    size = { mobile: 'text-base', md: 'md:text-lg', lg: 'lg:text-xl' },
    className = '',
}: {
    children: React.ReactNode
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
    size?: { mobile?: string; sm?: string; md?: string; lg?: string; xl?: string }
    className?: string
}) {
    const textSize = `${size.mobile || ''} ${size.sm || ''} ${size.md || ''} ${size.lg || ''} ${size.xl || ''
        }`

    return <Component className={`${textSize} ${className}`}>{children}</Component>
}

/**
 * Show component only on specific breakpoints
 */
export function ShowOn({
    children,
    breakpoint,
    direction = 'up',
}: {
    children: React.ReactNode
    breakpoint: Breakpoint
    direction?: 'up' | 'down'
}) {
    const className = direction === 'up' ? `hidden ${breakpoint}:block` : `${breakpoint}:hidden`

    return <div className={className}>{children}</div>
}

/**
 * Responsive spacing utility
 */
export const spacing = {
    section: 'py-8 sm:py-12 lg:py-16',
    container: 'px-4 sm:px-6 lg:px-8',
    card: 'p-4 sm:p-6 lg:p-8',
    gap: {
        sm: 'gap-2 sm:gap-3 lg:gap-4',
        md: 'gap-4 sm:gap-6 lg:gap-8',
        lg: 'gap-6 sm:gap-8 lg:gap-12',
    },
}

/**
 * Responsive font sizes
 */
export const fontSize = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl lg:text-2xl',
    xl: 'text-xl sm:text-2xl lg:text-3xl',
    '2xl': 'text-2xl sm:text-3xl lg:text-4xl',
    '3xl': 'text-3xl sm:text-4xl lg:text-5xl',
}
