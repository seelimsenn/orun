import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.product.delete({
      where: { id }
    })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Silme işlemi başarısız' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { name, description, price, imageUrl, category, subcategory } = await req.json()
    
    if (!name || !price || !imageUrl || !category || !subcategory) {
      return NextResponse.json({ error: 'Eksik bilgi girdiniz' }, { status: 400 })
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        imageUrl,
        category,
        subcategory
      }
    })

    return NextResponse.json(product, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Ürün güncellenemedi' }, { status: 500 })
  }
}
