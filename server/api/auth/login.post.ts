export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: '請填寫 Email 和密碼' })
  }

  const supabase = getSupabaseClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    throw createError({ statusCode: 401, statusMessage: '帳號或密碼錯誤' })
  }

  return {
    token: data.session.access_token,
    user: {
      id:       data.user.id,
      email:    data.user.email,
      username: data.user.user_metadata?.username ?? data.user.email?.split('@')[0],
    },
  }
})
