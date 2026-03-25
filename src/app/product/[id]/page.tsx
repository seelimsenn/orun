export const dynamic = 'force-dynamic'
import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AddToCartSection } from '@/components/AddToCartSection'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const prisma = new PrismaClient()

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: 'asc' } },
      variants: true
    }
  })

  if (!product) {
    return notFound()
  }

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <div className="pt-24 pb-16 md:pt-32">
        <div className="container mx-auto px-6 lg:px-12 flex items-center text-[10px] uppercase tracking-[0.15em] text-text-secondary mb-8 gap-2">
          <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
          <ChevronRight size={12} />
          <span>{product.category}</span>
          <ChevronRight size={12} />
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="container mx-auto px-0 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16">
          {/* Image Gallery (Zara Style Grid) */}
          <div className="w-full flex-1 flex flex-col gap-1 lg:grid lg:grid-cols-2 lg:gap-1">
            {product.images.map((img) => (
              <div key={img.id} className="aspect-[3/4] bg-surface relative overflow-hidden">
                <img 
                  src={img.url} 
                  alt={img.alt || product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-105"
                />
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="p-6 lg:p-0 flex flex-col pt-12 lg:py-12">
            <div className="mb-8">
              <h1 className="text-3xl lg:text-5xl font-display font-medium text-foreground mb-4 leading-tight">{product.name}</h1>
              <p className="text-xl font-medium text-primary mb-8">{product.price.toLocaleString('tr-TR')} ₺</p>
              
              <p className="text-text-secondary leading-relaxed text-base mb-10">
                {product.description}
              </p>

              <AddToCartSection product={product} />

              {/* Accordions (Simulated Visual Details) */}
              <div className="mt-16 border-t border-border divide-y divide-border text-sm">
                <div className="py-6">
                  <h3 className="font-medium uppercase tracking-[0.1em] text-foreground mb-4">Kumaş ve Bakım</h3>
                  <p className="text-text-secondary leading-relaxed">Sadece kuru temizleme. Doğrudan güneş ışığından uzak, serin ve kuru bir yerde saklayın. Tasarımın yapısal bütünlüğünü korumak için doğal formunda asın.</p>
                </div>
                <div className="py-6">
                  <h3 className="font-medium uppercase tracking-[0.1em] text-foreground mb-4">Kargo ve İade</h3>
                  <p className="text-text-secondary leading-relaxed">Tüm siparişlerde ücretsiz standart kargo. Ürün elinize ulaştıktan sonraki 14 gün içinde, ürün kullanılmamış ve orijinal ambalajında ise ücretsiz iade imkanı sunulur.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
