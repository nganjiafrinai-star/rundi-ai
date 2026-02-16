'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/context/authContext'
import { signIn } from 'next-auth/react'

function RundiLogo() {
    return (
        <div className="flex items-center justify-center">
            <span className="text-[28px] font-semibold tracking-wide text-[#000000] dark:text-white">
                Rundi AI
            </span>
        </div>
    )
}

function EyeIcon({ open }: { open: boolean }) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" className="text-black/60 dark:text-gray-400">
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

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.8 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.1-.1-2.3-.4-3.5Z"
            />
            <path
                fill="#FF3D00"
                d="M6.3 14.7 12.9 19.5C14.7 15 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.8 6 29.6 4 24 4c-7.7 0-14.4 4.3-17.7 10.7Z"
            />
            <path
                fill="#4CAF50"
                d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.3 39.7 16.1 44 24 44Z"
            />
            <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.4 4.1-4.6 5.3l6.3 5.3C35.5 40 44 36 44 24c0-1.1-.1-2.3-.4-3.5Z"
            />
        </svg>
    )
}

function WhatsAppIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="text-green-500"
        >
            <path
                fill="currentColor"
                d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.5 0 .16 5.35.16 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.9 11.9 0 0 0 5.75 1.46h.01c6.55 0 11.9-5.35 11.9-11.9 0-3.18-1.24-6.16-3.44-8.43ZM12.06 21.5h-.01a9.6 9.6 0 0 1-4.9-1.34l-.35-.21-3.74.98 1-3.64-.23-.37a9.55 9.55 0 0 1-1.47-5.05c0-5.29 4.3-9.6 9.6-9.6 2.56 0 4.96 1 6.77 2.82a9.5 9.5 0 0 1 2.8 6.78c0 5.29-4.3 9.6-9.6 9.6Zm5.27-7.2c-.29-.14-1.7-.84-1.96-.93-.26-.1-.45-.14-.64.14-.19.29-.74.93-.9 1.12-.17.19-.33.21-.62.07-.29-.14-1.22-.45-2.32-1.43-.86-.76-1.44-1.7-1.6-1.99-.17-.29-.02-.45.12-.6.13-.13.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.1-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 1-.1 2.45.9 1.45 2.1 2.85 3.6 3.99 1.5 1.14 2.07 1.25 2.82 1.39.75.14 1.43.12 1.96.07.6-.06 1.7-.7 1.94-1.38.24-.69.24-1.28.17-1.38-.07-.1-.26-.17-.55-.31Z"
            />
        </svg>
    )
}

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()

    const handleLogin = async () => {
        setError('')
        if (!email.trim()) {
            setError('Injiza imeri yawe')
            return
        }
        if (!password.trim()) {
            setError('Injiza Kabanga yawe')
            return
        }

        setIsLoading(true)
        try {
            await login(email, password)
        } catch (err) {
            setError('Login failed. Please try again.')
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true)
            await signIn('google', { callbackUrl: '/' })
        } catch (err) {
            setError('Failed to sign in with Google')
            setIsLoading(false)
        }
    }

    const handleWhatsAppSignIn = async () => {
        setError('WhatsApp authentication coming soon!')
    }

    return (
        <div className="min-h-screen bg-background transition-colors duration-300">
            <div className="mx-auto flex min-h-screen max-w-[520px] flex-col items-center px-6">
                <div className="pt-20" />
                <RundiLogo />

                <div className="mt-10 w-full max-w-[360px]">
                    <div className="rounded border-1 dark:border-white  bg-white dark:bg-gray-800 px-5 py-3 shadow-sm ">
                        <input
                            className="w-full text-[14px] border-none bg-none text-black/80 dark:text-gray-200 outline-none placeholder:text-black/35 dark:placeholder:text-gray-500"
                            placeholder="Injiza imeri yawe"
                            inputMode="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        />
                    </div>

                    <div className="mt-4 flex items-center rounded border-1 dark:border-white  bg-white dark:bg-gray-800 px-5 py-3 shadow-sm ">
                        <input
                            className="w-full text-[14px] text-black/80 dark:text-gray-200 outline-none placeholder:text-black/35 dark:placeholder:text-gray-500"
                            placeholder="Injiza Kabanga yawe"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="ml-2 rounded p-1 hover:bg-black/5 dark:hover:bg-gray-700 transition-colors"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            <EyeIcon open={showPassword} />
                        </button>
                    </div>

                    {error && <p className="mt-2 text-[12px] text-red-500 text-center">{error}</p>}

                    <p className="mt-5 text-[13px] leading-relaxed text-black/55 dark:text-gray-400">
                        Iyandikishe wongere winjire muri Rundi {' '}
                        <Link href="/condition" className="text-black dark:text-gray-300 underline underline-offset-4 hover:opacity-80">
                            Uko ikoreshwa
                        </Link>{' '}
                        n&apos;{' '}
                        <Link href="/security" className="text-black dark:text-gray-300 underline underline-offset-4 hover:opacity-80">
                            Umutekano
                        </Link>
                        .
                    </p>

                    <div className="mt-4 flex items-center justify-between text-[14px]">
                        <Link href="#" className="text-[#147E4E] dark:text-[#147E4E] hover:opacity-80">
                            Wibagiye Kabanga?
                        </Link>
                        <span className="text-slate-500 dark:text-slate-400">
                            admin@nova.io
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="mt-5 w-full rounded dark:bg-[#147E4E] py-4 text-[15px] font-medium text-white hover:brightness-110 active:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Loading...' : 'Injire'}
                    </button>

                    <div className="mt-7 flex items-center justify-center gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                                className="grid h-12 w-12 place-items-center rounded-full border border-black/10 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:bg-black/5 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                aria-label="Continue with Google"
                            >
                                <GoogleIcon />
                            </button>
                            <button
                                type="button"
                                onClick={handleWhatsAppSignIn}
                                disabled={isLoading}
                                className="grid h-12 w-12 place-items-center rounded-full border border-black/10 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:bg-black/5 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                aria-label="Continue with WhatsApp"
                            >
                                <WhatsAppIcon />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pb-10 pt-14 text-center text-[13px] text-black/35 dark:text-gray-500">
                    <span>ikaze n&apos;ikaribu mwene wacu </span>
                    <Link href="#" className="hover:text-black/70 dark:hover:text-gray-300 transition-colors">
                        Nimutwakure
                    </Link>
                </div>
            </div>
        </div>
    )
}
