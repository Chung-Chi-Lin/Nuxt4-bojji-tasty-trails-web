export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization') ?? ''
  const token      = authHeader.replace('Bearer ', '').trim()
  if (!token) throw createError({ statusCode: 401, statusMessage: '未登入' })

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: '缺少 ID' })

  const admin = getSupabaseAdmin()
  const { data: { user }, error: authError } = await admin.auth.getUser(token)
  if (authError || !user) throw createError({ statusCode: 401, statusMessage: 'Token 無效或已過期' })

  // Get spot before deleting (need xp_earned for XP deduction)
  const { data: spot } = await admin
    .from('spots')
    .select('id, user_id, xp_earned')
    .eq('id', id)
    .single()

  if (!spot || spot.user_id !== user.id)
    throw createError({ statusCode: 403, statusMessage: '無權限或標記不存在' })

  const { error } = await admin
    .from('spots')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw createError({ statusCode: 500, statusMessage: '刪除失敗' })

  // Deduct XP (use the exact amount stored at creation — don't recalculate)
  const xpToDeduct = spot.xp_earned ?? 0
  let newXp = 0
  let newLevel = 1

  if (xpToDeduct > 0) {
    const { data: profile } = await admin
      .from('profiles')
      .select('xp, user_level')
      .eq('id', user.id)
      .single()

    if (profile) {
      newXp    = Math.max(0, (profile.xp ?? 0) - xpToDeduct)
      newLevel = levelFromXp(newXp)
      await admin
        .from('profiles')
        .update({ xp: newXp, user_level: newLevel })
        .eq('id', user.id)
    }
  }

  return { ok: true, xpDeducted: xpToDeduct, newXp, newLevel }
})
