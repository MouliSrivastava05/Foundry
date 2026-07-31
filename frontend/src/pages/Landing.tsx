import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Terminal, Zap, GitBranch, Layers, FileText, Globe, Code2, Cpu, BarChart2, Bot, CheckCircle } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

// ── Animated counter ──────────────────────────────────────────────────────────
const Counter: React.FC<{ end: number; suffix?: string; duration?: number }> = ({
  end,
  suffix = '',
  duration = 1800,
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
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          // ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3)
          setValue(Math.round(eased * end))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return <span ref={ref}>{value}{suffix}</span>
}

// ── Pipeline step data ────────────────────────────────────────────────────────
const PIPELINE_STEPS = [
  { icon: Globe,    label: 'Research',      color: '#60A5FA', desc: 'Live competitor analysis via Tavily web search' },
  { icon: FileText, label: 'PRD',           color: '#A78BFA', desc: 'Full product requirements document' },
  { icon: Bot,      label: 'Personas',      color: '#F472B6', desc: 'Target user archetypes & pain points' },
  { icon: Layers,   label: 'Agile Scope',   color: '#34D399', desc: 'User stories & MoSCoW prioritization' },
  { icon: Cpu,      label: 'Architecture',  color: '#F97316', desc: 'Database schema & REST API design' },
  { icon: BarChart2,label: 'Roadmap',       color: '#FCD34D', desc: '4-sprint milestone delivery plan' },
  { icon: Code2,    label: 'FinOps',        color: '#6EE7B7', desc: 'Cloud cost model at 3 scale tiers' },
  { icon: GitBranch,label: 'Scaffolding',   color: '#93C5FD', desc: 'Repo structure & setup instructions' },
  { icon: Terminal, label: 'UI Blueprint',  color: '#C4B5FD', desc: 'Live HTML/CSS prototype generation' },
  { icon: Zap,      label: 'PDF Export',    color: '#F97316', desc: '11-page downloadable spec document' },
]

// ── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "Replaced a week of manual work. I shipped my PRD to investors the same day I had the idea.",
    name: "Arjun Mehta",
    role: "Founder, StealthAI",
    initials: "AM",
    color: "#F97316",
  },
  {
    quote: "The architecture output alone saved us $8k in consultant fees. This is what AI should be.",
    name: "Sofia Reyes",
    role: "CTO, Launchpad Labs",
    initials: "SR",
    color: "#60A5FA",
  },
  {
    quote: "I generated blueprints for three startup ideas in one afternoon. Picked the best one and started building.",
    name: "Kai Tanaka",
    role: "Serial Entrepreneur",
    initials: "KT",
    color: "#A78BFA",
  },
]

// ── Main Landing Component ────────────────────────────────────────────────────
export const Landing: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null)
  useScrollAnimation(pageRef)

  // Typing animation for the hero tagline
  const PHRASES = ['Product Blueprint', 'Investor Deck', 'Tech Architecture', 'Go-to-Market Plan']
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const phrase = PHRASES[phraseIdx]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting && displayed.length < phrase.length) {
      timeout = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), 60)
    } else if (!deleting && displayed.length === phrase.length) {
      timeout = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setPhraseIdx((i) => (i + 1) % PHRASES.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, phraseIdx])

  return (
    <div ref={pageRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10, 10, 12, 0.80)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}>
        <div className="container" style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px var(--accent-glow)',
            }}>
              <Zap size={15} color="#000" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              Foundry
            </span>
          </div>

          {/* Nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Link to="/login" style={{
              fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
              padding: '6px 12px', borderRadius: 8,
              transition: 'color 0.2s',
            }}
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

        {/* Eyebrow badge */}
        <div className="animate-fade-up" style={{ marginBottom: 28, display: 'flex', justifyContent: 'center' }}>
          <span className="badge badge-accent">
            <span className="dot-live" />
            10 AI agents · generates in ~60 seconds
          </span>
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-up stagger-1 text-balance"
          style={{ fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.04em', marginBottom: 24 }}
        >
          Turn your idea into a{' '}
          <br />
          <span className="text-gradient" style={{ display: 'inline-block', minWidth: '10ch' }}>
            {displayed}
            <span className="animate-blink" style={{ color: 'var(--accent)', marginLeft: 2 }}>|</span>
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="animate-fade-up stagger-2 text-balance"
          style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.65 }}
        >
          Foundry orchestrates 10 specialized AI agents in sequence — from market research to live UI prototypes — delivering a complete startup blueprint in one click.
        </p>

        {/* CTA buttons */}
        <div className="animate-fade-up stagger-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/signup" className="btn btn-primary" style={{ fontSize: 14, padding: '12px 24px' }}>
            Build my blueprint  <ArrowRight size={15} />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ fontSize: 14, padding: '12px 24px' }}>
            Try demo mode
          </Link>
        </div>

        {/* Trust line */}
        <p className="animate-fade-up stagger-4" style={{ marginTop: 28, fontSize: 12, color: 'var(--text-tertiary)' }}>
          No credit card · Free to start · PDF export included
        </p>
      </section>

      {/* ── Stats bar ──────────────────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '28px 24px', background: 'var(--bg-surface)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: 64, flexWrap: 'wrap' }}>
          {[
            { value: 10, suffix: '', label: 'AI Agents' },
            { value: 60, suffix: 's', label: 'Avg. generation time' },
            { value: 11, suffix: '', label: 'Page PDF export' },
            { value: 100, suffix: '%', label: 'Self-contained output' },
          ].map((stat, i) => (
            <div key={i} className="scroll-animate" data-animate style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 3 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pipeline Visualization ──────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px' }}>
        <div className="container">
          {/* Section label */}
          <div className="scroll-animate" data-animate style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12 }}>
              The Pipeline
            </p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 14 }}>
              10 agents. One blueprint.
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>
              Each agent in the sequence builds on the last, creating a coherent, interconnected product spec — not isolated fragments.
            </p>
          </div>

          {/* Pipeline grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {PIPELINE_STEPS.map((step, i) => (
              <div
                key={i}
                className="card scroll-animate"
                data-animate
                style={{
                  padding: '18px 20px',
                  animationDelay: `${i * 50}ms`,
                  transitionDelay: `${i * 60}ms`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Step number watermark */}
                <span style={{
                  position: 'absolute', top: 12, right: 14,
                  fontSize: 11, fontWeight: 700, color: 'var(--border-mid)',
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '-0.02em',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Icon */}
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: `${step.color}14`,
                  border: `1px solid ${step.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 14,
                }}>
                  <step.icon size={17} color={step.color} strokeWidth={1.75} />
                </div>

                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 5 }}>
                  {step.label}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What you get section ────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>

          {/* Left — text */}
          <div>
            <p className="scroll-animate" data-animate style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 16 }}>
              What you get
            </p>
            <h2 className="scroll-animate delay-1" data-animate style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20, lineHeight: 1.15 }}>
              Everything to go from idea to investor-ready
            </h2>
            <p className="scroll-animate delay-2" data-animate style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
              Not just a document. A complete, interconnected spec that a developer can build from and an investor can understand.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Real competitor research from live web data',
                'Agile user story backlog with MoSCoW priority',
                'Database schema + REST API route spec',
                'Cloud cost model at 100, 1k, and 10k users',
                'Downloadable 11-page PDF blueprint',
                'Live HTML/CSS UI prototype preview',
              ].map((item, i) => (
                <div key={i} className="scroll-animate" data-animate style={{ display: 'flex', gap: 10, alignItems: 'flex-start', transitionDelay: `${i * 60}ms` }}>
                  <CheckCircle size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} strokeWidth={2} />
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — faux output card */}
          <div className="scroll-animate" data-animate>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Card header — terminal bar */}
              <div style={{
                background: 'var(--bg-elevated)',
                borderBottom: '1px solid var(--border)',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444', opacity: 0.7 }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B', opacity: 0.7 }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22C55E', opacity: 0.7 }} />
                <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                  blueprint.json
                </span>
              </div>

              {/* Faux JSON preview */}
              <div style={{ padding: '20px 22px', fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.8 }}>
                {[
                  { k: '"project"',     v: '"FinTrack AI"',     vc: 'var(--accent-light)' },
                  { k: '"competitors"', v: '["Mint", "YNAB"]',  vc: '#60A5FA' },
                  { k: '"stories"',     v: '14 items',          vc: '#34D399' },
                  { k: '"sprint_1"',    v: '["US-001", "US-002", "US-004"]', vc: '#A78BFA' },
                  { k: '"db_tables"',   v: '["users", "transactions"]',      vc: '#F472B6' },
                  { k: '"monthly_cost"',v: '"$42 / 100 users"', vc: '#FCD34D' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>{row.k}:</span>
                    <span style={{ color: row.vc }}>{row.v}</span>
                  </div>
                ))}
                <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div className="dot-live" />
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Generated in 52s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container">
          <p className="scroll-animate" data-animate style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: 'var(--accent)', textTransform: 'uppercase', textAlign: 'center', marginBottom: 40 }}>
            From founders who shipped
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card scroll-animate" data-animate style={{ padding: '24px', transitionDelay: `${i * 80}ms` }}>
                {/* Quote mark */}
                <div style={{ fontSize: 40, lineHeight: 1, color: t.color, opacity: 0.3, fontFamily: 'Georgia, serif', marginBottom: 12 }}>"</div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: `${t.color}22`,
                    border: `1px solid ${t.color}40`,
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid var(--border)' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <h2 className="scroll-animate" data-animate style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 16 }}>
            Your idea deserves a blueprint.
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
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border)',
        padding: '28px 24px',
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={11} color="#000" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Foundry AI</span>
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
