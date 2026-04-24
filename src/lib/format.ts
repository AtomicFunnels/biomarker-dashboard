export function fmtAge(n: number, decimals = 1) {
  return n.toFixed(decimals)
}

export function fmtDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function fmtMonth(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

export function fmtDelta(n: number, decimals = 1, signed = true) {
  const sign = n > 0 ? '+' : n < 0 ? '−' : ''
  const abs = Math.abs(n).toFixed(decimals)
  return signed ? `${sign}${abs}` : abs
}

export function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n))
}
