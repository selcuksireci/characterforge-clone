import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Anchor, ThermometerSun, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { useAppData } from '@/contexts/AppDataContext.jsx'
import { monthInRanges } from '@/lib/recommendation.js'

export default function FishDetailPage() {
  const { id } = useParams()
  const { fishSpecies, month, popLocations } = useAppData()
  const fish = useMemo(() => fishSpecies.find((item) => item.id === id), [fishSpecies, id])

  if (!fish) {
    return (
      <div className="space-y-4 text-slate-200">
        <p>Aradığınız tür bulunamadı.</p>
        <Button asChild variant="ghost" className="border border-slate-800 text-slate-100">
          <Link to="/fish">Tür listesine dön</Link>
        </Button>
      </div>
    )
  }

  const relatedLocations = popLocations.filter((location) => location.fish_types_available.includes(fish.id))
  const inSeason = monthInRanges(month, fish.mevsim)

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="w-max border border-slate-800 text-slate-100">
        <Link to="/fish" className="inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Listeye dön
        </Link>
      </Button>

      <Card className="border-slate-800 bg-slate-900/50 text-slate-100">
        <CardHeader>
          <CardTitle className="text-2xl text-white">{fish.tur_adi}</CardTitle>
          <CardDescription className="text-slate-400">Tür detayları ve önerilen av ekipmanları</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-[1fr_0.8fr]">
          <div className="space-y-4 text-sm text-slate-300">
            <Badge className={`rounded-full ${inSeason ? 'bg-cyan-500/20 text-cyan-200' : 'bg-slate-800 text-slate-300'}`}>
              {inSeason ? 'Bu ay hedef tür' : 'Alternatif tür'}
            </Badge>
            <Info label="Av Limiti" value={fish.av_limit} />
            <Info label="Yasak Dönem" value={formatBan(fish.yasak_donem)} />
            <Info label="İdeal Derinlik" value={fish.ideal_derinlik} />
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                <Anchor className="h-4 w-4 text-cyan-300" /> Önerilen Ekipman
              </h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>• Yem: {fish.yem_tavsiyesi}</li>
                <li>• İğne: {fish.igne_numara}</li>
                <li>• Misina: {fish.misina_tavsiyesi}</li>
                <li>• Not: {fish.ekipman_notu}</li>
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <Card className="border-slate-800 bg-slate-950/60 text-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white text-base">
                  <ThermometerSun className="h-5 w-5 text-cyan-300" /> Mevsim Takvimi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {fish.mevsim.map(([start, end], index) => (
                  <div key={index} className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Aktif dönem</p>
                    <p className="text-white">{start}. ay → {end}. ay</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-950/60 text-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white text-base">
                  <Target className="h-5 w-5 text-cyan-300" /> Öne çıkan bölgeler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300">
                {relatedLocations.map((location) => (
                  <div key={location.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-200">
                        <MapPin className="h-4 w-4 text-cyan-300" />
                        <span>{location.location_name}</span>
                      </div>
                      <Badge className="bg-cyan-500/20 text-cyan-200">{location.best_season}</Badge>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      {location.lat.toFixed(2)}° / {location.lng.toFixed(2)}°
                    </p>
                  </div>
                ))}
                {!relatedLocations.length && <p>Bu tür için kayıtlı popüler nokta bulunmuyor.</p>}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-slate-500">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  )
}

function formatBan(range) {
  const [start, end] = range
  if (!start || !end) return 'Resmi yasak yok'
  return `${start}. Ay - ${end}. Ay`
}
