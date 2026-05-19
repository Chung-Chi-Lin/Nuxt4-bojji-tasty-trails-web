import type { GeoLocation } from '~/types'

export function useGeoModal() {
  const show        = useState<boolean>('geo-modal', () => false)
  const userLocation = useState<GeoLocation | null>('geo-location', () => null)

  function requestIfNeeded(): void {
    if (!import.meta.client) return
    if (!('geolocation' in navigator)) return
    if (sessionStorage.getItem('geo_asked')) return
    show.value = true
  }

  function allow(): void {
    show.value = false
    sessionStorage.setItem('geo_asked', '1')
    navigator.geolocation.getCurrentPosition((pos) => {
      userLocation.value = { lat: pos.coords.latitude, lng: pos.coords.longitude }
    })
  }

  function deny(): void {
    show.value = false
    sessionStorage.setItem('geo_asked', '1')
  }

  return { show, userLocation, requestIfNeeded, allow, deny }
}
