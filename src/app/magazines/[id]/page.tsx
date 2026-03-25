import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { MagazineInteractive } from './MagazineInteractive'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function MagazineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const magazine = await prisma.magazine.findUnique({
    where: { id },
    include: { comments: { orderBy: { createdAt: 'desc' } } }
  })

  if (!magazine) return notFound()

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <article className="pt-32 pb-24 container mx-auto px-6 lg:px-12 max-w-4xl">
        <Link href="/magazines" className="text-[10px] font-medium tracking-widest uppercase text-text-secondary hover:text-primary transition-colors mb-8 inline-block">
          &larr; Dergilere Dön
        </Link>
        <header className="mb-12">
          <span className="text-[10px] uppercase tracking-widest text-text-secondary block mb-4">
            {new Date(magazine.createdAt).toLocaleDateString('tr-TR')}
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-medium text-foreground mb-6 leading-tight">
            {magazine.title}
          </h1>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed font-body italic border-l-2 border-primary pl-6">
            {magazine.excerpt}
          </p>
        </header>

        <div className="w-full aspect-[21/9] rounded-sm overflow-hidden mb-16 bg-surface">
          <img src={magazine.imageUrl} alt={magazine.title} className="w-full h-full object-cover mix-blend-luminosity" />
        </div>

        <div className="text-foreground font-body leading-loose mb-20 whitespace-pre-wrap text-lg">
          {magazine.content}
        </div>

        <MagazineInteractive magazineId={magazine.id} initialLikes={magazine.likes} comments={magazine.comments} />
      </article>
      <Footer />
    </main>
  )
}
