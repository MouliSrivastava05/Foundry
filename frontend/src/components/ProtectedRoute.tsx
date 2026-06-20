import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent"></div>
          <p className="text-sm font-medium text-slate-400">Loading Foundry...</p>
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
