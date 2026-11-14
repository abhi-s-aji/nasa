# OUTPOST — Artemis Lunar Mission Simulator
### NASA Space Apps Challenge 2026: Build a Junior Astronaut Mission Trainer

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8)](https://tailwindcss.com/)

---

## 1. Executive Summary

**OUTPOST** is an interactive space-outpost survival simulator and mission control dashboard engineered for the **NASA Space Apps Challenge 2026** challenge: *"Build a Junior Astronaut Mission Trainer"*.

Users assume the role of **Mission Commander** stationed at the **Artemis Research Outpost** on the rim of Shackleton Crater at the Lunar South Pole (89.9°S). Commanders must maintain equilibrium across vital life support and power systems over **30 lunar days (sols)**, keeping four astronauts alive and science payloads operational under harsh extraterrestrial conditions.

---

## 2. Interface & Visual Design System

Designed according to professional aerospace mission-control software standards and Swiss-inspired editorial typography:
- **Palette**: Restrained dark navy (`#080d1a`, `#0b1329`), charcoal, muted slate borders (`#1e293b`), off-white high-contrast text (`#f8fafc`), and functional aerospace telemetry accents (Cyan, Emerald, Amber, Rose).
- **Typography**: Dual font system using `Inter` for crisp hierarchy and `JetBrains Mono` for telemetry values, coordinates, and timestamps.
- **Visuals**: Dense, information-rich cards, interactive multi-sol telemetry charts (Recharts), status pills, and Lucide React iconography.
- **Mobile Responsive**: Adaptive navigation drawer for handheld devices and fixed telemetry sidebar on desktop.

---

## 3. Simulation Engine & Scientific Assumptions

### A. Closed-Loop Life Support (ECLSS)
- **Atmospheric Oxygen ($O_2$)**: Base metabolic burn of 3.5%/day across the 4 crew members (corresponds to ~0.84 kg $O_2$/astronaut/day). Supplemented by Sabatier electrolysis recycling and photosynthetic bioreactors.
- **Potable Water ($H_2O$)**: Crew usage consumes 4.8%/day (2.5L drinking + 1.5L hygiene). When activated, the Vapor Compression Distillation unit recovers up to 75% of wastewater.
- **Caloric Biomass (Food)**: Crew consumes 3.2%/day (~11,200 kcal/day total). The hydroponic greenhouse yields fresh microgreens and spirulina (+2.0%/day) at the expense of electric power and water.

### B. Lunar South Pole Power Dynamics
- **Vertical Bifacial Solar Arrays**: Positioned on Shackleton Crater's Peak of Eternal Light. Solar yield varies with low grazing angles (1.5° above horizon).
- **Active Servos**: Optimizing sun-tracking yields +35% daily energy harvest for a 3% servo calibration draw.
- **Emergency Power-Saving**: Reduces baseline habitat hotel load by 45% during low-sun periods or dust accumulation events.

### C. Space Radiation Mitigation
- **Sintered Regolith Berm**: Shields crew from continuous Galactic Cosmic Rays (GCR, ~1.8 mSv/day) and unpredictable Solar Particle Events (SPEs).
- **Robotic Sintering Reinforcement**: Restores shield integrity by +12% at the cost of 5% energy.

### D. The 4 Astronauts & Biomedical Status
1. **Dr. Elena Vance** — Mission Commander & Systems Specialist (Callsign: Ares-1)
2. **Dr. Marcus Chen** — Flight Surgeon & Astrobiologist (Callsign: Asclepius)
3. **Amara Okafor, PE** — Lead Systems & Power Engineer (Callsign: Dynamo)
4. **Dr. Nikolai Lindqvist** — Mission Geologist & Payload Specialist (Callsign: Geo-Lead)

*Biometrics track individual Heart Rate (bpm), Oxygen Saturation ($SpO_2$), Cumulative Radiation Dose (mSv), and Morale.*

---

## 4. Key Interactive Capabilities

1. **Mission Overview**: Live status summary, 6 primary resource telemetry gauges, interactive multi-sol history chart, quick-directive panel, and one-click **Advance One Day** simulation engine.
2. **Resource Management**: Deep-dive telemetry for all 6 subsystems with active toggles and rate-of-change statistics.
3. **Crew Health**: Individual astronaut vitals, duties, status tags (Nominal, Fatigued, Mild Hypoxia, Radiation Sickness, Dehydrated, Critical), and **Medical Bay Therapy Protocol**.
4. **Habitat Systems**: Complete engineering breakdown of all 5 core modules with operational toggles, efficiency metrics, and kW continuous load telemetry.
5. **Mission Log**: Chronological audit trail of all days, incidents (Solar Proton Events, Lunar Dust Accumulation, Filter Clogs, Micrometeoroids), and commander actions with export to JSON.
6. **About & Science**: Detailed educational explanations distinguishing simplified simulation dynamics from official NASA engineering specifications.
7. **Persistence**: Instant browser `localStorage` autosave and recovery with complete mission reset capability.

---

## 5. Getting Started (Local Setup)

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ (tested on Node v24)
- npm v9+

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/your-username/outpost.git
cd outpost

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build

```bash
# Type check and build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 6. Deployment Instructions

### Deploy to Vercel

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New Project**.
3. Import the repository.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. Click **Deploy**.

*(Alternatively, run `npx vercel` from the project root).*

### Deploy to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com/) and click **Add new site** > **Import an existing project**.
2. Connect your Git repository.
3. Build Settings:
   - **Base directory**: `.`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click **Deploy site**.

*(A `netlify.toml` file is included in this repository for zero-config deployment).*

---

## 7. Educational Disclaimer

*OUTPOST is an educational training simulation created for the NASA Space Apps Challenge 2026. It is not an official NASA mission control platform and does not ingest live spacecraft telemetry. All astronaut profiles, outpost telemetry, and space weather events are educational models inspired by NASA Artemis architecture.*
