'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  ClipboardDocumentListIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
  TagIcon,
  EnvelopeIcon,
  SparklesIcon,
  CalendarDaysIcon,
  GiftIcon,
  ChartBarIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'AI Generator', href: '/admin/ai-generator', icon: SparklesIcon },
  { name: 'Producten', href: '/admin/products', icon: ShoppingBagIcon },
  { name: 'Bestellingen', href: '/admin/orders', icon: ClipboardDocumentListIcon },
  { name: 'Categorieën', href: '/admin/categories', icon: TagIcon },
  { name: 'Bundle Builder', href: '/admin/bundle-builder', icon: GiftIcon },
  { name: 'Content Planning', href: '/admin/content-planning', icon: CalendarDaysIcon },
  { name: 'Bestanden', href: '/admin/files', icon: DocumentTextIcon },
  { name: 'Nieuwsbrief', href: '/admin/subscribers', icon: EnvelopeIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Media Library', href: '/admin/media', icon: PhotoIcon },
  { name: 'Instellingen', href: '/admin/settings', icon: CogIcon },
]

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    // Get user email
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || 'Admin')
      }
    }
    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white shadow-lg overflow-y-auto">
            {/* Sidebar Header */}
            <div className="flex items-center h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-amber-500 to-rose-500">
              <h2 className="text-xl font-bold text-white">LittleFidan Admin</h2>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-50 to-rose-50 text-amber-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-amber-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="mb-3 px-4">
                <p className="text-xs text-gray-500">Ingelogd als:</p>
                <p className="text-sm font-medium text-gray-700 truncate">{userEmail}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="group flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-gray-600" />
                Uitloggen
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween' }}
            className="fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white shadow-xl lg:hidden"
          >
            {/* Mobile Sidebar Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-amber-500 to-rose-500">
              <h2 className="text-xl font-bold text-white">LittleFidan Admin</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-50 to-rose-50 text-amber-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-amber-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Mobile Sidebar Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="mb-3 px-4">
                <p className="text-xs text-gray-500">Ingelogd als:</p>
                <p className="text-sm font-medium text-gray-700 truncate">{userEmail}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="group flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-gray-600" />
                Uitloggen
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900 lg:hidden"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            
            <div className="flex-1 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                {menuItems.find(item => item.href === pathname)?.name || 'Admin'}
              </h2>
              <span className="text-sm text-gray-600">
                {new Date().toLocaleDateString('nl-NL', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}