<template>
  <div class="min-h-screen flex flex-col">

    <TribalStripe :height="28"/>

    <!-- Nav -->
    <nav class="bg-amis-surface border-b border-amis-border px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-xl">🌿</span>
        <span class="font-tribal text-amis-gold font-bold tracking-wide">Pangcah 學習</span>
      </div>
      <div class="flex items-center gap-5">
        <NuxtLink to="/dashboard" class="text-sm text-amis-muted hover:text-amis-cream transition">個人資料</NuxtLink>
        <button @click="handleLogout" class="text-sm px-3 py-1 rounded border border-amis-border hover:border-amis-gold/50 hover:text-amis-gold transition">
          登出
        </button>
      </div>
    </nav>

    <!-- Hero -->
    <main class="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">

      <!-- Label -->
      <p class="text-amis-gold/70 text-xs tracking-[0.35em] uppercase mb-6">
        阿美族語 · Pangcah · 台灣原住民
      </p>

      <!-- Decorative diamond row -->
      <div class="flex gap-3 mb-8 items-center">
        <div class="w-16 h-px bg-amis-gold/30"></div>
        <div class="flex gap-2">
          <span v-for="i in 5" :key="i"
            class="w-3 h-3 rotate-45 bg-amis-gold"
            :style="{ opacity: i === 3 ? 1 : 0.4 - Math.abs(i-3)*0.1 }"
          />
        </div>
        <div class="w-16 h-px bg-amis-gold/30"></div>
      </div>

      <!-- Main word -->
      <h1 class="font-tribal text-6xl sm:text-8xl lg:text-9xl font-black text-amis-cream mb-3 tracking-tight"
          style="text-shadow: 0 0 40px rgba(200,150,12,0.25)">
        Nga'ay ho?
      </h1>
      <p class="text-2xl text-amis-gold font-bold mb-1">您好嗎？· How are you?</p>
      <p class="text-amis-muted text-sm mb-10">[ nga' · ay · ho ] &nbsp;|&nbsp; 阿美族語日常問候</p>

      <!-- Play button -->
      <button
        @click="speak"
        :class="['w-28 h-28 rounded-full flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform hover:scale-105',
                 'bg-amis-red border-2 border-amis-gold',
                 isPlaying ? 'playing-pulse' : 'hover:bg-amis-red-dark']"
        :aria-label="isPlaying ? '播放中' : '播放發音'"
      >
        <span class="text-4xl select-none">{{ isPlaying ? '🔊' : '▶' }}</span>
        <span class="text-[11px] text-amis-cream/70 select-none">
          {{ isPlaying ? '播放中…' : '點擊聆聽' }}
        </span>
      </button>

      <!-- Hint -->
      <p class="text-amis-muted/60 text-xs mt-4 mb-10">點擊播放 Pangcah 族語發音，可在手機開啟音量</p>

      <!-- Diamond row -->
      <div class="flex gap-3 mb-10 items-center">
        <div class="w-16 h-px bg-amis-gold/30"></div>
        <div class="flex gap-2">
          <span v-for="i in 5" :key="i"
            class="w-3 h-3 rotate-45 bg-amis-gold"
            :style="{ opacity: i === 3 ? 1 : 0.4 - Math.abs(i-3)*0.1 }"
          />
        </div>
        <div class="w-16 h-px bg-amis-gold/30"></div>
      </div>

      <!-- Info card -->
      <div class="max-w-md w-full bg-amis-surface border border-amis-border rounded-2xl p-6 text-left">
        <h3 class="text-amis-gold font-bold mb-4 flex items-center gap-2">
          <span class="w-2 h-2 rotate-45 bg-amis-gold inline-block"></span>
          關於這個詞
        </h3>

        <!-- Phrase breakdown -->
        <div class="flex gap-3 mb-4">
          <div class="flex-1 bg-amis-dark rounded-xl p-3 text-center border border-amis-border">
            <p class="font-tribal text-amis-gold text-lg font-bold">Nga'ay ho?</p>
            <p class="text-amis-cream/60 text-xs mt-1">您好嗎？</p>
          </div>
          <div class="flex items-center text-amis-muted text-xl">→</div>
          <div class="flex-1 bg-amis-dark rounded-xl p-3 text-center border border-amis-border">
            <p class="font-tribal text-amis-gold text-lg font-bold">Mamaan aca</p>
            <p class="text-amis-cream/60 text-xs mt-1">我很好，謝謝</p>
          </div>
        </div>

        <p class="text-amis-cream/80 text-sm leading-relaxed mb-4">
          「Nga'ay ho?」是 Pangcah（阿美族）語中最常用的日常問候語，
          意思是「您好嗎？」。其中
          <span class="text-amis-gold font-mono">'</span>
          代表喉塞音（glottal stop），是一個短促的停頓。
          回應時通常說「Mamaan aca, kiso hani?」（我很好，你呢？）。
        </p>

        <p class="text-amis-cream/60 text-xs leading-relaxed">
          阿美族自稱 Pangcah，意為「人」與「同族」。
          是台灣 16 個官方認定原住民族中人口最多的族群，
          主要分布於花蓮、台東沿海及宜蘭平原。
        </p>

        <div class="mt-4 flex flex-wrap gap-2">
          <span class="px-3 py-1 text-xs rounded-full bg-amis-red/30 text-amis-gold border border-amis-red/50">Pangcah</span>
          <span class="px-3 py-1 text-xs rounded-full bg-amis-red/30 text-amis-gold border border-amis-red/50">阿美族</span>
          <span class="px-3 py-1 text-xs rounded-full bg-amis-red/30 text-amis-gold border border-amis-red/50">台灣原住民</span>
          <span class="px-3 py-1 text-xs rounded-full bg-amis-red/30 text-amis-gold border border-amis-red/50">南島語系</span>
        </div>
      </div>

      <!-- Nav to profile -->
      <NuxtLink
        to="/dashboard"
        class="mt-8 px-8 py-3 rounded-full border-2 border-amis-gold text-amis-gold hover:bg-amis-gold hover:text-amis-dark font-bold transition text-sm tracking-wide"
      >
        查看個人資料 →
      </NuxtLink>

    </main>

    <TribalStripe :height="28"/>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ middleware: 'auth' })

useHead({ title: "Nga'ay ho? — Pangcah 學習" })

const router = useRouter()
const token  = useCookie('auth_token')
const isPlaying = ref(false)
let currentAudio: HTMLAudioElement | null = null

async function speak() {
  if (!import.meta.client || isPlaying.value) return

  currentAudio?.pause()
  isPlaying.value = true

  try {
    // fetch 只有一條錯誤路徑（catch），不像 new Audio() 會同時觸發 onerror + play() reject
    const res = await fetch('/api/audio/nga-ay-ho')
    if (!res.ok) throw new Error(`audio ${res.status}`)

    const blob = await res.blob()
    const url  = URL.createObjectURL(blob)
    const audio = new Audio(url)
    currentAudio = audio

    audio.onended = () => {
      URL.revokeObjectURL(url)
      isPlaying.value = false
    }
    await audio.play()
  } catch {
    // 音檔不存在或載入失敗 → fallback 到語音合成
    speakFallback()
  }
}

function speakFallback() {
  const synth = window.speechSynthesis
  if (!synth) { isPlaying.value = false; return }
  synth.cancel()
  const u = new SpeechSynthesisUtterance("Nga ay ho")
  u.lang  = 'en-US'
  u.rate  = 0.55
  u.pitch = 1.05
  u.onend   = () => { isPlaying.value = false }
  u.onerror = () => { isPlaying.value = false }
  synth.speak(u)
}

function handleLogout() {
  token.value = null
  router.push('/login')
}
</script>
