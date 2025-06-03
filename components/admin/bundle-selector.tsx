'use client'

import React, { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { MagnifyingGlassIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  product_type: string
}

interface BundleSelectorProps {
  bundleId?: string
  selectedProducts: string[]
  onProductsChange: (products: string[]) => void
}

export default function BundleSelector({ bundleId, selectedProducts, onProductsChange }: BundleSelectorProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      // Fetch all single products that can be added to bundles
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, category, product_type')
        .eq('product_type', 'single')
        .eq('status', 'active')
        .order('name')

      if (error) {
        console.error('Error fetching products:', error.message)
        // Show helpful message if migration not run yet
        if (error.code === '42P01') {
          console.warn('Products table not found. Please run the database migrations first.')
        }
        setProducts([])
        return
      }
      
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const addProduct = (productId: string) => {
    if (!selectedProducts.includes(productId)) {
      onProductsChange([...selectedProducts, productId])
    }
  }

  const removeProduct = (productId: string) => {
    onProductsChange(selectedProducts.filter(id => id !== productId))
  }

  const moveProduct = (index: number, direction: 'up' | 'down') => {
    const newProducts = [...selectedProducts]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < newProducts.length) {
      [newProducts[index], newProducts[newIndex]] = [newProducts[newIndex], newProducts[index]]
      onProductsChange(newProducts)
    }
  }

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedProductDetails = selectedProducts
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as Product[]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Bundle Producten</h3>
      
      {/* Selected Products */}
      {selectedProductDetails.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Geselecteerde Producten</h4>
          <div className="space-y-2">
            {selectedProductDetails.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.category} - €{product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveProduct(index, 'up')}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      ↑
                    </button>
                  )}
                  {index < selectedProductDetails.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveProduct(index, 'down')}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      ↓
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeProduct(product.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Totale bundle waarde: €{selectedProductDetails.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
          </p>
        </div>
      )}

      {/* Product Search */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Producten Toevoegen</h4>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Zoek producten om toe te voegen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Available Products */}
      {searchTerm && (
        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Geen producten gevonden</p>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredProducts.map(product => {
                const isSelected = selectedProducts.includes(product.id)
                return (
                  <div
                    key={product.id}
                    className={`flex items-center justify-between p-3 hover:bg-gray-50 ${
                      isSelected ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">
                        {product.category} - €{product.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addProduct(product.id)}
                      disabled={isSelected}
                      className={`p-2 rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}