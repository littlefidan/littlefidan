import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Privacyverklaring - LittleFidan',
  description: 'Privacyverklaring voor het gebruik van LittleFidan platform',
}

export default function PrivacyPage() {
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
            <span className="text-primary font-medium">Privacyverklaring</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-8">
            Privacyverklaring
          </h1>
          
          <div className="prose prose-neutral max-w-none">
            <p className="text-neutral-medium mb-6">
              Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">1. Inleiding</h2>
              <p className="mb-4">
                LittleFidan respecteert de privacy van alle gebruikers van haar website en zorgt 
                ervoor dat de persoonlijke informatie die u ons verschaft vertrouwelijk wordt behandeld. 
                Wij gebruiken uw gegevens om bestellingen zo snel en gemakkelijk mogelijk te laten verlopen.
              </p>
              <p className="mb-4">
                Deze privacyverklaring is van toepassing op alle diensten van LittleFidan. Door gebruik 
                te maken van deze website geeft u aan de privacyverklaring te accepteren.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">2. Welke gegevens verzamelen wij?</h2>
              <p className="mb-4">
                Bij het gebruik van onze website kunnen wij de volgende gegevens van u verzamelen:
              </p>
              
              <h3 className="text-xl font-semibold text-primary mb-3">2.1 Account gegevens</h3>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Naam en achternaam</li>
                <li>E-mailadres</li>
                <li>Wachtwoord (versleuteld opgeslagen)</li>
                <li>Telefoonnummer (optioneel)</li>
              </ul>

              <h3 className="text-xl font-semibold text-primary mb-3">2.2 Bestelgegevens</h3>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Factuuradres</li>
                <li>Betaalgegevens (via beveiligde betaalprovider)</li>
                <li>Bestelhistorie</li>
                <li>Downloadgeschiedenis</li>
              </ul>

              <h3 className="text-xl font-semibold text-primary mb-3">2.3 Technische gegevens</h3>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>IP-adres</li>
                <li>Browser type en versie</li>
                <li>Tijdzone instellingen</li>
                <li>Besturingssysteem</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">3. Waarvoor gebruiken wij uw gegevens?</h2>
              <p className="mb-4">
                Wij gebruiken uw gegevens voor de volgende doeleinden:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Het verwerken van uw bestellingen</li>
                <li>Het versturen van downloadlinks</li>
                <li>Het bijhouden van uw downloadrechten</li>
                <li>Het versturen van nieuwsbrieven (alleen met uw toestemming)</li>
                <li>Het verbeteren van onze website en diensten</li>
                <li>Het naleven van wettelijke verplichtingen</li>
                <li>Het voorkomen van fraude</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">4. Hoe lang bewaren wij uw gegevens?</h2>
              <p className="mb-4">
                Wij bewaren uw gegevens niet langer dan strikt nodig is om de doelen te realiseren 
                waarvoor uw gegevens worden verzameld:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Accountgegevens: zolang u een actief account heeft</li>
                <li>Bestelgegevens: 7 jaar vanwege fiscale verplichtingen</li>
                <li>Nieuwsbrief gegevens: tot u zich uitschrijft</li>
                <li>Technische gegevens: maximaal 1 jaar</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">5. Met wie delen wij uw gegevens?</h2>
              <p className="mb-4">
                Wij delen uw gegevens alleen met derde partijen als dit noodzakelijk is voor onze dienstverlening:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li><strong>Betaalproviders:</strong> Voor het verwerken van betalingen</li>
                <li><strong>Hostingproviders:</strong> Voor het opslaan van gegevens</li>
                <li><strong>E-mailservices:</strong> Voor het versturen van e-mails</li>
              </ul>
              <p className="mb-4">
                Deze partijen zijn verplicht om uw gegevens vertrouwelijk te behandelen. Wij verkopen 
                uw gegevens nooit aan derden.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">6. Cookies</h2>
              <p className="mb-4">
                LittleFidan gebruikt cookies om uw ervaring op onze website te verbeteren. Cookies zijn 
                kleine tekstbestanden die op uw computer worden opgeslagen. Wij gebruiken:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li><strong>Functionele cookies:</strong> Noodzakelijk voor het functioneren van de website</li>
                <li><strong>Analytische cookies:</strong> Om het gebruik van de website te analyseren</li>
                <li><strong>Marketing cookies:</strong> Alleen met uw toestemming</li>
              </ul>
              <p className="mb-4">
                U kunt cookies uitschakelen in uw browserinstellingen, maar dit kan de functionaliteit 
                van de website beperken.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">7. Beveiliging</h2>
              <p className="mb-4">
                Wij nemen de bescherming van uw gegevens serieus en hebben passende technische en 
                organisatorische maatregelen genomen om misbruik, verlies, onbevoegde toegang, 
                ongewenste openbaarmaking en ongeoorloofde wijziging tegen te gaan:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>SSL-encryptie voor alle dataoverdracht</li>
                <li>Veilige opslag van wachtwoorden</li>
                <li>Regelmatige beveiligingsupdates</li>
                <li>Beperkte toegang tot persoonsgegevens</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">8. Uw rechten</h2>
              <p className="mb-4">
                Onder de AVG heeft u de volgende rechten:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li><strong>Recht op inzage:</strong> U kunt opvragen welke gegevens wij van u hebben</li>
                <li><strong>Recht op rectificatie:</strong> U kunt onjuiste gegevens laten corrigeren</li>
                <li><strong>Recht op verwijdering:</strong> U kunt verzoeken uw gegevens te verwijderen</li>
                <li><strong>Recht op beperking:</strong> U kunt de verwerking van uw gegevens beperken</li>
                <li><strong>Recht op dataportabiliteit:</strong> U kunt uw gegevens opvragen in een leesbaar formaat</li>
                <li><strong>Recht op bezwaar:</strong> U kunt bezwaar maken tegen de verwerking van uw gegevens</li>
              </ul>
              <p className="mb-4">
                Om deze rechten uit te oefenen kunt u contact met ons opnemen via info@littlefidan.nl.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">9. Kinderen</h2>
              <p className="mb-4">
                Onze website is gericht op ouders en opvoeders. Wij verzamelen niet bewust 
                persoonlijke gegevens van kinderen onder de 16 jaar. Als u ervan overtuigd bent 
                dat wij zonder toestemming persoonlijke gegevens hebben verzameld van een minderjarige, 
                neem dan contact met ons op via info@littlefidan.nl.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">10. Wijzigingen</h2>
              <p className="mb-4">
                LittleFidan behoudt zich het recht voor om wijzigingen aan te brengen in deze 
                privacyverklaring. Het is daarom aan te raden om deze privacyverklaring regelmatig 
                te raadplegen. Wijzigingen worden op deze pagina gepubliceerd.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">11. Contact</h2>
              <p className="mb-4">
                Als u vragen heeft over deze privacyverklaring of over hoe wij met uw gegevens omgaan, 
                neem dan contact met ons op:
              </p>
              <ul className="list-none space-y-2">
                <li><strong>LittleFidan</strong></li>
                <li>Email: info@littlefidan.nl</li>
                <li>Website: www.littlefidan.nl</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">12. Klachten</h2>
              <p className="mb-4">
                Mocht u een klacht hebben over de verwerking van uw persoonsgegevens, dan vragen 
                wij u hierover direct contact met ons op te nemen. Komen wij er samen niet uit, 
                dan heeft u het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}