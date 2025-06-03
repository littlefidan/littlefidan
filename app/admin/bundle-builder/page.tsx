'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Package,
  Plus,
  X,
  Save,
  Gift,
  Search,
  Filter,
  DollarSign,
  Sparkles,
  Moon,
  Sun,
  Check,
  AlertCircle
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  price: number
  type: string
  category: string
  preview_image?: string
  tags: string[]
}

interface BundleItem {
  product: Product
  discount?: number
}

export default function BundleBuilderPage() {
  const [bundleName, setBundleName] = useState('')
  const [bundleDescription, setBundleDescription] = useState('')
  const [bundleItems, setBundleItems] = useState<BundleItem[]>([])
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'islamic' | 'universal'>('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [bundlePrice, setBundlePrice] = useState(0)
  const [customPrice, setCustomPrice] = useState('')
  const [saving, setSaving] = useState(false)

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Ramadan Kleurplaten Set',
        price: 4.99,
        type: 'islamic',
        category: 'coloring',
        tags: ['ramadan', 'islamic', 'kleurplaten']
      },
      {
        id: '2',
        name: 'Arabisch Alfabet Werkbladen',
        price: 6.99,
        type: 'islamic',
        category: 'worksheet',
        tags: ['arabisch', 'alfabet', 'educatief']
      },
      {
        id: '3',
        name: 'Dieren Kleurplaten',
        price: 3.99,
        type: 'universal',
        category: 'coloring',
        tags: ['dieren', 'kleurplaten', 'universal']
      },
      {
        id: '4',
        name: 'Seizoenen Werkbladen',
        price: 5.99,
        type: 'universal',
        category: 'worksheet',
        tags: ['seizoenen', 'werkbladen', 'educatief']
      },
      {
        id: '5',
        name: '99 Namen van Allah Flashcards',
        price: 9.99,
        type: 'islamic',
        category: 'educational',
        tags: ['allah', 'namen', 'flashcards']
      },
      {
        id: '6',
        name: 'Emoties Herkennen Kaarten',
        price: 4.99,
        type: 'universal',
        category: 'educational',
        tags: ['emoties', 'ontwikkeling', 'universal']
      }
    ]
    setAvailableProducts(mockProducts)
  }, [])

  // Filter products
  const filteredProducts = availableProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = filterType === 'all' || product.type === filterType
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    const notInBundle = !bundleItems.some(item => item.product.id === product.id)
    
    return matchesSearch && matchesType && matchesCategory && notInBundle
  })

  // Calculate bundle price
  useEffect(() => {
    const totalOriginal = bundleItems.reduce((sum, item) => sum + item.product.price, 0)
    const totalWithDiscounts = bundleItems.reduce((sum, item) => {
      const discount = item.discount || 0
      return sum + (item.product.price * (1 - discount / 100))
    }, 0)
    
    setBundlePrice(totalWithDiscounts)
  }, [bundleItems])

  // Add product to bundle
  const addToBundle = (product: Product) => {
    setBundleItems([...bundleItems, { product, discount: 0 }])
  }

  // Remove from bundle
  const removeFromBundle = (productId: string) => {
    setBundleItems(bundleItems.filter(item => item.product.id !== productId))
  }

  // Update item discount
  const updateItemDiscount = (productId: string, discount: number) => {
    setBundleItems(bundleItems.map(item => 
      item.product.id === productId ? { ...item, discount } : item
    ))
  }

  // Calculate savings
  const calculateSavings = () => {
    const originalTotal = bundleItems.reduce((sum, item) => sum + item.product.price, 0)
    const finalPrice = customPrice ? parseFloat(customPrice) : bundlePrice
    return originalTotal - finalPrice
  }

  // Save bundle
  const saveBundle = async () => {
    if (!bundleName || bundleItems.length === 0) {
      alert('Voeg een naam en minimaal één product toe')
      return
    }

    setSaving(true)
    try {
      // Hier zou je de API call maken om de bundel op te slaan
      const bundleData = {
        name: bundleName,
        description: bundleDescription,
        items: bundleItems.map(item => ({
          product_id: item.product.id,
          discount: item.discount
        })),
        price: customPrice ? parseFloat(customPrice) : bundlePrice,
        original_price: bundleItems.reduce((sum, item) => sum + item.product.price, 0),
        savings: calculateSavings(),
        type: 'bundle',
        tags: [
          ...new Set(bundleItems.flatMap(item => item.product.tags)),
          'bundle',
          bundleItems.some(item => item.product.type === 'islamic') ? 'islamic' : 'universal'
        ]
      }

      alert('Bundel succesvol opgeslagen!')
      
      // Reset form
      setBundleName('')
      setBundleDescription('')
      setBundleItems([])
      setCustomPrice('')
    } catch (error) {
      console.error('Error saving bundle:', error)
      alert('Er ging iets mis bij het opslaan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
          <Gift className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Bundle Builder</h1>
          <p className="text-gray-600">Stel je eigen productbundels samen</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search & Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Beschikbare Producten</CardTitle>
              <CardDescription>
                Selecteer producten om aan je bundel toe te voegen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Zoek producten..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-3">
                  <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Types</SelectItem>
                      <SelectItem value="islamic">
                        <span className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Islamitisch
                        </span>
                      </SelectItem>
                      <SelectItem value="universal">
                        <span className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Universeel
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Categorieën</SelectItem>
                      <SelectItem value="coloring">Kleurplaten</SelectItem>
                      <SelectItem value="worksheet">Werkbladen</SelectItem>
                      <SelectItem value="educational">Educatief</SelectItem>
                      <SelectItem value="creative">Creatief</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {filteredProducts.map(product => (
                    <Card 
                      key={product.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => addToBundle(product)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{product.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {product.type === 'islamic' ? (
                                  <Moon className="h-3 w-3 mr-1" />
                                ) : (
                                  <Sun className="h-3 w-3 mr-1" />
                                )}
                                {product.type}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                €{product.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <Plus className="h-5 w-5 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Geen producten gevonden
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bundle Configuration */}
        <div className="space-y-6">
          {/* Bundle Details */}
          <Card>
            <CardHeader>
              <CardTitle>Bundel Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bundleName">Bundel Naam *</Label>
                <Input
                  id="bundleName"
                  value={bundleName}
                  onChange={(e) => setBundleName(e.target.value)}
                  placeholder="Bijv. Ramadan Mega Bundle"
                />
              </div>

              <div>
                <Label htmlFor="bundleDescription">Beschrijving</Label>
                <Textarea
                  id="bundleDescription"
                  value={bundleDescription}
                  onChange={(e) => setBundleDescription(e.target.value)}
                  rows={3}
                  placeholder="Beschrijf wat er in deze bundel zit..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Bundle Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Bundel Items ({bundleItems.length})</span>
                {bundleItems.length > 0 && (
                  <Badge className="bg-green-100 text-green-700">
                    €{bundleItems.reduce((sum, item) => sum + item.product.price, 0).toFixed(2)}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bundleItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Nog geen producten toegevoegd</p>
                  <p className="text-sm mt-1">Klik op producten om ze toe te voegen</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bundleItems.map((item, idx) => (
                    <div key={item.product.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{item.product.name}</h5>
                          <p className="text-xs text-gray-500">€{item.product.price.toFixed(2)}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromBundle(item.product.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Korting:</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discount || 0}
                          onChange={(e) => updateItemDiscount(item.product.id, parseInt(e.target.value) || 0)}
                          className="w-20 h-7 text-xs"
                        />
                        <span className="text-xs">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing */}
          {bundleItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Prijs Berekening</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Originele prijs:</span>
                    <span>€{bundleItems.reduce((sum, item) => sum + item.product.price, 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Na kortingen:</span>
                    <span>€{bundlePrice.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <Label className="text-xs">Aangepaste prijs (optioneel)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder={bundlePrice.toFixed(2)}
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex justify-between font-bold text-green-600 pt-2 border-t">
                    <span>Klant bespaart:</span>
                    <span>€{calculateSavings().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save Button */}
          <Button 
            onClick={saveBundle}
            disabled={saving || bundleItems.length === 0 || !bundleName}
            className="w-full"
            size="lg"
          >
            {saving ? (
              <>
                <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
                Opslaan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Bundel Opslaan
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}