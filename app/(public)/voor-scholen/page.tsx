import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRightIcon, BuildingLibraryIcon, UserGroupIcon, DocumentTextIcon, CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Voor Scholen - LittleFidan',
  description: 'Speciale educatieve pakketten en tarieven voor scholen en onderwijsinstellingen.',
}

const benefits = [
  {
    icon: '💰',
    title: 'Volume Kortingen',
    description: 'Tot 40% korting bij afname van meerdere licenties'
  },
  {
    icon: '🏫',
    title: 'School Licenties',
    description: 'Onbeperkt printen en gebruiken binnen uw instelling'
  },
  {
    icon: '📚',
    title: 'Complete Pakketten',
    description: 'Samengestelde pakketten voor verschillende leeftijdsgroepen'
  },
  {
    icon: '🎯',
    title: 'Op Maat Gemaakt',
    description: 'Materialen afgestemd op uw curriculum en behoeften'
  },
  {
    icon: '📧',
    title: 'Direct Support',
    description: 'Persoonlijke ondersteuning via een dedicated contactpersoon'
  },
  {
    icon: '🔄',
    title: 'Updates Inbegrepen',
    description: 'Automatisch toegang tot nieuwe materialen en updates'
  }
]

const packages = [
  {
    name: 'Basis Pakket',
    price: '€149',
    period: 'per jaar',
    features: [
      'Toegang voor 1 klas (max 30 leerlingen)',
      '50+ werkbladen en activiteiten',
      'Maandelijkse nieuwe content',
      'Printrechten voor school gebruik',
      'Basis email support'
    ],
    color: 'mint'
  },
  {
    name: 'School Pakket',
    price: '€399',
    period: 'per jaar',
    features: [
      'Toegang voor hele school',
      '200+ werkbladen en activiteiten',
      'Wekelijkse nieuwe content',
      'Onbeperkt printen',
      'Priority email support',
      'Digitale certificaten voor leerlingen'
    ],
    popular: true,
    color: 'primary'
  },
  {
    name: 'Premium Pakket',
    price: 'Op aanvraag',
    period: 'custom',
    features: [
      'Meerdere scholen/locaties',
      'Volledige collectie + exclusieve content',
      'Aangepaste materialen mogelijk',
      'Persoonlijke accountmanager',
      'Training voor docenten',
      'Co-branding mogelijkheden'
    ],
    color: 'olive'
  }
]

export default function VoorScholenPage() {
  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-taupe-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-neutral-medium hover:text-primary">
              Home
            </Link>
            <ChevronRightIcon className="h-4 w-4 text-neutral-medium" />
            <span className="text-primary font-medium">Voor Scholen</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-olive-50 to-sage-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-soft mb-6">
              <BuildingLibraryIcon className="w-8 h-8 text-olive-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
              Educatieve Materialen voor Scholen
            </h1>
            <p className="text-lg text-neutral-medium mb-8">
              Verrijk uw curriculum met onze pedagogisch verantwoorde werkbladen en activiteiten. 
              Speciaal samengestelde pakketten voor basisscholen en kinderopvang.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary-600 text-white rounded-full">
                  Vraag Offerte Aan
                </Button>
              </Link>
              <Link href="#pakketten">
                <Button size="lg" variant="outline" className="rounded-full">
                  Bekijk Pakketten
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-primary text-center mb-12">
              Waarom Kiezen Scholen voor LittleFidan?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold text-primary mb-2">{benefit.title}</h3>
                  <p className="text-neutral-medium">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="pakketten" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-primary text-center mb-4">
              Kies het Pakket dat bij Uw School Past
            </h2>
            <p className="text-center text-neutral-medium mb-12 max-w-2xl mx-auto">
              Alle pakketten bevatten hoogwaardige PDF's die onbeperkt geprint kunnen worden binnen uw instelling.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <div 
                  key={index} 
                  className={`relative rounded-2xl p-8 ${
                    pkg.popular 
                      ? 'bg-gradient-to-br from-mint-50 to-sage-50 border-2 border-mint-300 shadow-xl' 
                      : 'bg-white border border-taupe-200 shadow-soft'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-mint-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Meest Gekozen
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-serif font-bold text-primary mb-2">{pkg.name}</h3>
                    <div className="text-3xl font-bold text-primary">
                      {pkg.price}
                      {pkg.period !== 'custom' && (
                        <span className="text-lg font-normal text-neutral-medium"> {pkg.period}</span>
                      )}
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-mint-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/contact">
                    <Button 
                      className={`w-full rounded-full ${
                        pkg.popular 
                          ? 'bg-primary hover:bg-primary-600 text-white' 
                          : 'bg-white hover:bg-neutral-50 text-primary border border-primary'
                      }`}
                    >
                      {pkg.price === 'Op aanvraag' ? 'Contact Opnemen' : 'Selecteer Pakket'}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-primary text-center mb-12">
              Wat Scholen Zeggen
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-soft p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-neutral-medium mb-4 italic">
                  "De werkbladen van LittleFidan zijn een waardevolle aanvulling op ons curriculum. 
                  De kinderen zijn enthousiast en de kwaliteit is uitstekend. Het scheelt ons veel 
                  tijd in voorbereiding."
                </p>
                <p className="font-semibold text-primary">Fatima B.</p>
                <p className="text-sm text-neutral-medium">Groepsleerkracht groep 3, Amsterdam</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-soft p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-neutral-medium mb-4 italic">
                  "Eindelijk educatief materiaal dat aansluit bij de diverse achtergronden van onze 
                  leerlingen. De islamitische werkbladen zijn vooral een uitkomst. Zeer tevreden!"
                </p>
                <p className="font-semibold text-primary">Ali K.</p>
                <p className="text-sm text-neutral-medium">Directeur basisschool, Rotterdam</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-gradient-to-br from-sage-50 to-mint-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-primary text-center mb-12">
              Hoe Het Werkt
            </h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-soft">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">Contact & Kennismaking</h3>
                  <p className="text-neutral-medium">
                    Neem contact op via het formulier of mail. We bespreken de behoeften van uw school.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-soft">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">Pakket Samenstellen</h3>
                  <p className="text-neutral-medium">
                    We stellen samen een pakket samen dat aansluit bij uw curriculum en leerlingen.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-soft">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">Toegang & Support</h3>
                  <p className="text-neutral-medium">
                    U krijgt direct toegang tot alle materialen en persoonlijke ondersteuning bij vragen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-serif font-bold text-primary mb-4">
              Klaar om te Beginnen?
            </h2>
            <p className="text-lg text-neutral-medium mb-8">
              Vraag vandaag nog een vrijblijvende offerte aan en ontdek hoe LittleFidan 
              uw onderwijs kan verrijken.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary-600 text-white rounded-full">
                  Vraag Offerte Aan
                  <ArrowRightIcon className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="rounded-full">
                  Bekijk Voorbeelden
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 pt-8 border-t border-taupe-200">
              <p className="text-sm text-neutral-medium">
                Direct contact? Mail naar{' '}
                <a href="mailto:scholen@littlefidan.nl" className="text-primary hover:text-primary-dark">
                  scholen@littlefidan.nl
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}