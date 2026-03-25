import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import EditProductForm from './EditProductForm'

const prisma = new PrismaClient()

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: 'asc' } },
      variants: true
    }
  })

  if (!product) return notFound()

  return (
    <div className="max-w-2xl bg-surface p-8 border border-border rounded-sm">
      <h2 className="text-3xl font-display font-medium text-foreground mb-8">Ürünü Düzenle</h2>
      <EditProductForm product={product} />
    </div>
  )
}
