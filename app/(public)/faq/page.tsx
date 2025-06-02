'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle, Download, ShoppingBag, Users, Mail } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  // Bestellingen & Betaling
  {
    category: 'orders',
    question: 'Hoe plaats ik een bestelling?',
    answer: 'Het plaatsen van een bestelling is heel eenvoudig! Voeg de gewenste producten toe aan je winkelwagen door op "Toevoegen" te klikken. Ga naar je winkelwagen, controleer je bestelling en klik op "Afrekenen". Vul je gegevens in en kies je betaalmethode. Na succesvolle betaling ontvang je direct toegang tot je downloads.'
  },
  {
    category: 'orders',
    question: 'Welke betaalmethoden accepteren jullie?',
    answer: 'We accepteren alle gangbare betaalmethoden via Mollie: iDEAL (voor Nederlandse klanten), Bancontact (voor Belgische klanten), creditcard (Visa, Mastercard, American Express), PayPal, en SEPA-overboeking. Alle betalingen worden veilig verwerkt via Mollie.'
  },
  {
    category: 'orders',
    question: 'Kan ik een factuur krijgen voor mijn bestelling?',
    answer: 'Ja, natuurlijk! Na je bestelling ontvang je automatisch een factuur per e-mail. Je kunt ook altijd inloggen op je account en daar al je facturen terugvinden onder "Mijn Bestellingen". Voor zakelijke klanten kunnen we facturen met BTW-nummer opstellen.'
  },
  {
    category: 'orders',
    question: 'Bieden jullie kortingen voor grote bestellingen?',
    answer: 'Voor scholen en educatieve instellingen bieden we speciale tarieven. Neem contact met ons op via partners@littlefidan.nl voor een offerte op maat. We hebben ook regelmatig seizoensacties - schrijf je in voor onze nieuwsbrief om op de hoogte te blijven!'
  },

  // Downloads & Gebruik
  {
    category: 'downloads',
    question: 'Hoe download ik mijn gekochte producten?',
    answer: 'Direct na je betaling ontvang je een e-mail met downloadlinks. Je kunt ook inloggen op je account en naar "Mijn Downloads" gaan. Daar vind je al je gekochte producten. Klik op "Download" en het bestand wordt opgeslagen op je apparaat. Downloads zijn 30 dagen geldig en je kunt elk product maximaal 5 keer downloaden.'
  },
  {
    category: 'downloads',
    question: 'In welk formaat zijn de producten?',
    answer: 'Alle producten worden geleverd als hoogwaardige PDF-bestanden, perfect voor printen op A4-formaat. Sommige producten bevatten ook extra bonusmateriaal zoals kleurplaten in PNG-formaat. De bestanden zijn geoptimaliseerd voor zowel thuisgebruik als professioneel printen.'
  },
  {
    category: 'downloads',
    question: 'Kan ik de producten meerdere keren printen?',
    answer: 'Ja! Voor persoonlijk gebruik mag je de producten zo vaak printen als je wilt. Dit geldt voor gebruik in je eigen gezin of klaslokaal. Het is niet toegestaan om de digitale bestanden te delen of door te verkopen. Zie onze licentievoorwaarden voor meer details.'
  },
  {
    category: 'downloads',
    question: 'Wat als mijn download niet werkt?',
    answer: 'Geen zorgen! Controleer eerst je spam-folder voor de downloadmail. Probeer ook een andere browser of apparaat. Werkt het nog steeds niet? Stuur ons een e-mail naar support@littlefidan.nl met je ordernummer en we helpen je direct. We reageren binnen 24 uur op werkdagen.'
  },

  // Educatief & Scholen
  {
    category: 'education',
    question: 'Zijn jullie producten geschikt voor scholen?',
    answer: 'Absoluut! Onze producten zijn ontwikkeld door onderwijsprofessionals en sluiten aan bij ontwikkelingsdoelen. Ze zijn perfect voor gebruik in het klaslokaal, BSO, of voor thuisonderwijs. Neem contact met ons op voor speciale tarieven voor scholen.'
  },
  {
    category: 'education',
    question: 'Bieden jullie workshops of trainingen aan?',
    answer: 'Ja, we bieden online workshops voor onderwijsteams over het integreren van natuurlijk leren in het curriculum. Ook organiseren we seizoensgebonden webinars voor ouders. Scholen met een abonnement krijgen korting op trainingen. Mail naar workshops@littlefidan.nl voor meer informatie.'
  },
  {
    category: 'education',
    question: 'Voor welke leeftijden zijn de producten geschikt?',
    answer: 'Onze producten zijn ingedeeld in leeftijdscategorieën: 3-5 jaar (kleuters), 6-8 jaar (onderbouw), 9-12 jaar (bovenbouw), en "alle leeftijden" voor gezinsactiviteiten. Bij elk product staat duidelijk aangegeven voor welke leeftijd het geschikt is. Veel activiteiten kunnen aangepast worden voor verschillende niveaus.'
  },

  // Account & Privacy
  {
    category: 'account',
    question: 'Hoe maak ik een account aan?',
    answer: 'Klik rechtsboven op "Account" en kies "Registreren". Vul je e-mailadres en wachtwoord in. Je kunt ook inloggen met je Google of Apple account. Een account is gratis en geeft je toegang tot je downloads, ordergeschiedenis en wishlist.'
  },
  {
    category: 'account',
    question: 'Hoe veilig zijn mijn gegevens?',
    answer: 'We nemen privacy zeer serieus. Al je persoonlijke gegevens worden versleuteld opgeslagen en we delen nooit informatie met derden zonder jouw toestemming. We voldoen aan alle GDPR-richtlijnen. Betalingen worden veilig verwerkt via Mollie, wij slaan geen creditcardgegevens op.'
  },
  {
    category: 'account',
    question: 'Kan ik mijn account delen met anderen?',
    answer: 'Accounts zijn persoonlijk en mogen niet gedeeld worden. Voor gezinnen is één account voldoende - je mag de gedownloade materialen gebruiken voor je hele gezin. Scholen kunnen contact met ons opnemen voor aangepaste licenties.'
  },
]

const categories = [
  { id: 'orders', label: 'Bestellingen & Betaling', icon: ShoppingBag },
  { id: 'downloads', label: 'Downloads & Gebruik', icon: Download },
  { id: 'education', label: 'Educatief & Scholen', icon: Users },
  { id: 'account', label: 'Account & Privacy', icon: HelpCircle },
]

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('orders')
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const filteredFAQs = faqData.filter(item => item.category === selectedCategory)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sage-50 to-earth-warm py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="mx-auto mb-6 flex items-center justify-center rounded-full bg-white p-3 shadow-soft w-fit">
              <HelpCircle className="h-8 w-8 text-sage-500" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-sage-600 mb-4">
              Veelgestelde Vragen
            </h1>
            <p className="text-lg text-sage-500">
              Vind snel antwoorden op de meest gestelde vragen over onze producten, 
              bestellingen en diensten
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          {/* Category Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                  <span className="sm:hidden">{category.label.split(' ')[0]}</span>
                </Button>
              )
            })}
          </div>

          {/* FAQ Items */}
          <div className="max-w-3xl mx-auto space-y-4">
            {filteredFAQs.map((item, index) => {
              const isOpen = openItems.includes(index)
              return (
                <Card key={index} className="overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full text-left p-6 hover:bg-sage-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-semibold text-sage-600 pr-2">
                        {item.question}
                      </h3>
                      <ChevronDown 
                        className={cn(
                          "h-5 w-5 text-sage-400 flex-shrink-0 transition-transform duration-200",
                          isOpen && "rotate-180"
                        )}
                      />
                    </div>
                  </button>
                  <div className={cn(
                    "overflow-hidden transition-all duration-300",
                    isOpen ? "max-h-96" : "max-h-0"
                  )}>
                    <CardContent className="pt-0 pb-6">
                      <p className="text-sage-500 leading-relaxed">
                        {item.answer}
                      </p>
                    </CardContent>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Still need help? */}
          <Card className="max-w-3xl mx-auto mt-12 bg-earth-base border-sage-200">
            <CardContent className="p-8 text-center">
              <Mail className="h-12 w-12 text-sage-500 mx-auto mb-4" />
              <h2 className="font-serif text-2xl font-semibold text-sage-600 mb-3">
                Staat je vraag er niet bij?
              </h2>
              <p className="text-sage-500 mb-6">
                Geen probleem! Ons support team staat klaar om je te helpen met al je vragen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <a href="/contact">Stel je vraag</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="mailto:support@littlefidan.nl">
                    support@littlefidan.nl
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}