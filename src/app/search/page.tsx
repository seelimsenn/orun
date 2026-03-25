import { PrismaClient } from '@prisma/client'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { SearchResultsClient } from './SearchResultsClient'
import { CatalogFilter } from '@/components/CatalogFilter'

const prisma = new PrismaClient()

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string, category?: string, minPrice?: string, maxPrice?: string, size?: string }> }) {
  const { q = '', category, minPrice, maxPrice, size } = await searchParams
  
  // Build Prisma Where Clause dynamically based on active Store Filters
  const where: any = {}
  
  if (category && category !== 'Tümü' && category !== 'Tüm Katalog') {
    where.category = category
  }
  
  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) where.price.gte = parseFloat(minPrice)
    if (maxPrice) where.price.lte = parseFloat(maxPrice)
  }
  
  if (size) {
    where.variants = { some: { size, stock: { gt: 0 } } }
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  })

  return (
    <main className="min-h-screen bg-bg flex flex-col">
      <Navbar />
      <div className="flex-1 mt-32 mb-24">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Header Row */}
          <div className="mb-12 border-b border-border pb-8">
            <h1 className="text-3xl md:text-5xl font-display font-medium text-foreground tracking-tight">Katalog</h1>
            <p className="text-xs text-text-secondary mt-2 tracking-widest uppercase flex items-center gap-2">
               Gelişmiş Seçenekler 
               {(category || minPrice || maxPrice || size || q) && <span className="text-primary font-bold">» FİLTRELER DEVREDE</span>}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
             {/* Dynamic Filtering Sidebar Component */}
             <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-32 border border-border bg-surface p-6 rounded-sm">
               <CatalogFilter currentCategory={category} currentMin={minPrice} currentMax={maxPrice} currentSize={size} />
             </aside>
             
             {/* Unified Products Grid & Fuzzy Engine */}
             <div className="flex-1 w-full">
               <SearchResultsClient initialQuery={q} products={products} />
             </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
