'use client'

import { useWishlistStore } from '@/lib/store/wishlist-store'
import { useCartStore } from '@/lib/store/cart-store'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, X, ChevronRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore()
  const addToCart = useCartStore((state) => state.addItem)

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      image: item.image
    })
    removeItem(item.id)
    toast.success('Product toegevoegd aan winkelwagen!')
  }

  const handleAddAllToCart = () => {
    items.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        slug: item.slug,
        price: item.price,
        image: item.image
      })
    })
    clearWishlist()
    toast.success(`${items.length} producten toegevoegd aan winkelwagen!`)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-light">
        <div className="container mx-auto px-4 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="mb-8">
              <div className="w-24 h-24 bg-baby-pink-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-12 h-12 text-baby-pink-400" />
              </div>
            </div>
            <h1 className="text-3xl font-serif font-bold text-primary mb-4">
              Je verlanglijst is leeg
            </h1>
            <p className="text-neutral-medium mb-8">
              Voeg je favoriete producten toe aan je verlanglijst om ze later te bekijken.
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-primary hover:bg-primary-600 text-white rounded-full">
                Ontdek producten
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm mb-4">
            <Link href="/" className="text-neutral-medium hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-neutral-medium" />
            <span className="text-primary font-medium">Verlanglijst</span>
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-serif font-bold text-primary">
              Verlanglijst ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h1>
            {items.length > 0 && (
              <Button
                onClick={handleAddAllToCart}
                className="bg-primary hover:bg-primary-600 text-white rounded-full"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Alles naar winkelwagen
              </Button>
            )}
          </div>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-soft overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/5] bg-neutral-100">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-2">📄</div>
                      <p className="text-sm text-neutral-medium">PDF</p>
                    </div>
                  </div>
                )}
                
                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4 text-neutral-dark" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="font-bold text-lg text-neutral-dark mb-2 line-clamp-1">
                  {item.name}
                </h3>
                
                <div className="flex items-center justify-between mb-4">
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-primary hover:bg-primary-600 text-white rounded-full"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    In winkelwagen
                  </Button>
                  <Link href={`/products/${item.id}`}>
                    <Button
                      variant="outline"
                      className="rounded-full"
                    >
                      Bekijk
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Clear Wishlist */}
        {items.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={clearWishlist}
              className="text-sm text-neutral-medium hover:text-red-500 transition-colors"
            >
              Verlanglijst legen
            </button>
          </div>
        )}
      </div>
    </div>
  )
}