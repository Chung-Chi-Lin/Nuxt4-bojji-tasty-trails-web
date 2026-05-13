export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization') ?? ''
  const token      = authHeader.replace('Bearer ', '').trim()

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: '未登入' })
  }

  const admin = getSupabaseAdmin()

  // Token 驗證
  const { data: { user }, error } = await admin.auth.getUser(token)
  if (error || !user) {
    throw createError({ statusCode: 401, statusMessage: 'Token 無效或已過期' })
  }

  // 從 profiles 表撈最新顯示資料
  const { data: profile } = await admin
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', user.id)
    .single()

  return {
    user: {
      id:         user.id,
      email:      user.email,
      username:   profile?.username ?? user.user_metadata?.username ?? user.email?.split('@')[0],
      avatar_url: profile?.avatar_url ?? null,
    }
  }
})
