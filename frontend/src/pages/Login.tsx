import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Zap, CheckCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '../store/AuthContext'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login, enableDemoMode } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.detail || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = () => {
    enableDemoMode()
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* ── Left Side: Product Showcase ─────────────────────────────────── */}
      <div style={{
        flex: 1,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '64px',
        position: 'relative',
        overflow: 'hidden'
      }} className="hidden md:flex">
        
        {/* Abstract pattern */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(249, 115, 22, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 440, margin: '0 auto', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={14} color="#000" strokeWidth={2.5} />
            </div>
            <span className="text-gradient-silver" style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.04em' }}>
              Foundry
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(28px, 3vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 24 }}>
            Sign in to your workspace
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 40 }}>
            Access your startup blueprints, orchestration pipelines, and live prototypes.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              'Resume interrupted agent pipelines',
              'Download full PDF specs',
              'Access live HTML/CSS UI previews',
              'Manage your API keys securely'
            ].map((feature, i) => (
              <div key={i} className="animate-fade-up" style={{ display: 'flex', gap: 12, alignItems: 'center', animationDelay: `${i * 100}ms` }}>
                <CheckCircle size={18} color="var(--accent)" strokeWidth={2.5} />
                <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Side: Auth Form ───────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '32px',
        background: 'var(--bg-base)'
      }}>
        <div style={{ width: '100%', maxWidth: 360, margin: '0 auto' }}>
          
          {/* Mobile Logo */}
          <div className="md:hidden" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, justifyContent: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={16} color="#000" strokeWidth={2.5} />
            </div>
            <span className="text-gradient-silver" style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.04em' }}>
              Foundry
            </span>
          </div>

          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>Welcome back</h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Enter your credentials to continue</p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#EF4444',
              padding: '12px 16px',
              borderRadius: 'var(--radius)',
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 24
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@company.com"
                style={{ background: 'var(--bg-surface)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                  Password
                </label>
                <a href="#" style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                style={{ background: 'var(--bg-surface)' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 8, padding: '12px', fontSize: 14 }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <hr className="divider-metallic" style={{ flex: 1 }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Or continue with
            </span>
            <hr className="divider-metallic" style={{ flex: 1 }} />
          </div>

          <button
            onClick={handleDemo}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '12px', fontSize: 14 }}
          >
            Try Demo Mode
          </button>

          <p style={{ marginTop: 32, textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              Sign up <ArrowRight size={12} style={{ display: 'inline', marginBottom: 2 }} />
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
