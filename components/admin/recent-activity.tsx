import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function RecentActivity() {
  const supabase = createServerComponentClient({ cookies })
  
  // Get recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(5)
  
  // Get recent products
  const { data: recentProducts } = await supabase
    .from('products')
    .select('name, created_at')
    .order('created_at', { ascending: false })
    .limit(3)
  
  // Get recent subscribers
  const { data: recentSubscribers } = await supabase
    .from('subscribers')
    .select('email, created_at')
    .order('created_at', { ascending: false })
    .limit(3)
  
  // Combine and sort activities
  const activities: any[] = []
  
  recentOrders?.forEach(order => {
    activities.push({
      type: 'order',
      action: order.payment_status === 'paid' ? 'Bestelling afgerond' : 'Nieuwe bestelling geplaatst',
      detail: order.profiles?.full_name || order.customer_name || 'Anonieme klant',
      time: order.created_at,
      orderId: order.order_number
    })
  })
  
  recentProducts?.forEach(product => {
    activities.push({
      type: 'product',
      action: 'Product toegevoegd',
      detail: product.name,
      time: product.created_at
    })
  })
  
  recentSubscribers?.forEach(subscriber => {
    activities.push({
      type: 'subscriber',
      action: 'Nieuwe nieuwsbrief aanmelding',
      detail: subscriber.email,
      time: subscriber.created_at
    })
  })
  
  // Sort by time and take top 10
  activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
  const topActivities = activities.slice(0, 10)
  
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Zojuist'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minuten geleden`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} uur geleden`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} dagen geleden`
    return date.toLocaleDateString('nl-NL')
  }
  
  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-sage-600 mb-4">Recente Activiteit</h3>
      <div className="space-y-4">
        {topActivities.length > 0 ? (
          topActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-sage-100 last:border-0">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  activity.type === 'order' ? 'bg-mint-500' :
                  activity.type === 'product' ? 'bg-sage-500' :
                  'bg-babyblue-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-sage-600">{activity.action}</p>
                  <p className="text-xs text-sage-500">
                    {activity.detail}
                    {activity.orderId && ` - #${activity.orderId}`}
                  </p>
                </div>
              </div>
              <span className="text-xs text-sage-400">{getRelativeTime(activity.time)}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-sage-400 text-center py-4">
            Nog geen recente activiteit
          </p>
        )}
      </div>
    </div>
  )
}