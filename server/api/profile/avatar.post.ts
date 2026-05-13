export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization') ?? ''
  const token      = authHeader.replace('Bearer ', '').trim()

  if (!token) throw createError({ statusCode: 401, statusMessage: '未登入' })

  const admin = getSupabaseAdmin()
  const { data: { user }, error: authError } = await admin.auth.getUser(token)
  if (authError || !user) throw createError({ statusCode: 401, statusMessage: 'Token 無效或已過期' })

  const form = await readFormData(event)
  const file = form.get('avatar') as File | null

  if (!file) throw createError({ statusCode: 400, statusMessage: '請選擇圖片' })

  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowed.includes(file.type)) {
    throw createError({ statusCode: 400, statusMessage: '只接受 JPG、PNG、WebP 格式' })
  }
  if (file.size > 2 * 1024 * 1024) {
    throw createError({ statusCode: 400, statusMessage: '圖片大小不能超過 2MB' })
  }

  const ext  = file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'webp'
  const path = `${user.id}/avatar.${ext}`
  const body = new Uint8Array(await file.arrayBuffer())

  const { error: uploadError } = await admin.storage
    .from('avatars')
    .upload(path, body, { contentType: file.type, upsert: true })

  if (uploadError) {
    console.error('[avatar] storage upload error:', uploadError.message)
    throw createError({ statusCode: 500, statusMessage: `圖片上傳失敗：${uploadError.message}` })
  }

  const { data: { publicUrl } } = admin.storage.from('avatars').getPublicUrl(path)

  const { error: updateError } = await admin
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id)

  if (updateError) throw createError({ statusCode: 500, statusMessage: '頭像更新失敗' })

  return { avatar_url: publicUrl }
})
