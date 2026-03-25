export const dynamic = 'force-dynamic'
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { Activity, Users, ShoppingBag, DollarSign, AlertTriangle } from 'lucide-react'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()
export const revalidate = 0

export default async function AdminDashboardPage() {
  const deleteVariant = async (formData: FormData) => {
    'use server'
    const id = formData.get('id') as string
    if (id) {
      await prisma.productVariant.delete({ where: { id } })
      revalidatePath('/admin')
    }
  }

  const saveSignature = async (formData: FormData) => {
    'use server'
    const newSignature = formData.get('signature') as string
    if (newSignature) {
      await prisma.page.upsert({
        where: { slug: 'footer-signature' },
        update: { content: newSignature },
        create: { slug: 'footer-signature', title: 'Footer İmza', content: newSignature }
      })
      revalidatePath('/', 'layout')
    }
  }

  // Aggregate Metrics
  const usersCount = await prisma.user.count({ where: { role: 'USER' } })
  const productsCount = await prisma.product.count()
  const ordersCount = await prisma.order.count()
  
  const totalRevenueData = await prisma.order.aggregate({
    _sum: { totalAmount: true },
    where: { status: 'PAID' }
  })
  const totalRevenue = totalRevenueData._sum.totalAmount || 0

  // Quick Settings (Footer Signature)
  const currentSignatureObj = await prisma.page.findUnique({ where: { slug: 'footer-signature' } })
  const currentSignature = currentSignatureObj?.content || 'Made with ❤ by Merve Bulut & Selim Şen'

  // Low Stock Logic
  const lowStockVariants = await prisma.productVariant.findMany({
    where: { stock: { lte: 5 } },
    include: { product: true },
    orderBy: { stock: 'asc' }
  })

  // Recent Orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-6xl flex flex-col gap-12">
      <h1 className="text-3xl font-display font-medium text-foreground">Gösterge Paneli</h1>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface border border-border p-6 rounded-sm flex items-center gap-4">
           <div className="p-4 bg-green-500/10 text-green-500 rounded-full"><DollarSign size={24} /></div>
           <div>
             <p className="text-[10px] font-bold tracking-[0.1em] text-text-secondary uppercase mb-1">Toplam Ciro</p>
             <p className="text-2xl font-medium text-foreground">{totalRevenue.toLocaleString('tr-TR')} ₺</p>
           </div>
        </div>
        <div className="bg-surface border border-border p-6 rounded-sm flex items-center gap-4">
           <div className="p-4 bg-primary/10 text-primary rounded-full"><ShoppingBag size={24} /></div>
           <div>
             <p className="text-[10px] font-bold tracking-[0.1em] text-text-secondary uppercase mb-1">Toplam Sipariş</p>
             <p className="text-2xl font-medium text-foreground">{ordersCount}</p>
           </div>
        </div>
        <div className="bg-surface border border-border p-6 rounded-sm flex items-center gap-4">
           <div className="p-4 bg-blue-500/10 text-blue-500 rounded-full"><Users size={24} /></div>
           <div>
             <p className="text-[10px] font-bold tracking-[0.1em] text-text-secondary uppercase mb-1">Müşteriler</p>
             <p className="text-2xl font-medium text-foreground">{usersCount}</p>
           </div>
        </div>
        <div className="bg-surface border border-border p-6 rounded-sm flex items-center gap-4">
           <div className="p-4 bg-orange-500/10 text-orange-500 rounded-full"><Activity size={24} /></div>
           <div>
             <p className="text-[10px] font-bold tracking-[0.1em] text-text-secondary uppercase mb-1">Aktif Ürünler</p>
             <p className="text-2xl font-medium text-foreground">{productsCount}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Low Stock Warning */}
        <div className="border border-border bg-surface p-8 rounded-sm">
           <div className="flex items-center gap-3 mb-6">
             <AlertTriangle className="text-yellow-500" size={24} />
             <h2 className="text-xl font-medium text-foreground">Kritik Stok Uyarısı</h2>
           </div>
           
           {lowStockVariants.length === 0 ? (
             <p className="text-sm text-text-secondary">Tüm ürünlerin stoğu yeterli.</p>
           ) : (
             <div className="flex flex-col gap-4">
                {lowStockVariants.map(variant => (
                  <div key={variant.id} className="flex justify-between items-center p-4 bg-bg border border-border/50 rounded-sm">
                    <div className="flex flex-col gap-1">
                      <Link href={`/admin/edit/${variant.productId}`} className="text-sm font-medium hover:text-primary transition-colors">{variant.product.name}</Link>
                      <span className="text-xs text-text-secondary font-mono">Beden: {variant.size} | Renk: {variant.color || '-'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-xs font-bold rounded shadow-sm ${variant.stock === 0 ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'}`}>
                        {variant.stock === 0 ? 'TÜKENDİ' : `SON ${variant.stock} ADET`}
                      </span>
                      <form action={deleteVariant}>
                        <input type="hidden" name="id" value={variant.id} />
                        <button type="submit" className="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase tracking-wider bg-red-500/10 px-3 py-1 rounded border border-red-500/20 transition-colors">Sil</button>
                      </form>
                    </div>
                  </div>
                ))}
             </div>
           )}
        </div>

        {/* Recent Orders Overview */}
        <div className="border border-border bg-surface p-8 rounded-sm">
           <h2 className="text-xl font-medium text-foreground mb-6">Son 5 Sipariş</h2>
           <div className="flex flex-col gap-4">
              {recentOrders.length === 0 ? (
                <p className="text-sm text-text-secondary">Henüz sipariş yok.</p>
              ) : (
                recentOrders.map(order => (
                  <div key={order.id} className="flex justify-between items-center p-4 bg-bg border border-border/50 rounded-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-foreground">{order.customerName}</span>
                      <span className="text-xs text-text-secondary">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <span className="text-sm font-medium text-primary">{order.totalAmount.toLocaleString('tr-TR')} ₺</span>
                  </div>
                ))
              )}
           </div>
           <Link href="/admin/orders" className="block w-full text-center py-4 border border-border border-dashed mt-6 text-xs font-bold tracking-widest text-text-secondary hover:text-primary hover:border-primary transition-colors">TÜMÜNÜ GÖR</Link>
        </div>
      </div>

      {/* Quick Settings Section */}
      <div className="border border-border bg-surface p-8 rounded-sm">
         <h2 className="text-xl font-medium text-foreground mb-2">Hızlı Site Ayarları</h2>
         <p className="text-sm text-text-secondary mb-6">Buradan ana sitenin altındaki dinamik yazıları değiştirebilirsiniz.</p>
         
         <form action={saveSignature} className="max-w-md flex flex-col gap-4">
           <div className="flex flex-col gap-2">
             <label className="text-xs font-bold uppercase tracking-[0.1em] text-text-secondary">Footer İmza Yazısı</label>
             <input 
               name="signature"
               defaultValue={currentSignature}
               className="bg-bg border border-border p-3 text-sm focus:border-primary focus:outline-none w-full" 
             />
             <p className="text-[10px] text-text-secondary mt-1">İpucu: Kalp emojisinin atmasını istiyorsanız metnin içine tam olarak "❤" karakterini koyun.</p>
           </div>
           
           <button type="submit" className="btn-primary py-3 px-6 text-xs font-bold uppercase tracking-[0.1em] w-fit">Kaydet ve Yansıt</button>
         </form>
      </div>

    </div>
  )
}
