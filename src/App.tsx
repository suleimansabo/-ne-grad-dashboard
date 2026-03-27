// ============================================================
// App root: routing and layout shell
// ============================================================

import { useState } from 'react';
import { FilterProvider } from './hooks/useFilters';
import Sidebar, { type PageId } from './components/layout/Sidebar';
import { Header, FilterBar } from './components/layout/HeaderBar';

// Pages
import ExecutiveSummary from './pages/ExecutiveSummary';
import UniversityLandscape from './pages/UniversityLandscape';
import AttractionFunnel from './pages/AttractionFunnel';
import LocalRetention from './pages/LocalRetention';
import LeakageToLondon from './pages/LeakageToLondon';
import CampaignEffectiveness from './pages/CampaignEffectiveness';
import RiskInsights from './pages/RiskInsights';

const PAGE_TITLES: Record<PageId, { title: string; subtitle: string }> = {
  'executive': { title: 'Executive Summary', subtitle: 'North East Graduate Recruitment · Overall KPIs and trends' },
  'university-landscape': { title: 'University Landscape', subtitle: 'Strategic comparison across universities · drill down into any university' },
  'attraction-funnel': { title: 'Attraction Funnel', subtitle: 'Campaign reach to joined hires — conversion at every stage' },
  'local-retention': { title: 'Local Retention & Stickiness', subtitle: 'Are NE hires staying in the region? Local Retention Index' },
  'leakage-london': { title: 'Leakage to London', subtitle: 'Internal transfer patterns and feeder-office risk' },
  'campaign-effectiveness': { title: 'Campaign Effectiveness', subtitle: 'Which activities produce the best retained hires?' },
  'risk-insights': { title: 'Risk & Insights', subtitle: 'Automated signals, alerts, and what-if scenarios' },
};

const PAGE_COMPONENTS: Record<PageId, React.FC> = {
  'executive': ExecutiveSummary,
  'university-landscape': UniversityLandscape,
  'attraction-funnel': AttractionFunnel,
  'local-retention': LocalRetention,
  'leakage-london': LeakageToLondon,
  'campaign-effectiveness': CampaignEffectiveness,
  'risk-insights': RiskInsights,
};

// Pages that should show the filter bar
const FILTERED_PAGES: Set<PageId> = new Set([
  'executive',
  'attraction-funnel',
  'local-retention',
  'leakage-london',
  'campaign-effectiveness',
  'university-landscape',
]);

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('executive');

  const { title, subtitle } = PAGE_TITLES[activePage];
  const PageComponent = PAGE_COMPONENTS[activePage];
  const showFilters = FILTERED_PAGES.has(activePage);

  return (
    <FilterProvider>
      <div className="app-shell">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <div className="main-content">
          <Header pageTitle={title} pageSubtitle={subtitle} />
          {showFilters && <FilterBar />}
          <PageComponent />
        </div>
      </div>
    </FilterProvider>
  );
}
