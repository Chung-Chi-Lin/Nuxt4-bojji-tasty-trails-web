<template>
  <div class="p-4 space-y-4">

    <!-- Search -->
    <div class="flex items-center gap-2 bg-food-input border border-food-border rounded-xl px-3 py-2.5">
      <span class="text-food-muted shrink-0">🔍</span>
      <input v-model="search" type="text" placeholder="搜尋美食地點…"
        class="flex-1 bg-transparent text-sm text-food-brown placeholder-food-border focus:outline-none min-w-0" />
    </div>

    <!-- Category tags -->
    <div class="flex flex-wrap gap-2">
      <button v-for="cat in categories" :key="cat.label"
        @click="cat.active = !cat.active"
        :class="cat.active ? 'bg-food-caramel text-white' : 'bg-food-beige text-food-muted'"
        class="px-3 py-1.5 rounded-full text-xs font-bold transition active:scale-95">
        {{ cat.emoji }} {{ cat.label }}
      </button>
    </div>

    <!-- Spot list -->
    <div>
      <p class="text-xs font-bold text-food-muted tracking-wider uppercase mb-3">📍 精選地點</p>
      <div v-if="filteredSpots.length" class="space-y-3">
        <div v-for="spot in filteredSpots" :key="spot.name"
          @click="emit('select', spot)"
          class="bg-food-beige rounded-xl p-3 cursor-pointer hover:border-food-caramel border border-transparent transition active:scale-[0.98]">
          <div class="flex items-start gap-2">
            <span class="text-2xl shrink-0">{{ spot.emoji }}</span>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-food-brown text-sm truncate">{{ spot.name }}</p>
              <p class="text-food-muted text-xs mt-0.5 line-clamp-2">{{ spot.desc }}</p>
              <div class="flex flex-wrap gap-1 mt-1.5">
                <span v-for="t in spot.tags" :key="t"
                  class="px-2 py-0.5 bg-food-surface rounded-full text-[10px] text-food-muted border border-food-border">
                  {{ t }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="text-sm text-food-muted text-center py-4">找不到符合的地點</p>
    </div>

  </div>
</template>

<script lang="ts" setup>
import type { Spot } from '~/pages/map.vue'

const props = defineProps<{
  categories: { label: string; emoji: string; active: boolean }[]
  spots: Spot[]
}>()

const emit = defineEmits<{ select: [spot: Spot] }>()

const search = ref('')

const activeLabels = computed(() => props.categories.filter(c => c.active).map(c => c.label))

const filteredSpots = computed(() => props.spots.filter(spot => {
  const matchSearch = !search.value ||
    spot.name.includes(search.value) ||
    spot.desc.includes(search.value)
  const matchCategory = activeLabels.value.length === 0 ||
    spot.tags.some(t => activeLabels.value.includes(t))
  return matchSearch && matchCategory
}))
</script>
