'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, Mail } from 'lucide-react'

interface NewsletterFormProps {
  className?: string
  buttonText?: string
  placeholder?: string
}

export function NewsletterForm({ 
  className = '',
  buttonText = 'Aanmelden',
  placeholder = 'jouw@email.nl'
}: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Vul je email adres in')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Er is iets misgegaan')
      }

      if (data.already_subscribed) {
        toast.info(data.message)
      } else if (data.reactivated) {
        toast.success(data.message)
      } else {
        toast.success(data.message)
      }

      setEmail('')
    } catch (error: any) {
      toast.error(error.message || 'Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-medium" />
        <Input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10 rounded-full"
          disabled={loading}
        />
      </div>
      <Button 
        type="submit"
        className="bg-primary hover:bg-primary-600 text-white rounded-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Even geduld...
          </>
        ) : (
          buttonText
        )}
      </Button>
    </form>
  )
}