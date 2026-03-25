'use client'
import { useState, useEffect } from 'react'
import { Page } from '@prisma/client'
import { Trash2, Pencil } from 'lucide-react'
import Link from 'next/link'

export default function AdminPagesList() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/pages').then(r => r.json()).then(data => {
      setPages(data)
      setLoading(false)
    })
  }, [])

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    if (!confirm('Silmek istediğinize emin misiniz?')) return
    await fetch(`/api/pages/${id}`, { method: 'DELETE' })
    setPages(pages.filter(p => p.id !== id))
  }

  if (loading) return <div className="text-foreground">Yükleniyor...</div>

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-display font-medium text-foreground">Sayfaları Yönet</h2>
        <Link href="/admin/pages/add" className="btn-primary">Yeni Sayfa Ekle</Link>
      </div>
      
      <div className="bg-surface border border-border rounded-sm overflow-hidden text-foreground">
        <table className="w-full text-sm text-left">
          <thead className="bg-bg border-b border-border text-text-secondary text-xs uppercase tracking-[0.15em]">
            <tr>
              <th className="px-6 py-5 font-medium">Başlık</th>
              <th className="px-6 py-5 font-medium">URL Slug</th>
              <th className="px-6 py-5 font-medium text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pages.map((p) => (
              <tr key={p.id} className="hover:bg-bg/50 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">{p.title}</td>
                <td className="px-6 py-4 text-text-secondary">/pages/{p.slug}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/pages/edit/${p.id}`} className="text-text-secondary hover:text-primary transition-colors p-2 inline-flex" title="Düzenle">
                      <Pencil size={18} />
                    </Link>
                    <button onClick={(e) => handleDelete(p.id, e)} className="text-red-500 hover:text-red-400 transition-colors p-2 inline-flex" title="Sil">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-text-secondary">Hiç sayfa bulunamadı.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
