'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isReset, setIsReset] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Giriş Başarısız')
      }

      router.push('/profile')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-bg flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-32 px-6 border-b border-border">
         {isReset ? (
           <form onSubmit={async (e) => {
             e.preventDefault()
             setLoading(true); setError(''); setResetSuccess(false)
             const email = new FormData(e.currentTarget).get('email') as string
             try {
               const res = await fetch('/api/auth/reset-password/request', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ email })
               })
               if (!res.ok) throw new Error((await res.json()).error)
               setResetSuccess(true)
               setIsReset(false)
             } catch (err: any) {
               setError(err.message)
             } finally {
               setLoading(false)
             }
           }} className="w-full max-w-md flex flex-col gap-6">
             <h1 className="text-3xl font-display font-medium text-foreground text-center mb-2">Şifremi Unuttum</h1>
             <p className="text-xs text-text-secondary text-center mb-6">Kayıtlı e-posta adresinize şifre sıfırlama bağlantısı göndereceğiz.</p>
             
             {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-sm text-sm font-medium text-center">{error}</div>}
             
             <input required type="email" name="email" placeholder="E-Posta Adresiniz" className="w-full bg-surface border border-border p-4 rounded-sm focus:border-primary focus:outline-none transition-colors" />
             
             <button type="submit" disabled={loading} className="btn-primary w-full py-5 mt-4 text-sm tracking-[0.1em] disabled:opacity-50">
               {loading ? 'GÖNDERİLİYOR...' : 'SIFIRLAMA BAĞLANTISI GÖNDER'}
             </button>
             
             <button type="button" onClick={() => { setIsReset(false); setError('') }} className="text-center text-xs text-text-secondary hover:text-foreground">
               Giriş Ekranına Dön
             </button>
           </form>
         ) : (
           <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6">
             <h1 className="text-3xl font-display font-medium text-foreground text-center mb-8">Giriş Yap</h1>
             
             {resetSuccess && <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-sm text-sm font-medium text-center">Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.</div>}
             {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-sm text-sm font-medium text-center">{error}</div>}

             <div className="flex flex-col gap-4">
               <input required type="email" name="email" placeholder="E-Posta" className="w-full bg-surface border border-border p-4 rounded-sm focus:border-primary focus:outline-none transition-colors" />
               <div className="relative">
                 <input required type="password" name="password" placeholder="Şifre" className="w-full bg-surface border border-border p-4 rounded-sm focus:border-primary focus:outline-none transition-colors" />
                 <button type="button" onClick={() => setIsReset(true)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-text-secondary uppercase tracking-widest font-bold hover:text-primary">Unuttum</button>
               </div>
             </div>

             <button type="submit" disabled={loading} className="btn-primary w-full py-5 mt-4 text-sm tracking-[0.1em] disabled:opacity-50">
               {loading ? 'GİRİŞ YAPILIYOR...' : 'GİRİŞ YAP'}
             </button>

             <div className="text-center mt-6 text-sm text-text-secondary">
               Hesabınız yok mu? <Link href="/register" className="text-foreground border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors">Hesap Oluşturun</Link>
             </div>
           </form>
         )}
      </div>
      <Footer />
    </main>
  )
}
