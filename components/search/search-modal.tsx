'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Product {
  id: string
  title: string
  slug: string
  price: number
  category: string
  image: string | null
  tags: string[]
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.length > 1) {
        setIsSearching(true)
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ''}`)
          const data = await response.json()
          
          if (response.ok) {
            setResults(data.products || [])
          } else {
            console.error('Search failed:', data.error)
            setResults([])
          }
        } catch (error) {
          console.error('Search error:', error)
          setResults([])
        } finally {
          setIsSearching(false)
        }
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [query, selectedCategory])

  if (!isOpen) return null

  const filteredResults = selectedCategory
    ? results.filter(r => r.category === selectedCategory)
    : results

  const categories = [...new Set(results.map(r => r.category))]

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
      <div className="fixed inset-x-0 top-0 bg-white shadow-2xl max-h-[80vh] overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Search Header */}
          <div className="flex items-center gap-4 py-4 border-b border-sage-100">
            <Search className="h-5 w-5 text-sage-400" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Zoek producten, categorieën..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border-0 focus-visible:ring-0 text-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-sage-50"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Quick Filters */}
          {query && categories.length > 0 && (
            <div className="flex items-center gap-2 py-3 overflow-x-auto">
              <span className="text-sm text-sage-500 mr-2">Filter:</span>
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  !selectedCategory 
                    ? 'bg-sage-400 text-white' 
                    : 'bg-sage-50 text-sage-600 hover:bg-sage-100'
                }`}
              >
                Alles ({results.length})
              </button>
              {categories.map(cat => {
                const count = results.filter(r => r.category === cat).length
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors whitespace-nowrap ${
                      selectedCategory === cat 
                        ? 'bg-sage-400 text-white' 
                        : 'bg-sage-50 text-sage-600 hover:bg-sage-100'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Search Results */}
        <div className="container mx-auto px-4 pb-6 max-h-[60vh] overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-sage-400 animate-spin" />
            </div>
          ) : query.length > 1 && filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sage-500">Geen resultaten gevonden voor "{query}"</p>
              <p className="text-sm text-sage-400 mt-2">Probeer een andere zoekterm</p>
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="grid gap-4 py-4">
              {filteredResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="group"
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 p-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-sage-50 flex-shrink-0">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-sage-100 text-sage-400 text-xs">
                            {product.title.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sage-600 group-hover:text-sage-500 truncate">
                          {product.title}
                        </h3>
                        <p className="text-sm text-sage-500">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sage-600">{formatPrice(product.price)}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-sage-400 group-hover:text-sage-500" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : query.length <= 1 && (
            <div className="py-12">
              <h3 className="font-semibold text-sage-600 mb-4">Populaire zoekopdrachten</h3>
              <div className="flex flex-wrap gap-2">
                {['Seizoenskaarten', 'Mindful', 'Telkaarten', 'Kleuren', 'Herfst', 'Winter'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 bg-sage-50 text-sage-600 rounded-full hover:bg-sage-100 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}