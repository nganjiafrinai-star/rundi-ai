'use client'

import { useState, Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { ChatProvider } from '@/app/context/chatContext'
import { ModalProvider } from '@/app/context/modal/modalContext'
import ModalRoot from '@/app/components/modals/modalRoot'
import TopNav from '@/app/components/shell/topnavbar'
import SideNav from '@/app/components/shell/sidebar'
import RowPage from '@/app/components/shell/rowPage'
import Footer from '@/app/components/footer'
import { ThemeProvider } from '@/app/providers/theme-provider'
import { LanguageProvider } from '@/app/context/languageContext'
import "./globals.css"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
    const pathname = usePathname()
    const isDiscoverPage = pathname === '/discover'
    const isLinksPage = ['/politic', '/utilisation', '/security', '/faq', '/careers', '/condition'].includes(pathname)

    const handleToggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed)
    }

    const toggleMobileSidebar = () => {
        setMobileSidebarOpen(!mobileSidebarOpen)
    }

    const closeMobileSidebar = () => {
        setMobileSidebarOpen(false)
    }

    return (
        <html lang="rn">
            <body>
                <Suspense fallback={<div>Loading...</div>}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <LanguageProvider>
                            <ChatProvider>
                                <ModalProvider>
                                    <div className="flex h-screen bg-white dark:bg-gray-900 text-foreground overflow-hidden">
                                        {mobileSidebarOpen && (
                                            <div
                                                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                                                onClick={closeMobileSidebar}
                                            />
                                        )}

                                        {!isDiscoverPage && !isLinksPage && (
                                            <div
                                                className={`
                                                    fixed inset-y-0 left-0 z-50 w-[280px] transform transition-transform duration-300 ease-in-out
                                                    lg:relative lg:translate-x-0
                                                    ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                                                    ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-[280px]'}
                                                `}
                                            >
                                                <SideNav
                                                    isCollapsed={sidebarCollapsed}
                                                    onToggleCollapse={handleToggleSidebar}
                                                    onMobileClose={closeMobileSidebar}
                                                />
                                            </div>
                                        )}

                                        <div className="flex flex-1 flex-col min-w-0">
                                            <TopNav onMenuClick={toggleMobileSidebar} />
                                            <RowPage>
                                                {children}
                                                {isLinksPage && <Footer />}
                                            </RowPage>
                                        </div>

                                        {/* Mount once so sidebar buttons can open center popups */}
                                        <ModalRoot />
                                    </div>
                                </ModalProvider>
                            </ChatProvider>
                        </LanguageProvider>
                    </ThemeProvider>
                </Suspense>
            </body>
        </html>
    )
}