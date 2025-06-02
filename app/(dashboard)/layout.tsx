'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, ShoppingBag, Download, Heart, Settings, LogOut, CreditCard, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/account', icon: BarChart3 },
  { name: 'Mijn Profiel', href: '/account/profile', icon: User },
  { name: 'Bestellingen', href: '/account/orders', icon: ShoppingBag },
  { name: 'Downloads', href: '/account/downloads', icon: Download },
  { name: 'Favorieten', href: '/account/wishlist', icon: Heart },
  { name: 'Abonnement', href: '/account/subscription', icon: CreditCard },
  { name: 'Instellingen', href: '/account/settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-earth-base">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="space-y-1 sticky top-8">
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
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
              
              <div className="pt-4 mt-4 border-t border-sage-200">
                <Button variant="ghost" className="w-full justify-start text-sage-600" asChild>
                  <Link href="/logout">
                    <LogOut className="h-5 w-5 mr-3" />
                    Uitloggen
                  </Link>
                </Button>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-soft p-6 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}