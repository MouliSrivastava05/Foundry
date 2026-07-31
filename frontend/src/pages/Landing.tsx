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
      const total = el.scrollHeight - el.clientHeight
      setWidth(total > 0 ? (el.scrollTop / total) * 100 : 0)
    }
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])
  return <div className="scroll-progress-bar" style={{ width: `${width}%` }} />
}

// ── 3D Flip Counter ───────────────────────────────────────────────────────────
const FlipCounter: React.FC<{ end: number; suffix?: string }> = ({ end, suffix = '' }) => {
  const [value, setValue] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const steps = Math.min(end, 24)
        let step = 0
        const tick = () => {
          step++
          setFlipping(true)
          setTimeout(() => {
            setValue(Math.round((step / steps) * end))
            setFlipping(false)
          }, 80)
          if (step < steps) setTimeout(tick, 60 + step * 3)
        }
        tick()
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [end])

  return (
    <div ref={ref} style={{ perspective: '300px', display: 'inline-block' }}>
      <span style={{
        display: 'inline-block',
        animation: flipping ? 'flipIn 0.08s ease-out both' : 'none',
      }}>
        {value}{suffix}
      </span>
    </div>
  )
}

// ── 3D Blueprint Card Stack ───────────────────────────────────────────────────
const BlueprintScene: React.FC = () => {
  const CARD_DATA = [
    {
      label: 'research.json',
      color: '#60A5FA',
      rows: [
        { k: 'market',      v: '"$4.2B TAM"',          c: '#60A5FA' },
        { k: 'competitors', v: '["Notion", "Linear"]',  c: '#A78BFA' },
        { k: 'gap',         v: '"AI-first workflow"',   c: '#34D399' },
      ],
    },
    {
      label: 'architecture.json',
      color: '#F97316',
      rows: [
        { k: 'db_tables',  v: '["users", "projects"]', c: '#F97316' },
        { k: 'api_routes', v: '14 endpoints',           c: '#FCD34D' },
        { k: 'stack',      v: '"FastAPI + Postgres"',   c: '#6EE7B7' },
      ],
    },
    {
      label: 'roadmap.json',
      color: '#A78BFA',
      rows: [
        { k: 'sprint_1', v: '["US-001", "US-002"]',  c: '#A78BFA' },
        { k: 'sprint_2', v: '["US-003", "US-006"]',  c: '#F472B6' },
        { k: 'launch',   v: '"Week 8"',               c: '#34D399' },
      ],
    },
  ]

  // Card stack positions in 3D space
  const cards = [
    {
      data: CARD_DATA[0],
      style: {
        zIndex: 3,
        transform: 'translateZ(0px) translateX(0px) translateY(0px)',
        animation: 'float3d 7s ease-in-out infinite',
        opacity: 1,
      },
    },
    {
      data: CARD_DATA[1],
      style: {
        zIndex: 2,
        transform: 'translateZ(-40px) translateX(18px) translateY(18px)',
        animation: 'float3d 7s ease-in-out infinite 0.6s',
        opacity: 0.72,
      },
    },
    {
      data: CARD_DATA[2],
      style: {
        zIndex: 1,
        transform: 'translateZ(-80px) translateX(36px) translateY(36px)',
        animation: 'float3d-2 7s ease-in-out infinite 1.2s',
        opacity: 0.45,
      },
    },
  ]

  return (
    <div style={{
      perspective: '900px',
      perspectiveOrigin: '50% 40%',
      width: '100%',
      height: 340,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ transformStyle: 'preserve-3d', position: 'relative', width: 300, height: 220 }}>
        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              transformStyle: 'preserve-3d',
              ...card.style,
            }}
          >
            {/* Card itself */}
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: 14,
              background: 'var(--bg-elevated)',
              border: `1px solid ${card.data.color}30`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 0 0.5px ${card.data.color}20`,
              overflow: 'hidden',
              opacity: card.style.opacity,
            }}>
              {/* Card header */}
              <div style={{
                padding: '10px 14px',
                borderBottom: `1px solid ${card.data.color}20`,
                background: `${card.data.color}08`,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                {/* Traffic lights */}
                {['#EF4444','#F59E0B','#22C55E'].map((c, ci) => (
                  <span key={ci} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.7 }} />
                ))}
                <span style={{
                  fontSize: 11, fontFamily: 'monospace', fontWeight: 600,
                  color: card.data.color, marginLeft: 4,
                }}>
                  {card.data.label}
                </span>
              </div>

              {/* Card content */}
              <div style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 11.5, lineHeight: 2 }}>
                {card.data.rows.map((row, ri) => (
                  <div key={ri} style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--silver-dim)' }}>"{row.k}":</span>
                    <span style={{ color: row.c }}>{row.v}</span>
                  </div>
                ))}
                {i === 0 && (
                  <div style={{ marginTop: 10, display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span className="dot-live" />
                    <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Generated in 52s</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
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

// ── Pipeline Data ─────────────────────────────────────────────────────────────
const PIPELINE_STEPS = [
  { icon: Globe,     label: 'Research',     color: '#60A5FA', desc: 'Live competitor analysis via Tavily web search' },
  { icon: FileText,  label: 'PRD',          color: '#A78BFA', desc: 'Full product requirements document' },
  { icon: Bot,       label: 'Personas',     color: '#F472B6', desc: 'Target user archetypes & pain points' },
  { icon: Layers,    label: 'Agile Scope',  color: '#34D399', desc: 'User stories & MoSCoW prioritization' },
  { icon: Cpu,       label: 'Architecture', color: '#F97316', desc: 'Database schema & REST API design' },
  { icon: BarChart2, label: 'Roadmap',      color: '#FCD34D', desc: '4-sprint milestone delivery plan' },
  { icon: Code2,     label: 'FinOps',       color: '#6EE7B7', desc: 'Cloud cost model at 3 scale tiers' },
  { icon: GitBranch, label: 'Scaffolding',  color: '#93C5FD', desc: 'Repo structure & setup instructions' },
  { icon: Terminal,  label: 'UI Blueprint', color: '#C4B5FD', desc: 'Live HTML/CSS prototype generation' },
  { icon: Zap,       label: 'PDF Export',   color: '#F97316', desc: '11-page downloadable spec document' },
]

const TESTIMONIALS = [
  { quote: "Replaced a week of manual work. I shipped my PRD to investors the same day I had the idea.", name: "Arjun Mehta", role: "Founder, StealthAI", initials: "AM", color: "#F97316" },
  { quote: "The architecture output alone saved us $8k in consultant fees. This is what AI should be.", name: "Sofia Reyes", role: "CTO, Launchpad Labs", initials: "SR", color: "#60A5FA" },
  { quote: "Generated blueprints for three ideas in one afternoon. Picked the best and started building.", name: "Kai Tanaka", role: "Serial Entrepreneur", initials: "KT", color: "#A78BFA" },
]

// ── Typing animation ──────────────────────────────────────────────────────────
const PHRASES = ['Product Blueprint', 'Investor Deck', 'Tech Architecture', 'Go-to-Market Plan']

// ── Main Landing Component ────────────────────────────────────────────────────
export const Landing: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null)
  useScrollAnimation(pageRef)

  const [phraseIdx, setPhraseIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const phrase = PHRASES[phraseIdx]
    let t: ReturnType<typeof setTimeout>
    if (!deleting && displayed.length < phrase.length)       t = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), 60)
    else if (!deleting && displayed.length === phrase.length) t = setTimeout(() => setDeleting(true), 1800)
    else if (deleting && displayed.length > 0)              t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35)
    else { setDeleting(false); setPhraseIdx(i => (i + 1) % PHRASES.length) }
    return () => clearTimeout(t)
  }, [displayed, deleting, phraseIdx])

  return (
    <div ref={pageRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <ScrollProgress />

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10, 10, 12, 0.85)',
        backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
      }}>
        <div className="container" style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px var(--accent-glow)' }}>
              <Zap size={15} color="#000" strokeWidth={2.5} />
            </div>
            <span className="text-gradient-silver" style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.04em' }}>
              Foundry
            </span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Link to="/login" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', padding: '6px 12px', borderRadius: 8, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >Sign in</Link>
            <Link to="/signup" className="btn btn-primary" style={{ fontSize: 13, padding: '7px 16px' }}>
              Start building <ArrowRight size={13} />
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero — Split layout with 3D scene ──────────────────────────────── */}
      <section style={{ padding: '80px 24px 60px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', minHeight: 440 }}>

          {/* Left — copy */}
          <div>
            <div className="animate-fade-up" style={{ marginBottom: 24 }}>
              <span className="badge badge-accent">
                <span className="dot-live" />
                10 AI agents · generates in ~60 seconds
              </span>
            </div>

            <h1 className="animate-fade-up stagger-1 text-balance" style={{
              fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 900,
              lineHeight: 1.08, letterSpacing: '-0.04em', marginBottom: 20,
            }}>
              Turn your idea<br />into a{' '}
              <span className="text-gradient">
                {displayed}
                <span className="animate-blink" style={{ color: 'var(--accent)', marginLeft: 1 }}>|</span>
              </span>
            </h1>

            <p className="animate-fade-up stagger-2" style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32, maxWidth: 440 }}>
              Foundry orchestrates 10 specialized AI agents — from live market research to a working UI prototype — and delivers everything in one click.
            </p>

            <div className="animate-fade-up stagger-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/signup" className="btn btn-primary" style={{ fontSize: 14, padding: '12px 22px' }}>
                Build my blueprint <ArrowRight size={14} />
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ fontSize: 14, padding: '12px 22px' }}>
                Try demo
              </Link>
            </div>

            <p className="animate-fade-up stagger-4" style={{ marginTop: 20, fontSize: 12, color: 'var(--text-tertiary)' }}>
              No credit card · Free to start · PDF export included
            </p>
          </div>

          {/* Right — 3D Floating Card Stack */}
          <div className="animate-fade-in stagger-2" style={{ position: 'relative' }}>
            {/* Ambient glow behind the cards */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 260, height: 200,
              background: 'radial-gradient(ellipse, rgba(249,115,22,0.10) 0%, rgba(167,139,250,0.06) 50%, transparent 75%)',
              pointerEvents: 'none',
              filter: 'blur(30px)',
            }} />
            <BlueprintScene />
          </div>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '28px 24px', background: 'var(--bg-surface)' }}>
        <hr className="divider-metallic" style={{ marginBottom: 28 }} />
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: 64, flexWrap: 'wrap' }}>
          {[
            { value: 10, suffix: '', label: 'AI Agents' },
            { value: 60, suffix: 's', label: 'Avg. generation time' },
            { value: 11, suffix: '', label: 'Page PDF export' },
            { value: 100, suffix: '%', label: 'Self-contained output' },
          ].map((stat, i) => (
            <div key={i} className="scroll-animate" data-animate style={{ textAlign: 'center' }}>
              <div className="text-gradient-silver" style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.05em' }}>
                <FlipCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
        <hr className="divider-metallic" style={{ marginTop: 28 }} />
      </section>

      {/* ── Pipeline ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px' }}>
        <div className="container">
          <div className="scroll-animate" data-animate style={{ textAlign: 'center', marginBottom: 56 }}>
            <p className="text-gradient-silver" style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 14 }}>
              The Pipeline
            </p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 14 }}>
              10 agents. <span className="text-gradient-premium">One blueprint.</span>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
              Each agent builds on the last, creating a coherent interconnected product spec — not isolated fragments.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 12 }}>
            {PIPELINE_STEPS.map((step, i) => (
              <TiltCard
                key={i}
                data-animate
                className="scroll-animate"
                style={{ padding: '18px 20px', transitionDelay: `${i * 50}ms`, position: 'relative', overflow: 'hidden' } as React.CSSProperties}
              >
                <span style={{ position: 'absolute', top: 12, right: 14, fontSize: 11, fontWeight: 800, color: 'var(--silver-dim)', letterSpacing: '-0.02em' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${step.color}14`, border: `1px solid ${step.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <step.icon size={17} color={step.color} strokeWidth={1.75} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 5 }}>{step.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{step.desc}</div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── What you get ───────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-surface)' }}>
        <hr className="divider-metallic" style={{ marginBottom: 80 }} />
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
          <div>
            <p className="scroll-animate-left text-gradient-silver" data-animate style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 16 }}>
              What you get
            </p>
            <h2 className="scroll-animate-left delay-1" data-animate style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 900, letterSpacing: '-0.035em', marginBottom: 20, lineHeight: 1.12 }}>
              Everything to go from idea<br />to investor-ready
            </h2>
            <p className="scroll-animate-left delay-2" data-animate style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
              Not just a document — a complete, interconnected spec that a developer can build from and an investor can understand.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {['Real competitor research from live web data', 'Agile user story backlog with MoSCoW priority', 'Database schema + REST API route spec', 'Cloud cost model at 100, 1k, and 10k users', 'Downloadable 11-page PDF blueprint', 'Live HTML/CSS UI prototype preview'].map((item, i) => (
                <div key={i} className="scroll-animate-left" data-animate style={{ display: 'flex', gap: 10, alignItems: 'flex-start', transitionDelay: `${(i + 3) * 55}ms` }}>
                  <CheckCircle size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} strokeWidth={2} />
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — 3D terminal card with tilt */}
          <div className="scroll-animate-right" data-animate>
            <TiltCard style={{ overflow: 'hidden', padding: 0 }}>
              <div style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 7 }}>
                {['#EF4444','#F59E0B','#22C55E'].map((c, ci) => <span key={ci} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.75 }} />)}
                <span className="text-gradient-silver" style={{ marginLeft: 8, fontSize: 11, fontFamily: 'monospace', fontWeight: 600 }}>blueprint.json</span>
              </div>
              <div style={{ padding: '20px 22px', fontFamily: 'monospace', fontSize: 12, lineHeight: 1.85 }}>
                {[
                  { k: '"project"',      v: '"FinTrack AI"',               vc: 'var(--accent-light)' },
                  { k: '"competitors"',  v: '["Mint", "YNAB", "Copilot"]', vc: '#60A5FA' },
                  { k: '"stories"',      v: '14 items',                    vc: '#34D399' },
                  { k: '"sprint_1"',     v: '["US-001", "US-002"]',        vc: '#A78BFA' },
                  { k: '"db_tables"',    v: '["users", "transactions"]',   vc: '#F472B6' },
                  { k: '"monthly_cost"', v: '"$42 / 100 users"',           vc: '#FCD34D' },
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
          <p className="scroll-animate text-gradient-silver" data-animate style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 44 }}>
            From founders who shipped
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {TESTIMONIALS.map((t, i) => (
              <TiltCard key={i} data-animate className="scroll-animate" style={{ padding: '24px', transitionDelay: `${i * 80}ms` } as React.CSSProperties}>
                <div style={{ fontSize: 38, lineHeight: 1, color: t.color, opacity: 0.25, fontFamily: 'Georgia, serif', marginBottom: 12 }}>"</div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${t.color}1A`, border: `1px solid ${t.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: t.color }}>
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

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px' }}>
        <hr className="divider-metallic" style={{ marginBottom: 80 }} />
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <h2 className="scroll-animate" data-animate style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, letterSpacing: '-0.045em', marginBottom: 16 }}>
            Your idea deserves a <span className="text-gradient-premium">blueprint.</span>
          </h2>
          <p className="scroll-animate delay-1" data-animate style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 36 }}>
            Stop writing docs manually. Generate your complete product specification in under a minute.
          </p>
          <div className="scroll-animate delay-2" data-animate style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
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
