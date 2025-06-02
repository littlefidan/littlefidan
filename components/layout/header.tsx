'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Heart, Menu, X, User, Search, Sparkles, Instagram, Gift, Download, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchModal } from '@/components/search/search-modal'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const cartItems = useCartStore((state) => state.getTotalItems())
  const wishlistItems = useWishlistStore((state) => state.getTotalItems())

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Spacer for fixed header */}
      <div className="h-24" />
      
      <motion.header 
        className={cn(
          "fixed top-4 left-4 right-4 z-50 transition-all duration-500 rounded-[2rem]",
          scrolled 
            ? "bg-white/95 backdrop-blur-2xl shadow-[0_8px_32px_rgba(92,122,89,0.12),0_2px_8px_rgba(92,122,89,0.04)]" 
            : "bg-white/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(92,122,89,0.08)]"
        )}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        whileHover={{ 
          boxShadow: scrolled 
            ? "0_12px_40px_rgba(92,122,89,0.15),0_4px_12px_rgba(92,122,89,0.06)" 
            : "0_8px_32px_rgba(92,122,89,0.12),0_2px_8px_rgba(92,122,89,0.04)"
        }}
      >
        <div className="px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                whileHover={{ rotate: 12, scale: 1.1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-mint to-sage rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative rounded-full bg-gradient-to-br from-mint to-sage p-2.5">
                  {/* Sprout/Seedling SVG Icon */}
                  <svg 
                    className="h-5 w-5 text-white" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    {/* Stem */}
                    <path d="M12 22V13" />
                    {/* Left leaf */}
                    <path d="M12 13C12 13 8 10 8 7C8 4 10 2 12 2C10 2 8 4 8 7C8 10 12 13 12 13Z" fill="currentColor" fillOpacity="0.3" />
                    {/* Right leaf */}
                    <path d="M12 13C12 13 16 10 16 7C16 4 14 2 12 2C14 2 16 4 16 7C16 10 12 13 12 13Z" fill="currentColor" fillOpacity="0.3" />
                    {/* Soil/Ground */}
                    <path d="M7 22H17" />
                  </svg>
                </div>
              </motion.div>
              <span className="font-script text-2xl text-taupe-800">
                LittleFidan
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/products" className="relative group">
                <span className="text-taupe-600 hover:text-olive transition-all duration-300 text-sm font-medium">
                  Producten
                </span>
                <motion.span 
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-mint to-sage rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
              <Link href="/products?category=islamic" className="relative group">
                <span className="text-taupe-600 hover:text-olive transition-all duration-300 text-sm font-medium">
                  Islamitisch
                </span>
                <motion.span 
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-mint to-sage rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
              <Link href="/instagram" className="relative group">
                <span className="text-taupe-600 hover:text-olive transition-all duration-300 text-sm font-medium flex items-center gap-1.5">
                  <Instagram className="h-3.5 w-3.5" />
                  Instagram
                </span>
                <motion.span 
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-mint to-sage rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className="relative rounded-full hover:bg-mint-100 w-9 h-9"
                >
                  <Search className="h-4 w-4 text-taupe-600" />
                </Button>
              </motion.div>

              <Link href="/wishlist">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full hover:bg-baby-pink-100 w-9 h-9"
                  >
                    <Heart className="h-4 w-4 text-taupe-600" />
                    <AnimatePresence>
                      {wishlistItems > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1 -right-1 bg-baby-pink text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium"
                        >
                          {wishlistItems}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </Link>

              <Link href="/cart">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full hover:bg-sage-100 w-9 h-9"
                  >
                    <ShoppingCart className="h-4 w-4 text-taupe-600" />
                    <AnimatePresence>
                      {cartItems > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1 -right-1 bg-sage text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium"
                        >
                          {cartItems}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </Link>

              <Link href="/account" className="hidden lg:block">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full hover:bg-baby-blue-100 w-9 h-9"
                  >
                    <User className="h-4 w-4 text-taupe-600" />
                  </Button>
                </motion.div>
              </Link>

              {/* Shop Nu Button Desktop */}
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="hidden lg:block"
              >
                <Button
                  className="bg-gradient-to-r from-olive to-sage hover:opacity-90 text-white rounded-full px-5 py-2 text-sm font-medium shadow-lg shadow-sage/20"
                  asChild
                >
                  <Link href="/products">
                    <Download className="mr-2 h-3.5 w-3.5" />
                    Shop Nu
                  </Link>
                </Button>
              </motion.div>

              {/* Mobile Menu Toggle */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden rounded-full hover:bg-taupe-100 w-9 h-9"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <AnimatePresence mode="wait">
                    {isMobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-4 w-4 text-taupe-600" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="h-4 w-4 text-taupe-600" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              className="fixed top-20 left-4 right-4 z-50 lg:hidden bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_16px_48px_rgba(92,122,89,0.15)] overflow-hidden"
            >
              <nav className="p-6 space-y-2">
                {[
                  { href: '/products', label: 'Alle Producten', icon: Sparkles, color: 'olive' },
                  { href: '/products?category=islamic', label: 'Islamitische Producten', icon: null, color: 'mint' },
                  { href: '/instagram', label: 'Instagram', icon: Instagram, color: 'baby-blue' },
                ].map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl transition-all",
                        item.color === 'olive' && "hover:bg-olive-50 hover:text-olive",
                        item.color === 'mint' && "hover:bg-mint-50 hover:text-mint-600",
                        item.color === 'baby-blue' && "hover:bg-baby-blue-50 hover:text-baby-blue-600",
                        item.color === 'sage' && "hover:bg-sage-50 hover:text-sage-600"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon && <item.icon className="h-5 w-5" />}
                        <span className="font-medium">{item.label}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
                
                <div className="border-t border-taupe-100 pt-4 mt-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full rounded-full border-taupe-200">
                        <User className="h-4 w-4 mr-2" />
                        Account
                      </Button>
                    </Link>
                    <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-olive to-sage text-white rounded-full">
                        <Download className="h-4 w-4 mr-2" />
                        Shop Nu
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}