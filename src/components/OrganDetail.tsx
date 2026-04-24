import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { ORGANS, OrganKey, SUBMISSIONS, BIOMARKERS, CHRONO_AGE } from '../data/seed'
import { fmtAge, fmtDate } from '../lib/format'

export function OrganDetail({ organKey, onClose }: { organKey: OrganKey; onClose: () => void }) {
  const def = ORGANS[organKey]
  const series = SUBMISSIONS.map((s) => ({ date: s.date, label: s.label, age: s.ages[organKey] }))
  const markers = BIOMARKERS.filter((b) => b.organ === organKey)
  const latest = series[series.length - 1].age
  const baseline = series[0].age

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-end bg-black/60 backdrop-blur-sm md:items-stretch"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          className="relative h-[85vh] w-full overflow-y-auto border-t border-white/10 bg-[#0A0B12] p-8 md:h-full md:w-[520px] md:border-l md:border-t-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/[0.04] p-2 text-white/60 hover:bg-white/[0.08]"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">{def.label} system</div>
          <div className="mt-1 flex items-baseline gap-3">
            <div
              className="font-display text-7xl"
              style={{
                background: `linear-gradient(135deg, ${def.gradient[0]}, ${def.gradient[1]})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {fmtAge(latest)}
            </div>
            <div className="text-sm text-white/50">years</div>
          </div>

          <div className="mt-2 text-sm text-white/60">{def.description}</div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <Mini label="vs chrono" value={`${(latest - CHRONO_AGE >= 0 ? '+' : '−')}${Math.abs(latest - CHRONO_AGE).toFixed(1)}`} />
            <Mini label="vs baseline" value={`${(latest - baseline >= 0 ? '+' : '−')}${Math.abs(latest - baseline).toFixed(1)}`} />
            <Mini label="markers" value={markers.length.toString()} />
          </div>

          <div className="mt-6">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Trajectory</div>
            <BigSpark series={series} color={def.accent} chrono={CHRONO_AGE} />
          </div>

          <div className="mt-6">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Driver biomarkers</div>
            <div className="space-y-1.5">
              {markers.map((m) => (
                <div key={m.name} className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2 text-sm">
                  <span className="text-white/80">{m.name}</span>
                  <span className="font-mono text-white/60">
                    {m.baseline} <span className="text-white/30">→</span>{' '}
                    <span className="text-white">{m.current}</span> {m.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
      <div className="text-[9px] uppercase tracking-[0.18em] text-white/40">{label}</div>
      <div className="mt-1 font-display text-2xl text-white">{value}</div>
    </div>
  )
}

function BigSpark({ series, color, chrono }: { series: { date: string; label: string; age: number }[]; color: string; chrono: number }) {
  const W = 460
  const H = 160
  const pad = 20
  const min = Math.min(...series.map((s) => s.age), chrono) - 1
  const max = Math.max(...series.map((s) => s.age), chrono) + 1
  const range = max - min
  const xs = series.map((_, i) => pad + (i / (series.length - 1)) * (W - 2 * pad))
  const ys = series.map((s) => H - pad - ((s.age - min) / range) * (H - 2 * pad))
  const path = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(' ')
  const fill = `${path} L${xs[xs.length - 1]} ${H - pad} L${xs[0]} ${H - pad} Z`
  const chronoY = H - pad - ((chrono - min) / range) * (H - 2 * pad)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <defs>
        <linearGradient id={`big-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.5} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <line x1={pad} x2={W - pad} y1={chronoY} y2={chronoY} stroke="rgba(255,255,255,0.3)" strokeDasharray="3 3" />
      <text x={W - pad - 4} y={chronoY - 4} textAnchor="end" className="fill-white/50" fontSize={9}>chrono {chrono}</text>
      <path d={fill} fill={`url(#big-${color.replace('#', '')})`} />
      <path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      {xs.map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={ys[i]} r={i === xs.length - 1 ? 4 : 2.5} fill={color} stroke="#0A0B12" strokeWidth={1.5} />
          <text x={x} y={H - 4} textAnchor="middle" className="fill-white/40" fontSize={9}>{shortDate(series[i].date)}</text>
        </g>
      ))}
    </svg>
  )
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}
