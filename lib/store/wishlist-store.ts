import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string
  title: string
  price: number
  image?: string
  slug: string
  botanicalTheme?: string
  ageRange?: string
  addedAt: Date
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void
  removeItem: (id: string) => void
  clearWishlist: () => void
  isInWishlist: (id: string) => boolean
  getTotalItems: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id)
        if (existingItem) {
          return state
        }
        return { 
          items: [...state.items, { ...item, addedAt: new Date() }] 
        }
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),
      
      clearWishlist: () => set({ items: [] }),
      
      isInWishlist: (id) => {
        const { items } = get()
        return items.some((item) => item.id === id)
      },
      
      getTotalItems: () => {
        const { items } = get()
        return items.length
      },
    }),
    {
      name: 'littlefidan-wishlist',
    }
  )
)

// Export alias for easier use
export const useWishlist = useWishlistStore