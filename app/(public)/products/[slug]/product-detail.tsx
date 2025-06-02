'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Download, Heart, Share2, Check, ChevronRight, Package, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import ProductCard from '@/components/product-card'

interface ProductFile {
  id: string
  file_name: string
  file_size: number
  is_preview: boolean
}

interface BundleItem {
  id: string
  product: {
    id: string
    name: string
    description: string
    price: number
    images: string[]
  }
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  long_description: string | null
  price: number
  original_price: number | null
  category: string
  tags: string[] | null
  images: string[]
  features: string[] | null
  product_type: string
  access_type: string
  product_files: ProductFile[]
  download_count: number
}

interface ProductDetailProps {
  product: Product
  bundleItems: BundleItem[]
  relatedProducts: Product[]
}

export default function ProductDetail({ product, bundleItems, relatedProducts }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const addToCart = useCartStore((state) => state.addItem)
  const toggleWishlist = useWishlistStore((state) => state.toggleItem)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id))

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] || ''
    })
    
    toast.success('Toegevoegd aan winkelwagen!')
    setIsAddingToCart(false)
  }

  const handleWishlist = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] || ''
    })
    
    toast.success(isInWishlist ? 'Verwijderd uit verlanglijst' : 'Toegevoegd aan verlanglijst')
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      })
    } catch (error) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link gekopieerd!')
    }
  }

  // Default features if none provided
  const features = product.features || [
    'Hoogwaardige digitale download',
    'Direct te printen op A4 formaat',
    'Watermark-vrije bestanden',
    'Onbeperkt downloaden'
  ]

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-taupe-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-neutral-medium hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-neutral-medium" />
            <Link href="/products" className="text-neutral-medium hover:text-primary">
              Producten
            </Link>
            <ChevronRight className="h-4 w-4 text-neutral-medium" />
            <Link href={`/category/${product.category}`} className="text-neutral-medium hover:text-primary capitalize">
              {product.category.replace('-', ' ')}
            </Link>
            <ChevronRight className="h-4 w-4 text-neutral-medium" />
            <span className="text-primary font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100">
              {product.images && product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">📄</div>
                    <p className="text-lg text-neutral-medium">PDF Download</p>
                  </div>
                </div>
              )}
              
              {/* Product badges */}
              <div className="absolute top-4 left-4 space-y-2">
                {product.access_type === 'free' && (
                  <span className="block bg-mint-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Gratis
                  </span>
                )}
                {product.product_type === 'bundle' && (
                  <span className="block bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    Bundel
                  </span>
                )}
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden ring-2 transition-all ${
                      selectedImage === index
                        ? 'ring-primary ring-offset-2'
                        : 'ring-transparent hover:ring-taupe-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Title & Price */}
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-neutral-dark mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-neutral-medium mb-4">
                {product.description}
              </p>
              
              <div className="flex items-baseline gap-4 mb-4">
                {product.access_type === 'free' ? (
                  <p className="text-3xl font-bold text-mint-600">Gratis</p>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-primary">€{product.price}</p>
                    {product.original_price && (
                      <p className="text-xl text-neutral-medium line-through">€{product.original_price}</p>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-neutral-medium">
                <span className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  {product.download_count} downloads
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {product.product_files.length} bestanden
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="flex-1 bg-primary hover:bg-primary-600 text-white"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? (
                  'Toevoegen...'
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    {product.access_type === 'free' ? 'Gratis Downloaden' : 'In Winkelwagen'}
                  </>
                )}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleWishlist}
                className={isInWishlist ? 'border-baby-pink-500 text-baby-pink-600' : ''}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </Button>
              <Button size="lg" variant="outline" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <Card className="p-6 bg-mint-50 border-mint-200">
              <h3 className="font-semibold text-neutral-dark mb-4 flex items-center gap-2">
                <Check className="h-5 w-5 text-mint-600" />
                Wat je krijgt
              </h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-mint-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-neutral-dark">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-taupe-100 text-taupe-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Product Description */}
        {product.long_description && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-serif font-bold text-neutral-dark mb-6">
              Over dit product
            </h2>
            <Card className="p-8">
              <div className="prose prose-neutral max-w-none">
                <p className="whitespace-pre-wrap">{product.long_description}</p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Bundle Items */}
        {product.product_type === 'bundle' && bundleItems.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-serif font-bold text-neutral-dark mb-6 flex items-center gap-2">
              <Package className="h-6 w-6" />
              Inbegrepen in deze bundel
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bundleItems.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                      {item.product.images?.[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="h-8 w-8 text-neutral-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-neutral-dark line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-neutral-medium line-clamp-2 mt-1">
                        {item.product.description}
                      </p>
                      <p className="text-sm font-medium text-primary mt-2">
                        Waarde: €{item.product.price}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-serif font-bold text-neutral-dark mb-6">
              Misschien vind je dit ook leuk
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}