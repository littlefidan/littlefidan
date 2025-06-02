'use client'

import React, { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  EnvelopeIcon, 
  UserGroupIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { formatDate } from '@/lib/utils'

interface Subscriber {
  id: string
  email: string
  name: string | null
  status: 'active' | 'unsubscribed'
  metadata: any
  created_at: string
  updated_at: string
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'unsubscribed'>('all')
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchSubscribers()
  }, [])

  useEffect(() => {
    filterSubscribers()
  }, [subscribers, searchQuery, statusFilter])

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSubscribers(data || [])
    } catch (error) {
      console.error('Error fetching subscribers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterSubscribers = () => {
    let filtered = [...subscribers]

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(sub => 
        sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub.name && sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredSubscribers(filtered)
  }

  const exportSubscribers = () => {
    const data = filteredSubscribers.map(sub => ({
      email: sub.email,
      name: sub.name || '',
      status: sub.status,
      signup_date: formatDate(sub.created_at)
    }))

    const csv = [
      ['Email', 'Naam', 'Status', 'Aanmelddatum'],
      ...data.map(row => [row.email, row.name, row.status, row.signup_date])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const stats = {
    total: subscribers.length,
    active: subscribers.filter(s => s.status === 'active').length,
    unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
    thisMonth: subscribers.filter(s => {
      const date = new Date(s.created_at)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).length
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-primary-800">Nieuwsbrief Abonnees</h1>
          <p className="text-neutral-medium mt-2">
            Beheer je nieuwsbrief aanmeldingen. Email service wordt later geconfigureerd.
          </p>
        </div>
        <button
          onClick={exportSubscribers}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-600 transition-colors"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-primary-100">
              <UserGroupIcon className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-primary-800">{stats.total}</h3>
          <p className="text-sm text-neutral-medium mt-1">Totaal Abonnees</p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-mint-100">
              <CheckCircleIcon className="h-6 w-6 text-mint-600" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-primary-800">{stats.active}</h3>
          <p className="text-sm text-neutral-medium mt-1">Actieve Abonnees</p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-red-100">
              <XCircleIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-primary-800">{stats.unsubscribed}</h3>
          <p className="text-sm text-neutral-medium mt-1">Uitgeschreven</p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-babyblue-100">
              <EnvelopeIcon className="h-6 w-6 text-babyblue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-primary-800">{stats.thisMonth}</h3>
          <p className="text-sm text-neutral-medium mt-1">Deze Maand</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-medium" />
              <input
                type="text"
                placeholder="Zoek op email of naam..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-taupe-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-mint-500"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-taupe-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-mint-500"
          >
            <option value="all">Alle Statussen</option>
            <option value="active">Actief</option>
            <option value="unsubscribed">Uitgeschreven</option>
          </select>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-taupe-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-medium uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-medium uppercase tracking-wider">
                  Naam
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-medium uppercase tracking-wider">
                  Aangemeld op
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-taupe-100">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-medium">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'Geen abonnees gevonden met deze filters'
                      : 'Nog geen nieuwsbrief aanmeldingen'
                    }
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-5 w-5 text-neutral-medium mr-3" />
                        <span className="text-sm font-medium text-primary-800">
                          {subscriber.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-medium">
                      {subscriber.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        subscriber.status === 'active'
                          ? 'bg-mint-100 text-mint-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscriber.status === 'active' ? 'Actief' : 'Uitgeschreven'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-medium">
                      {formatDate(subscriber.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note about email service */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-sm text-yellow-800">
          <strong>Let op:</strong> Email service is nog niet geconfigureerd. Aanmeldingen worden 
          opgeslagen maar er worden nog geen emails verstuurd. Configureer eerst je email service 
          (SMTP/SendGrid/Resend) om nieuwsbrieven te kunnen versturen.
        </p>
      </div>
    </div>
  )
}