<template>
  <div class="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50" @click="$emit('cancel')" />

    <div class="relative bg-food-surface rounded-2xl w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl">

      <!-- Header -->
      <div class="sticky top-0 bg-food-surface px-5 py-4 border-b border-food-border flex items-center justify-between z-10">
        <h2 class="font-bold text-food-brown">✏️ 編輯美食標記</h2>
        <button @click="$emit('cancel')" class="w-7 h-7 flex items-center justify-center rounded-full text-food-muted hover:bg-food-beige hover:text-food-brown transition">✕</button>
      </div>

      <div class="p-5 space-y-5">

        <!-- 座標（唯讀）-->
        <div class="bg-food-beige rounded-xl px-4 py-2.5 text-xs text-food-muted flex items-center gap-2">
          <span>📌</span>
          <span class="font-mono">{{ spot.lat.toFixed(5) }}, {{ spot.lng.toFixed(5) }}</span>
        </div>

        <!-- 圖示 -->
        <div>
          <label class="block text-xs font-bold text-food-muted mb-2 tracking-wider uppercase">圖示</label>
          <div class="flex flex-wrap gap-2 mb-2">
            <button v-for="e in QUICK_EMOJIS" :key="e" type="button"
              @click="emoji = e"
              :class="emoji === e ? 'ring-2 ring-food-caramel bg-food-beige' : 'bg-food-input hover:bg-food-beige'"
              class="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition">
              {{ e }}
            </button>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-food-muted">自訂：</span>
            <input v-model="emoji" type="text" maxlength="2" placeholder="🍽️"
              class="w-14 h-9 rounded-xl text-center text-xl bg-food-input border border-food-border focus:border-food-caramel focus:outline-none" />
          </div>
        </div>

        <!-- 名稱 -->
        <div>
          <label class="block text-xs font-bold text-food-muted mb-1.5 tracking-wider uppercase">名稱 <span class="text-food-red">*</span></label>
          <input v-model="name" type="text" maxlength="50"
            class="w-full px-4 py-3 rounded-xl bg-food-input border border-food-border text-food-brown focus:outline-none focus:border-food-caramel transition text-sm" />
          <p v-if="nameError" class="text-food-red text-xs mt-1">{{ nameError }}</p>
        </div>

        <!-- 標籤 -->
        <div>
          <label class="block text-xs font-bold text-food-muted mb-1.5 tracking-wider uppercase">標籤（最多 5 個）</label>
          <div v-if="tags.length" class="flex flex-wrap gap-1.5 mb-2">
            <span v-for="(tag, i) in tags" :key="i"
              class="inline-flex items-center gap-1 px-2.5 py-1 bg-food-beige text-food-muted rounded-full text-xs">
              {{ tag }}
              <button type="button" @click="removeTag(i)" class="hover:text-food-red transition leading-none">✕</button>
            </span>
          </div>
          <input v-if="tags.length < 5" v-model="tagInput" type="text" maxlength="15"
            placeholder="輸入標籤後按 Enter 或逗號"
            @keydown="handleTagKeydown"
            class="w-full px-4 py-2.5 rounded-xl bg-food-input border border-food-border text-food-brown placeholder-food-border focus:outline-none focus:border-food-caramel transition text-sm" />
        </div>

        <!-- 備註 -->
        <div>
          <label class="block text-xs font-bold text-food-muted mb-1.5 tracking-wider uppercase">備註</label>
          <textarea v-model="notes" rows="3" maxlength="200" placeholder="心得、推薦餐點、注意事項..."
            class="w-full px-4 py-3 rounded-xl bg-food-input border border-food-border text-food-brown placeholder-food-border focus:outline-none focus:border-food-caramel transition text-sm resize-none" />
        </div>

        <!-- 照片 -->
        <div>
          <label class="block text-xs font-bold text-food-muted mb-1.5 tracking-wider uppercase">
            照片
            <span class="font-normal normal-case text-food-border ml-1">最多 3 張，每張 ≤ 2 MB</span>
          </label>
          <div class="grid grid-cols-3 gap-2">
            <!-- Existing photos -->
            <div v-for="(url, i) in keepPhotos" :key="`existing-${i}`"
              class="relative aspect-square rounded-xl overflow-hidden bg-food-beige border border-food-border">
              <img :src="url" class="w-full h-full object-cover" />
              <button type="button" @click="removeExistingPhoto(i)"
                class="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full text-[10px] flex items-center justify-center hover:bg-black/80 transition leading-none">
                ✕
              </button>
            </div>
            <!-- New photo previews -->
            <div v-for="(preview, i) in newPreviews" :key="`new-${i}`"
              class="relative aspect-square rounded-xl overflow-hidden bg-food-beige border border-2 border-dashed border-food-caramel">
              <img :src="preview" class="w-full h-full object-cover" />
              <button type="button" @click="removeNewPhoto(i)"
                class="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full text-[10px] flex items-center justify-center hover:bg-black/80 transition leading-none">
                ✕
              </button>
              <span class="absolute bottom-1 left-1 text-[9px] bg-food-caramel text-white rounded px-1">新</span>
            </div>
            <!-- Add button -->
            <button v-if="totalPhotos < 3" type="button" @click="triggerPhotoInput"
              class="aspect-square rounded-xl border-2 border-dashed border-food-border hover:border-food-caramel bg-food-beige flex flex-col items-center justify-center gap-1 text-food-muted hover:text-food-caramel transition">
              <span class="text-xl leading-none select-none">📷</span>
              <span class="text-[10px] font-bold">新增</span>
            </button>
          </div>
          <input ref="photoInputEl" type="file" accept="image/jpeg,image/png,image/webp" multiple class="hidden" @change="handlePhotoSelect" />
          <p v-if="photoError" class="text-food-red text-xs mt-1">{{ photoError }}</p>
        </div>

        <!-- 公開切換 -->
        <div class="flex items-center justify-between py-1">
          <div>
            <p class="text-sm font-bold text-food-brown">公開標記</p>
            <p class="text-xs text-food-muted mt-0.5">開啟後所有使用者都能看到</p>
          </div>
          <button type="button" @click="isPublic = !isPublic"
            :class="isPublic ? 'bg-food-caramel justify-end' : 'bg-food-border justify-start'"
            class="w-12 h-6 rounded-full px-0.5 flex items-center transition-colors">
            <span class="w-5 h-5 bg-white rounded-full shadow-sm transition-all" />
          </button>
        </div>

        <p v-if="saveError" class="text-food-red text-sm">{{ saveError }}</p>

      </div>

      <!-- 底部按鈕 -->
      <div class="sticky bottom-0 bg-food-surface px-5 pb-5 pt-3 border-t border-food-border flex gap-3">
        <button type="button" @click="$emit('cancel')"
          class="flex-1 py-3 rounded-xl bg-food-beige text-food-muted font-bold text-sm hover:text-food-brown transition active:scale-95">
          取消
        </button>
        <button type="button" @click="handleSave" :disabled="saving"
          class="flex-1 py-3 rounded-xl bg-food-caramel text-white font-bold text-sm hover:bg-food-orange disabled:opacity-50 transition active:scale-95 flex items-center justify-center gap-2">
          <svg v-if="saving" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 22 6.477 22 12h-4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <span>{{ saving ? savingStatus : '儲存修改' }}</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
const QUICK_EMOJIS = ['🍜', '🍣', '🍕', '🍔', '🧋', '🍰', '🥘', '🌮', '🦐', '🍱', '🥗', '🫕', '🍤', '☕', '🧇', '🍞']

interface DbSpot {
  id: string
  user_id: string
  name: string
  emoji: string
  lat: number
  lng: number
  tags: string[]
  notes: string
  is_public: boolean
  photo_urls: string[]
  xp_earned: number
}

const props = defineProps<{
  spot: DbSpot
  token: string
}>()

const emit = defineEmits<{
  saved: [spot: any]
  cancel: []
}>()

// ── 基本欄位（預填）──────────────────────────────────────────
const emoji     = ref(props.spot.emoji || '📍')
const name      = ref(props.spot.name)
const tags      = ref<string[]>([...(props.spot.tags ?? [])])
const tagInput  = ref('')
const notes     = ref(props.spot.notes ?? '')
const isPublic  = ref(props.spot.is_public)
const nameError = ref('')
const saveError = ref('')
const saving    = ref(false)
const savingStatus = ref('')

// ── 標籤 ─────────────────────────────────────────────────────
function addTag() {
  const t = tagInput.value.trim().replace(/,/g, '')
  if (t && !tags.value.includes(t) && tags.value.length < 5) tags.value.push(t)
  tagInput.value = ''
}
function handleTagKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() }
}
function removeTag(i: number) { tags.value.splice(i, 1) }

// ── 照片 ─────────────────────────────────────────────────────
const photoInputEl   = ref<HTMLInputElement | null>(null)
const keepPhotos     = ref<string[]>([...(props.spot.photo_urls ?? [])])
const newFiles       = ref<File[]>([])
const newPreviews    = ref<string[]>([])
const photoError     = ref('')

const totalPhotos = computed(() => keepPhotos.value.length + newFiles.value.length)

onUnmounted(() => newPreviews.value.forEach(url => URL.revokeObjectURL(url)))

function triggerPhotoInput() { photoInputEl.value?.click() }

function removeExistingPhoto(i: number) { keepPhotos.value.splice(i, 1) }

function removeNewPhoto(i: number) {
  URL.revokeObjectURL(newPreviews.value[i])
  newFiles.value.splice(i, 1)
  newPreviews.value.splice(i, 1)
}

function handlePhotoSelect(e: Event) {
  photoError.value = ''
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  for (const file of files) {
    if (totalPhotos.value >= 3) break
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      photoError.value = '只接受 JPG、PNG、WebP 格式'; continue
    }
    if (file.size > 2 * 1024 * 1024) {
      photoError.value = '每張照片不超過 2 MB'; continue
    }
    newFiles.value.push(file)
    newPreviews.value.push(URL.createObjectURL(file))
  }
  if (input) input.value = ''
}

// ── 儲存 ─────────────────────────────────────────────────────
async function handleSave() {
  if (saving.value) return
  nameError.value = ''; saveError.value = ''
  if (!name.value.trim()) { nameError.value = '請填寫地點名稱'; return }

  const confirmed = window.confirm(
    `確定要儲存對「${name.value.trim()}」的修改嗎？\n\n原有資料將被覆蓋，以新的內容為主。`
  )
  if (!confirmed) return

  saving.value = true
  savingStatus.value = '更新中…'
  try {
    // Step 1: PATCH spot (with kept photos only)
    const { spot } = await $fetch<{ spot: any }>(`/api/spots/${props.spot.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${props.token}` },
      body: {
        name:       name.value.trim(),
        emoji:      emoji.value || '📍',
        tags:       tags.value,
        notes:      notes.value.trim(),
        is_public:  isPublic.value,
        photo_urls: keepPhotos.value,
      },
    })

    // Step 2: Upload new photos if any
    if (newFiles.value.length > 0) {
      savingStatus.value = `上傳照片中… (${newFiles.value.length} 張)`
      const form = new FormData()
      form.append('spotId', props.spot.id)
      newFiles.value.forEach(f => form.append('photos', f))
      try {
        const { photo_urls } = await $fetch<{ photo_urls: string[] }>('/api/spots/upload-photos', {
          method: 'POST',
          headers: { Authorization: `Bearer ${props.token}` },
          body: form,
        })
        spot.photo_urls = photo_urls
      } catch {
        // Photo upload failed silently
      }
    }

    emit('saved', spot)
  } catch (err: any) {
    saveError.value = err.data?.statusMessage ?? '更新失敗，請稍後再試'
  } finally {
    saving.value = false
    savingStatus.value = ''
  }
}
</script>
