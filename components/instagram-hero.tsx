'use client'

import { motion } from 'framer-motion'
import { Instagram, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface InstagramHeroProps {
  stats: {
    followers: string
    posts: string
    engagement: string
  }
}

export default function InstagramHero({ stats }: InstagramHeroProps) {
  return (
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
          <h1 className="font-serif text-5xl md:text-6xl text-sage-600 mb-4">
            @littlefidan
          </h1>
          <p className="text-lg text-sage-500 max-w-2xl mx-auto mb-8">
            Volg ons voor dagelijkse inspiratie, gratis downloads en 
            exclusieve kortingen op onze producten!
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-sage-600">{stats.followers}</p>
              <p className="text-sm text-sage-500">Volgers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-mint-500">{stats.posts}</p>
              <p className="text-sm text-sage-500">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-gold">{stats.engagement}</p>
              <p className="text-sm text-sage-500">Engagement</p>
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
  )
}