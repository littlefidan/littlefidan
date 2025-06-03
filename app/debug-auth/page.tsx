'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { AuthSession } from '@/types/auth'

export default function DebugAuthPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<AuthSession[]>([])
  
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setSessions(prev => [...prev, { type: 'initial', session } as AuthSession])
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setSessions(prev => [...prev, { type: 'change', event, session } as AuthSession])
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Debug</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Current User:</h2>
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Auth Events:</h2>
        <div className="bg-gray-100 p-2 rounded text-sm max-h-96 overflow-y-auto">
          {sessions.map((session, index) => (
            <div key={index} className="mb-2 border-b pb-2">
              <strong>{session.type}:</strong> {session.event || 'N/A'}
              <pre className="text-xs mt-1">
                {JSON.stringify(session.session?.user?.id || 'No user', null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>

      <div className="space-x-2">
        <button 
          onClick={() => supabase.auth.signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
        <button 
          onClick={() => window.location.href = '/account'}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Go to Account
        </button>
      </div>
    </div>
  )
}