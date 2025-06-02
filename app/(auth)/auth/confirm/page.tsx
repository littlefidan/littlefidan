import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default async function AuthConfirmPage() {
  const supabase = createServerComponentClient({ cookies })
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Check if profile exists
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  // If no profile exists, create one
  if (!profile || profileError) {
    await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || null,
        is_admin: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
  }
  
  // Redirect to account after a short delay
  redirect('/account')
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-earth-warm p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-6 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-sage-600 mb-2">
            Account bevestigd!
          </h1>
          <p className="text-sage-500">
            Je wordt doorgestuurd naar je account...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}