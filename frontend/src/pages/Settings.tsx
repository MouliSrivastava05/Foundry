import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Key, Lock, User, Save, AlertCircle } from 'lucide-react'
import { useAuth } from '../store/AuthContext'
import { updateProfile, updatePassword } from '../services/api'

export const Settings: React.FC = () => {
  const { user, setUserProfile } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile')

  // Profile Form State
  const [name, setName] = useState(user?.name || '')
  const [groqKey, setGroqKey] = useState(user?.groq_api_key || '')
  const [tavilyKey, setTavilyKey] = useState(user?.tavily_api_key || '')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [securitySaving, setSecuritySaving] = useState(false)
  const [securityMessage, setSecurityMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSaving(true)
    setProfileMessage(null)
    try {
      const updatedUser = await updateProfile({
        name,
        groq_api_key: groqKey || undefined,
        tavily_api_key: tavilyKey || undefined,
      })
      setUserProfile(updatedUser)
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (err: any) {
      setProfileMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to update profile.' })
    } finally {
      setProfileSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSecuritySaving(true)
    setSecurityMessage(null)
    
    if (newPassword !== confirmPassword) {
      setSecurityMessage({ type: 'error', text: 'New passwords do not match.' })
      setSecuritySaving(false)
      return
    }

    try {
      await updatePassword({
        current_password: currentPassword,
        new_password: newPassword,
      })
      setSecurityMessage({ type: 'success', text: 'Password updated successfully!' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setSecurityMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to update password.' })
    } finally {
      setSecuritySaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30">
      <div className="max-w-4xl mx-auto py-12 px-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl transition border border-slate-800"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
            <p className="text-sm text-slate-500">Manage your profile, custom API keys, and security preferences.</p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Tabs Sidebar */}
          <div className="w-full md:w-64 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                activeTab === 'profile' 
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
              }`}
            >
              <User className="w-4 h-4" />
              Profile & API Keys
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                activeTab === 'security' 
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Lock className="w-4 h-4" />
              Account Security
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800 p-8 shadow-xl backdrop-blur-sm">
            
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">Profile Details</h2>
                  <p className="text-sm text-slate-500 mb-4">Update your basic account information.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full bg-slate-950/50 border border-slate-800/50 rounded-xl px-4 py-2.5 text-slate-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-slate-500 mt-1.5 ml-1">Email address cannot be changed.</p>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-800/50 my-8"></div>

                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">Custom API Keys</h2>
                  <p className="text-sm text-slate-500 mb-4">
                    Bring your own API keys to bypass platform rate limits. Your keys are stored securely.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-2">
                        <Key className="w-3.5 h-3.5 text-orange-400" />
                        Groq API Key
                      </label>
                      <input
                        type="password"
                        value={groqKey}
                        onChange={(e) => setGroqKey(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        placeholder="gsk_..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-2">
                        <Key className="w-3.5 h-3.5 text-blue-400" />
                        Tavily API Key
                      </label>
                      <input
                        type="password"
                        value={tavilyKey}
                        onChange={(e) => setTavilyKey(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="tvly-..."
                      />
                    </div>
                  </div>
                </div>

                {profileMessage && (
                  <div className={`p-4 rounded-xl flex items-start gap-3 text-sm ${profileMessage.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="mt-0.5">{profileMessage.text}</p>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {profileSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">Update Password</h2>
                  <p className="text-sm text-slate-500 mb-4">Ensure your account is using a long, random password to stay secure.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1.5">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1.5">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        required
                        minLength={6}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1.5">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>

                {securityMessage && (
                  <div className={`p-4 rounded-xl flex items-start gap-3 text-sm ${securityMessage.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="mt-0.5">{securityMessage.text}</p>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={securitySaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {securitySaving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
