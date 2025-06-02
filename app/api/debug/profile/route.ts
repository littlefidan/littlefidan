import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Not authenticated',
        user: null,
        profile: null 
      })
    }
    
    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    // If no profile exists, try to create one
    if (profileError && profileError.code === 'PGRST116') {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || null,
          is_admin: false
        })
        .select()
        .single()
      
      return NextResponse.json({
        message: 'Profile created',
        user: {
          id: user.id,
          email: user.email,
          metadata: user.user_metadata
        },
        profile: newProfile,
        insertError: insertError?.message
      })
    }
    
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata
      },
      profile,
      profileError: profileError?.message
    })
    
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Server error',
      message: error.message 
    }, { status: 500 })
  }
}