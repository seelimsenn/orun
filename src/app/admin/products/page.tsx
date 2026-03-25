export const dynamic = 'force-dynamic'
import { PrismaClient } from '@prisma/client'
import { AdminProductList } from '../AdminProductList'
import Link from 'next/link'

const prisma = new PrismaClient()
export const revalidate = 0

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      variants: true,
      images: { orderBy: { order: 'asc' } }
    }
  })
  
  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-display font-medium text-foreground">Ürünleri Yönet</h2>
        <Link href="/admin/add" className="btn-primary">
          Yeni Ürün Ekle
        </Link>
      </div>
      <AdminProductList initialProducts={products} />
    </div>
  )
}
