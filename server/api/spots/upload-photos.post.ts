const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_BYTES     = 2 * 1024 * 1024 // 2 MB
const MAX_PHOTOS    = 3

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization') ?? ''
  const token      = authHeader.replace('Bearer ', '').trim()
  if (!token) throw createError({ statusCode: 401, statusMessage: '未登入' })

  const formData = await readMultipartFormData(event)
  if (!formData) throw createError({ statusCode: 400, statusMessage: '缺少表單資料' })

  const spotIdField = formData.find(f => f.name === 'spotId')
  const spotId      = spotIdField?.data.toString()
  if (!spotId) throw createError({ statusCode: 400, statusMessage: '缺少 spotId' })

  const admin = getSupabaseAdmin()
  const { data: { user }, error: authError } = await admin.auth.getUser(token)
  if (authError || !user) throw createError({ statusCode: 401, statusMessage: 'Token 無效或已過期' })

  // Verify ownership
  const { data: spot } = await admin
    .from('spots')
    .select('id, user_id, photo_urls')
    .eq('id', spotId)
    .single()
  if (!spot || spot.user_id !== user.id) throw createError({ statusCode: 403, statusMessage: '無權限' })

  const photoFields = formData.filter(f => f.name === 'photos')
  if (!photoFields.length) throw createError({ statusCode: 400, statusMessage: '沒有選取照片' })

  const existing   = (spot.photo_urls ?? []) as string[]
  const remaining  = MAX_PHOTOS - existing.length
  const toUpload   = photoFields.slice(0, remaining)

  if (!toUpload.length) throw createError({ statusCode: 400, statusMessage: `最多 ${MAX_PHOTOS} 張照片` })

  const newUrls: string[] = []

  for (const photo of toUpload) {
    if (!photo.type || !ALLOWED_TYPES.has(photo.type))
      throw createError({ statusCode: 400, statusMessage: '只接受 JPG、PNG、WebP 格式' })
    if (photo.data.length > MAX_BYTES)
      throw createError({ statusCode: 400, statusMessage: '每張照片不超過 2 MB' })

    const ext  = photo.type === 'image/jpeg' ? 'jpg' : photo.type.split('/')[1]
    const path = `${spotId}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { error: uploadError } = await admin.storage
      .from('spot-photos')
      .upload(path, new Uint8Array(photo.data), { contentType: photo.type, upsert: false })

    if (uploadError) throw createError({ statusCode: 500, statusMessage: `上傳失敗：${uploadError.message}` })

    const { data: { publicUrl } } = admin.storage.from('spot-photos').getPublicUrl(path)
    newUrls.push(publicUrl)
  }

  const photoUrls = [...existing, ...newUrls]

  await admin
    .from('spots')
    .update({ photo_urls: photoUrls })
    .eq('id', spotId)

  return { photo_urls: photoUrls }
})
