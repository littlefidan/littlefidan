'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export default function MakeAdminPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const makeCurrentUserAdmin = async () => {
    setStatus('loading')
    setMessage('')

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        setStatus('error')
        setMessage('Je moet eerst inloggen via /login')
        return
      }

      // Update profile to admin
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', user.id)

      if (error) {
        // If profile doesn't exist, create it
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            is_admin: true,
            created_at: new Date().toISOString()
          })

        if (insertError) {
          setStatus('error')
          setMessage('Kon geen admin maken: ' + insertError.message)
          return
        }
      }

      setStatus('success')
      setMessage(`Gelukt! ${user.email} is nu admin. Ga naar /admin`)
    } catch (err) {
      setStatus('error')
      setMessage('Er ging iets mis')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Maak jezelf Admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            Deze pagina is alleen voor development. 
            Klik op de knop om je huidige account admin rechten te geven.
          </p>

          {status === 'success' && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">{message}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{message}</span>
            </div>
          )}

          <Button
            onClick={makeCurrentUserAdmin}
            disabled={status === 'loading'}
            className="w-full"
          >
            {status === 'loading' ? 'Bezig...' : 'Maak mij Admin'}
          </Button>

          <div className="text-sm text-gray-500 space-y-1">
            <p>Stappen:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Ga eerst naar <a href="/signup" className="text-blue-500 underline">/signup</a> om een account te maken</li>
              <li>Of naar <a href="/login" className="text-blue-500 underline">/login</a> als je al een account hebt</li>
              <li>Kom terug naar deze pagina</li>
              <li>Klik op "Maak mij Admin"</li>
              <li>Ga naar <a href="/admin" className="text-blue-500 underline">/admin</a></li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}