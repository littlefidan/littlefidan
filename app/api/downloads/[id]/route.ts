import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Je moet ingelogd zijn om bestanden te downloaden' },
        { status: 401 }
      )
    }

    // Get the file
    const { data: file, error: fileError } = await supabase
      .from('product_files')
      .select(`
        *,
        product:products(*)
      `)
      .eq('id', params.id)
      .single()

    if (fileError || !file) {
      return NextResponse.json(
        { error: 'Bestand niet gevonden' },
        { status: 404 }
      )
    }

    // Check access based on product type
    const product = file.product
    let hasAccess = false

    // Check if product is free
    if (product.access_type === 'free') {
      hasAccess = true
    } else {
      // Check if user has purchased the product
      const { data: purchase } = await supabase
        .from('order_items')
        .select(`
          *,
          order:orders!inner(*)
        `)
        .eq('product_id', product.id)
        .eq('order.user_id', user.id)
        .eq('order.payment_status', 'paid')
        .single()

      if (purchase) {
        hasAccess = true
      }

      // Check if product is in a bundle the user purchased
      if (!hasAccess) {
        const { data: bundlePurchase } = await supabase
          .from('bundle_items')
          .select(`
            *,
            bundle:products!bundle_id(id),
            order_items!inner(
              *,
              order:orders!inner(*)
            )
          `)
          .eq('product_id', product.id)
          .eq('order_items.order.user_id', user.id)
          .eq('order_items.order.payment_status', 'paid')
          .single()

        if (bundlePurchase) {
          hasAccess = true
        }
      }
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Je hebt geen toegang tot dit bestand' },
        { status: 403 }
      )
    }

    // Generate signed URL for download
    const { data: signedUrl, error: urlError } = await supabase
      .storage
      .from('product-files')
      .createSignedUrl(file.file_path, 3600) // 1 hour expiry

    if (urlError || !signedUrl) {
      throw new Error('Kon download link niet genereren')
    }

    // Log download
    await supabase
      .from('download_logs')
      .insert([{
        user_id: user.id,
        file_id: file.id,
        product_id: product.id,
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent')
      }])

    // Update download counts
    await supabase
      .from('products')
      .update({ download_count: product.download_count + 1 })
      .eq('id', product.id)

    return NextResponse.json({
      download_url: signedUrl.signedUrl,
      file_name: file.file_name,
      file_size: file.file_size,
      expires_at: new Date(Date.now() + 3600 * 1000).toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Er is een fout opgetreden' },
      { status: 500 }
    )
  }
}