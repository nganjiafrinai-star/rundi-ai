'use client'

import { useEffect } from 'react'

export default function Modal({
  title,
  onClose,
  children,
  size = 'md',
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">

      <button
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />


      {/* Modal Container */}
      <div className={`relative z-10 w-[95%] ${sizeClasses[size as keyof typeof sizeClasses]} rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-[#2A2A2A] p-4 md:p-6 shadow-2xl transition-all scale-100`}>
        <div className="flex items-center justify-between gap-3 border-b border-black/5 dark:border-white/5 pb-3">
          <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-700 dark:text-gray-200">
          {children}
        </div>
      </div>
    </div>
  )
}
