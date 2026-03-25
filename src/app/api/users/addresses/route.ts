import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json([], { status: 401 })
  
  const addresses = await prisma.address.findMany({
    where: { userId: (session as any).id },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(addresses)
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Lütfen giriş yapın' }, { status: 401 })
  
  try {
    const { title, city, district, phone, fullAddress } = await req.json()
    const addr = await prisma.address.create({
      data: { 
        userId: (session as any).id, 
        title, city, district, phone, fullAddress 
      }
    })
    return NextResponse.json(addr)
  } catch (err) {
    return NextResponse.json({ error: 'Adres eklenemedi' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Lütfen giriş yapın' }, { status: 401 })
  
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID eksik' }, { status: 400 })
    
    await prisma.address.delete({
      where: { id, userId: (session as any).id }
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Adres silinemedi' }, { status: 500 })
  }
}
