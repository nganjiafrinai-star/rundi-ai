'use client'

import { Database, Archive, Trash2, UserX, ChevronLeft, Download } from 'lucide-react'
import { useState } from 'react'
import { useChat } from '@/app/context/chatContext'

export default function DataControlsSection() {
    const [view, setView] = useState<'main' | 'archive'>('main')
    const { chatSessions, deleteSession, unarchiveSession } = useChat() as any

    const archivedSessions = (chatSessions || []).filter((s: any) => s.isArchived)

    const handleClearAllChats = () => {
        const allSessions = chatSessions || []
        if (allSessions.length === 0) return

        const confirmed = window.confirm(
            `Are you sure you want to delete ALL ${allSessions.length} chat conversations? This action cannot be undone.`
        )
        
        if (confirmed) {
            allSessions.forEach((session: any) => {
                deleteSession(session.id)
            })
        }
    }

    const handleExport = (session: any) => {
        const dataStr = JSON.stringify(session, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
        const exportFileDefaultName = `chat-archive-${session.id}.json`
        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
    }

    const BORDER = 'border border-black/10 dark:border-white/10'
    const SOFT = 'bg-black/[0.03] dark:bg-white/[0.05]'
    const TEXT = 'text-[#111111] dark:text-white'
    const MUTED = 'text-black/60 dark:text-white/65'
    const ACCENT = '#147E4E'

    const actions = [
        {
            label: 'Archive conversations',
            description: 'View all archived conversations',
            icon: Archive,
            onClick: () => setView('archive'),
        },
        {
            label: 'Clear All Chats',
            description: 'Permanently delete all your chat history',
            icon: Trash2,
            onClick: handleClearAllChats,
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

    if (view === 'archive') {
        return (
            <section className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                    <button
                        onClick={() => setView('main')}
                        className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 text-[#147E4E]" />
                    </button>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#147E4E]">Archived Conversations</h3>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {archivedSessions.length === 0 ? (
                        <div className="text-center py-8 text-[10px] text-black/40 dark:text-white/40 italic">
                            No archived conversations found.
                        </div>
                    ) : (
                        archivedSessions.map((session: any) => (
                            <div
                                key={session.id}
                                className={`flex items-center justify-between p-3 rounded ${BORDER} ${SOFT}`}
                            >
                                <div className="flex flex-col min-w-0 pr-4">
                                    <span className={`text-sm font-medium ${TEXT} truncate`}>
                                        {session.customTitle || session.title}
                                    </span>
                                    <span className={`text-[10px] ${MUTED}`}>
                                        {new Date(session.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => handleExport(session)}
                                        className="p-1.5 hover:bg-green-600/10 text-green-600 rounded transition-colors"
                                        title="Export"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => unarchiveSession(session.id)}
                                        className={`p-1.5 hover:bg-black/10 dark:hover:bg-white/10 ${MUTED} rounded transition-colors`}
                                        title="Unarchive"
                                    >
                                        <Archive className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this archived chat?')) {
                                                deleteSession(session.id)
                                            }
                                        }}
                                        className="p-1.5 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        )
    }

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
