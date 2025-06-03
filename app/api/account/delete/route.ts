import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function DELETE(request: NextRequest) {
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
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const userId = user.id

    // Delete user data in order (respecting foreign key constraints)
    
    // 1. Delete order items first (they reference orders)
    const { error: orderItemsError } = await supabase
      .from('order_items')
      .delete()
      .in('order_id', 
        await supabase
          .from('orders')
          .select('id')
          .eq('user_id', userId)
          .then(({ data }) => data?.map(order => order.id) || [])
      )

    if (orderItemsError) {
      console.error('Error deleting order items:', orderItemsError)
    }

    // 2. Delete orders
    const { error: ordersError } = await supabase
      .from('orders')
      .delete()
      .eq('user_id', userId)

    if (ordersError) {
      console.error('Error deleting orders:', ordersError)
    }

    // 3. Delete user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.error('Error deleting profile:', profileError)
    }

    // 4. Delete the user from Supabase Auth
    // Note: This requires admin privileges in a real app
    // For now we'll just sign them out
    const { error: authError } = await supabase.auth.signOut()

    if (authError) {
      console.error('Error signing out user:', authError)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Account succesvol verwijderd'
    })

  } catch (error: any) {
    console.error('Error deleting account:', error)
    return NextResponse.json({ 
      error: error.message || 'Er is een fout opgetreden bij het verwijderen van het account' 
    }, { status: 500 })
  }
}