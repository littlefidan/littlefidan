'use client'

import React, { useState } from 'react'
import { XMarkIcon, DocumentIcon, ArrowDownTrayIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface FilePreviewProps {
  file: {
    id: string
    file_name: string
    file_url: string
    file_type?: string
    file_size?: number
    is_preview: boolean
    access_type?: string
  }
  hasAccess: boolean
  onClose?: () => void
  onDownload?: () => void
}

export default function FilePreview({ file, hasAccess, onClose, onDownload }: FilePreviewProps) {
  const [imageError, setImageError] = useState(false)
  
  const isImage = file.file_type?.startsWith('image/') || 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file.file_name)
  
  const isPDF = file.file_type === 'application/pdf' || 
    /\.pdf$/i.test(file.file_name)

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size'
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  const getAccessLabel = () => {
    switch (file.access_type) {
      case 'free':
        return { text: 'Gratis', className: 'bg-green-100 text-green-700' }
      case 'paid':
        return { text: 'Betaald', className: 'bg-blue-100 text-blue-700' }
      default:
        return { text: 'Betaald', className: 'bg-blue-100 text-blue-700' }
    }
  }

  const accessLabel = getAccessLabel()

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <DocumentIcon className="h-6 w-6 text-gray-400" />
          <div>
            <h3 className="font-medium text-gray-900">{file.file_name}</h3>
            <p className="text-sm text-gray-500">{formatFileSize(file.file_size)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${accessLabel.className}`}>
            {accessLabel.text}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="relative bg-gray-50">
        {hasAccess ? (
          <>
            {isImage && !imageError ? (
              <div className="relative h-96">
                <Image
                  src={file.file_url}
                  alt={file.file_name}
                  fill
                  className="object-contain"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : isPDF ? (
              <iframe
                src={file.file_url}
                className="w-full h-96"
                title={file.file_name}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <DocumentIcon className="h-24 w-24 mb-4" />
                <p className="text-lg font-medium mb-2">Preview niet beschikbaar</p>
                <p className="text-sm">Download het bestand om de inhoud te bekijken</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 text-gray-500">
            <LockClosedIcon className="h-24 w-24 mb-4" />
            <p className="text-lg font-medium mb-2">Geen toegang</p>
            <p className="text-sm text-center max-w-md">
              Je moet dit product kopen om toegang te krijgen tot dit bestand
            </p>
          </div>
        )}
      </div>

      {hasAccess && onDownload && (
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={onDownload}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            Download {file.file_name}
          </button>
        </div>
      )}
    </div>
  )
}