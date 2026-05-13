<template>
  <svg :width="size" :height="size" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <polygon
      points="10,1 12.12,7.09 18.56,7.22 13.42,11.11 15.29,17.28 10,13.6 4.71,17.28 6.58,11.11 1.44,7.22 7.88,7.09"
      fill="#F59E0B"
      stroke="#D97706"
      stroke-width="0.5"
      stroke-linejoin="round"
    />
    <text
      x="10"
      y="11"
      text-anchor="middle"
      dominant-baseline="middle"
      fill="white"
      :font-size="level >= 10 ? 5.5 : 7"
      font-weight="700"
      font-family="'Noto Sans TC', system-ui, sans-serif"
    >{{ level }}</text>
  </svg>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ level: number; size?: number }>(), { size: 20 })
</script>
