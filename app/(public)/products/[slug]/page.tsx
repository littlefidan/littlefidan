import { notFound } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import ProductDetail from './product-detail'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
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
  params: { slug: string } 
}) {
  const supabase = createServerComponentClient({ cookies })

  // Fetch product with all related data
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      product_files(*)
    `)
    .eq('slug', params.slug)
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