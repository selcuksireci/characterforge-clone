import { useEffect, useState } from 'react'

const ISTANBUL_FALLBACK = {
  coords: {
    latitude: 41.0082,
    longitude: 28.9784
  },
  city: 'İstanbul, TR'
}

export function useGeolocation() {
  const [coordinates, setCoordinates] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setCoordinates(ISTANBUL_FALLBACK.coords)
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        setLoading(false)
      },
      (geoError) => {
        setError(geoError)
        setCoordinates(ISTANBUL_FALLBACK.coords)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }, [])

  return { coordinates, error, loading, fallbackLabel: ISTANBUL_FALLBACK.city }
}
