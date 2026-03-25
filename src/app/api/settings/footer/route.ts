import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const customSignature = await prisma.page.findUnique({
      where: { slug: 'footer-signature' }
    })
    return NextResponse.json({ signature: customSignature?.content || 'Made with ❤ by Merve Bulut & Selim Şen' })
  } catch (err) {
    return NextResponse.json({ signature: 'Made with ❤ by Merve Bulut & Selim Şen' })
  }
}
