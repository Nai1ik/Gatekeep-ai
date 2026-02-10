# LLM SIEM Security Scorecard Dashboard

A modern, AI-powered security dashboard built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### 🚦 Traffic Light Severity System
- **CRITICAL** (Red) - Pulsing glow animation
- **WARNING** (Yellow) - Animated indicator
- **INFO** (Green) - Subtle indicator

### 💡 Key Takeaway Boxes
Plain English summaries like:
> "Someone tried to guess the 'Admin' password 50 times in 2 minutes from an IP in Russia."

### 🕸️ Blast Radius Visualization
Interactive force-directed graph showing:
- Infected workstations
- Target servers
- Malicious IPs
- Compromised user accounts
- Affected files

### ⚡ Human-in-the-Loop Remediation Panel
Interactive action buttons:
- Block IP on Firewall
- Disable User Account
- Isolate Machine

*Hover for AI-generated reasoning*

### 📅 Timeline of Events
Vertical chronological timeline with:
- Timestamped events
- Severity indicators
- Expandable details

### 📊 Natural Language Comparison
Bar charts comparing:
- Normal vs. current activity
- Baseline deviation percentages
- Plain English anomaly explanations

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd llm-siem-dashboard
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
llm-siem-dashboard/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main dashboard
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── SeverityIndicator.tsx   # Traffic light indicator
│   │   ├── KeyTakeaway.tsx         # Plain English summary
│   │   ├── AlertCard.tsx           # Alert list items
│   │   ├── BlastRadius.tsx         # Force graph visualization
│   │   ├── RemediationPanel.tsx    # Action buttons sidebar
│   │   ├── EventTimeline.tsx       # Chronological timeline
│   │   └── BehaviorComparison.tsx  # Normal vs. current charts
│   ├── data/
│   │   └── mockData.ts       # Sample security alerts
│   └── types/
│       └── types.ts          # TypeScript interfaces
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Custom Canvas** - Animated force graph visualization

## Screenshots

*Run the app to see the beautiful dark-themed dashboard with glassmorphism effects, animated severity indicators, and interactive visualizations.*
