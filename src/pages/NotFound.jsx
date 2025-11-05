import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center text-slate-200">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">404</p>
      <h1 className="text-3xl font-semibold text-white">Sayfa bulunamadı</h1>
      <p className="max-w-sm text-sm text-slate-400">
        Aradığınız sayfa taşınmış veya silinmiş olabilir. Ana panele dönerek devam edebilirsiniz.
      </p>
      <Button asChild className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
        <Link to="/dashboard">Panele dön</Link>
      </Button>
    </div>
  )
}
