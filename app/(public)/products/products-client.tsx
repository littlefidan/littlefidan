'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Filter, Download, Star, Sparkles, Search, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NewsletterForm } from '@/components/newsletter-form'
import { ProductSkeleton } from '@/components/ui/skeleton'

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  original_price: number | null
  images: string[]
  category: string
  product_type: string
  access_type: string
  tags: string[] | null
  download_count: number
}

interface InitialData {
  categories: Category[]
  products: Product[]
  totalProducts: number
}

export default function ProductsClient({ initialData }: { initialData: InitialData }) {
  const [products, setProducts] = useState(initialData.products)
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [priceFilter, setPriceFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [offset, setOffset] = useState(12)
  const [hasMore, setHasMore] = useState(initialData.totalProducts > 12)

  // Create category list with counts
  const categoriesWithCounts = [
    { id: 'all', name: 'Alle Producten', slug: 'all', count: initialData.totalProducts },
    ...initialData.categories.map(cat => ({
      ...cat,
      count: products.filter(p => p.category === cat.slug).length
    }))
  ]

  // Load more products
  const loadMore = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: '12',
        offset: offset.toString(),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery })
      })

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()

      if (data.products) {
        setProducts([...products, ...data.products])
        setOffset(offset + 12)
        setHasMore(offset + 12 < data.total)
      }
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter products when category or search changes
  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          limit: '12',
          offset: '0',
          ...(selectedCategory !== 'all' && { category: selectedCategory }),
          ...(searchQuery && { search: searchQuery })
        })

        const response = await fetch(`/api/products?${params}`)
        const data = await response.json()

        if (data.products) {
          setProducts(data.products)
          setOffset(12)
          setHasMore(12 < data.total)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    // Debounce search
    const timer = setTimeout(() => {
      if (searchQuery || selectedCategory !== 'all') {
        fetchFiltered()
      } else {
        setProducts(initialData.products)
        setOffset(12)
        setHasMore(initialData.totalProducts > 12)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [selectedCategory, searchQuery, initialData.products, initialData.totalProducts])

  // Filter products by price
  const filteredProducts = products.filter(product => {
    if (priceFilter === 'all') return true
    if (priceFilter === '0-10') return product.price <= 10
    if (priceFilter === '10-15') return product.price > 10 && product.price <= 15
    if (priceFilter === '15+') return product.price > 15
    return true
  })

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Hero Section */}
      <section className="bg-cream-50 py-12 border-b border-taupe-200">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-neutral-dark mb-4">
              Alle <span className="text-primary">Producten</span>
            </h1>
            <p className="text-lg text-neutral-medium max-w-2xl mx-auto mb-8">
              Ontdek onze complete collectie van downloadbare PDF's. Van kleurplaten tot educatieve werkbladen.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-medium" />
              <Input
                type="text"
                placeholder="Zoek producten..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 w-full rounded-full border-2 border-taupe-200 focus:border-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-5 w-5 text-neutral-medium hover:text-neutral-dark" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories & Filters */}
      <section className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categoriesWithCounts.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.slug
                      ? 'bg-primary text-white'
                      : 'bg-taupe-100 text-neutral-dark hover:bg-taupe-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
            
            {/* Filter Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="border-taupe-300"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t border-taupe-200 mt-4 pt-4"
            >
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-dark mb-2 block">Prijs</label>
                  <select 
                    className="w-full px-3 py-2 rounded-lg border border-taupe-200"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                  >
                    <option value="all">Alle prijzen</option>
                    <option value="0-10">€0 - €10</option>
                    <option value="10-15">€10 - €15</option>
                    <option value="15+">€15+</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-dark mb-2 block">Type</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-taupe-200">
                    <option>Alle types</option>
                    <option>Enkel product</option>
                    <option>Bundel</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-dark mb-2 block">Sorteren</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-taupe-200">
                    <option>Nieuwste eerst</option>
                    <option>Populair</option>
                    <option>Prijs laag-hoog</option>
                    <option>Prijs hoog-laag</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setSelectedCategory('all')
                      setPriceFilter('all')
                      setSearchQuery('')
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Results Count */}
          <p className="text-neutral-medium mb-6">
            {filteredProducts.length} producten gevonden
          </p>

          {/* Products */}
          {loading && products.length === 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/products/${product.slug}`}>
                      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                        {/* Image */}
                        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                          {product.images && product.images[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-6xl mb-2">📄</div>
                                <p className="text-sm text-neutral-medium">PDF</p>
                              </div>
                            </div>
                          )}
                          {product.access_type === 'free' && (
                            <span className="absolute top-4 left-4 bg-mint-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Gratis
                            </span>
                          )}
                          {product.product_type === 'bundle' && (
                            <span className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                              Bundel
                            </span>
                          )}
                          <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Download className="h-4 w-4 text-neutral-dark" />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${i < 4 ? 'fill-accent-gold text-accent-gold' : 'text-neutral-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-xs text-neutral-medium">({product.download_count})</span>
                          </div>

                          <h3 className="font-bold text-lg text-neutral-dark mb-1 line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-sm text-neutral-medium mb-3 line-clamp-2">
                            {product.description}
                          </p>

                          <div className="flex items-center justify-between">
                            {product.access_type === 'free' ? (
                              <p className="text-2xl font-bold text-mint-600">Gratis</p>
                            ) : (
                              <div>
                                <p className="text-2xl font-bold text-primary">€{product.price}</p>
                                {product.original_price && (
                                  <p className="text-sm text-neutral-medium line-through">€{product.original_price}</p>
                                )}
                              </div>
                            )}
                            <Button size="sm" className="bg-primary hover:bg-primary-600 text-white rounded-full">
                              Bekijk
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="text-center mt-12">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-2 border-primary text-primary hover:bg-primary-50 rounded-full px-8"
                    onClick={loadMore}
                    disabled={loading}
                  >
                    {loading ? 'Laden...' : 'Laad Meer Producten'}
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-gradient-to-br from-mint-50 to-babyblue-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="font-serif text-3xl font-bold text-neutral-dark mb-4">
              Mis geen nieuwe producten
            </h2>
            <p className="text-neutral-medium mb-8">
              Meld je aan voor onze nieuwsbrief en ontvang 10% korting op je eerste bestelling!
            </p>
            <NewsletterForm className="max-w-md mx-auto" />
          </motion.div>
        </div>
      </section>
    </div>
  )
}