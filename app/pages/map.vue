<template>
  <div class="h-[100dvh] flex flex-col overflow-hidden bg-food-cream">

    <!-- Header -->
    <header class="bg-food-surface border-b border-food-border px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between shrink-0 z-10">
      <div class="flex items-center gap-2 sm:gap-3">
        <span class="text-xl sm:text-2xl">🗺️</span>
        <div>
          <h1 class="font-bold text-food-brown text-sm sm:text-base leading-tight">波吉的美食地圖</h1>
          <p class="hidden sm:block font-pacifico text-food-caramel text-xs leading-tight">Bojji's Tasty Trails</p>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-food-beige border-2 border-food-border flex items-center justify-center text-base sm:text-lg cursor-pointer hover:border-food-caramel transition"
             :title="user?.username ?? ''">👤</div>
        <button @click="handleLogout"
          class="text-xs text-food-muted hover:text-food-brown transition px-2.5 sm:px-3 py-1.5 rounded-lg border border-food-border hover:border-food-caramel">
          登出
        </button>
      </div>
    </header>

    <!-- Body -->
    <div class="flex flex-1 overflow-hidden relative">

      <!-- Map -->
      <div class="flex-1 relative">
        <ClientOnly>
          <MapView class="absolute inset-0" :spots="spots" :selected-spot="selectedSpot" />
        </ClientOnly>
      </div>

      <!-- ── Desktop: right sidebar ── -->
      <aside
        class="hidden md:flex flex-col bg-food-surface border-l border-food-border overflow-hidden shrink-0 transition-all duration-300 z-10"
        :style="{ width: sidebarOpen ? '320px' : '0px' }"
      >
        <div class="w-80 flex flex-col h-full overflow-y-auto">
          <SidebarContent :categories="categories" :spots="spots" @select="handleSpotSelect" />
        </div>
      </aside>

      <!-- Desktop toggle button (right edge) -->
      <button
        @click="sidebarOpen = !sidebarOpen"
        class="hidden md:flex absolute top-1/2 -translate-y-1/2 z-20 bg-food-surface border border-food-border rounded-l-xl px-2 py-4 shadow-md hover:bg-food-beige transition-all duration-300 flex-col items-center"
        :style="{ right: sidebarOpen ? '320px' : '0' }"
      >
        <span class="text-food-caramel font-bold text-sm">{{ sidebarOpen ? '›' : '‹' }}</span>
      </button>

      <!-- ── Mobile: bottom sheet ── -->
      <div
        class="md:hidden fixed inset-0 z-30 pointer-events-none"
        :class="sidebarOpen ? 'pointer-events-auto' : ''"
      >
        <!-- Backdrop -->
        <div
          @click="sidebarOpen = false"
          class="absolute inset-0 bg-black/30 transition-opacity duration-300"
          :class="sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        />

        <!-- Sheet -->
        <div
          class="absolute bottom-0 left-0 right-0 bg-food-surface rounded-t-2xl border-t border-food-border transition-transform duration-300 max-h-[65vh] overflow-y-auto"
          :class="sidebarOpen ? 'translate-y-0' : 'translate-y-full'"
        >
          <!-- Handle -->
          <div class="flex justify-center pt-3 pb-1">
            <div class="w-10 h-1 rounded-full bg-food-border"></div>
          </div>
          <SidebarContent :categories="categories" :spots="spots" @select="handleSpotSelect" />
        </div>
      </div>
    </div>

    <!-- Mobile FAB: open sidebar -->
    <button
      v-if="!sidebarOpen"
      @click="sidebarOpen = true"
      class="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-20 bg-food-caramel text-white px-5 py-3 rounded-full shadow-lg font-bold text-sm flex items-center gap-2 active:scale-95 transition"
    >
      <span>🍜</span> 美食清單
    </button>

  </div>
</template>

<script lang="ts" setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: '地圖 — 波吉的美食地圖' })

export interface Spot {
  lat: number
  lng: number
  name: string
  emoji: string
  desc: string
  tags: string[]
}

const router = useRouter()
const token  = useCookie('auth_token')

const sidebarOpen = ref(false)
onMounted(() => {
  if (window.innerWidth >= 768) sidebarOpen.value = true
})

const { data, error } = await useFetch('/api/auth/me', {
  headers: { Authorization: `Bearer ${token.value ?? ''}` },
})
if (error.value) {
  token.value = null
  await navigateTo('/login')
}
const user = computed(() => data.value?.user)

const categories = reactive([
  { label: '台式', emoji: '🍱', active: false },
  { label: '日式', emoji: '🍣', active: false },
  { label: '韓式', emoji: '🌶️', active: false },
  { label: '西式', emoji: '🍔', active: false },
  { label: '甜點', emoji: '🧁', active: false },
  { label: '飲料', emoji: '🧋', active: false },
])

const spots: Spot[] = [
  { lat: 25.0479, lng: 121.5170, name: '士林夜市',     emoji: '🌮', desc: '台北最大夜市，小吃應有盡有',    tags: ['台式', '夜市'] },
  { lat: 25.0326, lng: 121.5654, name: '饒河街夜市',   emoji: '🍢', desc: '百年胡椒餅必吃，海鮮超新鮮',    tags: ['台式', '夜市'] },
  { lat: 25.0424, lng: 121.5344, name: '寧夏夜市',     emoji: '🍲', desc: '台北人的家常味，深夜食堂氛圍',   tags: ['台式'] },
  { lat: 25.0330, lng: 121.5440, name: '師大路美食街', emoji: '🍜', desc: '學生最愛巷弄小吃聚集地',        tags: ['台式', '平價'] },
  { lat: 25.0409, lng: 121.5700, name: '六合夜市',     emoji: '🦐', desc: '海鮮超新鮮，現撈現煮',          tags: ['台式', '夜市'] },
  { lat: 25.0268, lng: 121.5431, name: 'Gonna Gonza',  emoji: '🍕', desc: '義大利窯烤 Pizza，必點瑪格麗特', tags: ['西式'] },
]

const selectedSpot = ref<Spot | null>(null)

function handleSpotSelect(spot: Spot) {
  selectedSpot.value = spot
  if (window.innerWidth < 768) sidebarOpen.value = false
}

function handleLogout() {
  token.value = null
  router.push('/login')
}
</script>
