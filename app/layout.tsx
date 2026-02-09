'use client'

import { useState, Suspense, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ChatProvider } from '@/app/context/chatContext'
import { AuthProvider, useAuth } from '@/app/context/authContext'
import { ModalProvider } from '@/app/context/modal/modalContext'
import ModalRoot from '@/app/components/modals/modalRoot'
import TopNav from '@/app/components/shell/topnavbar'
import SideNav from '@/app/components/shell/sidebar'
import RowPage from '@/app/components/shell/rowPage'
import Footer from '@/app/components/footer'
import { ThemeProvider } from '@/app/providers/theme-provider'
import { LanguageProvider } from '@/app/context/languageContext'
import "./globals.css"

function AppContent({ children }: { children: React.ReactNode }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const { isAuthenticated, isLoading } = useAuth()
    
    const isLoginPage = pathname === '/login'
    const isDiscoverPage = pathname === '/discover'
    const isLinksPage = ['/politic', '/utilisation', '/security', '/faq', '/careers', '/condition'].includes(pathname)
    const isPublicPage = isLoginPage || isDiscoverPage || isLinksPage

    const handleToggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed)
    }

    const toggleMobileSidebar = () => {
        setMobileSidebarOpen(!mobileSidebarOpen)
    }

    const closeMobileSidebar = () => {
        setMobileSidebarOpen(false)
    }

    useEffect(() => {
        if (!isLoading && !isAuthenticated && !isPublicPage) {
            router.push('/login')
        }
    }, [isLoading, isAuthenticated, isPublicPage, router])

    if (isLoading || (!isAuthenticated && !isPublicPage)) {
      return (
        <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
          <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
        </div>
      )
    }

    if (isLoginPage) {
        return <>{children}</>
    }

    return (
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

            <ModalRoot />
        </div>
    )
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
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
                            <AuthProvider>
                                <ChatProvider>
                                    <ModalProvider>
                                        <AppContent>{children}</AppContent>
                                    </ModalProvider>
                                </ChatProvider>
                            </AuthProvider>
                        </LanguageProvider>
                    </ThemeProvider>
                </Suspense>
            </body>
        </html>
    )
}