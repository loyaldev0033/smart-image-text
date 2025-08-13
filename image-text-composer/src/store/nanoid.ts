const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-'

export function nanoid(size = 12): string {
  let id = ''
  const hasCrypto = typeof globalThis !== 'undefined' && !!(globalThis as any).crypto && typeof (globalThis as any).crypto.getRandomValues === 'function'
  if (hasCrypto) {
    const bytes = new Uint8Array(size)
    ;(globalThis as any).crypto.getRandomValues(bytes)
    for (let i = 0; i < size; i++) id += alphabet[bytes[i] % alphabet.length]
  } else {
    for (let i = 0; i < size; i++) id += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return id
}