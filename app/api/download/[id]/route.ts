import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const productFileId = id

    // Get the product file details
    const { data: productFile, error: fileError } = await supabase
      .from('product_files')
      .select('*, product:products(*)')
      .eq('id', productFileId)
      .single()

    if (fileError || !productFile) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Check if user has access to this file
    const hasAccess = await checkUserAccess(supabase, user.id, productFile)
    
    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Log the download
    await supabase.from('download_logs').insert({
      user_id: user.id,
      file_id: productFileId,
      product_id: productFile.product_id,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      user_agent: request.headers.get('user-agent')
    })

    // Increment download counter
    await supabase
      .from('product_files')
      .update({ 
        display_order: productFile.display_order + 1 // Using display_order as download counter temporarily
      })
      .eq('id', productFileId)

    // Generate signed URL for the file
    let downloadUrl = productFile.file_url

    // If file is stored in Supabase storage, generate a signed URL
    if (productFile.file_url.includes('supabase')) {
      const bucketName = 'product-files'
      const filePath = productFile.file_path
      
      const { data: signedUrlData, error: signedUrlError } = await supabase
        .storage
        .from(bucketName)
        .createSignedUrl(filePath, 3600) // 1 hour expiry

      if (signedUrlError) {
        console.error('Error generating signed URL:', signedUrlError)
        return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 })
      }

      downloadUrl = signedUrlData.signedUrl
    }

    // Return download URL
    return NextResponse.json({
      success: true,
      downloadUrl,
      fileName: productFile.file_name,
      fileSize: productFile.file_size
    })

  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function checkUserAccess(supabase: any, userId: string, productFile: any): Promise<boolean> {
  // Check if user has purchased the product
  const { data: purchase } = await supabase
    .from('order_items')
    .select(`
      *,
      order:orders!inner(*)
    `)
    .eq('product_id', productFile.product_id)
    .eq('order.user_id', userId)
    .eq('order.payment_status', 'paid')
    .single()

  if (purchase) return true

  // Check if user has active subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .gte('current_period_end', new Date().toISOString())
    .single()

  if (subscription) {
    // Check if product allows subscription access
    const accessType = productFile.product?.access_type || 'paid'
    if (accessType === 'subscription_only' || accessType === 'mixed') {
      return true
    }
  }

  // Check if file is free
  if (productFile.product?.access_type === 'free') {
    return true
  }

  return false
}