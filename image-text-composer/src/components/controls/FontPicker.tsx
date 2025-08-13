"use client"

import { useEffect, useMemo, useState } from 'react'
import { fetchGoogleFonts } from '@/lib/fonts'

const FALLBACK_FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat', 'Oswald', 'Merriweather', 'Source Sans 3', 'Playfair Display'
]

export function FontPicker({ value, weight, onChange }: {
  value: string
  weight: number
  onChange: (family: string, weight: number) => void
}) {
  const [fonts, setFonts] = useState<string[]>(FALLBACK_FONTS)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let mounted = true
    fetchGoogleFonts().then(list => {
      if (list && list.length && mounted) setFonts(list)
    })
    return () => { mounted = false }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return fonts
    return fonts.filter(f => f.toLowerCase().includes(q))
  }, [fonts, query])

  useEffect(() => {
    if (!value) return
    ;(async () => {
      const WebFont = (await import('webfontloader')).default
      WebFont.load({ google: { families: [`${value}:${weight}`] } })
    })()
  }, [value, weight])

  return (
    <div className="space-y-1">
      <input
        className="w-full border rounded px-2 py-1"
        placeholder="Search fonts..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <select
        className="w-full border rounded px-2 py-1"
        value={value}
        onChange={e => onChange(e.target.value, weight)}
        style={{ fontFamily: value }}
      >
        {filtered.map(f => (
          <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
        ))}
      </select>
    </div>
  )
}