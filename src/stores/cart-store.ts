import { create } from 'zustand'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  description?: string
  product?: any
}

interface CartStore {
  items: CartItem[]
  loadingItems: Set<string>
  addItem: (item: Omit<CartItem, 'quantity'>) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  loadCart: () => Promise<void>
  getTotalPrice: () => number
  getTotalItems: () => number
  isLoading: (id: string) => boolean
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  loadingItems: new Set(),
  
  loadCart: async () => {
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        set({ items: data.items.map((item: any) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          quantity: item.quantity,
          description: item.product.description,
          product: item.product
        }))})
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
    }
  },
  
  addItem: async (newItem) => {
    // Add to loading state
    set((state) => ({
      loadingItems: new Set([...state.loadingItems, newItem.id])
    }))

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: newItem.id,
          quantity: 1
        })
      })

      if (response.ok) {
        const cartItem = await response.json()
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
            items: [...state.items, { 
              ...newItem, 
              quantity: 1,
              product: cartItem.product 
            }],
            loadingItems: newLoadingItems
          }
        })
      } else {
        // For now, handle the error by adding to local state
        console.warn('Cart API not available, using local state')
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
      }
    } catch (error) {
      // Remove from loading state on error and add to local state as fallback
      console.warn('Cart API error, using local state:', error)
      set((state) => {
        const newLoadingItems = new Set(state.loadingItems)
        newLoadingItems.delete(newItem.id)
        
        const existingItem = state.items.find(item => item.id === newItem.id)
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
    }
  },
  
  removeItem: async (id) => {
    try {
      await fetch(`/api/cart/${id}`, {
        method: 'DELETE'
      })
      
      set((state) => ({
        items: state.items.filter(item => item.id !== id)
      }))
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  },
  
  updateQuantity: async (id, quantity) => {
    if (quantity <= 0) {
      await get().removeItem(id)
      return
    }
    
    try {
      await fetch(`/api/cart/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity })
      })
      
      set((state) => ({
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      }))
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }
  },
  
  clearCart: async () => {
    try {
      await fetch('/api/cart', {
        method: 'DELETE'
      })
      set({ items: [] })
    } catch (error) {
      console.error('Failed to clear cart:', error)
    }
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