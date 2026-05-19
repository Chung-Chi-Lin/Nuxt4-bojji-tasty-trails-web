<template>
  <div v-if="data" class="overflow-hidden w-full min-w-0 cursor-default" @mouseenter="paused = true" @mouseleave="paused = false">
    <div
      class="flex whitespace-nowrap text-xs text-food-muted"
      :style="{ animation: 'weather-marquee 28s linear infinite', animationPlayState: paused ? 'paused' : 'running' }"
    >
      <span class="shrink-0 px-4">{{ data.zh }}</span>
      <span class="shrink-0 px-6 text-food-border select-none">｜</span>
      <span class="shrink-0 px-4">{{ data.en }}</span>
      <span class="shrink-0 px-6 text-food-border select-none">｜</span>
      <!-- 複製一份做無縫循環 -->
      <span class="shrink-0 px-4">{{ data.zh }}</span>
      <span class="shrink-0 px-6 text-food-border select-none">｜</span>
      <span class="shrink-0 px-4">{{ data.en }}</span>
      <span class="shrink-0 px-6 text-food-border select-none">｜</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useWeatherForecast } from '~/composables/useWeatherForecast'

const paused = ref(false)
const { data, load } = useWeatherForecast()

onMounted(load)
</script>

<style scoped>
@keyframes weather-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
</style>
