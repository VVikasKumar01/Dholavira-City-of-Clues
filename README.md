# Dholavira: City of Clues 🏛️🏺

> **An immersive 3D archaeological mystery & serious-game exploration of the ancient Indus Valley Civilization metropolis of Dholavira (Khādir Bet, Rann of Kutch, Gujarat).**

[![Built with React](https://img.shields.io/badge/Built%20with-React%2019-61dafb?logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/3D%20Engine-Three.js-black?logo=three.js)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite%208-646cff?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

---

## 📖 Overview

**Dholavira: City of Clues** puts you in the boots of a junior field archaeologist on the arid island plateau of Khādir Bet. Step back over 4,500 years into the Bronze Age to explore, decode, and reconstruct the engineering marvels of the Harappan Civilization.

Unlike conventional games, every clue, architectural structure, and water management puzzle is directly grounded in real-world excavation reports and archaeological findings from the Archaeological Survey of India (ASI).

---

## ✨ Key Features

### 1. 🚶 AAA 3D Field Archaeologist Avatar
- **Authentic Expedition Character**: Custom-modeled adventurer featuring an olive-green field jacket, popped collar, low chignon bun with an antique hairpin, tactical charcoal cargo trousers, and lugged desert boots.
- **Realistic Expedition Gear**: Heavy canvas backpack with dual bedrolls (top foam sleeping mat and bottom rolled scroll), coiled climbing rope, vintage brass pocket watch/compass hanging at the hip, water canteen, and a field journal with stylus in hand.
- **Lifelike Animations**: Responsive third-person movement, natural walk cadence, and idle breathing cycles.

### 2. 🏛️ Complete Archaeological Reconstruction of Dholavira
- **The Citadel (Acropolis)**: Elevated fortified stone podium, imposing North Gateway, twin guard bastions, carved limestone column bases, and council terraces.
- **The Great Eastern Reservoir**: Mammoth rock-cut and stone-masonry stepped lake with 5 descending tiers of ghats, reflecting animated turquoise waters.
- **Megalithic Funerary Complex**: Unique spoked-wheel cairn circle tombs, stepped hemispherical tumuli, and megalithic cist burials on the western terrace.
- **Hydraulic Civil Engineering**: Seasonal stream check-dams (Manhar & Mansar nullahs), stone-lined inlet chutes, desilting chambers, sluice gates, and covered municipal drainage networks.
- **Grand Paved Thoroughfares**: Ceremonial avenues and processional streets with raised limestone kerbstones connecting civic and residential quarters.
- **Active Stone Fountains**: Monumental carved stone aeration fountains in the Ceremonial Plaza and canal sluice cascades with dynamic splashing water.

### 3. 🔍 Gameplay & Investigative Missions
- **Field Notes & Archive**: Gather source-linked evidence cards, decipher Indus script symbols, and catalog Harappan artifacts.
- **Interactive Hydraulic Simulation**: Inspect sluice mechanisms, desilting basins, and water level gauges to restore the ancient city's water flow.
- **Multiple Camera Angles**:
  - **Explorer Mode**: Dynamic third-person over-the-shoulder chase camera.
  - **Isometric Mode**: Tactical architectural survey view.
  - **Drone Mode**: High-altitude cinematic aerial perspective.

---

## 🎮 Controls

| Action | Control |
| :--- | :--- |
| **Move Explorer** | `W` `A` `S` `D` or `Arrow Keys` |
| **Orbit Camera** | `Right Click + Drag` or `Left Click + Drag` |
| **Zoom View** | `Mouse Scroll Wheel` |
| **Field Journal / Notes** | `N` Key or Top Navigation Button |
| **Evidence & Archive** | Top HUD Buttons |
| **Camera Switcher** | Bottom Right HUD (`Explorer` / `Isometric` / `Drone`) |

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **3D Graphics & Rendering**: Three.js, Custom PBR Textures & Normal Maps, ACES Filmic Tone Mapping
- **UI & Styling**: Tailwind CSS, Lucide React Icons, Motion
- **Build Tool**: Vite 8 (Sub-2 second production builds)
- **Deployment Platform**: Vercel (Configured via `vercel.json`)

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+ installed on your system
- npm or yarn

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/your-username/dholavira-city-of-clues.git
cd dholavira-city-of-clues

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your web browser.

---

## ☁️ Deploying to Vercel

This repository includes a pre-configured `vercel.json` file ready for one-click deployment.

### Option 1: Deploy with Vercel Web Dashboard (Recommended)

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** > **"Project"**.
3. Import your repository from GitHub.
4. Vercel will automatically detect the settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**. Your game will be live on an official `.vercel.app` URL within 60 seconds!

---

### Option 2: Deploy using Vercel CLI

```bash
# 1. Install Vercel CLI globally
npm i -g vercel

# 2. Log in to your Vercel account
vercel login

# 3. Deploy to production
vercel --prod
```

When prompted:
- **Set up and deploy?**: `y`
- **Which scope?**: Select your account
- **Link to existing project?**: `n`
- **What's your project's name?**: `dholavira-city-of-clues`
- **In which directory is your code located?**: `./`

---

## 📜 Build Scripts

```bash
# Start local development server on port 3000
npm run dev

# Compile TypeScript and build production bundle in /dist
npm run build

# Preview production build locally
npm run preview

# Type-check codebase with TypeScript compiler
npm run lint
```

---

## 🏛️ Archaeological Accuracy Note

All spatial layouts, hydraulic channels, and material textures are modeled in accordance with archaeological reports on Dholavira published by the Archaeological Survey of India (ASI) and UNESCO World Heritage documentation (Site Ref: 1642).

---

## 📄 License

MIT License. Open for educational, academic, and non-commercial research use.
