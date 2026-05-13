export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)

  if (!email?.trim()) {
    throw createError({ statusCode: 400, statusMessage: '請填寫 Email' })
  }

  const { origin } = getRequestURL(event)
  const supabase = getSupabaseClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: `${origin}/reset-password`,
  })

  if (error) {
    throw createError({ statusCode: 400, statusMessage: '寄送失敗，請確認 Email 是否正確' })
  }

  return { ok: true }
})
