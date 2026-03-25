'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminEditMagazine({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mag, setMag] = useState<any>(null)

  useEffect(() => {
    fetch('/api/magazines').then(r => r.json()).then(data => {
      const found = data.find((m: any) => m.id === id)
      if (found) setMag(found)
    })
  }, [id])

  if (!mag) return <div className="text-foreground">Yükleniyor...</div>

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    
    try {
      const res = await fetch(`/api/magazines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Dergi güncellenemedi')
      router.push('/admin/magazines')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl bg-surface p-8 border border-border rounded-sm">
      <h2 className="text-3xl font-display font-medium text-foreground mb-8">Dergi Düzenle</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-foreground">
        {error && <div className="p-4 bg-red-500/10 text-red-500 rounded-sm border border-red-500/20">{error}</div>}
        
        <div>
          <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-2">Başlık</label>
          <input required defaultValue={mag.title} name="title" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
        </div>
        
        <div>
          <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-2">Kısa Açıklama (Özet)</label>
          <input required defaultValue={mag.excerpt} name="excerpt" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-2">Görsel URL</label>
          <input required defaultValue={mag.imageUrl} name="imageUrl" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
        </div>
        
        <div>
          <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-2">İçerik</label>
          <textarea required defaultValue={mag.content} name="content" rows={6} className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
        </div>

        <button type="submit" disabled={loading} className="btn-primary mt-4 disabled:opacity-50">
          {loading ? 'Güncelleniyor...' : 'Güncelle'}
        </button>
      </form>
    </div>
  )
}
