import { useEffect, useMemo, useState } from 'react'

const WEATHER_ENDPOINT = 'https://marine-api.open-meteo.com/v1/marine'

export function useWeather(coordinates, refreshKey = 0) {
  const [weather, setWeather] = useState(null)
  const [seaStatus, setSeaStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!coordinates?.latitude || !coordinates?.longitude) {
      return
    }

    const controller = new AbortController()
    async function fetchWeather() {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        current: ['wave_height', 'wind_speed_10m', 'water_temperature'].join(','),
        hourly: ['wave_height', 'water_temperature'].join(','),
        timezone: 'auto'
      })

      try {
        const response = await fetch(`${WEATHER_ENDPOINT}?${params.toString()}`, {
          signal: controller.signal
        })
        if (!response.ok) {
          throw new Error('Weather verisi alınamadı')
        }
        const data = await response.json()
        const current = data.current ?? {}
        const weatherPayload = {
          windSpeed: current.wind_speed_10m ?? null,
          waterTemp: current.water_temperature ?? null,
          waveHeight: current.wave_height ?? null,
          time: current.time ?? null
        }
        setWeather(weatherPayload)

        const calculatedStatus = deriveSeaStatus(weatherPayload)
        setSeaStatus(calculatedStatus)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()

    return () => controller.abort()
  }, [coordinates?.latitude, coordinates?.longitude, refreshKey])

  const summary = useMemo(() => {
    if (!weather) return null

    return `Rüzgar: ${formatMetric(weather.windSpeed, 'm/s')} | Su: ${formatMetric(weather.waterTemp, '°C')} | Dalga: ${formatMetric(weather.waveHeight, 'm')}`
  }, [weather])

  return { weather, seaStatus, summary, loading, error }
}

function formatMetric(value, unit) {
  if (typeof value !== 'number') return '—'
  return `${value.toFixed(1)} ${unit}`
}

function deriveSeaStatus({ windSpeed, waveHeight }) {
  if (windSpeed == null || waveHeight == null) {
    return {
      label: 'Veri bekleniyor',
      description: 'Hava durumu bilgileri yükleniyor',
      severity: 'info'
    }
  }

  const isCalm = windSpeed < 4 && waveHeight < 0.6
  const isModerate = windSpeed < 8 && waveHeight < 1.2

  if (isCalm) {
    return {
      label: 'Sakin Deniz',
      description: 'Kıyıdan av için ideal koşullar',
      severity: 'success'
    }
  }

  if (isModerate) {
    return {
      label: 'Orta Şiddet',
      description: 'Tekne ile kontrollü çıkış önerilir',
      severity: 'warning'
    }
  }

  return {
    label: 'Zorlu Şartlar',
    description: 'Av planı öncesi koşulları tekrar kontrol edin',
    severity: 'danger'
  }
}
