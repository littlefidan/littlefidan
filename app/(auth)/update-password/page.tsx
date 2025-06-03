'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Wachtwoord moet minimaal 6 karakters lang zijn')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      setIsSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error: any) {
      setError(error.message || 'Er is een fout opgetreden. Probeer het opnieuw.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 via-mint-50 to-baby-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full space-y-8 p-8 bg-white rounded-3xl shadow-xl text-center"
        >
          <div>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-mint-100 mb-4">
              <CheckCircleIcon className="h-8 w-8 text-mint-600" />
            </div>
            <h2 className="text-3xl font-serif text-primary-800">
              Wachtwoord bijgewerkt!
            </h2>
            <p className="mt-4 text-neutral-medium">
              Je wachtwoord is succesvol bijgewerkt. Je wordt doorgestuurd naar de inlogpagina...
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 via-mint-50 to-baby-blue-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 p-8 bg-white rounded-3xl shadow-xl"
      >
        <div>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-olive-100 mb-4">
            <LockClosedIcon className="h-6 w-6 text-olive-600" />
          </div>
          <h2 className="text-3xl font-serif text-primary-800 text-center">
            Nieuw wachtwoord instellen
          </h2>
          <p className="mt-2 text-center text-neutral-medium">
            Kies een sterk wachtwoord voor je account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary-700 mb-2">
                Nieuw wachtwoord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-taupe-200 rounded-xl placeholder-neutral-medium text-primary-900 focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-mint-500"
                placeholder="Minimaal 6 karakters"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary-700 mb-2">
                Bevestig wachtwoord
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-taupe-200 rounded-xl placeholder-neutral-medium text-primary-900 focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-mint-500"
                placeholder="Herhaal je wachtwoord"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-olive to-sage hover:from-olive-600 hover:to-sage-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mint-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Bijwerken...' : 'Wachtwoord bijwerken'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}