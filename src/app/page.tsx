export const dynamic = 'force-dynamic'
import { PrismaClient } from '@prisma/client'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ProductCard } from '@/components/ProductCard'
import Link from 'next/link'

const prisma = new PrismaClient()

export const revalidate = 0 

export default async function Home({ searchParams }: { searchParams: Promise<{ category?: string, subcategory?: string }> }) {
  const { category, subcategory } = await searchParams
  
  const where: any = {}
  if (category) where.category = category
  if (subcategory) where.subcategory = subcategory

  const products = await prisma.product.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    orderBy: { createdAt: 'desc' }
  })
  
  const allMagazines = await prisma.magazine.findMany({
    include: { _count: { select: { comments: true } } }
  })
  
  const popularMagazines = allMagazines
    .sort((a, b) => (b.likes + b._count.comments) - (a.likes + a._count.comments))
    .slice(0, 2)

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1462392246754-28dfa2df8e6b?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Majestic" 
            className="w-full h-full object-cover mix-blend-luminosity opacity-50 scale-105 animate-[zoomIn_25s_ease-out_forwards]" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/20 to-bg"></div>
        </div>
        <div className="container relative z-10 px-6 lg:px-12 text-center animate-on-scroll mt-12">
          <span className="text-secondary tracking-[0.4em] text-[10px] sm:text-xs uppercase mb-6 block font-medium">EVRENİN İHTİŞAMI</span>
          <h1 className="text-6xl md:text-8xl lg:text-[8rem] font-display font-medium mb-8 leading-[1.0] max-w-5xl mx-auto stagger-1 text-foreground">
            Bedenin <br/><span className="italic text-primary font-normal">Kozmik</span> Uyumu
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto text-base sm:text-lg mb-12 stagger-2">
            Eski Türkçede "Evrenin Ruhu" ve "Görkemli Yer" anlamına gelen ORUN, sadece tasarımla değil kozmik denge ile giyinmek isteyenler için yaratıldı.
          </p>
          <div className="stagger-3">
            <Link href="/search" className="btn-primary">
              Koleksiyonu Keşfet
            </Link>
          </div>
        </div>
      </section>

      {/* Collection Section */}
      <section id="collection" className="py-32 container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 animate-on-scroll">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-medium mb-4 text-foreground">En Yeniler</h2>
            <p className="text-text-secondary max-w-md">Kataloğumuza eklenen en yeni parçaları keşfedin. Yapısal ama akıcı.</p>
          </div>
          <Link href="/search" className="text-xs font-medium tracking-[0.15em] uppercase text-primary border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors mt-8 md:mt-0">
            Kataloğa Git
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>

      {/* Editöryal Dergi Bölümü */}
      <section className="py-32 bg-surface border-y border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-end mb-16 animate-on-scroll">
            <div className="max-w-2xl">
              <span className="text-primary tracking-[0.2em] text-[10px] uppercase mb-4 block font-medium">Editöryal</span>
              <h2 className="text-4xl md:text-5xl font-display mb-4 text-foreground">ORUN Dergi</h2>
              <p className="text-text-secondary text-base lg:text-lg leading-relaxed">Tasarımın arkasındaki düşünce süreçlerini ve modern lüksün manifestosunu keşfedin.</p>
            </div>
          </div>
          
          {popularMagazines.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {popularMagazines.map((mag, i) => (
                <div key={mag.id} className={`animate-on-scroll ${i % 2 !== 0 ? 'md:mt-24' : ''}`}>
                  <div className="aspect-[4/3] relative overflow-hidden rounded-sm bg-bg mb-8 border border-border">
                    <img 
                      src={mag.imageUrl} 
                      alt={mag.title} 
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-1000 ease-out mix-blend-luminosity"
                    />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-text-secondary block mb-3">{new Date(mag.createdAt).toLocaleDateString('tr-TR')}</span>
                  <h3 className="text-3xl font-display mb-4 text-foreground">{mag.title}</h3>
                  <p className="text-text-secondary text-base leading-relaxed mb-6">{mag.excerpt}</p>
                  <Link href={`/magazines/${mag.id}`} className="text-xs font-medium tracking-[0.15em] uppercase text-foreground border-b border-border pb-1 hover:text-primary hover:border-primary transition-colors">
                    Yazıyı Oku
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary">Henüz yayınlanmış bir dergi yazısı bulunmamaktadır.</p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
