import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const updated = await prisma.magazine.update({
      where: { id },
      data: { likes: { increment: 1 } }
    })
    return NextResponse.json({ success: true, likes: updated.likes })
  } catch (error) {
    return NextResponse.json({ error: 'Beğeni başarısız' }, { status: 500 })
  }
}
