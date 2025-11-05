import { useMemo } from 'react'
import { useAppData } from '@/contexts/AppDataContext.jsx'

export default function MapScreen() {
  const { coordinates, popLocations } = useAppData()

  const bounds = useMemo(() => {
    if (!popLocations?.length) {
      return { minLat: 0, maxLat: 1, minLng: 0, maxLng: 1 }
    }
    const lats = popLocations.map((p) => p.lat)
    const lngs = popLocations.map((p) => p.lng)
    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs)
    }
  }, [popLocations])

  function getPosition(lat, lng) {
    const { minLat, maxLat, minLng, maxLng } = bounds
    const latRange = Math.max(maxLat - minLat, 0.0001)
    const lngRange = Math.max(maxLng - minLng, 0.0001)
    const x = ((lng - minLng) / lngRange) * 100
    const y = (1 - (lat - minLat) / latRange) * 100
    return { left: `${x}%`, top: `${y}%` }
  }

  const userPosition = coordinates
    ? getPosition(coordinates.latitude, coordinates.longitude)
    : null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Harita</h1>
          <p className="text-sm text-slate-400">Popüler av noktaları ve senin konumun</p>
        </div>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        <GridOverlay />
        {popLocations.map((location) => {
          const pos = getPosition(location.lat, location.lng)
          return (
            <div
              key={location.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={pos}
            >
              <div className="flex flex-col items-center gap-1 text-center text-xs">
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-cyan-100">{location.location_name}</span>
                <span className="text-[10px] text-slate-400">{location.best_season}</span>
              </div>
              <span className="mt-1 block h-3 w-3 rounded-full border-2 border-cyan-300 bg-cyan-500/60" />
            </div>
          )
        })}
        {userPosition && (
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={userPosition}>
            <span className="block h-4 w-4 animate-ping rounded-full bg-emerald-400/60" />
            <span className="-mt-3 block h-3 w-3 rounded-full border border-emerald-300 bg-emerald-500" />
          </div>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {popLocations.map((location) => (
          <div key={location.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-300">
            <div className="flex items-center justify-between">
              <p className="text-white">{location.location_name}</p>
              <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-200">{location.best_season}</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">Koordinatlar: {location.lat.toFixed(2)} / {location.lng.toFixed(2)}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
              {location.fish_types_available.map((type) => (
                <span key={type} className="rounded-full border border-slate-800 px-3 py-1">
                  {type.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GridOverlay() {
  const lines = new Array(6).fill(0)
  return (
    <div className="absolute inset-0">
      {lines.map((_, index) => (
        <div
          key={`h-${index}`}
          className="absolute left-0 right-0 border-t border-slate-800/40"
          style={{ top: `${(index / lines.length) * 100}%` }}
        />
      ))}
      {lines.map((_, index) => (
        <div
          key={`v-${index}`}
          className="absolute top-0 bottom-0 border-l border-slate-800/40"
          style={{ left: `${(index / lines.length) * 100}%` }}
        />
      ))}
    </div>
  )
}
