import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secretKey = process.env.JWT_SECRET
if (!secretKey) throw new Error('JWT_SECRET ortam değişkeni tanımlı değil!')
const key = new TextEncoder().encode(secretKey)

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('auth_token')?.value

  let session: any = null
  if (token) {
    try {
      const { payload } = await jwtVerify(token, key)
      session = payload
    } catch (err) {
      session = null
    }
  }

  // Protect /profile
  if (pathname.startsWith('/profile')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // Redirect away from login/register if already logged in
  if (pathname === '/login' || pathname === '/register') {
    if (session) {
      return NextResponse.redirect(new URL('/profile', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*', '/admin/:path*', '/login', '/register']
}
