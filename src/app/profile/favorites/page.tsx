export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'
import { ProductCard } from '@/components/ProductCard'

const prisma = new PrismaClient()

export default async function FavoritesPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const favorites = await prisma.favorite.findMany({
    where: { userId: (session as any).id },
    include: { product: true }
  })

  return (
    <div>
       <h1 className="text-2xl font-display font-medium text-foreground mb-8">Favorilerim ({favorites.length})</h1>
       
       {favorites.length === 0 ? (
         <div className="text-center py-16 text-sm text-text-secondary border border-border border-dashed rounded-sm">
            Favorilerinizde henüz ürün yok.
         </div>
       ) : (
         <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
           {favorites.map((fav, i) => (
             <ProductCard key={fav.id} product={fav.product} index={i} />
           ))}
         </div>
       )}
    </div>
  )
}
