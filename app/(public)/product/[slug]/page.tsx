'use client'

import { use, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Heart, Share2, Star, ChevronLeft, ChevronRight, Eye, FileDown, Check } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/lib/store/cart-store'
import { useWishlist } from '@/lib/store/wishlist-store'

// Mock product data - in real app this would come from API
const mockProduct = {
  id: '1',
  name: 'Ramadan Activiteiten Bundel',
  slug: 'ramadan-activiteiten-bundel',
  price: 12.99,
  originalPrice: 19.99,
  description: 'Een complete bundel met 30+ pagina\'s vol leuke en leerzame Ramadan activiteiten voor kinderen van 3-8 jaar. Perfect om de betekenis van Ramadan spelenderwijs te leren!',
  longDescription: `Deze prachtige Ramadan bundel bevat alles wat je nodig hebt om samen met je kinderen deze bijzondere maand te vieren en te leren.

De bundel bevat:
• 15 kleurplaten met Ramadan thema's
• 10 educatieve werkbladen (letters, cijfers, puzzels)
• 5 knutselactiviteiten met instructies
• Ramadan kalender om af te tellen
• Dua kaarten voor kinderen
• Eid decoraties om uit te printen

Alle activiteiten zijn zorgvuldig ontworpen met oog voor detail en respect voor onze tradities. De illustraties zijn modern maar toch authentiek, perfect voor de moderne moslim familie.`,
  features: [
    '30+ pagina\'s printbare content',
    'Geschikt voor 3-8 jaar',
    'Direct downloadbare PDF',
    'Hoge resolutie (300 DPI)',
    'Inclusief Nederlandse instructies',
  ],
  images: [
    'https://placehold.co/800x800/B8E4D0/2D5D4B?text=Ramadan+1',
    'https://placehold.co/800x800/87CEEB/2D5D4B?text=Ramadan+2',
    'https://placehold.co/800x800/D4C4B0/2D5D4B?text=Ramadan+3',
    'https://placehold.co/800x800/C5E1C5/2D5D4B?text=Ramadan+4',
  ],
  category: 'Islamitisch',
  tags: ['ramadan', 'islamitisch', 'werkbladen', 'kleurplaten'],
  rating: 4.9,
  reviewCount: 47,
  inStock: true,
}

const relatedProducts = [
  {
    id: '2',
    name: 'Eid Decoratie Set',
    price: 9.99,
    image: 'https://placehold.co/400x400/E8C5FF/2D5D4B?text=Eid+Set',
    slug: 'eid-decoratie-set',
  },
  {
    id: '3',
    name: 'Arabische Letters Werkboek',
    price: 14.99,
    image: 'https://placehold.co/400x400/FFE5CC/2D5D4B?text=Letters',
    slug: 'arabische-letters-werkboek',
  },
  {
    id: '4',
    name: 'Dua\'s voor Kinderen',
    price: 7.99,
    image: 'https://placehold.co/400x400/CCE5FF/2D5D4B?text=Duas',
    slug: 'duas-voor-kinderen',
  },
]

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, items: wishlistItems } = useWishlist()
  
  const isInWishlist = wishlistItems.some(item => item.id === mockProduct.id)

  const handleAddToCart = () => {
    addItem({
      id: mockProduct.id,
      title: mockProduct.name,
      price: mockProduct.price,
      image: mockProduct.images[0],
      slug: mockProduct.slug,
    })
    setIsAddedToCart(true)
    setTimeout(() => setIsAddedToCart(false), 2000)
  }

  const handleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(mockProduct.id)
    } else {
      addToWishlist({
        id: mockProduct.id,
        title: mockProduct.name,
        price: mockProduct.price,
        image: mockProduct.images[0],
        slug: mockProduct.slug,
      })
    }
  }

  return (
    <>
      {/* Breadcrumb */}
      <section className="py-4 bg-mint-50/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-taupe-600">
            <Link href="/" className="hover:text-olive transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/products" className="hover:text-olive transition-colors">Producten</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-taupe-800 font-medium">{mockProduct.name}</span>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Images */}
            <div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square rounded-3xl overflow-hidden shadow-dreamy mb-4"
              >
                <Image
                  src={mockProduct.images[selectedImage]}
                  alt={mockProduct.name}
                  fill
                  className="object-cover"
                />
                <button className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 shadow-soft hover:shadow-md transition-shadow">
                  <Eye className="h-5 w-5 text-taupe-600" />
                </button>
              </motion.div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-4">
                {mockProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden transition-all ${
                      selectedImage === index 
                        ? 'ring-2 ring-olive shadow-md' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${mockProduct.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm font-medium">
                    {mockProduct.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-baby-blue text-baby-blue" />
                    <span className="text-sm font-medium text-taupe-700">{mockProduct.rating}</span>
                    <span className="text-sm text-taupe-600">({mockProduct.reviewCount} reviews)</span>
                  </div>
                </div>

                <h1 className="font-serif text-3xl md:text-4xl font-bold text-taupe-800 mb-4">
                  {mockProduct.name}
                </h1>

                <p className="text-lg text-taupe-600 mb-6">
                  {mockProduct.description}
                </p>

                <div className="flex items-baseline gap-4 mb-8">
                  <span className="text-3xl font-bold text-olive">€{mockProduct.price}</span>
                  {mockProduct.originalPrice && (
                    <span className="text-xl text-taupe-400 line-through">€{mockProduct.originalPrice}</span>
                  )}
                  {mockProduct.originalPrice && (
                    <span className="px-3 py-1 bg-baby-pink-100 text-baby-pink-700 rounded-full text-sm font-medium">
                      -{Math.round((1 - mockProduct.price / mockProduct.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  {mockProduct.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-sage-600 mt-0.5" />
                      <span className="text-taupe-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mb-8">
                  <Button 
                    size="lg" 
                    onClick={handleAddToCart}
                    className="flex-1 bg-gradient-to-r from-olive to-sage hover:opacity-90 text-white"
                    disabled={isAddedToCart}
                  >
                    {isAddedToCart ? (
                      <>
                        <Check className="mr-2 h-5 w-5" />
                        Toegevoegd!
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-5 w-5" />
                        In Winkelwagen
                      </>
                    )}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleWishlist}
                    className={`px-4 ${isInWishlist ? 'text-baby-pink border-baby-pink' : ''}`}
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
                  </Button>
                  <Button size="lg" variant="outline" className="px-4">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                <Card className="bg-mint-50/50 border-mint-200 p-4">
                  <div className="flex items-center gap-3">
                    <FileDown className="h-5 w-5 text-olive" />
                    <div>
                      <p className="font-medium text-taupe-800">Direct downloadbaar</p>
                      <p className="text-sm text-taupe-600">Na betaling ontvang je direct de download link</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Description Tabs */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="border-b border-taupe-200">
              <div className="flex gap-8">
                <button className="pb-4 border-b-2 border-olive font-medium text-olive">
                  Beschrijving
                </button>
                <button className="pb-4 text-taupe-600 hover:text-taupe-800 transition-colors">
                  Reviews ({mockProduct.reviewCount})
                </button>
              </div>
            </div>

            <div className="py-8 prose prose-taupe max-w-none">
              <div className="whitespace-pre-line text-taupe-700">
                {mockProduct.longDescription}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16 bg-gradient-to-b from-white to-sage-50/30">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-taupe-800 text-center mb-12">
            Misschien vind je dit ook leuk
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {relatedProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Link href={`/product/${product.slug}`}>
                  <Card className="overflow-hidden hover:shadow-dreamy transition-all duration-300">
                    <div className="relative aspect-square">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-taupe-800 mb-2">{product.name}</h3>
                      <p className="text-lg font-bold text-olive">€{product.price}</p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}