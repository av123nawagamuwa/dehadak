/**
 * Returns the appropriate avatar image path according to gender.
 * Uses official avatars from /avatars/male.png and /avatars/female.png
 */
export function getGenderAvatar(gender?: string | null): string {
  const g = String(gender || '').trim().toLowerCase()
  if (g === 'female' || g === 'bride' || g === 'woman' || g === 'girl') {
    return '/avatars/female.png'
  }
  return '/avatars/male.png'
}
