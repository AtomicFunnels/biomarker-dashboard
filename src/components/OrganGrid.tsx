import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { ORGANS, ORGAN_ORDER, OrganKey, SUBMISSIONS, BASELINE, LATEST, CHRONO_AGE } from '../data/seed'
import { fmtAge, fmtDelta } from '../lib/format'

export function OrganGrid({ onSelect }: { onSelect: (k: OrganKey) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {ORGAN_ORDER.map((key, i) => (
        <OrganCard key={key} k={key} index={i} onClick={() => onSelect(key)} />
      ))}
    </div>
  )
}

function OrganCard({ k, index, onClick }: { k: OrganKey; index: number; onClick: () => void }) {
  const def = ORGANS[k]
  const series = SUBMISSIONS.map((s) => s.ages[k])
  const baseline = BASELINE.ages[k]
  const latest = LATEST.ages[k]
  const delta = latest - baseline
  const vsChrono = latest - CHRONO_AGE
  const trend = delta < -0.1 ? 'down' : delta > 0.1 ? 'up' : 'flat'

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 text-left transition hover:border-white/15 hover:bg-white/[0.04]"
    >
      {/* hover gradient bg */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-30"
        style={{
          background: `radial-gradient(220px 160px at 80% -10%, ${def.accent}55, transparent 70%)`,
        }}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">{def.label}</div>
          <div className="mt-3 flex items-baseline gap-1">
            <div
              className="font-display text-5xl"
              style={{
                background: `linear-gradient(135deg, ${def.gradient[0]}, ${def.gradient[1]})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {fmtAge(latest)}
            </div>
            <div className="text-xs text-white/40">yrs</div>
          </div>
        </div>
        <div
          className="h-2 w-2 rounded-full"
          style={{ background: def.accent, boxShadow: `0 0 10px ${def.accent}` }}
        />
      </div>

      {/* sparkline */}
      <div className="relative mt-4 h-14 w-full">
        <Sparkline values={series} color={def.accent} chrono={CHRONO_AGE} />
      </div>

      <div className="relative mt-4 flex items-center justify-between text-xs">
        <span className="text-white/40">vs chrono</span>
        <span
          className={`font-mono ${
            vsChrono < 0 ? 'text-emerald-300' : vsChrono > 0 ? 'text-rose-300' : 'text-white/60'
          }`}
        >
          {fmtDelta(vsChrono, 1)} yrs
        </span>
      </div>
      <div className="relative mt-1 flex items-center justify-between text-xs">
        <span className="text-white/40">since baseline</span>
        <span
          className={`flex items-center gap-1 font-mono ${
            trend === 'down' ? 'text-emerald-300' : trend === 'up' ? 'text-rose-300' : 'text-white/60'
          }`}
        >
          {trend === 'down' ? <ArrowDownRight className="h-3 w-3" /> : trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
          {fmtDelta(delta, 1)}
        </span>
      </div>
    </motion.button>
  )
}

function Sparkline({ values, color, chrono }: { values: number[]; color: string; chrono: number }) {
  const W = 200
  const H = 56
  const pad = 4
  const min = Math.min(...values, chrono) - 1
  const max = Math.max(...values, chrono) + 1
  const range = max - min
  const xs = values.map((_, i) => pad + (i / (values.length - 1)) * (W - 2 * pad))
  const ys = values.map((v) => H - pad - ((v - min) / range) * (H - 2 * pad))
  const path = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(' ')
  const fill = `${path} L${xs[xs.length - 1]} ${H} L${xs[0]} ${H} Z`
  const chronoY = H - pad - ((chrono - min) / range) * (H - 2 * pad)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id={`g-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.45} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* chrono baseline */}
      <line x1={0} x2={W} y1={chronoY} y2={chronoY} stroke="rgba(255,255,255,0.18)" strokeDasharray="2 3" strokeWidth={1} />
      <path d={fill} fill={`url(#g-${color.replace('#', '')})`} />
      <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {/* dots */}
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r={i === xs.length - 1 ? 3 : 1.6} fill={color} />
      ))}
    </svg>
  )
}
