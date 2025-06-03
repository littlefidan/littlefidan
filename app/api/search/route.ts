import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
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
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const category = searchParams.get('category')

    if (!query || query.length < 2) {
      return NextResponse.json({ products: [] })
    }

    // Build the query
    let supabaseQuery = supabase
      .from('products')
      .select('id, name, slug, price, category, images, tags')
      .eq('status', 'active')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
      .order('name')
      .limit(20)

    // Add category filter if provided
    if (category) {
      supabaseQuery = supabaseQuery.eq('category', category)
    }

    const { data: products, error } = await supabaseQuery

    if (error) {
      console.error('Search error:', error)
      return NextResponse.json({ error: 'Search failed' }, { status: 500 })
    }

    // Transform the data
    const results = products?.map(product => ({
      id: product.id,
      title: product.name,
      slug: product.slug,
      price: product.price,
      category: product.category,
      image: product.images?.[0] || null,
      tags: product.tags || []
    })) || []

    return NextResponse.json({ products: results })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
