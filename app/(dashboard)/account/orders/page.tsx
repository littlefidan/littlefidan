'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Clock, Package, FileText, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate, formatPrice } from '@/lib/utils'

interface OrderItem {
  id: string
  product_name: string
  product_price: number
  quantity: number
  total: number
}

interface Order {
  id: string
  order_number: string
  status: string
  payment_status: string
  subtotal: number
  tax: number
  total: number
  created_at: string
  order_items: OrderItem[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error

      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-mint-100 text-mint-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'cancelled':
      case 'refunded':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-sage-100 text-sage-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Voltooid'
      case 'pending':
        return 'In behandeling'
      case 'processing':
        return 'Wordt verwerkt'
      case 'cancelled':
        return 'Geannuleerd'
      case 'refunded':
        return 'Terugbetaald'
      default:
        return status
    }
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
          Mijn Bestellingen
        </h1>
        <p className="text-sage-500 text-sm md:text-base">
          Bekijk je bestelgeschiedenis en download je producten.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'completed', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === status
                ? 'bg-sage-500 text-white'
                : 'bg-sage-100 text-sage-600 hover:bg-sage-200'
            }`}
          >
            {status === 'all' ? 'Alle' : getStatusText(status)}
            {status === 'all' && ` (${orders.length})`}
            {status !== 'all' && ` (${orders.filter(o => o.status === status).length})`}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-sage-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-sage-400" />
            </div>
            <h3 className="font-semibold text-sage-600 mb-2">
              Geen bestellingen gevonden
            </h3>
            <p className="text-sage-500 mb-6">
              {filter === 'all' 
                ? 'Je hebt nog geen bestellingen geplaatst.'
                : `Je hebt geen ${getStatusText(filter).toLowerCase()} bestellingen.`
              }
            </p>
            <Button asChild>
              <a href="/products">Ontdek onze producten</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden hover:shadow-botanical transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-sage-600">
                        Bestelling #{order.order_number}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-sage-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDate(order.created_at, 'nl-NL')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        {order.order_items.length} {order.order_items.length === 1 ? 'product' : 'producten'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right mt-4 md:mt-0">
                    <p className="text-2xl font-bold text-sage-600">
                      {formatPrice(order.total)}
                    </p>
                    {order.payment_status === 'paid' && (
                      <p className="text-sm text-mint-600">Betaald</p>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-sage-200 pt-4 space-y-3">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-sage-500" />
                        </div>
                        <div>
                          <p className="font-medium text-sage-600">{item.product_name}</p>
                          <p className="text-sm text-sage-500">
                            {item.quantity}x {formatPrice(item.product_price)}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-sage-600">
                        {formatPrice(item.total)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                {order.status === 'completed' && order.payment_status === 'paid' && (
                  <div className="border-t border-sage-200 pt-4 mt-4">
                    <Button asChild variant="outline" className="w-full md:w-auto">
                      <a href="/account/downloads">
                        Ga naar downloads
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}