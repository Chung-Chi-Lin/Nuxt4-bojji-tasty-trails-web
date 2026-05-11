import { MOCK_USERS, tokenStore, generateToken } from '../../utils/users'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body ?? {}

  if (!username || !password) {
    throw createError({ statusCode: 400, statusMessage: '請輸入帳號和密碼' })
  }

  const user = MOCK_USERS.find(
    (u) => u.username === username && u.password === password
  )

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: '帳號或密碼錯誤' })
  }

  const token = generateToken()
  tokenStore.set(token, user.id)

  const { password: _, ...safeUser } = user

  return { token, user: safeUser }
})
