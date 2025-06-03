'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  PhotoIcon, 
  ArrowUpTrayIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { createBrowserClient } from '@supabase/ssr'

interface MediaFile {
  id: string
  name: string
  bucket: string
  url: string
  size: number
  type: string
  created_at: string
}

export default function MediaLibraryClient({ 
  initialFiles 
}: { 
  initialFiles: MediaFile[] 
}) {
  const [files, setFiles] = useState(initialFiles)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBucket, setFilterBucket] = useState('all')
  const [uploading, setUploading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBucket = filterBucket === 'all' || file.bucket === filterBucket
    return matchesSearch && matchesBucket
  })
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files
    if (!uploadedFiles || uploadedFiles.length === 0) return
    
    setUploading(true)
    
    try {
      for (const file of Array.from(uploadedFiles)) {
        const fileName = `${Date.now()}-${file.name}`
        const bucket = file.type.startsWith('image/') ? 'products' : 'products'
        
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file)
        
        if (!error && data) {
          const url = supabase.storage.from(bucket).getPublicUrl(fileName).data.publicUrl
          const newFile: MediaFile = {
            id: data.path,
            name: fileName,
            bucket,
            url,
            size: file.size,
            type: file.type,
            created_at: new Date().toISOString()
          }
          setFiles(prev => [newFile, ...prev])
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }
  
  const handleDelete = async (fileId: string, bucket: string) => {
    if (!confirm('Weet je zeker dat je dit bestand wilt verwijderen?')) return
    
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([fileId])
      
      if (!error) {
        setFiles(prev => prev.filter(f => f.id !== fileId))
        setSelectedFiles(prev => prev.filter(id => id !== fileId))
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }
  
  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('URL gekopieerd!')
  }
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Media Library</h1>
        <div className="flex gap-3">
          <label className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 cursor-pointer transition-colors">
            <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
            {uploading ? 'Uploaden...' : 'Upload Bestanden'}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Zoek bestanden..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterBucket}
              onChange={(e) => setFilterBucket(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <option value="all">Alle Buckets</option>
              <option value="products">Producten</option>
              <option value="ai-generated">AI Gegenereerd</option>
            </select>
            
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                Lijst
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Selected files bar */}
      {selectedFiles.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-center justify-between">
          <span className="text-sm text-amber-800">
            {selectedFiles.length} bestand{selectedFiles.length > 1 ? 'en' : ''} geselecteerd
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                selectedFiles.forEach(id => {
                  const file = files.find(f => f.id === id)
                  if (file) handleDelete(file.id, file.bucket)
                })
              }}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Verwijder selectie
            </button>
            <button
              onClick={() => setSelectedFiles([])}
              className="text-gray-600 hover:text-gray-700 text-sm font-medium"
            >
              Deselecteer alles
            </button>
          </div>
        </div>
      )}
      
      {/* Files Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all ${
                selectedFiles.includes(file.id) ? 'ring-2 ring-amber-500' : ''
              }`}
              onClick={() => {
                setSelectedFiles(prev =>
                  prev.includes(file.id)
                    ? prev.filter(id => id !== file.id)
                    : [...prev, file.id]
                )
              }}
            >
              <div className="aspect-square relative bg-gray-100">
                {file.type.startsWith('image/') ? (
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <PhotoIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-700 truncate">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>
              </div>
              <div className="px-3 pb-3 flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    copyUrl(file.url)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  title="Kopieer URL"
                >
                  <DocumentDuplicateIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(file.id, file.bucket)
                  }}
                  className="text-red-400 hover:text-red-600"
                  title="Verwijder"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bestand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bucket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Grootte
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Datum
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 mr-3">
                        {file.type.startsWith('image/') ? (
                          <Image
                            src={file.url}
                            alt={file.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                            <PhotoIcon className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{file.bucket}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{formatFileSize(file.size)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {new Date(file.created_at).toLocaleDateString('nl-NL')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => copyUrl(file.url)}
                      className="text-gray-400 hover:text-gray-600 mr-3"
                    >
                      <DocumentDuplicateIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(file.id, file.bucket)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}