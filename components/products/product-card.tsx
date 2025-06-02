'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Heart, Check } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'

interface ProductCardProps {
  product: {
    id: string
    title: string
    slug: string
    description: string
    price: number
    category?: string
    botanicalTheme?: string
    ageRange?: string
    previewImages?: string[]
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, isInCart } = useCartStore()
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore()
  
  const placeholderImage = `https://placehold.co/400x500/9CAA8B/FFFFFF?text=${encodeURIComponent(product.title)}`
  const imageUrl = product.previewImages?.[0] || placeholderImage
  const inCart = isInCart(product.id)
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      slug: product.slug,
      image: imageUrl,
      botanicalTheme: product.botanicalTheme,
      ageRange: product.ageRange,
    })
  }

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        slug: product.slug,
        image: imageUrl,
        botanicalTheme: product.botanicalTheme,
        ageRange: product.ageRange,
      })
    }
  }

  return (
    <Card className="group overflow-hidden">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-sage-50">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {product.botanicalTheme && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-sage-600">
              {product.botanicalTheme}
            </div>
          )}
          {product.ageRange && (
            <div className="absolute top-4 right-4 bg-sage-400/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-white">
              {product.ageRange}
            </div>
          )}
          <button
            onClick={handleWishlistToggle}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white shadow-soft"
          >
            <Heart className={`h-5 w-5 ${inWishlist ? 'fill-accent-coral text-accent-coral' : 'text-sage-500'}`} />
          </button>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-serif text-lg font-semibold text-sage-600 mb-2 group-hover:text-sage-500 transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="text-sm text-sage-500 line-clamp-2 mb-3">
          {product.description}
        </p>
        <p className="text-xl font-semibold text-sage-600">
          {formatPrice(product.price)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 space-y-2">
        <Button 
          className="w-full" 
          onClick={handleAddToCart}
          variant={inCart ? "secondary" : "default"}
        >
          {inCart ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              In Winkelwagen
            </>
          ) : (
            <>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Toevoegen
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}