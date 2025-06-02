'use client'

import { useState } from 'react'
import { Download, Clock, Search, Filter, FileText, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'

// Mock data - replace with Supabase query
const downloads = [
  {
    id: '1',
    title: 'Seizoenskaarten - Winter',
    category: 'Seizoensgebonden',
    downloadDate: '2024-12-15',
    expiresAt: '2025-01-15',
    downloadsUsed: 2,
    maxDownloads: 5,
    fileSize: '4.2 MB',
    productId: 'winter-cards',
  },
  {
    id: '2',
    title: 'Mindful Kleuren - Botanisch',
    category: 'Mindfulness',
    downloadDate: '2024-12-10',
    expiresAt: '2025-01-10',
    downloadsUsed: 1,
    maxDownloads: 5,
    fileSize: '8.7 MB',
    productId: 'mindful-coloring',
  },
  {
    id: '3',
    title: 'Culturele Feesten - Nederland',
    category: 'Cultureel',
    downloadDate: '2024-12-08',
    expiresAt: '2025-01-08',
    downloadsUsed: 3,
    maxDownloads: 5,
    fileSize: '6.1 MB',
    productId: 'cultural-celebrations',
  },
  {
    id: '4',
    title: 'Natuurlijke Telkaarten',
    category: 'Educatief',
    downloadDate: '2024-12-05',
    expiresAt: '2025-01-05',
    downloadsUsed: 1,
    maxDownloads: 5,
    fileSize: '3.8 MB',
    productId: 'counting-cards',
  },
]

export default function DownloadsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredDownloads = downloads.filter((download) => {
    const matchesSearch = download.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || download.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDownload = (downloadId: string) => {
    // TODO: Implement download with Supabase
    console.log('Downloading:', downloadId)
  }

  const getDaysRemaining = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-sage-600 mb-2">
          Mijn Downloads
        </h1>
        <p className="text-sage-500">
          Download je gekochte producten. Let op de vervaldatum!
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sage-400" />
          <Input
            placeholder="Zoek in downloads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            className="flex h-10 rounded-xl border border-sage-200 bg-white px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Alle categorieën</option>
            <option value="Seizoensgebonden">Seizoensgebonden</option>
            <option value="Mindfulness">Mindfulness</option>
            <option value="Cultureel">Cultureel</option>
            <option value="Educatief">Educatief</option>
          </select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-sage-50 border-sage-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-sage-600 mt-0.5" />
            <div className="text-sm text-sage-600">
              <p className="font-medium mb-1">Download Informatie</p>
              <p>
                Je kunt elk product maximaal 5 keer downloaden binnen 30 dagen na aankoop. 
                Downloads verlopen automatisch na deze periode.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Downloads Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredDownloads.map((download) => {
          const daysRemaining = getDaysRemaining(download.expiresAt)
          const isExpiringSoon = daysRemaining <= 7
          const isExpired = daysRemaining <= 0
          
          return (
            <Card key={download.id} className={isExpired ? 'opacity-60' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-sage-50 rounded-xl p-3">
                      <FileText className="h-6 w-6 text-sage-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sage-600">{download.title}</h3>
                      <p className="text-sm text-sage-500">{download.category}</p>
                      <p className="text-xs text-sage-400 mt-1">{download.fileSize}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-sage-500">Downloads gebruikt</span>
                    <span className="font-medium text-sage-600">
                      {download.downloadsUsed} van {download.maxDownloads}
                    </span>
                  </div>
                  <div className="w-full bg-sage-100 rounded-full h-2">
                    <div
                      className="bg-sage-400 h-2 rounded-full transition-all"
                      style={{ width: `${(download.downloadsUsed / download.maxDownloads) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className={`h-4 w-4 ${isExpiringSoon ? 'text-orange-500' : 'text-sage-400'}`} />
                    <span className={`${isExpiringSoon ? 'text-orange-600 font-medium' : 'text-sage-500'}`}>
                      {isExpired 
                        ? 'Verlopen' 
                        : isExpiringSoon 
                          ? `Nog ${daysRemaining} dagen` 
                          : `Geldig tot ${formatDate(download.expiresAt, 'nl-NL')}`
                      }
                    </span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  disabled={isExpired || download.downloadsUsed >= download.maxDownloads}
                  onClick={() => handleDownload(download.id)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExpired 
                    ? 'Verlopen' 
                    : download.downloadsUsed >= download.maxDownloads 
                      ? 'Limiet bereikt' 
                      : 'Download'
                  }
                </Button>

                {isExpired && (
                  <p className="text-xs text-center text-sage-500 mt-2">
                    Contact support voor toegang
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredDownloads.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-sage-50 rounded-full flex items-center justify-center mb-4">
              <Download className="h-8 w-8 text-sage-400" />
            </div>
            <h3 className="font-semibold text-sage-600 mb-2">
              Geen downloads gevonden
            </h3>
            <p className="text-sage-500">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Probeer je zoekopdracht aan te passen'
                : 'Je hebt nog geen producten om te downloaden'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}