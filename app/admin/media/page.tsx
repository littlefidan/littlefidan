import { checkAdminAuth } from '@/lib/auth/admin-check'
import MediaLibraryClient from './media-library-client'

async function getMediaFiles() {
  const { supabase } = await checkAdminAuth()
  
  // Get files from storage buckets
  const buckets = ['products', 'ai-generated']
  const allFiles = []
  
  for (const bucket of buckets) {
    const { data: files, error } = await supabase
      .storage
      .from(bucket)
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })
    
    if (!error && files) {
      const filesWithUrls = files.map(file => ({
        ...file,
        bucket,
        url: supabase.storage.from(bucket).getPublicUrl(file.name).data.publicUrl,
        size: file.metadata?.size || 0,
        type: file.metadata?.mimetype || 'unknown'
      }))
      allFiles.push(...filesWithUrls)
    }
  }
  
  return allFiles
}

export default async function MediaLibraryPage() {
  const files = await getMediaFiles()
  
  return <MediaLibraryClient initialFiles={files} />
}