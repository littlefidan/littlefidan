import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Algemene Voorwaarden - LittleFidan',
  description: 'Algemene voorwaarden voor het gebruik van LittleFidan platform',
}

export default function TermsPage() {
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
            <span className="text-primary font-medium">Algemene Voorwaarden</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-8">
            Algemene Voorwaarden
          </h1>
          
          <div className="prose prose-neutral max-w-none">
            <p className="text-neutral-medium mb-6">
              Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">1. Algemeen</h2>
              <p className="mb-4">
                Deze algemene voorwaarden zijn van toepassing op alle overeenkomsten tussen LittleFidan 
                (hierna: "wij", "ons" of "LittleFidan") en de klant (hierna: "u" of "klant") met betrekking 
                tot de levering van digitale producten via onze website.
              </p>
              <p className="mb-4">
                Door het plaatsen van een bestelling of het downloaden van onze producten, 
                accepteert u deze algemene voorwaarden.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">2. Producten</h2>
              <p className="mb-4">
                LittleFidan biedt educatieve digitale downloads aan in PDF-formaat, waaronder:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Werkbladen voor kinderen</li>
                <li>Kleurplaten</li>
                <li>Educatieve activiteiten</li>
                <li>Islamitische leermaterialen</li>
                <li>Seizoensgebonden materialen</li>
              </ul>
              <p className="mb-4">
                Alle producten zijn uitsluitend voor persoonlijk gebruik en mogen niet worden 
                doorverkocht of commercieel worden gebruikt zonder onze uitdrukkelijke toestemming.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">3. Prijzen en Betaling</h2>
              <p className="mb-4">
                Alle prijzen zijn in euro's en inclusief BTW. Wij behouden ons het recht voor om 
                prijzen te wijzigen, maar bestellingen die al zijn geplaatst worden niet beïnvloed 
                door prijswijzigingen.
              </p>
              <p className="mb-4">
                Betaling geschiedt via de aangeboden betaalmethoden op onze website. Na succesvolle 
                betaling ontvangt u toegang tot de downloadlinks.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">4. Levering</h2>
              <p className="mb-4">
                Na succesvolle betaling ontvangt u direct toegang tot uw digitale producten via:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Een bevestigingsmail met downloadlinks</li>
                <li>Uw account op onze website onder "Mijn Downloads"</li>
              </ul>
              <p className="mb-4">
                Downloads zijn beschikbaar gedurende 30 dagen na aankoop. Zorg ervoor dat u uw 
                bestanden binnen deze periode downloadt en veilig opslaat.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">5. Herroepingsrecht</h2>
              <p className="mb-4">
                Volgens Europese wetgeving heeft u bij de aankoop van digitale content geen 
                herroepingsrecht zodra de download is gestart. Door akkoord te gaan met onze 
                voorwaarden en het starten van de download, doet u afstand van uw herroepingsrecht.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">6. Intellectueel Eigendom</h2>
              <p className="mb-4">
                Alle rechten op de producten, inclusief auteursrechten, blijven eigendom van 
                LittleFidan. U krijgt een persoonlijke, niet-overdraagbare licentie om de producten 
                te gebruiken voor persoonlijke, niet-commerciële doeleinden.
              </p>
              <p className="mb-4">
                Het is niet toegestaan om:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Producten door te verkopen of te distribueren</li>
                <li>Producten te wijzigen zonder toestemming</li>
                <li>Producten te gebruiken voor commerciële doeleinden</li>
                <li>Auteursrechtaanduidingen te verwijderen</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">7. Aansprakelijkheid</h2>
              <p className="mb-4">
                LittleFidan is niet aansprakelijk voor:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Technische storingen die het downloaden verhinderen</li>
                <li>Verlies van gedownloade bestanden op uw apparaat</li>
                <li>Onjuist gebruik van de producten</li>
              </ul>
              <p className="mb-4">
                Onze aansprakelijkheid is in alle gevallen beperkt tot het bedrag van uw bestelling.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">8. Privacy</h2>
              <p className="mb-4">
                Wij gaan zorgvuldig om met uw persoonsgegevens. Zie onze{' '}
                <Link href="/privacy" className="text-primary hover:text-primary-dark underline">
                  Privacyverklaring
                </Link>{' '}
                voor meer informatie over hoe wij uw gegevens verwerken.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">9. Geschillen</h2>
              <p className="mb-4">
                Op deze voorwaarden is Nederlands recht van toepassing. Bij geschillen proberen 
                we eerst samen tot een oplossing te komen. Lukt dit niet, dan worden geschillen 
                voorgelegd aan de bevoegde rechter in Nederland.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">10. Contact</h2>
              <p className="mb-4">
                Voor vragen over deze voorwaarden kunt u contact met ons opnemen via:
              </p>
              <ul className="list-none space-y-2">
                <li>Email: info@littlefidan.nl</li>
                <li>Website: www.littlefidan.nl</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">11. Wijzigingen</h2>
              <p className="mb-4">
                Wij behouden ons het recht voor deze algemene voorwaarden te wijzigen. 
                Wijzigingen worden op onze website gepubliceerd. Het is uw verantwoordelijkheid 
                om regelmatig de algemene voorwaarden te raadplegen.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}