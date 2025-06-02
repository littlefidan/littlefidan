import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  title: string
  price: number
  image?: string
  slug: string
  botanicalTheme?: string
  ageRange?: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  toggleCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  isInCart: (id: string) => boolean
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id)
        if (existingItem) {
          return state
        }
        return { items: [...state.items, item] }
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),
      
      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      getTotalPrice: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.price, 0)
      },
      
      getTotalItems: () => {
        const { items } = get()
        return items.length
      },
      
      isInCart: (id) => {
        const { items } = get()
        return items.some((item) => item.id === id)
      },
    }),
    {
      name: 'littlefidan-cart',
    }
  )
)

// Export alias for easier use
export const useCart = useCartStore