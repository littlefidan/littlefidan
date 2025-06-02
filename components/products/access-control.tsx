'use client'

import React from 'react'
import { LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface AccessControlProps {
  files: Array<{
    id: string
    file_name: string
    access_type?: string
  }>
  productAccessType: 'free' | 'paid' | 'mixed'
  onAccessChange: (fileId: string, accessType: string) => void
}

export default function AccessControl({ files, productAccessType, onAccessChange }: AccessControlProps) {
  if (productAccessType !== 'mixed') {
    return null
  }

  const accessTypes = [
    { value: 'free', label: 'Gratis', icon: CheckCircleIcon, color: 'text-green-600' },
    { value: 'paid', label: 'Betaald', icon: LockClosedIcon, color: 'text-blue-600' }
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Toegangscontrole per Bestand</h3>
      <p className="text-sm text-gray-500">
        Stel individuele toegangsniveaus in voor elk bestand in dit gemengde product.
      </p>
      
      <div className="space-y-2">
        {files.map(file => {
          const currentAccess = file.access_type || 'paid'
          
          return (
            <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">{file.file_name}</span>
              
              <div className="flex gap-2">
                {accessTypes.map(type => {
                  const Icon = type.icon
                  const isSelected = currentAccess === type.value
                  
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => onAccessChange(file.id, type.value)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        isSelected
                          ? `bg-white shadow-sm ring-2 ${
                              type.value === 'free' ? 'ring-green-500' : 'ring-blue-500'
                            }`
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isSelected ? type.color : 'text-gray-400'}`} />
                      {type.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}