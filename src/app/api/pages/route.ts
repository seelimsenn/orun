import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  const pages = await prisma.page.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(pages)
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const page = await prisma.page.create({ data })
    return NextResponse.json(page)
  } catch (e) {
    return NextResponse.json({ error: 'Ekleme başarısız' }, { status: 500 })
  }
}
