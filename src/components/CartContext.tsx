'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  name: string
  price: number
  imageUrl: string
  size?: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'id'>) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('orun_cart')
    if (saved) setItems(JSON.parse(saved))
  }, [])
  
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('orun_cart', JSON.stringify(items))
    }
  }, [items, mounted])

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === newItem.productId && i.variantId === newItem.variantId)
      if (existing) {
        return prev.map(i => i === existing ? { ...i, quantity: i.quantity + newItem.quantity } : i)
      }
      return [...prev, { ...newItem, id: Math.random().toString(36).substr(2, 9) }]
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem('orun_cart')
  }

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  )
}
