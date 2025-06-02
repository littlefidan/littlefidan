import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })
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
