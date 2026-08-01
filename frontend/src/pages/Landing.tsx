import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, CheckCircle, Search, LayoutTemplate, Users, ListChecks, ServerCog, Route, Cpu, DollarSign, FolderGit2, Palette } from 'lucide-react'
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
    icon: Search, num: '01', label: 'Market Research',
    color: '#60A5FA', glow: 'rgba(96,165,250,0.18)',
    tag: 'RESEARCH AGENT',
    desc: 'Foundry dispatches a live web-search agent powered by Tavily API. It crawls the real internet — competitor sites, product pages, and tech blogs — returning structured intelligence your PRD is built on.',
    output: 'Competitor matrix · Market gaps · Trend signals',
  },
  {
    icon: LayoutTemplate, num: '02', label: 'Product Requirements',
    color: '#A78BFA', glow: 'rgba(167,139,250,0.18)',
    tag: 'PRD AGENT',
    desc: 'Using research findings as its context, the PRD agent drafts a full Product Requirements Document — product vision, feature list, success metrics, and constraint boundaries. No blank page. Ever.',
    output: 'Vision statement · Feature inventory · KPIs',
  },
  {
    icon: Users, num: '03', label: 'User Personas',
    color: '#F472B6', glow: 'rgba(244,114,182,0.18)',
    tag: 'PERSONA AGENT',
    desc: 'The persona agent synthesizes the PRD and research into 2–3 richly detailed archetypes. Each persona has a job, a goal, a frustration, and a reason they need your product.',
    output: 'Named archetypes · Goal-frustration pairs · Quotes',
  },
  {
    icon: ListChecks, num: '04', label: 'Agile User Stories',
    color: '#34D399', glow: 'rgba(52,211,153,0.18)',
    tag: 'STORIES AGENT',
    desc: 'Every feature from the PRD is decomposed into atomic, developer-ready user stories following the "As a / I want / So that" format with acceptance criteria. Ready to paste into Jira.',
    output: '14–20 stories · Acceptance criteria · Story IDs',
  },
  {
    icon: ServerCog, num: '05', label: 'MoSCoW Prioritization',
    color: '#F97316', glow: 'rgba(249,115,22,0.18)',
    tag: 'PRIORITIZATION AGENT',
    desc: 'An AI strategist reads all user stories and classifies each as Must Have, Should Have, Could Have, or Won\'t Have — aligning scope to your MVP launch window without cutting what matters.',
    output: 'Tiered backlog · MVP scope boundary · Priority rationale',
  },
  {
    icon: Route, num: '06', label: 'Sprint Roadmap',
    color: '#FCD34D', glow: 'rgba(252,211,77,0.18)',
    tag: 'ROADMAP AGENT',
    desc: 'Stories are sequenced across four two-week sprints. Sprint 1 lays the foundation, Sprint 4 ships to production. Each sprint has a theme, a goal, and a curated set of story IDs to execute.',
    output: '4-sprint plan · Sprint themes · Delivery milestones',
  },
  {
    icon: Cpu, num: '07', label: 'Technical Architecture',
    color: '#6EE7B7', glow: 'rgba(110,231,183,0.18)',
    tag: 'ARCHITECTURE AGENT',
    desc: 'A staff-level engineer agent designs your database schema (tables, columns, relationships) and the full REST API surface (method + path + description). This is real code-ready specification.',
    output: 'DB schema · API route table · Relationship map',
  },
  {
    icon: DollarSign, num: '08', label: 'Cloud Cost Model',
    color: '#93C5FD', glow: 'rgba(147,197,253,0.18)',
    tag: 'FINOPS AGENT',
    desc: 'The FinOps agent estimates your monthly AWS/GCP infrastructure bill at three scale checkpoints — 100, 1,000, and 10,000 active users — broken down by Compute, Database, and CDN.',
    output: 'Cost breakdown · 3-tier projections · Budget guard-rails',
  },
  {
    icon: FolderGit2, num: '09', label: 'Repo Scaffolding',
    color: '#C4B5FD', glow: 'rgba(196,181,253,0.18)',
    tag: 'SCAFFOLDING AGENT',
    desc: 'Generates the exact folder structure for your monorepo — frontend, backend, infra, and CI config — plus the terminal commands to bootstrap it from zero. Clone → run → build.',
    output: 'File tree · Bootstrap commands · .env template',
  },
  {
    icon: Palette, num: '10', label: 'UI Blueprint + PDF',
    color: '#FB923C', glow: 'rgba(251,146,60,0.18)',
    tag: 'UI & EXPORT AGENT',
    desc: 'The final agent renders a live HTML/CSS prototype of your core landing page and compiles the entire 10-agent output into a polished, investor-ready 11-page PDF. One click. Zero formatting.',
    output: 'Live HTML preview · 11-page PDF · Share-ready link',
  },
]

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

// ── Pipeline Section — Cinematic Sticky Scroll ────────────────────────────────
const PipelineSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [lineHeight, setLineHeight] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const sectionTop = -rect.top
      const sectionHeight = rect.height - window.innerHeight
      if (sectionTop < 0) { setActiveIdx(0); setLineHeight(0); return }
      if (sectionTop > sectionHeight) { setActiveIdx(PIPELINE_STEPS.length - 1); setLineHeight(100); return }
      const progress = sectionTop / sectionHeight
      const idx = Math.min(Math.floor(progress * PIPELINE_STEPS.length), PIPELINE_STEPS.length - 1)
      setActiveIdx(idx)
      setLineHeight(progress * 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const active = PIPELINE_STEPS[activeIdx]

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', height: `${PIPELINE_STEPS.length * 100}vh` }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Ambient background glow that follows active agent color */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 60% 60% at 70% 50%, ${active.glow}, transparent 70%)`,
          transition: 'background 0.6s ease',
        }} />

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 48, position: 'relative', zIndex: 2 }}>
          <p className="text-gradient-silver" style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 12 }}>
            The Pipeline
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 10 }}>
            10 agents.{' '}
            <span className="text-gradient-premium">One blueprint.</span>
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-tertiary)', maxWidth: 420, margin: '0 auto', lineHeight: 1.65 }}>
            Each agent takes the output from the previous and builds upon it — a single, coherent AI workflow.
          </p>
        </div>

        {/* Main content row */}
        <div style={{
          display: 'flex',
          gap: 0,
          maxWidth: 1100,
          width: '100%',
          margin: '0 auto',
          padding: '0 24px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}>

          {/* LEFT: Timeline spine + step list */}
          <div style={{ flex: '0 0 320px', position: 'relative', paddingLeft: 36 }}>
            {/* Spine track */}
            <div style={{
              position: 'absolute', left: 10, top: 0, bottom: 0,
              width: 2, background: 'var(--border)', borderRadius: 2,
            }} />
            {/* Animated fill */}
            <div style={{
              position: 'absolute', left: 10, top: 0,
              width: 2, borderRadius: 2,
              height: `${lineHeight}%`,
              background: `linear-gradient(to bottom, ${active.color}, ${active.color}80)`,
              boxShadow: `0 0 12px ${active.color}60`,
              transition: 'height 0.08s linear, background 0.5s ease, box-shadow 0.5s ease',
            }} />

            {/* Step list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {PIPELINE_STEPS.map((step, i) => {
                const isActive = i === activeIdx
                const isPast = i < activeIdx
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '10px 0',
                    opacity: isActive ? 1 : isPast ? 0.55 : 0.3,
                    transition: 'opacity 0.3s ease',
                  }}>
                    {/* Node on spine */}
                    <div style={{
                      position: 'absolute', left: 4,
                      width: 14, height: 14, borderRadius: '50%',
                      background: isActive ? step.color : isPast ? `${step.color}60` : 'var(--bg-elevated)',
                      border: `2px solid ${isActive ? step.color : isPast ? `${step.color}40` : 'var(--border)'}`,
                      boxShadow: isActive ? `0 0 10px ${step.color}80, 0 0 20px ${step.color}40` : 'none',
                      transition: 'all 0.4s ease',
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: 11, fontFamily: 'var(--font-mono)',
                      fontWeight: 700, color: isActive ? step.color : 'var(--text-muted)',
                      letterSpacing: '0.04em', flexShrink: 0,
                      transition: 'color 0.3s ease',
                    }}>
                      {step.num}
                    </span>
                    <span style={{
                      fontSize: isActive ? 14 : 13,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                      transition: 'all 0.3s ease',
                      letterSpacing: isActive ? '-0.02em' : 0,
                    }}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT: Active agent spotlight */}
          <div style={{ flex: 1, paddingLeft: 56 }}>
            <div
              key={activeIdx}
              style={{
                background: 'var(--bg-surface)',
                border: `1px solid ${active.color}30`,
                borderRadius: 20,
                padding: '36px 40px',
                boxShadow: `0 0 0 1px ${active.color}15, 0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
                animation: 'pipelineSlideIn 0.35s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              {/* Agent tag badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: `${active.color}12`,
                border: `1px solid ${active.color}30`,
                borderRadius: 100, padding: '4px 12px', marginBottom: 22,
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: active.color,
                  boxShadow: `0 0 6px ${active.color}`,
                  animation: 'pulse 1.8s ease-in-out infinite',
                }} />
                <span style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: '0.14em',
                  color: active.color, textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {active.tag}
                </span>
              </div>

              {/* Icon + step title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: `${active.color}14`,
                  border: `1px solid ${active.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 24px ${active.color}20`,
                  flexShrink: 0,
                }}>
                  <active.icon size={24} color={active.color} strokeWidth={1.5} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '0.06em' }}>
                    STEP {active.num} / 10
                  </div>
                  <h3 style={{
                    fontSize: 26, fontWeight: 900, letterSpacing: '-0.04em',
                    color: 'var(--text-primary)', lineHeight: 1.1,
                  }}>
                    {active.label}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p style={{
                fontSize: 15, color: 'var(--text-secondary)',
                lineHeight: 1.75, marginBottom: 26,
                borderLeft: `2px solid ${active.color}35`,
                paddingLeft: 16,
              }}>
                {active.desc}
              </p>

              {/* Output pill row */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Output
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {active.output.split(' · ').map((item, i) => (
                    <span key={i} style={{
                      fontSize: 12, fontWeight: 500,
                      color: active.color,
                      background: `${active.color}0D`,
                      border: `1px solid ${active.color}25`,
                      borderRadius: 8, padding: '5px 12px',
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 4 }}>
              <div style={{ flex: 1, height: 2, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  width: `${((activeIdx + 1) / PIPELINE_STEPS.length) * 100}%`,
                  background: `linear-gradient(to right, ${active.color}, ${active.color}90)`,
                  transition: 'width 0.3s ease, background 0.5s ease',
                }} />
              </div>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', flexShrink: 0 }}>
                {activeIdx + 1} / {PIPELINE_STEPS.length}
              </span>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          opacity: activeIdx === 0 ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Scroll to explore
          </span>
          <div style={{
            width: 1, height: 28,
            background: 'linear-gradient(to bottom, var(--text-muted), transparent)',
          }} />
        </div>
      </div>
    </section>
  )
}

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

      {/* ── Pipeline — Cinematic Sticky Scroll ─────────────────────────────── */}
      <PipelineSection />

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
