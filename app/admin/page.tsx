import { checkAdminAuth } from '@/lib/auth/admin-check'
import { 
  CurrencyEuroIcon, 
  ShoppingBagIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'
import DashboardCharts from '@/components/admin/dashboard-charts'
import RecentActivity from '@/components/admin/recent-activity'

async function getDashboardStats() {
  const { supabase } = await checkAdminAuth()
  
  // Get current date and date 30 days ago
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
  
  // Fetch current period stats
  const { data: currentOrders } = await supabase
    .from('orders')
    .select('total, created_at')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .eq('payment_status', 'paid')
  
  // Fetch previous period stats for comparison
  const { data: previousOrders } = await supabase
    .from('orders')
    .select('total')
    .gte('created_at', sixtyDaysAgo.toISOString())
    .lt('created_at', thirtyDaysAgo.toISOString())
    .eq('payment_status', 'paid')
  
  // Calculate revenue
  const currentRevenue = currentOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0
  const previousRevenue = previousOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0
  const revenueChange = previousRevenue > 0 
    ? ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1)
    : 0
  
  // Get total counts
  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
  
  const { count: currentPeriodOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString())
  
  const { count: previousPeriodOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sixtyDaysAgo.toISOString())
    .lt('created_at', thirtyDaysAgo.toISOString())
  
  const ordersChange = previousPeriodOrders && previousPeriodOrders > 0
    ? ((currentPeriodOrders! - previousPeriodOrders) / previousPeriodOrders * 100).toFixed(1)
    : 0
  
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
  
  const { count: totalCustomers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
  
  // Get customer growth
  const { count: newCustomers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString())
  
  const { count: previousNewCustomers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sixtyDaysAgo.toISOString())
    .lt('created_at', thirtyDaysAgo.toISOString())
  
  const customersChange = previousNewCustomers && previousNewCustomers > 0
    ? ((newCustomers! - previousNewCustomers) / previousNewCustomers * 100).toFixed(1)
    : 0
  
  // Get revenue by month for chart
  const { data: monthlyRevenue } = await supabase
    .from('orders')
    .select('total, created_at')
    .eq('payment_status', 'paid')
    .gte('created_at', new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString())
    .order('created_at')
  
  // Get orders by day for last week
  const { data: weeklyOrders } = await supabase
    .from('orders')
    .select('id, created_at')
    .gte('created_at', new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at')
  
  // Get category distribution
  const { data: categoryData } = await supabase
    .from('products')
    .select('category')
    .eq('status', 'active')
  
  return {
    stats: {
      totalRevenue: currentRevenue,
      totalOrders: totalOrders || 0,
      totalProducts: totalProducts || 0,
      totalCustomers: totalCustomers || 0,
      revenueChange: Number(revenueChange),
      ordersChange: Number(ordersChange),
      productsChange: 0, // Products don't have a growth rate
      customersChange: Number(customersChange)
    },
    chartData: {
      monthlyRevenue: monthlyRevenue || [],
      weeklyOrders: weeklyOrders || [],
      categoryData: categoryData || [],
      currentOrders: currentOrders || []
    }
  }
}

export default async function AdminDashboard() {
  const { stats, chartData } = await getDashboardStats()

  const statCards = [
    {
      title: 'Totale Omzet',
      value: `€${stats.totalRevenue.toFixed(2).replace('.', ',')}`,
      change: stats.revenueChange,
      icon: CurrencyEuroIcon,
      color: 'mint'
    },
    {
      title: 'Totale Bestellingen',
      value: stats.totalOrders.toString(),
      change: stats.ordersChange,
      icon: ShoppingBagIcon,
      color: 'sage'
    },
    {
      title: 'Actieve Producten',
      value: stats.totalProducts.toString(),
      change: stats.productsChange,
      icon: DocumentTextIcon,
      color: 'taupe'
    },
    {
      title: 'Totale Klanten',
      value: stats.totalCustomers.toString(),
      change: stats.customersChange,
      icon: UserGroupIcon,
      color: 'babyblue'
    }
  ]

  return (
    <div>
      <h1 className="text-3xl font-serif text-sage-600 mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                stat.color === 'mint' ? 'bg-mint-100' :
                stat.color === 'sage' ? 'bg-sage-100' :
                stat.color === 'taupe' ? 'bg-taupe-100' :
                'bg-babyblue-100'
              }`}>
                <stat.icon className={`h-6 w-6 ${
                  stat.color === 'mint' ? 'text-mint-500' :
                  stat.color === 'sage' ? 'text-sage-600' :
                  stat.color === 'taupe' ? 'text-taupe-600' :
                  'text-babyblue-600'
                }`} />
              </div>
              {stat.change !== 0 && (
                <div className={`flex items-center text-sm ${
                  stat.change >= 0 ? 'text-mint-500' : 'text-red-500'
                }`}>
                  {stat.change >= 0 ? (
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(stat.change)}%
                </div>
              )}
            </div>
            <h3 className="text-2xl font-semibold text-sage-600">{stat.value}</h3>
            <p className="text-sm text-sage-500 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <DashboardCharts chartData={chartData} />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  )
}