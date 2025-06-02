'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, Download, Star, Sparkles, Search, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Product categories
const categories = [
  { id: 'all', name: 'Alle Producten', count: 156 },
  { id: 'islamic', name: 'Islamitisch', count: 45 },
  { id: 'coloring', name: 'Inkleurplaten', count: 38 },
  { id: 'worksheets', name: 'Werkbladen', count: 29 },
  { id: 'seasonal', name: 'Seizoenen', count: 24 },
  { id: 'letters', name: 'Letters & Cijfers', count: 20 },
]

// Mock products - replace with Supabase query
const mockProducts = [
  {
    id: '1',
    title: 'Ramadan Activiteitenboek',
    slug: 'ramadan-activiteitenboek',
    description: '30 dagen vol leuke activiteiten voor de Ramadan',
    price: 14.95,
    category: 'islamic',
    ageRange: '4-8 jaar',
    pages: 65,
    rating: 4.9,
    reviews: 124,
    image: 'https://placehold.co/400x500/A8D5BA/FFFFFF?text=Ramadan',
    badge: 'Bestseller',
  },
  {
    id: '2',
    title: 'Arabisch Alfabet Werkboek',
    slug: 'arabisch-alfabet-werkboek',
    description: 'Leer het Arabische alfabet op een speelse manier',
    price: 12.95,
    category: 'letters',
    ageRange: '5-10 jaar',
    pages: 48,
    rating: 4.8,
    reviews: 89,
    image: 'https://placehold.co/400x500/B5D4E8/FFFFFF?text=Arabisch',
  },
  {
    id: '3',
    title: 'Lente Kleurboek',
    slug: 'lente-kleurboek',
    description: 'Prachtige lente illustraties om in te kleuren',
    price: 8.95,
    category: 'coloring',
    ageRange: '3-8 jaar',
    pages: 30,
    rating: 4.7,
    reviews: 56,
    image: 'https://placehold.co/400x500/FFD4B8/FFFFFF?text=Lente',
    badge: 'Nieuw',
  },
  {
    id: '4',
    title: 'Eid Decoratie Set',
    slug: 'eid-decoratie-set',
    description: 'Printbare decoraties voor Eid ul-Fitr en Eid ul-Adha',
    price: 6.95,
    category: 'islamic',
    ageRange: 'Alle leeftijden',
    pages: 20,
    rating: 5.0,
    reviews: 203,
    image: 'https://placehold.co/400x500/D4A574/FFFFFF?text=Eid',
  },
  {
    id: '5',
    title: 'Cijfers Oefenboek 1-20',
    slug: 'cijfers-oefenboek',
    description: 'Leer tellen en cijfers schrijven met leuke oefeningen',
    price: 10.95,
    category: 'worksheets',
    ageRange: '4-6 jaar',
    pages: 42,
    rating: 4.8,
    reviews: 67,
    image: 'https://placehold.co/400x500/A89F91/FFFFFF?text=Cijfers',
  },
  {
    id: '6',
    title: 'Islamitische Kleurplaten',
    slug: 'islamitische-kleurplaten',
    description: 'Moskeeën, geometrische patronen en meer',
    price: 7.95,
    category: 'islamic',
    ageRange: '5+ jaar',
    pages: 25,
    rating: 4.9,
    reviews: 145,
    image: 'https://placehold.co/400x500/7B8471/FFFFFF?text=Islamic',
  },
  {
    id: '7',
    title: 'Herfst Werkbladen',
    slug: 'herfst-werkbladen',
    description: 'Educatieve activiteiten met herfst thema',
    price: 9.95,
    category: 'seasonal',
    ageRange: '4-8 jaar',
    pages: 35,
    rating: 4.6,
    reviews: 34,
    image: 'https://placehold.co/400x500/E8A598/FFFFFF?text=Herfst',
    badge: 'Populair',
  },
  {
    id: '8',
    title: 'Dua\'s voor Kinderen',
    slug: 'duas-voor-kinderen',
    description: 'Dagelijkse dua\'s met illustraties en uitleg',
    price: 11.95,
    category: 'islamic',
    ageRange: '4-10 jaar',
    pages: 40,
    rating: 5.0,
    reviews: 178,
    image: 'https://placehold.co/400x500/B5D4E8/FFFFFF?text=Duas',
  },
  {
    id: '9',
    title: 'Nederlandse Letters Oefenen',
    slug: 'nederlandse-letters',
    description: 'Leer het alfabet schrijven met deze werkbladen',
    price: 9.95,
    category: 'letters',
    ageRange: '4-7 jaar',
    pages: 52,
    rating: 4.7,
    reviews: 92,
    image: 'https://placehold.co/400x500/A3B88C/FFFFFF?text=Letters',
  },
]

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [priceFilter, setPriceFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Filter products based on category and search
  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
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
              Ontdek onze complete collectie van downloadbare PDF\'s. Van kleurplaten tot educatieve werkbladen.
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
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.id
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
                  <label className="text-sm font-medium text-neutral-dark mb-2 block">Leeftijd</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-taupe-200">
                    <option>Alle leeftijden</option>
                    <option>3-5 jaar</option>
                    <option>5-8 jaar</option>
                    <option>8+ jaar</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-dark mb-2 block">Sorteren</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-taupe-200">
                    <option>Populair</option>
                    <option>Nieuwste eerst</option>
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
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.badge && (
                        <span className="absolute top-4 left-4 bg-accent-gold text-white px-3 py-1 rounded-full text-sm font-medium">
                          {product.badge}
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
                              className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-accent-gold text-accent-gold' : 'text-neutral-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-neutral-medium">({product.reviews})</span>
                      </div>

                      <h3 className="font-bold text-lg text-neutral-dark mb-1 line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="text-sm text-neutral-medium mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-neutral-medium mb-3">
                        <span>{product.pages} pagina\'s</span>
                        <span>{product.ageRange}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-primary">€{product.price}</p>
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
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary-50 rounded-full px-8"
            >
              Laad Meer Producten
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </div>
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
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="jouw@email.nl"
                className="flex-1 rounded-full"
              />
              <Button className="bg-primary hover:bg-primary-600 text-white rounded-full">
                Aanmelden
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}