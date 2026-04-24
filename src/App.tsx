import { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Sparkles, Upload, ChevronRight } from 'lucide-react'
import { Hero } from './components/Hero'
import { OrganGrid } from './components/OrganGrid'
import { ProgressTimeline } from './components/ProgressTimeline'
import { BiomarkerPanel } from './components/BiomarkerPanel'
import { UploadZone } from './components/UploadZone'
import { OrganDetail } from './components/OrganDetail'
import { SUBMISSIONS, ORGANS, ORGAN_ORDER, OrganKey } from './data/seed'

export default function App() {
  const [selectedOrgan, setSelectedOrgan] = useState<OrganKey | null>(null)

  return (
    <div className="min-h-screen w-full noise">
      <TopBar />
      <main className="mx-auto max-w-[1400px] px-4 pb-24 pt-6 md:px-10 md:pb-32 md:pt-8">
        <Hero />

        <SectionLabel
          icon={<Activity className="h-3.5 w-3.5" />}
          eyebrow="Organ-system biological age"
          title="Every system, scored independently"
          subtitle={`${ORGAN_ORDER.length} systems · ${SUBMISSIONS[SUBMISSIONS.length - 1].panelCount} markers · ${SUBMISSIONS.length} submissions`}
        />
        <OrganGrid onSelect={(k) => setSelectedOrgan(k)} />

        <SectionLabel
          icon={<Sparkles className="h-3.5 w-3.5" />}
          eyebrow="Trajectory"
          title="14 months of data, side by side"
          subtitle="Each ribbon is one organ system. Lower is younger."
        />
        <ProgressTimeline />

        <SectionLabel
          icon={<Activity className="h-3.5 w-3.5" />}
          eyebrow="Biomarker breakdown"
          title="The signals behind the score"
          subtitle="Latest panel vs baseline · optimal range shaded"
        />
        <BiomarkerPanel />

        <SectionLabel
          icon={<Upload className="h-3.5 w-3.5" />}
          eyebrow="Add new data"
          title="Upload your next panel"
          subtitle="PDF, CSV, or HL7 from any major lab"
        />
        <UploadZone />
      </main>

      {selectedOrgan && (
        <OrganDetail organKey={selectedOrgan} onClose={() => setSelectedOrgan(null)} />
      )}

      <Footer />
    </div>
  )
}

function TopBar() {
  return (
    <div className="sticky top-0 z-40 border-b border-white/5 bg-[#06070C]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
        <div className="flex items-center gap-3">
          <Logo />
          <div className="hidden items-center gap-1 text-xs text-white/50 md:flex">
            <span>Helix</span>
            <ChevronRight className="h-3 w-3" />
            <span>Marcus Chen</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/80">Biological Age</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            5 panels synced · last 14 days
          </div>
          <button className="group relative overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-violet-500/20 via-cyan-500/20 to-pink-500/20 px-4 py-2 text-xs font-medium text-white transition hover:border-white/20">
            <span className="relative z-10 flex items-center gap-1.5">
              <Upload className="h-3.5 w-3.5" /> Upload panel
            </span>
            <span className="absolute inset-0 -z-0 opacity-0 transition group-hover:opacity-100 shimmer" />
          </button>
        </div>
      </div>
    </div>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-8 w-8">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400 via-cyan-400 to-pink-400 blur-md opacity-60" />
        <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-violet-400 via-cyan-400 to-pink-400" />
        <div className="absolute inset-[3px] rounded-full bg-[#06070C]" />
        <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-violet-400 via-cyan-400 to-pink-400 opacity-90" />
      </div>
      <div className="leading-tight">
        <div className="font-display text-lg italic text-white">Helix</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Biological Age</div>
      </div>
    </div>
  )
}

function SectionLabel({
  eyebrow,
  title,
  subtitle,
  icon,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  icon?: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="mb-4 mt-10 flex flex-col gap-1.5 md:mb-5 md:mt-16"
    >
      <div className="flex items-center gap-2 text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-white/40">
        {icon}
        {eyebrow}
      </div>
      <h2 className="font-display text-2xl text-white md:text-4xl">{title}</h2>
      {subtitle && <p className="text-xs text-white/50 md:text-sm">{subtitle}</p>}
    </motion.div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-8 text-center text-xs text-white/30 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        Helix is a demonstration interface. Not for clinical use. ·
        <span className="ml-1 font-mono text-white/40">v0.1.0</span>
      </div>
    </footer>
  )
}
