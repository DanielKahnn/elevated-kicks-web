'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { type ShopifyImage, type ShopifyMoney } from '@/lib/shopify'

// ── Types ─────────────────────────────────────────────────────
export interface CartItem {
  variantId: string
  productHandle: string
  productTitle: string
  variantTitle: string
  price: ShopifyMoney
  image: ShopifyImage | null
}

export interface CartLineItem extends CartItem {
  quantity: number
}

interface CartContextType {
  items: CartLineItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}

// ── Context ───────────────────────────────────────────────────
const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([])
  const [loaded, setLoaded] = useState(false)

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ek-cart')
      if (stored) setItems(JSON.parse(stored))
    } catch {}
    setLoaded(true)
  }, [])

  // Persist to localStorage whenever items change
  useEffect(() => {
    if (!loaded) return
    localStorage.setItem('ek-cart', JSON.stringify(items))
  }, [items, loaded])

  const addToCart = useCallback((newItem: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.variantId === newItem.variantId)
      if (existing) {
        return prev.map(i =>
          i.variantId === newItem.variantId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...newItem, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((variantId: string) => {
    setItems(prev => prev.filter(i => i.variantId !== variantId))
  }, [])

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(variantId)
      return
    }
    setItems(prev =>
      prev.map(i => i.variantId === variantId ? { ...i, quantity } : i)
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce(
    (sum, i) => sum + parseFloat(i.price.amount) * i.quantity, 0
  )

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
