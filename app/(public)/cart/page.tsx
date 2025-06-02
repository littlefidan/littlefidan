'use client'

import { useCartStore } from '@/lib/store/cart-store'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ShoppingBag, Plus, Minus, X, ChevronRight, ShoppingCart, Check } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.21 // 21% BTW
  const total = subtotal + tax

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-light">
        <div className="container mx-auto px-4 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="mb-8">
              <div className="w-24 h-24 bg-taupe-100 rounded-full flex items-center justify-center mx-auto">
                <ShoppingCart className="w-12 h-12 text-taupe-400" />
              </div>
            </div>
            <h1 className="text-3xl font-serif font-bold text-primary mb-4">
              Je winkelwagen is leeg
            </h1>
            <p className="text-neutral-medium mb-8">
              Ontdek onze prachtige collectie educatieve materialen voor kinderen.
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-primary hover:bg-primary-600 text-white rounded-full">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Ga naar producten
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm mb-4">
            <Link href="/" className="text-neutral-medium hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-neutral-medium" />
            <span className="text-primary font-medium">Winkelwagen</span>
          </nav>
          <h1 className="text-3xl font-serif font-bold text-primary">
            Winkelwagen ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-soft p-6"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-neutral-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold text-primary">{item.name}</h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-neutral-medium hover:text-red-500 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <p className="text-lg font-semibold text-primary mb-3">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 rounded-full bg-taupe-100 hover:bg-taupe-200 flex items-center justify-center transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-medium text-primary min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-taupe-100 hover:bg-taupe-200 flex items-center justify-center transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Clear Cart Button */}
            <div className="pt-4">
              <button
                onClick={clearCart}
                className="text-sm text-neutral-medium hover:text-red-500 transition-colors"
              >
                Winkelwagen legen
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-4">
              <h2 className="text-xl font-serif font-bold text-primary mb-6">
                Overzicht
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-neutral-medium">
                  <span>Subtotaal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-medium">
                  <span>BTW (21%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-taupe-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-primary">
                    <span>Totaal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full bg-primary hover:bg-primary-600 text-white rounded-full">
                  Afrekenen
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/products">
                <Button variant="outline" className="w-full mt-3 rounded-full">
                  Verder winkelen
                </Button>
              </Link>

              {/* Benefits */}
              <div className="mt-6 pt-6 border-t border-taupe-200 space-y-2">
                <div className="flex items-center gap-2 text-sm text-neutral-medium">
                  <Check className="h-4 w-4 text-mint-600" />
                  <span>Direct downloaden na betaling</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-medium">
                  <Check className="h-4 w-4 text-mint-600" />
                  <span>Veilig betalen met iDEAL</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-medium">
                  <Check className="h-4 w-4 text-mint-600" />
                  <span>30 dagen download garantie</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}