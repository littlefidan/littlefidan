import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function ensureUserProfile() {
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
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  // Check if profile exists
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  // If profile doesn't exist, create it
  if (error && error.code === 'PGRST116') {
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        is_admin: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (insertError) {
      console.error('Error creating profile:', insertError)
      return null
    }
    
    return newProfile
  }
  
  return profile
}