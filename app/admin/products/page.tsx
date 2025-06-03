'use client'

import React, { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import ProductModal from './product-modal'

interface Product {
  id: string
  name: string
  slug?: string
  description: string
  price: number
  sale_price?: number
  category: string
  status: 'active' | 'draft' | 'out_of_stock'
  stock?: number
  image_url?: string
  images?: string[]
  product_type?: 'single' | 'bundle'
  access_type?: 'free' | 'paid' | 'mixed'
  created_at: string
  updated_at: string
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchProducts()
  }, [sortBy, sortOrder])

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .order(sortBy, { ascending: sortOrder === 'asc' })

      const { data, error } = await query

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je dit product wilt verwijderen?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setProducts(products.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedProduct(null)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setSelectedProduct(null)
    fetchProducts() // Refresh the list
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', 'activity_books', 'educational', 'craft_kits', 'digital', 'other']

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-mint-100 text-mint-700',
      draft: 'bg-taupe-100 text-taupe-700',
      out_of_stock: 'bg-red-100 text-red-700'
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.replace('_', ' ')}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-primary-800">Producten</h1>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 bg-mint-500 text-white rounded-lg hover:bg-mint-600 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Product Toevoegen
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-medium" />
              <input
                type="text"
                placeholder="Zoek producten..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Alle Categorieën' : cat.replace('_', ' ')}
                </option>
              ))}
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field)
                setSortOrder(order as 'asc' | 'desc')
              }}
              className="px-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300"
            >
              <option value="created_at-desc">Nieuwste Eerst</option>
              <option value="created_at-asc">Oudste Eerst</option>
              <option value="name-asc">Naam A-Z</option>
              <option value="name-desc">Naam Z-A</option>
              <option value="price-asc">Prijs Laag-Hoog</option>
              <option value="price-desc">Prijs Hoog-Laag</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-taupe-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-medium uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-medium uppercase tracking-wider">
                  Categorie
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-medium uppercase tracking-wider">
                  Prijs
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-medium uppercase tracking-wider">
                  Voorraad
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-neutral-medium uppercase tracking-wider">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-taupe-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-taupe-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {(product.image_url || (product.images && product.images[0])) && (
                        <div className="h-10 w-10 flex-shrink-0 mr-4">
                          <Image
                            src={product.image_url || product.images![0]}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-primary-800">{product.name}</div>
                        <div className="text-sm text-neutral-medium truncate max-w-xs">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-medium">
                      {product.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-primary-800">
                      €{product.price.toFixed(2)}
                      {product.sale_price && (
                        <span className="text-mint-500 ml-2">
                          €{product.sale_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      (product.stock || 0) < 10 ? 'text-red-600' : 'text-primary-800'
                    }`}>
                      {product.stock || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-primary-600 hover:text-primary-700 mr-3"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <ProductModal
          product={selectedProduct as any}
          onClose={handleModalClose}
          onSave={fetchProducts}
        />
      )}
    </div>
  )
}