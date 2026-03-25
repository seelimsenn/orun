'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddProductForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Ürün eklenemedi')
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
        <input required name="name" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-2">Fiyat (₺)</label>
          <input required type="number" step="0.01" name="price" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-2">Kategori</label>
          <input required name="category" placeholder="Örn: Erkek" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-2">Alt Kategori</label>
          <input required name="subcategory" placeholder="Örn: Triko" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
        </div>
      </div>

      <div className="border-t border-border pt-6 mt-4">
        <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-4 font-bold">Resim Galerisi (URL)</label>
        <input required name="imageUrl" placeholder="Ana Görsel URL (Zorunlu)" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors mb-3" />
        <input name="image1" placeholder="Ekstra Görsel 1 URL" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors mb-3" />
        <input name="image2" placeholder="Ekstra Görsel 2 URL" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors mb-3" />
        <input name="image3" placeholder="Ekstra Görsel 3 URL" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
      </div>

      <div className="border-t border-border pt-6 mt-4">
        <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-4 font-bold">Varyant Stokları</label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {['XS', 'S', 'M', 'L', 'XL', 'Standart'].map(size => (
            <div key={size}>
              <label className="block text-xs text-text-secondary mb-2 font-medium">{size} Beden</label>
              <input type="number" name={`stock_${size}`} defaultValue={0} min="0" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-border pt-6 mt-4">
        <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-2">Açıklama</label>
        <textarea required name="description" rows={4} className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
      </div>

      <button type="submit" disabled={loading} className="btn-primary mt-4 disabled:opacity-50">
        {loading ? 'Ekleniyor...' : 'Yeni Ürün Ekle'}
      </button>
    </form>
  )
}
