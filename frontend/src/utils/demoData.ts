export interface DemoProject {
  id: number
  title: string
  idea: string
  industry: string
  version: number
  created_at: string
  outputs: {
    research?: any
    prd: any
    personas: any
    userStories: any
    prioritization: any
    architecture?: any
    roadmap?: any
    costEstimate?: any
    scaffolding?: any
    ui?: any
  }
}

export const demoProjects: DemoProject[] = [
  {
    id: -101,
    title: 'EcoRoute AI',
    industry: 'Logistics',
    version: 1,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    idea: 'An AI-powered routing engine that calculates carbon-optimized routes for electric and hybrid delivery fleets, factoring in weather, payload weight, battery health, and charging grid availability.',
    outputs: {
      prd: {
        title: 'EcoRoute PRD',
        version: '1.0.0',
        summary: 'A routing optimization engine aimed at courier fleets to minimize greenhouse gas emissions per parcel delivered by choosing carbon-efficient routes.',
        features: [
          { name: 'Carbon-Optimized Route Calculation', description: 'Calculates the routing plan that minimizes total energy consumption and carbon footprint.' },
          { name: 'Real-time Telematics Integration', description: 'Consumes battery status, speed, and ambient temperature to update range predictions.' },
          { name: 'Smart Charging Scheduler', description: 'Identifies charging stops along the route when grid carbon intensity is lowest.' }
        ]
      },
      personas: [
        { name: 'Dave Miller', role: 'Fleet Manager', frustration: 'Struggles to meet quarterly sustainability metrics while keeping route times predictable.', goal: 'Transition to 100% green routing without decreasing parcel delivery rates.' },
        { name: 'Sarah Lopez', role: 'EV Fleet Driver', frustration: 'Experiences range anxiety during peak hours and hates complicated navigation tools.', goal: 'Deliver packages efficiently with reliable charging stops.' }
      ],
      userStories: [
        { id: 'US-001', title: 'Route Optimization', description: 'As a driver, I want to see the most carbon-friendly route so that I can reduce my delivery fleet carbon footprints.' },
        { id: 'US-002', title: 'Battery Telematics', description: 'As a driver, I want real-time range alerts so that I do not get stranded.' }
      ],
      prioritization: {
        mustHave: ['US-001', 'US-002'],
        shouldHave: ['US-003'],
        couldHave: ['US-004']
      }
    }
  },
  {
    id: -102,
    title: 'MediSched Agent',
    industry: 'Healthcare',
    version: 1,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    idea: 'An intelligent AI booking receptionist that integrates with EHR systems to help patients schedule, reschedule, and verify insurance constraints via an automated conversational agent.',
    outputs: {
      prd: {
        title: 'MediSched Receptionist Agent PRD',
        version: '1.0.0',
        summary: 'Conversational scheduler for clinics that reduces administrative burden and increases patient booking rate by 40%.',
        features: [
          { name: 'EHR Synchronization', description: 'Integrates with Epic and Athenahealth databases to fetch open slots.' },
          { name: 'Insurance Verification Engine', description: 'Verifies copays and insurance coverage boundaries.' },
          { name: 'Conversational Booking Interface', description: 'A natural language voice and text chatbot interface.' }
        ]
      },
      personas: [
        { name: 'Dr. James Carter', role: 'Clinic Lead', frustration: 'High administrative overhead from patient booking calls and missed appointments.', goal: 'Automate schedule bookings so staff can focus on patient care.' },
        { name: 'Emma Watson', role: 'Busy Patient', frustration: 'Waiting on hold for 15 minutes just to reschedule a checkup.', goal: 'Reschedule appointments on-the-go in seconds.' }
      ],
      userStories: [
        { id: 'US-101', title: 'Schedule via WhatsApp', description: 'As a patient, I want to book an appointment via WhatsApp so that I do not have to call.' },
        { id: 'US-102', title: 'Epic EHR Sync', description: 'As a receptionist, I want appointments to instantly sync with Epic so that schedules remain accurate.' }
      ],
      prioritization: {
        mustHave: ['US-101', 'US-102'],
        shouldHave: ['US-103'],
        couldHave: []
      }
    }
  },
  {
    id: -103,
    title: 'FinScale Bookkeeper',
    industry: 'Finance',
    version: 1,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    idea: 'An AI ledger bookkeeper that reconciles business receipts, logs banking statements automatically, and generates weekly tax liability forecasts for small-to-medium businesses.',
    outputs: {
      prd: {
        title: 'FinScale Ledger PRD',
        version: '1.0.0',
        summary: 'Automated ledger processing and tax tracking for startups.',
        features: [
          { name: 'Automatic Bank Feed Sync', description: 'Uses Plaid to aggregate transaction streams.' },
          { name: 'Receipt OCR and Auto-Categorization', description: 'Uses LLMs to match receipts to bank charges.' },
          { name: 'Rolling Tax Liability Estimator', description: 'Provides real-time tax forecasting based on current monthly spend.' }
        ]
      },
      personas: [
        { name: 'Mark Cuban', role: 'Startup Founder', frustration: 'Spends too many hours manually matching receipts to spreadsheet rows.', goal: 'Clear receipts and calculate tax estimates instantly.' }
      ],
      userStories: [
        { id: 'US-201', title: 'Plaid Sync', description: 'As a founder, I want to sync my SVB bank feed automatically so that my bookkeeping is real-time.' },
        { id: 'US-202', title: 'Receipt OCR Match', description: 'As a founder, I want to email a receipt and have it match the charge automatically.' }
      ],
      prioritization: {
        mustHave: ['US-201', 'US-202'],
        shouldHave: ['US-203'],
        couldHave: []
      }
    }
  }
]
