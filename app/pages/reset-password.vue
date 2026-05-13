<template>
  <div class="min-h-screen relative flex items-center justify-center px-4 py-8">
    <div class="absolute inset-0 bg-[url('/images/login-bg.png')] bg-cover bg-center"></div>
    <div class="absolute inset-0 bg-black/45"></div>

    <div class="relative z-10 w-full max-w-sm sm:max-w-md">

      <!-- Logo -->
      <div class="text-center mb-6 sm:mb-8">
        <div class="text-4xl sm:text-5xl mb-2 sm:mb-3">🗺️</div>
        <h1 class="text-2xl sm:text-3xl font-bold text-white mb-1" style="text-shadow: 0 2px 8px rgba(0,0,0,0.6)">波吉的美食地圖</h1>
        <p class="font-caveat text-white/90 text-base sm:text-lg" style="text-shadow: 0 1px 6px rgba(0,0,0,0.7)">Bojji's Tasty Trails</p>
      </div>

      <div class="bg-food-surface rounded-2xl sm:rounded-3xl shadow-2xl border border-food-border overflow-hidden">

        <div class="px-6 pt-5 pb-1 border-b border-food-border">
          <h2 class="text-base font-bold text-food-brown">🔐 重設密碼</h2>
        </div>

        <div class="p-6 sm:p-8">

          <!-- 連結無效 -->
          <div v-if="tokenError" class="text-center space-y-4">
            <p class="text-food-red text-sm">{{ tokenError }}</p>
            <NuxtLink to="/login"
              class="inline-block text-sm text-food-caramel hover:underline">
              ← 回到登入頁
            </NuxtLink>
          </div>

          <!-- 成功 -->
          <div v-else-if="successMsg" class="text-center space-y-4">
            <p class="text-green-600 text-sm">{{ successMsg }}</p>
            <p class="text-food-muted text-xs">即將跳回登入頁…</p>
          </div>

          <!-- 表單 -->
          <form v-else @submit.prevent="handleReset" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-food-muted mb-1.5 tracking-wider uppercase">新密碼（至少 6 字元）</label>
              <input v-model="password" type="password" placeholder="••••••••" autocomplete="new-password"
                class="w-full px-4 py-3 rounded-xl bg-food-input border border-food-border text-food-brown placeholder-food-border focus:outline-none focus:border-food-caramel transition text-base" />
            </div>
            <div>
              <label class="block text-xs font-bold text-food-muted mb-1.5 tracking-wider uppercase">確認新密碼</label>
              <input v-model="confirm" type="password" placeholder="••••••••" autocomplete="new-password"
                class="w-full px-4 py-3 rounded-xl bg-food-input border border-food-border text-food-brown placeholder-food-border focus:outline-none focus:border-food-caramel transition text-base" />
            </div>
            <p v-if="errorMsg" class="text-food-red text-sm">{{ errorMsg }}</p>
            <button type="submit" :disabled="loading"
              class="w-full py-3.5 rounded-xl bg-food-caramel hover:bg-food-orange active:scale-95 disabled:opacity-50 text-white font-bold transition text-base flex items-center justify-center gap-2">
              <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 22 6.477 22 12h-4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span>{{ loading ? '更新中…' : '更新密碼' }}</span>
            </button>
            <div class="text-center">
              <NuxtLink to="/login" class="text-xs text-food-muted hover:text-food-brown transition">← 回到登入頁</NuxtLink>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
useHead({ title: '重設密碼 — 波吉的美食地圖' })

const router    = useRouter()
const accessToken = ref('')
const password  = ref('')
const confirm   = ref('')
const loading   = ref(false)
const errorMsg  = ref('')
const successMsg = ref('')
const tokenError = ref('')

onMounted(() => {
  const hash   = window.location.hash.substring(1)
  const params = new URLSearchParams(hash)
  const token  = params.get('access_token')
  const type   = params.get('type')

  if (!token || type !== 'recovery') {
    tokenError.value = '連結無效或已過期，請重新申請重設密碼'
    return
  }
  accessToken.value = token
})

async function handleReset() {
  if (loading.value) return
  errorMsg.value = ''

  if (!password.value)            { errorMsg.value = '請輸入新密碼'; return }
  if (password.value.length < 6)  { errorMsg.value = '密碼至少需要 6 個字元'; return }
  if (password.value !== confirm.value) { errorMsg.value = '兩次輸入的密碼不一致'; return }

  loading.value = true
  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { accessToken: accessToken.value, newPassword: password.value },
    })
    successMsg.value = '✅ 密碼已成功更新！'
    setTimeout(() => router.push('/login'), 2000)
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage ?? '更新失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}
</script>
