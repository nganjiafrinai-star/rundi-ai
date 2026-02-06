'use client'

import { Info, LifeBuoy, FileText, Shield } from 'lucide-react'

export default function HelpSection() {
    const BORDER = 'border border-black/10 dark:border-white/10'
    const SOFT = 'bg-black/[0.03] dark:bg-white/[0.05]'
    const TEXT = 'text-[#111111] dark:text-white'
    const MUTED = 'text-black/60 dark:text-white/65'
    const ACCENT = '#147E4E'

    const links = [
        { label: 'About Rundi AI', icon: Info, path: '#' },
        { label: 'Support & FAQ', icon: LifeBuoy, path: '#' },
        { label: 'Terms of Use', icon: FileText, path: '#' },
        { label: 'Privacy Policy', icon: Shield, path: '#' },
    ]

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#147E4E]">Help & Legal</h3>
            </div>

            <div className={`rounded ${BORDER} ${SOFT} divide-y divide-black/5 dark:divide-white/5`}>
                {links.map((link) => (
                    <button key={link.label} className="w-full flex items-center justify-between p-4 hover:bg-black/[0.06] dark:hover:bg-white/10 transition-all text-left first:rounded last:rounded">
                        <div className="flex items-center gap-3">
                            <link.icon className={`w-4 h-4 ${MUTED}`} />
                            <span className={`text-sm font-medium ${TEXT}`}>{link.label}</span>
                        </div>
                        <svg className={`w-4 h-4 ${MUTED}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                ))}
            </div>
        </section>
    )
}
