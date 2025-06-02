import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ShoppingBag, Download, Heart, Share2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'

// Mock data - replace with Supabase query
const mockProduct = {
  id: '1',
  title: 'Seizoenskaarten - Lente',
  slug: 'seizoenskaarten-lente',
  description: 'Prachtige botanische kaarten om de lente te vieren met je kinderen',
  longDescription: `Deze prachtige set seizoenskaarten helpt kinderen de wonderen van de lente te ontdekken. 
  
  Met botanisch accurate illustraties van lentebloemen, insecten en seizoensgebonden activiteiten, bieden deze kaarten een perfecte manier om kinderen te verbinden met de natuur.
  
  De set bevat:
  • 24 educatieve kaarten met botanische illustraties
  • Activiteitensuggesties voor elke kaart
  • Digitale downloadbare kleurplaten
  • Seizoenskalender voor kinderen
  • Tips voor ouders over natuureducatie`,
  price: 12.95,
  botanicalTheme: 'seasonal',
  ageRange: '3-5',
  category: 'Educatieve Kaarten',
  previewImages: [],
  features: [
    'Hoogwaardige digitale download',
    'Direct te printen op A4 formaat',
    'Inclusief activiteitengids',
    'Geschikt voor thuisonderwijs',
    'Watermark-vrije bestanden',
  ],
}

export default function ProductDetailPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // In real app, fetch product by slug
  if (params.slug !== mockProduct.slug) {
    notFound()
  }

  const placeholderImage = `https://placehold.co/800x1000/9CAA8B/FFFFFF?text=${encodeURIComponent(mockProduct.title)}`

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-sage-50">
              <Image
                src={placeholderImage}
                alt={mockProduct.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-sage-50">
                  <Image
                    src={`https://placehold.co/200x200/9CAA8B/FFFFFF?text=Preview+${i}`}
                    alt={`Preview ${i}`}
                    fill
                    className="object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-sage-500">{mockProduct.category}</span>
                <span className="text-sage-300">•</span>
                <span className="text-sm font-medium text-sage-500">Leeftijd {mockProduct.ageRange}</span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-sage-600 mb-4">
                {mockProduct.title}
              </h1>
              <p className="text-xl font-semibold text-sage-600 mb-4">
                {formatPrice(mockProduct.price)}
              </p>
              <p className="text-sage-500 whitespace-pre-line">
                {mockProduct.longDescription}
              </p>
            </div>

            {/* Features */}
            <Card className="p-6 bg-sage-50/50 border-sage-100">
              <h3 className="font-semibold text-sage-600 mb-3">Wat krijg je?</h3>
              <ul className="space-y-2">
                {mockProduct.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-sage-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-sage-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button size="lg" className="w-full">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Toevoegen aan Winkelwagen
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" size="lg" className="flex-1">
                  <Heart className="mr-2 h-5 w-5" />
                  Bewaren
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Share2 className="mr-2 h-5 w-5" />
                  Delen
                </Button>
              </div>
            </div>

            {/* Download Info */}
            <Card className="p-4 bg-earth-warm/30 border-sage-200">
              <div className="flex items-start gap-3">
                <Download className="h-5 w-5 text-sage-500 mt-0.5" />
                <div className="text-sm text-sage-600">
                  <p className="font-medium mb-1">Direct downloadbaar</p>
                  <p>Na aankoop ontvang je direct toegang tot alle bestanden</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-16 pt-16 border-t border-sage-100">
          <h2 className="font-serif text-2xl font-bold text-sage-600 mb-8">
            Misschien vind je dit ook leuk
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="relative aspect-[4/5] bg-sage-50">
                  <Image
                    src={`https://placehold.co/300x375/9CAA8B/FFFFFF?text=Product+${i}`}
                    alt={`Related product ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sage-600 mb-1">Related Product {i}</h3>
                  <p className="text-sage-500">{formatPrice(14.95)}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}