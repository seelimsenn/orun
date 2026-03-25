import { PrismaClient } from '@prisma/client'
import { DeleteOrderButton } from './DeleteOrderButton'
const prisma = new PrismaClient()

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: true
    }
  })

  return (
    <div>
      <h2 className="text-xl font-display font-medium text-foreground mb-8">Siparişler ({orders.length})</h2>
      
      <div className="flex flex-col gap-6">
        {orders.map(order => (
          <div key={order.id} className="bg-surface border border-border p-6 rounded-sm">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-6 gap-4">
               <div>
                 <p className="text-xs text-text-secondary font-mono mb-1">ID: {order.id}</p>
                 <h3 className="text-lg font-medium text-foreground">{order.customerName}</h3>
                 <p className="text-sm text-text-secondary">{order.customerEmail} | {order.customerPhone}</p>
               </div>
               <div className="flex flex-col lg:items-end gap-2">
                 <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold tracking-wider rounded-full self-start lg:self-auto border border-green-500/20">{order.status}</span>
                 <p className="text-xl font-medium text-primary">{order.totalAmount.toLocaleString('tr-TR')} ₺</p>
                 <p className="text-xs text-text-secondary">{new Date(order.createdAt).toLocaleString('tr-TR')}</p>
                 <div className="mt-2 text-right">
                    <DeleteOrderButton id={order.id} />
                 </div>
               </div>
            </div>

            <div className="border-t border-border pt-4">
               <h4 className="text-xs uppercase tracking-widest text-text-secondary mb-3 font-medium">Teslimat Adresi</h4>
               <p className="text-sm text-foreground mb-6">{order.shippingAddress}</p>
               
               <h4 className="text-xs uppercase tracking-widest text-text-secondary mb-3 font-medium">Satın Alınan Ürünler</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {order.items.map(item => (
                   <div key={item.id} className="flex justify-between items-center p-3 bg-bg border border-border/50 rounded-sm">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{item.productName}</span>
                        {item.size && <span className="text-xs text-text-secondary">Beden: {item.size}</span>}
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-foreground">{item.quantity} Adet</span>
                        <span className="text-xs text-primary font-medium">{item.price.toLocaleString('tr-TR')} ₺</span>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-12 text-text-secondary border border-border border-dashed rounded-sm">Henüz hiç sipariş yok.</div>
        )}
      </div>
    </div>
  )
}
