import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn, Mail, Lock, Fish } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { supabase, supabaseConfigured } from '@/lib/supabaseClient.js'
import { useAuth } from '@/contexts/AuthContext.jsx'

const formSchema = z.object({
  email: z.string().email({ message: 'Geçerli bir email girin' }),
  password: z.string().min(6, 'En az 6 karakter olmalı'),
  fullName: z.string().min(2, 'Ad soyad gerekli').optional()
})

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const navigate = useNavigate()
  const { user } = useAuth()
  const [feedback, setFeedback] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: ''
    }
  })

  async function onSubmit(values) {
    setFeedback(null)
    if (!supabaseConfigured) {
      setFeedback('Supabase bağlantısı yapılandırılmadı. .env dosyanıza VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY ekleyin.')
      return
    }

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email: values.email, password: values.password })
        if (error) throw error
        navigate('/dashboard')
      } else {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: { data: { full_name: values.fullName } }
        })
        if (error) throw error
        setFeedback('E-postana doğrulama gönderildi. Lütfen gelen kutunu kontrol et!')
      }
    } catch (error) {
      setFeedback(error.message)
    }
  }

  async function handleGoogleLogin() {
    if (!supabaseConfigured) {
      setFeedback('Google ile giriş için Supabase yapılandırması gerekli.')
      return
    }
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) {
      setFeedback(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600">
            <Fish className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-white">FishScope TR</h1>
          <p className="mt-2 text-sm text-slate-400">Türkiye balıkçılığı için en akıllı av asistanı</p>
        </div>
        <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl shadow-cyan-500/10">
          <div className="mb-6 flex justify-center gap-2 rounded-full border border-slate-800 bg-slate-950/60 p-1 text-sm text-slate-300">
            <button
              type="button"
              className={`flex-1 rounded-full py-2 font-medium transition-colors ${
                mode === 'login' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30' : ''
              }`}
              onClick={() => setMode('login')}
            >
              Giriş
            </button>
            <button
              type="button"
              className={`flex-1 rounded-full py-2 font-medium transition-colors ${
                mode === 'register' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30' : ''
              }`}
              onClick={() => setMode('register')}
            >
              Kayıt Ol
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-slate-300">
                  Ad Soyad
                </Label>
                <Input
                  id="fullName"
                  placeholder="Adını gir"
                  className="border-slate-800 bg-slate-950 text-white"
                  {...register('fullName')}
                />
                {errors.fullName && <p className="text-xs text-rose-300">{errors.fullName.message}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="sen@ornek.com"
                  className="border-slate-800 bg-slate-950 pl-9 text-white"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-xs text-rose-300">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                Şifre
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  className="border-slate-800 bg-slate-950 pl-9 text-white"
                  {...register('password')}
                />
              </div>
              {errors.password && <p className="text-xs text-rose-300">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-base text-white"
              size="lg"
              disabled={isSubmitting}
            >
              <LogIn className="mr-2 h-4 w-4" />
              {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
            </Button>
          </form>

          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full border-slate-800 bg-slate-950 text-slate-100 hover:bg-slate-900"
              onClick={handleGoogleLogin}
            >
              Google ile devam et
            </Button>
          </div>

          {feedback && <p className="mt-4 text-center text-sm text-cyan-200">{feedback}</p>}
          {user && <p className="mt-2 text-center text-xs text-slate-500">Giriş yaptın, panele yönlendirilmek üzeresin.</p>}
        </div>
      </div>
    </div>
  )
}
