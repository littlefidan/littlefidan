'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { User, ShoppingBag, Download, Heart, Settings, LogOut, BarChart3, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/account', icon: BarChart3 },
  { name: 'Mijn Profiel', href: '/account/profile', icon: User },
  { name: 'Bestellingen', href: '/account/orders', icon: ShoppingBag },
  { name: 'Downloads', href: '/account/downloads', icon: Download },
  { name: 'Favorieten', href: '/account/wishlist', icon: Heart },
  { name: 'Instellingen', href: '/account/settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const NavigationItems = () => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-white text-sage-600 shadow-soft"
                : "text-sage-600 hover:bg-white/50 hover:text-sage-700"
            )}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Icon className="h-5 w-5" />
            {item.name}
          </Link>
        )
      })}
      
      <div className="pt-4 mt-4 border-t border-sage-200">
        <Button variant="ghost" className="w-full justify-start text-sage-600" asChild>
          <Link href="/logout" onClick={() => setMobileMenuOpen(false)}>
            <LogOut className="h-5 w-5 mr-3" />
            Uitloggen
          </Link>
        </Button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-earth-base">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-earth-base border-b border-sage-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-sage-600">Mijn Account</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-sage-600"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-earth-base p-4">
            <nav className="space-y-1 mt-16">
              <NavigationItems />
            </nav>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-4 lg:py-8">
        <div className="grid lg:grid-cols-4 gap-4 lg:gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <nav className="space-y-1 sticky top-8">
              <NavigationItems />
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-soft p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}