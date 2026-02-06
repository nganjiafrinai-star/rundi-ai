'use client'

import { useState } from 'react'
import { ShieldCheck, Camera, Lock } from 'lucide-react'

export default function SecuritySection() {
    const [screenshotEnabled, setScreenshotEnabled] = useState(false)

    const BORDER = 'border border-black/10 dark:border-white/10'
    const SOFT = 'bg-black/[0.03] dark:bg-white/[0.05]'
    const TEXT = 'text-[#111111] dark:text-white'
    const MUTED = 'text-black/60 dark:text-white/65'
    const ACCENT = '#147E4E'

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#147E4E]">Security</h3>
            </div>

            <div className="space-y-2">
                <button className={`w-full flex items-center justify-between p-4 rounded ${BORDER} ${SOFT} hover:bg-black/[0.06] dark:hover:bg-white/10 transition-all text-left`}>
                    <div className="flex items-center gap-3">
                        <Lock className={`w-4 h-4 ${MUTED}`} />
                        <div className="flex flex-col">
                            <span className={`text-sm font-medium ${TEXT}`}>Change Password</span>
                            <span className={`text-[10px] ${MUTED}`}>Update your account security</span>
                        </div>
                    </div>
                    <svg className={`w-4 h-4 ${MUTED}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </section>
    )
}
