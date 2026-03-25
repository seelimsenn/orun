'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User as UserIcon } from 'lucide-react'

export function UserMenu() {
  const [user, setUser] = useState<{name: string} | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user)
      })
      .catch(() => {})
  }, [])

  if (!mounted) return <div className="w-8 h-8 md:w-24"></div>

  return (
    <Link href={user ? "/profile" : "/login"} className="p-2 -mr-2 text-foreground hover:text-primary transition-colors flex items-center gap-2 group">
      <UserIcon size={20} className="group-hover:text-primary transition-colors" />
      <span className="hidden md:inline text-[11px] font-bold tracking-[0.15em] uppercase group-hover:text-primary transition-colors mt-0.5 whitespace-nowrap">
        {user ? user.name.split(' ')[0] : 'Giriş Yap'}
      </span>
    </Link>
  )
}
