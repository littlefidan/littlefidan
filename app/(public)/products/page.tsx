import { Suspense } from 'react'
import ProductsClient from './products-client'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const revalidate = 60 // Revalidate every minute

async function getInitialData() {
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
  
  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  // Fetch initial products
  const { data: products, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(12)

  return {
    categories: categories || [],
    products: products || [],
    totalProducts: count || 0
  }
}

export default async function ProductsPage() {
  const initialData = await getInitialData()

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <ProductsClient initialData={initialData} />
    </Suspense>
  )
}