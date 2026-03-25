'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/reset-password/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-bg flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-32 px-6">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-display font-medium text-foreground mb-4">Geçersiz Bağlantı</h1>
            <p className="text-sm text-text-secondary mb-8">Bu şifre sıfırlama bağlantısı geçersiz. Lütfen yeni bir talep oluşturun.</p>
            <Link href="/login" className="btn-primary px-8 py-4 text-sm tracking-[0.1em]">GİRİŞ SAYFASINA DÖN</Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (success) {
    return (
      <main className="min-h-screen bg-bg flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-32 px-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-green-500 text-2xl">✓</span>
            </div>
            <h1 className="text-2xl font-display font-medium text-foreground mb-4">Şifreniz Güncellendi!</h1>
            <p className="text-sm text-text-secondary mb-8">Yeni şifrenizle giriş yapabilirsiniz.</p>
            <Link href="/login" className="btn-primary px-8 py-4 text-sm tracking-[0.1em]">GİRİŞ YAP</Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-bg flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-32 px-6 border-b border-border">
        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6">
          <h1 className="text-3xl font-display font-medium text-foreground text-center mb-2">Yeni Şifre Belirle</h1>
          <p className="text-xs text-text-secondary text-center mb-6">Hesabınız için yeni bir şifre oluşturun.</p>
          
          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-sm text-sm font-medium text-center">{error}</div>}
          
          <input 
            required 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Yeni Şifre (min. 6 karakter)" 
            minLength={6}
            className="w-full bg-surface border border-border p-4 rounded-sm focus:border-primary focus:outline-none transition-colors" 
          />
          
          <button type="submit" disabled={loading} className="btn-primary w-full py-5 mt-4 text-sm tracking-[0.1em] disabled:opacity-50">
            {loading ? 'GÜNCELLENİYOR...' : 'ŞİFREYİ GÜNCELLE'}
          </button>
        </form>
      </div>
      <Footer />
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-bg flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-32">Yükleniyor...</div>
        <Footer />
      </main>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
