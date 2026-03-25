'use client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()
  return (
    <button 
      onClick={async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')
        router.refresh()
      }}
      className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors uppercase text-xs tracking-[0.1em]"
    >
      <LogOut size={16} /> Çıkış Yap
    </button>
  )
}
