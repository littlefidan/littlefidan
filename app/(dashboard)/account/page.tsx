import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Download, ShoppingBag, Heart, User, FileText, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'

export default async function AccountDashboard() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get or create profile
  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  // If no profile exists, create one
  if (!profile) {
    const { data: newProfile } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || null,
        is_admin: false
      })
      .select()
      .single()
    
    profile = newProfile
  }

  // Get user statistics
  const { count: orderCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: downloadCount } = await supabase
    .from('order_items')
    .select(`
      *,
      order:orders!inner(*)
    `, { count: 'exact', head: true })
    .eq('order.user_id', user.id)
    .eq('order.payment_status', 'paid')

  // Get recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-sage-600 mb-2">
          Welkom terug{profile?.full_name ? `, ${profile.full_name}` : ''}!
        </h1>
        <p className="text-sage-500 text-sm md:text-base">
          Beheer je account, bestellingen en downloads vanaf één plek.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="group hover:shadow-botanical transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sage-600">
              Bestellingen
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-sage-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sage-600">{orderCount || 0}</div>
            <Link href="/account/orders" className="text-xs text-sage-500 hover:text-sage-600 mt-1 inline-block">
              Bekijk alle bestellingen →
            </Link>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-botanical transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sage-600">
              Downloads
            </CardTitle>
            <Download className="h-4 w-4 text-sage-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sage-600">{downloadCount || 0}</div>
            <Link href="/account/downloads" className="text-xs text-sage-500 hover:text-sage-600 mt-1 inline-block">
              Ga naar downloads →
            </Link>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-botanical transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sage-600">
              Verlanglijst
            </CardTitle>
            <Heart className="h-4 w-4 text-sage-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sage-600">0</div>
            <Link href="/account/wishlist" className="text-xs text-sage-500 hover:text-sage-600 mt-1 inline-block">
              Bekijk verlanglijst →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl text-sage-600">
            Recente Bestellingen
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sage-600">
                      Bestelling #{order.order_number}
                    </p>
                    <p className="text-sm text-sage-500">
                      {new Date(order.created_at).toLocaleDateString('nl-NL')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sage-600">
                      €{order.total.toFixed(2)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'completed' 
                        ? 'bg-mint-100 text-mint-700'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-sage-100 text-sage-700'
                    }`}>
                      {order.status === 'completed' ? 'Voltooid' : 
                       order.status === 'pending' ? 'In behandeling' : order.status}
                    </span>
                  </div>
                </div>
              ))}
              <Link href="/account/orders">
                <Button variant="outline" className="w-full mt-4">
                  Bekijk alle bestellingen
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-sage-300 mx-auto mb-4" />
              <p className="text-sage-500 mb-4">Je hebt nog geen bestellingen geplaatst</p>
              <Link href="/products">
                <Button>
                  Ontdek onze producten
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-botanical transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profiel Instellingen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sage-500 mb-4">
              Update je persoonlijke gegevens en voorkeuren
            </p>
            <Link href="/account/profile">
              <Button variant="outline">
                Bewerk profiel
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-botanical transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Account Beveiliging
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sage-500 mb-4">
              Wijzig je wachtwoord en beveiligingsinstellingen
            </p>
            <Link href="/account/settings">
              <Button variant="outline">
                Beveiligingsinstellingen
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}