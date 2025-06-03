'use client'

import React, { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { 
  EyeIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  TruckIcon
} from '@heroicons/react/24/outline'
import OrderDetailsModal from './order-details-modal'

interface Order {
  id: string
  order_number: string
  user_id: string
  user_email: string
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  shipping_address: {
    name: string
    street: string
    city: string
    postal_code: string
    country: string
  }
  items: Array<{
    product_id: string
    product_name: string
    quantity: number
    price: number
  }>
  created_at: string
  updated_at: string
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchOrders()
  }, [filterStatus])

  const fetchOrders = async () => {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus)
      }

      const { data, error } = await query

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (error) throw error

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setModalOpen(true)
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { color: 'bg-taupe-100 text-taupe-700', icon: ClockIcon },
      processing: { color: 'bg-babyblue-100 text-babyblue-700', icon: ClockIcon },
      shipped: { color: 'bg-olive-100 text-olive-700', icon: TruckIcon },
      delivered: { color: 'bg-mint-100 text-mint-700', icon: CheckCircleIcon },
      cancelled: { color: 'bg-red-100 text-red-700', icon: XCircleIcon }
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-4 w-4 mr-1" />
        {status}
      </span>
    )
  }

  const getPaymentBadge = (status: Order['payment_status']) => {
    const colors = {
      pending: 'bg-taupe-100 text-taupe-700',
      paid: 'bg-mint-100 text-mint-700',
      failed: 'bg-red-100 text-red-700',
      refunded: 'bg-olive-100 text-olive-700'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status}
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
      <h1 className="text-3xl font-serif text-primary-800 mb-8">Bestellingen</h1>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-medium" />
              <input
                type="text"
                placeholder="Zoek op bestelnummer of email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300"
              />
            </div>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300"
          >
            <option value="all">Alle Bestellingen</option>
            <option value="pending">In Afwachting</option>
            <option value="processing">In Behandeling</option>
            <option value="shipped">Verzonden</option>
            <option value="delivered">Geleverd</option>
            <option value="cancelled">Geannuleerd</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-taupe-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-medium uppercase tracking-wider">
                  Bestelling
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-medium uppercase tracking-wider">
                  Klant
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-medium uppercase tracking-wider">
                  Bedrag
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-medium uppercase tracking-wider">
                  Betaling
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-medium uppercase tracking-wider">
                  Datum
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-neutral-medium uppercase tracking-wider">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-taupe-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-taupe-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-primary-800">
                      #{order.order_number}
                    </div>
                    <div className="text-xs text-neutral-medium">
                      {order.items.length} artikelen
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-primary-800">{order.shipping_address.name}</div>
                    <div className="text-xs text-neutral-medium">{order.user_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-primary-800">
                      €{order.total_amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentBadge(order.payment_status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(order.status)}
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                        className="text-xs border border-taupe-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-mint-300"
                      >
                        <option value="pending">In Afwachting</option>
                        <option value="processing">In Behandeling</option>
                        <option value="shipped">Verzonden</option>
                        <option value="delivered">Geleverd</option>
                        <option value="cancelled">Geannuleerd</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-medium">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-neutral-medium">
                      {new Date(order.created_at).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {modalOpen && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setModalOpen(false)
            setSelectedOrder(null)
          }}
          onStatusUpdate={(orderId, status) => updateOrderStatus(orderId, status)}
        />
      )}
    </div>
  )
}