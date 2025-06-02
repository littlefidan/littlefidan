'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ShieldCheck, CreditCard, Smartphone, Building2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartStore } from '@/lib/store/cart-store'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

const paymentMethods = [
  { id: 'ideal', name: 'iDEAL', icon: '🏦', popular: true },
  { id: 'card', name: 'Creditcard', icon: '💳', popular: false },
  { id: 'paypal', name: 'PayPal', icon: '💰', popular: false },
  { id: 'bancontact', name: 'Bancontact', icon: '🏧', popular: false },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState('ideal')
  
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    companyName: '',
    isBusinessCustomer: false,
    vatNumber: '',
    agreeToTerms: false,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (items.length === 0) {
    router.push('/products')
    return null
  }

  const subtotal = getTotalPrice()
  const vat = subtotal * 0.21 // 21% BTW
  const total = subtotal + vat

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.agreeToTerms) {
      alert('Je moet akkoord gaan met de algemene voorwaarden')
      return
    }

    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            ...item,
            quantity: item.quantity || 1
          })),
          customerData: formData,
          paymentMethod: selectedPayment
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Er ging iets mis met de betaling')
      }

      if (data.success) {
        clearCart()
        
        if (data.checkoutUrl) {
          // Redirect to payment page (Mollie or success page)
          window.location.href = data.checkoutUrl
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert(error instanceof Error ? error.message : 'Er ging iets mis. Probeer het opnieuw.')
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Terug naar winkel
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle>Besteloverzicht</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-sage-50 flex-shrink-0">
                        <Image
                          src={item.image || `https://placehold.co/100x100/9CAA8B/FFFFFF?text=${encodeURIComponent(item.name)}`}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sage-600 text-sm truncate">{item.name}</h4>
                        <p className="text-sm text-sage-500">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-sage-100 mt-6 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-sage-500">Subtotaal</span>
                    <span className="text-sage-600">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-sage-500">BTW (21%)</span>
                    <span className="text-sage-600">{formatPrice(vat)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-sage-100">
                    <span className="text-sage-600">Totaal</span>
                    <span className="text-sage-600">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-sage-50 rounded-xl">
                  <div className="flex items-center gap-3 text-sm text-sage-600">
                    <ShieldCheck className="h-5 w-5 text-sage-500" />
                    <p>Veilige betaling via Mollie</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Klantgegevens</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Volledige naam *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      placeholder="Jan Jansen"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="business"
                      className="rounded border-sage-300"
                      checked={formData.isBusinessCustomer}
                      onChange={(e) => setFormData({ ...formData, isBusinessCustomer: e.target.checked })}
                    />
                    <Label htmlFor="business" className="font-normal cursor-pointer">
                      Ik bestel namens een school of bedrijf
                    </Label>
                  </div>

                  {formData.isBusinessCustomer && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Bedrijfsnaam *</Label>
                        <Input
                          id="companyName"
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          required={formData.isBusinessCustomer}
                          placeholder="Basisschool De Regenboog"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vatNumber">BTW-nummer (optioneel)</Label>
                        <Input
                          id="vatNumber"
                          type="text"
                          value={formData.vatNumber}
                          onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                          placeholder="NL123456789B01"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Betaalmethode</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedPayment === method.id
                            ? 'border-sage-400 bg-sage-50'
                            : 'border-sage-200 hover:border-sage-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={selectedPayment === method.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="sr-only"
                        />
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-medium text-sage-600">{method.name}</span>
                        {method.popular && (
                          <span className="absolute top-2 right-2 text-xs bg-sage-400 text-white px-2 py-0.5 rounded-full">
                            Populair
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Terms and Submit */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="terms"
                        className="rounded border-sage-300 mt-1"
                        checked={formData.agreeToTerms}
                        onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                      />
                      <Label htmlFor="terms" className="font-normal cursor-pointer text-sm text-sage-600">
                        Ik ga akkoord met de{' '}
                        <Link href="/terms" className="underline hover:text-sage-500">
                          algemene voorwaarden
                        </Link>{' '}
                        en{' '}
                        <Link href="/privacy" className="underline hover:text-sage-500">
                          privacybeleid
                        </Link>
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isProcessing || !formData.agreeToTerms}
                    >
                      {isProcessing ? (
                        'Betaling wordt verwerkt...'
                      ) : (
                        <>
                          Betaal {formatPrice(total)}
                          <CreditCard className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-sage-500">
                      Je wordt doorgestuurd naar Mollie om je betaling veilig af te ronden
                    </p>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}