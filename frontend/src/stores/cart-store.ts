import { create } from 'zustand'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  description?: string
}

interface CartStore {
  items: CartItem[]
  loadingItems: Set<string>
  addItem: (item: Omit<CartItem, 'quantity'>) => Promise<void>
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  isLoading: (id: string) => boolean
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  loadingItems: new Set(),
  
  addItem: async (newItem) => {
    // Add to loading state
    set((state) => ({
      loadingItems: new Set([...state.loadingItems, newItem.id])
    }))

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800))

    set((state) => {
      const existingItem = state.items.find(item => item.id === newItem.id)
      
      // Remove from loading state
      const newLoadingItems = new Set(state.loadingItems)
      newLoadingItems.delete(newItem.id)
      
      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          loadingItems: newLoadingItems
        }
      }
      
      return {
        items: [...state.items, { ...newItem, quantity: 1 }],
        loadingItems: newLoadingItems
      }
    })
  },
  
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter(item => item.id !== id)
    }))
  },
  
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id)
      return
    }
    
    set((state) => ({
      items: state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    }))
  },
  
  clearCart: () => {
    set({ items: [] })
  },
  
  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
  },
  
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0)
  },
  
  isLoading: (id: string) => {
    return get().loadingItems.has(id)
  }
}))