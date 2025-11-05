import { Store, ShipWheel, Phone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx'
import { useAppData } from '@/contexts/AppDataContext.jsx'

export default function MarketBoatsPage() {
  const { marketsAndBoats } = useAppData()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-white">Market & Tekne Rehberi</h1>
        <p className="text-sm text-slate-400">Konumuna göre en yakın destek hizmetleri</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {marketsAndBoats.map((place) => (
          <Card key={place.id} className="border-slate-800 bg-slate-900/50 text-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-lg">
                {place.type === 'Market' ? <Store className="h-5 w-5 text-cyan-300" /> : <ShipWheel className="h-5 w-5 text-cyan-300" />}
                {place.name}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {place.type} • {place.distance_km} km uzaklıkta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <p>{place.address}</p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Phone className="h-4 w-4 text-cyan-300" /> {place.contact}
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                {place.services.map((service) => (
                  <span key={service} className="rounded-full border border-slate-800 px-3 py-1">
                    {service}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
