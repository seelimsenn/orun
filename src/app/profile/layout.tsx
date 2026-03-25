import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { LogoutButton } from './LogoutButton'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: (session as any).id }
  })

  if (!user) redirect('/login')

  return (
    <main className="min-h-screen bg-bg flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-6 py-32 lg:px-12 flex flex-col md:flex-row gap-12">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 p-8 border border-border bg-surface rounded-sm relative h-max">
           <div className="w-16 h-16 bg-bg rounded-full flex items-center justify-center mb-6 text-xl text-primary font-display font-bold border border-border">
              {user.name.charAt(0).toUpperCase()}
           </div>
           <h2 className="text-xl font-medium text-foreground mb-1">{user.name}</h2>
           <p className="text-xs text-text-secondary mb-8">{user.email}</p>
           
           <nav className="flex flex-col gap-4 text-sm font-medium tracking-[0.1em] uppercase text-text-secondary">
              {user.role === 'ADMIN' && (
                <Link href="/admin" className="text-primary hover:text-primary transition-colors cursor-pointer bg-primary/10 border border-primary/20 p-3 rounded text-center mb-4">
                  Yönetim Paneline Git
                </Link>
              )}
              <Link href="/profile" className="hover:text-primary transition-colors cursor-pointer">Siparişlerim</Link>
              <Link href="/profile/favorites" className="hover:text-primary transition-colors cursor-pointer">Favorilerim</Link>
              <Link href="/profile/settings" className="hover:text-primary transition-colors cursor-pointer">Hesap Ayarları</Link>
              <div className="pt-4 border-t border-border mt-4">
                 <LogoutButton />
              </div>
           </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
           {children}
        </div>

      </div>
      <Footer />
    </main>
  )
}
