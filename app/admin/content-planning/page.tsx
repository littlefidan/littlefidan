'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar,
  Target,
  TrendingUp,
  Package,
  Star,
  Heart,
  Moon,
  Sun,
  Cloud,
  Flower2,
  Gift,
  BookOpen,
  Users,
  Sparkles,
  CheckCircle2,
  Circle,
  AlertCircle,
  ChevronRight,
  Download,
  Plus
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

// Maanden in het Nederlands
const months = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december'
]

// Content planning data
const contentPlanningData = {
  januari: {
    islamitisch: {
      themas: ['Geduld (Sabr)', 'Dankbaarheid in de winter', 'Nieuwe islamitische jaar'],
      producten: [
        { naam: 'Winter Sabr Werkbladen', type: 'worksheet', status: 'planned' },
        { naam: 'Islamitische Nieuwjaar Kleurplaten', type: 'coloring', status: 'planned' },
        { naam: 'Dua voor Geduld Poster', type: 'educational', status: 'planned' }
      ]
    },
    universeel: {
      themas: ['Winter', 'Nieuwjaar', 'Sneeuw activiteiten'],
      producten: [
        { naam: 'Sneeuwpop Kleurplaten', type: 'coloring', status: 'planned' },
        { naam: 'Winter Dieren Werkblad', type: 'worksheet', status: 'planned' },
        { naam: 'Nieuwjaars Doelen voor Kids', type: 'educational', status: 'planned' }
      ]
    },
    bundels: [
      { naam: 'Winter Wonderland Bundle', items: 8, prijs: 19.99, status: 'planned' }
    ]
  },
  februari: {
    islamitisch: {
      themas: ['Liefde in Islam', 'Familie banden', 'Barmhartigheid'],
      producten: [
        { naam: 'Islamitische Familie Kleurplaten', type: 'coloring', status: 'planned' },
        { naam: 'Hadith over Liefde Flashcards', type: 'educational', status: 'planned' }
      ]
    },
    universeel: {
      themas: ['Valentijn/Vriendschap', 'Hartjes', 'Delen'],
      producten: [
        { naam: 'Vriendschapskaarten Maken', type: 'creative', status: 'planned' },
        { naam: 'Hartjes Tellen Werkblad', type: 'worksheet', status: 'planned' }
      ]
    },
    bundels: [
      { naam: 'Liefde & Vriendschap Bundle', items: 6, prijs: 14.99, status: 'planned' }
    ]
  },
  maart: {
    islamitisch: {
      themas: ['Ramadan Voorbereiding', 'Wudu leren', 'Quran verhalen'],
      producten: [
        { naam: 'Ramadan Countdown Kalender', type: 'creative', status: 'in_progress' },
        { naam: 'Wudu Stappen Poster', type: 'educational', status: 'completed' },
        { naam: 'Mijn Eerste Vasten Dagboek', type: 'premium', status: 'planned' }
      ]
    },
    universeel: {
      themas: ['Lente', 'Groei', 'Nieuwe begin'],
      producten: [
        { naam: 'Lentebloemen Kleurplaten', type: 'coloring', status: 'completed' },
        { naam: 'Zaadjes Planten Werkblad', type: 'worksheet', status: 'in_progress' }
      ]
    },
    bundels: [
      { naam: 'Ramadan Prep Mega Bundle', items: 15, prijs: 29.99, status: 'in_progress' }
    ]
  },
  april: {
    islamitisch: {
      themas: ['Ramadan', 'Vasten', 'Goede daden', 'Tarawih'],
      producten: [
        { naam: 'Ramadan Goede Daden Boom', type: 'creative', status: 'planned' },
        { naam: 'Iftar Kleurplaten', type: 'coloring', status: 'planned' },
        { naam: 'Ramadan Dagboek voor Kids', type: 'premium', status: 'planned' },
        { naam: "30 Dagen Dua's", type: 'educational', status: 'planned' }
      ]
    },
    universeel: {
      themas: ['Pasen', 'Lente kriebels', 'Baby dieren'],
      producten: [
        { naam: 'Paashaas Knutselen', type: 'creative', status: 'planned' },
        { naam: 'Lente Dieren Memory', type: 'worksheet', status: 'planned' }
      ]
    },
    bundels: [
      { naam: 'Complete Ramadan Bundle', items: 20, prijs: 39.99, status: 'planned' },
      { naam: 'Lente Feest Bundle', items: 10, prijs: 19.99, status: 'planned' }
    ]
  },
  mei: {
    islamitisch: {
      themas: ['Eid ul-Fitr', 'Delen', 'Dankbaarheid', 'Familie'],
      producten: [
        { naam: 'Eid Decoratie Printables', type: 'creative', status: 'planned' },
        { naam: 'Eid Cadeauzakjes', type: 'creative', status: 'planned' },
        { naam: 'Shukr (Dankbaarheid) Journal', type: 'educational', status: 'planned' }
      ]
    },
    universeel: {
      themas: ['Moederdag', 'Bloemen', 'Familie'],
      producten: [
        { naam: 'Moederdag Kaart Templates', type: 'creative', status: 'planned' },
        { naam: 'Bloemen Boeket Kleurplaat', type: 'coloring', status: 'planned' }
      ]
    },
    bundels: [
      { naam: 'Eid Viering Bundle', items: 12, prijs: 24.99, status: 'planned' }
    ]
  },
  juni: {
    islamitisch: {
      themas: ['Zomer met Allah', 'Natuur ontdekken', 'Reizen duas'],
      producten: [
        { naam: 'Islamitische Reis Duas', type: 'educational', status: 'planned' },
        { naam: "Allah's Schepping Zoekkaarten", type: 'worksheet', status: 'planned' }
      ]
    },
    universeel: {
      themas: ['Vaderdag', 'Zomer begin', 'Vakantie prep'],
      producten: [
        { naam: 'Vaderdag Superheld Kaart', type: 'creative', status: 'planned' },
        { naam: 'Zomer Bucket List Kids', type: 'educational', status: 'planned' },
        { naam: 'Vakantie Dagboek', type: 'premium', status: 'planned' }
      ]
    },
    bundels: [
      { naam: 'Zomer Avontuur Bundle', items: 15, prijs: 24.99, status: 'planned' }
    ]
  },
  juli: {
    islamitisch: {
      themas: ['Dhul Hijjah', 'Hajj verhalen', 'Ibrahim AS'],
      producten: [
        { naam: 'Hajj Uitleg voor Kids', type: 'educational', status: 'planned' },
        { naam: 'Kaaba Kleurplaat', type: 'coloring', status: 'planned' },
        { naam: 'Ibrahim AS Verhaal', type: 'premium', status: 'planned' }
      ]
    },
    universeel: {
      themas: ['Strand', 'Zee dieren', 'Zomer pret'],
      producten: [
        { naam: 'Strand Speurtocht', type: 'worksheet', status: 'planned' },
        { naam: 'Zee Dieren Kleurplaten Set', type: 'coloring', status: 'planned' },
        { naam: 'Zandkasteel Bouw Guide', type: 'creative', status: 'planned' }
      ]
    },
    bundels: [
      { naam: 'Zomer & Zee Bundle', items: 10, prijs: 19.99, status: 'planned' }
    ]
  },
  augustus: {
    islamitisch: {
      themas: ['Eid ul-Adha', 'Offer', 'Delen met armen'],
      producten: [
        { naam: 'Eid ul-Adha Verhaal', type: 'educational', status: 'planned' },
        { naam: 'Qurbani Uitleg Kids', type: 'educational', status: 'planned' },
        { naam: 'Eid Craft Activities', type: 'creative', status: 'planned' }
      ]
    },
    universeel: {
      themas: ['Einde zomer', 'Fruit oogst', 'Buiten activiteiten'],
      producten: [
        { naam: 'Zomer Fruit Memory', type: 'worksheet', status: 'planned' },
        { naam: 'Natuur Bingo', type: 'worksheet', status: 'planned' }
      ]
    },
    bundels: [
      { naam: 'Eid ul-Adha Bundle', items: 8, prijs: 19.99, status: 'planned' }
    ]
  },
  september: {
    islamitisch: {
      themas: ['Islamitisch nieuw schooljaar', 'Leren met Bismillah'],
      producten: [
        { naam: 'Bismillah School Start', type: 'educational', status: 'planned' },
        { naam: 'Islamitische School Planner', type: 'premium', status: 'planned' }
      ]
    },
    universeel: {
      themas: ['Terug naar school', 'Herfst begin', 'Nieuwe vrienden'],
      producten: [
        { naam: 'School Routine Kaarten', type: 'educational', status: 'planned' },
        { naam: 'Vriendjes Maken Werkblad', type: 'worksheet', status: 'planned' },
        { naam: 'Herfst Bladeren Knutsel', type: 'creative', status: 'planned' }
      ]
    },
    bundels: [
      { naam: 'Back to School Bundle', items: 12, prijs: 24.99, status: 'planned' }
    ]
  },
  oktober: {
    islamitisch: {
      themas: ['Shukr voor oogst', 'Herfst in Quran'],
      producten: [
        { naam: 'Dankbaarheid Boom', type: 'creative', status: 'planned' },
        { naam: 'Herfst Ayat Posters', type: 'educational', status: 'planned' }
      ]
    },
    universeel: {
      themas: ['Herfst', 'Dierendag', 'Halloween alternatief'],
      producten: [
        { naam: 'Herfst Dieren Maskers', type: 'creative', status: 'planned' },
        { naam: 'Pompoenen Tellen', type: 'worksheet', status: 'planned' },
        { naam: 'Vriendelijke Monsters Kleur', type: 'coloring', status: 'planned' }
      ]
    },
    bundels: [
      { naam: 'Herfst Plezier Bundle', items: 10, prijs: 19.99, status: 'planned' }
    ]
  },
  november: {
    islamitisch: {
      themas: ['Sabr in donkere dagen', 'Familie tijd'],
      producten: [
        { naam: 'Geduld Beloningskaart', type: 'educational', status: 'planned' },
        { naam: 'Familie Boom Project', type: 'creative', status: 'planned' }
      ]
    },
    universeel: {
      themas: ['Sint Maarten', 'Lampionnen', 'Licht in donker'],
      producten: [
        { naam: 'Lampion Templates', type: 'creative', status: 'planned' },
        { naam: 'Lichtjes Tellen', type: 'worksheet', status: 'planned' }
      ]
    },
    bundels: [
      { naam: 'Licht & Warmte Bundle', items: 8, prijs: 16.99, status: 'planned' }
    ]
  },
  december: {
    islamitisch: {
      themas: ['Jaar reflectie', 'Winter barmhartigheid', 'Goede voornemens'],
      producten: [
        { naam: '99 Namen Review Kaarten', type: 'educational', status: 'planned' },
        { naam: 'Islamitisch Jaar Overzicht', type: 'premium', status: 'planned' }
      ]
    },
    universeel: {
      themas: ['Winter feest', 'Sterren', 'Jaar afsluiting'],
      producten: [
        { naam: 'Winter Wonderland Kleur', type: 'coloring', status: 'planned' },
        { naam: 'Sterren Knutselen', type: 'creative', status: 'planned' },
        { naam: '2024 Memory Book', type: 'premium', status: 'planned' }
      ]
    },
    bundels: [
      { naam: 'Winter Feest Bundle', items: 12, prijs: 24.99, status: 'planned' }
    ]
  }
}

// Status kleuren
const statusColors = {
  planned: { bg: 'bg-gray-100', text: 'text-gray-700', icon: Circle },
  in_progress: { bg: 'bg-amber-100', text: 'text-amber-700', icon: AlertCircle },
  completed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 }
}

// Product type kleuren
const typeColors = {
  coloring: { bg: 'bg-pink-100', text: 'text-pink-700' },
  worksheet: { bg: 'bg-blue-100', text: 'text-blue-700' },
  educational: { bg: 'bg-purple-100', text: 'text-purple-700' },
  creative: { bg: 'bg-orange-100', text: 'text-orange-700' },
  premium: { bg: 'bg-indigo-100', text: 'text-indigo-700' }
}

export default function ContentPlanningPage() {
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()])
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month')
  const [contentType, setContentType] = useState<'all' | 'islamic' | 'universal'>('all')

  // Bereken statistieken
  const calculateStats = () => {
    let totalProducts = 0
    let completedProducts = 0
    let totalBundles = 0
    let potentialRevenue = 0

    Object.values(contentPlanningData).forEach(month => {
      if (month.islamitisch) {
        totalProducts += month.islamitisch.producten.length
        completedProducts += month.islamitisch.producten.filter(p => p.status === 'completed').length
      }
      if (month.universeel) {
        totalProducts += month.universeel.producten.length
        completedProducts += month.universeel.producten.filter(p => p.status === 'completed').length
      }
      if (month.bundels) {
        totalBundles += month.bundels.length
        potentialRevenue += month.bundels.reduce((sum, b) => sum + b.prijs, 0)
      }
    })

    return {
      totalProducts,
      completedProducts,
      totalBundles,
      potentialRevenue,
      completionRate: totalProducts > 0 ? Math.round((completedProducts / totalProducts) * 100) : 0
    }
  }

  const stats = calculateStats()
  const monthData = contentPlanningData[selectedMonth as keyof typeof contentPlanningData]

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Content Planning</h1>
              <p className="text-gray-600">Jaaroverzicht LittleFidan content strategie</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setViewMode(viewMode === 'month' ? 'year' : 'month')}>
              {viewMode === 'month' ? 'Jaar Overzicht' : 'Maand View'}
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Planning
            </Button>
          </div>
        </div>

        {/* Statistieken */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Totaal Producten</p>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Voltooid</p>
                  <p className="text-2xl font-bold">{stats.completedProducts}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bundels</p>
                  <p className="text-2xl font-bold">{stats.totalBundles}</p>
                </div>
                <Gift className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Voltooiing</p>
                  <p className="text-2xl font-bold">{stats.completionRate}%</p>
                </div>
                <Progress value={stats.completionRate} className="w-16" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Potentieel</p>
                  <p className="text-2xl font-bold">€{stats.potentialRevenue}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map(month => (
              <SelectItem key={month} value={month}>
                {month.charAt(0).toUpperCase() + month.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Tabs value={contentType} onValueChange={(v) => setContentType(v as any)} className="flex-1">
          <TabsList className="grid w-full sm:w-96 grid-cols-3">
            <TabsTrigger value="all">Alles</TabsTrigger>
            <TabsTrigger value="islamic">Islamitisch</TabsTrigger>
            <TabsTrigger value="universal">Universeel</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Month View */}
      {viewMode === 'month' && monthData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Islamitische Content */}
          {(contentType === 'all' || contentType === 'islamic') && monthData.islamitisch && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5" />
                  Islamitische Content
                </CardTitle>
                <CardDescription>
                  Thema's: {monthData.islamitisch.themas.join(', ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monthData.islamitisch.producten.map((product, idx) => {
                    const status = statusColors[product.status as keyof typeof statusColors]
                    const type = typeColors[product.type as keyof typeof typeColors]
                    const Icon = status.icon
                    
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon className={cn("h-5 w-5", status.text)} />
                          <div>
                            <p className="font-medium">{product.naam}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge className={cn(type.bg, type.text, "text-xs")}>
                                {product.type}
                              </Badge>
                              <Badge className={cn(status.bg, status.text, "text-xs")}>
                                {product.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Universele Content */}
          {(contentType === 'all' || contentType === 'universal') && monthData.universeel && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5" />
                  Universele Content
                </CardTitle>
                <CardDescription>
                  Thema's: {monthData.universeel.themas.join(', ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monthData.universeel.producten.map((product, idx) => {
                    const status = statusColors[product.status as keyof typeof statusColors]
                    const type = typeColors[product.type as keyof typeof typeColors]
                    const Icon = status.icon
                    
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon className={cn("h-5 w-5", status.text)} />
                          <div>
                            <p className="font-medium">{product.naam}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge className={cn(type.bg, type.text, "text-xs")}>
                                {product.type}
                              </Badge>
                              <Badge className={cn(status.bg, status.text, "text-xs")}>
                                {product.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bundels */}
          {monthData.bundels && monthData.bundels.length > 0 && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Bundels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {monthData.bundels.map((bundle, idx) => (
                    <Card key={idx} className="border-2 border-dashed">
                      <CardContent className="p-4">
                        <h4 className="font-semibold">{bundle.naam}</h4>
                        <p className="text-sm text-gray-600 mt-1">{bundle.items} items</p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-lg font-bold text-green-600">€{bundle.prijs}</p>
                          <Badge className={cn(
                            statusColors[bundle.status as keyof typeof statusColors].bg,
                            statusColors[bundle.status as keyof typeof statusColors].text
                          )}>
                            {bundle.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Year View */}
      {viewMode === 'year' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {months.map(month => {
            const data = contentPlanningData[month as keyof typeof contentPlanningData]
            if (!data) return null

            const islamicCount = data.islamitisch?.producten.length || 0
            const universalCount = data.universeel?.producten.length || 0
            const bundleCount = data.bundels?.length || 0
            const totalCount = islamicCount + universalCount

            return (
              <Card 
                key={month} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  setSelectedMonth(month)
                  setViewMode('month')
                }}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    {month.charAt(0).toUpperCase() + month.slice(1)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Moon className="h-4 w-4" />
                        Islamitisch
                      </span>
                      <span className="font-medium">{islamicCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Sun className="h-4 w-4" />
                        Universeel
                      </span>
                      <span className="font-medium">{universalCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Gift className="h-4 w-4" />
                        Bundels
                      </span>
                      <span className="font-medium">{bundleCount}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Totaal</span>
                        <Badge>{totalCount} items</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => window.location.href = '/admin/ai-generator'}>
              <Plus className="mr-2 h-4 w-4" />
              Nieuwe Content Genereren
            </Button>
            <Button variant="outline">
              <Package className="mr-2 h-4 w-4" />
              Bundel Samenstellen
            </Button>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Planning Aanpassen
            </Button>
            <Button variant="outline">
              <Star className="mr-2 h-4 w-4" />
              Bestsellers Bekijken
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}