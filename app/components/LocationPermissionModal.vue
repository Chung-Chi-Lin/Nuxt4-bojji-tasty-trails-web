<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-black/40" />
      <div class="relative bg-food-surface rounded-2xl shadow-2xl border border-food-border w-full max-w-xs p-6 flex flex-col items-center text-center gap-4">

        <div class="w-14 h-14 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
          <svg class="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <div>
          <h3 class="font-bold text-food-brown text-base mb-1.5">允許取得您的位置？</h3>
          <p class="text-food-muted text-xs leading-relaxed">僅用於顯示附近美食<br>不會儲存或分享您的位置</p>
        </div>

        <div class="flex gap-3 w-full">
          <button
            class="flex-1 py-2.5 rounded-xl border border-food-border text-food-muted text-sm font-bold hover:bg-food-beige transition"
            @click="emit('deny')"
          >
            略過
          </button>
          <button
            class="flex-1 py-2.5 rounded-xl bg-food-caramel text-white text-sm font-bold hover:bg-food-orange transition active:scale-95"
            @click="emit('allow')"
          >
            允許
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
defineProps<{ open: boolean }>()

const emit = defineEmits<{
  allow: []
  deny: []
}>()
</script>
