'use client'
import { createContext, useContext, useState, useEffect } from 'react'

type FavoritesContextType = {
  favoriteIds: string[]
  toggleFavorite: (productId: string) => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  
  useEffect(() => {
    fetch('/api/favorites')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setFavoriteIds(data.map(f => f.productId))
      })
      .catch(() => {})
  }, [])

  const toggleFavorite = async (productId: string) => {
    const isFav = favoriteIds.includes(productId)
    
    // Optimistic UI updates
    if (isFav) {
      setFavoriteIds(prev => prev.filter(id => id !== productId))
      await fetch(`/api/favorites?productId=${productId}`, { method: 'DELETE' }).catch(() => {
         setFavoriteIds(prev => [...prev, productId]) // Revert on fail
      })
    } else {
      setFavoriteIds(prev => [...prev, productId])
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })
      if (!res.ok) {
        setFavoriteIds(prev => prev.filter(id => id !== productId)) // Revert on fail
        if (res.status === 401) window.location.href = '/login'
      }
    }
  }

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider')
  return context
}
