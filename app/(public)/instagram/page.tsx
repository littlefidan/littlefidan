import Image from 'next/image'
import Link from 'next/link'
import { Instagram, Heart, MessageCircle, ShoppingBag, ExternalLink, Download, Sparkles, Grid3X3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import InstagramFeed from '@/components/instagram-feed'
import InstagramHero from '@/components/instagram-hero'

// Instagram posts with product links
const instagramPosts = [
  {
    id: '1',
    mediaUrl: 'https://placehold.co/400x400/A8D5BA/FFFFFF?text=Ramadan',
    caption: '🌙 Ramadan mubarak! Download onze nieuwe Ramadan werkboekjes vol leuke activiteiten voor de hele maand. #LittleFidan #RamadanActiviteiten',
    postType: 'post',
    likes: 342,
    comments: 28,
    linkedProductId: '1',
    linkedProductTitle: 'Ramadan Activiteitenboek',
    linkedProductSlug: 'ramadan-activiteitenboek',
    linkedProductPrice: '€14,95',
  },
  {
    id: '2',
    mediaUrl: 'https://placehold.co/400x600/B5D4E8/FFFFFF?text=Letters',
    caption: '✏️ Letters leren wordt een feestje met onze nieuwe werkbladen! Perfect voor thuis of in de klas. #LettersLeren',
    postType: 'post',
    likes: 289,
    comments: 15,
    linkedProductId: '2',
    linkedProductTitle: 'Nederlandse Letters Oefenen',
    linkedProductSlug: 'nederlandse-letters',
    linkedProductPrice: '€9,95',
  },
  {
    id: '3',
    mediaUrl: 'https://placehold.co/400x400/D4A574/FFFFFF?text=Eid',
    caption: '🎉 Eid Mubarak! Versier je huis met onze printbare Eid decoraties. Swipe voor inspiratie! #EidMubarak',
    postType: 'carousel',
    likes: 567,
    comments: 45,
    linkedProductId: '4',
    linkedProductTitle: 'Eid Decoratie Set',
    linkedProductSlug: 'eid-decoratie-set',
    linkedProductPrice: '€6,95',
  },
  {
    id: '4',
    mediaUrl: 'https://placehold.co/400x500/A89F91/FFFFFF?text=Lente',
    caption: '🌸 De lente is begonnen! Download onze lente kleurplaten en geniet van creatieve momenten met je kleintjes. #LenteActiviteiten',
    postType: 'post',
    likes: 198,
    comments: 12,
    linkedProductId: '3',
    linkedProductTitle: 'Lente Kleurboek',
    linkedProductSlug: 'lente-kleurboek',
    linkedProductPrice: '€8,95',
  },
  {
    id: '5',
    mediaUrl: 'https://placehold.co/400x400/E8A598/FFFFFF?text=Cijfers',
    caption: '🔢 Cijfers leren was nog nooit zo leuk! Check onze nieuwe cijfer werkbladen (link in bio) #CijfersLeren',
    postType: 'post',
    likes: 156,
    comments: 8,
    linkedProductId: '5',
    linkedProductTitle: 'Cijfers Oefenboek 1-20',
    linkedProductSlug: 'cijfers-oefenboek',
    linkedProductPrice: '€10,95',
  },
  {
    id: '6',
    mediaUrl: 'https://placehold.co/400x600/7B8471/FFFFFF?text=Islamic',
    caption: '🕌 Prachtige islamitische kleurplaten met geometrische patronen. Perfect voor rustige momenten. #IslamitischeKunst',
    postType: 'post',
    likes: 423,
    comments: 31,
    linkedProductId: '6',
    linkedProductTitle: 'Islamitische Kleurplaten',
    linkedProductSlug: 'islamitische-kleurplaten',
    linkedProductPrice: '€7,95',
  },
  {
    id: '7',
    mediaUrl: 'https://placehold.co/400x400/A3B88C/FFFFFF?text=Herfst',
    caption: '🍂 Herfst vibes! Nieuwe werkbladen met herfst thema nu beschikbaar. #HerfstActiviteiten',
    postType: 'post',
    likes: 234,
    comments: 19,
    linkedProductId: '7',
    linkedProductTitle: 'Herfst Werkbladen',
    linkedProductSlug: 'herfst-werkbladen',
    linkedProductPrice: '€9,95',
  },
  {
    id: '8',
    mediaUrl: 'https://placehold.co/400x500/B5D4E8/FFFFFF?text=Duas',
    caption: '🤲 Leer je kinderen belangrijke dua\'s met onze geïllustreerde dua kaarten. #DuasVoorKinderen',
    postType: 'post',
    likes: 512,
    comments: 42,
    linkedProductId: '8',
    linkedProductTitle: 'Dua\'s voor Kinderen',
    linkedProductSlug: 'duas-voor-kinderen',
    linkedProductPrice: '€11,95',
  },
  {
    id: '9',
    mediaUrl: 'https://placehold.co/400x400/FFD4B8/FFFFFF?text=Arabisch',
    caption: '📝 Arabisch alfabet leren met onze nieuwe werkboeken! Perfect voor beginners. #ArabischLeren',
    postType: 'post',
    likes: 389,
    comments: 26,
    linkedProductId: '2',
    linkedProductTitle: 'Arabisch Alfabet Werkboek',
    linkedProductSlug: 'arabisch-alfabet-werkboek',
    linkedProductPrice: '€12,95',
  },
]

const instagramStats = {
  followers: '15.2K',
  posts: '324',
  engagement: '8.7%',
}

export default async function InstagramPage() {
  const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
  
  // Get actual products to link with Instagram posts
  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, price')
    .eq('status', 'active')
    .limit(9)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <InstagramHero stats={instagramStats} />

      {/* Instagram Feed */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-bold text-sage-600 flex items-center gap-2">
              <Grid3X3 className="h-8 w-8 text-sage-500" />
              Onze Feed
            </h2>
            <Button variant="outline" size="sm" className="rounded-full" asChild>
              <a href="https://instagram.com/littlefidan" target="_blank" rel="noopener noreferrer">
                Bekijk meer
                <Instagram className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Instagram Grid */}
          <InstagramFeed posts={instagramPosts} products={products || []} />
        </div>
      </section>

      {/* Instagram Shop CTA */}
      <section className="py-16 bg-gradient-to-br from-mint-50 to-babyblue-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Sparkles className="h-12 w-12 text-accent-gold mx-auto mb-4" />
            <h2 className="font-serif text-3xl font-bold text-sage-600 mb-4">
              Shop Direct via Instagram
            </h2>
            <p className="text-lg text-sage-500 mb-8">
              Zie je iets leuks op onze Instagram? Alle producten zijn direct te downloaden! 
              Klik op de producttags in onze posts of gebruik de link in onze bio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-sage-500 hover:bg-sage-600 text-white rounded-full px-8"
                asChild
              >
                <Link href="/products">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Bekijk Alle Producten
                </Link>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-sage-500 text-sage-600 hover:bg-sage-50 rounded-full px-8"
                asChild
              >
                <a href="https://instagram.com/littlefidan" target="_blank" rel="noopener noreferrer">
                  <Instagram className="mr-2 h-5 w-5" />
                  Volg voor Kortingen
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* User Generated Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-sage-600 mb-4">
              Jullie Creaties 
            </h2>
            <p className="text-lg text-sage-500 max-w-2xl mx-auto">
              Tag ons met @littlefidan en #LittleFidan om jouw creatie hier te zien! 
              Elke week kiezen we onze favorieten.
            </p>
          </div>

          <div className="bg-sage-50 rounded-3xl p-8 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-2xl bg-white animate-pulse"></div>
              ))}
            </div>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 rounded-full"
              asChild
            >
              <a href="https://instagram.com/littlefidan" target="_blank" rel="noopener noreferrer">
                Tag Ons in Je Posts
                <Instagram className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}