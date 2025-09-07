'use client'

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Sync search term with URL if on search page
  useEffect(() => {
    if (pathname === '/search') {
      const query = searchParams.get('q') || ''
      setSearchTerm(query)
    }
  }, [pathname, searchParams])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedSearch = searchTerm.trim()
    if (trimmedSearch) {
      router.push(`/search?q=${encodeURIComponent(trimmedSearch)}`)
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/categories", label: "Categories" },
    { href: "/articles", label: "Articles" },
    { href: "/dropdown", label: "Dropdown" },
    { href: "/contact", label: "Contact" },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }
  return (
    <>
      {/* Top Bar */}
      <div className="bg-red-600 text-white py-1">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span className="bg-red-700 px-2 py-1 text-xs">Trending</span>
            <span className="hidden sm:block">Lorem sit justo amet eos sed, et sanctus dolor diam eos</span>
          </div>
          <span className="hidden md:block">Monday, January 01, 2045</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="text-2xl font-bold text-red-600">
              NEWS<span className="text-gray-800">ROOM</span>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            {/* Ad Space */}
            <div className="hidden xl:block bg-gray-800 text-white px-8 py-4 text-center">
              <div className="text-lg font-bold">&lt;html&gt;</div>
              <div className="text-sm">ADS 700x70px</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block border-t border-gray-200">
            <div className="py-3 flex items-center justify-between">
              <ul className="flex items-center space-x-8">
                {navigationItems.map((item) => (
                  <li key={item.href}>
                    <Link 
                      href={item.href} 
                      className={
                        isActive(item.href)
                          ? "bg-red-600 text-white px-4 py-2 rounded"
                          : "text-gray-700 hover:text-red-600 px-4 py-2 rounded transition-colors"
                      }
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              
              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input 
                  type="search" 
                  placeholder="Search articles..." 
                  className="w-48"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                />
                <Button size="sm" variant="outline" type="submit">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </nav>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="lg:hidden border-t border-gray-200 py-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
                <Input 
                  type="search" 
                  placeholder="Search articles..." 
                  className="flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                />
                <Button size="sm" variant="outline" type="submit">
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              {/* Mobile Menu Items */}
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.href}>
                    <Link 
                      href={item.href} 
                      className={
                        isActive(item.href)
                          ? "block bg-red-600 text-white px-4 py-3 rounded"
                          : "block text-gray-700 hover:text-red-600 px-4 py-3 rounded transition-colors"
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </header>
    </>
  )
}
