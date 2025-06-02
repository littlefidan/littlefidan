'use client'

import { useState, useEffect } from 'react'
import { Download, Clock, Search, Filter, FileText, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import DownloadButton from '@/components/download-button'
import { toast } from 'sonner'

interface ProductFile {
  id: string
  file_name: string
  file_size: number
  file_type: string
}

interface Product {
  id: string
  name: string
  category: string
  product_files: ProductFile[]
}

interface OrderItem {
  id: string
  created_at: string
  product: Product
}

interface Order {
  id: string
  order_number: string
  created_at: string
  payment_status: string
  order_items: OrderItem[]
}

export default function DownloadsPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchDownloads()
  }, [])

  const fetchDownloads = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // First, fetch user's paid orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .eq('payment_status', 'paid')
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      if (!ordersData || ordersData.length === 0) {
        setOrders([])
        return
      }

      // Fetch order items for these orders
      const orderIds = ordersData.map(order => order.id)
      const { data: orderItemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds)

      if (itemsError) throw itemsError

      // Fetch products for the order items
      const productIds = orderItemsData?.map(item => item.product_id) || []
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds)

      if (productsError) throw productsError

      // Fetch product files for these products
      const { data: filesData, error: filesError } = await supabase
        .from('product_files')
        .select('*')
        .in('product_id', productIds)

      if (filesError) throw filesError

      // Combine all data
      const ordersWithItems = ordersData.map(order => ({
        ...order,
        order_items: orderItemsData?.filter(item => item.order_id === order.id).map(item => {
          const product = productsData?.find(p => p.id === item.product_id)
          const productFiles = filesData?.filter(f => f.product_id === item.product_id) || []
          
          return {
            ...item,
            product: {
              ...product,
              product_files: productFiles
            }
          }
        }) || []
      }))

      setOrders(ordersWithItems)
    } catch (error) {
      console.error('Error fetching downloads:', error)
      toast.error('Kon downloads niet laden')
    } finally {
      setLoading(false)
    }
  }

  // Extract all downloadable items
  const downloadableItems = orders.flatMap(order => 
    order.order_items.map(item => ({
      orderId: order.id,
      orderNumber: order.order_number,
      orderDate: order.created_at,
      product: item.product,
      files: item.product.product_files || []
    }))
  )

  // Get unique categories
  const categories = [...new Set(downloadableItems.map(item => item.product.category))]

  // Filter items
  const filteredItems = downloadableItems.filter((item) => {
    const matchesSearch = item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDaysRemaining = (orderDate: string) => {
    const order = new Date(orderDate)
    const expiry = new Date(order.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days
    const today = new Date()
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return { days: diffDays, expiryDate: expiry }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-sage-600 mb-2">
          Mijn Downloads
        </h1>
        <p className="text-sage-500 text-sm md:text-base">
          Download je gekochte producten. Downloads zijn 30 dagen geldig na aankoop.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sage-400" />
          <Input
            placeholder="Zoek in downloads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            className="flex h-10 rounded-xl border border-sage-200 bg-white px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Alle categorieën</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-sage-50 border-sage-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-sage-600 mt-0.5" />
            <div className="text-sm text-sage-600">
              <p className="font-medium mb-1">Download Informatie</p>
              <p>
                Je kunt producten onbeperkt downloaden binnen 30 dagen na aankoop. 
                Downloads verlopen automatisch na deze periode.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Downloads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {filteredItems.map((item, index) => {
          const { days: daysRemaining, expiryDate } = getDaysRemaining(item.orderDate)
          const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0
          const isExpired = daysRemaining <= 0
          
          return (
            <Card key={`${item.orderId}-${item.product.id}-${index}`} className={isExpired ? 'opacity-60' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-sage-50 rounded-xl p-3">
                      <FileText className="h-6 w-6 text-sage-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sage-600">{item.product.name}</h3>
                      <p className="text-sm text-sage-500">{item.product.category}</p>
                      <p className="text-xs text-sage-400 mt-1">
                        Bestelling: {item.orderNumber}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className={`h-4 w-4 ${isExpiringSoon ? 'text-orange-500' : 'text-sage-400'}`} />
                    <span className={`${isExpiringSoon ? 'text-orange-600 font-medium' : 'text-sage-500'}`}>
                      {isExpired 
                        ? 'Verlopen' 
                        : isExpiringSoon 
                          ? `Nog ${daysRemaining} dagen` 
                          : `Geldig tot ${formatDate(expiryDate.toISOString(), 'nl-NL')}`
                      }
                    </span>
                  </div>
                  <span className="text-sm text-sage-500">
                    {item.files.length} {item.files.length === 1 ? 'bestand' : 'bestanden'}
                  </span>
                </div>

                {/* File list */}
                <div className="space-y-2">
                  {item.files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-sage-500" />
                        <span className="text-sm text-sage-600">{file.file_name}</span>
                        <span className="text-xs text-sage-400">
                          ({(file.file_size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                      <DownloadButton
                        fileId={file.id}
                        fileName={file.file_name}
                        productName={item.product.name}
                        size="sm"
                        className={isExpired ? 'opacity-50 cursor-not-allowed' : ''}
                      />
                    </div>
                  ))}
                </div>

                {isExpired && (
                  <p className="text-xs text-center text-sage-500 mt-4">
                    Contact support voor toegang
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-sage-50 rounded-full flex items-center justify-center mb-4">
              <Download className="h-8 w-8 text-sage-400" />
            </div>
            <h3 className="font-semibold text-sage-600 mb-2">
              Geen downloads gevonden
            </h3>
            <p className="text-sage-500">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Probeer je zoekopdracht aan te passen'
                : 'Je hebt nog geen producten om te downloaden'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}