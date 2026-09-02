'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  Clock3,
  Database,
  FileCheck2,
  FileText,
  Fingerprint,
  Gauge,
  Layers3,
  LineChart,
  LockKeyhole,
  Menu,
  Network,
  Play,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  UploadCloud,
  X,
  Zap,
} from 'lucide-react'

type View = 'opportunities' | 'fingerprint' | 'outcomes'
type StageStatus = 'complete' | 'running' | 'queued' | 'blocked'

type Stage = {
  title: string
  short: string
  icon: typeof UploadCloud
  kind: 'TOOL' | 'MODEL' | 'GATE'
  output: string
  detail: string
  status: StageStatus
}

const stageTemplates: Omit<Stage, 'status'>[] = [
  { title: 'Ingestion & document understanding', short: 'Ingestion', icon: UploadCloud, kind: 'TOOL', output: '52 claims normalized', detail: 'Parsed remits, clinical documents, contract terms, and payer policy references into a traceable claim bundle.', },
  { title: 'Payer behavior', short: 'Payer behavior', icon: Fingerprint, kind: 'MODEL', output: '61% drift detected', detail: 'Aetna fingerprint matches a recent DRG downgrade pattern with elevated frequency versus baseline.', },
  { title: 'Clustering', short: 'Clustering', icon: Network, kind: 'MODEL', output: '1 coherent episode', detail: 'Grouped 52 claim lines into one facility / payer / code-family episode for consistent treatment.', },
  { title: 'Evidence & grounding', short: 'Evidence', icon: FileCheck2, kind: 'TOOL', output: '2 contract citations', detail: 'Grounded recommendation in Contract §4.2 and Policy P-118, with source spans linked to each claim.', },
  { title: 'Disposition', short: 'Disposition', icon: Target, kind: 'MODEL', output: 'EV appeal ≈ $735K', detail: 'Deterministic tool output: 82% historical overturn rate × $899K exposure = $737K expected value, rounded for packaging.', },
  { title: 'Action / packaging', short: 'Action', icon: ClipboardCheck, kind: 'GATE', output: 'Human approval required', detail: 'A reviewer must approve the recommended appeal language and evidence bundle before any submission artifact is created.', },
  { title: 'Outcome & learning', short: 'Outcome', icon: LineChart, kind: 'MODEL', output: '47 / 52 recovered', detail: 'Synthetic post-submission outcome: $812K recovered, feeding payer fingerprint and policy learning loops.', },
]

const navItems: { id: View; label: string; icon: typeof BarChart3 }[] = [
  { id: 'opportunities', label: 'Opportunity dashboard', icon: BarChart3 },
  { id: 'fingerprint', label: 'Payer fingerprint', icon: Fingerprint },
  { id: 'outcomes', label: 'Outcome analytics', icon: LineChart },
]

function Pill({ children, tone = 'slate' }: { children: React.ReactNode; tone?: 'slate' | 'teal' | 'amber' | 'green' | 'red' }) {
  return <span className={`pill pill-${tone}`}>{children}</span>
}

function Metric({ label, value, note, accent }: { label: string; value: string; note: string; accent: string }) {
  return <div className="metric"><span className="metric-label">{label}</span><strong style={{ color: accent }}>{value}</strong><span className="metric-note">{note}</span></div>
}

function StageCard({ stage, selected, onClick, index }: { stage: Stage; selected: boolean; onClick: () => void; index: number }) {
  const Icon = stage.icon
  return <button className={`stage-card ${selected ? 'stage-selected' : ''} stage-${stage.status}`} onClick={onClick}>
    <div className="stage-top"><span className="stage-index">{String(index + 1).padStart(2, '0')}</span><span className={`stage-status status-${stage.status}`}>{stage.status === 'complete' ? <Check size={12} /> : stage.status === 'running' ? <Activity size={12} /> : stage.status === 'blocked' ? <LockKeyhole size={12} /> : <CircleDot size={12} />}{stage.status}</span></div>
    <div className="stage-icon"><Icon size={17} /></div>
    <span className="stage-title">{stage.short}</span>
    <span className="stage-output">{stage.output}</span>
    <span className={`kind kind-${stage.kind.toLowerCase()}`}>{stage.kind}</span>
  </button>
}

function OpportunityView({ onRun, running, approved, submitted }: { onRun: () => void; running: boolean; approved: boolean; submitted: boolean }) {
  const [selected, setSelected] = useState(4)
  const [decision, setDecision] = useState<'pending' | 'approved' | 'rejected'>(approved ? 'approved' : 'pending')
  const [edited, setEdited] = useState(false)
  const stages = useMemo(() => stageTemplates.map((stage, index) => ({ ...stage, status: submitted ? 'complete' as StageStatus : approved && index >= 5 ? 'complete' as StageStatus : running && index === 5 ? 'blocked' as StageStatus : running && index <= 4 ? 'complete' as StageStatus : index < 5 ? 'complete' as StageStatus : 'queued' as StageStatus })), [running, approved, submitted])
  const activeStage = stages[selected]
  const approve = () => { setDecision('approved'); onRun() }
  return <>
    <section className="hero-row">
      <div><div className="eyebrow"><Sparkles size={14} /> Mock workflow / package 00428</div><h1>Turn denial noise into <em>recoverable work.</em></h1><p className="hero-copy">RevCompass coordinates specialist agents to identify, ground, and route the highest-value revenue opportunities — with a human in the loop where it matters.</p></div>
      <div className="hero-actions"><div className="live-status"><span className="live-dot" /> Demo environment <span className="separator">•</span> Synthetic data</div><button className="run-button" onClick={onRun}><Play size={15} fill="currentColor" /> {running ? 'Workflow running' : 'Run workflow'}<ChevronRight size={15} /></button></div>
    </section>
    <section className="metric-grid"><Metric label="Open exposure" value="$2.4M" note="28 active packages" accent="var(--ink)" /><Metric label="Packaged exposure" value="$899K" note="Aetna · DRG 871" accent="var(--teal)" /><Metric label="Drift alerts" value="14" note="+3 this week" accent="var(--orange)" /><Metric label="Recovery opportunity" value="$735K" note="82% historical overturn" accent="var(--green)" /></section>
    <div className="section-heading"><div><span className="eyebrow">Priority queue</span><h2>Opportunity worklist</h2></div><div className="filter-row"><button className="filter active">All packages <b>28</b></button><button className="filter">Needs review <b>6</b></button><button className="filter">High EV <b>11</b></button></div></div>
    <section className="worklist"><div className="package-row package-active"><div className="package-mark"><ShieldCheck size={21} /></div><div className="package-main"><div className="package-meta"><Pill tone="amber">HIGH EV</Pill><span>AETNA · FACILITY</span><span>Updated 8 min ago</span></div><h3>DRG 871 → 872 downgrade cluster</h3><p>52 claims · Discharge status mismatch · Contract §4.2</p></div><div className="package-money"><strong>$899K</strong><span>exposure</span></div><div className="package-confidence"><span>Appeal confidence</span><strong>82%</strong><div className="bar"><i style={{ width: '82%' }} /></div></div><ArrowUpRight className="row-arrow" size={18} /></div><div className="package-row"><div className="package-mark quiet"><Database size={21} /></div><div className="package-main"><div className="package-meta"><Pill tone="teal">REVIEW</Pill><span>UNITEDHEALTH · FACILITY</span><span>Updated 42 min ago</span></div><h3>Outlier length-of-stay edits</h3><p>19 claims · Medical necessity pattern · Policy UM-204</p></div><div className="package-money"><strong>$284K</strong><span>exposure</span></div><div className="package-confidence"><span>Appeal confidence</span><strong>68%</strong><div className="bar"><i style={{ width: '68%' }} /></div></div><ArrowUpRight className="row-arrow" size={18} /></div></section>
    <section className="detail-shell"><div className="detail-head"><div><div className="package-meta"><Pill tone="green">SELECTED PACKAGE</Pill><span>RC-00428</span><span>•</span><span>Created today at 09:42</span></div><h2>Aetna DRG downgrade package</h2><p>52 claim episode · Aetna Commercial · Facility: Northstar Medical Center</p></div><div className="detail-head-right"><div className="deadline"><Clock3 size={16} /><span>Filing window</span><strong>45 days left</strong></div><button className="icon-button" aria-label="Close detail"><X size={17} /></button></div></div>
      <div className="workflow-label"><span>Agent workflow</span><span className="workflow-line" /><span className="workflow-note"><Zap size={13} /> deterministic mock run</span></div>
      <div className="stage-grid">{stages.map((stage, index) => <StageCard key={stage.title} stage={stage} index={index} selected={selected === index} onClick={() => setSelected(index)} />)}</div>
      <div className="detail-grid"><div className="evidence-panel"><div className="panel-title"><div><span className="eyebrow">Agent output</span><h3>{activeStage.title}</h3></div><Pill tone={activeStage.kind === 'GATE' ? 'amber' : 'teal'}>{activeStage.kind === 'GATE' ? 'HUMAN GATE' : `${activeStage.kind} RESULT`}</Pill></div><p className="detail-text">{activeStage.detail}</p>{selected === 4 && <div className="math-callout"><div className="math-icon"><Gauge size={18} /></div><div><span>Expected value calculation</span><strong>0.82 × $899,000 = $737,180</strong><small>Tool output rounded to $735K for package prioritization</small></div></div>}{selected === 3 && <div className="citation-list"><div><FileText size={16} /><span><strong>Contract §4.2</strong><small>“Grouping logic must reflect documented principal diagnosis…”</small></span><BadgeCheck size={15} /></div><div><FileText size={16} /><span><strong>Policy P-118</strong><small>DRG reassignment requires supporting clinical indicators.</small></span><BadgeCheck size={15} /></div></div>}{selected === 6 && <div className="outcome-mini"><div><strong>$812K</strong><span>recovered</span></div><div><strong>47 / 52</strong><span>claims overturned</span></div><div><strong>90.2%</strong><span>recovery rate</span></div></div>}</div>
        <div className="approval-panel"><div className="panel-title"><div><span className="eyebrow">Decision surface</span><h3>{submitted ? 'Outcome recorded' : approved || decision === 'approved' ? 'Appeal package ready' : 'Review before action'}</h3></div><div className={`approval-dot ${submitted || approved ? 'approved' : ''}`}><Check size={15} /></div></div>{submitted ? <><p className="detail-text">Submission recorded. The outcome agent has attached recovery signals to the Aetna payer fingerprint.</p><div className="success-box"><Check size={18} /><div><strong>Submitted to payer queue</strong><span>Artifact AP-00428 · 09:56 today</span></div></div></> : approved || decision === 'approved' ? <><p className="detail-text">The consolidated appeal artifact is grounded and ready for handoff.</p><div className="artifact-box"><FileCheck2 size={20} /><div><strong>Appeal artifact AP-00428</strong><span>8 citations · 52 claim references · 14 pages</span></div><ArrowUpRight size={16} /></div><button className="submit-button" onClick={onRun}><Send size={15} /> Submit to payer queue</button></> : <><p className="detail-text">Action packaging is paused until a reviewer confirms the disposition and evidence set.</p><div className="reviewer-row"><div className="avatar">JD</div><div><strong>Jordan Davis</strong><span>Revenue Integrity Lead</span></div><span className="assigned">Assigned</span></div>{edited && <div className="edited-note">Draft language edited · rationale strengthened with Policy P-118</div>}<div className="approval-actions"><button className="secondary-button" onClick={() => setEdited(true)}>Edit draft</button><button className="approve-button" onClick={approve}><Check size={15} /> Approve action</button></div><button className="reject-button" onClick={() => setDecision('rejected')}>Reject and route to review queue</button></>}</div></div>
    </section>
  </>
}

function FingerprintView() { return <section className="view-page"><div className="eyebrow"><Fingerprint size={14} /> Payer behavior intelligence</div><h1>Aetna <em>fingerprint.</em></h1><p className="hero-copy">A living view of how this payer edits, disputes, and resolves revenue — learned from every grounded package.</p><div className="fingerprint-grid"><div className="large-card"><div className="card-head"><div><span className="eyebrow">Edit behavior · trailing 90d</span><h3>DRG downgrade frequency</h3></div><Pill tone="amber">+18% vs baseline</Pill></div><div className="spark-bars">{[36,42,38,55,48,62,58,74,68,82,78,91,84,97].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div><div className="chart-axis"><span>Apr 01</span><span>May 01</span><span>Jun 01</span><span>Jun 30</span></div></div><div className="side-card"><span className="eyebrow">Most reliable signal</span><strong>Clinical indicator mismatch</strong><p>Appears in 74% of overturned Aetna DRG edits.</p><div className="signal-score"><span>Signal strength</span><b>0.91</b></div><div className="bar"><i style={{ width: '91%' }} /></div></div></div><div className="insight-grid"><div><span className="eyebrow">Common edit vectors</span><ul><li><span>DRG downgrade</span><b>61%</b></li><li><span>Medical necessity</span><b>23%</b></li><li><span>Discharge status</span><b>11%</b></li><li><span>Other</span><b>5%</b></li></ul></div><div><span className="eyebrow">Resolution profile</span><ul><li><span>Overturn rate</span><b className="green-text">82%</b></li><li><span>Median response</span><b>18 days</b></li><li><span>Best evidence</span><b>Clinical + contract</b></li><li><span>Last refreshed</span><b>Today, 09:42</b></li></ul></div></div></section> }

function OutcomesView() { return <section className="view-page"><div className="eyebrow"><LineChart size={14} /> Closed-loop learning</div><h1>Recovery <em>outcomes.</em></h1><p className="hero-copy">Every decision becomes signal. Track what converts to cash and make the next agent run smarter.</p><div className="outcome-kpis"><Metric label="Recovered this quarter" value="$3.8M" note="+24% vs prior quarter" accent="var(--green)" /><Metric label="Appeal conversion" value="76.4%" note="Across 148 packages" accent="var(--teal)" /><Metric label="Median time to cash" value="31d" note="-6 days vs baseline" accent="var(--ink)" /></div><div className="large-card recovery-card"><div className="card-head"><div><span className="eyebrow">Recovery by month</span><h3>Cash impact from agent-routed work</h3></div><Pill tone="green">+$744K this month</Pill></div><div className="line-chart"><svg viewBox="0 0 700 190" role="img" aria-label="Recovery trend chart"><path d="M10 165 C70 158 70 142 130 146 S190 120 245 128 S300 96 355 110 S420 80 470 91 S530 55 585 68 S640 30 690 38" fill="none" stroke="var(--teal)" strokeWidth="4" strokeLinecap="round" /><path d="M10 165 C70 158 70 142 130 146 S190 120 245 128 S300 96 355 110 S420 80 470 91 S530 55 585 68 S640 30 690 38 V190 H10Z" fill="url(#area)" opacity=".18" /><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop stopColor="var(--teal)"/><stop offset="1" stopColor="var(--teal)" stopOpacity="0"/></linearGradient></defs></svg><div className="chart-axis"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div></div></div><div className="outcome-table"><div className="table-head"><span>Package</span><span>Payer</span><span>Exposure</span><span>Recovered</span><span>Result</span></div>{[['DRG 871 → 872 downgrade','Aetna','$899K','$812K','47 / 52'],['LOS medical necessity','UnitedHealth','$284K','$203K','14 / 19'],['Modifier 25 edit','Cigna','$172K','$151K','21 / 24']].map(row => <div className="table-row" key={row[0]}>{row.map((cell, i) => <span key={cell} className={i === 4 ? 'green-text' : ''}>{cell}</span>)}</div>)}</div></section> }

export default function Page() {
  const [view, setView] = useState<View>('opportunities')
  const [runCount, setRunCount] = useState(0)
  const running = runCount > 0
  const approved = runCount > 0
  const submitted = runCount > 1
  const runWorkflow = () => setRunCount((count) => Math.min(count + 1, 3))
  return <main className="app-shell"><aside className="sidebar"><div className="brand"><div className="brand-mark"><Network size={19} /></div><span>rev<span>compass</span></span></div><div className="workspace-label">Workspace</div><nav>{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? 'nav-active' : ''} onClick={() => setView(id)}><Icon size={17} /><span>{label}</span>{id === 'opportunities' && <b>28</b>}</button>)}</nav><div className="sidebar-bottom"><div className="privacy-note"><LockKeyhole size={14} /><span>HIPAA-ready<br /><small>Synthetic workspace</small></span></div><div className="user-row"><div className="avatar">JD</div><div><strong>Jordan Davis</strong><span>Revenue Integrity</span></div><ChevronRight size={15} /></div></div></aside><div className="main-shell"><header className="topbar"><button className="mobile-menu" aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumbs"><span>RevCompass</span><ChevronRight size={14} /><strong>{navItems.find((item) => item.id === view)?.label}</strong></div><div className="topbar-right"><span className="sync"><span className="sync-dot" /> All systems operational</span><span className="top-avatar">JD</span></div></header><div className="content">{view === 'opportunities' && <OpportunityView onRun={runWorkflow} running={running} approved={approved} submitted={submitted} />}{view === 'fingerprint' && <FingerprintView />}{view === 'outcomes' && <OutcomesView />}</div></div></main>
}
