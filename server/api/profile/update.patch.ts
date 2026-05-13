export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization') ?? ''
  const token      = authHeader.replace('Bearer ', '').trim()

  if (!token) throw createError({ statusCode: 401, statusMessage: '未登入' })

  const { username } = await readBody(event)
  const trimmed = (username ?? '').trim()

  if (!trimmed)          throw createError({ statusCode: 400, statusMessage: '暱稱不能為空' })
  if (trimmed.length > 20) throw createError({ statusCode: 400, statusMessage: '暱稱不能超過 20 個字元' })

  const admin = getSupabaseAdmin()
  const { data: { user }, error: authError } = await admin.auth.getUser(token)
  if (authError || !user) throw createError({ statusCode: 401, statusMessage: 'Token 無效或已過期' })

  const { error: profileError } = await admin
    .from('profiles')
    .update({ username: trimmed })
    .eq('id', user.id)

  if (profileError) throw createError({ statusCode: 500, statusMessage: '更新失敗，請稍後再試' })

  await admin.auth.admin.updateUserById(user.id, {
    user_metadata: { ...user.user_metadata, username: trimmed },
  })

  return { username: trimmed }
})
