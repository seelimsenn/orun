import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { signToken, setSessionCookie } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Lütfen e-posta ve şifrenizi girin' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'Geçersiz e-posta veya şifre' }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Geçersiz e-posta veya şifre' }, { status: 401 })
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    })

    await setSessionCookie(token)

    return NextResponse.json({ success: true, user: { name: user.name, role: user.role } }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Giriş işlemi başarısız oldu' }, { status: 500 })
  }
}
