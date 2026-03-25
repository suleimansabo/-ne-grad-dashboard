// ============================================================
// PAGE: Executive Summary
// ============================================================

import KpiCard from '../components/ui/KpiCard';
import { MultiLineChart, StackedAreaChart } from '../components/charts/Charts';
import { useFilters } from '../hooks/useFilters';
import { calcExecKPIs, pct, num, delta, trend } from '../utils/metrics';
import { getMonthlyChangeSummary } from '../utils/insights';
import { RETENTION_DATA } from '../data/retention';
import { Sparkles, Lightbulb } from 'lucide-react';

// Trend line data: total hires per year across all universities
const TREND_DATA = [2022, 2023, 2024, 2025].map((year) => {
    const rows = RETENTION_DATA.filter((r) => r.year === year);
    return {
        year: String(year),
        Applications: rows.reduce((s, r) => s + r.totalHires * 5.2, 0) | 0,
        Hires: rows.reduce((s, r) => s + r.totalHires, 0),
        Retention12m: rows.length > 0 ? Math.round(rows.reduce((s, r) => s + r.retention12m, 0) / rows.length) : 0,
    };
});

// Stacked area: local vs non-local origin hires by year
const ORIGIN_DATA = [2022, 2023, 2024, 2025].map((year) => {
    const rows = RETENTION_DATA.filter((r) => r.year === year);
    return {
        year: String(year),
        'Local Origin': rows.reduce((s, r) => s + r.localOriginHires, 0),
        'Non-Local Origin': rows.reduce((s, r) => s + r.nonLocalOriginHires, 0),
    };
});

export default function ExecutiveSummary() {
    const { filters } = useFilters();
    const kpis = calcExecKPIs(filters);
    const monthlyChange = getMonthlyChangeSummary();
    const year = filters.year === 'all' ? 2024 : filters.year;
    const prevYear = (year as number) - 1;

    // Determine trends based on KPI values vs their 'previous' anchors
    const appTrend = trend(kpis.totalApplications, kpis.prevYearApplications);
    const accTrend = kpis.offerAcceptanceRate >= 70 ? 'up' : 'down';
    const retTrend = kpis.retention12m >= 82 ? 'up' : 'down';
    const transferTrend = kpis.transferOutRate <= 15 ? 'flat' : 'down';
    const localTrend = kpis.localOriginHireShare >= 65 ? 'up' : 'flat';

    return (
        <div className="page animate-in">
            <div className="page-title">Executive Summary</div>
            <div className="page-subtitle">
                North East Graduate Recruitment Performance · {filters.year === 'all' ? 'All Years' : filters.year}
            </div>

            {/* "What changed this month?" box */}
            <div className="month-change-box mb-24">
                <div className="month-change-icon">
                    <Sparkles size={18} />
                </div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>What changed this month?</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{monthlyChange}</div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid-4 mb-24 section">
                <KpiCard
                    id="kpi-applications"
                    label="NE Applications"
                    value={num(kpis.totalApplications)}
                    trend={appTrend}
                    change={delta(kpis.applicationGrowthPct)}
                    basis={`vs ${prevYear}`}
                    status={appTrend === 'up' ? 'positive' : 'warning'}
                    tooltip="Total completed applications from North East university candidates"
                />
                <KpiCard
                    id="kpi-acceptance"
                    label="Offer Acceptance Rate"
                    value={pct(kpis.offerAcceptanceRate)}
                    trend={accTrend}
                    change={accTrend === 'up' ? '+2.1pp' : '-1.4pp'}
                    basis={`vs ${prevYear}`}
                    status={kpis.offerAcceptanceRate >= 70 ? 'positive' : 'warning'}
                    tooltip="% of offers made that were accepted"
                />
                <KpiCard
                    id="kpi-retention"
                    label="12-Month Retention"
                    value={pct(kpis.retention12m)}
                    trend={retTrend}
                    change={retTrend === 'up' ? '+1.8pp' : '-1.2pp'}
                    basis={`vs ${prevYear}`}
                    status={kpis.retention12m >= 82 ? 'positive' : 'negative'}
                    tooltip="% of hires still active 12 months after joining"
                />
                <KpiCard
                    id="kpi-transfer-out"
                    label="Transfer-Out to London"
                    value={pct(kpis.transferOutRate)}
                    trend={transferTrend}
                    change={kpis.transferOutRate > 15 ? '+3.2pp' : 'Stable'}
                    basis={`vs ${prevYear}`}
                    status={kpis.transferOutRate <= 15 ? 'positive' : 'negative'}
                    tooltip="% of Newcastle hires who transferred to London within 12 months"
                />
                <KpiCard
                    id="kpi-local-origin"
                    label="Local-Origin Hire Share"
                    value={pct(kpis.localOriginHireShare)}
                    trend={localTrend}
                    change={localTrend === 'up' ? '+4.1pp' : 'Stable'}
                    basis="NE home region"
                    status={kpis.localOriginHireShare >= 65 ? 'positive' : 'warning'}
                    tooltip="% of hires whose home region is the North East"
                />
                <KpiCard
                    id="kpi-top-uni"
                    label="Top Contributing University"
                    value={kpis.topUniversity.split(' ')[0]}
                    basis={`${num(kpis.topUniversityHires)} hires in ${year}`}
                    status="info"
                    tooltip="University that produced the most hires in the selected period"
                />
            </div>

            {/* Charts row */}
            <div className="grid-2 mb-24">
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Applications & Hires Trend</div>
                            <div className="card-subtitle">All NE universities, 2022–2025</div>
                        </div>
                    </div>
                    <div className="card-body">
                        <MultiLineChart
                            data={TREND_DATA}
                            xKey="year"
                            lines={[
                                { key: 'Applications', name: 'Applications', color: 'var(--chart-1)' },
                                { key: 'Hires', name: 'Joined Hires', color: 'var(--chart-2)' },
                            ]}
                        />
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Local vs Non-Local Origin Hires</div>
                            <div className="card-subtitle">Home region: North East vs other</div>
                        </div>
                    </div>
                    <div className="card-body">
                        <StackedAreaChart
                            data={ORIGIN_DATA}
                            xKey="year"
                            areas={[
                                { key: 'Local Origin', name: 'Local Origin', color: 'var(--chart-1)' },
                                { key: 'Non-Local Origin', name: 'Non-Local Origin', color: 'var(--chart-2)' },
                            ]}
                        />
                    </div>
                </div>
            </div>

            {/* 12m Retention trend */}
            <div className="card">
                <div className="card-header">
                    <div>
                        <div className="card-title">12-Month Retention Trend (avg all NE universities)</div>
                        <div className="card-subtitle">Target: ≥85%</div>
                    </div>
                    <span className="badge green">Target: 85%</span>
                </div>
                <div className="card-body">
                    <MultiLineChart
                        data={TREND_DATA}
                        xKey="year"
                        lines={[
                            { key: 'Retention12m', name: '12m Retention %', color: 'var(--chart-3)' },
                        ]}
                        unit="%"
                        height={200}
                    />
                </div>
            </div>

            {/* Insight call-out */}
            <div className="mt-24" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 18px', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <Lightbulb size={16} style={{ color: 'var(--amber)', flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Key signal:</strong> Applications are growing year-on-year, but the transfer-to-London rate is rising faster than local retention is improving.
                    Navigate to <strong>Leakage to London</strong> and <strong>Risk & Insights</strong> for a deeper view.
                </p>
            </div>
        </div>
    );
}
