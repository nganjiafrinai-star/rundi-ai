'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useAuth } from '@/app/context/authContext'

function RundiLogo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-[28px] font-semibold tracking-wide text-[#000000] dark:text-white">
        Rundi AI
      </span>
    </div>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  const { theme } = useTheme()

  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24"
      className={theme === 'dark' ? 'text-gray-400' : 'text-black/60'}
    >
      <path
        fill="currentColor"
        d={
          open
            ? 'M12 5c-5.5 0-9.5 5.2-9.5 7s4 7 9.5 7 9.5-5.2 9.5-7-4-7-9.5-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z'
            : 'M2.1 3.5 3.5 2.1 22 20.6 20.6 22l-2.3-2.3c-1.8.9-3.9 1.3-6.3 1.3-5.5 0-9.5-5.2-9.5-7 0-1.1 1.5-3.4 4-5.1L2.1 3.5Zm8.2 8.2a2.5 2.5 0 0 0 3.5 3.5l-3.5-3.5Zm9-1.8c1.4 1.3 2.2 2.7 2.2 3.1 0 .8-2.6 5.5-8.5 5.5-1.6 0-3-.3-4.2-.7l1.8-1.8A4 4 0 0 0 16 12c0-.6-.1-1.1-.3-1.6l1.7-1.7Zm-5-5c4.3.7 7.1 4.7 7.1 6.1 0 .3-.3.9-.7 1.6l-3.1-3.1A4 4 0 0 0 13 8.2l-2.4-2.4c1.2-.4 2.5-.6 3.8-.6Z'
        }
      />
    </svg>
  )
}

export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleRegister = () => {
    setError('')
    if (!email.trim()) {
      setError('Injiza imeri yanyu')
      return
    }
    if (!password.trim()) {
      setError('Injize kabanga nshasha')
      return
    }
    if (password !== confirmPassword) {
      setError('Kabanga ntizihuye')
      return
    }
    login(email)
  }

  return (
    <div className="min-h-screen dark:bg-[#36384F] transition-colors duration-300">
      <div className="mx-auto flex min-h-screen max-w-[520px] flex-col items-center px-6">
        <div className="pt-10" />
        <RundiLogo />

        <div className="mt-10 w-full max-w-[380px]">
          <p className="mx-auto mb-6 max-w-[320px] text-center text-[13px] leading-relaxed text-black/45 dark:text-gray-400">
            Koreshe imeri yanyu mu kwiyandikisha
          </p>

          <div className="rounded border-1 dark:border-white bg-white dark:bg-gray-800 px-5 py-3 shadow-sm focus-within:border-[#2F59FF]/40 dark:focus-within:border-blue-500/40 transition-colors">
            <input
              className="w-full bg-transparent text-[14px] text-black/80 dark:text-gray-200 outline-none placeholder:text-black/35 dark:placeholder:text-gray-500"
              placeholder="Injiza imeri yanyu"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mt-4 flex items-center rounded border-1 dark:border-white bg-white dark:bg-gray-800 px-5 py-3 shadow-sm focus-within:border-[#2F59FF]/40 dark:focus-within:border-blue-500/40 transition-colors">
            <input
              className="w-full bg-transparent text-[14px] text-black/80 dark:text-gray-200 outline-none placeholder:text-black/35 dark:placeholder:text-gray-500"
              placeholder="Injize kabanga nshasha"
              type={showPw ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="ml-2 rounded p-1 hover:bg-black/5 dark:hover:bg-gray-700 transition-colors"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={showPw} />
            </button>
          </div>

          <div className="mt-4 flex items-center rounded border-1  dark:border-white bg-white dark:bg-gray-800 px-5 py-3 shadow-sm focus-within:border-[#2F59FF]/40 dark:focus-within:border-blue-500/40 transition-colors">
            <input
              className="w-full bg-transparent text-[14px] text-black/80 dark:text-gray-200 outline-none placeholder:text-black/35 dark:placeholder:text-gray-500"
              placeholder="Subira winjize kabanga"
              type={showPw2 ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPw2((v) => !v)}
              className="ml-2 rounded p-1 hover:bg-black/5 dark:hover:bg-gray-700 transition-colors"
              aria-label={showPw2 ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={showPw2} />
            </button>
          </div>

          {error && <p className="mt-3 text-[12px] text-red-500 text-center">{error}</p>}

          <p className="mt-6 text-center text-[13px] leading-relaxed text-black/55 dark:text-gray-400">
            Iyandikishe wongere winjire muri Rundi {' '}
            <Link
              href="/condition"
              className="text-black dark:text-gray-300 underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              Uko ikoreshwa
            </Link>{' '}
            n&apos;{' '}
            <Link
              href="/security"
              className="text-black dark:text-gray-300 underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              Umutekano
            </Link>
            .
          </p>

          <button
            type="button"
            onClick={handleRegister}
            className="mt-5 w-full rounded  dark:bg-[#147e4e] py-4 text-[15px] font-medium text-white hover:brightness-110 active:brightness-95 transition-all"
          >
            Iyandikishe
          </button>

          <div className="mt-4 text-center">
            <Link
              href="/login"
              className="text-[14px] text-green-500 dark:text-[#147e4e] hover:opacity-90 transition-opacity"
            >
              Injire
            </Link>
          </div>
        </div>

        <div className="mt-auto pb-10 pt-10 text-center text-[13px] text-black/35 dark:text-gray-500">
          <span>ikaze n&apos;ikaribu mwene wacu </span>
          <Link
            href="#"
            className="hover:text-black/50 dark:hover:text-gray-300 transition-colors"
          >
            Nimutwakure
          </Link>
        </div>
      </div>
    </div>
  )
}