'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      })

      if (error) throw error

      setIsSubmitted(true)
    } catch (error: any) {
      setError(error.message || 'Er is een fout opgetreden. Probeer het opnieuw.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 via-mint-50 to-baby-blue-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8 p-8 bg-white rounded-3xl shadow-xl"
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-mint-100 mb-4">
              <EnvelopeIcon className="h-8 w-8 text-mint-600" />
            </div>
            <h2 className="text-3xl font-serif text-primary-800">
              Controleer je e-mail
            </h2>
            <p className="mt-4 text-neutral-medium">
              We hebben een link naar <span className="font-medium">{email}</span> gestuurd om je wachtwoord te resetten.
            </p>
            <p className="mt-2 text-sm text-neutral-medium">
              Controleer ook je spam folder als je de e-mail niet ziet.
            </p>
          </div>
          <div className="mt-8">
            <Link
              href="/login"
              className="flex items-center justify-center w-full py-3 px-4 border border-taupe-200 rounded-xl text-sm font-medium text-primary-700 hover:bg-taupe-50 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Terug naar inloggen
            </Link>
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
          <Link 
            href="/login"
            className="inline-flex items-center text-sm text-neutral-medium hover:text-primary-600 transition-colors mb-8"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Terug naar inloggen
          </Link>
          <h2 className="text-3xl font-serif text-primary-800">
            Wachtwoord vergeten?
          </h2>
          <p className="mt-2 text-neutral-medium">
            Vul je e-mailadres in en we sturen je een link om je wachtwoord te resetten.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-2">
              E-mailadres
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none relative block w-full px-4 py-3 border border-taupe-200 rounded-xl placeholder-neutral-medium text-primary-900 focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-mint-500"
              placeholder="jouw@email.nl"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-olive to-sage hover:from-olive-600 hover:to-sage-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mint-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Verzenden...' : 'Reset link versturen'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}