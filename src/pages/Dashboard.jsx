import { Calendar, Compass, Fish, MapPin, Wind, Waves, ThermometerSun } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { useAppData } from '@/contexts/AppDataContext.jsx'

export default function DashboardPage() {
  const {
    coordinates,
    fallbackLabel,
    weather,
    seaStatus,
    weatherLoading,
    month,
    recommendations,
    popLocations
  } = useAppData()

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-slate-800 bg-slate-900/50 text-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <Fish className="h-5 w-5 text-cyan-300" />
              Anlık Av Stratejisi
            </CardTitle>
            <CardDescription className="text-slate-400">
              Konum ve hava verilerine göre bugün deneyeceğin ilk 3 tür
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.tur_adi}</h3>
                    <p className="text-xs text-slate-400">Önerilen yem: {item.yem_tavsiyesi}</p>
                  </div>
                  <Badge className={`rounded-full ${item.inSeason ? 'bg-cyan-500/20 text-cyan-200' : 'bg-slate-800 text-slate-300'}`}>
                    {item.inSeason ? 'Sezonunda' : 'Alternatif'}
                  </Badge>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-slate-300 md:grid-cols-3">
                  <Info label="İğne" value={item.igne_numara} />
                  <Info label="Misina" value={item.misina_tavsiyesi} />
                  <Info label="Limit" value={item.av_limit} />
                </div>
                {item.restricted && (
                  <p className="mt-3 text-xs text-amber-300">Bu tür için olası av yasağı dönemine dikkat et.</p>
                )}
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
                  {item.favori_bolgeler.map((region) => (
                    <span key={region} className="rounded-full border border-slate-800 px-3 py-1">
                      {region}
                    </span>
                  ))}
                </div>
                <Button asChild variant="ghost" className="mt-4 w-full justify-between border border-slate-800 bg-slate-900/40">
                  <Link to={`/fish/${item.id}`}>
                    Detaylı av rehberi
                    <span aria-hidden>→</span>
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card className="border-slate-800 bg-slate-900/50 text-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Compass className="h-5 w-5 text-cyan-300" /> Konum & Zaman
              </CardTitle>
              <CardDescription className="text-slate-400">Tüm öneriler bu verilerle hazırlandı</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950/70">
                  <MapPin className="h-5 w-5 text-cyan-300" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Konum</p>
                  <p className="font-medium text-white">
                    {coordinates ? `${coordinates.latitude.toFixed(2)}, ${coordinates.longitude.toFixed(2)}` : fallbackLabel}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950/70">
                  <Calendar className="h-5 w-5 text-cyan-300" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Ay</p>
                  <p className="font-medium text-white">{month}. Ay</p>
                  <p className="text-xs text-slate-500">Mevsimsel filtreler buna göre uygulandı.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900/50 text-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Waves className="h-5 w-5 text-cyan-300" /> Canlı Deniz Durumu
              </CardTitle>
              <CardDescription className="text-slate-400">Veriler Open-Meteo Marine API üzerinden güncellenir</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center gap-3">
                  <Wind className="h-5 w-5 text-cyan-300" />
                  <span>Rüzgar Hızı</span>
                </div>
                <span className="font-semibold text-white">{formatValue(weather?.windSpeed, 'm/s')}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center gap-3">
                  <ThermometerSun className="h-5 w-5 text-cyan-300" />
                  <span>Su Sıcaklığı</span>
                </div>
                <span className="font-semibold text-white">{formatValue(weather?.waterTemp, '°C')}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center gap-3">
                  <Waves className="h-5 w-5 text-cyan-300" />
                  <span>Dalga Yüksekliği</span>
                </div>
                <span className="font-semibold text-white">{formatValue(weather?.waveHeight, 'm')}</span>
              </div>
              {seaStatus && (
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Deniz Durumu</p>
                  <p className="text-sm text-white">{seaStatus.label}</p>
                  <p className="text-xs text-slate-400">{seaStatus.description}</p>
                </div>
              )}
              {weatherLoading && <p className="text-xs text-slate-500">Hava verileri güncelleniyor...</p>}
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">Yakındaki Popüler Noktalar</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {popLocations.slice(0, 4).map((location) => (
            <div key={location.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <p className="text-white">{location.location_name}</p>
                <Badge className="bg-cyan-500/20 text-cyan-200">{location.best_season}</Badge>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Koordinatlar: {location.lat.toFixed(2)} / {location.lng.toFixed(2)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {location.fish_types_available.map((type) => (
                  <span key={type} className="rounded-full border border-slate-800 px-3 py-1 text-xs text-slate-400">
                    {type.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  )
}

function formatValue(value, unit) {
  if (value == null) return '—'
  return `${value.toFixed(1)} ${unit}`
}
