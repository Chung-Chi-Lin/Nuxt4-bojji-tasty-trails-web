import { getUserByToken } from '../../utils/users'

export default defineEventHandler((event) => {
  const authHeader = getHeader(event, 'authorization') ?? ''
  const token = authHeader.replace('Bearer ', '').trim()

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: '未登入' })
  }

  const user = getUserByToken(token)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Token 無效或已過期' })
  }

  return { user }
})
