'use client'

import { useState } from 'react'
import { Mail, MessageCircle, Instagram, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Er ging iets mis')
      }

      toast.success(data.message || 'Bedankt voor je bericht!')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('Contact form error:', error)
      toast.error(error instanceof Error ? error.message : 'Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sage-50 to-earth-warm py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="mx-auto mb-6 flex items-center justify-center rounded-full bg-white p-3 shadow-soft w-fit">
              <MessageCircle className="h-8 w-8 text-sage-500" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-sage-600 mb-4">
              Neem Contact Op
            </h1>
            <p className="text-lg text-sage-500">
              Heb je een vraag, suggestie of wil je samenwerken? We horen graag van je!
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-sage-500" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a href="mailto:info@littlefidan.nl" className="text-sage-600 hover:text-sage-500">
                    info@littlefidan.nl
                  </a>
                  <p className="text-sm text-sage-500 mt-2">
                    Voor algemene vragen en support
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Instagram className="h-5 w-5 text-sage-500" />
                    Social Media
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a 
                    href="https://instagram.com/littlefidan" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sage-600 hover:text-sage-500"
                  >
                    @littlefidan
                  </a>
                  <p className="text-sm text-sage-500 mt-2">
                    Volg ons voor dagelijkse inspiratie
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-sage-500" />
                    Locatie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sage-600">Amsterdam, Nederland</p>
                  <p className="text-sm text-sage-500 mt-2">
                    We zijn een digitaal platform
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-sage-500" />
                    Reactietijd
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sage-600">Binnen 24-48 uur</p>
                  <p className="text-sm text-sage-500 mt-2">
                    Op werkdagen (ma-vr)
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Stuur ons een bericht</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Naam *</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          placeholder="Je volledige naam"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mailadres *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          placeholder="naam@voorbeeld.nl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Onderwerp *</Label>
                      <Input
                        id="subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        placeholder="Waar gaat je vraag over?"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Bericht *</Label>
                      <textarea
                        id="message"
                        rows={6}
                        className="flex w-full rounded-xl border border-sage-200 bg-white px-4 py-2 text-sm ring-offset-background transition-colors placeholder:text-sage-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        placeholder="Vertel ons meer..."
                      />
                    </div>

                    <Button type="submit" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? 'Verzenden...' : 'Verstuur Bericht'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* FAQ Teaser */}
              <Card className="mt-8 bg-sage-50 border-sage-200">
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-semibold text-sage-600 mb-3">
                    Veelgestelde Vragen
                  </h3>
                  <p className="text-sage-500 mb-4">
                    Bekijk onze FAQ pagina voor antwoorden op veelgestelde vragen over 
                    bestellingen, downloads, en meer.
                  </p>
                  <Button variant="outline" asChild>
                    <a href="/faq">Bekijk FAQ</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Business Inquiries Section */}
      <section className="py-12 md:py-20 bg-earth-base">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold text-sage-600 mb-8">
              Zakelijke Samenwerkingen
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-sage-600 mb-3">Scholen & Instellingen</h3>
                  <p className="text-sm text-sage-500">
                    Speciale tarieven voor educatieve instellingen en bulk bestellingen.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-sage-600 mb-3">Content Partnerships</h3>
                  <p className="text-sm text-sage-500">
                    Samenwerken aan botanisch-geïnspireerde educatieve content.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-sage-600 mb-3">Media & Pers</h3>
                  <p className="text-sm text-sage-500">
                    Voor interviews, artikelen en media-aanvragen.
                  </p>
                </CardContent>
              </Card>
            </div>
            <p className="text-sage-500 mt-8">
              Voor zakelijke aanvragen, mail naar:{' '}
              <a href="mailto:partners@littlefidan.nl" className="text-sage-600 hover:text-sage-500 font-medium">
                partners@littlefidan.nl
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}