interface ForecastData { zh: string; en: string }

export function useWeatherForecast() {
  // useState：SPA 換頁時不重打（同一 session 共享）
  const data = useState<ForecastData | null>('weather-forecast', () => null)

  async function load(): Promise<void> {
    if (data.value) return
    data.value = await $fetch<ForecastData>('/api/weather/forecast')
  }

  return { data, load }
}
