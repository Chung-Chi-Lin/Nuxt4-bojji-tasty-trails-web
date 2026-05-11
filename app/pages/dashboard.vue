<template>
  <div class="min-h-screen flex flex-col">

    <TribalStripe :height="20"/>

    <!-- Navbar -->
    <nav class="bg-amis-surface border-b border-amis-border px-6 py-4 flex items-center justify-between">
      <NuxtLink to="/welcome" class="flex items-center gap-2 group">
        <span class="text-xl">🌿</span>
        <span class="font-tribal text-amis-gold group-hover:text-amis-gold-light font-bold tracking-wide transition">Pangcah 學習</span>
      </NuxtLink>
      <div class="flex items-center gap-5">
        <NuxtLink to="/welcome" class="text-sm text-amis-muted hover:text-amis-cream transition hidden sm:block">首頁</NuxtLink>
        <span v-if="user" class="text-amis-cream/70 text-sm hidden sm:block">{{ user.name }}</span>
        <button
          @click="handleLogout"
          class="px-4 py-1.5 text-sm rounded border border-amis-border hover:border-amis-gold/50 hover:text-amis-gold transition"
        >
          登出
        </button>
      </div>
    </nav>

    <!-- Content -->
    <main class="max-w-3xl mx-auto px-4 py-10 flex-1 w-full">

      <div v-if="pending" class="flex justify-center py-20 text-amis-muted">載入中…</div>

      <div v-else-if="error" class="text-center py-20 text-red-400">
        {{ error.data?.statusMessage ?? '無法取得使用者資料' }}
      </div>

      <template v-else-if="user">
        <!-- Section title with diamond accent -->
        <div class="flex items-center gap-3 mb-6">
          <span class="w-3 h-3 rotate-45 bg-amis-gold inline-block shrink-0"></span>
          <h2 class="font-tribal text-2xl font-bold text-amis-cream tracking-wide">個人資料</h2>
          <div class="flex-1 h-px bg-amis-border"></div>
        </div>

        <!-- Profile Card -->
        <div class="bg-amis-surface rounded-2xl border border-amis-border overflow-hidden">

          <!-- Banner: tribal gradient -->
          <div class="h-24 relative overflow-hidden"
               style="background: linear-gradient(135deg, #5E0F0F 0%, #8B1A1A 50%, #C8960C 100%)">
            <!-- diamond overlay pattern -->
            <div class="absolute inset-0 opacity-20"
                 style="background-image: linear-gradient(45deg,#000 25%,transparent 25%,transparent 75%,#000 75%),linear-gradient(45deg,#000 25%,transparent 25%,transparent 75%,#000 75%);background-size:16px 16px;background-position:0 0,8px 8px">
            </div>
          </div>

          <div class="px-6 pb-6">
            <!-- Avatar row -->
            <div class="flex items-end justify-between -mt-8 mb-4">
              <div class="w-16 h-16 rounded-full bg-amis-dark border-4 border-amis-surface flex items-center justify-center text-3xl">
                {{ user.role === 'Admin' ? '👨‍💻' : '👩‍💼' }}
              </div>
              <span class="px-3 py-1 text-xs font-bold rounded-full border"
                :class="user.role === 'Admin'
                  ? 'bg-amis-red/30 text-amis-gold border-amis-red/50'
                  : 'bg-green-900/40 text-green-400 border-green-700/50'"
              >
                {{ user.role }}
              </span>
            </div>

            <h3 class="font-tribal text-xl font-bold text-amis-cream">{{ user.name }}</h3>
            <p class="text-amis-muted text-sm mt-1">{{ user.bio }}</p>

            <div class="my-5 h-px bg-amis-border"></div>

            <!-- Details Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="item in details" :key="item.label"
                   class="bg-amis-dark rounded-xl p-4 border border-amis-border">
                <p class="text-xs text-amis-muted mb-1 tracking-wider uppercase">{{ item.label }}</p>
                <p class="text-sm font-medium text-amis-cream" :class="item.mono ? 'font-mono' : ''">
                  {{ item.value }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- API raw data -->
        <div class="mt-6 bg-amis-surface rounded-xl border border-amis-border p-5">
          <p class="text-xs text-amis-muted font-medium mb-3 tracking-wider">▸ 後端 API 回傳原始資料（GET /api/auth/me）</p>
          <pre class="text-xs text-amis-gold/80 font-mono overflow-x-auto">{{ JSON.stringify({ user }, null, 2) }}</pre>
        </div>

      </template>
    </main>

    <TribalStripe :height="20"/>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ middleware: 'auth' })

useHead({ title: '個人資料 — Pangcah 學習' })

const router = useRouter()
const token  = useCookie('auth_token')

const { data, pending, error } = await useFetch('/api/auth/me', {
  headers: { Authorization: `Bearer ${token.value ?? ''}` },
})

const user = computed(() => data.value?.user)

const details = computed(() => user.value ? [
  { label: '電子郵件', value: user.value.email,        mono: false },
  { label: '使用者 ID', value: `#${user.value.id}`,   mono: true  },
  { label: '權限角色',  value: user.value.role,        mono: false },
  { label: '加入日期',  value: user.value.joinedAt,    mono: false },
] : [])

function handleLogout() {
  token.value = null
  router.push('/login')
}
</script>
