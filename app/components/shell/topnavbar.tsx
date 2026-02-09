'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '../theme-toggle'

interface TopNavProps {
  onMenuClick?: () => void
  isMobile?: boolean
}

import { useLanguage } from '@/app/context/languageContext'

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

  const ACCENT = '#1DB954'

  const currentPage = pathname?.split('/')[1] || 'dashboard'
  const currentLabel =
    navItems.find((item) => item.id === currentPage)?.name || 'Rundi AI'

  const hideMenuButton = pathname === '/discover'

  return (
    <header
      className="
        sticky top-0 z-20
        bg-white dark:bg-gray-900
        border-b border-slate-200 dark:border-gray-800
        transition-colors
      "
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex h-14 items-center px-4 lg:px-6">
          <button
            type="button"
            onClick={onMenuClick}
            className={`
              lg:hidden mr-3 p-2 rounded-xl
              bg-slate-50 hover:bg-slate-100
              dark:bg-gray-800/80 dark:hover:bg-gray-800
              text-slate-900 dark:text-white 
              transition
              ${hideMenuButton ? 'hidden' : 'flex'}
            `}
            aria-label="Open menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12h18M3 6h18M3 18h18"
              />
            </svg>
          </button>

          <div className="lg:hidden flex-1">
            <span className="font-semibold text-lg text-slate-900 dark:text-white">
              {currentLabel}
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-2 mx-auto">
            {navItems.map((item) => {
              const isActive = currentPage === item.id

              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={[
                    'group relative px-3 py-2 text-sm font-medium transition',
                    'focus-visible:outline-none active:outline-none focus:ring-0 active:ring-0 outline-none border-none',
                    'text-slate-600 hover:text-slate-900',
                    'dark:text-gray-400 dark:hover:text-white',
                  ].join(' ')}
                >
                  <span className="relative z-10">{item.name}</span>

                  <span
                    className={[
                      'pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-1',
                      'h-[2px] rounded transition-all duration-300 ease-out',
                      isActive
                        ? 'w-[70%] opacity-100'
                        : 'w-0 opacity-0 group-hover:w-[70%] group-hover:opacity-100',
                    ].join(' ')}
                    style={{ backgroundColor: ACCENT }}
                  />
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto lg:ml-0">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile bottom */}
        <div className="lg:hidden border-t border-black/10 ">
          <nav className="flex items-center justify-around px-2 py-2">
            {navItems.map((item) => {
              const active = currentPage === item.id
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={[
                    'px-3 py-2 text-[11px] font-semibold rounded-xl transition focus-visible:outline-none active:outline-none focus:ring-0 active:ring-0',
                    active
                      ? 'text-white shadow-sm'
                      : 'text-[#111111]/70 dark:text-white/70',
                    active
                      ? ''
                      : 'hover:bg-white/70 dark:hover:bg-[#1A1A1A]/70',
                  ].join(' ')}
                  style={active ? { backgroundColor: ACCENT } : undefined}
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
