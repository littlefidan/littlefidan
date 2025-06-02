'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { Button } from '@/components/ui/button'
import { formatPrice, cn } from '@/lib/utils'

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, getTotalPrice, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={toggleCart}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-sage-100 px-6 py-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-sage-600" />
              <h2 className="font-serif text-xl font-semibold text-sage-600">
                Winkelwagen ({items.length})
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCart}
              className="hover:bg-sage-50"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6">
              <div className="rounded-full bg-sage-50 p-4 mb-4">
                <ShoppingBag className="h-12 w-12 text-sage-400" />
              </div>
              <p className="text-sage-600 text-center mb-6">
                Je winkelwagen is leeg
              </p>
              <Button onClick={toggleCart} asChild>
                <Link href="/products">
                  Ontdek Producten
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b border-sage-100 pb-4"
                    >
                      <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-sage-50">
                        <Image
                          src={item.image || `https://placehold.co/200x200/9CAA8B/FFFFFF?text=${encodeURIComponent(item.name)}`}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Link 
                          href={`/products/${item.slug}`}
                          onClick={toggleCart}
                          className="font-medium text-sage-600 hover:text-sage-500"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-sage-500 mb-1">
                          {(item as any).botanicalTheme && (
                            <span className="capitalize">{(item as any).botanicalTheme}</span>
                          )}
                          {(item as any).botanicalTheme && (item as any).ageRange && ' • '}
                          {(item as any).ageRange}
                        </p>
                        <p className="font-semibold text-sage-600">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {items.length > 0 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={clearCart}
                      className="text-sm text-sage-500 hover:text-sage-600"
                    >
                      Winkelwagen leegmaken
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-sage-100 px-6 py-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-medium text-sage-600">Subtotaal</span>
                  <span className="font-serif text-xl font-semibold text-sage-600">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <p className="text-sm text-sage-500 mb-4">
                  Verzendkosten worden berekend bij het afrekenen
                </p>
                <Button className="w-full mb-2" size="lg" asChild>
                  <Link href="/checkout" onClick={toggleCart}>
                    Afrekenen
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  onClick={toggleCart}
                  asChild
                >
                  <Link href="/products">
                    Verder winkelen
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}