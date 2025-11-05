import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { useAppData } from '@/contexts/AppDataContext.jsx'

export default function FishListPage() {
  const { fishSpecies, month } = useAppData()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Tür Rehberi</h1>
        <p className="text-sm text-slate-400">{fishSpecies.length} tür için ekipman ve mevsim bilgisi</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {fishSpecies.map((fish) => (
          <Link key={fish.id} to={`/fish/${fish.id}`} className="group">
            <Card className="h-full border-slate-800 bg-slate-900/50 text-slate-100 transition-all group-hover:border-cyan-500/40 group-hover:shadow-lg group-hover:shadow-cyan-500/10">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg text-white">{fish.tur_adi}</CardTitle>
                  <p className="text-xs text-slate-500">Aktif Aylar: {formatSeason(fish.mevsim)}</p>
                </div>
                <Badge className="bg-slate-800 text-xs text-slate-300">{fish.ideal_derinlik}</Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300">
                <p>Yem: {fish.yem_tavsiyesi}</p>
                <p>İğne: {fish.igne_numara}</p>
                <p>Misina: {fish.misina_tavsiyesi}</p>
                <div className="flex flex-wrap gap-2 pt-2 text-xs text-slate-400">
                  {fish.favori_bolgeler.map((region) => (
                    <span key={region} className="rounded-full border border-slate-800 px-3 py-1">
                      {region}
                    </span>
                  ))}
                </div>
                {isMonthActive(month, fish.mevsim) && (
                  <p className="text-xs text-cyan-200">Bu ay hedef tür olarak öneriliyor.</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

function formatSeason(ranges) {
  return ranges
    .map(([start, end]) =>
      start && end ? `${start}. Ay - ${end}. Ay` : '—'
    )
    .join(', ')
}

function isMonthActive(month, ranges) {
  return ranges.some(([start, end]) => {
    if (!start || !end) return false
    if (start <= end) {
      return month >= start && month <= end
    }
    return month >= start || month <= end
  })
}
