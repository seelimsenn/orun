export const dynamic = 'force-dynamic'
import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const prisma = new PrismaClient()

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const page = await prisma.page.findUnique({
    where: { slug }
  })

  if (!page) return notFound()

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <article className="pt-32 pb-24 container mx-auto px-6 lg:px-12 max-w-3xl flex-1 mt-12">
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-medium text-foreground mb-6">
            {page.title}
          </h1>
          <div className="w-12 h-[1px] bg-primary mx-auto"></div>
        </header>

        <div className="prose prose-lg dark:prose-invert prose-p:text-text-secondary prose-headings:text-foreground max-w-none text-foreground font-body leading-loose whitespace-pre-wrap">
          {page.content}
        </div>
      </article>
      <Footer />
    </main>
  )
}
