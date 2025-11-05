import { fishSpecies } from '@/data/fishSpecies'
import { popLocations } from '@/data/popLocations'

export function getMonthFromDate(date = new Date()) {
  return date.getMonth() + 1
}

export function monthInRanges(month, ranges) {
  if (!ranges?.length) return false
  return ranges.some(([start, end]) => {
    if (start == null || end == null) return false
    if (start <= end) {
      return month >= start && month <= end
    }
    return month >= start || month <= end
  })
}

export function getRecommendations({ month, coordinates, weather }) {
  return fishSpecies
    .map((species) => {
      const inSeason = monthInRanges(month, species.mevsim)
      const restricted = monthInRanges(month, [species.yasak_donem])
      const proximityScore = computeLocationScore(species.id, coordinates)
      const weatherScore = computeWeatherScore(weather)
      const score = (inSeason ? 4 : 1) + proximityScore + weatherScore - (restricted ? 3 : 0)

      return {
        ...species,
        inSeason,
        restricted,
        score
      }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

function computeLocationScore(speciesId, coordinates) {
  if (!coordinates?.latitude || !coordinates?.longitude) return 0

  const relevantLocations = popLocations.filter((location) =>
    location.fish_types_available.includes(speciesId)
  )

  if (!relevantLocations.length) return 0

  const distances = relevantLocations.map((location) =>
    haversineDistance(coordinates.latitude, coordinates.longitude, location.lat, location.lng)
  )

  const closest = Math.min(...distances)

  if (closest < 20) return 3
  if (closest < 60) return 2
  if (closest < 120) return 1
  return 0
}

function computeWeatherScore(weather) {
  if (!weather) return 0
  const { windSpeed, waveHeight } = weather
  if (windSpeed == null || waveHeight == null) return 0

  if (windSpeed < 5 && waveHeight < 0.8) return 2
  if (windSpeed < 8 && waveHeight < 1.4) return 1
  return -1
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
