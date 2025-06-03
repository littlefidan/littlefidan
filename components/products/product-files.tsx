'use client'

import React, { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { DocumentIcon, EyeIcon, ArrowDownTrayIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import FilePreview from './file-preview'

interface ProductFile {
  id: string
  file_name: string
  file_url: string
  file_size?: number
  file_type?: string
  thumbnail_url?: string
  display_order: number
  is_preview: boolean
  access_type?: string
  source_product_id?: string
  source_product_name?: string
}

interface ProductFilesProps {
  productId: string
  productType: 'single' | 'bundle'
  productAccessType: 'free' | 'paid' | 'mixed'
}

export default function ProductFiles({ productId, productType, productAccessType }: ProductFilesProps) {
  const [files, setFiles] = useState<ProductFile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<ProductFile | null>(null)
  const [userAccess, setUserAccess] = useState<Record<string, boolean>>({})
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadProductFiles()
    checkUserAccess()
  }, [productId])

  const loadProductFiles = async () => {
    try {
      // Use the get_product_files function to get all files including bundle items
      const { data, error } = await supabase
        .rpc('get_product_files', { p_product_id: productId })

      if (error) throw error
      setFiles(data || [])
    } catch (error) {
      console.error('Error loading product files:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkUserAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Check access for each file
      const accessChecks: Record<string, boolean> = {}
      
      for (const file of files) {
        const { data } = await supabase
          .rpc('check_file_access', { 
            p_user_id: user.id, 
            p_file_id: file.id 
          })
        
        accessChecks[file.id] = data || false
      }
      
      setUserAccess(accessChecks)
    } catch (error) {
      console.error('Error checking user access:', error)
    }
  }

  const handleDownload = async (file: ProductFile) => {
    if (!userAccess[file.id]) {
      alert('Je hebt geen toegang tot dit bestand')
      return
    }

    // Log download
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('download_logs')
        .insert({
          user_id: user.id,
          file_id: file.id,
          product_id: productId
        })
    }

    // Open file in new tab
    window.open(file.file_url, '_blank')
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const mb = bytes / (1024 / 1024)
    return `${mb.toFixed(2)} MB`
  }

  const getAccessIcon = (file: ProductFile) => {
    const accessType = file.access_type || productAccessType
    
    if (accessType === 'free' || userAccess[file.id]) {
      return null
    }
    
    return <LockClosedIcon className="h-4 w-4 text-gray-400" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const previewFiles = files.filter(f => f.is_preview)
  const downloadableFiles = files.filter(f => !f.is_preview)

  return (
    <div className="space-y-6">
      {/* Preview Files */}
      {previewFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Preview Bestanden</h3>
          <div className="grid gap-4">
            {previewFiles.map(file => (
              <div key={file.id} className="border rounded-lg overflow-hidden">
                <FilePreview
                  file={file}
                  hasAccess={true} // Preview files are always accessible
                  onDownload={() => handleDownload(file)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Downloadable Files */}
      {downloadableFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Downloadbare Bestanden</h3>
          <div className="divide-y divide-gray-200 border rounded-lg">
            {downloadableFiles.map(file => {
              const hasAccess = userAccess[file.id]
              const accessType = file.access_type || productAccessType
              
              return (
                <div
                  key={file.id}
                  className={`flex items-center justify-between p-4 hover:bg-gray-50 ${
                    !hasAccess ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <DocumentIcon className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{file.file_name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{formatFileSize(file.file_size)}</span>
                        {file.source_product_name && (
                          <>
                            <span>•</span>
                            <span>Van: {file.source_product_name}</span>
                          </>
                        )}
                        {accessType !== productAccessType && (
                          <>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              accessType === 'free' 
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {accessType === 'free' ? 'Gratis' : 'Betaald'}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getAccessIcon(file)}
                    <button
                      onClick={() => setSelectedFile(file)}
                      className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                      title="Preview"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDownload(file)}
                      disabled={!hasAccess}
                      className={`p-2 rounded-lg ${
                        hasAccess
                          ? 'text-blue-500 hover:text-blue-700 hover:bg-blue-50'
                          : 'text-gray-300 cursor-not-allowed'
                      }`}
                      title={hasAccess ? 'Download' : 'Geen toegang'}
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <FilePreview
              file={selectedFile}
              hasAccess={userAccess[selectedFile.id]}
              onClose={() => setSelectedFile(null)}
              onDownload={() => {
                handleDownload(selectedFile)
                setSelectedFile(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}