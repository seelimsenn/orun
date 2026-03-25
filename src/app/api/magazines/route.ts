import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const mags = await prisma.magazine.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(mags)
  } catch (e) {
    return NextResponse.json({ error: 'Getirilemedi' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const mag = await prisma.magazine.create({ data })
    return NextResponse.json(mag)
  } catch (e) {
    return NextResponse.json({ error: 'Ekleme başarısız' }, { status: 500 })
  }
}
