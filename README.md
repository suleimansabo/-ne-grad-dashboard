# NE Graduate Attraction & Retention Dashboard

A decision-support web app for Accenture's early careers and marketing team focused on North East England university engagement.

---

## Quick Start

```bash
cd ne-grad-dashboard
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## Building for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── data/               Mock datasets (replace with real API calls)
│   ├── universities.ts  University metadata + subject volumes
│   ├── funnel.ts        Recruitment funnel records (per cohort)
│   ├── hires.ts         Individual hire records + LRI scores
│   ├── retention.ts     Cohort-level retention summaries
│   ├── campaigns.ts     Campaign performance data
│   └── transfers.ts     Internal transfer events + leakage summary
├── utils/
│   ├── metrics.ts       KPI calculators, filters, LRI aggregation
│   └── insights.ts      Plain-English insight generator
├── hooks/
│   └── useFilters.ts    Global filter state (React Context)
├── components/
│   ├── layout/          Sidebar, Header, FilterBar
│   ├── charts/          Recharts wrappers (bar, line, area, donut, horizontal)
│   └── ui/              KpiCard and other UI primitives
├── pages/
│   ├── ExecutiveSummary.tsx
│   ├── UniversityLandscape.tsx
│   ├── AttractionFunnel.tsx
│   ├── LocalRetention.tsx
│   ├── LeakageToLondon.tsx
│   ├── CampaignEffectiveness.tsx
│   ├── RiskInsights.tsx
│   └── UniversityScorecard.tsx
├── App.tsx              Root: navigation + layout shell
├── main.tsx             Entry point
└── index.css            Design system (Accenture dark theme)
```

---

## Dashboard Pages

| Page | Description |
|------|-------------|
| Executive Summary | 6 KPI cards, YoY trends, "What changed this month?" |
| University Landscape | Subject volumes, progression, employability comparison |
| Attraction Funnel | 9-stage funnel, conversion rates, drill-down filters |
| Local Retention | LRI scores, 6m/12m/24m retention, local vs non-local |
| Leakage to London | Feeder index, transfer patterns, hire origin breakdown |
| Campaign Effectiveness | Cost per retained hire, conversion rates by campaign |
| Risk & Insights | Auto-generated signals, What-If scenarios |
| University Scorecard | Single-university deep-dive with campaigns tab |

---

## Local Retention Index (LRI)

Scored 0–100 per hire:

| Criterion | Weight |
|-----------|--------|
| Home region = North East | 25 pts |
| University region = North East | 25 pts |
| No transfer request within 12 months | 25 pts |
| Still active in-region at 12 months | 25 pts |

---

## Replacing Mock Data with Real Data

Each file in `src/data/` exports a typed array. To connect a real API:

1. Replace the array export with an async fetch wrapped in a React Query hook (or SWR).
2. Ensure the fetched data conforms to the TypeScript interfaces defined in each file.
3. Pass the result to the same utility functions in `src/utils/metrics.ts`.

Example replacement for `funnel.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import type { FunnelRecord } from './funnel';

export function useFunnelData() {
  return useQuery<FunnelRecord[]>({
    queryKey: ['funnel'],
    queryFn: () => fetch('/api/funnel').then(r => r.json()),
  });
}
```

---

## Tech Stack

- **Vite 6 + React 18 + TypeScript**
- **Recharts** — responsive charts
- **Lucide React** — icons
- **Vanilla CSS** — Accenture dark design system (no framework dependency)

---

## Extending the App

- **Add a new KPI**: add a field to the relevant data file and update `calcExecKPIs` in `metrics.ts`.
- **Add a new page**: create `src/pages/YourPage.tsx`, register it in `App.tsx` `PAGE_COMPONENTS`, and add a nav entry in `Sidebar.tsx`.
- **Export to PDF**: use the `html2canvas` package already installed (`npm list html2canvas`) to snapshot the current page and save it.

---

*Data last refreshed: March 2026 (mock). Accenture Internal Use.*
