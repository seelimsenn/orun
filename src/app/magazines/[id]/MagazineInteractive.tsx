'use client'
import { useState } from 'react'
import { Heart, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function MagazineInteractive({ magazineId, initialLikes, comments }: { magazineId: string, initialLikes: number, comments: any[] }) {
  const [likes, setLikes] = useState(initialLikes)
  const [hasLiked, setHasLiked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const router = useRouter()

  const handleLike = async () => {
    if (hasLiked) return
    setHasLiked(true)
    setLikes(l => l + 1)
    await fetch(`/api/magazines/${magazineId}/like`, { method: 'POST' })
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!author || !content) return
    
    setIsSubmitting(true)
    const res = await fetch(`/api/magazines/${magazineId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, content })
    })
    
    setIsSubmitting(false)
    if (res.ok) {
      setAuthor('')
      setContent('')
      router.refresh()
    }
  }

  return (
    <div className="border-t border-border pt-12 mt-12">
      <div className="flex items-center justify-between mb-12">
        <h3 className="text-2xl font-display font-medium text-foreground">Etkileşim</h3>
        <button 
          onClick={handleLike} 
          disabled={hasLiked}
          className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all ${
            hasLiked ? 'border-primary bg-primary text-bg' : 'border-border text-foreground hover:border-primary hover:text-primary'
          }`}
        >
          <Heart size={20} className={hasLiked ? 'fill-current' : ''} />
          <span className="font-medium text-sm">{likes} Beğeni</span>
        </button>
      </div>

      <div className="mb-12">
        <h4 className="text-lg font-medium text-foreground mb-6 flex items-center gap-2">
          <MessageSquare size={20} className="text-text-secondary" /> 
          Yorumlar ({comments.length})
        </h4>
        
        <div className="space-y-6 mb-10">
          {comments.map(c => (
            <div key={c.id} className="bg-surface border border-border p-6 rounded-sm">
              <div className="flex justify-between items-center mb-3 text-sm">
                <span className="font-medium text-foreground">{c.author}</span>
                <span className="text-text-secondary text-[10px] uppercase tracking-widest">{new Date(c.createdAt).toLocaleDateString('tr-TR')}</span>
              </div>
              <p className="text-text-secondary whitespace-pre-wrap text-sm leading-relaxed">{c.content}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-text-secondary text-sm italic">İlk yorumu siz yapın, düşüncelerinizi paylaşın.</p>
          )}
        </div>

        <form onSubmit={handleComment} className="bg-surface border border-border p-6 md:p-8 rounded-sm flex flex-col gap-4">
          <h5 className="font-medium text-foreground text-sm uppercase tracking-widest mb-2">Yorum Bırak</h5>
          <input 
            type="text" 
            placeholder="İsminiz" 
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors text-sm text-foreground"
          />
          <textarea 
            placeholder="Yorumunuz (İlham aldıklarınızı paylaşın...)" 
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-bg border border-border p-3 rounded-sm focus:border-primary focus:outline-none transition-colors text-sm text-foreground"
          />
          <div className="flex justify-end mt-2">
            <button type="submit" disabled={isSubmitting} className="btn-primary py-3 px-8 !text-sm">
              {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
