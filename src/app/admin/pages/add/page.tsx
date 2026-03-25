'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminAddPage() {
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
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Sayfa eklenemedi (Slug benzersiz olmalı)')
      router.push('/admin/pages')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl bg-surface p-8 border border-border rounded-sm">
      <h2 className="text-3xl font-display font-medium text-foreground mb-8">Yeni Sayfa Ekle</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-foreground">
        {error && <div className="p-4 bg-red-500/10 text-red-500 rounded-sm border border-red-500/20">{error}</div>}
        
        <div>
          <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-2">Başlık</label>
          <input required name="title" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
        </div>
        
        <div>
          <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-2">URL Uzantısı (Slug)</label>
          <input required placeholder="ornek-sayfa" name="slug" className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
          <p className="text-xs text-text-secondary mt-1">Örn: "kurumsal" yazarsanız adres /pages/kurumsal olur. Boşluk kullanmayın.</p>
        </div>
        
        <div>
          <label className="block text-xs uppercase tracking-[0.1em] text-text-secondary mb-2">İçerik</label>
          <textarea required name="content" rows={10} className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors whitespace-pre-wrap" />
        </div>

        <button type="submit" disabled={loading} className="btn-primary mt-4 disabled:opacity-50">
          {loading ? 'Ekleniyor...' : 'Sayfa Ekle'}
        </button>
      </form>
    </div>
  )
}
