import { motion } from 'framer-motion'
import { Upload, FileText, CheckCircle2, Sparkles } from 'lucide-react'
import { SUBMISSIONS } from '../data/seed'
import { fmtDate } from '../lib/format'

export function UploadZone() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
      {/* drop zone */}
      <motion.div
        whileHover={{ scale: 1.005 }}
        className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-6 md:p-10"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-gradient-to-br from-violet-500/15 via-cyan-500/15 to-pink-500/15 blur-3xl" />
        </div>
        <div className="relative flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 via-cyan-400 to-pink-400 blur-xl opacity-50" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-cyan-500 to-pink-500">
              <Upload className="h-7 w-7 text-white" />
            </div>
          </div>
          <h3 className="mt-5 font-display text-2xl text-white">Drop your next panel here</h3>
          <p className="mt-1 max-w-md text-sm text-white/50">
            We auto-parse Quest, LabCorp, Function Health, BioReference, TruDiagnostic and 30+ more. PDF, CSV or HL7.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[11px]">
            {['Quest', 'LabCorp', 'Function Health', 'TruDiagnostic', 'InsideTracker', 'BioReference'].map((s) => (
              <span key={s} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-white/60">
                {s}
              </span>
            ))}
          </div>
          <button className="mt-7 group relative overflow-hidden rounded-full px-6 py-2.5 text-sm font-medium text-white">
            <span className="absolute inset-0 bg-gradient-to-r from-violet-500 via-cyan-500 to-pink-500" />
            <span className="absolute inset-[1px] rounded-full bg-[#0A0B12]" />
            <span className="relative flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Choose file
            </span>
          </button>
        </div>
      </motion.div>

      {/* submission history */}
      <div className="rounded-2xl md:rounded-3xl border border-white/5 bg-white/[0.02] p-5 md:p-6">
        <div className="mb-4 text-[10px] uppercase tracking-[0.2em] text-white/40">Submission history</div>
        <ol className="relative space-y-4 border-l border-white/10 pl-5">
          {[...SUBMISSIONS].reverse().map((s, i) => (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="relative"
            >
              <div className="absolute -left-[26px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0A0B12]">
                <div
                  className={`h-2 w-2 rounded-full ${
                    i === 0 ? 'bg-gradient-to-br from-violet-400 to-cyan-400 shadow-[0_0_10px_rgba(167,139,250,0.7)]' : 'bg-white/30'
                  }`}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-sm text-white">{s.label}</div>
                  <div className="text-[11px] text-white/40">{fmtDate(s.date)} · {s.panelCount} markers</div>
                </div>
                <div className="font-mono text-sm text-white/80">{s.composite.toFixed(1)}<span className="text-[10px] text-white/40"> yrs</span></div>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-white/40">
                <FileText className="h-3 w-3" />
                {s.source}
                {i === 0 && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-1.5 py-[1px] text-[10px] text-emerald-300">
                    <CheckCircle2 className="h-2.5 w-2.5" /> Latest
                  </span>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  )
}
