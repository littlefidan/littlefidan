'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart-store'
import { cn } from '@/lib/utils'

interface CartButtonProps {
  className?: string
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function CartButton({ className, variant = 'ghost', size = 'icon' }: CartButtonProps) {
  const { toggleCart, getTotalItems } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const itemCount = getTotalItems()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={cn("relative", className)}
      onClick={toggleCart}
    >
      <ShoppingBag className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-sage-500 text-xs text-white flex items-center justify-center font-medium">
          {itemCount}
        </span>
      )}
    </Button>
  )
}