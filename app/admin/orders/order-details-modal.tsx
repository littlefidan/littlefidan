'use client'

import React from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

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

interface OrderDetailsModalProps {
  order: Order
  onClose: () => void
  onStatusUpdate: (orderId: string, status: Order['status']) => void
}

export default function OrderDetailsModal({ order, onClose, onStatusUpdate }: OrderDetailsModalProps) {
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 5.99 // Example shipping cost
  const tax = subtotal * 0.21 // 21% BTW

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-taupe-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-serif text-primary-800">
            Bestelling #{order.order_number}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-medium hover:text-primary-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-neutral-medium mb-2">Bestelstatus</h3>
              <select
                value={order.status}
                onChange={(e) => onStatusUpdate(order.id, e.target.value as Order['status'])}
                className="w-full px-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300"
              >
                <option value="pending">In Afwachting</option>
                <option value="processing">In Behandeling</option>
                <option value="shipped">Verzonden</option>
                <option value="delivered">Geleverd</option>
                <option value="cancelled">Geannuleerd</option>
              </select>
            </div>

            <div>
              <h3 className="text-sm font-medium text-neutral-medium mb-2">Betalingsstatus</h3>
              <div className={`px-4 py-2 rounded-lg text-center ${
                order.payment_status === 'paid' ? 'bg-mint-100 text-mint-700' :
                order.payment_status === 'failed' ? 'bg-red-100 text-red-700' :
                order.payment_status === 'refunded' ? 'bg-olive-100 text-olive-700' :
                'bg-taupe-100 text-taupe-700'
              }`}>
                {order.payment_status}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-neutral-medium mb-2">Besteldatum</h3>
              <div className="text-primary-800">
                {new Date(order.created_at).toLocaleDateString()}<br />
                <span className="text-sm text-neutral-medium">
                  {new Date(order.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-taupe-50 rounded-xl p-4">
              <h3 className="font-medium text-primary-800 mb-3">Klantgegevens</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-neutral-medium">Naam:</span> {order.shipping_address.name}</p>
                <p><span className="text-neutral-medium">Email:</span> {order.user_email}</p>
              </div>
            </div>

            <div className="bg-taupe-50 rounded-xl p-4">
              <h3 className="font-medium text-primary-800 mb-3">Verzendadres</h3>
              <div className="space-y-1 text-sm">
                <p>{order.shipping_address.name}</p>
                <p>{order.shipping_address.street}</p>
                <p>{order.shipping_address.postal_code} {order.shipping_address.city}</p>
                <p>{order.shipping_address.country}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-medium text-primary-800 mb-3">Bestelde Artikelen</h3>
            <div className="bg-white border border-taupe-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-taupe-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-medium uppercase">Product</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-neutral-medium uppercase">Aantal</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-neutral-medium uppercase">Prijs</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-neutral-medium uppercase">Totaal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-taupe-100">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-primary-800">{item.product_name}</td>
                      <td className="px-4 py-3 text-sm text-center text-neutral-medium">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-right text-neutral-medium">€{item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-primary-800">
                        €{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-mint-50 rounded-xl p-4">
            <h3 className="font-medium text-primary-800 mb-3">Besteloverzicht</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-medium">Subtotaal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-medium">Verzending</span>
                <span>€{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-medium">BTW (21%)</span>
                <span>€{tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-mint-200 pt-2 mt-2">
                <div className="flex justify-between font-semibold text-primary-800">
                  <span>Totaal</span>
                  <span className="text-lg">€{order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-taupe-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-taupe-300 text-neutral-dark rounded-lg hover:bg-taupe-50 transition-colors"
            >
              Sluiten
            </button>
            <button
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Factuur Printen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}