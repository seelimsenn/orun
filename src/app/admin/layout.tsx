import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex font-body">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-surface p-6 flex flex-col pt-12 shrink-0">
        <h1 className="text-2xl font-display font-bold text-foreground mb-12 tracking-[-0.05em]">ORUN YÖNETİM</h1>
        <nav className="flex flex-col gap-6 text-xs font-medium tracking-[0.15em] uppercase text-text-secondary">
          <Link href="/admin" className="hover:text-primary transition-colors text-green-500 border-l border-green-500 pl-2">Gösterge Paneli</Link>
          <Link href="/admin/orders" className="hover:text-primary transition-colors">Siparişler</Link>
          <Link href="/admin/users" className="hover:text-primary transition-colors">Kullanıcılar</Link>
          <Link href="/admin/products" className="hover:text-primary transition-colors">Ürünler</Link>
          <Link href="/admin/magazines" className="hover:text-primary transition-colors">Dergiler</Link>
          <Link href="/admin/pages" className="hover:text-primary transition-colors">Sayfalar</Link>
          <Link href="/admin/add" className="hover:text-primary transition-colors">Ürün Ekle</Link>
          <div className="mt-8 pt-8 border-t border-border"></div>
          <Link href="/" className="hover:text-primary transition-colors">Siteye Dön</Link>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  )
}
