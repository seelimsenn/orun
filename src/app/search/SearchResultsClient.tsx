'use client'
import { useState, useEffect, useRef } from 'react'
import Fuse from 'fuse.js'
import Link from 'next/link'
import { ProductCard } from '@/components/ProductCard'

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

export function SearchResultsClient({ initialQuery, products }: { initialQuery: string, products: Product[] }) {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<Product[]>([])
  const fuseRef = useRef<Fuse<Product> | null>(null)

  useEffect(() => {
    // Inject the combined string to make fuzzy multi-word searches work perfectly (e.g "erkek kaban")
    const enriched = products.map(p => ({
      ...p,
      _searchable: `${p.category} ${p.subcategory} ${p.name} ${p.description}`
    }))

    fuseRef.current = new Fuse(enriched, {
      keys: ['_searchable'],
      threshold: 0.45, 
      ignoreLocation: true,
      includeMatches: false
    })
  }, [products])

  useEffect(() => {
    if (!fuseRef.current) return

    if (!query.trim()) {
      setResults(products) // If no search query, show all
      return
    }

    const searchResults = fuseRef.current.search(query).map(result => result.item)
    setResults(searchResults)
  }, [query, products])

  return (
    <div className="py-2">
      <div className="max-w-2xl text-left mb-12">
        <div className="relative">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Aramaya devam et..."
            className="w-full bg-transparent border-b border-border text-lg md:text-xl font-display text-foreground placeholder:text-text-secondary/50 focus:border-primary focus:outline-none pb-4"
          />
        </div>
        {query && (
          <p className="text-text-secondary mt-6 uppercase tracking-widest text-[10px]">
             "{query}" için {results.length} sonuç bulundu
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
        {results.map((product, idx) => (
           <ProductCard key={product.id} product={product as any} index={idx} />
        ))}
      </div>

      {results.length === 0 && (
        <div className="py-24 text-center">
          <p className="text-text-secondary italic">Aradığınız kriterlere uygun bir sonuç bulamadık.</p>
        </div>
      )}
    </div>
  )
}
