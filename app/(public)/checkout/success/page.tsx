import { CheckCircle, Download, Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  // Mock order data - replace with real order from URL params or session
  const orderNumber = 'ORD-2024-003'
  const email = 'klant@voorbeeld.nl'

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-earth-warm flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="shadow-2xl">
          <CardContent className="p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="mx-auto mb-6 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            {/* Success Message */}
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-sage-600 mb-4">
              Bedankt voor je bestelling!
            </h1>
            
            <p className="text-lg text-sage-500 mb-2">
              Je bestelling is succesvol geplaatst
            </p>
            
            <p className="text-sage-600 font-medium mb-8">
              Bestelnummer: {orderNumber}
            </p>

            {/* What happens next */}
            <div className="bg-sage-50 rounded-2xl p-6 mb-8 text-left">
              <h2 className="font-semibold text-sage-600 mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Wat gebeurt er nu?
              </h2>
              <ul className="space-y-3 text-sm text-sage-600">
                <li className="flex items-start gap-2">
                  <span className="text-sage-400 mt-0.5">✓</span>
                  <span>Je ontvangt binnen enkele minuten een bevestigingsmail op <strong>{email}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage-400 mt-0.5">✓</span>
                  <span>In de e-mail vind je downloadlinks voor al je producten</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage-400 mt-0.5">✓</span>
                  <span>Je kunt ook inloggen op je account om je downloads te bekijken</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage-400 mt-0.5">✓</span>
                  <span>Downloads zijn 30 dagen geldig met maximaal 5 downloads per product</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/account/downloads">
                  <Download className="mr-2 h-5 w-5" />
                  Ga naar Downloads
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/products">
                  Verder winkelen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Help Text */}
            <p className="text-sm text-sage-500 mt-8">
              Heb je vragen of hulp nodig? Neem contact op via{' '}
              <a href="mailto:support@littlefidan.nl" className="text-sage-600 underline hover:text-sage-500">
                support@littlefidan.nl
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Newsletter Signup */}
        <Card className="mt-6 bg-white/80 backdrop-blur">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-sage-600 mb-2">
              Mis geen nieuwe producten!
            </h3>
            <p className="text-sm text-sage-500 mb-4">
              Schrijf je in voor onze nieuwsbrief en ontvang 10% korting op je volgende bestelling
            </p>
            <Button variant="secondary" asChild>
              <Link href="/newsletter">
                Inschrijven voor nieuwsbrief
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}