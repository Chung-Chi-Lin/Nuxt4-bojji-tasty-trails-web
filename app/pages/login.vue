<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4">

    <!-- Top stripe -->
    <div class="fixed top-0 left-0 right-0 z-10">
      <TribalStripe :height="20"/>
    </div>

    <div class="w-full max-w-md mt-8">

      <!-- Logo -->
      <div class="text-center mb-8">
        <!-- Decorative diamonds -->
        <div class="flex justify-center gap-2 mb-4">
          <span v-for="i in 5" :key="i"
            class="w-3 h-3 rotate-45 bg-amis-gold"
            :style="{ opacity: i === 3 ? 1 : 0.35 }"
          />
        </div>
        <h1 class="font-tribal text-4xl font-black text-amis-gold tracking-wider mb-1">Pangcah</h1>
        <p class="text-amis-muted text-sm tracking-widest">阿美族語言學習平台</p>
      </div>

      <!-- Card -->
      <div class="bg-amis-surface rounded-2xl border border-amis-border overflow-hidden shadow-2xl">

        <!-- Card top stripe -->
        <TribalStripe :height="16"/>

        <div class="p-8">
          <h2 class="text-amis-cream font-bold text-lg mb-6 text-center tracking-wide">登入帳號</h2>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Username -->
            <div>
              <label class="block text-xs font-medium text-amis-muted mb-1.5 tracking-wider uppercase">帳號</label>
              <input
                v-model="form.username"
                type="text"
                placeholder="輸入帳號"
                autocomplete="username"
                class="w-full px-4 py-2.5 rounded-lg bg-amis-dark border border-amis-border text-amis-cream placeholder-amis-muted/50 focus:outline-none focus:border-amis-gold transition"
              />
            </div>

            <!-- Password -->
            <div>
              <label class="block text-xs font-medium text-amis-muted mb-1.5 tracking-wider uppercase">密碼</label>
              <input
                v-model="form.password"
                type="password"
                placeholder="輸入密碼"
                autocomplete="current-password"
                class="w-full px-4 py-2.5 rounded-lg bg-amis-dark border border-amis-border text-amis-cream placeholder-amis-muted/50 focus:outline-none focus:border-amis-gold transition"
              />
            </div>

            <!-- Error -->
            <p v-if="errorMsg" class="text-red-400 text-sm">{{ errorMsg }}</p>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 rounded-lg bg-amis-red hover:bg-amis-red-dark disabled:opacity-50 disabled:cursor-not-allowed text-amis-cream font-bold tracking-widest transition border border-amis-red"
            >
              {{ loading ? '登入中…' : '登 入' }}
            </button>
          </form>

        </div>

        <!-- Card bottom stripe -->
        <TribalStripe :height="16"/>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ middleware: 'guest' })

useHead({ title: '登入 — Pangcah 學習' })

const router   = useRouter()
const token    = useCookie('auth_token')
const form     = reactive({ username: '', password: '' })
const loading  = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  errorMsg.value = ''
  loading.value  = true
  try {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username: form.username, password: form.password },
    })
    token.value = data.token
    await router.push('/welcome')
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage ?? '登入失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}
</script>
