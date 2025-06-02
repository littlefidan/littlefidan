import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.length < 2) {
      return NextResponse.json({
        products: [],
        categories: [],
        total: 0
      })
    }

    // Search products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, slug, description, price, images, category')
      .eq('status', 'active')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(limit)

    if (productsError) {
      throw productsError
    }

    // Search categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name, slug, icon')
      .ilike('name', `%${query}%`)
      .limit(5)

    if (categoriesError) {
      throw categoriesError
    }

    return NextResponse.json({
      products: products || [],
      categories: categories || [],
      total: (products?.length || 0) + (categories?.length || 0)
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Er is een fout opgetreden' },
      { status: 500 }
    )
  }
}