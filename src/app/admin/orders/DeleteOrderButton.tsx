'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export function DeleteOrderButton({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Bu siparişi (ve stok düşümlerini geri almadan) silmek istediğinize emin misiniz?')) return
    setLoading(true)
    try {
      await fetch(`/api/orders/${id}`, { method: 'DELETE' })
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="p-2 bg-red-500/10 text-red-500 rounded-sm hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
      <Trash2 size={16} /> Sil
    </button>
  )
}
