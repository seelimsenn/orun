'use client'
import { useState } from 'react'
import { Check } from 'lucide-react'
import { Product, ProductVariant, ProductImage } from '@prisma/client'
import { useCart } from './CartContext'

type ExtendedProduct = Product & { variants: ProductVariant[], images: ProductImage[] }

export function AddToCartSection({ product }: { product: ExtendedProduct }) {
  const { addToCart } = useCart()
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [isAdded, setIsAdded] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)

  // Sort sizes logically
  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'Standart']
  const sortedVariants = [...product.variants].sort((a, b) => sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size))
  
  const hasMultipleSizes = sortedVariants.length > 0 && sortedVariants[0].size !== 'Standart'

  const handleAddToCart = () => {
    if (hasMultipleSizes && !selectedVariantId) {
      setErrorVisible(true)
      setTimeout(() => setErrorVisible(false), 2000)
      return
    }
    
    // Auto pickup standard variant if it's the only one
    let targetVariant = sortedVariants.find(v => v.id === selectedVariantId)
    if (!hasMultipleSizes && sortedVariants.length > 0) {
       targetVariant = sortedVariants[0]
    }

    if (targetVariant && targetVariant.stock === 0) return // Security check

    addToCart({
      productId: product.id,
      variantId: targetVariant?.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      size: targetVariant?.size === 'Standart' ? undefined : targetVariant?.size,
      quantity: 1
    })

    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  return (
    <div className="flex flex-col gap-8">
      {hasMultipleSizes && (
        <div className="relative">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs uppercase tracking-[0.15em] font-medium text-foreground">Beden Seçimi</span>
            <button className="text-[10px] uppercase tracking-[0.15em] text-text-secondary underline hover:text-foreground transition-colors">Beden Tablosu</button>
          </div>
          <div className="grid grid-cols-4 lg:grid-cols-5 gap-2">
            {sortedVariants.map(variant => {
              const outOfStock = variant.stock === 0
              return (
                <button
                  key={variant.id}
                  disabled={outOfStock}
                  onClick={() => {
                    setSelectedVariantId(variant.id)
                    setErrorVisible(false)
                  }}
                  className={`relative py-3 border text-xs font-medium transition-all rounded-sm overflow-hidden ${
                    selectedVariantId === variant.id 
                      ? 'border-primary bg-primary text-background' 
                      : outOfStock 
                        ? 'border-border/50 text-text-secondary/30 bg-surface/50 cursor-not-allowed'
                        : 'border-border text-foreground hover:border-text-secondary bg-transparent'
                  }`}
                >
                  <span className="relative z-10">{variant.size}</span>
                  {outOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 select-none">
                       <svg className="w-full h-full stroke-current" viewBox="0 0 100 100" preserveAspectRatio="none"><line x1="0" y1="100" x2="100" y2="0" strokeWidth="1" /></svg>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          {errorVisible && (
            <span className="absolute -bottom-6 left-0 text-[10px] text-red-500 font-medium tracking-wide uppercase animate-in slide-in-from-top-1">Lütfen bir beden seçiniz.</span>
          )}
        </div>
      )}

      <button 
        onClick={handleAddToCart}
        disabled={isAdded}
        className={`btn-primary w-full py-5 flex items-center justify-center gap-3 transition-all ${isAdded ? 'bg-green-600 border-green-600 hover:bg-green-600 text-white' : ''}`}
      >
        {isAdded ? (
          <>
            <Check size={20} className="text-white" />
            <span className="text-white tracking-[0.1em] font-medium text-sm">Sepete Eklendi</span>
          </>
        ) : (
          <span className="tracking-[0.1em] font-medium text-sm">Sepete Ekle - {product.price.toLocaleString('tr-TR')} ₺</span>
        )}
      </button>
    </div>
  )
}
