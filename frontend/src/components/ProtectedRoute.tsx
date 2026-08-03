import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { Zap } from 'lucide-react'

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-t-2 border-amber-500/80 border-r-2 border-r-transparent border-b-2 border-b-amber-500/20 border-l-2 border-l-transparent animate-spin" style={{ animationDuration: '1.2s' }}></div>
            <div className="absolute inset-2 rounded-full border-t-2 border-transparent border-r-2 border-r-amber-400/60 border-b-2 border-transparent border-l-2 border-l-amber-400/20 animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}></div>
            <Zap className="h-5 w-5 text-amber-400 animate-pulse" />
          </div>
          <p className="text-sm font-semibold tracking-widest text-slate-400 uppercase">Authenticating...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
export default ProtectedRoute
