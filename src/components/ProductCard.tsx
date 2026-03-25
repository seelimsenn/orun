'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Product } from '@prisma/client'

import { useFavorites } from './FavoritesContext'
import { Heart } from 'lucide-react'

interface ProductProps {
  product: Product
  index: number
}

export function ProductCard({ product, index }: ProductProps) {
  const { favoriteIds, toggleFavorite } = useFavorites()
  const isFavorite = favoriteIds.includes(product.id)

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(product.id)
  }

  const handleClick = () => {
    console.log(`[Analytics] event: view_item, productId: ${product.id}, name: ${product.name}, price: ${product.price}`)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col cursor-pointer"
      onClick={handleClick}
    >
      <Link href={`/product/${product.id}`} className="block overflow-hidden relative aspect-[3/4] bg-surface mb-6 rounded-sm">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <button 
          onClick={handleFavorite}
          className="absolute top-4 right-4 z-10 p-2 bg-background/50 hover:bg-background/80 backdrop-blur-sm rounded-full transition-all duration-300 shadow-sm"
        >
          <Heart size={18} className={`transition-colors duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
        </button>
      </Link>
      <div className="flex flex-col gap-2">
        <span className="text-[10px] uppercase tracking-[0.15em] text-text-secondary">{product.category}</span>
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-body text-foreground pr-4 font-medium leading-tight">{product.name}</h3>
          <span className="text-primary font-medium text-sm">{product.price.toLocaleString('tr-TR')} ₺</span>
        </div>
      </div>
    </motion.div>
  )
}
