export default function getAvatarSrc(src) {
  if (!src) return '/images/avatars/1.png'

  if (src.startsWith('data:')) {
    return src
  }

  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }

  return `${process.env.NEXT_PUBLIC_ASSET_URL}${src}`
}
