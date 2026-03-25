'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export function CatalogFilter({ currentCategory, currentMin, currentMax, currentSize }: any) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const categories = ['Tümü', 'Kadın', 'Erkek', 'Aksesuar', 'Çanta', 'Kozmetik']
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'Standart']

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === 'Tümü') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-8">
      
      {/* Category Toggles */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-foreground border-b border-border pb-2">Kategori</h3>
        <div className="flex flex-col gap-2">
          {categories.map(cat => (
             <label key={cat} className="flex items-center gap-3 cursor-pointer group">
               <input 
                 type="radio" 
                 name="category_filter" 
                 checked={(currentCategory || 'Tümü') === cat} 
                 onChange={() => updateParam('category', cat)}
                 className="accent-primary w-3 h-3 cursor-pointer" 
               />
               <span className={`text-sm transition-colors ${currentCategory === cat || (!currentCategory && cat === 'Tümü') ? 'text-primary font-medium' : 'text-text-secondary group-hover:text-foreground'}`}>{cat}</span>
             </label>
          ))}
        </div>
      </div>

      {/* Financial Bounds */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-foreground border-b border-border pb-2">Fiyat Aralığı</h3>
        <div className="grid grid-cols-2 gap-2">
          <input 
            type="number" 
            placeholder="Min ₺" 
            defaultValue={currentMin}
            onBlur={(e) => updateParam('minPrice', e.target.value)}
            className="w-full bg-bg border border-border p-2 text-xs focus:border-primary focus:outline-none" 
          />
          <input 
            type="number" 
            placeholder="Max ₺" 
            defaultValue={currentMax}
            onBlur={(e) => updateParam('maxPrice', e.target.value)}
            className="w-full bg-bg border border-border p-2 text-xs focus:border-primary focus:outline-none" 
          />
        </div>
      </div>

      {/* Sizing Toggles */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-foreground border-b border-border pb-2">Beden Seçimi</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map(size => (
            <button
               key={size}
               onClick={() => updateParam('size', currentSize === size ? '' : size)}
               className={`px-3 py-1 border text-xs font-medium cursor-pointer transition-colors ${
                 currentSize === size 
                   ? 'border-primary bg-primary text-background' 
                   : 'border-border text-text-secondary hover:border-foreground hover:text-foreground'
               }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}
