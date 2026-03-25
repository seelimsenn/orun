'use client'
import { useState, useEffect } from 'react'
import { Magazine } from '@prisma/client'
import { Trash2, Pencil } from 'lucide-react'
import Link from 'next/link'

export default function AdminMagazinesPage() {
  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/magazines').then(r => r.json()).then(data => {
      setMagazines(data)
      setLoading(false)
    })
  }, [])

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    if (!confirm('Silmek istediğinize emin misiniz?')) return
    await fetch(`/api/magazines/${id}`, { method: 'DELETE' })
    setMagazines(magazines.filter(m => m.id !== id))
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-display font-medium text-foreground">Dergileri Yönet</h2>
        <Link href="/admin/magazines/add" className="btn-primary">Yeni Dergi Ekle</Link>
      </div>
      
      <div className="bg-surface border border-border rounded-sm overflow-hidden text-foreground">
        <table className="w-full text-sm text-left">
          <thead className="bg-bg border-b border-border text-text-secondary text-xs uppercase tracking-[0.15em]">
            <tr>
              <th className="px-6 py-5 font-medium">Dergi</th>
              <th className="px-6 py-5 font-medium">Eklendiği Tarih</th>
              <th className="px-6 py-5 font-medium text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {magazines.map((m) => (
              <tr key={m.id} className="hover:bg-bg/50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-4">
                  <img src={m.imageUrl} className="w-16 h-12 object-cover rounded-sm border border-border" />
                  <span className="font-medium text-foreground">{m.title}</span>
                </td>
                <td className="px-6 py-4 text-text-secondary text-xs">{new Date(m.createdAt).toLocaleDateString('tr-TR')}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/magazines/edit/${m.id}`} className="text-text-secondary hover:text-primary transition-colors p-2 inline-flex" title="Düzenle">
                      <Pencil size={18} />
                    </Link>
                    <button onClick={(e) => handleDelete(m.id, e)} className="text-red-500 hover:text-red-400 transition-colors p-2 inline-flex" title="Sil">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {magazines.length === 0 && (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-text-secondary">Hiç dergi bulunamadı.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
