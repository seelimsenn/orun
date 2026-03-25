'use client'
import Link from 'next/link'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { ShoppingBag, Menu, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { useCart } from './CartContext'
import { SearchOverlay } from './SearchOverlay'
import { UserMenu } from './UserMenu'

export function Navbar() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { items, setIsCartOpen } = useCart()

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    if (latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
  })

  // Calculate cart items total correctly over hydration to prevent flicker
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <motion.nav 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 w-full z-50 py-4 md:py-6 backdrop-blur-md bg-background/80 border-b border-border"
    >
      <div className="container flex items-center justify-between mx-auto px-4 md:px-8">
        <div className="flex items-center gap-6 flex-1">
          <button className="md:hidden"><Menu size={24} className="text-foreground" /></button>
          <div className="hidden md:flex h-full items-center gap-8 text-[11px] font-medium tracking-[0.15em] uppercase text-text-secondary">
                        
            <div className="group relative h-full flex items-center">
              <Link href="/search?category=Kadın" className="hover:text-primary transition-colors py-6">KADIN</Link>
              <div className="absolute top-[80%] left-0 w-48 bg-surface border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-2xl flex flex-col py-2 z-50">
                <Link href="/search?category=Kadın&subcategory=Dış%20Giyim" className="px-6 py-3 hover:bg-bg hover:text-primary transition-colors">Dış Giyim</Link>
                <Link href="/search?category=Kadın&subcategory=Elbise" className="px-6 py-3 hover:bg-bg hover:text-primary transition-colors">Elbise</Link>
                <Link href="/search?category=Kadın&subcategory=Triko" className="px-6 py-3 hover:bg-bg hover:text-primary transition-colors">Triko</Link>
                <Link href="/search?category=Kadın&subcategory=Alt%20Giyim" className="px-6 py-3 hover:bg-bg hover:text-primary transition-colors">Alt Giyim</Link>
              </div>
            </div>

            <div className="group relative h-full flex items-center">
              <Link href="/search?category=Erkek" className="hover:text-primary transition-colors py-6">ERKEK</Link>
              <div className="absolute top-[80%] left-0 w-48 bg-surface border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-2xl flex flex-col py-2 z-50">
                <Link href="/search?category=Erkek&subcategory=Dış%20Giyim" className="px-6 py-3 hover:bg-bg hover:text-primary transition-colors">Dış Giyim</Link>
                <Link href="/search?category=Erkek&subcategory=Gömlek" className="px-6 py-3 hover:bg-bg hover:text-primary transition-colors">Gömlek</Link>
                <Link href="/search?category=Erkek&subcategory=Triko" className="px-6 py-3 hover:bg-bg hover:text-primary transition-colors">Triko</Link>
                <Link href="/search?category=Erkek&subcategory=Pantolon" className="px-6 py-3 hover:bg-bg hover:text-primary transition-colors">Pantolon</Link>
              </div>
            </div>

            <div className="group relative h-full flex items-center">
              <Link href="/search?category=Genç" className="hover:text-primary transition-colors py-6">GENÇ</Link>
              <div className="absolute top-[80%] left-0 w-48 bg-surface border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-2xl flex flex-col py-2 z-50">
                <Link href="/search?category=Genç&subcategory=Sokak%20Giyimi" className="px-6 py-3 hover:bg-bg hover:text-primary transition-colors">Sokak Giyimi</Link>
                <Link href="/search?category=Genç&subcategory=Spor" className="px-6 py-3 hover:bg-bg hover:text-primary transition-colors">Spor</Link>
              </div>
            </div>

            <div className="group relative h-full flex items-center">
              <Link href="/search?category=Çocuk" className="hover:text-primary transition-colors py-6">ÇOCUK</Link>
              <div className="absolute top-[80%] left-0 w-48 bg-surface border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-2xl flex flex-col py-2 z-50">
                <Link href="/search?category=Çocuk&subcategory=Günlük" className="px-6 py-3 hover:bg-bg hover:text-primary transition-colors">Günlük</Link>
                <Link href="/search?category=Çocuk&subcategory=Dış%20Giyim" className="px-6 py-3 hover:bg-bg hover:text-primary transition-colors">Dış Giyim</Link>
              </div>
            </div>

            <div className="group relative h-full flex items-center">
              <Link href="/search?category=Aksesuar" className="hover:text-primary transition-colors py-6">AKSESUAR</Link>
              <div className="absolute top-[80%] left-0 w-48 bg-surface border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-2xl flex flex-col py-2 z-50">
                <Link href="/search?category=Aksesuar&subcategory=Çanta" className="px-6 py-3 hover:bg-bg hover:text-primary transition-colors">Çanta</Link>
                <Link href="/search?category=Aksesuar&subcategory=Gözlük" className="px-6 py-3 hover:bg-bg hover:text-primary transition-colors">Gözlük</Link>
                <Link href="/search?category=Aksesuar&subcategory=Takı" className="px-6 py-3 hover:bg-bg hover:text-primary transition-colors">Takı</Link>
              </div>
            </div>

            <Link href="/magazines" className="hover:text-primary transition-colors py-6">DERGİ</Link>
          </div>
        </div>
        
        <Link href="/" className="text-3xl font-bold tracking-[-0.05em] text-foreground font-display select-none">
          ORUN
        </Link>
        
        <div className="flex items-center gap-4 sm:gap-6 flex-1 justify-end">
          <ThemeToggle />
          <UserMenu />
          <button onClick={() => setIsSearchOpen(true)} className="p-2 -mr-2 text-foreground hover:text-primary transition-colors"><Search size={20} /></button>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 group p-2 -mr-2 text-foreground hover:text-primary transition-colors relative"
          >
            <ShoppingBag size={22} className="group-hover:text-primary transition-colors" />
            <span className="hidden md:inline text-[11px] font-bold tracking-[0.15em] uppercase group-hover:text-primary transition-colors mt-0.5">Sepetim</span>
            {mounted && cartItemCount > 0 && (
              <span className="absolute top-1 right-0 md:right-auto md:left-5 w-4 h-4 bg-primary text-background text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </motion.nav>
  )
}
