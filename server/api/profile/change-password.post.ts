export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization') ?? ''
  const token      = authHeader.replace('Bearer ', '').trim()

  if (!token) throw createError({ statusCode: 401, statusMessage: '未登入' })

  const { oldPassword, newPassword } = await readBody(event)

  if (!oldPassword)            throw createError({ statusCode: 400, statusMessage: '請輸入舊密碼' })
  if (!newPassword)            throw createError({ statusCode: 400, statusMessage: '請輸入新密碼' })
  if (newPassword.length < 6)  throw createError({ statusCode: 400, statusMessage: '新密碼至少需要 6 個字元' })

  const admin  = getSupabaseAdmin()
  const client = getSupabaseClient()

  const { data: { user }, error: authError } = await admin.auth.getUser(token)
  if (authError || !user) throw createError({ statusCode: 401, statusMessage: 'Token 無效或已過期' })

  const { error: signInError } = await client.auth.signInWithPassword({
    email: user.email!,
    password: oldPassword,
  })
  if (signInError) throw createError({ statusCode: 401, statusMessage: '舊密碼不正確' })

  const { error: updateError } = await admin.auth.admin.updateUserById(user.id, {
    password: newPassword,
  })
  if (updateError) throw createError({ statusCode: 500, statusMessage: '密碼更新失敗，請稍後再試' })

  return { ok: true }
})
