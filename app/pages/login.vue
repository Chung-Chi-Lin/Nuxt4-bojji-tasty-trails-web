<template>
  <!-- Background image + overlay -->
  <div class="min-h-screen relative flex items-center justify-center px-4 py-8">
    <div class="absolute inset-0 bg-[url('/images/login-bg.png')] bg-cover bg-center"></div>
    <div class="absolute inset-0 bg-black/45"></div>

    <!-- Content -->
    <div class="relative z-10 w-full max-w-sm sm:max-w-md">

      <!-- Logo -->
      <div class="text-center mb-6 sm:mb-8">
        <div class="text-4xl sm:text-5xl mb-2 sm:mb-3">🗺️</div>
        <h1 class="text-2xl sm:text-3xl font-bold text-white mb-1" style="text-shadow: 0 2px 8px rgba(0,0,0,0.6)">波吉的美食地圖</h1>
        <p class="font-pacifico text-white/90 text-base sm:text-lg" style="text-shadow: 0 1px 6px rgba(0,0,0,0.7)">Bojji's Tasty Trails</p>
      </div>

      <!-- Card -->
      <div class="bg-food-surface rounded-2xl sm:rounded-3xl shadow-2xl border border-food-border overflow-hidden">

        <!-- Tab toggle -->
        <div class="flex border-b border-food-border">
          <button
            @click="mode = 'login'"
            :class="mode === 'login' ? 'bg-food-caramel text-white' : 'text-food-muted hover:text-food-brown'"
            class="flex-1 py-3.5 sm:py-4 text-sm font-bold transition"
          >登入</button>
          <button
            @click="mode = 'register'"
            :class="mode === 'register' ? 'bg-food-caramel text-white' : 'text-food-muted hover:text-food-brown'"
            class="flex-1 py-3.5 sm:py-4 text-sm font-bold transition"
          >註冊</button>
        </div>

        <div class="p-6 sm:p-8">

          <!-- Login form -->
          <form v-if="mode === 'login'" @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-food-muted mb-1.5 tracking-wider uppercase">Email</label>
              <input v-model="form.email" type="email" inputmode="email" placeholder="your@email.com" autocomplete="email"
                class="w-full px-4 py-3 rounded-xl bg-food-input border border-food-border text-food-brown placeholder-food-border focus:outline-none focus:border-food-caramel transition text-base" />
            </div>
            <div>
              <label class="block text-xs font-bold text-food-muted mb-1.5 tracking-wider uppercase">密碼</label>
              <input v-model="form.password" type="password" placeholder="••••••••" autocomplete="current-password"
                class="w-full px-4 py-3 rounded-xl bg-food-input border border-food-border text-food-brown placeholder-food-border focus:outline-none focus:border-food-caramel transition text-base" />
            </div>
            <p v-if="errorMsg" class="text-food-red text-sm">{{ errorMsg }}</p>
            <button type="submit" :disabled="loading"
              class="w-full py-3.5 rounded-xl bg-food-caramel hover:bg-food-orange active:scale-95 disabled:opacity-50 text-white font-bold transition text-base">
              {{ loading ? '登入中…' : '登入 🍜' }}
            </button>
          </form>

          <!-- Register form -->
          <form v-else @submit.prevent="handleRegister" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-food-muted mb-1.5 tracking-wider uppercase">暱稱</label>
              <input v-model="form.username" type="text" placeholder="你的食客名稱" autocomplete="nickname"
                class="w-full px-4 py-3 rounded-xl bg-food-input border border-food-border text-food-brown placeholder-food-border focus:outline-none focus:border-food-caramel transition text-base" />
            </div>
            <div>
              <label class="block text-xs font-bold text-food-muted mb-1.5 tracking-wider uppercase">Email</label>
              <input v-model="form.email" type="email" inputmode="email" placeholder="your@email.com" autocomplete="email"
                class="w-full px-4 py-3 rounded-xl bg-food-input border border-food-border text-food-brown placeholder-food-border focus:outline-none focus:border-food-caramel transition text-base" />
            </div>
            <div>
              <label class="block text-xs font-bold text-food-muted mb-1.5 tracking-wider uppercase">密碼（至少 6 字元）</label>
              <input v-model="form.password" type="password" placeholder="••••••••" autocomplete="new-password"
                class="w-full px-4 py-3 rounded-xl bg-food-input border border-food-border text-food-brown placeholder-food-border focus:outline-none focus:border-food-caramel transition text-base" />
            </div>
            <p v-if="errorMsg" class="text-food-red text-sm">{{ errorMsg }}</p>
            <p v-if="successMsg" class="text-green-600 text-sm">{{ successMsg }}</p>
            <button type="submit" :disabled="loading"
              class="w-full py-3.5 rounded-xl bg-food-caramel hover:bg-food-orange active:scale-95 disabled:opacity-50 text-white font-bold transition text-base">
              {{ loading ? '註冊中…' : '建立帳號 ✨' }}
            </button>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ middleware: 'guest' })
useHead({ title: '波吉的美食地圖' })

const router = useRouter()
const token  = useCookie('auth_token')

const mode       = ref<'login' | 'register'>('login')
const loading    = ref(false)
const errorMsg   = ref('')
const successMsg = ref('')
const form       = reactive({ email: '', password: '', username: '' })

watch(mode, () => { errorMsg.value = ''; successMsg.value = '' })

async function handleLogin() {
  if (loading.value) return                          // 防止 Enter 連按重複送出
  errorMsg.value = ''

  if (!form.email.trim())    { errorMsg.value = '請輸入 Email'; return }
  if (!form.password.trim()) { errorMsg.value = '請輸入密碼'; return }

  loading.value = true
  try {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: form.email.trim(), password: form.password },
    })
    token.value = data.token
    await router.push('/map')
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage ?? '登入失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  if (loading.value) return                          // 防止 Enter 連按重複送出
  errorMsg.value = ''; successMsg.value = ''

  if (!form.email.trim())    { errorMsg.value = '請輸入 Email'; return }
  if (!form.password)        { errorMsg.value = '請輸入密碼'; return }
  if (form.password.length < 6) { errorMsg.value = '密碼至少需要 6 個字元'; return }

  loading.value = true
  try {
    const data = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { email: form.email.trim(), password: form.password, username: form.username.trim() },
    })
    if (data.requiresConfirmation) {
      successMsg.value = '📬 驗證信已寄出，請到信箱點擊確認連結後再登入！'
    } else if (data.token) {
      token.value = data.token
      await router.push('/map')
    }
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage ?? '註冊失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}
</script>
