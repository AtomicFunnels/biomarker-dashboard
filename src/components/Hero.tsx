import { motion } from 'framer-motion'
import { TrendingDown, Calendar, Award, ArrowDownRight } from 'lucide-react'
import { CHRONO_AGE, SUBMISSIONS, BASELINE, LATEST } from '../data/seed'
import { fmtAge, fmtDelta, fmtDate } from '../lib/format'
import { GradientOrb } from './GradientOrb'

export function Hero() {
  const deltaFromBaseline = LATEST.composite - BASELINE.composite
  const deltaFromChrono = LATEST.composite - CHRONO_AGE
  const monthsTracked = monthsBetween(BASELINE.date, LATEST.date)

  return (
    <section className="relative mt-2 overflow-hidden rounded-3xl border border-white/5 glass-strong">
      {/* aurora bg */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/10 blur-3xl" />
      </div>

      <div className="relative grid grid-cols-1 gap-10 p-8 md:p-12 lg:grid-cols-[1.1fr_1fr]">
        {/* LEFT: stats */}
        <div className="flex flex-col justify-between gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/40"
            >
              <Award className="h-3.5 w-3.5" />
              Composite biological age
            </motion.div>

            <div className="mt-4 flex items-end gap-6">
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="font-display text-[120px] leading-none text-gradient-aurora md:text-[160px]">
                  {fmtAge(LATEST.composite)}
                </div>
                <div className="-mt-2 text-sm text-white/50">years biologically</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="mb-3 hidden flex-col items-start gap-1 md:flex"
              >
                <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300 flex items-center gap-1">
                  <ArrowDownRight className="h-3 w-3" />
                  {fmtDelta(deltaFromChrono, 1)} yrs vs chronological
                </div>
                <div className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs text-violet-200 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  {fmtDelta(deltaFromBaseline, 1)} yrs since baseline
                </div>
              </motion.div>
            </div>

            <div className="mt-4 flex items-center gap-3 text-sm text-white/60">
              <div>
                Chronological age <span className="font-mono text-white/90">{CHRONO_AGE}.0</span>
              </div>
              <span className="text-white/20">·</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {monthsTracked} months tracked
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Stat label="Submissions" value={SUBMISSIONS.length.toString()} />
            <Stat label="Markers · latest" value={LATEST.panelCount.toString()} />
            <Stat label="Avg drop / quarter" value={`${fmtAge(Math.abs(deltaFromBaseline) / 5, 1)} yrs`} accent />
          </div>

          <div>
            <Trajectory />
          </div>
        </div>

        {/* RIGHT: orb */}
        <div className="relative flex items-center justify-center">
          <GradientOrb chrono={CHRONO_AGE} bio={LATEST.composite} />
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">{label}</div>
      <div
        className={`mt-1 font-display text-3xl ${
          accent ? 'text-gradient-cool' : 'text-white'
        }`}
      >
        {value}
      </div>
    </div>
  )
}

function Trajectory() {
  // mini bar of submissions
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
      <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-white/40">
        <span>Composite age trajectory</span>
        <span>Latest {fmtDate(LATEST.date)}</span>
      </div>
      <div className="flex items-end justify-between gap-2">
        {SUBMISSIONS.map((s, i) => {
          const max = Math.max(...SUBMISSIONS.map((x) => x.composite))
          const min = Math.min(...SUBMISSIONS.map((x) => x.composite)) - 2
          const h = ((s.composite - min) / (max - min)) * 100
          const isLast = i === SUBMISSIONS.length - 1
          return (
            <div key={s.id} className="flex flex-1 flex-col items-center gap-2">
              <div className="text-[10px] font-mono text-white/50">{fmtAge(s.composite)}</div>
              <div className="relative h-24 w-full overflow-hidden rounded-md bg-white/5">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.9, delay: 0.1 * i, ease: 'easeOut' }}
                  className={`absolute bottom-0 left-0 right-0 ${
                    isLast
                      ? 'bg-gradient-to-t from-cyan-500 via-violet-400 to-pink-400'
                      : 'bg-gradient-to-t from-white/30 to-white/10'
                  }`}
                />
              </div>
              <div className="text-[10px] text-white/40">{shortDate(s.date)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

function monthsBetween(a: string, b: string) {
  const da = new Date(a)
  const db = new Date(b)
  return (db.getFullYear() - da.getFullYear()) * 12 + (db.getMonth() - da.getMonth())
}
