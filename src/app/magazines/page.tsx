import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const prisma = new PrismaClient()
export const revalidate = 0

export default async function MagazinesPage({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
  const { sort = 'popular' } = await searchParams

  const magazines = await prisma.magazine.findMany({
    include: { _count: { select: { comments: true } } },
    orderBy: sort === 'newest' ? { createdAt: 'desc' } : sort === 'oldest' ? { createdAt: 'asc' } : undefined
  })

  if (sort === 'popular') {
    magazines.sort((a, b) => (b.likes + b._count.comments) - (a.likes + a._count.comments))
  }

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <div className="pt-32 pb-16 container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-primary tracking-[0.2em] text-[10px] uppercase mb-4 block font-medium">ORUN</span>
            <h1 className="text-5xl md:text-6xl font-display text-foreground mb-4">Dergiler</h1>
            <p className="text-text-secondary text-base lg:text-lg">Koleksiyonlarımızın ardındaki felsefe, ilham kaynakları ve tasarım notları.</p>
          </div>
          
          <form className="flex gap-2 text-sm z-10 relative">
            <label className="text-text-secondary self-center mr-2 uppercase tracking-widest text-[10px] font-medium">Sırala:</label>
            <select name="sort" defaultValue={sort} onChange={undefined} className="bg-surface border border-border text-foreground px-4 py-2 rounded-sm focus:outline-none focus:border-primary">
              <option value="popular">En Popüler</option>
              <option value="newest">En Yeniden Eskiye</option>
              <option value="oldest">En Eskiden Yeniye</option>
            </select>
            <button type="submit" className="hidden">Uygula</button>
          </form>
        </div>

        {magazines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {magazines.map((mag, i) => (
              <Link href={`/magazines/${mag.id}`} key={mag.id} className="group block animate-on-scroll" style={{ animationDelay: `${(i % 3) * 0.15}s` }}>
                <div className="aspect-[4/3] bg-surface rounded-sm mb-6 overflow-hidden">
                  <img src={mag.imageUrl} alt={mag.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-luminosity" />
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-text-secondary mb-3">
                  <span>{new Date(mag.createdAt).toLocaleDateString('tr-TR')}</span>
                  <span className="flex gap-3">
                    <span className="flex gap-1 items-center"><span>♥️</span> <span>{mag.likes}</span></span>
                    <span className="flex gap-1 items-center"><span>💬</span> <span>{mag._count.comments}</span></span>
                  </span>
                </div>
                <h3 className="text-2xl font-display font-medium text-foreground mb-3 group-hover:text-primary transition-colors">{mag.title}</h3>
                <p className="text-text-secondary line-clamp-2 leading-relaxed">{mag.excerpt}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-text-secondary">Henüz dergi içeriği bulunmuyor.</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
