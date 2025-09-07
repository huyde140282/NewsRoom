import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/ui/layout/header'
import Footer from '@/components/ui/layout/footer'
import ServerSidebar from '@/components/ui/layout/sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NewsRoom - Modern News Platform',
  description: 'Stay updated with the latest news and articles',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {children}
                </div>
                <div className="lg:col-span-1">
                  <ServerSidebar />
                </div>
              </div>
            </main>
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
