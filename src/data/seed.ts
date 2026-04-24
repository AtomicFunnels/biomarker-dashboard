// Seed data for the Helix Biological Age Dashboard
// 5 submissions across ~14 months showing measurable improvement.

export type OrganKey =
  | 'cardiovascular'
  | 'metabolic'
  | 'liver'
  | 'kidney'
  | 'immune'
  | 'inflammatory'
  | 'hormonal'
  | 'cognitive'
  | 'cellular'
  | 'skin'

export interface OrganDefinition {
  key: OrganKey
  label: string
  short: string
  hue: string // tailwind-friendly base
  gradient: [string, string]
  accent: string
  description: string
  drivers: string[]
}

export const ORGANS: Record<OrganKey, OrganDefinition> = {
  cardiovascular: {
    key: 'cardiovascular',
    label: 'Cardiovascular',
    short: 'Heart',
    hue: 'rose',
    gradient: ['#F472B6', '#FB7185'],
    accent: '#FB7185',
    description: 'Vascular age estimated from ApoB, Lp(a), LDL-P, blood pressure, HRV and ECG-derived metrics.',
    drivers: ['ApoB', 'Lp(a)', 'LDL-P', 'HDL', 'BP', 'HRV'],
  },
  metabolic: {
    key: 'metabolic',
    label: 'Metabolic',
    short: 'Metabolic',
    hue: 'amber',
    gradient: ['#FACC15', '#FB923C'],
    accent: '#FB923C',
    description: 'Insulin sensitivity, fasting glucose, HbA1c, triglycerides and CGM-derived glucose variability.',
    drivers: ['HbA1c', 'Fasting Glucose', 'Insulin', 'HOMA-IR', 'Triglycerides'],
  },
  liver: {
    key: 'liver',
    label: 'Hepatic',
    short: 'Liver',
    hue: 'lime',
    gradient: ['#A3E635', '#65A30D'],
    accent: '#A3E635',
    description: 'Hepatic function from ALT, AST, GGT, ferritin, FIB-4 score and bile acid markers.',
    drivers: ['ALT', 'AST', 'GGT', 'FIB-4', 'Ferritin'],
  },
  kidney: {
    key: 'kidney',
    label: 'Renal',
    short: 'Kidney',
    hue: 'cyan',
    gradient: ['#22D3EE', '#0EA5E9'],
    accent: '#22D3EE',
    description: 'eGFR, cystatin-C, BUN, urine ACR and electrolyte balance estimate kidney biological age.',
    drivers: ['eGFR', 'Cystatin-C', 'BUN', 'Urine ACR'],
  },
  immune: {
    key: 'immune',
    label: 'Immune',
    short: 'Immune',
    hue: 'violet',
    gradient: ['#C4B5FD', '#8B5CF6'],
    accent: '#A78BFA',
    description: 'Lymphocyte:neutrophil ratio, CD4/CD8, IgG subclasses and thymic output proxies.',
    drivers: ['NLR', 'CD4/CD8', 'WBC', 'Lymphocytes'],
  },
  inflammatory: {
    key: 'inflammatory',
    label: 'Inflammatory',
    short: 'Inflame',
    hue: 'red',
    gradient: ['#F87171', '#DC2626'],
    accent: '#F87171',
    description: 'Chronic inflammation index from hs-CRP, IL-6, TNF-α, fibrinogen and homocysteine.',
    drivers: ['hs-CRP', 'IL-6', 'TNF-α', 'Fibrinogen', 'Homocysteine'],
  },
  hormonal: {
    key: 'hormonal',
    label: 'Endocrine',
    short: 'Hormones',
    hue: 'fuchsia',
    gradient: ['#E879F9', '#A21CAF'],
    accent: '#E879F9',
    description: 'Testosterone, free T, DHEA-S, cortisol curve, IGF-1, TSH and SHBG composite.',
    drivers: ['Total T', 'Free T', 'DHEA-S', 'IGF-1', 'TSH', 'Cortisol'],
  },
  cognitive: {
    key: 'cognitive',
    label: 'Cognitive',
    short: 'Brain',
    hue: 'sky',
    gradient: ['#7DD3FC', '#0284C7'],
    accent: '#7DD3FC',
    description: 'Neurofilament light, BDNF, omega-3 index, sleep quality and reaction-time tests.',
    drivers: ['NfL', 'Omega-3 Index', 'BDNF', 'Sleep', 'Reaction time'],
  },
  cellular: {
    key: 'cellular',
    label: 'Cellular',
    short: 'Cellular',
    hue: 'emerald',
    gradient: ['#34D399', '#059669'],
    accent: '#34D399',
    description: 'DNA methylation (Horvath/PhenoAge), telomere length, mitochondrial efficiency.',
    drivers: ['DNAm Age', 'Telomere', 'NAD+', 'Mitochondria'],
  },
  skin: {
    key: 'skin',
    label: 'Dermal',
    short: 'Skin',
    hue: 'orange',
    gradient: ['#FDBA74', '#EA580C'],
    accent: '#FDBA74',
    description: 'Glycation end-products, collagen density, hydration, elastin proxy markers.',
    drivers: ['AGEs', 'Collagen', 'Hydration', 'Elastin'],
  },
}

export const ORGAN_ORDER: OrganKey[] = [
  'cardiovascular',
  'metabolic',
  'cellular',
  'inflammatory',
  'liver',
  'kidney',
  'immune',
  'hormonal',
  'cognitive',
  'skin',
]

export interface Submission {
  id: string
  date: string // ISO
  label: string
  source: string
  panelCount: number
  ages: Record<OrganKey, number>
  composite: number
}

// Chronological age fixed at 38.0 across submissions (rounded to displayed values).
export const CHRONO_AGE = 38

// Hand-tuned trajectory: subject starts ~7 yrs older than chronological,
// trends down to ~3.5 yrs younger over 5 submissions.
export const SUBMISSIONS: Submission[] = [
  {
    id: 's1',
    date: '2025-02-14',
    label: 'Baseline',
    source: 'Quest Diagnostics — 84-marker panel',
    panelCount: 84,
    composite: 45.1,
    ages: {
      cardiovascular: 47.3,
      metabolic: 46.2,
      cellular: 44.8,
      inflammatory: 49.6,
      liver: 43.5,
      kidney: 41.2,
      immune: 44.4,
      hormonal: 46.0,
      cognitive: 42.1,
      skin: 45.7,
    },
  },
  {
    id: 's2',
    date: '2025-05-22',
    label: 'Q2 Recheck',
    source: 'LabCorp — 102-marker panel + DNAm',
    panelCount: 102,
    composite: 42.4,
    ages: {
      cardiovascular: 44.1,
      metabolic: 42.8,
      cellular: 42.6,
      inflammatory: 45.9,
      liver: 41.0,
      kidney: 40.4,
      immune: 42.7,
      hormonal: 43.5,
      cognitive: 40.6,
      skin: 43.9,
    },
  },
  {
    id: 's3',
    date: '2025-08-30',
    label: 'Mid-protocol',
    source: 'Function Health — 118-marker panel',
    panelCount: 118,
    composite: 39.6,
    ages: {
      cardiovascular: 40.7,
      metabolic: 39.1,
      cellular: 40.2,
      inflammatory: 41.3,
      liver: 38.9,
      kidney: 39.2,
      immune: 40.1,
      hormonal: 40.8,
      cognitive: 38.7,
      skin: 41.5,
    },
  },
  {
    id: 's4',
    date: '2025-12-10',
    label: 'Year-end',
    source: 'Quest + TruDiagnostic OMICm',
    panelCount: 134,
    composite: 36.8,
    ages: {
      cardiovascular: 37.4,
      metabolic: 36.0,
      cellular: 37.1,
      inflammatory: 38.2,
      liver: 36.4,
      kidney: 37.5,
      immune: 37.0,
      hormonal: 37.9,
      cognitive: 35.9,
      skin: 39.0,
    },
  },
  {
    id: 's5',
    date: '2026-04-05',
    label: 'Latest',
    source: 'Function Health + DNAm + CGM',
    panelCount: 142,
    composite: 34.5,
    ages: {
      cardiovascular: 35.0,
      metabolic: 33.4,
      cellular: 34.8,
      inflammatory: 35.6,
      liver: 34.1,
      kidney: 36.0,
      immune: 34.6,
      hormonal: 35.5,
      cognitive: 33.2,
      skin: 37.4,
    },
  },
]

export const LATEST = SUBMISSIONS[SUBMISSIONS.length - 1]
export const BASELINE = SUBMISSIONS[0]

// Per-biomarker latest snapshot for the detail panel (illustrative values).
export interface BiomarkerReading {
  name: string
  unit: string
  baseline: number
  current: number
  optimal: [number, number]
  reference: [number, number]
  organ: OrganKey
}

export const BIOMARKERS: BiomarkerReading[] = [
  { name: 'ApoB', unit: 'mg/dL', baseline: 112, current: 71, optimal: [40, 80], reference: [45, 130], organ: 'cardiovascular' },
  { name: 'Lp(a)', unit: 'nmol/L', baseline: 88, current: 64, optimal: [0, 50], reference: [0, 75], organ: 'cardiovascular' },
  { name: 'HDL-C', unit: 'mg/dL', baseline: 41, current: 58, optimal: [55, 90], reference: [40, 100], organ: 'cardiovascular' },
  { name: 'HbA1c', unit: '%', baseline: 5.7, current: 5.0, optimal: [4.6, 5.2], reference: [4.0, 5.6], organ: 'metabolic' },
  { name: 'Fasting Insulin', unit: 'µIU/mL', baseline: 11.4, current: 4.6, optimal: [2, 5], reference: [2, 19], organ: 'metabolic' },
  { name: 'Triglycerides', unit: 'mg/dL', baseline: 168, current: 78, optimal: [40, 90], reference: [40, 150], organ: 'metabolic' },
  { name: 'hs-CRP', unit: 'mg/L', baseline: 2.4, current: 0.4, optimal: [0, 0.55], reference: [0, 3], organ: 'inflammatory' },
  { name: 'IL-6', unit: 'pg/mL', baseline: 2.8, current: 1.1, optimal: [0, 1.5], reference: [0, 5], organ: 'inflammatory' },
  { name: 'Homocysteine', unit: 'µmol/L', baseline: 11.2, current: 7.4, optimal: [5, 8], reference: [5, 15], organ: 'inflammatory' },
  { name: 'ALT', unit: 'U/L', baseline: 38, current: 19, optimal: [10, 25], reference: [7, 56], organ: 'liver' },
  { name: 'GGT', unit: 'U/L', baseline: 41, current: 17, optimal: [5, 22], reference: [9, 48], organ: 'liver' },
  { name: 'eGFR', unit: 'mL/min', baseline: 89, current: 102, optimal: [95, 130], reference: [60, 130], organ: 'kidney' },
  { name: 'Cystatin-C', unit: 'mg/L', baseline: 0.97, current: 0.78, optimal: [0.5, 0.85], reference: [0.5, 1.2], organ: 'kidney' },
  { name: 'Free Testosterone', unit: 'pg/mL', baseline: 71, current: 138, optimal: [110, 200], reference: [50, 220], organ: 'hormonal' },
  { name: 'DHEA-S', unit: 'µg/dL', baseline: 184, current: 312, optimal: [280, 460], reference: [110, 510], organ: 'hormonal' },
  { name: 'IGF-1', unit: 'ng/mL', baseline: 121, current: 178, optimal: [160, 240], reference: [80, 280], organ: 'hormonal' },
  { name: 'NfL', unit: 'pg/mL', baseline: 14.2, current: 8.1, optimal: [0, 9], reference: [0, 18], organ: 'cognitive' },
  { name: 'Omega-3 Index', unit: '%', baseline: 4.1, current: 8.9, optimal: [8, 12], reference: [4, 12], organ: 'cognitive' },
  { name: 'DNAm PhenoAge', unit: 'yrs', baseline: 44.8, current: 34.8, optimal: [28, 36], reference: [25, 60], organ: 'cellular' },
  { name: 'Telomere Length', unit: 'kbp', baseline: 6.4, current: 7.3, optimal: [7.2, 9], reference: [5, 9], organ: 'cellular' },
  { name: 'NAD+', unit: 'µM', baseline: 22, current: 41, optimal: [38, 60], reference: [15, 70], organ: 'cellular' },
  { name: 'NLR', unit: 'ratio', baseline: 2.4, current: 1.5, optimal: [1, 2], reference: [1, 3.5], organ: 'immune' },
  { name: 'AGEs (skin AF)', unit: 'AU', baseline: 2.3, current: 1.6, optimal: [1.0, 1.8], reference: [1, 3.5], organ: 'skin' },
]

export function deltaSign(current: number, baseline: number): 'better' | 'worse' | 'flat' {
  const diff = current - baseline
  if (Math.abs(diff) < 0.05) return 'flat'
  return diff < 0 ? 'better' : 'worse'
}
