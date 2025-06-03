'use client'

import React, { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { 
  CogIcon,
  BuildingStorefrontIcon,
  EnvelopeIcon,
  CurrencyEuroIcon,
  TruckIcon,
  BellIcon,
  GlobeAltIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

interface Settings {
  store_name: string
  store_email: string
  store_phone: string
  store_address: string
  currency: string
  tax_rate: number
  shipping_fee: number
  free_shipping_threshold: number
  order_email_notifications: boolean
  new_subscriber_notifications: boolean
  low_stock_notifications: boolean
  low_stock_threshold: number
  instagram_handle: string
  facebook_url: string
  maintenance_mode: boolean
  maintenance_message: string
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    store_name: 'LittleFidan',
    store_email: 'info@littlefidan.nl',
    store_phone: '+31 6 12345678',
    store_address: 'Amsterdam, Netherlands',
    currency: 'EUR',
    tax_rate: 21,
    shipping_fee: 5.99,
    free_shipping_threshold: 50,
    order_email_notifications: true,
    new_subscriber_notifications: true,
    low_stock_notifications: true,
    low_stock_threshold: 10,
    instagram_handle: '@littlefidan',
    facebook_url: 'https://facebook.com/littlefidan',
    maintenance_mode: false,
    maintenance_message: 'We are currently performing maintenance. Please check back soon.'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedSection, setSavedSection] = useState<string | null>(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') throw error
      
      if (data) {
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (section: string) => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('settings')
        .upsert([settings])

      if (error) throw error
      
      setSavedSection(section)
      setTimeout(() => setSavedSection(null), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Fout bij opslaan instellingen. Probeer het opnieuw.')
    } finally {
      setSaving(false)
    }
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
      <h1 className="text-3xl font-serif text-primary-800 mb-8">Instellingen</h1>

      <div className="space-y-8">
        {/* Store Information */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BuildingStorefrontIcon className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-lg font-semibold text-primary-800">Winkelinformatie</h2>
            </div>
            <button
              onClick={() => handleSave('store')}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-mint-500 text-white rounded-lg hover:bg-mint-600 transition-colors disabled:opacity-50"
            >
              {savedSection === 'store' ? (
                <>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Opgeslagen
                </>
              ) : (
                'Wijzigingen Opslaan'
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Winkelnaam
              </label>
              <input
                type="text"
                value={settings.store_name}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                className="w-full px-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.store_email}
                onChange={(e) => setSettings({ ...settings, store_email: e.target.value })}
                className="w-full px-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Telefoonnummer
              </label>
              <input
                type="tel"
                value={settings.store_phone}
                onChange={(e) => setSettings({ ...settings, store_phone: e.target.value })}
                className="w-full px-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Adres
              </label>
              <input
                type="text"
                value={settings.store_address}
                onChange={(e) => setSettings({ ...settings, store_address: e.target.value })}
                className="w-full px-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300"
              />
            </div>
          </div>
        </div>

        {/* Payment & Shipping */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <CurrencyEuroIcon className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-lg font-semibold text-primary-800">Betaling & Verzending</h2>
            </div>
            <button
              onClick={() => handleSave('payment')}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-mint-500 text-white rounded-lg hover:bg-mint-600 transition-colors disabled:opacity-50"
            >
              {savedSection === 'payment' ? (
                <>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Opgeslagen
                </>
              ) : (
                'Wijzigingen Opslaan'
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Valuta
              </label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                BTW Tarief (%)
              </label>
              <input
                type="number"
                value={settings.tax_rate}
                onChange={(e) => setSettings({ ...settings, tax_rate: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Verzendkosten (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.shipping_fee}
                onChange={(e) => setSettings({ ...settings, shipping_fee: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Gratis Verzending vanaf (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.free_shipping_threshold}
                onChange={(e) => setSettings({ ...settings, free_shipping_threshold: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BellIcon className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-lg font-semibold text-primary-800">Meldingen</h2>
            </div>
            <button
              onClick={() => handleSave('notifications')}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-mint-500 text-white rounded-lg hover:bg-mint-600 transition-colors disabled:opacity-50"
            >
              {savedSection === 'notifications' ? (
                <>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Opgeslagen
                </>
              ) : (
                'Wijzigingen Opslaan'
              )}
            </button>
          </div>

          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.order_email_notifications}
                onChange={(e) => setSettings({ ...settings, order_email_notifications: e.target.checked })}
                className="h-4 w-4 text-mint-500 border-taupe-300 rounded focus:ring-mint-300"
              />
              <span className="ml-2 text-sm text-neutral-dark">
                Ontvang email meldingen voor nieuwe bestellingen
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.new_subscriber_notifications}
                onChange={(e) => setSettings({ ...settings, new_subscriber_notifications: e.target.checked })}
                className="h-4 w-4 text-mint-500 border-taupe-300 rounded focus:ring-mint-300"
              />
              <span className="ml-2 text-sm text-neutral-dark">
                Ontvang email meldingen voor nieuwe abonnees
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.low_stock_notifications}
                onChange={(e) => setSettings({ ...settings, low_stock_notifications: e.target.checked })}
                className="h-4 w-4 text-mint-500 border-taupe-300 rounded focus:ring-mint-300"
              />
              <span className="ml-2 text-sm text-neutral-dark">
                Ontvang meldingen bij lage voorraad
              </span>
            </label>

            {settings.low_stock_notifications && (
              <div className="ml-6">
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Lage Voorraad Drempel
                </label>
                <input
                  type="number"
                  value={settings.low_stock_threshold}
                  onChange={(e) => setSettings({ ...settings, low_stock_threshold: parseInt(e.target.value) })}
                  className="w-32 px-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300"
                />
              </div>
            )}
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <GlobeAltIcon className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-lg font-semibold text-primary-800">Social Media</h2>
            </div>
            <button
              onClick={() => handleSave('social')}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-mint-500 text-white rounded-lg hover:bg-mint-600 transition-colors disabled:opacity-50"
            >
              {savedSection === 'social' ? (
                <>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Opgeslagen
                </>
              ) : (
                'Wijzigingen Opslaan'
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Instagram Handle
              </label>
              <input
                type="text"
                value={settings.instagram_handle}
                onChange={(e) => setSettings({ ...settings, instagram_handle: e.target.value })}
                className="w-full px-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                value={settings.facebook_url}
                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                className="w-full px-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300"
              />
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <CogIcon className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-lg font-semibold text-primary-800">Onderhoudsmodus</h2>
            </div>
            <button
              onClick={() => handleSave('maintenance')}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-mint-500 text-white rounded-lg hover:bg-mint-600 transition-colors disabled:opacity-50"
            >
              {savedSection === 'maintenance' ? (
                <>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Opgeslagen
                </>
              ) : (
                'Wijzigingen Opslaan'
              )}
            </button>
          </div>

          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.maintenance_mode}
                onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
                className="h-4 w-4 text-mint-500 border-taupe-300 rounded focus:ring-mint-300"
              />
              <span className="ml-2 text-sm text-neutral-dark">
                Onderhoudsmodus inschakelen
              </span>
            </label>

            {settings.maintenance_mode && (
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Onderhoudsbericht
                </label>
                <textarea
                  rows={3}
                  value={settings.maintenance_message}
                  onChange={(e) => setSettings({ ...settings, maintenance_message: e.target.value })}
                  className="w-full px-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}