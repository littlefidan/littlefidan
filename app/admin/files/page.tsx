'use client'

import React, { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  DocumentTextIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  DocumentIcon
} from '@heroicons/react/24/outline'

interface FileItem {
  id: string
  name: string
  file_url: string
  file_size: number
  mime_type: string
  category: string
  description?: string
  downloads: number
  created_at: string
  updated_at: string
}

export default function AdminFiles() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadData, setUploadData] = useState({
    category: 'activity_books',
    description: ''
  })
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchFiles()
  }, [filterCategory])

  const fetchFiles = async () => {
    try {
      let query = supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false })

      if (filterCategory !== 'all') {
        query = query.eq('category', filterCategory)
      }

      const { data, error } = await query

      if (error) throw error
      setFiles(data || [])
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    try {
      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `pdfs/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, selectedFile)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(filePath)

      // Save file metadata to database
      const { error: dbError } = await supabase
        .from('files')
        .insert([{
          name: selectedFile.name,
          file_url: publicUrl,
          file_size: selectedFile.size,
          mime_type: selectedFile.type,
          category: uploadData.category,
          description: uploadData.description,
          downloads: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])

      if (dbError) throw dbError

      // Reset form and refresh list
      setSelectedFile(null)
      setUploadData({ category: 'activity_books', description: '' })
      fetchFiles()
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Fout bij uploaden bestand. Probeer het opnieuw.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string, fileUrl: string) => {
    if (!confirm('Weet je zeker dat je dit bestand wilt verwijderen?')) return

    try {
      // Delete from storage
      const filePath = fileUrl.split('/').pop()
      if (filePath) {
        await supabase.storage
          .from('files')
          .remove([`pdfs/${filePath}`])
      }

      // Delete from database
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setFiles(files.filter(f => f.id !== id))
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (file.description && file.description.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  const categories = ['all', 'activity_books', 'educational', 'craft_guides', 'worksheets', 'other']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-serif text-primary-800 mb-8">Bestandsbeheer</h1>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
        <h2 className="text-lg font-semibold text-primary-800 mb-4">Nieuw Bestand Uploaden</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Selecteer Bestand
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Categorie
              </label>
              <select
                value={uploadData.category}
                onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                className="w-full px-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300"
              >
                <option value="activity_books">Activiteitenboeken</option>
                <option value="educational">Educatief</option>
                <option value="craft_guides">Knutselgidsen</option>
                <option value="worksheets">Werkbladen</option>
                <option value="other">Overig</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Beschrijving
            </label>
            <textarea
              rows={2}
              value={uploadData.description}
              onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
              placeholder="Korte beschrijving van het bestand..."
              className="w-full px-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
            />
          </div>
          <button
            onClick={handleFileUpload}
            disabled={!selectedFile || uploading}
            className="flex items-center px-4 py-2 bg-mint-500 text-white rounded-lg hover:bg-mint-600 transition-colors disabled:opacity-50"
          >
            <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
            {uploading ? 'Uploaden...' : 'Upload Bestand'}
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-medium" />
              <input
                type="text"
                placeholder="Zoek bestanden..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
              />
            </div>
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-taupe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Alle Categorieën' : cat.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFiles.map((file) => (
          <div key={file.id} className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-botanical transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <DocumentIcon className="h-12 w-12 text-primary-400 mr-3" />
                <div>
                  <h3 className="font-medium text-primary-800 truncate max-w-[200px]">
                    {file.name}
                  </h3>
                  <p className="text-sm text-neutral-medium">
                    {formatFileSize(file.file_size)}
                  </p>
                </div>
              </div>
            </div>

            {file.description && (
              <p className="text-sm text-neutral-medium mb-4 line-clamp-2">
                {file.description}
              </p>
            )}

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs bg-taupe-100 text-taupe-700 px-2 py-1 rounded-full">
                {file.category.replace('_', ' ')}
              </span>
              <span className="text-xs text-neutral-medium">
                {file.downloads} downloads
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-medium mb-4">
              <span>Geüpload {new Date(file.created_at).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={file.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center px-3 py-2 bg-mint-100 text-mint-700 rounded-lg hover:bg-mint-200 transition-colors"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                Bekijk
              </a>
              <button
                onClick={() => handleDelete(file.id, file.file_url)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <FolderIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-medium">Geen bestanden gevonden</p>
        </div>
      )}
    </div>
  )
}