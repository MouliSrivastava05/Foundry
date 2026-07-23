import React, { useState, useEffect } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { BlueprintPDF } from '../components/BlueprintPDF'
import { useAuth } from '../store/AuthContext'
import { api } from '../services/api'
import { demoProjects } from '../utils/demoData'
import type { DemoProject } from '../utils/demoData'
import { 
  LogOut, 
  Plus, 
  Briefcase, 
  Activity, 
  FileText, 
  Users, 
  ListTodo, 
  Play, 
  Database,
  Sparkles,
  Info,
  CheckCircle2,
  FileDown,
  Search,
  Code,
  Milestone,
  Coins,
  FolderOpen,
  Monitor,
  ExternalLink
} from 'lucide-react'


export const Dashboard: React.FC = () => {
  const { user, logout, isDemo } = useAuth()
  
  // Projects state
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<any | null>(null)
  
  // UI States
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newIdea, setNewIdea] = useState('')
  const [newIndustry, setNewIndustry] = useState('')
  
  // Pipeline Simulation States
  const [pipelineStep, setPipelineStep] = useState<number>(-1) // -1: not started, 0-4: steps, 5: complete
  const [pipelineProgress, setPipelineProgress] = useState(0)
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'research' | 'prd' | 'personas' | 'stories' | 'prioritization' | 'architecture' | 'roadmap' | 'cost' | 'scaffolding'>('research')

  // Load projects
  const fetchProjects = async () => {
    if (isDemo) {
      setProjects(demoProjects)
      return
    }
    try {
      const response = await api.get('/projects')
      setProjects(response.data)
    } catch (err) {
      console.error('Failed to fetch projects', err)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [isDemo])

  const [realOutputs, setRealOutputs] = useState<any>(null)

  // Format DB outputs into expected frontend structure
  const processOutputs = (dbOutputs: any[]) => {
    const formatted: any = {
      research: null,
      prd: null,
      personas: [],
      userStories: [],
      prioritization: { mustHave: [], shouldHave: [], couldHave: [] },
      architecture: null,
      roadmap: null,
      costEstimate: null,
      scaffolding: null
    }
    
    if (!dbOutputs || dbOutputs.length === 0) return formatted
    
    const latestVersion = Math.max(...dbOutputs.map(o => o.version))
    const latestOutputs = dbOutputs.filter(o => o.version === latestVersion)
    
    for (const output of latestOutputs) {
      const parsed = output.parsed_output
      if (output.agent_name === 'Research_Agent') {
        formatted.research = parsed
      } else if (output.agent_name === 'PRD_Agent') {
        formatted.prd = parsed
      } else if (output.agent_name === 'Persona_Agent') {
        formatted.personas = parsed.personas || []
      } else if (output.agent_name === 'Story_Agent') {
        formatted.userStories = parsed.stories || []
      } else if (output.agent_name === 'Prioritization_Agent') {
        formatted.prioritization = {
          mustHave: parsed.must_have || parsed.mustHave || [],
          shouldHave: parsed.should_have || parsed.shouldHave || [],
          couldHave: parsed.could_have || parsed.couldHave || []
        }
      } else if (output.agent_name === 'Architect_Agent') {
        formatted.architecture = parsed
      } else if (output.agent_name === 'Roadmap_Agent') {
        formatted.roadmap = parsed
      } else if (output.agent_name === 'Cost_Agent') {
        formatted.costEstimate = parsed
      } else if (output.agent_name === 'Scaffolding_Agent') {
        formatted.scaffolding = parsed
      } else if (output.agent_name === 'UI_Agent') {
        formatted.ui = parsed
      }
    }
    return formatted
  }

  // Select project
  const handleSelectProject = async (project: any) => {
    setSelectedProject(project)
    setRealOutputs(null)
    
    if (isDemo) {
      setPipelineStep(-1)
      setPipelineProgress(0)
      setPipelineLogs([])
      setActiveTab('prd')
      return
    }

    setActiveTab('research')
    // Live mode project selection logic
    if (project.status === 'completed') {
      setPipelineStep(5)
      setPipelineProgress(100)
      setPipelineLogs(['✅ [SYS] Scaffolding pipeline executed successfully. Blueprint cached.'])
      try {
        const outRes = await api.get(`/projects/${project.id}/outputs`)
        setRealOutputs(processOutputs(outRes.data))
      } catch (err) {
        console.error('Failed to fetch project outputs', err)
      }
    } else if (project.status === 'processing') {
      setPipelineStep(0)
      setPipelineProgress(10)
      setPipelineLogs(['[SYS] Resuming active AI pipeline task monitoring...', '[SYS] Querying current agent logs...'])
    } else if (project.status === 'failed') {
      setPipelineStep(-2)
      setPipelineProgress(0)
      setPipelineLogs(['❌ [SYS] AI orchestrator execution failed. Please verify API configurations.'])
    } else {
      setPipelineStep(-1)
      setPipelineProgress(0)
      setPipelineLogs([])
    }
  }

  // Create Project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isDemo) {
      // Simulate project creation in Demo Mode
      const newProj: DemoProject = {
        id: -Date.now(),
        title: newTitle,
        idea: newIdea,
        industry: newIndustry || 'General',
        version: 1,
        created_at: new Date().toISOString(),
        outputs: {
          prd: {
            title: `${newTitle} PRD`,
            version: '1.0.0',
            summary: `Product requirements for ${newTitle} based on the idea: ${newIdea}`,
            features: [
              { name: 'Core MVP Architecture', description: 'Basic setup to validate core business value.' },
              { name: 'Client Onboarding Flow', description: 'Streamlined authentication and setup.' }
            ]
          },
          personas: [
            { name: 'Primary Persona', role: 'Target User', frustration: 'Current manual workflows are time-consuming and error-prone.', goal: 'Automate repetitive tasks to save hours every day.' }
          ],
          userStories: [
            { id: 'US-001', title: 'User Scaffolding', description: 'As a user, I want to create a new profile so I can save my data.' }
          ],
          prioritization: {
            mustHave: ['US-001'],
            shouldHave: [],
            couldHave: []
          }
        }
      }
      setProjects([newProj, ...projects])
      setSelectedProject(newProj)
      setShowCreateModal(false)
      resetForm()
      return
    }

    try {
      const response = await api.post('/projects', {
        title: newTitle,
        idea: newIdea,
        industry: newIndustry || null
      })
      setProjects([response.data, ...projects])
      setSelectedProject(response.data)
      setShowCreateModal(false)
      resetForm()
    } catch (err) {
      console.error('Failed to create project', err)
      alert('Error creating project')
    }
  }

  const resetForm = () => {
    setNewTitle('')
    setNewIdea('')
    setNewIndustry('')
  }

  // Pipeline Simulation Trigger (Demo Mode) & Real Trigger (Live Mode)
  const runPipeline = async () => {
    if (isDemo) {
      setPipelineStep(0)
      setPipelineProgress(5)
      setPipelineLogs(['[SYS] Initializing multi-agent orchestrator DAG...', '[SYS] Loading grounding schemas...'])
      return
    }

    try {
      setPipelineLogs(['[SYS] Contacting celery backend task runner...', '[SYS] Spawning LangGraph workflow DAG...'])
      setPipelineStep(0)
      setPipelineProgress(10)
      
      await api.post(`/projects/${selectedProject.id}/run`)
      
      const updatedProject = { ...selectedProject, status: 'processing' }
      setSelectedProject(updatedProject)
      setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p))
    } catch (err) {
      console.error('Failed to run AI pipeline', err)
      setPipelineStep(-2)
      setPipelineLogs(['❌ [SYS] Failed to trigger backend. Check Redis/Celery worker status.'])
      alert('Error triggering pipeline run. Please verify that your backend workers and Redis are running.')
    }
  }

  // Polling hook for live mode
  useEffect(() => {
    if (isDemo || !selectedProject || selectedProject.id < 0) return
    if (selectedProject.status !== 'processing' && pipelineStep < 0) return

    let intervalId: any = null

    const pollProjectStatus = async () => {
      try {
        const projRes = await api.get(`/projects/${selectedProject.id}`)
        const currentProject = projRes.data
        
        const outRes = await api.get(`/projects/${selectedProject.id}/outputs`)
        const formatted = processOutputs(outRes.data)
        setRealOutputs(formatted)

        const logs = ['[SYS] Initializing multi-agent orchestrator DAG...', '[SYS] Loading grounding schemas...']
        let step = 0
        let progress = 10

        if (formatted.research) {
          logs.push('🔍 [Market Scoper] Competitor research scraped and compiled successfully.')
          step = 1
          progress = 25
        } else {
          logs.push('🔍 [Market Scoper] Scraping competitor trends and opportunity gaps...')
        }

        if (formatted.prd) {
          logs.push('📝 [PRD Architect] PRD Specs generated successfully.')
          step = 2
          progress = 40
        } else if (formatted.research) {
          logs.push('📝 [PRD Architect] Scoping technical specification documents and core features...')
        }

        if (formatted.personas && formatted.personas.length > 0) {
          logs.push('👥 [Persona Agent] User personas simulated successfully.')
          step = 3
          progress = 55
        } else if (formatted.prd) {
          logs.push('👥 [Persona Agent] Simulating customer behavior archetypes and goals...')
        }

        if (formatted.userStories && formatted.userStories.length > 0) {
          logs.push('🎯 [Story Writer] Agile user stories generated successfully.')
          step = 4
          progress = 70
        } else if (formatted.personas && formatted.personas.length > 0) {
          logs.push('🎯 [Story Writer] Writing epic user stories and validation acceptance criteria...')
        }

        if (formatted.prioritization && formatted.prioritization.mustHave.length > 0) {
          logs.push('⚡ [Prioritization Agent] Sprint priorities and MoSCoW score matrices resolved.')
          step = 5
          progress = 80
        } else if (formatted.userStories && formatted.userStories.length > 0) {
          logs.push('⚡ [Prioritization Agent] Calculating priority scores and sprint milestones...')
        }

        if (formatted.architecture) {
          logs.push('💻 [System Architect] Database designs and API endpoint routes structured.')
          step = 6
          progress = 90
        } else if (formatted.prioritization && formatted.prioritization.mustHave.length > 0) {
          logs.push('💻 [System Architect] Modeling DB schemas and REST endpoint routes...')
        }

        if (formatted.roadmap) {
          logs.push('📅 [Sprint planner] Sequences and dependencies mapped to 4-sprint roadmap.')
          step = 7
          progress = 95
        } else if (formatted.architecture) {
          logs.push('📅 [Sprint planner] Generating product release roadmap and task distributions...')
        }

        if (formatted.costEstimate && formatted.scaffolding) {
          logs.push('🪙 [FinOps Estimator] Scaling costs calculated for 100, 1k, and 10k users.')
          logs.push('📂 [Code Scaffolder] Ascii repository file trees and setup scripts drafted.')
          step = 8
          progress = 98
        } else if (formatted.roadmap) {
          logs.push('🪙 [FinOps Estimator] Running compute, database, and CDN pricing simulations...')
          logs.push('📂 [Code Scaffolder] Compiling directory structure layouts and instructions...')
        }

        if (currentProject.status === 'completed') {
          logs.push('✅ [SYS] Scaffolding pipeline executed successfully. Blueprint cached.')
          step = 9
          progress = 100
          clearInterval(intervalId)
          setProjects(prev => prev.map(p => p.id === currentProject.id ? currentProject : p))
          setSelectedProject(currentProject)
        } else if (currentProject.status === 'failed') {
          logs.push('❌ [SYS] AI orchestrator execution failed. Please verify API configurations.')
          step = -2
          progress = 0
          clearInterval(intervalId)
          setProjects(prev => prev.map(p => p.id === currentProject.id ? currentProject : p))
          setSelectedProject(currentProject)
        }

        setPipelineLogs(logs)
        setPipelineProgress(progress)
        setPipelineStep(step)
      } catch (err) {
        console.error('Error polling project status', err)
      }
    }

    pollProjectStatus()
    intervalId = setInterval(pollProjectStatus, 3000)

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [selectedProject?.id, selectedProject?.status, isDemo])

  // Simulation runner effect (Demo Mode only)
  useEffect(() => {
    if (!isDemo || pipelineStep < 0 || pipelineStep >= 5) return

    const stepDuration = 2000
    const steps = [
      { log: '🔍 [Market Scoper] Scraping sector trends and competitor indices...', progress: 20 },
      { log: '📝 [PRD Architect] Scoping technical specification documents and core features...', progress: 45 },
      { log: '👥 [Persona Agent] Simulating customer behavior archetypes and goals...', progress: 65 },
      { log: '🎯 [Story Writer] Writing epic user stories and validation acceptance criteria...', progress: 85 },
      { log: '⚡ [Prioritization Agent] Calculating priority scores and sprint milestones...', progress: 100 }
    ]

    const timer = setTimeout(() => {
      const current = steps[pipelineStep]
      setPipelineLogs(prev => [...prev, current.log])
      setPipelineProgress(current.progress)
      
      if (pipelineStep === 4) {
        setTimeout(() => {
          setPipelineLogs(prev => [...prev, '✅ [SYS] Scaffolding pipeline executed successfully. Blueprint cached.'])
          setPipelineStep(5)
        }, 1000)
      } else {
        setPipelineStep(prev => prev + 1)
      }
    }, stepDuration)

    return () => clearTimeout(timer)
  }, [pipelineStep, isDemo])

  const outputs = isDemo ? selectedProject?.outputs : realOutputs;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-80 border-r border-slate-900 bg-slate-900/30 flex flex-col justify-between">
        <div>
          {/* Logo / Header */}
          <div className="p-6 flex items-center justify-between border-b border-slate-900">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-500 animate-pulse" />
              <h1 className="text-xl font-bold tracking-tight text-white">Foundry</h1>
            </div>
            {isDemo ? (
              <span className="rounded-full bg-purple-500/10 border border-purple-500/30 px-2.5 py-0.5 text-xs font-semibold text-purple-400 flex items-center gap-1">
                Demo Mode
              </span>
            ) : (
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <Database className="h-3 w-3" /> Live DB
              </span>
            )}
          </div>

          {/* New Project Button */}
          <div className="p-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 active:scale-95"
            >
              <Plus className="h-4 w-4" /> New Project Blueprint
            </button>
          </div>

          {/* Project List */}
          <nav className="px-4 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Projects</h3>
            {projects.length === 0 ? (
              <div className="px-3 py-4 text-sm text-slate-500 text-center italic">
                No project blueprints yet. Create one!
              </div>
            ) : (
              projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectProject(p)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition flex items-start gap-3 ${
                    selectedProject?.id === p.id 
                      ? 'bg-purple-500/10 border border-purple-500/20 text-purple-300' 
                      : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                  }`}
                >
                  <Briefcase className="h-4 w-4 mt-0.5 shrink-0" />
                  <div className="overflow-hidden">
                    <p className="font-semibold truncate">{p.title}</p>
                    <p className="text-xs text-slate-500 truncate">{p.industry || 'General'}</p>
                  </div>
                </button>
              ))
            )}
          </nav>
        </div>

        {/* User Footer info */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/40 flex items-center justify-between">
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User Account'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-red-400 transition rounded-lg hover:bg-red-500/5"
            title="Log Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        {selectedProject ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Project Header */}
            <header className="px-8 py-5 border-b border-slate-900 bg-slate-900/10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedProject.title}</h2>
                <p className="text-sm text-slate-400">
                  <span className="font-semibold text-purple-400">Industry:</span> {selectedProject.industry || 'General'} 
                  <span className="mx-2 text-slate-700">|</span> 
                  <span className="font-semibold text-purple-400">Version:</span> v{selectedProject.version}
                </p>
              </div>

              {pipelineStep === -1 && (
                <button
                  onClick={runPipeline}
                  className="flex items-center gap-2 rounded-xl bg-purple-600/10 border border-purple-500/40 px-4 py-2 text-sm font-semibold text-purple-300 transition hover:bg-purple-600/25 active:scale-95"
                >
                  <Play className="h-4 w-4 fill-purple-300" /> Run AI Strategist Workflow
                </button>
              )}
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8">
              {/* If Pipeline is running, completed or failed */}
              {(pipelineStep >= 0 && pipelineStep < 5) || pipelineStep === -2 ? (
                /* RUNNING / ERROR STATUS VIEW */
                <div className="max-w-3xl mx-auto space-y-8 py-12">
                  <div className="text-center space-y-3">
                    {pipelineStep === -2 ? (
                      <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 mx-auto flex items-center justify-center font-bold text-2xl">⚠️</div>
                    ) : (
                      <Activity className="h-10 w-10 text-purple-500 animate-spin mx-auto" />
                    )}
                    <h3 className="text-xl font-bold text-white">
                      {pipelineStep === -2 ? "Pipeline Execution Failed" : "Orchestrating AI Workflow Agents"}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {pipelineStep === -2 
                        ? "An error occurred while compiling your product specs blueprint. Check console and env settings." 
                        : "Building comprehensive product specification scaffolding..."}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  {pipelineStep !== -2 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold text-slate-400">
                        <span>Analyzing Concept</span>
                        <span>{pipelineProgress}% Complete</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500" 
                          style={{ width: `${pipelineProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* High Fidelity Logs Console */}
                  <div className="rounded-xl border border-slate-900 bg-black/50 p-5 font-mono text-xs text-purple-300 space-y-1.5 shadow-inner max-h-72 overflow-y-auto">
                    {pipelineLogs.map((log, i) => (
                      <p key={i} className={
                        log.startsWith('✅') ? 'text-emerald-400 font-semibold' : 
                        log.startsWith('❌') ? 'text-red-400 font-semibold' : ''
                      }>{log}</p>
                    ))}
                  </div>
                </div>
              ) : pipelineStep === (isDemo ? 5 : 9) ? (
                /* WORKFLOW RESULTS DISPLAY */
                <div className="space-y-6 animate-fadeIn">
                  {/* Info panel */}
                  <div className="rounded-xl border border-purple-500/10 bg-purple-500/5 p-4 flex items-start gap-3">
                    <Info className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-purple-300">
                        {isDemo ? "Phase 1 Blueprint Generated" : "Orchestrated Blueprint Generated"}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {isDemo 
                          ? "This blueprint was calculated locally by the mock AI pipeline. In the upcoming phases, the full pipeline will run via Redis & Celery."
                          : "This blueprint was calculated asynchronously by your live backend LangGraph nodes and stored in PostgreSQL."}
                      </p>
                    </div>
                  </div>

                  {/* Tab Navigation */}
                  <div className="border-b border-slate-900 flex flex-wrap justify-between items-center gap-3">
                    <div className="flex flex-wrap gap-1">
                      {!isDemo && (
                        <button
                          onClick={() => setActiveTab('research')}
                          className={`pb-3 px-2 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                            activeTab === 'research' 
                              ? 'border-purple-500 text-purple-400' 
                              : 'border-transparent text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <Search className="h-4 w-4" /> Competitors
                        </button>
                      )}
                      
                      <button
                        onClick={() => setActiveTab('prd')}
                        className={`pb-3 px-2 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                          activeTab === 'prd' 
                            ? 'border-purple-500 text-purple-400' 
                            : 'border-transparent text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <FileText className="h-4 w-4" /> PRD Spec
                      </button>

                      <button
                        onClick={() => setActiveTab('personas')}
                        className={`pb-3 px-2 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                          activeTab === 'personas' 
                            ? 'border-purple-500 text-purple-400' 
                            : 'border-transparent text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <Users className="h-4 w-4" /> User Personas
                      </button>

                      <button
                        onClick={() => setActiveTab('stories')}
                        className={`pb-3 px-2 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                          activeTab === 'stories' 
                            ? 'border-purple-500 text-purple-400' 
                            : 'border-transparent text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <ListTodo className="h-4 w-4" /> User Stories
                      </button>

                      <button
                        onClick={() => setActiveTab('prioritization')}
                        className={`pb-3 px-2 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                          activeTab === 'prioritization' 
                            ? 'border-purple-500 text-purple-400' 
                            : 'border-transparent text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" /> Prioritization
                      </button>

                      {!isDemo && (
                        <>
                          <button
                            onClick={() => setActiveTab('architecture')}
                            className={`pb-3 px-2 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                              activeTab === 'architecture' 
                                ? 'border-purple-500 text-purple-400' 
                                : 'border-transparent text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <Code className="h-4 w-4" /> Architecture
                          </button>
                          
                          <button
                            onClick={() => setActiveTab('roadmap')}
                            className={`pb-3 px-2 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                              activeTab === 'roadmap' 
                                ? 'border-purple-500 text-purple-400' 
                                : 'border-transparent text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <Milestone className="h-4 w-4" /> Roadmap
                          </button>

                          <button
                            onClick={() => setActiveTab('cost')}
                            className={`pb-3 px-2 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                              activeTab === 'cost' 
                                ? 'border-purple-500 text-purple-400' 
                                : 'border-transparent text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <Coins className="h-4 w-4" /> Scaling Costs
                          </button>

                          <button
                            onClick={() => setActiveTab('scaffolding')}
                            className={`pb-3 px-2 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                              activeTab === 'scaffolding' 
                                ? 'border-purple-500 text-purple-400' 
                                : 'border-transparent text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <FolderOpen className="h-4 w-4" /> Scaffolding
                          </button>

                          <button
                            onClick={() => setActiveTab('ui')}
                            className={`pb-3 px-2 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                              activeTab === 'ui' 
                                ? 'border-purple-500 text-purple-400' 
                                : 'border-transparent text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <Monitor className="h-4 w-4" /> UI Preview
                          </button>
                        </>
                      )}
                    </div>

                    {outputs && (
                      <PDFDownloadLink
                        document={
                          <BlueprintPDF
                            projectTitle={selectedProject?.title ?? 'Blueprint'}
                            industry={selectedProject?.industry}
                            idea={selectedProject?.idea ?? ''}
                            outputs={outputs}
                          />
                        }
                        fileName={`${(selectedProject?.title ?? 'blueprint').toLowerCase().replace(/\s+/g, '-')}-foundry-blueprint.pdf`}
                        className="mb-2 text-xs bg-violet-700 hover:bg-violet-600 text-white transition px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium"
                      >
                        {({ loading }) => (
                          <>
                            <FileDown className="h-3.5 w-3.5" />
                            {loading ? 'Preparing PDF…' : 'Export Specs'}
                          </>
                        )}
                      </PDFDownloadLink>
                    )}
                  </div>

                  {/* Tab Panels */}
                  <div className="py-4">
                    {activeTab === 'research' && outputs?.research && (
                      <div className="space-y-6 max-w-4xl animate-fadeIn">
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-white">Competitor & Market Landscape</h3>
                          <p className="text-slate-400 text-xs leading-relaxed">{outputs.research.market_overview}</p>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Identified Competitors</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            {outputs.research.competitors?.map((comp: any, idx: number) => (
                              <div key={idx} className="glass rounded-xl p-4 border border-slate-900 space-y-2">
                                <div className="flex justify-between items-center">
                                  <h5 className="font-semibold text-purple-300">{comp.name}</h5>
                                  <a 
                                    href={comp.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-[10px] text-purple-400 hover:text-purple-300 underline font-mono"
                                  >
                                    Visit Website ↗
                                  </a>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">{comp.summary}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gaps & Opportunities</h4>
                          <div className="rounded-xl border border-purple-500/10 bg-purple-500/5 p-4 text-xs text-purple-300 leading-relaxed">
                            {outputs.research.opportunities}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'prd' && outputs?.prd && (
                      <div className="space-y-6 max-w-4xl">
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-white">{outputs.prd.title}</h3>
                          <p className="text-slate-400 text-sm leading-relaxed">{outputs.prd.summary}</p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Features Roadmap</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            {outputs.prd.features?.map((feat: any, idx: number) => (
                              <div key={idx} className="glass rounded-xl p-4 space-y-2">
                                <h5 className="font-semibold text-purple-300">{feat.name}</h5>
                                <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'personas' && outputs?.personas && (
                      <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
                        {outputs.personas.map((pers: any, idx: number) => (
                          <div key={idx} className="glass rounded-xl p-6 space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                                {pers.name ? pers.name[0] : 'U'}
                              </div>
                              <div>
                                <h4 className="font-bold text-white">{pers.name}</h4>
                                <p className="text-xs text-purple-400">{pers.role}</p>
                              </div>
                            </div>
                            <div className="space-y-2 text-xs">
                              <p><span className="font-semibold text-slate-300">Goal:</span> <span className="text-slate-400">{pers.goal}</span></p>
                              <p><span className="font-semibold text-slate-300">Frustration:</span> <span className="text-slate-400">{pers.frustration}</span></p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'stories' && outputs?.userStories && (
                      <div className="glass rounded-xl overflow-hidden max-w-4xl">
                        <table className="w-full border-collapse text-left text-sm text-slate-400">
                          <thead className="bg-slate-900/50 text-xs font-semibold text-white uppercase border-b border-slate-900">
                            <tr>
                              <th className="px-6 py-3">ID</th>
                              <th className="px-6 py-3">Title</th>
                              <th className="px-6 py-3">User Story Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-900">
                            {outputs.userStories.map((story: any) => (
                              <tr key={story.id} className="hover:bg-slate-900/20">
                                <td className="px-6 py-4 font-mono text-purple-400 font-semibold">{story.id}</td>
                                <td className="px-6 py-4 font-semibold text-white">{story.title}</td>
                                <td className="px-6 py-4 text-xs leading-relaxed">{story.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {activeTab === 'prioritization' && outputs?.prioritization && (
                      <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
                        <div className="glass rounded-xl p-5 border-t-2 border-t-red-500/50">
                          <h4 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-red-500"></span> Must Have
                          </h4>
                          <div className="space-y-2">
                            {outputs.prioritization.mustHave && outputs.prioritization.mustHave.length > 0 ? (
                              outputs.prioritization.mustHave.map((id: string) => (
                                <div key={id} className="bg-slate-900/30 rounded-lg p-2.5 text-xs text-slate-300 font-mono border border-slate-900">
                                  {id}
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-slate-600 italic">None</p>
                            )}
                          </div>
                        </div>

                        <div className="glass rounded-xl p-5 border-t-2 border-t-yellow-500/50">
                          <h4 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-yellow-500"></span> Should Have
                          </h4>
                          <div className="space-y-2">
                            {outputs.prioritization.shouldHave && outputs.prioritization.shouldHave.length > 0 ? (
                              outputs.prioritization.shouldHave.map((id: string) => (
                                <div key={id} className="bg-slate-900/30 rounded-lg p-2.5 text-xs text-slate-300 font-mono border border-slate-900">
                                  {id}
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-slate-600 italic">None</p>
                            )}
                          </div>
                        </div>

                        <div className="glass rounded-xl p-5 border-t-2 border-t-emerald-500/50">
                          <h4 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Could Have
                          </h4>
                          <div className="space-y-2">
                            {outputs.prioritization.couldHave && outputs.prioritization.couldHave.length > 0 ? (
                              outputs.prioritization.couldHave.map((id: string) => (
                                <div key={id} className="bg-slate-900/30 rounded-lg p-2.5 text-xs text-slate-300 font-mono border border-slate-900">
                                  {id}
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-slate-600 italic">None</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'architecture' && outputs?.architecture && (
                      <div className="space-y-6 max-w-4xl animate-fadeIn">
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Database Schema Design</h4>
                          <div className="grid md:grid-cols-3 gap-4">
                            {outputs.architecture.tables?.map((table: any, idx: number) => (
                              <div key={idx} className="glass rounded-xl p-4 border border-slate-900 space-y-3">
                                <h5 className="font-mono text-xs font-bold text-purple-300 border-b border-slate-900 pb-2">📋 {table.name}</h5>
                                <ul className="space-y-1.5 font-mono text-[10px] text-slate-400">
                                  {table.columns?.map((col: string, cIdx: number) => (
                                    <li key={cIdx} className="truncate">▪ {col}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">REST API Routes</h4>
                          <div className="glass rounded-xl overflow-hidden">
                            <table className="w-full border-collapse text-left text-xs text-slate-400">
                              <thead className="bg-slate-900/50 text-[10px] font-semibold text-white uppercase border-b border-slate-900">
                                <tr>
                                  <th className="px-4 py-2.5">Method</th>
                                  <th className="px-4 py-2.5">Endpoint Path</th>
                                  <th className="px-4 py-2.5">Route Description</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-900 font-mono text-[11px]">
                                {outputs.architecture.api_endpoints?.map((api: any, idx: number) => (
                                  <tr key={idx} className="hover:bg-slate-900/20">
                                    <td className="px-4 py-3">
                                      <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                                        api.method === 'GET' ? 'bg-blue-500/10 text-blue-400' :
                                        api.method === 'POST' ? 'bg-emerald-500/10 text-emerald-400' :
                                        api.method === 'PUT' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                                      }`}>{api.method}</span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-300">{api.path}</td>
                                    <td className="px-4 py-3 text-slate-400 font-sans text-xs">{api.description}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'roadmap' && outputs?.roadmap && (
                      <div className="grid md:grid-cols-4 gap-4 max-w-4xl animate-fadeIn">
                        {[
                          { name: 'Sprint 1', key: 'sprint_1', theme: 'border-t-blue-500/50', label: 'Foundation & DB' },
                          { name: 'Sprint 2', key: 'sprint_2', theme: 'border-t-purple-500/50', label: 'Core Features' },
                          { name: 'Sprint 3', key: 'sprint_3', theme: 'border-t-pink-500/50', label: 'Advanced Tools' },
                          { name: 'Sprint 4', key: 'sprint_4', theme: 'border-t-emerald-500/50', label: 'Testing & Launch' }
                        ].map((sprint, idx) => (
                          <div key={idx} className={`glass rounded-xl p-4 border-t-2 ${sprint.theme} space-y-3`}>
                            <div>
                              <h5 className="font-bold text-white text-xs">{sprint.name}</h5>
                              <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">{sprint.label}</span>
                            </div>
                            <div className="space-y-2">
                              {outputs.roadmap[sprint.key]?.map((storyId: string) => {
                                const matchingStory = outputs.userStories?.find((s: any) => s.id === storyId);
                                return (
                                  <div key={storyId} className="bg-slate-900/30 rounded-lg p-2 border border-slate-900/60 space-y-1">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[9px] font-mono font-bold text-purple-400">{storyId}</span>
                                    </div>
                                    {matchingStory && (
                                      <p className="text-[10px] text-slate-400 leading-normal line-clamp-2">{matchingStory.title}</p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'cost' && outputs?.costEstimate && (
                      <div className="space-y-6 max-w-4xl animate-fadeIn">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Infrastructure Scaling Projections</h4>
                        <div className="grid md:grid-cols-3 gap-6">
                          {[
                            { users: '100 Active Users', key: 'scale_100', color: 'text-blue-400' },
                            { users: '1,000 Active Users', key: 'scale_1k', color: 'text-purple-400' },
                            { users: '10,000 Active Users', key: 'scale_10k', color: 'text-pink-400' }
                          ].map((tier, idx) => (
                            <div key={idx} className="glass rounded-xl p-5 border border-slate-900 flex flex-col justify-between space-y-4">
                              <div className="space-y-1">
                                <h5 className={`font-bold text-sm ${tier.color}`}>{tier.users}</h5>
                                <p className="text-[9px] text-slate-500 uppercase tracking-wider">Estimated Monthly Budget</p>
                              </div>
                              <div className="space-y-3 divide-y divide-slate-900 text-xs">
                                <div className="flex justify-between py-1">
                                  <span className="text-slate-400">Compute / Hosting:</span>
                                  <span className="font-mono text-white">{outputs.costEstimate.compute_cost[tier.key]}</span>
                                </div>
                                <div className="flex justify-between py-1 pt-2">
                                  <span className="text-slate-400">Database / Storage:</span>
                                  <span className="font-mono text-white">{outputs.costEstimate.database_cost[tier.key]}</span>
                                </div>
                                <div className="flex justify-between py-1 pt-2">
                                  <span className="text-slate-400">CDN / Bandwidth:</span>
                                  <span className="font-mono text-white">{outputs.costEstimate.cdn_cost[tier.key]}</span>
                                </div>
                                <div className="flex justify-between py-2 pt-3 font-semibold border-t border-purple-500/20">
                                  <span className="text-purple-300">Total Projection:</span>
                                  <span className="font-mono text-purple-400">{outputs.costEstimate.total_monthly[tier.key]}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'scaffolding' && outputs?.scaffolding && (
                      <div className="space-y-6 max-w-4xl animate-fadeIn">
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Folder Scaffolding layout</h4>
                          <div className="rounded-xl border border-slate-900 bg-black/60 p-5 font-mono text-[11px] text-slate-300 overflow-x-auto shadow-inner leading-relaxed whitespace-pre">
                            {outputs.scaffolding.file_tree}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Onboarding Setup Instructions</h4>
                          <div className="glass rounded-xl p-5 text-xs text-slate-400 leading-relaxed space-y-2 whitespace-pre-wrap">
                            {outputs.scaffolding.instructions}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'ui' && outputs?.ui && (
                      <div className="space-y-5 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Generated Landing Page Preview</h4>
                            {outputs.ui.style_description && (
                              <p className="mt-1 text-xs text-slate-500 italic">{outputs.ui.style_description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const blob = new Blob([outputs.ui.html_code], { type: 'text/html;charset=utf-8' })
                                const url = URL.createObjectURL(blob)
                                window.open(url, '_blank')
                              }}
                              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium shadow-md shadow-emerald-600/20"
                            >
                              <ExternalLink className="h-3.5 w-3.5" /> Launch Live Demo
                            </button>
                            <a
                              href={`data:text/html;charset=utf-8,${encodeURIComponent(outputs.ui.html_code)}`}
                              download={`${(selectedProject?.title ?? 'blueprint').toLowerCase().replace(/\s+/g, '-')}-landing-page.html`}
                              className="text-xs bg-violet-700 hover:bg-violet-600 text-white transition px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium"
                            >
                              <FileDown className="h-3.5 w-3.5" /> Download HTML
                            </a>
                          </div>
                        </div>
                        <div className="rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
                          <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 border-b border-slate-800">
                            <div className="h-3 w-3 rounded-full bg-red-500/70" />
                            <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                            <div className="h-3 w-3 rounded-full bg-green-500/70" />
                            <span className="ml-2 text-xs text-slate-500 font-mono">{selectedProject?.title?.toLowerCase().replace(/\s+/g, '-')}.app</span>
                          </div>
                          <iframe
                            srcDoc={outputs.ui.html_code}
                            title="UI Blueprint Preview"
                            className="w-full bg-white"
                            style={{ height: '600px', border: 'none' }}
                            sandbox="allow-same-origin"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* DEFAULT VIEW (PIPELINE NOT STARTED) */
                <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
                  <Activity className="h-12 w-12 text-slate-600 mx-auto" />
                  <h3 className="text-lg font-bold text-white">Blueprint Ready to Model</h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                    Select "Run AI Strategist Workflow" to orchestrate the sequential agent pipeline and generate specs.
                  </p>
                  <div className="rounded-xl border border-slate-900 bg-slate-900/20 p-5 text-left text-xs text-slate-400 space-y-3">
                    <p><span className="font-semibold text-slate-200">Concept Idea:</span></p>
                    <p className="italic leading-relaxed">"{selectedProject.idea}"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* NO PROJECT SELECTED */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <Sparkles className="h-12 w-12 text-purple-500 animate-pulse" />
            <h2 className="text-2xl font-bold text-white">Welcome to your Foundry Workspace</h2>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Create a new project blueprint description, or choose a pre-seeded model in the sidebar to review the orchestrated AI agent pipeline workflow.
            </p>
          </div>
        )}
      </main>

      {/* CREATE BLUEPRINT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-lg rounded-2xl p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Create Startup Blueprint</h3>
              <button 
                onClick={() => { setShowCreateModal(false); resetForm(); }}
                className="text-slate-500 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300">Project Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="e.g. EcoRoute"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300">Industry / Domain</label>
                <input
                  type="text"
                  value={newIndustry}
                  onChange={e => setNewIndustry(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="e.g. Healthcare, Fintech, SaaS"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300">Startup Idea / Pitch</label>
                <textarea
                  required
                  rows={4}
                  value={newIdea}
                  onChange={e => setNewIdea(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="Describe your startup product, core functionality, and value proposition..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); resetForm(); }}
                  className="rounded-lg border border-slate-800 bg-transparent px-4 py-2 text-sm text-slate-300 hover:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition"
                >
                  Create Blueprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
export default Dashboard
