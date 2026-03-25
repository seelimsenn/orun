export const dynamic = 'force-dynamic'
import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Heart, Package } from 'lucide-react'

const prisma = new PrismaClient()

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: { product: true }
          }
        }
      },
      addresses: true,
      favorites: {
        include: { product: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!user) return notFound()

  const totalSpent = user.orders.reduce((acc, order) => acc + order.totalAmount, 0)

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Back Navigation */}
      <div className="flex flex-col gap-4">
        <Link href="/admin/users" className="flex items-center gap-2 text-xs font-bold tracking-widest text-text-secondary hover:text-primary transition-colors uppercase w-fit">
          <ArrowLeft size={16} /> Kullanıcılara Dön
        </Link>
        <div className="bg-surface border border-border p-8 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-display font-medium text-foreground">{user.name}</h1>
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <span>{user.email}</span>
              <span>•</span>
              <span className="uppercase tracking-widest text-[10px] font-bold border border-border px-2 py-0.5 rounded-full">{user.role}</span>
              <span>•</span>
              <span>Kayıt: {new Date(user.createdAt).toLocaleDateString('tr-TR')}</span>
            </div>
          </div>
          <div className="bg-bg border border-border px-6 py-4 rounded-sm flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold tracking-widest text-text-secondary mb-1">Toplam Harcama</span>
            <span className="text-2xl font-display text-primary">₺{totalSpent.toLocaleString('tr-TR')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Orders */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="bg-surface border border-border p-6 rounded-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
              <Package size={20} className="text-primary" />
              <h2 className="text-xl font-display font-medium">Sipariş Geçmişi ({user.orders.length})</h2>
            </div>
            
            {user.orders.length === 0 ? (
              <p className="text-sm text-text-secondary">Bu kullanıcının henüz bir siparişi bulunmuyor.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {user.orders.map(order => (
                  <div key={order.id} className="border border-border p-4 bg-bg rounded-sm flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-border pb-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold tracking-widest text-text-secondary uppercase mb-1">Sipariş No: {order.id.slice(-6)}</span>
                        <span className="text-sm text-foreground">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-sm ${order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : order.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>
                          {order.status === 'PENDING' ? 'Hazırlanıyor' : order.status === 'SHIPPED' ? 'Kargoya Verildi' : 'Teslim Edildi'}
                        </span>
                        <span className="mt-1 font-medium text-primary">₺{order.totalAmount.toLocaleString('tr-TR')}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <span className="text-text-secondary">{item.quantity}x {item.product.name} ({item.size})</span>
                          <span>₺{item.price.toLocaleString('tr-TR')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Addresses & Favorites */}
        <div className="flex flex-col gap-8">
          {/* Addresses */}
          <div className="bg-surface border border-border p-6 rounded-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
              <MapPin size={20} className="text-primary" />
              <h2 className="text-xl font-display font-medium">Kayıtlı Adresler ({user.addresses.length})</h2>
            </div>
            {user.addresses.length === 0 ? (
              <p className="text-sm text-text-secondary">Kayıtlı adres bulunmuyor.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {user.addresses.map(addr => (
                  <div key={addr.id} className="border border-border bg-bg p-3 rounded-sm flex flex-col gap-1 text-sm">
                    <span className="font-medium text-foreground">{addr.title}</span>
                    <span className="text-text-secondary">{addr.city}, {addr.district}</span>
                    <span className="text-text-secondary text-xs mt-1 truncate">{addr.fullAddress}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Favorites */}
          <div className="bg-surface border border-border p-6 rounded-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
              <Heart size={20} className="text-primary" />
              <h2 className="text-xl font-display font-medium">Favoriler ({user.favorites.length})</h2>
            </div>
            {user.favorites.length === 0 ? (
              <p className="text-sm text-text-secondary">Favorilere eklenmiş ürün yok.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {user.favorites.map(fav => (
                  <Link key={fav.id} href={`/product/${fav.product.slug}`} className="group border border-border bg-bg p-2 rounded-sm flex items-center gap-3 hover:border-primary transition-colors">
                    <img src={fav.product.images[0]?.url || 'https://via.placeholder.com/50'} alt={fav.product.name} className="w-12 h-16 object-cover rounded-sm" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">{fav.product.name}</span>
                      <span className="text-xs text-text-secondary">₺{fav.product.price.toLocaleString('tr-TR')}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
