import { Package, Download, Eye, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

// Mock data - replace with Supabase query
const orders = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-12-15T10:30:00',
    status: 'completed',
    total: 67.85,
    items: [
      {
        id: '1',
        title: 'Seizoenskaarten - Winter',
        price: 12.95,
        image: 'https://placehold.co/100x100/9CAA8B/FFFFFF?text=Winter',
      },
      {
        id: '2',
        title: 'Mindful Kleuren - Botanisch',
        price: 9.95,
        image: 'https://placehold.co/100x100/D4A786/FFFFFF?text=Kleuren',
      },
      {
        id: '3',
        title: 'Culturele Feesten - Nederland',
        price: 18.95,
        image: 'https://placehold.co/100x100/E8B4A0/FFFFFF?text=Feesten',
      },
    ],
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: '2024-12-10T14:20:00',
    status: 'completed',
    total: 28.90,
    items: [
      {
        id: '4',
        title: 'Natuurlijke Telkaarten',
        price: 15.95,
        image: 'https://placehold.co/100x100/8B9A7A/FFFFFF?text=Tellen',
      },
      {
        id: '5',
        title: 'Seizoenskaarten - Herfst',
        price: 12.95,
        image: 'https://placehold.co/100x100/D4A786/FFFFFF?text=Herfst',
      },
    ],
  },
]

const statusColors = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
}

const statusLabels = {
  completed: 'Voltooid',
  pending: 'In behandeling',
  failed: 'Mislukt',
  refunded: 'Terugbetaald',
}

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-sage-600 mb-2">
          Mijn Bestellingen
        </h1>
        <p className="text-sage-500">
          Bekijk je bestelgeschiedenis en download je producten
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              {/* Order Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-sage-100">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-sage-600">{order.orderNumber}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <p className="text-sm text-sage-500">
                    {new Date(order.date).toLocaleDateString('nl-NL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="text-right mt-4 md:mt-0">
                  <p className="text-sm text-sage-500 mb-1">Totaal</p>
                  <p className="font-serif text-2xl font-semibold text-sage-600">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-sage-50 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sage-600 truncate">{item.title}</h4>
                      <p className="text-sm text-sage-500">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/products/${item.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-sage-100">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Alles
                </Button>
                <Button variant="ghost" size="sm">
                  Bekijk Factuur
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-sage-50 rounded-full flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-sage-400" />
            </div>
            <h3 className="font-semibold text-sage-600 mb-2">
              Nog geen bestellingen
            </h3>
            <p className="text-sage-500 mb-6">
              Je hebt nog geen producten gekocht. Ontdek onze collectie!
            </p>
            <Button asChild>
              <Link href="/products">
                Bekijk Producten
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}