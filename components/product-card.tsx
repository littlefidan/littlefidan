'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  original_price: number | null
  category: string
  images: string[]
  access_type: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore(state => state.addItem)
  const addToWishlist = useWishlistStore(state => state.addItem)
  const isInWishlist = useWishlistStore(state => state.items.some(item => item.id === product.id))

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder.jpg',
      slug: product.slug
    })
    toast.success(`${product.name} toegevoegd aan winkelwagen`)
  }

  const handleAddToWishlist = () => {
    if (!isInWishlist) {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '/placeholder.jpg',
        slug: product.slug
      })
      toast.success(`${product.name} toegevoegd aan favorieten`)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  return (
    <Card className="group overflow-hidden hover:shadow-botanical transition-all duration-300" role="article" aria-label={`Product: ${product.name}`}>
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.access_type === 'free' && (
            <div className="absolute top-2 left-2 bg-mint-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Gratis
            </div>
          )}
          {product.original_price && product.original_price > product.price && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Sale
            </div>
          )}
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <span className="text-xs text-sage-500 uppercase tracking-wide">
            {product.category}
          </span>
        </div>
        
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-sage-600 mb-2 group-hover:text-sage-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-sage-500 mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-sage-600">
              {product.access_type === 'free' ? 'Gratis' : formatPrice(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-sage-400 line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddToWishlist}
            className={`${isInWishlist ? 'text-red-500' : 'text-sage-400'} hover:text-red-500`}
            aria-label={isInWishlist ? `${product.name} verwijderen uit favorieten` : `${product.name} toevoegen aan favorieten`}
            aria-pressed={isInWishlist}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleAddToCart}
            className="flex-1"
            size="sm"
            aria-label={`${product.name} ${product.access_type === 'free' ? 'downloaden' : 'toevoegen aan winkelwagen'}`}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            {product.access_type === 'free' ? 'Download' : 'Toevoegen'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}