import { checkAdminAuth } from '@/lib/auth/admin-check'
import { 
  ChartBarIcon, 
  UsersIcon, 
  ShoppingBagIcon,
  CurrencyEuroIcon,
  ArrowTrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

async function getAnalytics() {
  const { supabase } = await checkAdminAuth()
  
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  
  // Revenue analytics
  const { data: monthlyRevenue } = await supabase
    .from('orders')
    .select('total, created_at')
    .eq('payment_status', 'paid')
    .gte('created_at', startOfMonth.toISOString())
  
  const { data: yearlyRevenue } = await supabase
    .from('orders')
    .select('total, created_at')
    .eq('payment_status', 'paid')
    .gte('created_at', startOfYear.toISOString())
    
  // Product analytics
  const { data: topProducts } = await supabase
    .from('order_items')
    .select('product_id, quantity, products(name, price)')
    .gte('created_at', startOfMonth.toISOString())
    .order('quantity', { ascending: false })
    .limit(10)
    
  // Customer analytics
  const { count: newCustomers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString())
    
  // Category performance
  const { data: categoryData } = await supabase
    .from('products')
    .select('category, id')
    .eq('status', 'active')
    
  // AI Generator usage
  const { data: aiUsage } = await supabase
    .from('products')
    .select('created_at, metadata')
    .not('metadata->ai_generated', 'is', null)
    .gte('created_at', startOfMonth.toISOString())
  
  return {
    monthlyRevenue: monthlyRevenue?.reduce((sum, order) => sum + order.total, 0) || 0,
    yearlyRevenue: yearlyRevenue?.reduce((sum, order) => sum + order.total, 0) || 0,
    topProducts: topProducts || [],
    newCustomers: newCustomers || 0,
    categoryData: categoryData || [],
    aiUsage: aiUsage?.length || 0,
    monthlyOrders: monthlyRevenue?.length || 0
  }
}

export default async function AnalyticsPage() {
  const analytics = await getAnalytics()
  
  const statCards = [
    {
      title: 'Maand Omzet',
      value: `€${analytics.monthlyRevenue.toFixed(2)}`,
      subtext: `${analytics.monthlyOrders} bestellingen`,
      icon: CurrencyEuroIcon,
      color: 'amber'
    },
    {
      title: 'Jaar Omzet',
      value: `€${analytics.yearlyRevenue.toFixed(2)}`,
      subtext: 'Totaal dit jaar',
      icon: ArrowTrendingUpIcon,
      color: 'green'
    },
    {
      title: 'Nieuwe Klanten',
      value: analytics.newCustomers.toString(),
      subtext: 'Deze maand',
      icon: UsersIcon,
      color: 'blue'
    },
    {
      title: 'AI Gegenereerd',
      value: analytics.aiUsage.toString(),
      subtext: 'Producten deze maand',
      icon: ChartBarIcon,
      color: 'purple'
    }
  ]
  
  // Bereken categorie distributie
  const categoryDistribution = analytics.categoryData.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Analytics Dashboard</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
          </div>
        ))}
      </div>
      
      {/* Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <ShoppingBagIcon className="h-5 w-5 mr-2 text-gray-600" />
            Top Producten Deze Maand
          </h2>
          <div className="space-y-3">
            {analytics.topProducts.length > 0 ? (
              analytics.topProducts.slice(0, 5).map((item: any, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {item.products?.name || 'Onbekend product'}
                    </p>
                    <p className="text-xs text-gray-500">{item.quantity} verkocht</p>
                  </div>
                  <span className="text-sm font-semibold text-amber-600">
                    €{((item.products?.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Nog geen verkopen deze maand</p>
            )}
          </div>
        </div>
        
        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-gray-600" />
            Categorie Verdeling
          </h2>
          <div className="space-y-3">
            {Object.entries(categoryDistribution).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 capitalize">
                  {category.replace('_', ' ')}
                </span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-amber-500 h-2 rounded-full"
                      style={{ 
                        width: `${(count / analytics.categoryData.length) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-10 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}