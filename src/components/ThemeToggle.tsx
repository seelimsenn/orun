'use client'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true)
    }
  }, [])

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  if (!mounted) return <div className="w-8 h-8" /> // hydration placeholder

  return (
    <button onClick={toggle} className="p-2 text-text-secondary hover:text-primary transition-colors flex items-center justify-center rounded-full border border-transparent hover:border-border" aria-label="Temayı Değiştir">
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
