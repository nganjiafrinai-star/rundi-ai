'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Languages } from 'lucide-react'
import { useLanguage } from '@/app/context/languageContext'

export default function GeneralSection() {
    const { theme, setTheme } = useTheme()
    const { language, setLanguage, t } = useLanguage()

    const BORDER = 'border border-border'
    const SOFT = 'bg-muted'
    const TEXT = 'text-foreground'
    const MUTED = 'text-muted-foreground'
    const ACCENT = '#147E4E'

    return (
        <section className="space-y-4 ">
            <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#147E4E]">{t.settings}</h3>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className={`text-xs font-semibold ${MUTED} flex items-center gap-2 px-1`}>
                         {t.appLanguage}
                    </label>
                    <div className={`relative rounded-full border border-border bg-input overflow-hidden hover:bg-input-hover transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background`}>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as any)}
                            className={`w-full bg-transparent px-4 py-3 text-sm font-medium outline-none appearance-none ${TEXT} cursor-pointer`}
                        >
                            <option value="rn">Kirundi</option>
                            <option value="en">English</option>
                            <option value="fr">French</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className={`text-xs font-semibold ${MUTED} px-1`}>{t.appearance}</label>
                         <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: 'light', icon: Sun, label: t.light },
                                { id: 'dark', icon: Moon, label: t.dark },
                            ].map((item) => (
                                <button
                                key={item.id}
                                onClick={() => setTheme(item.id)}
                                className={[
                                    "flex items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-200",
                                    theme === item.id
                                    ? "border-[#147E4E] bg-[#147E4E]/10 text-[#147E4E]"
                                    : "border-border bg-muted text-foreground hover:bg-accent cursor-pointer"
                                ].join(" ")}
                                >
                                <item.icon className="w-4 h-4 shrink-0" />
                                <span className="text-sm font-medium whitespace-nowrap">
                                    {item.label}
                                </span>
                                </button>
                            ))}
                        </div>

                </div>
            </div>
        </section>
    )
}
