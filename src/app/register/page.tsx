'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Kayıt Başarısız')
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
         <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6">
           <h1 className="text-3xl font-display font-medium text-foreground text-center mb-2">Hesap Oluştur</h1>
           <p className="text-center text-text-secondary text-sm mb-8">Avantajlı alışverişin keyfini çıkarın.</p>
           
           {error && (
             <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-sm text-sm font-medium text-center">
               {error}
             </div>
           )}

           <div className="flex flex-col gap-4">
             <input required name="name" placeholder="Ad Soyad" className="w-full bg-surface border border-border p-4 rounded-sm focus:border-primary focus:outline-none transition-colors" />
             <input required type="email" name="email" placeholder="E-Posta" className="w-full bg-surface border border-border p-4 rounded-sm focus:border-primary focus:outline-none transition-colors" />
             <input required type="password" name="password" placeholder="Şifre" className="w-full bg-surface border border-border p-4 rounded-sm focus:border-primary focus:outline-none transition-colors" />
           </div>

           <button type="submit" disabled={loading} className="btn-primary w-full py-5 mt-4 text-sm tracking-[0.1em] disabled:opacity-50">
             {loading ? 'KAYIT YAPILIYOR...' : 'KAYIT OL'}
           </button>

           <div className="text-center mt-6 text-sm text-text-secondary">
             Zaten hesabınız var mı? <Link href="/login" className="text-foreground border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors">Giriş Yapın</Link>
           </div>
         </form>
      </div>
      <Footer />
    </main>
  )
}
