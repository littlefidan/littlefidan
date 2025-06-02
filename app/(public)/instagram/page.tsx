'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Instagram, Heart, MessageCircle, ShoppingBag, ExternalLink, Download, Sparkles, Grid3X3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Mock Instagram data - replace with Instagram Graph API
const mockInstagramPosts = [
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

export default function InstagramPage() {
  const [hoveredPost, setHoveredPost] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-100 to-pink-100 py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mx-auto mb-6 flex items-center justify-center">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-1 rounded-full">
                <div className="bg-white p-6 rounded-full">
                  <Instagram className="h-12 w-12 text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text" />
                </div>
              </div>
            </div>
            <h1 className="font-script text-5xl md:text-6xl text-neutral-dark mb-4">
              @littlefidan
            </h1>
            <p className="text-lg text-neutral-medium max-w-2xl mx-auto mb-8">
              Volg ons voor dagelijkse inspiratie, gratis downloads en 
              exclusieve kortingen op onze producten!
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{instagramStats.followers}</p>
                <p className="text-sm text-neutral-medium">Volgers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-mint-500">{instagramStats.posts}</p>
                <p className="text-sm text-neutral-medium">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-accent-gold">{instagramStats.engagement}</p>
                <p className="text-sm text-neutral-medium">Engagement</p>
              </div>
            </div>

            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 rounded-full px-8"
              asChild
            >
              <a href="https://instagram.com/littlefidan" target="_blank" rel="noopener noreferrer">
                Volg ons op Instagram
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-bold text-neutral-dark flex items-center gap-2">
              <Grid3X3 className="h-8 w-8 text-primary" />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockInstagramPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredPost(post.id)}
                onMouseLeave={() => setHoveredPost(null)}
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <Image
                    src={post.mediaUrl}
                    alt={post.caption}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
                    hoveredPost === post.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="absolute inset-0 flex flex-col justify-between p-4">
                      {/* Stats */}
                      <div className="flex items-center justify-center gap-6 text-white">
                        <div className="flex items-center gap-2">
                          <Heart className="h-6 w-6 fill-current" />
                          <span className="font-medium">{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-6 w-6 fill-current" />
                          <span className="font-medium">{post.comments}</span>
                        </div>
                      </div>
                      
                      {/* Product Link */}
                      {post.linkedProductId && (
                        <Link href={`/products/${post.linkedProductSlug}`}>
                          <div className="bg-white rounded-xl p-3 hover:shadow-lg transition-all transform hover:scale-105">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-lg">
                                  <ShoppingBag className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-neutral-dark line-clamp-1">
                                    {post.linkedProductTitle}
                                  </p>
                                  <p className="text-lg font-bold text-primary">{post.linkedProductPrice}</p>
                                </div>
                              </div>
                              <Download className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Post Type Badge */}
                  {post.postType === 'carousel' && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <Grid3X3 className="h-4 w-4 text-neutral-dark" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Shop CTA */}
      <section className="py-16 bg-gradient-to-br from-mint-50 to-babyblue-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <Sparkles className="h-12 w-12 text-accent-gold mx-auto mb-4" />
            <h2 className="font-serif text-3xl font-bold text-neutral-dark mb-4">
              Shop Direct via Instagram
            </h2>
            <p className="text-lg text-neutral-medium mb-8">
              Zie je iets leuks op onze Instagram? Alle producten zijn direct te downloaden! 
              Klik op de producttags in onze posts of gebruik de link in onze bio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary-600 text-white rounded-full px-8"
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
                className="border-2 border-primary text-primary hover:bg-primary-50 rounded-full px-8"
                asChild
              >
                <a href="https://instagram.com/littlefidan" target="_blank" rel="noopener noreferrer">
                  <Instagram className="mr-2 h-5 w-5" />
                  Volg voor Kortingen
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* User Generated Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl font-bold text-neutral-dark mb-4">
              Jullie Creaties 
            </h2>
            <p className="text-lg text-neutral-medium max-w-2xl mx-auto">
              Tag ons met @littlefidan en #LittleFidan om jouw creatie hier te zien! 
              Elke week kiezen we onze favorieten.
            </p>
          </motion.div>

          <div className="bg-taupe-50 rounded-3xl p-8 text-center">
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