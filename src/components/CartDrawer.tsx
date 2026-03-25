'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart, CartItem } from './CartContext'
import { X, Trash2 } from 'lucide-react'
import Link from 'next/link'

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, removeFromCart } = useCart()
  const total = items.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0)

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-surface border-l border-border z-[101] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-display font-medium text-foreground uppercase tracking-widest">Sepetim ({items.length})</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-text-secondary hover:text-foreground transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-text-secondary h-full text-center">
                  <p className="mb-4">Sepetiniz şu an boş.</p>
                  <button onClick={() => setIsCartOpen(false)} className="text-xs uppercase tracking-widest underline underline-offset-4 hover:text-primary">Alışverişe Devam Et</button>
                </div>
              ) : (
                items.map((item: CartItem) => (
                  <div key={item.id} className="flex gap-4 items-center border-b border-border pb-6 last:border-0 last:pb-0">
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-28 object-cover rounded-sm border border-border" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-foreground mb-1 leading-tight">{item.name}</h4>
                      {item.size && <span className="text-xs text-text-secondary uppercase tracking-[0.1em] block mb-2">Beden: {item.size}</span>}
                      <span className="text-primary font-medium text-sm block mb-1">{item.price.toLocaleString('tr-TR')} ₺ x {item.quantity}</span>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-text-secondary hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-border bg-background">
                <div className="flex justify-between items-center mb-6">
                  <span className="uppercase text-xs tracking-[0.15em] text-text-secondary">Toplam</span>
                  <span className="text-xl font-medium text-foreground">{total.toLocaleString('tr-TR')} ₺</span>
                </div>
                <Link href="/checkout" onClick={() => setIsCartOpen(false)} className="btn-primary w-full py-4 text-center text-sm tracking-[0.1em] flex justify-center uppercase">
                  Ödemeye Geç
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
