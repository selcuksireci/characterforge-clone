import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Camera, MapPin, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { useAppData } from '@/contexts/AppDataContext.jsx'

export default function DiaryPage() {
  const { diaries } = useAppData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Av Günlüğüm</h1>
          <p className="text-sm text-slate-400">Tüm kayıtların tek ekranda, fotoğraflarla birlikte</p>
        </div>
        <Button asChild className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
          <Link to="/diary/new" className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> Yeni kayıt
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {diaries.map((entry) => (
          <Card key={entry.id} className="overflow-hidden border-slate-800 bg-slate-900/50 text-slate-100">
            {entry.photo_url ? (
              <img src={entry.photo_url} alt={entry.fish_type} className="h-48 w-full object-cover" loading="lazy" />
            ) : (
              <div className="flex h-48 w-full items-center justify-center bg-slate-950 text-slate-600">
                <Camera className="h-8 w-8" />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-lg text-white">{entry.fish_type}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <p>
                Tarih:{' '}
                <span className="text-white">
                  {format(new Date(entry.date), 'd MMMM yyyy', { locale: tr })}
                </span>
              </p>
              <p>
                Boy:{' '}
                <span className="text-white">{entry.size_cm} cm</span>
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin className="h-4 w-4" />
                {entry.lat && entry.lng ? `${entry.lat.toFixed(2)} / ${entry.lng.toFixed(2)}` : 'Konum eklenmedi'}
              </div>
            </CardContent>
          </Card>
        ))}
        {!diaries.length && (
          <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/50 p-10 text-center text-slate-400">
            <p>Henüz günlük kaydın yok. İlk avını eklemek için sağ üstteki butonu kullan!</p>
          </div>
        )}
      </div>
    </div>
  )
}
