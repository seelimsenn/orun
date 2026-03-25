import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession, clearSessionCookie } from '@/lib/auth'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function PUT(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  
  try {
    const { name, email, password } = await req.json()
    const updateData: any = { name, email }

    if (password && password.trim() !== '') {
      if (password.length < 6) {
        return NextResponse.json({ error: 'Şifre en az 6 karakter olmalıdır' }, { status: 400 })
      }
      updateData.password = await bcrypt.hash(password, 10)
    }

    const updated = await prisma.user.update({
      where: { id: (session as any).id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true }
    })
    return NextResponse.json({ success: true, user: updated })
  } catch (err) {
    return NextResponse.json({ error: 'Güncelleme başarısız veya E-Posta zaten kullanımda' }, { status: 500 })
  }
}

export async function DELETE() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  
  try {
    await prisma.user.delete({ where: { id: (session as any).id } })
    await clearSessionCookie()
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Hesap silme işlemi başarısız oldu' }, { status: 500 })
  }
}
