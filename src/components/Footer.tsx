'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export function Footer() {
  const [signatureText, setSignatureText] = useState('Made with ❤ by Merve Bulut & Selim Şen')

  useEffect(() => {
    fetch('/api/settings/footer')
      .then(res => res.json())
      .then(data => {
        if (data.signature) setSignatureText(data.signature)
      })
      .catch(() => {})
  }, [])

  return (
    <footer className="border-t border-border mt-32 py-16 bg-surface">
      <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-3xl font-display font-bold mb-6">ORUN</h2>
          <p className="text-text-secondary max-w-sm mb-4 leading-relaxed">
            Modern lüksü yeniden tanımlıyoruz. Yüksek estetik ve sürekli evrim için bir platform.
          </p>
          <div className="flex flex-col gap-1 mt-6">
            <p className="text-foreground text-xs md:text-sm font-medium tracking-widest flex items-center gap-1.5">
              {signatureText.includes('❤') ? (
                <>
                  {signatureText.split('❤')[0]} <span className="text-red-500 animate-pulse text-lg">❤</span> {signatureText.split('❤')[1]}
                </>
              ) : (
                signatureText
              )}
            </p>
            <p className="text-text-secondary text-[10px] tracking-[0.2em] uppercase mt-2">© 2026 ORUN Studios. Tüm Hakları Saklıdır.</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold uppercase tracking-[0.15em] text-xs mb-6 text-foreground">KURUMSAL</h4>
          <ul className="flex flex-col gap-4 text-text-secondary text-sm">
            <li><Link href="/pages/hakkimizda" className="hover:text-primary transition-colors">Hakkımızda</Link></li>
            <li><Link href="/pages/kurumsal" className="hover:text-primary transition-colors">Marka Konsepti</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold uppercase tracking-[0.15em] text-xs mb-6 text-foreground">DESTEK</h4>
          <ul className="flex flex-col gap-4 text-text-secondary text-sm">
            <li><Link href="/pages/iletisim" className="hover:text-primary transition-colors">İletişim & Konum</Link></li>
            <li><Link href="/pages/destek" className="hover:text-primary transition-colors">Müşteri Hizmetleri</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
