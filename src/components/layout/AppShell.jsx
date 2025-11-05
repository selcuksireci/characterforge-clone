import { Menu, Fish, MapPin, RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { useAppData } from '@/contexts/AppDataContext.jsx'
import { useAuth } from '@/contexts/AuthContext.jsx'

const navItems = [
  { to: '/dashboard', label: 'Panel' },
  { to: '/fish', label: 'Türler' },
  { to: '/map', label: 'Harita' },
  { to: '/diary', label: 'Av Günlüğüm' },
  { to: '/diary/new', label: 'Yeni Kayıt' },
  { to: '/feed', label: 'Topluluk' },
  { to: '/market', label: 'Market & Tekne' },
  { to: '/premium', label: 'Premium' }
]

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { fallbackLabel, coordinates, weatherSummary, seaStatus, refreshWeather, weatherLoading } = useAppData()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              className="rounded-full border border-slate-700 p-2 text-slate-200 lg:hidden"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Menüyü aç"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600">
                <Fish className="h-5 w-5" />
              </span>
              <div>
                <span className="block text-lg">FishScope TR</span>
                <span className="block text-xs text-slate-400">Akıllı Av Asistanı</span>
              </div>
            </Link>
          </div>
          <div className="hidden items-center gap-6 text-sm text-slate-300 lg:flex">
            <LocationBadge coordinates={coordinates} fallbackLabel={fallbackLabel} />
            {weatherSummary ? <span>{weatherSummary}</span> : <span>Hava verisi yükleniyor...</span>}
            {seaStatus && <SeaStatusBadge seaStatus={seaStatus} />}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
              onClick={refreshWeather}
              disabled={weatherLoading}
            >
              <RefreshCcw className={`h-4 w-4 ${weatherLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Link
              to="/premium"
              className="hidden rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 lg:block"
            >
              Premium'a Geç
            </Link>
            <div className="hidden min-w-[120px] text-right text-xs text-slate-400 lg:block">
              {user ? (
                <div>
                  <p>{user.email}</p>
                  <p className="text-slate-500">Hoş geldin!</p>
                </div>
              ) : (
                <Link to="/auth" className="text-cyan-400 hover:underline">
                  Giriş Yap
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className={`border-t border-slate-800 bg-slate-950 lg:border-none lg:bg-transparent ${menuOpen ? 'block' : 'hidden lg:block'}`}>
          <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 text-sm text-slate-300">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-2 rounded-full px-4 py-2 transition-colors ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-200 backdrop-blur'
                      : 'hover:bg-slate-800/80 hover:text-slate-100'
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 lg:px-6">
        <Outlet />
      </main>
    </div>
  )
}

function LocationBadge({ coordinates, fallbackLabel }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-wide text-slate-300">
      <MapPin className="h-4 w-4 text-cyan-400" />
      {coordinates
        ? `${coordinates.latitude.toFixed(2)}, ${coordinates.longitude.toFixed(2)}`
        : `Konum: ${fallbackLabel}`}
    </span>
  )
}

function SeaStatusBadge({ seaStatus }) {
  const variants = {
    success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    info: 'bg-slate-500/10 text-slate-200 border-slate-500/30'
  }

  return (
    <Badge variant="outline" className={`flex items-center gap-1 border ${variants[seaStatus.severity] ?? variants.info}`}>
      <span className="text-xs font-medium">{seaStatus.label}</span>
    </Badge>
  )
}
