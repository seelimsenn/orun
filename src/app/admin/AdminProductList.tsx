'use client'
import { Product } from '@prisma/client'
import { useState } from 'react'
import { Trash2, Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function AdminProductList({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts)
  const router = useRouter()

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return
    
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      setProducts(products.filter(p => p.id !== id))
      router.refresh()
    } catch (err) {
      alert('Silme işlemi başarısız oldu')
    }
  }

  return (
    <div className="bg-surface border border-border rounded-sm overflow-hidden text-foreground">
      <table className="w-full text-sm text-left">
        <thead className="bg-bg border-b border-border text-text-secondary text-xs uppercase tracking-[0.15em]">
          <tr>
            <th className="px-6 py-5 font-medium">Ürün</th>
            <th className="px-6 py-5 font-medium">Kategori</th>
            <th className="px-6 py-5 font-medium">Alt Kategori</th>
            <th className="px-6 py-5 font-medium">Fiyat</th>
            <th className="px-6 py-5 font-medium text-right">İşlemler</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-bg/50 transition-colors">
              <td className="px-6 py-4 flex items-center gap-4">
                <img src={p.imageUrl} className="w-12 h-16 object-cover rounded-sm border border-border" />
                <span className="font-medium text-foreground">{p.name}</span>
              </td>
              <td className="px-6 py-4 text-text-secondary tracking-wider text-[10px] uppercase">{p.category}</td>
              <td className="px-6 py-4 text-text-secondary tracking-wider text-[10px] uppercase">{p.subcategory}</td>
              <td className="px-6 py-4 text-text-primary font-medium">{p.price.toLocaleString('tr-TR')} ₺</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/edit/${p.id}`} className="text-text-secondary hover:text-primary transition-colors p-2 inline-flex" title="Düzenle">
                    <Pencil size={18} />
                  </Link>
                  <button onClick={(e) => handleDelete(p.id, e)} className="text-red-500 hover:text-red-400 transition-colors p-2 inline-flex" title="Sil">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr><td colSpan={4} className="px-6 py-8 text-center text-text-secondary">Hiç ürün bulunamadı.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
