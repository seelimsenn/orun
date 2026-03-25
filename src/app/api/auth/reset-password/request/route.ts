import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'E-posta adresi gereklidir.' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      // Security: Don't reveal if email exists
      return NextResponse.json({ success: true })
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Invalidate any previous tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true }
    })

    // Create new token
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    })

    // Send email
    await sendPasswordResetEmail(email, token)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Password reset request error:', err)
    return NextResponse.json({ error: 'İşlem başarısız oldu. Tekrar deneyin.' }, { status: 500 })
  }
}
