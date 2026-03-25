import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json()
    if (!token || !newPassword) return NextResponse.json({ error: 'Eksik bilgi.' }, { status: 400 })
    if (newPassword.length < 6) return NextResponse.json({ error: 'Şifre en az 6 karakter olmalıdır.' }, { status: 400 })

    // Find valid token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!resetToken) {
      return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş bağlantı.' }, { status: 400 })
    }

    if (resetToken.used) {
      return NextResponse.json({ error: 'Bu bağlantı daha önce kullanılmış.' }, { status: 400 })
    }

    if (new Date() > resetToken.expiresAt) {
      return NextResponse.json({ error: 'Bağlantının süresi dolmuş. Lütfen yeni bir talep oluşturun.' }, { status: 400 })
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword }
    })

    // Mark token as used
    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true }
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Password reset confirm error:', err)
    return NextResponse.json({ error: 'Şifre sıfırlama başarısız oldu.' }, { status: 500 })
  }
}
