// ============================================================
// App root: routing and layout shell
// ============================================================

import { useState } from 'react';
import { FilterProvider } from './hooks/useFilters';
import Sidebar, { type PageId } from './components/layout/Sidebar';
import { Header, FilterBar } from './components/layout/HeaderBar';

// Pages
import UniversityLandscape from './pages/UniversityLandscape';
import LocalRetention from './pages/LocalRetention';
import CampaignEffectiveness from './pages/CampaignEffectiveness';
import CampaignCalculator from './pages/CampaignCalculator';

const PAGE_TITLES: Record<PageId, { title: string; subtitle: string }> = {
  'university-landscape': { title: 'University Landscape', subtitle: 'Strategic comparison across universities · drill down into any university' },
  'local-retention': { title: 'Local Retention & Stickiness', subtitle: 'Are NE hires staying in the region? Local Retention Index' },
  'campaign-effectiveness': { title: 'Campaign Effectiveness', subtitle: 'Which activities produce the best retained hires?' },
  'campaign-calculator': { title: 'Campaign Comparison', subtitle: 'Build competing recruitment campaigns and compare which the model favours. Each campaign is a full plan of events.' },
};

const PAGE_COMPONENTS: Record<PageId, React.FC> = {
  'university-landscape': UniversityLandscape,
  'local-retention': LocalRetention,
  'campaign-effectiveness': CampaignEffectiveness,
  'campaign-calculator': CampaignCalculator,
};

// Pages that should show the filter bar
const FILTERED_PAGES: Set<PageId> = new Set([
  'local-retention',
  'campaign-effectiveness',
  'university-landscape',
]);

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('university-landscape');

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
