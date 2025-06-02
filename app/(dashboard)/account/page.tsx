import { ShoppingBag, Download, Heart, TrendingUp, Calendar, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

// Mock data - replace with real data from Supabase
const stats = {
  totalOrders: 12,
  totalDownloads: 48,
  wishlistItems: 7,
  subscriptionStatus: 'active',
  totalSpent: 234.50,
  memberSince: '2024-03-15',
}

const recentOrders = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-12-15',
    total: 45.90,
    status: 'completed',
    items: 3,
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: '2024-12-10',
    total: 28.95,
    status: 'completed',
    items: 2,
  },
]

const recentDownloads = [
  {
    id: '1',
    title: 'Seizoenskaarten - Winter',
    downloadDate: '2024-12-15',
    downloadsLeft: 3,
  },
  {
    id: '2',
    title: 'Mindful Kleuren - Botanisch',
    downloadDate: '2024-12-10',
    downloadsLeft: 4,
  },
]

export default function AccountDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-sage-600 mb-2">
          Welkom terug!
        </h1>
        <p className="text-sage-500">
          Hier vind je een overzicht van je account en recente activiteiten.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="text-sm font-medium text-sage-600">Bestellingen</span>
              <ShoppingBag className="h-4 w-4 text-sage-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-sage-600">{stats.totalOrders}</p>
            <p className="text-xs text-sage-500 mt-1">Totaal geplaatst</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="text-sm font-medium text-sage-600">Downloads</span>
              <Download className="h-4 w-4 text-sage-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-sage-600">{stats.totalDownloads}</p>
            <p className="text-xs text-sage-500 mt-1">Producten gedownload</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="text-sm font-medium text-sage-600">Favorieten</span>
              <Heart className="h-4 w-4 text-sage-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-sage-600">{stats.wishlistItems}</p>
            <p className="text-xs text-sage-500 mt-1">In je wishlist</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="text-sm font-medium text-sage-600">Totaal Besteed</span>
              <TrendingUp className="h-4 w-4 text-sage-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-sage-600">{formatPrice(stats.totalSpent)}</p>
            <p className="text-xs text-sage-500 mt-1">Sinds lid</p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Status */}
      <Card className="bg-sage-50 border-sage-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg">Abonnement Status</span>
            <span className="text-sm font-normal bg-sage-400 text-white px-3 py-1 rounded-full">
              Actief
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sage-600">Basic Plan</p>
              <p className="text-sm text-sage-500">€19/maand • Onbeperkt downloads</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/account/subscription">Beheer Abonnement</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-semibold text-sage-600">
              Recente Bestellingen
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/account/orders">Bekijk alle</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-sage-50 rounded-full p-2">
                        <Package className="h-4 w-4 text-sage-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sage-600">{order.orderNumber}</p>
                        <p className="text-sm text-sage-500">
                          {new Date(order.date).toLocaleDateString('nl-NL')} • {order.items} items
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sage-600">{formatPrice(order.total)}</p>
                      <p className="text-xs text-sage-500 capitalize">{order.status}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Downloads */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-semibold text-sage-600">
              Recente Downloads
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/account/downloads">Bekijk alle</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {recentDownloads.map((download) => (
              <Card key={download.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-sage-50 rounded-full p-2">
                        <Download className="h-4 w-4 text-sage-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sage-600">{download.title}</p>
                        <p className="text-sm text-sage-500">
                          {new Date(download.downloadDate).toLocaleDateString('nl-NL')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button size="sm" variant="outline">
                        Download
                      </Button>
                      <p className="text-xs text-sage-500 mt-1">
                        {download.downloadsLeft} van 5 over
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-earth-warm border-sage-200">
        <CardHeader>
          <CardTitle className="text-lg">Snelle Acties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link href="/products">Nieuwe Producten Ontdekken</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/account/wishlist">Bekijk Wishlist</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/instagram">Instagram Feed</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}