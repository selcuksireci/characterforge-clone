import { useState } from 'react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Camera, MessageCircle, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { useAppData } from '@/contexts/AppDataContext.jsx'
import { useAuth } from '@/contexts/AuthContext.jsx'

export default function FeedPage() {
  const { feedPosts, addFeedPost } = useAppData()
  const { user } = useAuth()
  const [form, setForm] = useState({ comment: '', photo: '' })
  const [status, setStatus] = useState(null)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.comment) {
      setStatus('Yorum ekleyin')
      return
    }
    addFeedPost({
      comment: form.comment,
      photo: form.photo,
      date: new Date().toISOString(),
      user_id: user?.email ?? 'Misafir'
    })
    setForm({ comment: '', photo: '' })
    setStatus('Gönderi paylaşıldı')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Topluluk Akışı</h1>
          <p className="text-sm text-slate-400">Anlık av fotoğrafları ve yorumlar</p>
        </div>
      </div>

      <Card className="border-slate-800 bg-slate-900/50 text-slate-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white text-base">
            <MessageCircle className="h-5 w-5 text-cyan-300" /> Yeni paylaşım
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Textarea
              name="comment"
              placeholder="Bugünkü av deneyimini paylaş..."
              className="min-h-[120px] border-slate-800 bg-slate-950 text-slate-100"
              value={form.comment}
              onChange={handleChange}
            />
            <Input
              name="photo"
              placeholder="Fotoğraf URL'si (isteğe bağlı)"
              className="border-slate-800 bg-slate-950 text-slate-100"
              value={form.photo}
              onChange={handleChange}
            />
            <Button type="submit" className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
              <Send className="mr-2 h-4 w-4" /> Paylaş
            </Button>
            {status && <p className="text-xs text-cyan-200">{status}</p>}
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {feedPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden border-slate-800 bg-slate-900/50 text-slate-100">
            {post.photo ? (
              <img src={post.photo} alt={post.comment} className="h-48 w-full object-cover" loading="lazy" />
            ) : (
              <div className="flex h-48 w-full items-center justify-center bg-slate-950 text-slate-600">
                <Camera className="h-8 w-8" />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-base text-white">{post.user_id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <p>{post.comment}</p>
              <p className="text-xs text-slate-500">
                {format(new Date(post.date), 'd MMMM yyyy', { locale: tr })}
              </p>
            </CardContent>
          </Card>
        ))}
        {!feedPosts.length && (
          <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/50 p-10 text-center text-slate-400">
            <p>İlk fotoğrafını paylaşan sen ol!</p>
          </div>
        )}
      </div>
    </div>
  )
}
