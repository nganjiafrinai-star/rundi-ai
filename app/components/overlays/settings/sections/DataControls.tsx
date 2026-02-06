'use client'

import { Database, Download, Trash2, UserX } from 'lucide-react'

export default function DataControlsSection() {
    const BORDER = 'border border-black/10 dark:border-white/10'
    const SOFT = 'bg-black/[0.03] dark:bg-white/[0.05]'
    const TEXT = 'text-[#111111] dark:text-white'
    const MUTED = 'text-black/60 dark:text-white/65'
    const ACCENT = '#147E4E'

    const actions = [
        {
            label: 'Export Chat History',
            description: 'Download all your conversations in JSON format',
            icon: Download,
            onClick: () => console.log('Exporting...'),
        },
        {
            label: 'Clear All Chats',
            description: 'Permanently delete all your chat history',
            icon: Trash2,
            onClick: () => console.log('Clearing...'),
            danger: true,
        },
        {
            label: 'Delete Account',
            description: 'Permanently delete your account and all data',
            icon: UserX,
            onClick: () => console.log('Deleting account...'),
            danger: true,
        },
    ]

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#147E4E]">Data Controls</h3>
            </div>

            <div className="space-y-2">
                {actions.map((action) => (
                    <button
                        key={action.label}
                        onClick={action.onClick}
                        className={`w-full flex items-center justify-between p-4 rounded ${BORDER} ${SOFT} hover:bg-black/[0.06] dark:hover:bg-white/10 transition-all text-left`}
                    >
                        <div className="flex items-center gap-3">
                            <action.icon className={`w-4 h-4 ${action.danger ? 'text-red-500' : MUTED}`} />
                            <div className="flex flex-col">
                                <span className={`text-sm font-medium ${action.danger ? 'text-red-500' : TEXT}`}>{action.label}</span>
                                <span className={`text-[10px] ${MUTED}`}>{action.description}</span>
                            </div>
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
