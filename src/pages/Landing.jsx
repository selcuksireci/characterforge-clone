import { Anchor, Compass, Target, Waves, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'

const highlights = [
  {
    icon: Compass,
    title: 'Akıllı Konum Algılama',
    description: 'GPS ile bulunduğun noktaya özel öneriler'
  },
  {
    icon: Waves,
    title: 'Canlı Deniz Analizi',
    description: 'Rüzgar, su sıcaklığı ve dalga yüksekliği tek ekranda'
  },
  {
    icon: Target,
    title: 'Tür Bazlı Strateji',
    description: 'Mevsim ve av yasağına göre doğru hedefler'
  }
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute left-1/4 top-1/4 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-300">
                Türkiye Balıkçılığı için tasarlandı
              </span>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                FishScope TR ile <span className="text-cyan-300">en doğru av planı</span> cebinde.
              </h1>
              <p className="max-w-xl text-base text-slate-300 md:text-lg">
                Konum, mevsim, hava ve deniz bilgilerini tek ekranda birleştiren ilk Türkçe balıkçılık asistanı.
                Profesyonel avcıların stratejilerini artık her seviyeden balıkçı kullanabilir.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 text-base">
                  <Link to="/dashboard">Başla</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-slate-700 bg-transparent px-8 text-base text-slate-100 hover:bg-slate-900"
                >
                  <Link to="/premium">Premium'u keşfet</Link>
                </Button>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 p-8 shadow-2xl shadow-cyan-500/10">
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
              <div className="relative space-y-6">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Canlı Deniz Durumu</span>
                  <Smartphone className="h-5 w-5 text-cyan-300" />
                </div>
                <div className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
                  <Stat label="Rüzgar" value="3.8 m/s" trend="+1.2" />
                  <Stat label="Su Sıcaklığı" value="18.4 °C" trend="-0.6" />
                  <Stat label="Dalga" value="0.5 m" trend="-0.1" />
                </div>
                <p className="text-sm text-slate-400">
                  FishScope TR, Open-Meteo marine API verileriyle rüzgar ve dalga değişimlerini takip ederek güvenli av
                  zamanlarını öne çıkarır.
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
                <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
                  <item.icon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-medium text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-10 rounded-3xl border border-slate-800 bg-slate-900/50 p-8 lg:grid-cols-[0.7fr_1fr]">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">Premium özelliklerle sınırları kaldır</h2>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Reklamsız deneyim</li>
                <li>• Gizli av noktaları</li>
                <li>• Pro Analiz modu</li>
              </ul>
              <Link to="/premium" className="inline-flex text-sm text-cyan-300 hover:underline">
                Premium detaylarını incele →
              </Link>
            </div>
            <div className="grid gap-4 text-sm text-slate-300 md:grid-cols-3">
              <FeatureCard icon={Anchor} title="Av Günlüğü" description="Fotoğraflı kayıt, otomatik hava ekleme" />
              <FeatureCard icon={Target} title="Üç Adımlı Strateji" description="Sadece 2 dokunuşla hedef tür seç" />
              <FeatureCard icon={Compass} title="Harita Pinleri" description="Popüler ve premium noktalar tek haritada" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value, trend }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
      </div>
      <span className={`text-xs ${Number(trend) >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{trend}</span>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  const IconComponent = icon
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
        <IconComponent className="h-4 w-4" />
      </div>
      <h3 className="text-base font-medium text-white">{title}</h3>
      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </div>
  )
}
