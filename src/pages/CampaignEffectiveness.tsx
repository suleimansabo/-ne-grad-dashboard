// ============================================================
// PAGE: Campaign Effectiveness
// ============================================================

import { MultiBarChart, HorizontalBarChart } from '../components/charts/Charts';
import { CAMPAIGNS } from '../data/campaigns';
import { useFilters } from '../hooks/useFilters';

const TYPE_COLORS: Record<string, string> = {
    'University Partnership': '#a100ff',
    'Campus Event': '#00c8ff',
    'Digital / Social': '#22c55e',
    'Careers Fair': '#f59e0b',
    'Hackathon': '#ff6b6b',
};

export default function CampaignEffectiveness() {
    const { filters } = useFilters();

    const campaigns = CAMPAIGNS.filter((c) => {
        if (filters.year !== 'all' && c.year !== filters.year) return false;
        if (filters.universityId !== 'all' && c.universityId !== filters.universityId && c.universityId !== 'multi') return false;
        return true;
    });

    const sorted = [...campaigns].sort((a, b) => a.costPerRetainedHire - b.costPerRetainedHire);

    // Summary cards
    const totalSpend = campaigns.reduce((s, c) => s + c.estimatedCost, 0);
    const totalHires = campaigns.reduce((s, c) => s + c.joinedHires, 0);
    const totalRetained = campaigns.reduce((s, c) => s + c.retainedHires, 0);
    const avgCostPerRetained = totalRetained > 0 ? Math.round(totalSpend / totalRetained) : 0;

    // Chart data: cost per retained hire
    const costChartData = sorted.map((c) => ({
        name: c.name.split(' ').slice(0, 2).join(' '),
        '£ / Retained Hire': c.costPerRetainedHire,
        '£ / Hire': c.costPerHire,
    }));

    // Conversion rates chart
    const convData = campaigns.map((c) => ({
        name: c.name.split(' ').slice(0, 2).join(' '),
        'Interview %': c.interviewConversionPct,
        'Offer %': c.offerConversionPct,
        'Acceptance %': c.acceptanceRatePct,
        '12m Retention %': c.retention12mPct,
    }));

    return (
        <div className="page animate-in">
            <div className="page-title">Campaign Effectiveness</div>
            <div className="page-subtitle">
                Which activities produce the best retained hires? · {filters.year === 'all' ? 'All Years' : filters.year}
            </div>

            {/* Summary KPIs */}
            <div className="grid-4 mb-24">
                {[
                    { label: 'Total Campaign Spend', value: `£${(totalSpend / 1000).toFixed(0)}k`, status: 'neutral' as const },
                    { label: 'Total Joined Hires', value: String(totalHires), status: 'positive' as const },
                    { label: 'Total Retained Hires', value: String(totalRetained), status: 'positive' as const },
                    { label: 'Avg Cost / Retained Hire', value: `£${avgCostPerRetained.toLocaleString()}`, status: avgCostPerRetained < 600 ? 'positive' as const : 'warning' as const },
                ].map((k) => (
                    <div key={k.label} className={`kpi-card ${k.status}`}>
                        <div className="kpi-label">{k.label}</div>
                        <div className="kpi-value">{k.value}</div>
                    </div>
                ))}
            </div>

            {/* Cost comparison chart */}
            <div className="card mb-24">
                <div className="card-header">
                    <div>
                        <div className="card-title">Cost per Hire vs Cost per Retained Hire</div>
                        <div className="card-subtitle">Lower is better — focus on cost per <em>retained</em> hire</div>
                    </div>
                    <span className="badge purple">Sorted by efficiency</span>
                </div>
                <div className="card-body">
                    <HorizontalBarChart
                        data={costChartData}
                        yKey="name"
                        bars={[
                            { key: '£ / Hire', name: '£ / Hire', color: 'var(--chart-2)' },
                            { key: '£ / Retained Hire', name: '£ / Retained Hire', color: 'var(--chart-1)' },
                        ]}
                    />
                </div>
            </div>

            {/* Conversion funnel per campaign */}
            <div className="card mb-24">
                <div className="card-header">
                    <div className="card-title">Conversion & Retention by Campaign</div>
                    <div className="card-subtitle">Interview → Offer → Acceptance → 12m Retention</div>
                </div>
                <div className="card-body">
                    <MultiBarChart
                        data={convData}
                        xKey="name"
                        bars={[
                            { key: 'Interview %', name: 'To Interview', color: 'var(--chart-2)' },
                            { key: 'Offer %', name: 'To Offer', color: 'var(--chart-3)' },
                            { key: 'Acceptance %', name: 'Acceptance', color: 'var(--chart-4)' },
                            { key: '12m Retention %', name: '12m Retention', color: 'var(--chart-1)' },
                        ]}
                        unit="%"
                    />
                </div>
            </div>

            {/* Detailed table */}
            <div className="card">
                <div className="card-header">
                    <div className="card-title">Campaign Details</div>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Campaign</th>
                                <th>Type</th>
                                <th>Spend</th>
                                <th>Applications</th>
                                <th>Joined</th>
                                <th>Retained 12m</th>
                                <th>Acceptance</th>
                                <th>£/Hire</th>
                                <th>£/Retained Hire</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((c) => (
                                <tr key={c.id}>
                                    <td style={{ fontWeight: 600, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {c.name}
                                    </td>
                                    <td>
                                        <span className="badge purple" style={{ background: `${TYPE_COLORS[c.type]}22`, color: TYPE_COLORS[c.type] }}>
                                            {c.type}
                                        </span>
                                    </td>
                                    <td>£{c.estimatedCost.toLocaleString()}</td>
                                    <td>{c.applicationsGenerated}</td>
                                    <td>{c.joinedHires}</td>
                                    <td>
                                        <span className={`badge ${c.retention12mPct >= 85 ? 'green' : c.retention12mPct >= 78 ? 'amber' : 'red'}`}>
                                            {c.retainedHires} ({c.retention12mPct}%)
                                        </span>
                                    </td>
                                    <td>{c.acceptanceRatePct}%</td>
                                    <td>£{c.costPerHire.toLocaleString()}</td>
                                    <td style={{ fontWeight: 700, color: c.costPerRetainedHire < 500 ? 'var(--green)' : c.costPerRetainedHire < 700 ? 'var(--amber)' : 'var(--red)' }}>
                                        £{c.costPerRetainedHire.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
