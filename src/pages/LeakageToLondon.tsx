// ============================================================
// PAGE: Leakage to London
// ============================================================

import { StackedAreaChart, MultiBarChart } from '../components/charts/Charts';
import { LEAKAGE_SUMMARY, FLOW_DATA, TRANSFERS } from '../data/transfers';
import { HIRES } from '../data/hires';
import KpiCard from '../components/ui/KpiCard';
import { useFilters } from '../hooks/useFilters';

export default function LeakageToLondon() {
    const { filters } = useFilters();
    const year = filters.year === 'all' ? 2024 : (filters.year as number);
    const summary = LEAKAGE_SUMMARY.find((l) => l.year === year) ?? LEAKAGE_SUMMARY[LEAKAGE_SUMMARY.length - 2];

    // Origin breakdown for selected year  
    const hires = HIRES.filter((h) => filters.year === 'all' || h.year === year);
    const londonSEOrigin = hires.filter((h) => h.homeRegion === 'London' || h.homeRegion === 'South East').length;
    const neOrigin = hires.filter((h) => h.homeRegion === 'North East').length;
    const otherOrigin = hires.length - londonSEOrigin - neOrigin;

    // Transfer breakdown by university
    const transfersByUni: Record<string, { total: number; approved: number; pending: number }> = {};
    TRANSFERS.filter((t) => filters.year === 'all' || t.year === year).forEach((t) => {
        if (!transfersByUni[t.originUniversity]) transfersByUni[t.originUniversity] = { total: 0, approved: 0, pending: 0 };
        transfersByUni[t.originUniversity].total++;
        if (t.approved) transfersByUni[t.originUniversity].approved++;
        else transfersByUni[t.originUniversity].pending++;
    });

    // Stacked bar: stay NE vs transfer London by year
    const flowChartData = FLOW_DATA.map((f) => ({
        year: String(f.year),
        'Stay Newcastle': f.stayNewcastle,
        'Transfer London': f.transferLondon,
        'Left Accenture': f.left,
        'Other Office': f.otherTransfer,
    }));

    // Area chart: feeder index trend
    const feederTrend = LEAKAGE_SUMMARY.filter((l) => l.year <= 2024).map((l) => ({
        year: String(l.year),
        'Feeder Index (%)': l.feederIndexPct,
        'London/SE Origin (%)': l.totalNEHires > 0 ? Math.round((l.hiresFromLondonSE / l.totalNEHires) * 100) : 0,
    }));

    const feederIndex = summary.feederIndexPct;
    const feederStatus = feederIndex <= 15 ? 'positive' : feederIndex <= 20 ? 'warning' : 'negative';
    const still12mPct = summary.totalNEHires > 0 ? Math.round((summary.hiresStillInNE12m / summary.totalNEHires) * 100) : 0;

    return (
        <div className="page animate-in">
            <div className="page-title">Leakage to London</div>
            <div className="page-subtitle">
                Analysing whether Newcastle is acting as a stepping-stone to London · {year}
            </div>

            {/* KPIs */}
            <div className="grid-4 mb-24">
                <KpiCard
                    id="kpi-feeder-index"
                    label="Feeder Index"
                    value={`${feederIndex}%`}
                    trend={feederStatus === 'positive' ? 'flat' : 'down'}
                    change={feederIndex > 15 ? '+3pp vs prev year' : 'Stable'}
                    basis="% leaving for London within 24m"
                    status={feederStatus}
                    tooltip="% of Newcastle hires that ended up in London within 24 months of joining"
                />
                <KpiCard
                    id="kpi-ne-still-12m"
                    label="Still in NE at 12m"
                    value={`${still12mPct > 0 ? still12mPct : '—'}%`}
                    basis={`${summary.hiresStillInNE12m} of ${summary.totalNEHires} hires`}
                    status={still12mPct >= 80 ? 'positive' : 'warning'}
                    tooltip="% of Newcastle hires still in the NE office 12 months after joining"
                />
                <KpiCard
                    id="kpi-london-se-origin"
                    label="London/SE Origin"
                    value={`${summary.totalNEHires > 0 ? Math.round((summary.hiresFromLondonSE / summary.totalNEHires) * 100) : 0}%`}
                    trend="down"
                    change="Rising"
                    basis="of Newcastle hires"
                    status={summary.hiresFromLondonSE / summary.totalNEHires > 0.2 ? 'negative' : 'warning'}
                    tooltip="% of Newcastle hires who originally came from London or the South East"
                />
                <KpiCard
                    id="kpi-pending-transfers"
                    label="Pending Transfers"
                    value={String(summary.transferRequestsPending)}
                    basis="awaiting approval"
                    trend="down"
                    change="Increasing"
                    status={summary.transferRequestsPending > 10 ? 'negative' : 'warning'}
                    tooltip="Current open transfer requests to London"
                />
            </div>

            {/* Flow chart */}
            <div className="grid-2 mb-24">
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Newcastle Hire Destination (24-Month View)</div>
                            <div className="card-subtitle">Where do Newcastle hires end up?</div>
                        </div>
                    </div>
                    <div className="card-body">
                        <MultiBarChart
                            data={flowChartData}
                            xKey="year"
                            bars={[
                                { key: 'Stay Newcastle', name: 'Stay Newcastle', color: 'var(--chart-1)' },
                                { key: 'Transfer London', name: 'Transfer London', color: 'var(--chart-5)' },
                                { key: 'Other Office', name: 'Other Office', color: 'var(--chart-4)' },
                                { key: 'Left Accenture', name: 'Left Accenture', color: 'var(--text-muted)' },
                            ]}
                        />
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Feeder Index Trend</div>
                            <div className="card-subtitle">Newcastle → London over time</div>
                        </div>
                    </div>
                    <div className="card-body">
                        <StackedAreaChart
                            data={feederTrend}
                            xKey="year"
                            areas={[
                                { key: 'London/SE Origin (%)', name: 'London/SE Origin %', color: 'var(--chart-5)' },
                                { key: 'Feeder Index (%)', name: 'Feeder Index %', color: 'var(--chart-4)' },
                            ]}
                            unit="%"
                        />
                    </div>
                </div>
            </div>

            {/* Origin breakdown and transfer table */}
            <div className="grid-2 mb-24">
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Hire Origin Breakdown ({year})</div>
                    </div>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[
                            { label: 'North East Origin', count: neOrigin, total: hires.length, color: 'var(--green)' },
                            { label: 'London / South East', count: londonSEOrigin, total: hires.length, color: 'var(--red)' },
                            { label: 'Other Regions', count: otherOrigin, total: hires.length, color: 'var(--amber)' },
                        ].map((s) => (
                            <div key={s.label}>
                                <div className="flex-between" style={{ marginBottom: 6 }}>
                                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.label}</span>
                                    <span style={{ fontWeight: 700, color: s.color }}>{s.count} ({s.total > 0 ? Math.round((s.count / s.total) * 100) : 0}%)</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: s.total > 0 ? `${(s.count / s.total) * 100}%` : '0%', background: s.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Transfer Requests by University</div>
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>University</th>
                                    <th>Total Requests</th>
                                    <th>Approved</th>
                                    <th>Pending / Denied</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(transfersByUni).length === 0 ? (
                                    <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>No transfers for selected filters</td></tr>
                                ) : Object.entries(transfersByUni).map(([uni, d]) => (
                                    <tr key={uni}>
                                        <td style={{ fontWeight: 600 }}>{uni.split(' ')[0]}</td>
                                        <td>{d.total}</td>
                                        <td><span className="badge red">{d.approved}</span></td>
                                        <td><span className="badge amber">{d.pending}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Warning callout */}
            {feederIndex > 20 && (
                <div style={{ background: 'var(--red-light)', border: '1px solid var(--red)', borderRadius: 'var(--radius)', padding: '14px 18px', fontSize: 13, color: 'var(--text-primary)' }}>
                    ⚠️ <strong>Alert:</strong> The feeder index has exceeded 20%. Newcastle may be functioning as a training ground for London rather than a genuine talent base. Immediate attention to local career pathing and retention incentives is recommended.
                </div>
            )}
        </div>
    );
}
