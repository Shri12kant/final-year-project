import { safeGetItem, safeSetItem } from '../../lib/safeStorage'

const KEY = 'ch_post_meta_v1'

export type PostMeta = {
  communitySlug: string
}

function read(): Record<number, PostMeta> {
  try {
    const raw = safeGetItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, PostMeta>
    const out: Record<number, PostMeta> = {}
    for (const [k, v] of Object.entries(parsed)) {
      const id = Number(k)
      if (Number.isFinite(id) && v?.communitySlug) out[id] = v
    }
    return out
  } catch {
    return {}
  }
}

function write(data: Record<number, PostMeta>) {
  const serial: Record<string, PostMeta> = {}
  for (const [k, v] of Object.entries(data)) {
    serial[String(k)] = v
  }
  safeSetItem(KEY, JSON.stringify(serial))
}

export function getPostMeta(postId: number): PostMeta | undefined {
  return read()[postId]
}

export function setPostMeta(postId: number, meta: PostMeta) {
  const data = read()
  data[postId] = meta
  write(data)
}

export function getAllPostMeta(): Record<number, PostMeta> {
  return read()
}
