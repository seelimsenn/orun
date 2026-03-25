import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { author, content } = await req.json()

    if (!author || !content) {
      return NextResponse.json({ error: 'Eksik bilgi' }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        author,
        content,
        magazineId: id
      }
    })
    return NextResponse.json({ success: true, comment })
  } catch (error) {
    return NextResponse.json({ error: 'Yorum eklenemedi' }, { status: 500 })
  }
}
