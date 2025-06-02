import Image from 'next/image'
import Link from 'next/link'
import { Leaf, Heart, Users, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sage-50 to-earth-warm py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mx-auto mb-8 flex items-center justify-center rounded-full bg-white p-4 shadow-soft w-fit">
              <Leaf className="h-10 w-10 text-sage-500" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-sage-600 mb-6">
              Het Verhaal van LittleFidan
            </h1>
            <p className="text-lg md:text-xl text-sage-500 leading-relaxed">
              Waar botanische wijsheid en bewust ouderschap samenkomen om een nieuwe generatie 
              natuurlijke denkers te inspireren
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-sage-600 mb-6">
                  Onze Missie
                </h2>
                <p className="text-sage-500 mb-4">
                  Bij LittleFidan geloven we dat kinderen het beste leren wanneer ze verbonden zijn 
                  met de natuur. Onze missie is om families te voorzien van prachtige, 
                  botanisch-geïnspireerde educatieve materialen die nieuwsgierigheid wekken en 
                  emotionele intelligentie ontwikkelen.
                </p>
                <p className="text-sage-500 mb-4">
                  We combineren de tijdloze wijsheid van de natuur met moderne pedagogische inzichten 
                  om content te creëren die zowel kinderen als ouders inspireert om samen te groeien.
                </p>
                <div className="font-script text-2xl text-accent-terracotta mt-6">
                  "Kleine zaadjes, grote dromen"
                </div>
              </div>
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-sage-50">
                <Image
                  src="https://placehold.co/600x750/9CAA8B/FFFFFF?text=Our+Mission"
                  alt="Our Mission"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-earth-base">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-sage-600 mb-4">
              Onze Waarden
            </h2>
            <p className="text-sage-500 max-w-2xl mx-auto">
              De principes die ons werk leiden en onze gemeenschap vormgeven
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center group hover:shadow-botanical transition-all duration-300">
              <CardContent className="p-8">
                <div className="mb-6 inline-flex rounded-full bg-sage-50 p-4 group-hover:bg-sage-100 transition-colors">
                  <Leaf className="h-8 w-8 text-sage-500" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-sage-600 mb-3">
                  Natuurlijke Wijsheid
                </h3>
                <p className="text-sage-500">
                  We putten inspiratie uit de natuur en haar seizoenen, en vertalen deze 
                  tijdloze lessen naar moderne educatieve ervaringen.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-botanical transition-all duration-300">
              <CardContent className="p-8">
                <div className="mb-6 inline-flex rounded-full bg-accent-blush p-4 group-hover:bg-accent-coral/20 transition-colors">
                  <Heart className="h-8 w-8 text-accent-terracotta" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-sage-600 mb-3">
                  Bewust Ouderschap
                </h3>
                <p className="text-sage-500">
                  We ondersteunen ouders in hun reis naar mindful opvoeding met tools 
                  die emotionele connectie en natuurlijk leren bevorderen.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-botanical transition-all duration-300">
              <CardContent className="p-8">
                <div className="mb-6 inline-flex rounded-full bg-earth-warm p-4 group-hover:bg-earth-sand transition-colors">
                  <Users className="h-8 w-8 text-sage-600" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-sage-600 mb-3">
                  Inclusieve Gemeenschap
                </h3>
                <p className="text-sage-500">
                  We vieren culturele diversiteit en creëren content die alle families 
                  verwelkomt, ongeacht hun achtergrond of tradities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-sage-600 mb-4">
                Hoe Het Begon
              </h2>
            </div>
            
            <div className="prose prose-sage max-w-none">
              <p className="text-lg text-sage-500 mb-6">
                LittleFidan ontstond uit een simpele observatie: in onze drukke, digitale wereld 
                verliezen kinderen steeds meer het contact met de natuur. Als moeder en educator 
                zag ik hoe mijn eigen kinderen tot rust kwamen en opbloeiden wanneer ze tijd 
                doorbrachten in de tuin, bladeren verzamelden, of gewoon de seizoenen observeerden.
              </p>
              
              <p className="text-lg text-sage-500 mb-6">
                Wat begon als zelfgemaakte activiteiten voor mijn eigen gezin, groeide uit tot een 
                Instagram-gemeenschap van gelijkgestemde ouders die op zoek waren naar betekenisvolle, 
                natuurgeïnspireerde manieren om met hun kinderen te verbinden.
              </p>
              
              <p className="text-lg text-sage-500 mb-6">
                Vandaag de dag is LittleFidan uitgegroeid tot een platform dat duizenden families 
                helpt om de wonderen van de natuur te integreren in hun dagelijks leven, met 
                educatieve materialen die zowel mooi als betekenisvol zijn.
              </p>
              
              <div className="bg-sage-50 rounded-3xl p-8 my-8">
                <p className="text-center font-script text-2xl text-accent-terracotta mb-4">
                  "Fidan betekent 'jong plantje' in het Turks"
                </p>
                <p className="text-center text-sage-600">
                  Een perfecte metafoor voor hoe we onze kinderen zien: kleine zaadjes vol potentieel, 
                  die met de juiste zorg en aandacht kunnen uitgroeien tot prachtige, unieke individuen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-earth-base to-earth-warm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-sage-600 mb-12">
              Het Team Achter LittleFidan
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-sage-100">
                  <Image
                    src="https://placehold.co/300x300/9CAA8B/FFFFFF?text=Founder"
                    alt="Founder"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold text-sage-600 mb-1">Oprichter</h3>
                <p className="text-sm text-sage-500">Creatief & Educatief</p>
              </div>
              
              <div>
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-sage-100">
                  <Image
                    src="https://placehold.co/300x300/D4A786/FFFFFF?text=Designer"
                    alt="Designer"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold text-sage-600 mb-1">Lead Designer</h3>
                <p className="text-sm text-sage-500">Visuele Magie</p>
              </div>
              
              <div>
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-sage-100">
                  <Image
                    src="https://placehold.co/300x300/E8B4A0/FFFFFF?text=Educator"
                    alt="Educator"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold text-sage-600 mb-1">Hoofd Pedagogiek</h3>
                <p className="text-sm text-sage-500">Educatieve Expertise</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 inline-flex rounded-full bg-sage-50 p-3">
              <BookOpen className="h-8 w-8 text-sage-500" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-sage-600 mb-6">
              Word Deel van Onze Gemeenschap
            </h2>
            <p className="text-lg text-sage-500 mb-8">
              Sluit je aan bij duizenden families die kiezen voor natuurlijk leren en 
              bewust ouderschap. Samen creëren we een wereld waarin kinderen opgroeien 
              met liefde voor de natuur en zichzelf.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/products">
                  Ontdek Onze Producten
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">
                  Neem Contact Op
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}