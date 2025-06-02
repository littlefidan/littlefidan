'use client'

import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function ClearAuthPage() {
  useEffect(() => {
    const clearAuth = async () => {
      const supabase = createClient()
      
      // Clear Supabase auth
      await supabase.auth.signOut()
      
      // Clear all cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // Clear localStorage
      localStorage.clear()
      sessionStorage.clear()
      
      alert('Auth cleared! Ga naar de homepage en probeer opnieuw in te loggen.')
    }
    
    clearAuth()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Auth wordt gewist...</h1>
      <p>Wacht even terwijl alle auth data wordt gewist.</p>
    </div>
  )
}