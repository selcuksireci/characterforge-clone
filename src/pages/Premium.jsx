import { Check, Lock, Sparkles, Map, LineChart, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'

const tiers = [
  {
    name: 'Aylık',
    price: '₺169',
    features: ['Reklamsız kullanım', '3 Gizli Nokta erişimi', 'AI öneri hızlandırma']
  },
  {
    name: 'Yıllık',
    price: '₺1690',
    popular: true,
    features: ['Tüm Gizli Noktalar', 'Pro analiz paketi', 'Sınırsız günlük yedekleme', 'Öncelikli destek']
  }
]

const perks = [
  {
    icon: Lock,
    title: 'Secret Spots',
    description: 'Yalnızca premium üyelerin görebildiği, doğrulanmış av koordinatları.'
  },
  {
    icon: LineChart,
    title: 'Derin Analiz',
    description: 'Geçmiş günlük ve hava verileriyle tür bazlı başarı tahmini.'
  },
  {
    icon: Shield,
    title: 'Risk Uyarıları',
    description: 'Hızlı değişen hava koşullarında anlık bildirim.'
  },
  {
    icon: Map,
    title: 'Tek Ekran Navigasyon',
    description: 'Gizli noktaları harita üzerinde rota önerisiyle göster.'
  }
]

export default function PremiumPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 text-center text-white shadow-lg shadow-cyan-500/20">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/20">
          <Sparkles className="h-7 w-7 text-cyan-200" />
        </div>
        <h1 className="text-3xl font-semibold">FishScope Premium</h1>
        <p className="mt-3 text-sm text-slate-300">
          Reklamsız deneyim, gizli av noktaları ve pro analitik ile av planını seviyelendirme zamanı.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tiers.map((tier) => (
          <Card key={tier.name} className={`border ${tier.popular ? 'border-cyan-500/50 bg-slate-900/70' : 'border-slate-800 bg-slate-900/50'} text-slate-100`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                {tier.name}
                {tier.popular && (
                  <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-200">En Çok Tercih Edilen</span>
                )}
              </CardTitle>
              <CardDescription className="text-2xl text-white">{tier.price}<span className="text-sm text-slate-400"> / {tier.name === 'Yıllık' ? '12 ay' : 'ay'}</span></CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              {tier.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-300" />
                  <span>{feature}</span>
                </div>
              ))}
              <Button className="mt-4 w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                Katıl
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {perks.map((perk) => (
          <Card key={perk.title} className="border border-slate-800 bg-slate-900/50 text-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-lg">
                <perk.icon className="h-5 w-5 text-cyan-300" />
                {perk.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">{perk.description}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
