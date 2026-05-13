export interface XpBreakdown {
  label: string
  xp: number
}

// XP earned when creating a spot
export function calcSpotXp(data: {
  is_public: boolean
  name: string
  tags: string[]
  notes: string
}): { total: number; breakdown: XpBreakdown[] } {
  const breakdown: XpBreakdown[] = []
  let total = 0

  breakdown.push({ label: '新增標記', xp: 10 })
  total += 10

  if (data.is_public) {
    breakdown.push({ label: '公開分享加成', xp: 15 })
    total += 15
  } else {
    breakdown.push({ label: '私人標記', xp: 3 })
    total += 3
  }

  if (data.name.trim().length > 5) {
    breakdown.push({ label: '詳細名稱', xp: 5 })
    total += 5
  }

  if (data.tags.length > 0) {
    const tagXp = data.tags.length * 5
    breakdown.push({ label: `設立標籤 ×${data.tags.length}`, xp: tagXp })
    total += tagXp
  }

  if (data.notes.trim().length >= 10) {
    breakdown.push({ label: '撰寫備註', xp: 10 })
    total += 10
    if (data.notes.trim().length >= 50) {
      breakdown.push({ label: '詳細備註加成', xp: 5 })
      total += 5
    }
  }

  return { total, breakdown }
}

// XP required to go from level L to L+1: 100 + (L-1) * 50
// L1→L2: 100, L2→L3: 150, L3→L4: 200 ...
export function levelFromXp(xp: number): number {
  let level = 1
  let threshold = 100
  let accumulated = 0
  while (xp >= accumulated + threshold && level < 100) {
    accumulated += threshold
    threshold += 50
    level++
  }
  return level
}

export function xpForLevel(level: number): number {
  if (level <= 1) return 0
  let total = 0
  let increment = 100
  for (let l = 1; l < level; l++) {
    total += increment
    increment += 50
  }
  return total
}
