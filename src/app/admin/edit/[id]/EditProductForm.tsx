'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EditProductForm({ product }: { product: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const images = product.images || []
  const variants = product.variants || []

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!res.ok) throw new Error('Ürün güncellenemedi')
      
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-foreground">
      {error && <div className="p-4 bg-red-500/10 text-red-500 rounded-sm border border-red-500/20">{error}</div>}
      
      <div>
        <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-2">Ürün Adı</label>
        <input required defaultValue={product.name} name="name" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-2">Fiyat (₺)</label>
          <input required defaultValue={product.price} type="number" step="0.01" name="price" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-2">Kategori</label>
          <input required defaultValue={product.category} name="category" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-2">Alt Kategori</label>
          <input required defaultValue={product.subcategory} name="subcategory" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
        </div>
      </div>

      <div className="border-t border-border pt-6 mt-4">
        <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-4 font-bold">Resim Galerisi (URL)</label>
        <input required defaultValue={product.imageUrl} name="imageUrl" placeholder="Ana Görsel URL (Zorunlu)" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors mb-3" />
        <input defaultValue={images[1]?.url || ''} name="image1" placeholder="Ekstra Görsel 1 URL" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors mb-3" />
        <input defaultValue={images[2]?.url || ''} name="image2" placeholder="Ekstra Görsel 2 URL" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors mb-3" />
        <input defaultValue={images[3]?.url || ''} name="image3" placeholder="Ekstra Görsel 3 URL" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
      </div>

      <div className="border-t border-border pt-6 mt-4">
        <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-4 font-bold">Varyant Stokları</label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {['XS', 'S', 'M', 'L', 'XL', 'Standart'].map(size => {
            const v = variants.find((vr: any) => vr.size === size)
            return (
              <div key={size}>
                <label className="block text-xs text-text-secondary mb-2 font-medium">{size} Beden</label>
                <input type="number" name={`stock_${size}`} defaultValue={v?.stock || 0} min="0" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none" />
              </div>
            )
          })}
        </div>
      </div>
      
      <div className="border-t border-border pt-6 mt-4">
        <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-2">Açıklama</label>
        <textarea required defaultValue={product.description} name="description" rows={4} className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
      </div>

      <button type="submit" disabled={loading} className="btn-primary mt-4 disabled:opacity-50">
        {loading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
      </button>
    </form>
  )
}
