'use client'

import React, { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  CurrencyEuroIcon, 
  ShoppingBagIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  revenueChange: number
  ordersChange: number
  productsChange: number
  customersChange: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    revenueChange: 0,
    ordersChange: 0,
    productsChange: 0,
    customersChange: 0
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Fetch total revenue
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'completed')
      
      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0

      // Fetch total orders
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

      // Fetch total products
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      // Fetch total customers
      const { count: totalCustomers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      setStats({
        totalRevenue,
        totalOrders: totalOrders || 0,
        totalProducts: totalProducts || 0,
        totalCustomers: totalCustomers || 0,
        revenueChange: 12.5, // Mock data - calculate from real data
        ordersChange: 8.3,
        productsChange: -2.1,
        customersChange: 15.7
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Chart data
  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [3200, 4100, 3800, 5200, 4900, 5800],
        borderColor: 'rgb(168, 213, 186)',
        backgroundColor: 'rgba(168, 213, 186, 0.1)',
        tension: 0.4
      }
    ]
  }

  const ordersChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Orders',
        data: [12, 19, 15, 22, 18, 25, 20],
        backgroundColor: 'rgba(155, 139, 122, 0.8)',
        borderColor: 'rgb(155, 139, 122)',
        borderWidth: 1
      }
    ]
  }

  const categoryChartData = {
    labels: ['Activiteitenboeken', 'Educatief', 'Knutselpakketten', 'Digitaal', 'Overig'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(168, 213, 186, 0.8)',
          'rgba(123, 132, 113, 0.8)',
          'rgba(155, 139, 122, 0.8)',
          'rgba(181, 212, 232, 0.8)',
          'rgba(212, 165, 116, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }

  const statCards = [
    {
      title: 'Totale Omzet',
      value: `€${stats.totalRevenue.toLocaleString()}`,
      change: stats.revenueChange,
      icon: CurrencyEuroIcon,
      color: 'mint'
    },
    {
      title: 'Totale Bestellingen',
      value: stats.totalOrders.toString(),
      change: stats.ordersChange,
      icon: ShoppingBagIcon,
      color: 'primary'
    },
    {
      title: 'Totale Producten',
      value: stats.totalProducts.toString(),
      change: stats.productsChange,
      icon: DocumentTextIcon,
      color: 'olive'
    },
    {
      title: 'Totale Klanten',
      value: stats.totalCustomers.toString(),
      change: stats.customersChange,
      icon: UserGroupIcon,
      color: 'babyblue'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-serif text-primary-800 mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                stat.color === 'mint' ? 'bg-mint-100' :
                stat.color === 'primary' ? 'bg-primary-100' :
                stat.color === 'olive' ? 'bg-olive-100' :
                'bg-babyblue-100'
              }`}>
                <stat.icon className={`h-6 w-6 ${
                  stat.color === 'mint' ? 'text-mint-500' :
                  stat.color === 'primary' ? 'text-primary-600' :
                  stat.color === 'olive' ? 'text-olive-600' :
                  'text-babyblue-600'
                }`} />
              </div>
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
            </div>
            <h3 className="text-2xl font-semibold text-primary-800">{stat.value}</h3>
            <p className="text-sm text-neutral-medium mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft p-6">
          <h3 className="text-lg font-semibold text-primary-800 mb-4">Omzet Overzicht</h3>
          <div className="h-64">
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h3 className="text-lg font-semibold text-primary-800 mb-4">Product Categorieën</h3>
          <div className="h-64">
            <Doughnut 
              data={categoryChartData} 
              options={{
                ...chartOptions,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom'
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Weekly Orders */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-soft p-6">
          <h3 className="text-lg font-semibold text-primary-800 mb-4">Wekelijkse Bestellingen</h3>
          <div className="h-64">
            <Bar data={ordersChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-2xl shadow-soft p-6">
        <h3 className="text-lg font-semibold text-primary-800 mb-4">Recente Activiteit</h3>
        <div className="space-y-4">
          {[
            { action: 'Nieuwe bestelling geplaatst', user: 'Emma van der Berg', time: '2 minuten geleden', type: 'order' },
            { action: 'Product toegevoegd', item: 'Lente Activiteitenboek', time: '15 minuten geleden', type: 'product' },
            { action: 'Nieuwe klant geregistreerd', user: 'Sophie de Vries', time: '1 uur geleden', type: 'customer' },
            { action: 'Bestelling afgerond', order: '#1234', time: '2 uur geleden', type: 'order' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-taupe-100 last:border-0">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  activity.type === 'order' ? 'bg-mint-500' :
                  activity.type === 'product' ? 'bg-primary-500' :
                  'bg-babyblue-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-primary-800">{activity.action}</p>
                  <p className="text-xs text-neutral-medium">
                    {activity.user || activity.item || activity.order}
                  </p>
                </div>
              </div>
              <span className="text-xs text-neutral-medium">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}