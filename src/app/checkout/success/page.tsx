'use client'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CheckCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || 'Bilinmiyor'

  return (
    <div className="flex flex-col items-center justify-center py-20 lg:py-32 px-6 text-center">
      <CheckCircle size={80} className="text-green-500 mb-8" />
      <h1 className="text-3xl lg:text-5xl font-display font-medium text-foreground mb-4">Siparişiniz Alındı</h1>
      <p className="text-text-secondary mb-8 text-lg max-w-md mx-auto">
        Teşekkür ederiz. Siparişiniz başarıyla oluşturuldu ve en kısa sürede kargoya verilecektir.
      </p>
      
      <div className="bg-surface border border-border px-8 py-6 mb-12 rounded-sm inline-block min-w-[300px]">
        <p className="text-xs uppercase tracking-[0.15em] text-text-secondary mb-2">Sipariş Numarası</p>
        <p className="text-xl font-mono text-foreground font-medium">{orderId}</p>
      </div>

      <Link href="/" className="btn-primary px-12 py-4 tracking-[0.1em] text-sm uppercase">Ana Sayfaya Dön</Link>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-bg flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-20">
         <Suspense fallback={<div className="text-text-secondary">Yükleniyor...</div>}>
           <SuccessContent />
         </Suspense>
      </div>
      <Footer />
    </main>
  )
}
