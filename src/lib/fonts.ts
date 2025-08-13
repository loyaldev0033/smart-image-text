export async function fetchGoogleFonts(): Promise<string[] | null> {
  const key = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY ||
              (typeof window !== 'undefined' ? localStorage.getItem('GOOGLE_FONTS_API_KEY') || undefined : undefined)
  if (!key) return null
  try {
    const res = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${key}&sort=popularity`, { cache: 'force-cache' })
    if (!res.ok) return null
    const data = await res.json()
    const families: string[] = data.items?.map((i: any) => i.family) ?? []
    return families
  } catch (e) {
    return null
  }
}