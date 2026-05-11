<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-950 px-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="text-5xl mb-3">🚀</div>
        <h1 class="text-3xl font-bold text-white">MyApp</h1>
        <p class="text-gray-400 mt-1">請登入以繼續使用</p>
      </div>

      <!-- Card -->
      <div class="bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">帳號</label>
            <input
              v-model="form.username"
              type="text"
              placeholder="輸入帳號"
              autocomplete="username"
              class="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">密碼</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="輸入密碼"
              autocomplete="current-password"
              class="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <!-- Error -->
          <p v-if="errorMsg" class="text-red-400 text-sm">{{ errorMsg }}</p>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition"
          >
            {{ loading ? '登入中...' : '登入' }}
          </button>
        </form>

        <!-- Demo hint -->
        <div class="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <p class="text-xs text-gray-400 font-medium mb-2">測試帳號</p>
          <div class="space-y-1 text-xs text-gray-300 font-mono">
            <p>👤 john / password123 (Admin)</p>
            <p>👤 jane / secret456 (Editor)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ middleware: 'guest' })

useHead({ title: '登入 — MyApp' })

const router = useRouter()
const token = useCookie('auth_token')

const form = reactive({ username: '', password: '' })
const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  errorMsg.value = ''
  loading.value = true

  try {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username: form.username, password: form.password },
    })

    token.value = data.token
    await router.push('/dashboard')
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage ?? '登入失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}
</script>
