<template>
  <div ref="mapEl" class="w-full h-full" />
</template>

<script lang="ts" setup>
import type { Spot } from '~/pages/map.vue'

const props = defineProps<{ spots: Spot[]; selectedSpot: Spot | null }>()

const mapEl = ref<HTMLElement | null>(null)
let leafletMap: any = null

onMounted(async () => {
  if (!mapEl.value) return

  const L = (await import('leaflet')).default

  leafletMap = L.map(mapEl.value, { zoomControl: false }).setView([25.0380, 121.5420], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(leafletMap)

  L.control.zoom({ position: 'bottomright' }).addTo(leafletMap)

  for (const spot of props.spots) {
    const icon = L.divIcon({
      html: `<span style="font-size:26px;line-height:1;">${spot.emoji}</span>`,
      className: 'food-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    })

    L.marker([spot.lat, spot.lng], { icon })
      .bindPopup(`
        <div style="font-family:'Noto Sans TC',sans-serif;min-width:120px">
          <div style="font-weight:700;font-size:14px;margin-bottom:4px">${spot.emoji} ${spot.name}</div>
          <div style="font-size:12px;color:#9C7B5C">${spot.desc}</div>
        </div>
      `)
      .addTo(leafletMap)
  }
})

watch(() => props.selectedSpot, (spot) => {
  if (spot && leafletMap) {
    leafletMap.setView([spot.lat, spot.lng], 16)
  }
})
</script>
