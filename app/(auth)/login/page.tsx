'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else if (data.user) {
        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', data.user.id)
          .single()

        if (profile?.is_admin) {
          router.push('/admin')
        } else {
          router.push('/account')
        }
      }
    } catch {
      setError('Er is iets misgegaan. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mint-50 via-white to-sage-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-dreamy border-0">
          <CardHeader className="text-center pb-8">
            <Link href="/" className="inline-flex items-center justify-center mb-6">
              <div className="rounded-full bg-gradient-to-br from-mint to-sage p-3">
                <svg 
                  className="h-8 w-8 text-white" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 22V13" />
                  <path d="M12 13C12 13 8 10 8 7C8 4 10 2 12 2C10 2 8 4 8 7C8 10 12 13 12 13Z" fill="currentColor" fillOpacity="0.3" />
                  <path d="M12 13C12 13 16 10 16 7C16 4 14 2 12 2C14 2 16 4 16 7C16 10 12 13 12 13Z" fill="currentColor" fillOpacity="0.3" />
                  <path d="M7 22H17" />
                </svg>
              </div>
            </Link>
            <CardTitle className="text-2xl font-serif text-taupe-800">Welkom terug</CardTitle>
            <CardDescription className="text-taupe-600">
              Log in op je LittleFidan account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-taupe-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-taupe-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="jouw@email.nl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 border-taupe-200 focus:border-mint focus:ring-mint"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-taupe-700">Wachtwoord</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-taupe-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 border-taupe-200 focus:border-mint focus:ring-mint"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-baby-pink-100 text-baby-pink-700 p-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-olive to-sage hover:opacity-90 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Even geduld...
                  </>
                ) : (
                  <>
                    Inloggen
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link 
                href="/reset-password" 
                className="text-sm text-taupe-600 hover:text-olive transition-colors"
              >
                Wachtwoord vergeten?
              </Link>
              <div className="text-sm text-taupe-600">
                Nog geen account?{' '}
                <Link href="/signup" className="text-olive hover:text-sage font-medium">
                  Registreer hier
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}