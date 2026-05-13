export default defineEventHandler(async (event) => {
  const { accessToken, newPassword } = await readBody(event)

  if (!accessToken || !newPassword) {
    throw createError({ statusCode: 400, statusMessage: '缺少必要參數' })
  }
  if (newPassword.length < 6) {
    throw createError({ statusCode: 400, statusMessage: '密碼至少需要 6 個字元' })
  }

  const admin = getSupabaseAdmin()

  const { data: { user }, error: authError } = await admin.auth.getUser(accessToken)
  if (authError || !user) {
    throw createError({ statusCode: 401, statusMessage: '連結已失效，請重新申請重設密碼' })
  }

  const { error } = await admin.auth.admin.updateUserById(user.id, { password: newPassword })
  if (error) {
    throw createError({ statusCode: 400, statusMessage: '密碼更新失敗，請稍後再試' })
  }

  return { ok: true }
})
