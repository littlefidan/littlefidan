'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface DownloadButtonProps {
  fileId: string
  fileName: string
  productName: string
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

export default function DownloadButton({ 
  fileId, 
  fileName, 
  productName,
  size = 'default',
  className 
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('Je moet ingelogd zijn om te downloaden')
        router.push('/login')
        return
      }

      // Get download URL from API
      const response = await fetch(`/api/download/${fileId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Download mislukt')
      }

      // Create temporary link and trigger download
      const link = document.createElement('a')
      link.href = data.downloadUrl
      link.download = fileName
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success(`${productName} wordt gedownload!`)
    } catch (error: any) {
      console.error('Download error:', error)
      toast.error(error.message || 'Er is een fout opgetreden bij het downloaden')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      size={size}
      onClick={handleDownload}
      disabled={isDownloading}
      className={className}
    >
      {isDownloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Downloaden...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download
        </>
      )}
    </Button>
  )
}