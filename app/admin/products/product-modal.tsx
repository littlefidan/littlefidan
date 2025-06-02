'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { XMarkIcon, CloudArrowUpIcon, DocumentIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'
import { useDropzone } from 'react-dropzone'
import BundleSelector from '@/components/admin/bundle-selector'
import AccessControl from '@/components/products/access-control'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  long_description?: string
  price: number
  original_price?: number
  category: string
  tags?: string[]
  images?: string[]
  features?: string[]
  status: 'active' | 'draft' | 'out_of_stock'
  product_type: 'single' | 'bundle'
  access_type: 'free' | 'paid' | 'mixed'
  created_at: string
  updated_at: string
}

interface ProductFile {
  id?: string
  file_name: string
  file_path: string
  file_url: string
  file_size?: number
  file_type?: string
  thumbnail_url?: string
  display_order: number
  is_preview: boolean
  file?: File
}

interface ProductModalProps {
  product: Product | null
  onClose: () => void
  onSave: () => void
}

export default function ProductModal({ product, onClose, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    long_description: '',
    price: 0,
    original_price: 0,
    category: '',
    tags: [] as string[],
    status: 'draft' as const,
    product_type: 'single' as const,
    access_type: 'paid' as const,
    images: [] as string[]
  })
  
  const [files, setFiles] = useState<ProductFile[]>([])
  const [bundleProducts, setBundleProducts] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [currentTag, setCurrentTag] = useState('')
  const [previewFile, setPreviewFile] = useState<ProductFile | null>(null)
  const [fileAccessTypes, setFileAccessTypes] = useState<Record<string, string>>({})
  const [categories, setCategories] = useState<Array<{id: string, name: string, slug: string}>>([])
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Fetch categories
    fetchCategories()
    
    if (product) {
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description,
        long_description: product.long_description || '',
        price: product.price,
        original_price: product.original_price || 0,
        category: product.category,
        tags: product.tags || [],
        status: product.status,
        product_type: product.product_type || 'single',
        access_type: product.access_type || 'paid',
        images: product.images || []
      })
      
      // Load existing files if editing
      if (product.id) {
        loadProductFiles(product.id)
        
        // Load bundle items if it's a bundle
        if (product.product_type === 'bundle') {
          loadBundleItems(product.id)
        }
      }
    }
  }, [product])

  const loadProductFiles = async (productId: string) => {
    const { data, error } = await supabase
      .from('product_files')
      .select('*')
      .eq('product_id', productId)
      .order('display_order')
    
    if (data && !error) {
      setFiles(data)
    }
  }

  const loadBundleItems = async (bundleId: string) => {
    const { data, error } = await supabase
      .from('bundle_items')
      .select('product_id')
      .eq('bundle_id', bundleId)
      .order('display_order')
    
    if (data && !error) {
      setBundleProducts(data.map(item => item.product_id))
    }
  }

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('sort_order')
    
    if (data && !error) {
      setCategories(data)
      // Set default category if formData doesn't have one
      if (!formData.category && data.length > 0) {
        setFormData(prev => ({ ...prev, category: data[0].slug }))
      }
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file, index) => ({
      file_name: file.name,
      file_path: '',
      file_url: '',
      file_size: file.size,
      file_type: file.type,
      display_order: files.length + index,
      is_preview: false,
      file: file
    }))
    
    setFiles([...files, ...newFiles])
  }, [files])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: true
  })

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < files.length) {
      [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]]
      newFiles.forEach((file, i) => {
        file.display_order = i
      })
      setFiles(newFiles)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generate slug if not present
      const slug = formData.slug || generateSlug(formData.name)
      
      const productData = {
        ...formData,
        slug,
        original_price: formData.original_price || null,
        tags: formData.tags.length > 0 ? formData.tags : null,
        images: formData.images.length > 0 ? formData.images : null,
        updated_at: new Date().toISOString()
      }

      let productId = product?.id

      if (product) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id)

        if (error) throw error
      } else {
        // Create new product
        const { data, error } = await supabase
          .from('products')
          .insert([{
            ...productData,
            created_at: new Date().toISOString()
          }])
          .select()
          .single()

        if (error) throw error
        productId = data.id
      }

      // Upload new files
      if (productId && files.length > 0) {
        for (const file of files) {
          if (file.file) {
            // Upload file to Supabase Storage
            const fileName = `${productId}/${Date.now()}_${file.file_name}`
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('product-files')
              .upload(fileName, file.file)

            if (uploadError) throw uploadError

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('product-files')
              .getPublicUrl(fileName)

            // Save file reference to database
            const { error: fileError } = await supabase
              .from('product_files')
              .insert({
                product_id: productId,
                file_name: file.file_name,
                file_path: fileName,
                file_url: publicUrl,
                file_size: file.file_size,
                file_type: file.file_type,
                display_order: file.display_order,
                is_preview: file.is_preview
              })

            if (fileError) throw fileError
          }
        }
      }

      // Save bundle items if it's a bundle
      if (productId && formData.product_type === 'bundle' && bundleProducts.length > 0) {
        // First, delete existing bundle items if updating
        if (product) {
          await supabase
            .from('bundle_items')
            .delete()
            .eq('bundle_id', productId)
        }

        // Insert new bundle items
        const bundleItems = bundleProducts.map((itemProductId, index) => ({
          bundle_id: productId,
          product_id: itemProductId,
          display_order: index
        }))

        const { error: bundleError } = await supabase
          .from('bundle_items')
          .insert(bundleItems)

        if (bundleError) throw bundleError
      }

      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Fout bij opslaan product. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      setFormData({ ...formData, tags: [...formData.tags, currentTag] })
      setCurrentTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {product ? 'Product Bewerken' : 'Nieuw Product Toevoegen'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Type Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Product Type</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <label className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.product_type === 'single' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="product_type"
                  value="single"
                  checked={formData.product_type === 'single'}
                  onChange={(e) => setFormData({ ...formData, product_type: e.target.value as any })}
                  className="sr-only"
                />
                <DocumentIcon className="h-8 w-8 mb-2" />
                <span className="font-medium">Single Product</span>
                <span className="text-sm text-gray-500">Één PDF bestand</span>
              </label>

              <label className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.product_type === 'bundle' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="product_type"
                  value="bundle"
                  checked={formData.product_type === 'bundle'}
                  onChange={(e) => setFormData({ ...formData, product_type: e.target.value as any })}
                  className="sr-only"
                />
                <svg className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="font-medium">Bundle</span>
                <span className="text-sm text-gray-500">Meerdere bestanden</span>
              </label>

            </div>
          </div>

          {/* Access Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Toegangstype</h3>
            
            <select
              value={formData.access_type}
              onChange={(e) => setFormData({ ...formData, access_type: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="free">Gratis</option>
              <option value="paid">Betaald</option>
            </select>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basis Informatie</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Productnaam
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData({ 
                    ...formData, 
                    name: e.target.value,
                    slug: generateSlug(e.target.value)
                  })
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Korte Beschrijving
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uitgebreide Beschrijving
              </label>
              <textarea
                rows={6}
                value={formData.long_description}
                onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecteer een categorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Voeg tag toe..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Toevoegen
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bundle Products (for bundle type) */}
          {formData.product_type === 'bundle' && (
            <BundleSelector
              bundleId={product?.id}
              selectedProducts={bundleProducts}
              onProductsChange={setBundleProducts}
            />
          )}

          {/* File Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Bestanden</h3>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <CloudArrowUpIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-sm text-gray-600">
                {isDragActive
                  ? 'Sleep bestanden hier...'
                  : 'Sleep bestanden hier of klik om te selecteren'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, PNG, JPG, JPEG, GIF (max. 50MB per bestand)
              </p>
            </div>

            {/* Files List */}
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <DocumentIcon className="h-8 w-8 text-gray-400" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{file.file_name}</p>
                      <p className="text-xs text-gray-500">
                        {file.file_size ? `${(file.file_size / 1024 / 1024).toFixed(2)} MB` : 'Grootte onbekend'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={file.is_preview}
                          onChange={(e) => {
                            const newFiles = [...files]
                            newFiles[index].is_preview = e.target.checked
                            setFiles(newFiles)
                          }}
                          className="rounded border-gray-300"
                        />
                        Preview
                      </label>
                      <button
                        type="button"
                        onClick={() => setPreviewFile(file)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => moveFile(index, 'up')}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          ↑
                        </button>
                      )}
                      {index < files.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveFile(index, 'down')}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          ↓
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>


          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Prijzen</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prijs (€)
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Originele Prijs (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.original_price}
                  onChange={(e) => setFormData({ ...formData, original_price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Product['status'] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Concept</option>
              <option value="active">Actief</option>
              <option value="out_of_stock">Uitverkocht</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Opslaan...' : (product ? 'Product Bijwerken' : 'Product Aanmaken')}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
              <h3 className="font-medium">Preview: {previewFile.file_name}</h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              {previewFile.file_url ? (
                <iframe
                  src={previewFile.file_url}
                  className="w-full h-[600px] border border-gray-200 rounded"
                />
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Preview niet beschikbaar voor nieuwe bestanden
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}