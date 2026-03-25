'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState<any>(null)

  useEffect(() => {
    fetch('/api/pages').then(r => r.json()).then(data => {
      const found = data.find((p: any) => p.id === id)
      if (found) setPage(found)
    })
  }, [id])

  if (!page) return <div className="text-foreground">Yükleniyor...</div>

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Sayfa güncellenemedi')
      router.push('/admin/pages')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl bg-surface p-8 border border-border rounded-sm">
      <h2 className="text-3xl font-display font-medium text-foreground mb-8">Sayfa Düzenle</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-foreground">
        {error && <div className="p-4 bg-red-500/10 text-red-500 rounded-sm border border-red-500/20">{error}</div>}
        
        <div>
          <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-2">Başlık</label>
          <input required defaultValue={page.title} name="title" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
        </div>
        
        <div>
          <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-2">URL Uzantısı (Slug)</label>
          <input required defaultValue={page.slug} name="slug" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
        </div>
        
        <div>
          <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-2">İçerik</label>
          <textarea required defaultValue={page.content} name="content" rows={10} className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors whitespace-pre-wrap" />
        </div>

        <button type="submit" disabled={loading} className="btn-primary mt-4 disabled:opacity-50">
          {loading ? 'Güncelleniyor...' : 'Güncelle'}
        </button>
      </form>
    </div>
  )
}
