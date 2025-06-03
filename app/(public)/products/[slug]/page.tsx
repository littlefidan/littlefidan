import { notFound } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import ProductDetail from './product-detail'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (!product) {
    return {
      title: 'Product niet gevonden',
    }
  }

  return {
    title: `${product.name} - LittleFidan`,
    description: product.description,
  }
}

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

  // Fetch product with all related data
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      product_files(*)
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error || !product) {
    notFound()
  }

  // If it's a bundle, get bundle items
  let bundleItems = []
  if (product.product_type === 'bundle') {
    const { data } = await supabase
      .from('bundle_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('bundle_id', product.id)
      .order('display_order')

    bundleItems = data || []
  }

  // Get related products
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category)
    .neq('id', product.id)
    .eq('status', 'active')
    .limit(4)

  return (
    <ProductDetail 
      product={product} 
      bundleItems={bundleItems}
      relatedProducts={relatedProducts || []}
    />
  )
}