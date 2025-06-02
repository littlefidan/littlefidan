'use client'

import { motion } from 'framer-motion'
import { Sparkles, Heart, Star, Download, Palette, Sun, Moon, Cloud, Flower2, Instagram, Zap, Gift } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const products = [
  {
    title: 'Ramadan Werkboekje',
    category: 'Islamitisch',
    price: '€12,95',
    image: 'https://placehold.co/400x500/A8D5BA/FFFFFF?text=Ramadan',
    badge: 'Bestseller',
    color: 'bg-mint-100',
  },
  {
    title: 'Lente Kleurplaten',
    category: 'Seizoenen',
    price: '€8,95',
    image: 'https://placehold.co/400x500/B5D4E8/FFFFFF?text=Lente',
    badge: 'Nieuw',
    color: 'bg-babyblue-100',
  },
  {
    title: 'Arabisch Alfabet',
    category: 'Taal & Letters',
    price: '€14,95',
    image: 'https://placehold.co/400x500/A89F91/FFFFFF?text=Arabisch',
    badge: 'Populair',
    color: 'bg-taupe-100',
  },
  {
    title: 'Eid Decoraties',
    category: 'Feestdagen',
    price: '€6,95',
    image: 'https://placehold.co/400x500/7B8471/FFFFFF?text=Eid',
    badge: 'Limited',
    color: 'bg-olive-100',
  },
  {
    title: 'Cijfer Oefeningen',
    category: 'Educatief',
    price: '€10,95',
    image: 'https://placehold.co/400x500/D4A574/FFFFFF?text=Cijfers',
    badge: 'Educatief',
    color: 'bg-accent-gold/20',
  },
  {
    title: 'Dua\'s voor Kids',
    category: 'Islamitisch',
    price: '€9,95',
    image: 'https://placehold.co/400x500/E8A598/FFFFFF?text=Duas',
    badge: 'Favoriet',
    color: 'bg-accent-coral/20',
  },
]

const features = [
  {
    icon: Download,
    title: 'Direct Download',
    description: 'PDF\'s direct in je inbox',
    color: 'text-babyblue-600',
    bgColor: 'bg-babyblue-50',
  },
  {
    icon: Palette,
    title: 'Prachtige Designs',
    description: 'Professioneel ontworpen',
    color: 'text-mint-600',
    bgColor: 'bg-mint-50',
  },
  {
    icon: Gift,
    title: 'Nieuwe Content',
    description: 'Wekelijks nieuwe producten',
    color: 'text-accent-gold',
    bgColor: 'bg-accent-gold/10',
  },
  {
    icon: Zap,
    title: 'Print & Klaar',
    description: 'Geen voorbereiding nodig',
    color: 'text-olive-600',
    bgColor: 'bg-olive-50',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Product Focused */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-sage-50 via-mint-50 to-baby-blue-50">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-30"
              style={{
                background: i % 2 === 0 ? '#B8E4D0' : '#87CEEB',
                width: `${Math.random() * 400 + 200}px`,
                height: `${Math.random() * 400 + 200}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, 30, -30, 0],
                y: [0, -30, 30, 0],
              }}
              transition={{
                duration: 20 + i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Logo/Brand */}
            <motion.h1 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="font-script text-7xl md:text-8xl bg-gradient-to-r from-olive to-sage bg-clip-text text-transparent mb-2"
            >
              LittleFidan
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-olive font-medium text-lg mb-8"
            >
              Creatieve PDF Downloads voor Kinderen
            </motion.p>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-serif text-3xl md:text-5xl font-bold text-taupe-700 mb-6 leading-tight"
            >
              Printbare <span className="text-olive">Werkbladen</span> & <span className="text-sage">Kleurplaten</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-taupe-600 mb-10 max-w-2xl mx-auto"
            >
              Van Islamitische thema\'s tot seizoensactiviteiten. Professioneel ontworpen, 
              direct te downloaden en printen.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 justify-center mb-12"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-olive to-sage hover:opacity-90 text-white px-8 py-6 text-lg rounded-full shadow-lg"
                asChild
              >
                <Link href="/products">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Bekijk Alle Producten
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-sage-400 text-sage-700 hover:bg-sage-50 px-8 py-6 text-lg rounded-full"
                asChild
              >
                <Link href="/contact">
                  <Heart className="mr-2 h-5 w-5" />
                  Contact Opnemen
                </Link>
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-8 text-sm text-taupe-600"
            >
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-accent-gold" />
                <span>4.9/5 Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-babyblue-500" />
                <span>10K+ Downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-primary" />
                <span>15K Volgers</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className={`${feature.bgColor} rounded-2xl p-6 hover:shadow-md transition-shadow`}>
                    <Icon className={`h-10 w-10 ${feature.color} mx-auto mb-4`} />
                    <h3 className="font-bold text-lg mb-2 text-neutral-dark">{feature.title}</h3>
                    <p className="text-neutral-medium text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-20 bg-neutral-light">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-neutral-dark mb-4">
              Populaire <span className="text-primary">Downloads</span>
            </h2>
            <p className="text-lg text-neutral-medium max-w-2xl mx-auto">
              Ontdek onze meest geliefde werkbladen en kleurplaten
            </p>
          </motion.div>

          {/* Product Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {products.map((product, index) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <div className={`absolute inset-0 ${product.color} opacity-30`}></div>
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-neutral-dark">
                        {product.badge}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-neutral-medium mb-1">{product.category}</p>
                    <h3 className="font-bold text-xl mb-2 text-neutral-dark">{product.title}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-2xl font-bold text-primary">{product.price}</p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-accent-gold text-accent-gold" />
                        ))}
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-olive to-sage hover:opacity-90 text-white rounded-full">
                      <Download className="mr-2 h-4 w-4" />
                      Direct Downloaden
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary-50 rounded-full px-8"
              asChild
            >
              <Link href="/products">
                Bekijk Alle Producten
                <Sparkles className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-br from-mint-50 to-babyblue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-neutral-dark mb-4">
              Blader door <span className="text-primary">Categorieën</span>
            </h2>
            <p className="text-lg text-neutral-medium max-w-2xl mx-auto">
              Vind precies wat je zoekt in onze uitgebreide collectie
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Islamitische Werkbladen', icon: Moon, color: 'bg-olive-100 text-olive-600' },
              { name: 'Kleurplaten', icon: Palette, color: 'bg-mint-100 text-mint-600' },
              { name: 'Seizoensactiviteiten', icon: Sun, color: 'bg-accent-gold/20 text-accent-gold' },
              { name: 'Letters & Cijfers', icon: Zap, color: 'bg-babyblue-100 text-babyblue-600' },
              { name: 'Feestdagen', icon: Gift, color: 'bg-accent-coral/20 text-accent-coral' },
              { name: 'Educatieve Werkbladen', icon: Star, color: 'bg-taupe-100 text-taupe-600' },
            ].map((category, index) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/products?category=${category.name.toLowerCase().replace(/ /g, '-')}`}>
                    <div className={`${category.color} rounded-2xl p-8 text-center hover:shadow-lg transition-all cursor-pointer`}>
                      <Icon className="h-12 w-12 mx-auto mb-4" />
                      <h3 className="font-bold text-xl">{category.name}</h3>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Instagram className="h-8 w-8 text-primary" />
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-neutral-dark">
                @littlefidan
              </h2>
            </div>
            <p className="text-lg text-neutral-medium">
              Volg ons voor dagelijkse inspiratie en gratis downloads
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <Image
                    src={`https://placehold.co/300x300/A8D5BA/FFFFFF?text=Post+${i}`}
                    alt={`Instagram post ${i}`}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 rounded-full px-8"
                asChild
              >
                <Link href="https://instagram.com/littlefidan" target="_blank">
                  Volg ons op Instagram
                  <Instagram className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-cream-50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-neutral-dark mb-6">
              Begin Vandaag met Downloaden
            </h2>
            <p className="text-xl text-neutral-medium mb-10">
              Duizenden ouders vertrouwen op LittleFidan voor educatieve en creatieve content
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-olive to-sage hover:opacity-90 text-white px-8 py-6 text-lg rounded-full shadow-lg"
                asChild
              >
                <Link href="/products">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Shop Producten
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-primary text-primary hover:bg-primary-50 px-8 py-6 text-lg rounded-full"
                asChild
              >
                <Link href="/contact">
                  <Heart className="mr-2 h-5 w-5" />
                  Contact
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}