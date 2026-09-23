import { API_BASE_URL } from '@/config'

/**
 * Normalizes photo URLs, distinguishing between backend-uploaded media (/uploads/...)
 * and frontend static public assets (/avatars/..., /profile-..., /images/...).
 */
export function cleanPhotoUrl(url: any): string {
  if (!url) return ''
  let raw = ''
  if (typeof url === 'string') {
    if (url.startsWith('{')) {
      try {
        const parsed = JSON.parse(url)
        raw = parsed.url || url
      } catch {
        raw = url
      }
    } else {
      raw = url
    }
  } else if (typeof url === 'object' && url.url) {
    raw = url.url
  } else {
    raw = String(url)
  }

  raw = raw.trim()
  if (!raw) return ''

  // Absolute URLs or data URIs
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:')) {
    return raw
  }

  // Backend uploads served from Express /uploads
  if (raw.startsWith('/uploads/')) {
    return `${API_BASE_URL}${raw}`
  }
  if (raw.startsWith('uploads/')) {
    return `${API_BASE_URL}/${raw}`
  }

  // Frontend public assets served by Vite (/avatars/, /profile-..., /images/, etc.)
  if (
    raw.startsWith('/avatars/') ||
    raw.startsWith('/profile-') ||
    raw.startsWith('/images/') ||
    raw.startsWith('/icons/') ||
    raw.startsWith('/favicon') ||
    raw.startsWith('/logo')
  ) {
    return raw
  }

  if (raw.startsWith('/')) {
    return raw
  }

  return `${API_BASE_URL}/${raw}`
}
