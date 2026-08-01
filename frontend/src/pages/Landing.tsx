import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Terminal, Zap, GitBranch, Layers, FileText, Globe, Code2, Cpu, BarChart2, Bot, CheckCircle } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

// ── Scroll Progress Bar ───────────────────────────────────────────────────────
const ScrollProgress: React.FC = () => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const handle = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setWidth(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  return (
    <div
      className="scroll-progress-bar"
      style={{ width: `${width}%` }}
    />
  )
}

// ── Animated Counter ──────────────────────────────────────────────────────────
const Counter: React.FC<{ end: number; suffix?: string; duration?: number }> = ({
  end, suffix = '', duration = 1800,
}) => {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1)
          setValue(Math.round((1 - Math.pow(1 - p, 3)) * end))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return <span ref={ref}>{value}{suffix}</span>
}

// ── 3D Tilt Card ─────────────────────────────────────────────────────────────
const TiltCard: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children, className = '', style = {}, ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    el.style.transform = `perspective(700px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(4px)`
    el.style.boxShadow = `${-x * 12}px ${-y * 12}px 28px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(200,200,216,0.12)`
  }, [])

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0)'
    el.style.boxShadow = ''
  }, [])

  return (
    <div
      ref={ref}
      className={`card-metallic ${className}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transition: 'transform 0.12s ease, box-shadow 0.12s ease', ...style }}
      {...rest}
    >
      {children}
    </div>
  )
}

// ── Pipeline Steps ────────────────────────────────────────────────────────────
const PIPELINE_STEPS = [
  {
    icon: Globe,     label: 'Research',     color: '#60A5FA', num: '01',
    desc: 'Live competitor analysis via Tavily web search',
    detail: 'Foundry dispatches a live-search agent that pulls real company data, funding rounds, and positioning from the web — giving you ground truth, not GPT hallucinations.',
    output: 'Competitor matrix + market gap analysis',
  },
  {
    icon: FileText,  label: 'PRD',          color: '#A78BFA', num: '02',
    desc: 'Full product requirements document',
    detail: 'Using the research as context, this agent drafts your entire PRD — problem statement, personas, success metrics, and scope. Everything a PM writes in a week, done in seconds.',
    output: 'Structured PRD with goals, KPIs & scope',
  },
  {
    icon: Bot,       label: 'Personas',     color: '#F472B6', num: '03',
    desc: 'Target user archetypes & pain points',
    detail: 'Generates 2–4 detailed user personas grounded in the market research — names, roles, goals, frustrations, and the specific job-to-be-done your product solves.',
    output: '3 rich user personas with empathy maps',
  },
  {
    icon: Layers,    label: 'Agile Scope',  color: '#34D399', num: '04',
    desc: 'User stories & MoSCoW prioritization',
    detail: "Translates the PRD into an Agile backlog of user stories in the format \"As a [persona], I want to…\" then applies MoSCoW (Must/Should/Could/Won’t) prioritization for your MVP.",
    output: '14+ user stories with priority labels',
  },
  {
    icon: Cpu,       label: 'Architecture', color: '#F97316', num: '05',
    desc: 'Database schema & REST API design',
    detail: 'Designs the technical foundation: normalized database tables, relationships, and a complete REST API route spec — including methods, paths, and descriptions for every endpoint.',
    output: 'DB schema + 20+ documented API routes',
  },
  {
    icon: BarChart2, label: 'Roadmap',      color: '#FCD34D', num: '06',
    desc: '4-sprint milestone delivery plan',
    detail: 'Maps each user story to one of four 2-week sprints, sequencing by dependency. Sprint 1 is always foundation & auth. Sprint 4 is always testing & launch — no guessing.',
    output: '4-sprint plan with story IDs per sprint',
  },
  {
    icon: Code2,     label: 'FinOps',       color: '#6EE7B7', num: '07',
    desc: 'Cloud cost model at 3 scale tiers',
    detail: 'Estimates your monthly cloud infrastructure cost at 100, 1,000, and 10,000 active users — broken down by compute, database, and CDN, so you can plan your unit economics.',
    output: 'Cost breakdown at 3 scale tiers',
  },
  {
    icon: GitBranch, label: 'Scaffolding',  color: '#93C5FD', num: '08',
    desc: 'Repo structure & setup instructions',
    detail: 'Generates a ready-to-clone folder structure for your stack, plus a step-by-step onboarding script so any engineer can spin up the dev environment in minutes.',
    output: 'File tree + setup CLI commands',
  },
  {
    icon: Terminal,  label: 'UI Blueprint', color: '#C4B5FD', num: '09',
    desc: 'Live HTML/CSS prototype generation',
    detail: 'Creates a fully interactive HTML/CSS mockup of your core landing page or app view — styled, responsive, and rendered live in an iframe. Not a wireframe. A real prototype.',
    output: 'Interactive HTML/CSS prototype (live preview)',
  },
  {
    icon: Zap,       label: 'PDF Export',   color: '#FBBF24', num: '10',
    desc: '11-page downloadable spec document',
    detail: 'Compiles every agent output into a single, beautifully formatted 11-page PDF — ready to attach to an investor email, hand to a dev team, or drop into Notion.',
    output: '11-page formatted PDF blueprint',
  },
]

// ── Cinematic Pipeline Timeline ───────────────────────────────────────────────
const CinematicPipeline: React.FC = () => {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const lineRef  = useRef<HTMLDivElement>(null)
  const [lineH, setLineH] = useState(0)

  useEffect(() => {
    const update = () => {
      const items = itemRefs.current.filter(Boolean)
      if (!items.length) return
      const first = items[0]!.getBoundingClientRect()
      const last  = items[items.length - 1]!.getBoundingClientRect()
      const container = lineRef.current?.parentElement?.getBoundingClientRect()
      if (!container) return
      setLineH(last.bottom - first.top - (first.height / 2))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto' }}>
      {/* Vertical connector spine */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        transform: 'translateX(-50%)',
        width: 2,
        height: lineH || '100%',
        background: 'linear-gradient(to bottom, transparent, var(--accent) 8%, var(--silver) 50%, var(--accent) 92%, transparent)',
        opacity: 0.25,
        pointerEvents: 'none',
      }} ref={lineRef} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {PIPELINE_STEPS.map((step, i) => {
          const isLeft = i % 2 === 0 // even = content on left, node right; odd = content right, node left
          return (
            <div
              key={i}
              ref={el => { itemRefs.current[i] = el }}
              className="scroll-animate"
              data-animate
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 56px 1fr',
                alignItems: 'center',
                gap: 0,
                marginBottom: i < PIPELINE_STEPS.length - 1 ? 0 : 0,
                transitionDelay: `${i * 50}ms`,
              } as React.CSSProperties}
            >
              {/* Left column */}
              <div style={{
                padding: '28px 32px 28px 0',
                textAlign: isLeft ? 'right' : 'left',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isLeft ? 'flex-end' : 'flex-start',
                opacity: isLeft ? 1 : 0,
                pointerEvents: isLeft ? 'auto' : 'none',
              }}>
                {isLeft && (
                  <>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      background: `${step.color}12`,
                      border: `1px solid ${step.color}28`,
                      borderRadius: 10, padding: '6px 12px',
                      marginBottom: 12,
                    }}>
                      <step.icon size={14} color={step.color} strokeWidth={2} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: step.color, letterSpacing: '-0.01em' }}>{step.label}</span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 10, maxWidth: 340 }}>
                      {step.detail}
                    </p>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                      borderRadius: 6, padding: '4px 10px',
                    }}>
                      <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>OUTPUT</span>
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{step.output}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Centre node */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: `radial-gradient(circle, ${step.color}22 0%, var(--bg-base) 70%)`,
                  border: `1.5px solid ${step.color}60`,
                  boxShadow: `0 0 18px ${step.color}28, 0 0 40px ${step.color}12`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <step.icon size={16} color={step.color} strokeWidth={1.75} />
                  {/* Step number bubble */}
                  <span style={{
                    position: 'absolute', top: -6, right: -6,
                    width: 16, height: 16, borderRadius: '50%',
                    background: 'var(--bg-base)', border: `1px solid ${step.color}50`,
                    fontSize: 8, fontWeight: 800, color: step.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                  }}>{step.num}</span>
                </div>
              </div>

              {/* Right column */}
              <div style={{
                padding: '28px 0 28px 32px',
                textAlign: isLeft ? 'left' : 'left',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                opacity: isLeft ? 0 : 1,
                pointerEvents: isLeft ? 'none' : 'auto',
              }}>
                {!isLeft && (
                  <>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      background: `${step.color}12`,
                      border: `1px solid ${step.color}28`,
                      borderRadius: 10, padding: '6px 12px',
                      marginBottom: 12,
                    }}>
                      <step.icon size={14} color={step.color} strokeWidth={2} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: step.color, letterSpacing: '-0.01em' }}>{step.label}</span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 10, maxWidth: 340 }}>
                      {step.detail}
                    </p>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                      borderRadius: 6, padding: '4px 10px',
                    }}>
                      <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>OUTPUT</span>
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{step.output}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "Replaced a week of manual work. I shipped my PRD to investors the same day I had the idea.",
    name: "Arjun Mehta", role: "Founder, StealthAI", initials: "AM", color: "#F97316",
  },
  {
    quote: "The architecture output alone saved us $8k in consultant fees. This is what AI should be.",
    name: "Sofia Reyes", role: "CTO, Launchpad Labs", initials: "SR", color: "#60A5FA",
  },
  {
    quote: "Generated blueprints for three ideas in one afternoon. Picked the best and started building.",
    name: "Kai Tanaka", role: "Serial Entrepreneur", initials: "KT", color: "#A78BFA",
  },
]

// ── Main Landing Component ────────────────────────────────────────────────────
export const Landing: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null)
  useScrollAnimation(pageRef)

  // Typing animation
  const PHRASES = ['Product Blueprint', 'Investor Deck', 'Tech Architecture', 'Go-to-Market Plan']
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const phrase = PHRASES[phraseIdx]
    let t: ReturnType<typeof setTimeout>
    if (!deleting && displayed.length < phrase.length) {
      t = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), 60)
    } else if (!deleting && displayed.length === phrase.length) {
      t = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && displayed.length > 0) {
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35)
    } else {
      setDeleting(false)
      setPhraseIdx(i => (i + 1) % PHRASES.length)
    }
    return () => clearTimeout(t)
  }, [displayed, deleting, phraseIdx])

  return (
    <div ref={pageRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <ScrollProgress />

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10, 10, 12, 0.82)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
      }}>
        <div className="container" style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px var(--accent-glow)',
            }}>
              <Zap size={15} color="#000" strokeWidth={2.5} />
            </div>
            {/* Silver metallic logo text */}
            <span className="text-gradient-silver" style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.04em' }}>
              Foundry
            </span>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Link to="/login" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', padding: '6px 12px', borderRadius: 8 }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              Sign in
            </Link>
            <Link to="/signup" className="btn btn-primary" style={{ fontSize: 13, padding: '7px 16px' }}>
              Start building <ArrowRight size={13} />
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px 80px', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>

        <div className="animate-fade-up" style={{ marginBottom: 28, display: 'flex', justifyContent: 'center' }}>
          <span className="badge badge-accent">
            <span className="dot-live" />
            10 AI agents · generates in ~60 seconds
          </span>
        </div>

        <h1 className="animate-fade-up stagger-1 text-balance" style={{
          fontSize: 'clamp(42px, 6.5vw, 70px)', fontWeight: 900,
          lineHeight: 1.06, letterSpacing: '-0.045em', marginBottom: 24,
        }}>
          Turn your idea into a{' '}<br />
          {/* Amber gradient for the typed word */}
          <span className="text-gradient" style={{ display: 'inline-block', minWidth: '10ch' }}>
            {displayed}
            <span className="animate-blink" style={{ color: 'var(--accent)', marginLeft: 2 }}>|</span>
          </span>
        </h1>

        <p className="animate-fade-up stagger-2 text-balance" style={{
          fontSize: 18, color: 'var(--text-secondary)', maxWidth: 560,
          margin: '0 auto 40px', lineHeight: 1.65,
        }}>
          Foundry orchestrates 10 specialized AI agents in sequence — from market research to live UI prototypes — delivering a complete startup blueprint in one click.
        </p>

        <div className="animate-fade-up stagger-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/signup" className="btn btn-primary" style={{ fontSize: 14, padding: '12px 24px' }}>
            Build my blueprint <ArrowRight size={15} />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ fontSize: 14, padding: '12px 24px' }}>
            Try demo mode
          </Link>
        </div>

        <p className="animate-fade-up stagger-4" style={{ marginTop: 28, fontSize: 12, color: 'var(--text-tertiary)' }}>
          No credit card · Free to start · PDF export included
        </p>
      </section>

      {/* ── Stats bar ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '28px 24px', background: 'var(--bg-surface)' }}>
        {/* Metallic divider top */}
        <hr className="divider-metallic" style={{ marginBottom: 28 }} />
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: 64, flexWrap: 'wrap' }}>
          {[
            { value: 10, suffix: '', label: 'AI Agents' },
            { value: 60, suffix: 's', label: 'Avg. generation time' },
            { value: 11, suffix: '', label: 'Page PDF export' },
            { value: 100, suffix: '%', label: 'Self-contained output' },
          ].map((stat, i) => (
            <div key={i} className="scroll-animate" data-animate style={{ textAlign: 'center' }}>
              {/* Silver gradient on the numbers */}
              <div className="text-gradient-silver" style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.05em' }}>
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
        <hr className="divider-metallic" style={{ marginTop: 28 }} />
      </section>

      {/* ── Pipeline ─── Cinematic vertical timeline ──────────────────────── */}
      <section style={{ padding: '100px 24px 120px' }}>
        <div className="container">

          {/* Section header */}
          <div className="scroll-animate" data-animate style={{ textAlign: 'center', marginBottom: 80 }}>
            <p className="text-gradient-silver" style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 14 }}>
              The Pipeline
            </p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 16, lineHeight: 1.08 }}>
              10 agents.{' '}
              <span className="text-gradient-premium">One blueprint.</span>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              Every agent consumes the output of the previous one — building a single, coherent specification, not ten disconnected fragments.
            </p>

            {/* Flow hint */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 28 }}>
              <div style={{ width: 20, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.08em' }}>scroll to follow the workflow</span>
              <div style={{ width: 20, height: 1, background: 'var(--border)' }} />
            </div>
          </div>

          {/* Cinematic timeline */}
          <CinematicPipeline />

        </div>
      </section>

      {/* ── What you get ───────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-surface)' }}>
        <hr className="divider-metallic" style={{ marginBottom: 80 }} />
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>

          <div>
            <p className="scroll-animate-left text-gradient-silver" data-animate style={{
              fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 16,
            }}>
              What you get
            </p>
            <h2 className="scroll-animate-left delay-1" data-animate style={{
              fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 900, letterSpacing: '-0.035em', marginBottom: 20, lineHeight: 1.12,
            }}>
              Everything to go from idea<br />to investor-ready
            </h2>
            <p className="scroll-animate-left delay-2" data-animate style={{
              fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28,
            }}>
              Not just a document. A complete, interconnected spec that a developer can build from and an investor can understand.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {[
                'Real competitor research from live web data',
                'Agile user story backlog with MoSCoW priority',
                'Database schema + REST API route spec',
                'Cloud cost model at 100, 1k, and 10k users',
                'Downloadable 11-page PDF blueprint',
                'Live HTML/CSS UI prototype preview',
              ].map((item, i) => (
                <div key={i} className="scroll-animate-left" data-animate style={{ display: 'flex', gap: 10, alignItems: 'flex-start', transitionDelay: `${(i + 3) * 55}ms` }}>
                  <CheckCircle size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} strokeWidth={2} />
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Faux terminal card — right side */}
          <div className="scroll-animate-right" data-animate>
            <TiltCard style={{ overflow: 'hidden', padding: 0 }}>
              {/* Terminal header bar */}
              <div style={{
                background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)',
                padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 7,
              }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444', opacity: 0.75 }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B', opacity: 0.75 }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22C55E', opacity: 0.75 }} />
                {/* Silver mono filename */}
                <span className="text-gradient-silver" style={{ marginLeft: 8, fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  blueprint.json
                </span>
              </div>
              {/* JSON content */}
              <div style={{ padding: '20px 22px', fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.85 }}>
                {[
                  { k: '"project"',      v: '"FinTrack AI"',              vc: 'var(--accent-light)' },
                  { k: '"competitors"',  v: '["Mint", "YNAB", "Copilot"]',vc: '#60A5FA' },
                  { k: '"stories"',      v: '14 items',                   vc: '#34D399' },
                  { k: '"sprint_1"',     v: '["US-001", "US-002"]',       vc: '#A78BFA' },
                  { k: '"db_tables"',    v: '["users", "transactions"]',  vc: '#F472B6' },
                  { k: '"monthly_cost"', v: '"$42 / 100 users"',          vc: '#FCD34D' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10 }}>
                    <span style={{ color: 'var(--silver-dim)' }}>{row.k}:</span>
                    <span style={{ color: row.vc }}>{row.v}</span>
                  </div>
                ))}
                <div style={{ marginTop: 14, display: 'flex', gap: 9, alignItems: 'center' }}>
                  <div className="dot-live" />
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Generated in 52s</span>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
        <hr className="divider-metallic" style={{ marginTop: 80 }} />
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container">
          <p className="scroll-animate text-gradient-silver" data-animate style={{
            fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 44,
          }}>
            From founders who shipped
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {TESTIMONIALS.map((t, i) => (
              <TiltCard
                key={i}
                data-animate
                className="scroll-animate"
                style={{ padding: '24px', transitionDelay: `${i * 80}ms` } as React.CSSProperties}
              >
                <div style={{ fontSize: 38, lineHeight: 1, color: t.color, opacity: 0.25, fontFamily: 'Georgia, serif', marginBottom: 12 }}>"</div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: `${t.color}1A`, border: `1px solid ${t.color}35`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: t.color,
                  }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{t.role}</div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px' }}>
        <hr className="divider-metallic" style={{ marginBottom: 80 }} />
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <h2 className="scroll-animate" data-animate style={{
            fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, letterSpacing: '-0.045em', marginBottom: 16,
          }}>
            Your idea deserves a{' '}
            <span className="text-gradient-premium">blueprint.</span>
          </h2>
          <p className="scroll-animate delay-1" data-animate style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 36 }}>
            Stop writing docs manually. Generate your complete product specification in under a minute.
          </p>
          <div className="scroll-animate delay-2" data-animate style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn btn-primary" style={{ fontSize: 15, padding: '13px 28px' }}>
              Get started free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer style={{ marginTop: 'auto', padding: '28px 24px' }}>
        <hr className="divider-metallic" style={{ marginBottom: 28 }} />
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={11} color="#000" strokeWidth={2.5} />
            </div>
            <span className="text-gradient-silver" style={{ fontSize: 13, fontWeight: 700 }}>Foundry AI</span>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>LangGraph · FastAPI · React</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>© {new Date().getFullYear()} Foundry AI</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
