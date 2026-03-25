import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json([], { status: 401 })
  
  const favorites = await prisma.favorite.findMany({
    where: { userId: (session as any).id },
    include: { product: true }
  })
  return NextResponse.json(favorites)
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Lütfen giriş yapın' }, { status: 401 })
  
  try {
    const { productId } = await req.json()
    const fav = await prisma.favorite.create({
      data: { userId: (session as any).id, productId }
    })
    return NextResponse.json(fav)
  } catch (err) {
    return NextResponse.json({ error: 'Zaten favorilerinizde ekli' }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Lütfen giriş yapın' }, { status: 401 })
  
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')
    if (!productId) return NextResponse.json({ error: 'Ürün ID zorunlu' }, { status: 400 })
    
    await prisma.favorite.delete({
      where: { userId_productId: { userId: (session as any).id, productId } }
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Favorilerde bulunamadı' }, { status: 400 })
  }
}
