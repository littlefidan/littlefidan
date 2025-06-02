'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, ShoppingBag, Download, Grid3X3 } from 'lucide-react'

interface InstagramPost {
  id: string
  mediaUrl: string
  caption: string
  postType: string
  likes: number
  comments: number
  linkedProductId?: string
  linkedProductTitle?: string
  linkedProductSlug?: string
  linkedProductPrice?: string
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
}

interface InstagramFeedProps {
  posts: InstagramPost[]
  products: Product[]
}

export default function InstagramFeed({ posts, products }: InstagramFeedProps) {
  const [hoveredPost, setHoveredPost] = useState<string | null>(null)

  // Map products to posts if not already linked
  const postsWithProducts = posts.map((post, index) => {
    if (!post.linkedProductId && products[index]) {
      return {
        ...post,
        linkedProductId: products[index].id,
        linkedProductTitle: products[index].name,
        linkedProductSlug: products[index].slug,
        linkedProductPrice: `€${products[index].price.toFixed(2).replace('.', ',')}`
      }
    }
    return post
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {postsWithProducts.map((post, index) => (
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
                          <div className="bg-sage-100 p-2 rounded-lg">
                            <ShoppingBag className="h-4 w-4 text-sage-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-sage-600 line-clamp-1">
                              {post.linkedProductTitle}
                            </p>
                            <p className="text-lg font-bold text-sage-600">{post.linkedProductPrice}</p>
                          </div>
                        </div>
                        <Download className="h-5 w-5 text-sage-500" />
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
                  <Grid3X3 className="h-4 w-4 text-sage-600" />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}