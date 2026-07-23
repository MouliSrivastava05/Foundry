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
      },
      research: {
        market_overview: 'The global green logistics market is growing at a 14.2% CAGR driven by European Union carbon mandates and corporate ESG compliance targets.',
        competitors: [
          { name: 'Samsara Green Routing', url: 'https://samsara.com', summary: 'Enterprise telematics platform with basic fuel economy dashboards.' },
          { name: 'Routific EV', url: 'https://routific.com', summary: 'Route planner for local delivery fleets with basic electric vehicle support.' }
        ],
        opportunities: 'Real-time grid carbon intensity matching during EV charging windows and battery state-of-health degradation modeling.'
      },
      architecture: {
        tables: [
          { name: 'vehicles', columns: ['id (UUID, PK)', 'fleet_id (FK)', 'battery_capacity_kwh (FLOAT)', 'telematics_device_id (VARCHAR)'] },
          { name: 'routes', columns: ['id (UUID, PK)', 'vehicle_id (FK)', 'origin_geo (POINT)', 'destination_geo (POINT)', 'co2_saved_kg (FLOAT)'] }
        ],
        api_endpoints: [
          { method: 'POST', path: '/api/v1/routes/optimize', description: 'Calculates carbon-optimized waypoint sequence.' },
          { method: 'GET', path: '/api/v1/fleets/{id}/telematics', description: 'Streams real-time battery and vehicle range telemetry.' }
        ]
      },
      roadmap: {
        sprint_1: ['US-001'],
        sprint_2: ['US-002'],
        sprint_3: ['US-003'],
        sprint_4: ['US-004']
      },
      costEstimate: {
        compute_cost: { scale_100: '$25/mo', scale_1k: '$120/mo', scale_10k: '$850/mo' },
        database_cost: { scale_100: '$15/mo', scale_1k: '$60/mo', scale_10k: '$300/mo' },
        cdn_cost: { scale_100: '$5/mo', scale_1k: '$20/mo', scale_10k: '$150/mo' },
        total_monthly: { scale_100: '$45/mo', scale_1k: '$200/mo', scale_10k: '$1,300/mo' }
      },
      scaffolding: {
        file_tree: 'ecoroute-core/\n├── backend/\n│   ├── app/\n│   │   ├── api/v1/routes.py\n│   │   ├── services/telematics.py\n│   │   └── models/vehicle.py\n│   └── main.py\n└── frontend/\n    └── src/\n        ├── components/RouteMap.tsx\n        └── pages/FleetDashboard.tsx',
        instructions: '1. Install Python 3.11+ and Node 20+\n2. Run `pip install -r requirements.txt` in /backend\n3. Launch API with `uvicorn main:app --reload`'
      },
      ui: {
        style_description: 'Modern emerald green & dark glassmorphism dashboard targeting fleet managers.',
        html_code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EcoRoute AI — Carbon-Optimized Logistics</title>
  <style>
    :root {
      --bg: #09130e;
      --card: #102219;
      --accent: #10b981;
      --text: #ecfdf5;
      --muted: #6ee7b7;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: system-ui, -apple-system, sans-serif; }
    body { background: var(--bg); color: var(--text); padding: 2rem; }
    header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 2rem; border-bottom: 1px solid #1c3d2d; }
    .logo { font-size: 1.5rem; font-weight: 800; color: var(--accent); display: flex; align-items: center; gap: 0.5rem; }
    .btn { background: var(--accent); color: #042f1e; padding: 0.6rem 1.2rem; font-weight: 700; border-radius: 8px; text-decoration: none; display: inline-block; }
    .hero { text-align: center; padding: 4rem 1rem; }
    .hero h1 { font-size: 3rem; margin-bottom: 1rem; color: var(--text); }
    .hero p { color: #a7f3d0; max-width: 600px; margin: 0 auto 2rem; font-size: 1.1rem; line-height: 1.6; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; max-width: 1000px; margin: 0 auto; }
    .card { background: var(--card); border: 1px solid #1c3d2d; padding: 1.5rem; border-radius: 12px; }
    .card h3 { color: var(--accent); margin-bottom: 0.5rem; }
    .card p { color: #94a3b8; font-size: 0.9rem; line-height: 1.5; }
  </style>
</head>
<body>
  <header>
    <div class="logo">⚡ EcoRoute AI</div>
    <a href="#" class="btn">Request Fleet Demo</a>
  </header>
  <section class="hero">
    <h1>Zero-Emission Delivery Fleet Optimization</h1>
    <p>Cut your fleet carbon footprint by up to 35% with dynamic EV battery telematics and grid-aware routing engines.</p>
    <a href="#" class="btn">Calculate Fleet Savings</a>
  </section>
  <div class="grid">
    <div class="card">
      <h3>🌱 Carbon-Optimized Routing</h3>
      <p>Real-time calculation factoring in weather, payload, elevation, and traffic.</p>
    </div>
    <div class="card">
      <h3>⚡ Smart Grid Charging</h3>
      <p>Schedule charging stops when renewable energy availability in the grid peaks.</p>
    </div>
    <div class="card">
      <h3>📊 ESG Telematics</h3>
      <p>Automated greenhouse gas reporting for compliance and corporate audit readiness.</p>
    </div>
  </div>
</body>
</html>`
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
