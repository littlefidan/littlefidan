'use client'

import React, { useState } from 'react'
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
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Producten', href: '/admin/products', icon: ShoppingBagIcon },
  { name: 'Categorieën', href: '/admin/categories', icon: TagIcon },
  { name: 'Bestellingen', href: '/admin/orders', icon: ClipboardDocumentListIcon },
  { name: 'Nieuwsbrief', href: '/admin/subscribers', icon: EnvelopeIcon },
  { name: 'Bestanden', href: '/admin/files', icon: DocumentTextIcon },
  { name: 'Instellingen', href: '/admin/settings', icon: CogIcon },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex h-screen bg-neutral-light overflow-hidden">
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
            <div className="flex items-center h-16 px-6 border-b border-taupe-200 bg-gradient-to-r from-olive to-sage">
              <h2 className="text-xl font-serif text-white">LittleFidan Admin</h2>
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
                        ? 'bg-gradient-to-r from-mint-50 to-sage-50 text-olive shadow-sm'
                        : 'text-taupe-600 hover:bg-taupe-50 hover:text-olive'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-olive' : 'text-taupe-400 group-hover:text-olive'}`} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-taupe-200">
              <button
                onClick={handleSignOut}
                className="group flex items-center w-full px-4 py-3 text-sm font-medium text-taupe-600 hover:bg-taupe-50 hover:text-olive rounded-xl transition-all"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3 text-taupe-400 group-hover:text-olive" />
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
            <div className="flex items-center justify-between h-16 px-6 border-b border-taupe-200 bg-gradient-to-r from-olive to-sage">
              <h2 className="text-xl font-serif text-white">LittleFidan Admin</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white hover:text-mint-100"
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
                        ? 'bg-gradient-to-r from-mint-50 to-sage-50 text-olive shadow-sm'
                        : 'text-taupe-600 hover:bg-taupe-50 hover:text-olive'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-olive' : 'text-taupe-400 group-hover:text-olive'}`} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Mobile Sidebar Footer */}
            <div className="p-4 border-t border-taupe-200">
              <button
                onClick={handleSignOut}
                className="group flex items-center w-full px-4 py-3 text-sm font-medium text-taupe-600 hover:bg-taupe-50 hover:text-olive rounded-xl transition-all"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3 text-taupe-400 group-hover:text-olive" />
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
              className="text-taupe-600 hover:text-olive lg:hidden"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            
            <div className="flex-1 flex items-center justify-end">
              <span className="text-sm text-taupe-600">Welkom terug, Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-neutral-light">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}