import { createContext, useContext, useMemo, useState } from 'react'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useWeather } from '@/hooks/useWeather'
import { getMonthFromDate, getRecommendations } from '@/lib/recommendation'
import { sampleDiaries } from '@/data/diary'
import { sampleFeedPosts } from '@/data/feed'
import { fishSpecies } from '@/data/fishSpecies'
import { popLocations } from '@/data/popLocations'
import { marketsAndBoats } from '@/data/markets'

const AppDataContext = createContext({})

export function AppDataProvider({ children }) {
  const [refreshKey, setRefreshKey] = useState(0)
  const { coordinates, error: geoError, loading: geoLoading, fallbackLabel } = useGeolocation()
  const { weather, seaStatus, summary, loading: weatherLoading, error: weatherError } = useWeather(
    coordinates,
    refreshKey
  )
  const month = getMonthFromDate()

  const [diaries, setDiaries] = useState(sampleDiaries)
  const [feedPosts, setFeedPosts] = useState(sampleFeedPosts)

  const recommendations = useMemo(() => {
    return getRecommendations({ month, coordinates, weather })
  }, [coordinates, month, weather])

  function refreshWeather() {
    setRefreshKey((prev) => prev + 1)
  }

  function addDiaryEntry(entry) {
    setDiaries((prev) => [{ ...entry, id: generateId() }, ...prev])
  }

  function addFeedPost(post) {
    setFeedPosts((prev) => [{ ...post, id: generateId() }, ...prev])
  }

  const value = {
    coordinates,
    geoLoading,
    geoError,
    fallbackLabel,
    weather,
    seaStatus,
    weatherSummary: summary,
    weatherLoading,
    weatherError,
    refreshWeather,
    month,
    recommendations,
    fishSpecies,
    popLocations,
    marketsAndBoats,
    diaries,
    addDiaryEntry,
    feedPosts,
    addFeedPost
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2)
}

export function useAppData() {
  return useContext(AppDataContext)
}
