<template>
  <Transition enter-from-class="opacity-0" enter-active-class="transition duration-300">
    <div
      v-if="weather"
      class="bg-food-surface/90 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 shadow-md border border-food-border pointer-events-none select-none"
    >
      <span class="text-2xl leading-none">{{ weather.emoji }}</span>
      <div class="leading-tight">
        <div class="font-bold text-food-brown text-sm">{{ weather.temp }}°C</div>
        <div class="text-xs text-food-muted">{{ weather.desc }}</div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
interface WeatherData {
  temp: number
  emoji: string
  desc: string
  precip: number
  windSpeed: number
}

const props = defineProps<{ lat: number; lng: number }>()

const weather = ref<WeatherData | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null

async function fetchWeather(): Promise<void> {
  try {
    weather.value = await $fetch<WeatherData>('/api/weather/current', {
      query: { lat: props.lat, lng: props.lng },
    })
  } catch { /* 靜默失敗，不影響地圖使用 */ }
}

watch(() => [props.lat, props.lng], () => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(fetchWeather, 1500)
}, { immediate: true })

onUnmounted(() => { if (timer) clearTimeout(timer) })
</script>
