'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartContext'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

type Address = { id: string, title: string, fullAddress: string, city: string, district: string, phone: string }

export default function CheckoutPage() {
  const { items, isCartOpen, setIsCartOpen, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  const [addresses, setAddresses] = useState<Address[]>([])
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', country: 'Türkiye'
  })

  useEffect(() => {
    setMounted(true)
    setIsCartOpen(false)

    // Autofill User Info visually
    fetch('/api/auth/me').then(r => r.json()).then(d => {
       if (d.user) {
         setForm(prev => ({
           ...prev,
           email: d.user.email,
           firstName: d.user.name.split(' ')[0] || '',
           lastName: d.user.name.split(' ').slice(1).join(' ') || ''
         }))
       }
    }).catch(() => {})

    // Load their address book
    fetch('/api/users/addresses').then(r => r.json()).then(d => {
       if (Array.isArray(d)) setAddresses(d)
    }).catch(() => {})

  }, [setIsCartOpen])

  useEffect(() => {
    if (mounted && items.length === 0) {
       router.push('/')
    }
  }, [items, mounted, router])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = subtotal > 1500 ? 0 : 59.90
  const total = subtotal + shippingCost

  const handleAddressSelect = (id: string) => {
    if (!id) {
       setForm(p => ({...p, phone: '', address: '', city: ''}))
       return
    }
    const addr = addresses.find(a => a.id === id)
    if (addr) {
      setForm(prev => ({
        ...prev,
        phone: addr.phone,
        address: addr.fullAddress,
        city: `${addr.district} / ${addr.city}`
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
       items,
       customerName: `${form.firstName} ${form.lastName}`,
       customerEmail: form.email,
       customerPhone: form.phone,
       shippingAddress: `${form.address}, ${form.city}/${form.country}`
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const responseData = await res.json()
      if (!res.ok) throw new Error(responseData.error)
      
      clearCart()
      router.push(`/checkout/success?orderId=${responseData.id}`)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (!mounted || items.length === 0) return null

  return (
    <main className="min-h-screen bg-bg flex flex-col">
      <Navbar />
      <div className="pt-32 pb-24 border-b border-border">
         <div className="container mx-auto px-6 lg:px-12">
            <h1 className="text-3xl lg:text-4xl font-display font-medium text-foreground tracking-tight mb-2">Ödeme Adımı</h1>
            <p className="text-text-secondary text-sm">Lütfen siparişinizi tamamlamak için bilgilerinizi girin.</p>
         </div>
      </div>

      <div className="container flex-1 mx-auto px-6 lg:px-12 py-12 mb-24">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          <form onSubmit={handleSubmit} className="w-full lg:w-2/3 flex flex-col gap-12">
             {error && (
               <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-sm text-sm font-medium">
                 {error}
               </div>
             )}
             
             <section className="flex flex-col gap-6">
               <div className="flex justify-between border-b border-border pb-4 items-end">
                 <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-foreground">Teslimat Adresi</h2>
                 {addresses.length > 0 && (
                   <select 
                     onChange={e => handleAddressSelect(e.target.value)}
                     className="bg-transparent border border-border text-xs focus:border-primary focus:outline-none p-2 rounded-sm cursor-pointer hover:bg-surface transition-colors"
                   >
                     <option value="">Kayıtlı Adreslerimden Seçin</option>
                     {addresses.map(a => (
                       <option key={a.id} value={a.id}>{a.title} ({a.city})</option>
                     ))}
                   </select>
                 )}
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input required value={form.firstName} onChange={e => setForm(p => ({...p, firstName: e.target.value}))} placeholder="Ad" className="w-full bg-surface border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
                 <input required value={form.lastName} onChange={e => setForm(p => ({...p, lastName: e.target.value}))} placeholder="Soyad" className="w-full bg-surface border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input required type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="E-Posta" className="w-full bg-surface border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
                 <input required type="tel" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} placeholder="Telefon" className="w-full bg-surface border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
               </div>
               <input required value={form.address} onChange={e => setForm(p => ({...p, address: e.target.value}))} placeholder="Tam Adres" className="w-full bg-surface border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input required value={form.city} onChange={e => setForm(p => ({...p, city: e.target.value}))} placeholder="Şehir / İlçe" className="w-full bg-surface border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
                 <input required value={form.country} onChange={e => setForm(p => ({...p, country: e.target.value}))} placeholder="Ülke" className="w-full bg-surface border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
               </div>
             </section>

             <section className="flex flex-col gap-6">
               <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-foreground border-b border-border pb-4">Ödeme Yöntemi</h2>
               <p className="text-xs text-text-secondary tracking-wide">Test ortamındasınız. Güvenli simülasyon ödemesi (Fake Credit Card) devrede.</p>
               <input required placeholder="Kart Üzerindeki İsim" className="w-full bg-surface border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
               <input required placeholder="Kart Numarası" maxLength={16} pattern="\d{16}" title="16 Haneli Kart Numarası" className="w-full bg-surface border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors font-mono" />
               <div className="grid grid-cols-2 gap-4">
                 <input required placeholder="AA/YY" maxLength={5} className="w-full bg-surface border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
                 <input required placeholder="CVC" maxLength={3} type="password" className="w-full bg-surface border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors" />
               </div>
             </section>

             <button type="submit" disabled={loading} className="btn-primary w-full py-5 text-sm tracking-[0.1em] disabled:opacity-50">
               {loading ? 'ÖDEME İŞLENİYOR...' : 'SİPARİŞİ ONAYLA VE ÖDE'}
             </button>
          </form>

          <div className="w-full lg:w-1/3 bg-surface border border-border p-8 sticky top-32 rounded-sm shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-foreground mb-8">Sipariş Özeti</h3>
            
            <div className="flex flex-col gap-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {items.map(item => (
                 <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-bg relative overflow-hidden flex-shrink-0">
                       <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex flex-col justify-center gap-1 flex-1">
                       <span className="text-xs font-medium text-foreground line-clamp-1">{item.name}</span>
                       <span className="text-[10px] text-text-secondary">Adet: {item.quantity} {item.size ? `| Beden: ${item.size}` : ''}</span>
                    </div>
                    <div className="flex flex-col justify-center font-medium text-sm text-primary flex-shrink-0">
                       {item.price.toLocaleString('tr-TR')} ₺
                    </div>
                 </div>
              ))}
            </div>

            <div className="border-t border-border pt-6 flex flex-col gap-4 text-sm">
               <div className="flex justify-between text-text-secondary">
                 <span>Ara Toplam</span>
                 <span>{subtotal.toLocaleString('tr-TR')} ₺</span>
               </div>
               <div className="flex justify-between text-text-secondary">
                 <span>Kargo Tutarı</span>
                 <span>{shippingCost === 0 ? 'Ücretsiz' : `${shippingCost.toLocaleString('tr-TR')} ₺`}</span>
               </div>
               <div className="flex justify-between text-foreground text-lg font-bold border-t border-border pt-4 mt-2">
                 <span>Toplam</span>
                 <span className="text-primary">{total.toLocaleString('tr-TR')} ₺</span>
               </div>
            </div>
             {shippingCost > 0 && (
               <p className="text-[10px] text-text-secondary mt-6 text-center">
                 {Math.max(1500 - subtotal, 0).toLocaleString('tr-TR')} ₺ daha alışveriş yapın, kargo bedava olsun!
               </p>
             )}
          </div>

        </div>
      </div>
      <Footer />
    </main>
  )
}
