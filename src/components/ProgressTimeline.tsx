import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { ORGANS, ORGAN_ORDER, OrganKey, SUBMISSIONS, CHRONO_AGE } from '../data/seed'
import { fmtAge, fmtMonth } from '../lib/format'

export function ProgressTimeline() {
  const W = 1200
  const H = 420
  const padL = 60
  const padR = 30
  const padT = 30
  const padB = 50

  const values: number[] = []
  for (const s of SUBMISSIONS) for (const k of ORGAN_ORDER) values.push(s.ages[k])
  const min = Math.floor(Math.min(...values, CHRONO_AGE) - 2)
  const max = Math.ceil(Math.max(...values, CHRONO_AGE) + 2)
  const range = max - min

  const x = (i: number) => padL + (i / (SUBMISSIONS.length - 1)) * (W - padL - padR)
  const y = (v: number) => padT + (1 - (v - min) / range) * (H - padT - padB)

  const [hovered, setHovered] = useState<OrganKey | null>(null)

  const lines = useMemo(
    () =>
      ORGAN_ORDER.map((k) => {
        const def = ORGANS[k]
        const series = SUBMISSIONS.map((s) => s.ages[k])
        const path = series
          .map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`)
          .join(' ')
        return { k, def, series, path }
      }),
    []
  )

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {ORGAN_ORDER.map((k) => {
          const def = ORGANS[k]
          const active = hovered === null || hovered === k
          return (
            <button
              key={k}
              onMouseEnter={() => setHovered(k)}
              onMouseLeave={() => setHovered(null)}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition ${
                active ? 'border-white/15 bg-white/[0.04] text-white/80' : 'border-white/5 bg-white/[0.01] text-white/30'
              }`}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: def.accent, boxShadow: `0 0 6px ${def.accent}` }}
              />
              {def.label}
            </button>
          )
        })}
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-[420px] min-w-[900px] w-full">
          <defs>
            {ORGAN_ORDER.map((k) => {
              const def = ORGANS[k]
              return (
                <linearGradient key={k} id={`stroke-${k}`} x1="0" x2="1">
                  <stop offset="0%" stopColor={def.gradient[0]} />
                  <stop offset="100%" stopColor={def.gradient[1]} />
                </linearGradient>
              )
            })}
            <linearGradient id="bg-younger" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34D39922" />
              <stop offset="100%" stopColor="#34D39900" />
            </linearGradient>
            <linearGradient id="bg-older" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F8717100" />
              <stop offset="100%" stopColor="#F8717122" />
            </linearGradient>
          </defs>

          {/* younger / older bands relative to chrono */}
          <rect x={padL} y={padT} width={W - padL - padR} height={y(CHRONO_AGE) - padT} fill="url(#bg-older)" />
          <rect
            x={padL}
            y={y(CHRONO_AGE)}
            width={W - padL - padR}
            height={H - padB - y(CHRONO_AGE)}
            fill="url(#bg-younger)"
          />

          {/* gridlines */}
          {Array.from({ length: 5 }).map((_, i) => {
            const v = min + (range / 4) * i
            return (
              <g key={i}>
                <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,0.05)" />
                <text x={padL - 10} y={y(v) + 4} textAnchor="end" className="fill-white/30" fontSize={11}>
                  {fmtAge(v, 0)}
                </text>
              </g>
            )
          })}

          {/* chrono line */}
          <line x1={padL} x2={W - padR} y1={y(CHRONO_AGE)} y2={y(CHRONO_AGE)} stroke="rgba(255,255,255,0.4)" strokeDasharray="4 4" />
          <text x={W - padR - 4} y={y(CHRONO_AGE) - 6} textAnchor="end" className="fill-white/60" fontSize={10}>
            chronological · {CHRONO_AGE}.0
          </text>

          {/* x labels */}
          {SUBMISSIONS.map((s, i) => (
            <g key={s.id}>
              <line x1={x(i)} x2={x(i)} y1={padT} y2={H - padB} stroke="rgba(255,255,255,0.04)" />
              <text x={x(i)} y={H - padB + 18} textAnchor="middle" className="fill-white/50" fontSize={11}>
                {fmtMonth(s.date)}
              </text>
              <text x={x(i)} y={H - padB + 32} textAnchor="middle" className="fill-white/30" fontSize={9}>
                {s.label}
              </text>
            </g>
          ))}

          {/* lines */}
          {lines.map(({ k, def, path, series }) => {
            const dim = hovered !== null && hovered !== k
            return (
              <g key={k} opacity={dim ? 0.18 : 1}>
                <motion.path
                  d={path}
                  fill="none"
                  stroke={`url(#stroke-${k})`}
                  strokeWidth={hovered === k ? 3 : 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: 'easeInOut' }}
                />
                {series.map((v, i) => (
                  <circle
                    key={i}
                    cx={x(i)}
                    cy={y(v)}
                    r={i === series.length - 1 ? 4 : 2.5}
                    fill={def.accent}
                    stroke="#06070C"
                    strokeWidth={1.5}
                  />
                ))}
                {hovered === k && (
                  <text
                    x={x(series.length - 1) + 8}
                    y={y(series[series.length - 1]) + 4}
                    className="fill-white"
                    fontSize={11}
                  >
                    {def.label} · {fmtAge(series[series.length - 1])}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-white/40">
        <Legend color="#34D399" label="Younger than chronological" />
        <Legend color="#F87171" label="Older than chronological" />
        <Legend color="rgba(255,255,255,0.6)" label="Chronological reference" dashed />
      </div>
    </div>
  )
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block h-[2px] w-6"
        style={{
          background: dashed ? `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 8px)` : color,
        }}
      />
      {label}
    </div>
  )
}
