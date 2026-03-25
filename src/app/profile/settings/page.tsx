'use client'
import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

type Address = { id: string, title: string, fullAddress: string, city: string, district: string, phone: string }

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState({ name: '', email: '', password: '' })
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [newAddr, setNewAddr] = useState({ title: '', city: '', district: '', phone: '', fullAddress: '' })
  const [addrLoading, setAddrLoading] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.user) setUser({ name: d.user.name, email: d.user.email, password: '' })
    })
    fetch('/api/users/addresses').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setAddresses(d)
    })
  }, [])

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(''); setSuccess('')
    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setSuccess('Profil ve güvenlik bilgileri güncellendi')
      setUser(prev => ({ ...prev, password: '' })) 
      router.refresh()
    } catch(err:any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAddress = async (e: FormEvent) => {
    e.preventDefault()
    setAddrLoading(true)
    try {
      const res = await fetch('/api/users/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddr)
      })
      if (res.ok) {
        setAddresses([await res.json(), ...addresses])
        setNewAddr({ title: '', city: '', district: '', phone: '', fullAddress: '' })
      }
    } finally {
      setAddrLoading(false)
    }
  }

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Bu adresi silmek istediğinize emin misiniz?')) return
    await fetch(`/api/users/addresses?id=${id}`, { method: 'DELETE' })
    setAddresses(addresses.filter(a => a.id !== id))
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Hesabınızı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem kesinlikle geri alınamaz!')) return
    try {
      await fetch('/api/users/me', { method: 'DELETE' })
      router.push('/login')
      router.refresh()
    } catch(err) {
      alert('Bir hata oluştu')
    }
  }

  if (!user.email) return <div className="animate-pulse w-full max-w-md h-64 bg-surface rounded-sm"></div>

  return (
    <div className="flex flex-col gap-12">
       <div>
         <h1 className="text-2xl font-display font-medium text-foreground mb-8">Hesap Ayarları</h1>
         
         <form onSubmit={handleUpdate} className="flex flex-col gap-6 max-w-md">
            {error && <div className="p-4 bg-red-500/10 text-red-500 text-sm border border-red-500/20">{error}</div>}
            {success && <div className="p-4 bg-green-500/10 text-green-500 text-sm border border-green-500/20">{success}</div>}
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold tracking-[0.1em] uppercase text-text-secondary">Ad Soyad</label>
              <input required value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="bg-surface border border-border p-4 text-sm focus:border-primary focus:outline-none transition-colors" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold tracking-[0.1em] uppercase text-text-secondary">E-Posta</label>
              <input required type="email" value={user.email} onChange={e => setUser({...user, email: e.target.value})} className="bg-surface border border-border p-4 text-sm focus:border-primary focus:outline-none transition-colors" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold tracking-[0.1em] uppercase text-text-secondary">Yeni Şifre (İsteğe Bağlı)</label>
              <input type="password" placeholder="Şifrenizi değiştirmek için doldurun" value={user.password} onChange={e => setUser({...user, password: e.target.value})} className="bg-surface border border-border p-4 text-sm focus:border-primary focus:outline-none transition-colors placeholder:text-text-secondary/50" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary py-4 text-xs font-bold tracking-[0.1em] mt-2 disabled:opacity-50">
              {loading ? 'KAYDEDİLİYOR...' : 'DEĞİŞİKLİKLERİ KAYDET'}
            </button>
         </form>
       </div>

       {/* Address Book */}
       <div className="pt-8 border-t border-border">
          <h2 className="text-xl font-medium text-foreground mb-6">Adres Defteri</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {addresses.map(addr => (
              <div key={addr.id} className="border border-border bg-surface p-6 rounded-sm relative">
                <button onClick={() => handleDeleteAddress(addr.id)} type="button" className="absolute top-6 right-6 text-xs text-red-500 font-bold uppercase hover:text-red-400">SİL</button>
                <h3 className="text-sm font-bold text-foreground mb-2">{addr.title}</h3>
                <p className="text-xs text-text-secondary mb-1">{addr.city} / {addr.district}</p>
                <p className="text-xs text-text-secondary mb-3 leading-relaxed">{addr.fullAddress}</p>
                <p className="text-xs font-mono text-foreground">{addr.phone}</p>
              </div>
            ))}
            
            {addresses.length === 0 && (
              <div className="col-span-full text-center py-12 border border-border border-dashed text-sm text-text-secondary">
                Henüz kayıtlı bir adresiniz bulunmamaktadır.
              </div>
            )}
          </div>

          <form onSubmit={handleAddAddress} className="max-w-2xl bg-surface border border-border p-6 rounded-sm flex flex-col gap-6">
            <h3 className="text-sm font-bold text-foreground">Yeni Adres Ekle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-[0.1em] uppercase text-text-secondary">Adres Başlığı (Örn: Ev)</label>
                <input required value={newAddr.title} onChange={e => setNewAddr({...newAddr, title: e.target.value})} className="bg-bg border border-border p-3 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-[0.1em] uppercase text-text-secondary">Telefon</label>
                <input required value={newAddr.phone} onChange={e => setNewAddr({...newAddr, phone: e.target.value})} className="bg-bg border border-border p-3 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-[0.1em] uppercase text-text-secondary">İl</label>
                <input required value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} className="bg-bg border border-border p-3 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-[0.1em] uppercase text-text-secondary">İlçe</label>
                <input required value={newAddr.district} onChange={e => setNewAddr({...newAddr, district: e.target.value})} className="bg-bg border border-border p-3 text-sm focus:border-primary focus:outline-none" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold tracking-[0.1em] uppercase text-text-secondary">Açık Adres</label>
              <textarea required rows={2} value={newAddr.fullAddress} onChange={e => setNewAddr({...newAddr, fullAddress: e.target.value})} className="bg-bg border border-border p-3 text-sm focus:border-primary focus:outline-none resize-none" />
            </div>
            <button type="submit" disabled={addrLoading} className="px-6 py-3 bg-foreground text-background text-xs font-bold tracking-[0.1em] hover:bg-primary transition-colors disabled:opacity-50 self-start">
              {addrLoading ? 'EKLENİYOR...' : 'ADRESİ KAYDET'}
            </button>
          </form>
       </div>

       <div className="pt-8 border-t border-border mt-12 max-w-md">
          <h2 className="text-lg font-medium text-red-500 mb-2">Tehlikeli Bölge</h2>
          <p className="text-xs text-text-secondary mb-6">Hesabınızı silerseniz, tüm geçmiş siparişleriniz ve favorileriniz kalıcı olarak silinir. Bu işlemi geri alamazsınız.</p>
          <button onClick={handleDeleteAccount} type="button" className="px-6 py-3 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-xs font-bold tracking-[0.1em]">
            HESABIMI KALICI OLARAK SİL
          </button>
       </div>
    </div>
  )
}
