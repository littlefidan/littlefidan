'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { useCartStore } from '@/lib/store/cart-store'
import { formatPrice } from '@/lib/utils'

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore()
  const { addItem: addToCart } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-sage-600 mb-2">
            Mijn Favorieten
          </h1>
          <p className="text-sage-500">
            Producten die je hebt opgeslagen voor later
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="bg-sage-100 h-48 rounded-xl mb-4" />
                <div className="h-4 bg-sage-100 rounded mb-2" />
                <div className="h-3 bg-sage-100 rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      slug: item.slug,
      image: item.image,
      botanicalTheme: item.botanicalTheme,
      ageRange: item.ageRange,
    })
  }

  const moveAllToCart = () => {
    items.forEach(item => handleAddToCart(item))
    clearWishlist()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-sage-600 mb-2">
            Mijn Favorieten
          </h1>
          <p className="text-sage-500">
            {items.length} {items.length === 1 ? 'product' : 'producten'} opgeslagen
          </p>
        </div>
        {items.length > 0 && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={clearWishlist}>
              Alles verwijderen
            </Button>
            <Button onClick={moveAllToCart}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Alles naar winkelwagen
            </Button>
          </div>
        )}
      </div>

      {/* Wishlist Items */}
      {items.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <CardContent className="p-0">
                <Link href={`/products/${item.slug}`}>
                  <div className="relative aspect-[4/5] overflow-hidden bg-sage-50">
                    <Image
                      src={item.image || `https://placehold.co/400x500/9CAA8B/FFFFFF?text=${encodeURIComponent(item.title)}`}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {item.botanicalTheme && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-sage-600">
                        {item.botanicalTheme}
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="p-4">
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="font-serif text-lg font-semibold text-sage-600 mb-2 group-hover:text-sage-500 transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xl font-semibold text-sage-600">
                      {formatPrice(item.price)}
                    </p>
                    {item.ageRange && (
                      <span className="text-sm text-sage-500">{item.ageRange}</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Toevoegen
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-xs text-sage-400 mt-2 text-center">
                    Toegevoegd op {new Date(item.addedAt).toLocaleDateString('nl-NL')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-sage-50 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-sage-400" />
            </div>
            <h3 className="font-semibold text-sage-600 mb-2">
              Nog geen favorieten
            </h3>
            <p className="text-sage-500 mb-6">
              Bewaar je favoriete producten hier om ze later gemakkelijk terug te vinden
            </p>
            <Button asChild>
              <Link href="/products">
                Ontdek Producten
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}