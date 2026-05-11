<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <!-- Navbar -->
    <nav class="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-2xl">🚀</span>
        <span class="text-lg font-bold">MyApp</span>
      </div>
      <div class="flex items-center gap-4">
        <span v-if="user" class="text-gray-300 text-sm">{{ user.name }}</span>
        <button
          @click="handleLogout"
          class="px-4 py-1.5 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition"
        >
          登出
        </button>
      </div>
    </nav>

    <!-- Content -->
    <main class="max-w-3xl mx-auto px-4 py-10">
      <!-- Loading -->
      <div v-if="pending" class="flex justify-center py-20">
        <div class="text-gray-400">載入中...</div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20 text-red-400">
        {{ error.data?.statusMessage ?? '無法取得使用者資料' }}
      </div>

      <!-- Profile -->
      <template v-else-if="user">
        <h2 class="text-2xl font-bold mb-6">個人資料</h2>

        <!-- Profile Card -->
        <div class="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <!-- Header banner -->
          <div class="h-24 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

          <div class="px-6 pb-6">
            <!-- Avatar -->
            <div class="flex items-end justify-between -mt-8 mb-4">
              <div class="w-16 h-16 rounded-full bg-gray-800 border-4 border-gray-900 flex items-center justify-center text-3xl">
                {{ user.role === 'Admin' ? '👨‍💻' : '👩‍💼' }}
              </div>
              <span class="px-3 py-1 text-xs font-semibold rounded-full"
                :class="user.role === 'Admin' ? 'bg-indigo-900 text-indigo-300' : 'bg-green-900 text-green-300'"
              >
                {{ user.role }}
              </span>
            </div>

            <!-- Info -->
            <h3 class="text-xl font-bold">{{ user.name }}</h3>
            <p class="text-gray-400 text-sm mt-1">{{ user.bio }}</p>

            <hr class="border-gray-800 my-5" />

            <!-- Details Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="bg-gray-800 rounded-xl p-4">
                <p class="text-xs text-gray-400 mb-1">電子郵件</p>
                <p class="text-sm font-medium">{{ user.email }}</p>
              </div>
              <div class="bg-gray-800 rounded-xl p-4">
                <p class="text-xs text-gray-400 mb-1">使用者 ID</p>
                <p class="text-sm font-medium font-mono">#{{ user.id }}</p>
              </div>
              <div class="bg-gray-800 rounded-xl p-4">
                <p class="text-xs text-gray-400 mb-1">權限角色</p>
                <p class="text-sm font-medium">{{ user.role }}</p>
              </div>
              <div class="bg-gray-800 rounded-xl p-4">
                <p class="text-xs text-gray-400 mb-1">加入日期</p>
                <p class="text-sm font-medium">{{ user.joinedAt }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- API Response hint -->
        <div class="mt-6 bg-gray-900 rounded-xl border border-gray-800 p-5">
          <p class="text-xs text-gray-400 font-medium mb-3">後端 API 回傳的原始資料（GET /api/auth/me）</p>
          <pre class="text-xs text-green-400 font-mono overflow-x-auto">{{ JSON.stringify({ user }, null, 2) }}</pre>
        </div>
      </template>
    </main>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ middleware: 'auth' })

useHead({ title: '儀表板 — MyApp' })

const router = useRouter()
const token = useCookie('auth_token')

const { data, pending, error } = await useFetch('/api/auth/me', {
  headers: { Authorization: `Bearer ${token.value ?? ''}` },
})

const user = computed(() => data.value?.user)

function handleLogout() {
  token.value = null
  router.push('/login')
}
</script>
