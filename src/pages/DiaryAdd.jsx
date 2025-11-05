import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, MapPin, Upload } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { supabase, supabaseConfigured } from '@/lib/supabaseClient.js'
import { useAppData } from '@/contexts/AppDataContext.jsx'
import { useAuth } from '@/contexts/AuthContext.jsx'

const diarySchema = z.object({
  fish_type: z.string().min(1, 'Tür seçimi yapın'),
  size_cm: z.coerce.number().min(1, 'Boy girin'),
  date: z.string().min(1, 'Tarih seçin')
})

export default function DiaryAddPage() {
  const { fishSpecies, coordinates, addDiaryEntry } = useAppData()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [photoFile, setPhotoFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(diarySchema),
    defaultValues: {
      fish_type: fishSpecies[0]?.tur_adi ?? '',
      size_cm: 0,
      date: new Date().toISOString().slice(0, 10)
    }
  })

  async function onSubmit(values) {
    let photo_url = ''

    try {
      if (photoFile) {
        if (supabaseConfigured) {
          const randomName =
            typeof crypto !== 'undefined' && crypto.randomUUID
              ? crypto.randomUUID()
              : Math.random().toString(36).slice(2)
          const fileName = `${randomName}.${photoFile.name.split('.').pop()}`
          const { error: uploadError } = await supabase.storage
            .from('diary-photos')
            .upload(fileName, photoFile, { cacheControl: '3600', upsert: false })
          if (uploadError) throw uploadError
          const {
            data: { publicUrl }
          } = supabase.storage.from('diary-photos').getPublicUrl(fileName)
          photo_url = publicUrl
          setUploadStatus('Fotoğraf Supabase depolamaya yüklendi.')
        } else {
          photo_url = URL.createObjectURL(photoFile)
          setUploadStatus('Demo modunda yerel önizleme kullanılıyor.')
        }
      }

      const entry = {
        fish_type: values.fish_type,
        size_cm: values.size_cm,
        date: values.date,
        lat: coordinates?.latitude ?? null,
        lng: coordinates?.longitude ?? null,
        photo_url,
        user_id: user?.id ?? 'local-user'
      }

      addDiaryEntry(entry)
      navigate('/diary')
    } catch (error) {
      setUploadStatus(error.message)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-800 bg-slate-900/50 text-slate-100">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Günlük Kaydı Oluştur</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 text-sm text-slate-200" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="fish_type">Tür</Label>
              <select
                id="fish_type"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100"
                {...register('fish_type')}
              >
                {fishSpecies.map((fish) => (
                  <option key={fish.id} value={fish.tur_adi}>
                    {fish.tur_adi}
                  </option>
                ))}
              </select>
              {errors.fish_type && <p className="text-xs text-rose-300">{errors.fish_type.message}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="size_cm">Boy (cm)</Label>
                <Input
                  id="size_cm"
                  type="number"
                  min={0}
                  className="border-slate-800 bg-slate-950 text-white"
                  {...register('size_cm')}
                />
                {errors.size_cm && <p className="text-xs text-rose-300">{errors.size_cm.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Tarih</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input id="date" type="date" className="border-slate-800 bg-slate-950 pl-9 text-white" {...register('date')} />
                </div>
                {errors.date && <p className="text-xs text-rose-300">{errors.date.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Konum</Label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-400">
                <MapPin className="h-4 w-4 text-cyan-300" />
                {coordinates
                  ? `${coordinates.latitude.toFixed(3)} / ${coordinates.longitude.toFixed(3)}`
                  : 'Konum bilgisi alınamadı'}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Fotoğraf</Label>
              <label
                htmlFor="photo"
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-cyan-500/40 bg-slate-950 px-4 py-6 text-slate-300"
              >
                <Upload className="h-5 w-5 text-cyan-300" />
                {photoFile ? photoFile.name : 'Fotoğraf yükle (opsiyonel)'}
              </label>
              <input
                id="photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => setPhotoFile(event.target.files?.[0] ?? null)}
              />
            </div>

            {uploadStatus && <p className="text-xs text-cyan-200">{uploadStatus}</p>}

            <Button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
              disabled={isSubmitting}
            >
              Kaydı oluştur
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
