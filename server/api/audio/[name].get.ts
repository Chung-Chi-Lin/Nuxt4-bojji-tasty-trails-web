import { readFile } from 'node:fs/promises'
import { join }     from 'node:path'

const ALLOWED = ['nga-ay-ho'] as const
type AudioName = (typeof ALLOWED)[number]

export default defineEventHandler(async (event) => {
  const name = (getRouterParam(event, 'name') ?? '') as string

  if (!ALLOWED.includes(name as AudioName)) {
    throw createError({ statusCode: 404, statusMessage: '找不到音檔' })
  }

  let file: Buffer | Uint8Array | null = null

  // 1. serverAssets（打包後 / Vercel 生產環境）
  try {
    const storage = useStorage('assets:audio')
    file = (await storage.getItemRaw(`${name}.wav`)) as Buffer | null
  } catch { /* 本地 dev 可能尚未 bundle */ }

  // 2. 直接讀檔（本地 dev 開發，不需重啟 server）
  if (!file) {
    try {
      file = await readFile(join(process.cwd(), 'server', 'audio', `${name}.wav`))
    } catch { /* 檔案不存在 */ }
  }

  if (!file) {
    throw createError({ statusCode: 404, statusMessage: '音檔尚未上傳' })
  }

  setHeader(event, 'Content-Type', 'audio/wav')
  setHeader(event, 'Cache-Control', 'private, max-age=3600')
  setHeader(event, 'Content-Disposition', 'inline')
  return file
})
