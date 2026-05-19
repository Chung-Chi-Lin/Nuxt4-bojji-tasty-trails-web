const CACHE_KEY = 'weather_forecast'
const CACHE_TTL = 60 * 60 * 1000 // 1 小時

interface ForecastData { zh: string; en: string }

export function useWeatherForecast() {
  // useState：SPA 換頁不重取（同一 session 共享）
  const data = useState<ForecastData | null>('weather-forecast', () => null)

  async function load(): Promise<void> {
    if (data.value) return // session 內已有資料

    // 檢查 localStorage 快取
    if (import.meta.client) {
      try {
        const raw = localStorage.getItem(CACHE_KEY)
        if (raw) {
          const { value, ts } = JSON.parse(raw) as { value: ForecastData; ts: number }
          if (Date.now() - ts < CACHE_TTL) {
            data.value = value
            return
          }
        }
      } catch { /* 快取讀取失敗，略過 */ }
    }

    // 快取過期或不存在，才打 API
    const result = await $fetch<ForecastData>('/api/weather/forecast')
    data.value = result

    if (import.meta.client) {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ value: result, ts: Date.now() }))
    }
  }

  return { data, load }
}
