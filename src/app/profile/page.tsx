import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

export default async function ProfileOrdersPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const orders = await prisma.order.findMany({
    where: { userId: (session as any).id },
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  })

  return (
    <div>
       <h1 className="text-2xl font-display font-medium text-foreground mb-8">Siparişlerim ({orders.length})</h1>
       <div className="flex flex-col gap-6">
          {orders.map(order => (
            <div key={order.id} className="border border-border bg-surface p-6 rounded-sm">
               <div className="flex justify-between items-start mb-6 border-b border-border pb-6">
                  <div>
                    <p className="text-xs text-text-secondary font-mono mb-1">ID: {order.id}</p>
                    <p className="text-sm font-medium text-foreground">{new Date(order.createdAt).toLocaleDateString('tr-TR')} tarihinde verildi</p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold tracking-wider rounded-full border border-green-500/20">{order.status}</span>
                    <p className="text-lg font-medium text-primary mt-2">{order.totalAmount.toLocaleString('tr-TR')} ₺</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {order.items.map(item => (
                   <div key={item.id} className="flex gap-4 p-3 border border-border/50 bg-bg rounded-sm items-center">
                      <div className="flex flex-col justify-center gap-1 flex-1">
                        <span className="text-xs font-medium text-foreground line-clamp-1">{item.productName}</span>
                        <span className="text-[10px] text-text-secondary">Adet: {item.quantity} {item.size ? `| Beden: ${item.size}` : ''}</span>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-16 text-sm text-text-secondary border border-border border-dashed rounded-sm">
               Henüz hiç siparişiniz yok. <Link href="/" className="text-primary hover:underline block mt-2">Alışverişe Başlayın</Link>
            </div>
          )}
       </div>
    </div>
  )
}
