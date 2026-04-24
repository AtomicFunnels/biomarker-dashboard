import { motion } from 'framer-motion'

interface Props {
  chrono: number
  bio: number
}

// A stylized "biological age" gradient sphere with concentric orbital rings
// representing organ systems and the chronological reference ring.
export function GradientOrb({ chrono, bio }: Props) {
  const ratio = bio / chrono // <1 = younger
  // visual ring offset: younger biological → ring sits inside chrono ring
  const bioRingPct = Math.min(1, Math.max(0.55, ratio)) * 100

  return (
    <div className="relative flex h-[420px] w-[420px] items-center justify-center">
      {/* outermost glow */}
      <motion.div
        animate={{ scale: [1, 1.04, 1], opacity: [0.55, 0.7, 0.55] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/40 via-cyan-500/40 to-pink-500/40 blur-3xl"
      />

      {/* outer chrono ring */}
      <div className="absolute inset-4 rounded-full border border-white/10">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-[#06070C] px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-white/50">
          chrono · {chrono}
        </div>
      </div>

      {/* spinning orbital ticks */}
      <motion.svg
        viewBox="0 0 420 420"
        className="absolute inset-0 h-full w-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      >
        {Array.from({ length: 60 }).map((_, i) => (
          <line
            key={i}
            x1={210}
            y1={20}
            x2={210}
            y2={i % 5 === 0 ? 28 : 24}
            stroke={i % 5 === 0 ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)'}
            strokeWidth={1}
            transform={`rotate(${i * 6} 210 210)`}
          />
        ))}
      </motion.svg>

      {/* bio ring (smaller because younger) */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: bioRingPct / 100 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-4 rounded-full"
      >
        <div className="absolute inset-0 rounded-full border-2 border-transparent [background:linear-gradient(135deg,#A78BFA,#22D3EE,#F472B6)_border-box] [mask:linear-gradient(#000_0_0)_padding-box,linear-gradient(#000_0_0)] [mask-composite:exclude]" />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-[#06070C] px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-violet-200">
          biological · {bio.toFixed(1)}
        </div>
      </motion.div>

      {/* core orb */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="relative h-[260px] w-[260px] rounded-full"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 50%, #A78BFA, #22D3EE, #34D399, #FACC15, #F472B6, #A78BFA)',
        }}
      >
        <div className="absolute inset-0 rounded-full mix-blend-overlay opacity-70 blur-2xl"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.65), transparent 55%)',
          }}
        />
      </motion.div>

      {/* inner gloss */}
      <div className="absolute h-[260px] w-[260px] rounded-full border border-white/10 [box-shadow:inset_0_2px_30px_rgba(255,255,255,0.18),inset_0_-30px_60px_rgba(0,0,0,0.4)]" />

      {/* center disc + label */}
      <div className="absolute flex h-[150px] w-[150px] items-center justify-center rounded-full bg-[#06070C]/90 backdrop-blur-md border border-white/10 [box-shadow:inset_0_0_30px_rgba(255,255,255,0.06),0_0_40px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col items-center">
          <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/60">
            younger by
          </div>
          <div className="mt-0.5 font-display text-5xl leading-none text-gradient-aurora">
            {(chrono - bio).toFixed(1)}
          </div>
          <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-white/50">years</div>
        </div>
      </div>

      {/* floating organ dots around */}
      {organsDots.map((d, i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={{ duration: 40 + i * 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        >
          <div
            className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 rounded-full"
            style={{
              background: d.color,
              boxShadow: `0 0 12px ${d.color}`,
              transform: `translate(-50%, -50%) translate(${d.x}px, ${d.y}px)`,
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

const organsDots = [
  { x: 175, y: 0, color: '#F472B6' },
  { x: 145, y: 100, color: '#FACC15' },
  { x: 60, y: 165, color: '#A3E635' },
  { x: -60, y: 165, color: '#22D3EE' },
  { x: -145, y: 100, color: '#A78BFA' },
  { x: -175, y: 0, color: '#F87171' },
  { x: -145, y: -100, color: '#E879F9' },
  { x: -60, y: -165, color: '#7DD3FC' },
  { x: 60, y: -165, color: '#34D399' },
  { x: 145, y: -100, color: '#FDBA74' },
]
