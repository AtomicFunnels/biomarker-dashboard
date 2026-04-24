import { motion } from 'framer-motion'
import { useState } from 'react'
import { BIOMARKERS, ORGANS, ORGAN_ORDER, OrganKey } from '../data/seed'
import { fmtDelta } from '../lib/format'

export function BiomarkerPanel() {
  const [filter, setFilter] = useState<OrganKey | 'all'>('all')
  const items = filter === 'all' ? BIOMARKERS : BIOMARKERS.filter((b) => b.organ === filter)

  return (
    <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Pill active={filter === 'all'} onClick={() => setFilter('all')} label="All" />
        {ORGAN_ORDER.map((k) => {
          const def = ORGANS[k]
          return (
            <Pill
              key={k}
              active={filter === k}
              onClick={() => setFilter(k)}
              label={def.label}
              color={def.accent}
            />
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {items.map((b, i) => (
          <BiomarkerRow key={b.name} b={b} i={i} />
        ))}
      </div>
    </div>
  )
}

function Pill({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean
  onClick: () => void
  label: string
  color?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
        active
          ? 'border-white/20 bg-white/[0.08] text-white'
          : 'border-white/5 bg-white/[0.02] text-white/50 hover:text-white/80'
      }`}
    >
      {color && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: color, boxShadow: `0 0 6px ${color}` }}
        />
      )}
      {label}
    </button>
  )
}

function BiomarkerRow({ b, i }: { b: ReturnType<typeof biomarker>; i: number }) {
  const def = ORGANS[b.organ]
  const [refLo, refHi] = b.reference
  const [optLo, optHi] = b.optimal
  const total = refHi - refLo

  // positions on bar (0-100)
  const pos = (v: number) => Math.max(0, Math.min(100, ((v - refLo) / total) * 100))

  const inOptimal = b.current >= optLo && b.current <= optHi
  const directionGood = ['HDL-C', 'eGFR', 'Free Testosterone', 'DHEA-S', 'IGF-1', 'Omega-3 Index', 'Telomere Length', 'NAD+'].includes(b.name)
  const delta = b.current - b.baseline
  const improved = directionGood ? delta > 0 : delta < 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4, delay: i * 0.02 }}
      className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-white/10"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: def.accent, boxShadow: `0 0 6px ${def.accent}` }}
          />
          <div className="text-sm font-medium text-white">{b.name}</div>
          <div className="text-[10px] uppercase tracking-wider text-white/30">{def.short}</div>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="font-mono text-sm text-white">
            {b.current}
            <span className="ml-1 text-[10px] text-white/40">{b.unit}</span>
          </div>
          <div className={`font-mono text-[11px] ${improved ? 'text-emerald-300' : 'text-rose-300'}`}>
            {fmtDelta(delta, b.current < 1 ? 2 : 1)}
          </div>
        </div>
      </div>

      <div className="relative mt-3 h-2 w-full rounded-full bg-white/5">
        {/* reference range bg already (the full bar) */}
        {/* optimal range */}
        <div
          className="absolute top-0 h-full rounded-full"
          style={{
            left: `${pos(optLo)}%`,
            width: `${pos(optHi) - pos(optLo)}%`,
            background: `linear-gradient(90deg, ${def.gradient[0]}55, ${def.gradient[1]}55)`,
            border: `1px solid ${def.accent}55`,
          }}
        />
        {/* baseline marker */}
        <div
          className="absolute -top-1 h-4 w-[2px] rounded bg-white/40"
          style={{ left: `calc(${pos(b.baseline)}% - 1px)` }}
          title={`Baseline ${b.baseline}`}
        />
        {/* current marker */}
        <motion.div
          initial={{ left: `${pos(b.baseline)}%` }}
          whileInView={{ left: `${pos(b.current)}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-[#06070C]"
          style={{
            background: def.accent,
            boxShadow: `0 0 12px ${def.accent}aa`,
          }}
        />
      </div>

      <div className="mt-2 flex justify-between text-[10px] font-mono text-white/30">
        <span>{refLo}</span>
        <span className={inOptimal ? 'text-emerald-300' : 'text-white/40'}>
          optimal {optLo}–{optHi} {b.unit}
        </span>
        <span>{refHi}</span>
      </div>
    </motion.div>
  )
}

// type helper
function biomarker(b: typeof BIOMARKERS[number]) {
  return b
}
