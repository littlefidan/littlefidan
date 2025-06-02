import Link from 'next/link'
import { Sparkles, Instagram, Mail, Heart, Download, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer className="bg-taupe-50 border-t border-taupe-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="rounded-full bg-primary p-2">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="font-script text-2xl text-primary">LittleFidan</span>
            </div>
            <p className="text-sm text-neutral-medium">
              Creatieve PDF downloads voor kinderen. Islamitische werkbladen, kleurplaten en educatieve activiteiten.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/littlefidan" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-full hover:opacity-90 transition-opacity"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="mailto:info@littlefidan.nl" 
                className="bg-mint-500 text-white p-2 rounded-full hover:bg-mint-600 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a 
                href="tel:+31612345678" 
                className="bg-babyblue-500 text-white p-2 rounded-full hover:bg-babyblue-600 transition-colors"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h3 className="font-semibold text-neutral-dark mb-4 flex items-center gap-2">
              <Download className="h-4 w-4 text-primary" />
              Producten
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=islamic" className="text-neutral-medium hover:text-primary text-sm transition-colors">
                  Islamitische Werkbladen
                </Link>
              </li>
              <li>
                <Link href="/products?category=coloring" className="text-neutral-medium hover:text-primary text-sm transition-colors">
                  Inkleurplaten
                </Link>
              </li>
              <li>
                <Link href="/products?category=worksheets" className="text-neutral-medium hover:text-primary text-sm transition-colors">
                  Educatieve Werkbladen
                </Link>
              </li>
              <li>
                <Link href="/products?category=seasonal" className="text-neutral-medium hover:text-primary text-sm transition-colors">
                  Seizoensactiviteiten
                </Link>
              </li>
              <li>
                <Link href="/products?category=letters" className="text-neutral-medium hover:text-primary text-sm transition-colors">
                  Letters & Cijfers
                </Link>
              </li>
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h3 className="font-semibold text-neutral-dark mb-4">Over LittleFidan</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-neutral-medium hover:text-primary text-sm transition-colors">
                  Over Ons
                </Link>
              </li>
              <li>
                <Link href="/voor-scholen" className="text-neutral-medium hover:text-primary text-sm transition-colors">
                  Voor Scholen
                </Link>
              </li>
              <li>
                <Link href="/instagram" className="text-neutral-medium hover:text-primary text-sm transition-colors">
                  Instagram Feed
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-neutral-medium hover:text-primary text-sm transition-colors">
                  Alle Producten
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="font-semibold text-neutral-dark mb-4">Klantenservice</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-neutral-medium hover:text-primary text-sm transition-colors">
                  Veelgestelde Vragen
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-medium hover:text-primary text-sm transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/account/downloads" className="text-neutral-medium hover:text-primary text-sm transition-colors">
                  Mijn Downloads
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-neutral-medium hover:text-primary text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-taupe-200">
              <p className="text-sm font-medium text-neutral-dark mb-2">Betaalmethoden</p>
              <div className="flex gap-2">
                <div className="bg-white rounded px-3 py-1 text-xs border border-taupe-200">iDEAL</div>
                <div className="bg-white rounded px-3 py-1 text-xs border border-taupe-200">PayPal</div>
                <div className="bg-white rounded px-3 py-1 text-xs border border-taupe-200">Card</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-taupe-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-neutral-medium">
            © 2024 LittleFidan. Alle rechten voorbehouden.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-sm text-neutral-medium hover:text-primary transition-colors">
              Algemene Voorwaarden
            </Link>
            <p className="text-sm text-neutral-medium flex items-center">
              Gemaakt met <Heart className="h-4 w-4 mx-1 text-accent-coral fill-current" /> in Nederland
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}