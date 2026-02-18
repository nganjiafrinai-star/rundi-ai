'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '../theme-toggle'
import { useLanguage } from '@/app/context/languageContext'

interface TopNavProps {
  onMenuClick?: () => void
  isMobile?: boolean
}

export default function TopNav({ onMenuClick, isMobile = false }: TopNavProps) {
  const { t } = useLanguage()
  const pathname = usePathname()

  const navItems = [
    { id: 'dashboard', name: 'Rundi AI', path: '/dashboard' },
    { id: 'traduction', name: t.traduction, path: '/traduction' },
    { id: 'dictionary', name: t.dictionary, path: '/dictionary' },
    { id: 'verbs', name: t.verbs, path: '/verbs' },
    { id: 'discover', name: t.discover, path: '/discover' },
  ]

  const ACCENT = '#147e4e'

  const currentPage = pathname?.split('/')[1] || 'dashboard'
  const currentLabel = navItems.find((item) => item.id === currentPage)?.name || 'Rundi AI'

  const hideMenuButton = pathname === '/discover'

  return (
    <header className="sticky top-0 z-20 bg-background border-b border-border transition-colors">
      <div className="mx-auto max-w-7xl">
        <div className="flex h-14 items-center px-4 lg:px-6">
          <button
            type="button"
            onClick={onMenuClick}
            className={[
              'lg:hidden mr-3 p-2 rounded-xl transition',
              'bg-muted hover:bg-accent',
              'text-foreground',
              hideMenuButton ? 'hidden' : 'flex',
            ].join(' ')}
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>

          <div className="lg:hidden flex-1">
            <span className="font-semibold text-lg text-foreground">{currentLabel}</span>
          </div>

          {/* Desktop */}
          <nav className="hidden lg:flex items-center gap-5 mx-auto">
            {navItems.map((item) => {
              const isActive = currentPage === item.id
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={[
                    'text-sm font-medium transition-all duration-200',
                    'focus-visible:outline-none active:outline-none focus:ring-0 active:ring-0 outline-none border-none',
                    isActive
                      ? 'text-[var(--accent)]'
                      : 'text-muted-foreground hover:text-foreground hover:translate-y-[-1px]',
                  ].join(' ')}
                  style={isActive ? ({ ['--accent' as any]: ACCENT } as React.CSSProperties) : undefined}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto lg:ml-0">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile bottom */}
        <div className="lg:hidden border-t border-border">
          <nav className="flex items-center justify-around px-2 py-2">
            {navItems.map((item) => {
              const active = currentPage === item.id
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={[
                    'px-2 py-2 text-[11px] font-semibold transition-colors',
                    'focus-visible:outline-none active:outline-none focus:ring-0 active:ring-0 outline-none border-none',
                    active ? 'text-[var(--accent)]' : 'text-muted-foreground hover:text-foreground',
                  ].join(' ')}
                  style={active ? ({ ['--accent' as any]: ACCENT } as React.CSSProperties) : undefined}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
