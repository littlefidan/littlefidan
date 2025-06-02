'use client'

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

interface ChartData {
  monthlyRevenue: Array<{ total: number; created_at: string }>
  weeklyOrders: Array<{ id: string; created_at: string }>
  categoryData: Array<{ category: string }>
  currentOrders: Array<{ total: number; created_at: string }>
}

interface DashboardChartsProps {
  chartData: ChartData
}

export default function DashboardCharts({ chartData }: DashboardChartsProps) {
  // Process monthly revenue data
  const monthlyRevenueByMonth = chartData.monthlyRevenue.reduce((acc, order) => {
    const month = new Date(order.created_at).toLocaleDateString('nl-NL', { month: 'short' })
    acc[month] = (acc[month] || 0) + order.total
    return acc
  }, {} as Record<string, number>)

  const revenueChartData = {
    labels: Object.keys(monthlyRevenueByMonth),
    datasets: [
      {
        label: 'Omzet',
        data: Object.values(monthlyRevenueByMonth),
        borderColor: 'rgb(156, 170, 139)',
        backgroundColor: 'rgba(156, 170, 139, 0.1)',
        tension: 0.4
      }
    ]
  }

  // Process weekly orders data
  const weeklyOrdersByDay = chartData.weeklyOrders.reduce((acc, order) => {
    const day = new Date(order.created_at).toLocaleDateString('nl-NL', { weekday: 'short' })
    acc[day] = (acc[day] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const daysOfWeek = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo']
  const ordersChartData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: 'Bestellingen',
        data: daysOfWeek.map(day => weeklyOrdersByDay[day] || 0),
        backgroundColor: 'rgba(180, 165, 149, 0.8)',
        borderColor: 'rgb(180, 165, 149)',
        borderWidth: 1
      }
    ]
  }

  // Process category data
  const categoryCount = chartData.categoryData.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const categoryChartData = {
    labels: Object.keys(categoryCount),
    datasets: [
      {
        data: Object.values(categoryCount),
        backgroundColor: [
          'rgba(156, 170, 139, 0.8)',
          'rgba(147, 199, 167, 0.8)',
          'rgba(180, 165, 149, 0.8)',
          'rgba(181, 212, 232, 0.8)',
          'rgba(232, 181, 160, 0.8)'
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue Chart */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-sage-600 mb-4">Omzet Overzicht</h3>
        <div className="h-64">
          {Object.keys(monthlyRevenueByMonth).length > 0 ? (
            <Line data={revenueChartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-sage-400">
              Nog geen omzet data beschikbaar
            </div>
          )}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-sage-600 mb-4">Product Categorieën</h3>
        <div className="h-64">
          {Object.keys(categoryCount).length > 0 ? (
            <Doughnut 
              data={categoryChartData} 
              options={{
                ...chartOptions,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom' as const
                  }
                }
              }} 
            />
          ) : (
            <div className="flex items-center justify-center h-full text-sage-400">
              Geen producten gevonden
            </div>
          )}
        </div>
      </div>

      {/* Weekly Orders */}
      <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-sage-600 mb-4">Wekelijkse Bestellingen</h3>
        <div className="h-64">
          <Bar data={ordersChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}