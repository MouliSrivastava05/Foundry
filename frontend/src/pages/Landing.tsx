import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Sparkles, 
  ArrowRight, 
  Bot, 
  Layers, 
  FileText, 
  Cpu, 
  Code2, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Globe 
} from 'lucide-react'

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090912] text-slate-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden">
      
      {/* ── Background Glows ────────────────────────────────────────────── */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-purple-900/20 via-indigo-900/20 to-blue-900/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/10 blur-[140px] pointer-events-none rounded-full" />

      {/* ── Navigation Header ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-800/80 bg-[#090912]/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">Foundry AI</span>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 transition"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl transition shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
            >
              Get Started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 px-6 max-w-5xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium">
          <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
          <span>Next-Gen Autonomous Startup Architect</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
          Turn your idea into a <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-200 bg-clip-text text-transparent">
            Complete Product Blueprint
          </span>
        </h1>

        <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Foundry AI orchestrates 10 specialized AI agents to generate competitor research, PRDs, user personas, agile stories, tech architecture, scaling budgets, project scaffolding, and live UI mockups in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            to="/signup" 
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-semibold text-sm text-white transition shadow-xl shadow-purple-600/25 flex items-center justify-center gap-2"
          >
            Build Your Blueprint <ArrowRight className="h-4 w-4" />
          </Link>
          <Link 
            to="/login" 
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 font-semibold text-sm text-slate-300 transition flex items-center justify-center gap-2"
          >
            Explore Demo Mode
          </Link>
        </div>
      </section>

      {/* ── Agent Pipeline Cards Section ─────────────────────────────────── */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400">10 Autonomous Agents</h2>
          <p className="text-2xl md:text-3xl font-bold text-white">Multi-Agent Sequential Intelligence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3 hover:border-slate-700 transition">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">01. Web Research Agent</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scrapes real-time web data via Tavily to analyze real market competitors, landscape trends, and opportunity gaps.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3 hover:border-slate-700 transition">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">02. PRD & UX Personas</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drafts a comprehensive Product Requirements Document and creates target user personas with goals & pain points.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3 hover:border-slate-700 transition">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">03. Agile Scope & Prioritization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Formulates user stories and organizes them using MoSCoW prioritization across a 4-sprint milestone roadmap.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3 hover:border-slate-700 transition">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">04. Tech Architecture</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designs database tables, column attributes, and core REST API route specifications for developer handoff.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3 hover:border-slate-700 transition">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">05. FinOps & Scaffolding</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Models cloud costs at 100, 1k, and 10k users while generating copyable repository folder tree layouts.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3 hover:border-slate-700 transition">
            <div className="h-10 w-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">06. UI Blueprint & PDF Export</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates a live HTML/CSS landing page preview alongside a downloadable 11-page PDF product spec bundle.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="py-16 px-6 max-w-5xl mx-auto w-full">
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-900/20 to-slate-900/60 p-10 text-center space-y-6 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-purple-500/10 rounded-full blur-2xl" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Ready to Architect Your Next Startup?</h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Stop spending weeks writing PRDs and specs manually. Let Foundry AI generate your complete product blueprint in minutes.
          </p>
          <div>
            <Link 
              to="/signup" 
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-semibold text-sm text-white transition shadow-xl shadow-purple-600/30"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Foundry AI. All rights reserved.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <span>LangGraph Engine</span>
            <span>·</span>
            <span>FastAPI Backend</span>
            <span>·</span>
            <span>React & Vite</span>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default Landing
