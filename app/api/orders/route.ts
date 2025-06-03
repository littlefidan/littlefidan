import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { CheckoutItem } from '@/types/checkout'
import { safeValidate } from '@/lib/validation'

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
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch (error) {
              // Ignore - SSR environment
            }
          }
        }
      }
    )
    const { searchParams } = new URL(request.url)
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Niet geautoriseerd' },
        { status: 401 }
      )
    }

    // Check if admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.is_admin || false

    // Get query parameters
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    
    // Parse pagination parameters
    const limitParam = searchParams.get('limit') || '20'
    const offsetParam = searchParams.get('offset') || '0'
    
    // Convert to numbers with validation
    const limit = Math.min(Math.max(parseInt(limitParam) || 20, 1), 100)
    const offset = Math.max(parseInt(offsetParam) || 0, 0)

    // Build query
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(*)
        )
      `, { count: 'exact' })

    // If not admin, only show user's own orders
    if (!isAdmin) {
      query = query.eq('user_id', user.id)
    }

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`order_number.ilike.%${search}%,customer_email.ilike.%${search}%,customer_name.ilike.%${search}%`)
    }

    // Apply sorting
    query = query.order('created_at', { ascending: false })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: orders, error, count } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      orders: orders || [],
      total: count || 0,
      limit,
      offset
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Er is een fout opgetreden' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch (error) {
              // Ignore - SSR environment
            }
          }
        }
      }
    )
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    
    // Get order data from request
    const orderData = await request.json()

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Calculate totals
    const subtotal = orderData.items.reduce((sum: number, item: CheckoutItem) => 
      sum + (item.price * item.quantity), 0
    )
    const tax = subtotal * 0.21 // 21% BTW
    const total = subtotal + tax

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        order_number: orderNumber,
        user_id: user?.id || null,
        customer_email: orderData.customer_email,
        customer_name: orderData.customer_name,
        status: 'pending',
        payment_status: 'pending',
        subtotal,
        tax,
        total,
        items: orderData.items,
        metadata: orderData.metadata || {}
      }])
      .select()
      .single()

    if (orderError) {
      throw orderError
    }

    // Create order items
    const orderItems = orderData.items.map((item: CheckoutItem) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.name,
      product_price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      throw itemsError
    }

    return NextResponse.json({ order })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Er is een fout opgetreden' },
      { status: 500 }
    )
  }
}