'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search as SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Fuse from 'fuse.js'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  subcategory: string
  _searchable?: string
}

export function SearchOverlay({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [results, setResults] = useState<Product[]>([])
  const fuseRef = useRef<Fuse<Product> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setTimeout(() => setQuery(''), 300)
    }

    if (isOpen && products.length === 0) {
      fetch('/api/products').then(r => r.json()).then((data: Product[]) => {
        const enriched = data.map(p => ({
          ...p,
          _searchable: `${p.category} ${p.subcategory} ${p.name} ${p.description}`
        }))
        setProducts(enriched)
        fuseRef.current = new Fuse(enriched, {
          keys: ['_searchable'],
          threshold: 0.45, 
          ignoreLocation: true,
          includeMatches: false
        })
      })
    }
  }, [isOpen, products.length])

  useEffect(() => {
    if (!fuseRef.current || !query.trim()) {
      setResults([])
      return
    }
    const searchResults = fuseRef.current.search(query).map(result => result.item)
    setResults(searchResults.slice(0, 3))
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      onClose()
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-md border-b border-border shadow-xl z-50 rounded-b-md"
        >
          <div className="container mx-auto px-4 md:px-8 py-6 md:py-8">
            <div className="relative flex items-center max-w-2xl mx-auto">
              <SearchIcon size={20} className="text-text-secondary absolute left-5" />
              <input 
                ref={inputRef}
                type="text"
                placeholder="Örn: Erkek kaban, kadın triko, çanta..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-surface border border-border rounded-full py-4 pl-14 pr-14 text-foreground text-sm focus:border-primary focus:outline-none transition-colors shadow-sm"
              />
              <button onClick={onClose} className="absolute right-5 text-text-secondary hover:text-primary transition-colors bg-bg rounded-full p-1 border border-border">
                <X size={16} />
              </button>
            </div>

            {query.trim() !== '' && (
              <div className="mt-8 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-5">
                  <span className="text-[10px] uppercase tracking-widest text-text-secondary font-medium">En İyi Sonuçlar</span>
                </div>
                
                {results.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {results.map((product) => (
                      <Link key={product.id} href={`/product/${product.id}`} onClick={onClose} className="flex gap-4 p-3 bg-surface hover:bg-bg rounded-md transition-colors border border-border hover:border-primary group">
                        <img src={product.imageUrl} alt={product.name} className="w-16 h-20 object-cover rounded-[2px] opacity-90 group-hover:opacity-100 transition-opacity mix-blend-luminosity" />
                        <div className="flex flex-col justify-center">
                          <span className="text-[9px] uppercase tracking-widest text-text-secondary mb-1.5">{product.category} &rsaquo; {product.subcategory}</span>
                          <h4 className="text-xs font-semibold text-foreground mb-1 line-clamp-2">{product.name}</h4>
                          <span className="text-secondary font-medium text-xs mt-auto inline-block py-0.5 px-2 bg-text-primary/10 rounded-sm w-fit">{product.price.toLocaleString('tr-TR')} ₺</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <SearchIcon size={32} className="text-border mb-4" />
                    <p className="text-sm text-text-secondary">
                      "<span className="text-foreground font-medium">{query}</span>" ile eşleşen bir ürün bulamadık. <br/> Lütfen kelimeleri kontrol edip tekrar deneyin.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
