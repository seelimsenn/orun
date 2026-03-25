import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json()
    if (!email || !newPassword) return NextResponse.json({ error: 'Eksik bilgi girdiniz.' }, { status: 400 })
    if (newPassword.length < 6) return NextResponse.json({ error: 'Şifre en az 6 karakter olmalıdır.' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: 'Bu e-posta adresi sistemde kayıtlı değil.' }, { status: 404 })

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Sunucu hatası: Şifre sıfırlanamadı.' }, { status: 500 })
  }
}
