// ============================================================
// PAGE: University Landscape (Unified)
// TOP:    Cross-university comparison view
// BOTTOM: Selected university drill-down (replaces Scorecard)
// ============================================================

import { useState } from 'react';
import { MultiBarChart, HorizontalBarChart, MultiLineChart, DonutChart, StackedAreaChart } from '../components/charts/Charts';
import KpiCard from '../components/ui/KpiCard';
import { UNIVERSITIES } from '../data/universities';
import { RETENTION_DATA } from '../data/retention';
import { useFilters } from '../hooks/useFilters';
import { calcExecKPIs, pct, num, delta, trend } from '../utils/metrics';

const UNI_COLORS: Record<string, string> = {
    newcastle: '#a100ff',
    northumbria: '#00c8ff',
    durham: '#22c55e',
    teesside: '#f59e0b',
    sunderland: '#ff6b6b',
};
const UNI_COLORS_ARR = ['#a100ff', '#00c8ff', '#22c55e', '#f59e0b', '#ff6b6b'];
const SUBJECTS = ['Business & Management', 'Computing', 'Engineering & Technology', 'Mathematical Sciences'];
const DEGREE_COLORS = ['#a100ff', '#7b00cc', '#4d0099', '#220044'];

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

// ─── Section divider ──────────────────────────────────────────
function SectionDivider({ label }: { label: string }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 12, margin: '32px 0 20px',
        }}>
            <div style={{
                padding: '6px 14px', background: 'rgba(161,0,255,0.12)',
                border: '1px solid rgba(161,0,255,0.3)', borderRadius: 6,
                fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
                color: 'var(--accent)', textTransform: 'uppercase',
            }}>{label}</div>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>
    );
}

export default function UniversityLandscape() {
    const { filters } = useFilters();
    const [activeSubject, setActiveSubject] = useState<string>('all');
    // Set default view to 'all' to show aggregated executive summary metrics first
    const [selectedUniId, setSelectedUniId] = useState<string>('all');

    const year = filters.year === 'all' ? 2024 : (filters.year as number);
    const retentionYear = Math.min(year, 2024);

    // ── Cross-university comparison data ──────────────────────
    const tableData = UNIVERSITIES
        .filter((u) => filters.universityId === 'all' || u.id === filters.universityId)
        .map((u, i) => {
            const yData = u.data.find((d) => d.year === year) ?? u.data[u.data.length - 1];
            const retention = RETENTION_DATA.find((r) => r.universityId === u.id && r.year === retentionYear)
                ?? RETENTION_DATA.filter((r) => r.universityId === u.id).at(-1)!;
            const totalRelevantStudents = yData.subjectVolumes.reduce((s, sv) => s + sv.students, 0);
            const localOriginPct = retention
                ? Math.round((retention.localOriginHires / retention.totalHires) * 100) : 0;
            const conversion = totalRelevantStudents > 0
                ? ((yData.graduatesToAccenture / totalRelevantStudents) * 100) : 0;
            const lri = retention?.avgLocalRetentionIndex ?? 0;
            const dc = yData.degreeClassifications;
            return {
                id: u.id, name: u.name, shortName: u.shortName,
                color: UNI_COLORS_ARR[i], rankingUK: u.rankingUK,
                progressionRate: yData.progressionRate, employabilityScore: yData.employabilityScore,
                graduatesToAccenture: yData.graduatesToAccenture,
                totalRelevantStudents, subjectVolumes: yData.subjectVolumes,
                localOriginPct, retention12m: retention?.retention12m ?? 0,
                lri, conversion,
                degreeFirstClass: dc.firstClass, degreeTwoOne: dc.twoOne,
            };
        });

    const subjectChartData = SUBJECTS.map((subj) => {
        const row: Record<string, string | number> = { subject: subj.split(' ')[0] };
        tableData.forEach((u) => {
            const sv = u.subjectVolumes.find((s) => s.subject === subj);
            row[u.shortName] = sv?.students ?? 0;
        });
        return row;
    });

    const accentureData = [...tableData]
        .sort((a, b) => b.graduatesToAccenture - a.graduatesToAccenture)
        .map((u) => ({ name: u.shortName, Hires: u.graduatesToAccenture }));

// ── Selected university drill-down data (only if not 'all') ───────────────────
    const selUni = selectedUniId !== 'all' ? UNIVERSITIES.find((u) => u.id === selectedUniId) : null;
    const selColor = selectedUniId !== 'all' ? (UNI_COLORS[selectedUniId] ?? 'var(--accent)') : 'var(--accent)';
    const selRetData = selectedUniId !== 'all' ? RETENTION_DATA.filter((r) => r.universityId === selectedUniId) : [];

    const selLatestData = selUni ? selUni.data[selUni.data.length - 1] : null;

    const hireTrendData = selRetData.map((r) => ({
        year: String(r.year),
        Hires: r.totalHires,
        'Retention 12m': r.retention12m,
    }));

    const dc = selLatestData ? selLatestData.degreeClassifications : null;
    const degreeDonutData = dc ? [
        { name: '1st Class', value: dc.firstClass, color: DEGREE_COLORS[0] },
        { name: '2:1', value: dc.twoOne, color: DEGREE_COLORS[1] },
        { name: '2:2', value: dc.twoTwo, color: DEGREE_COLORS[2] },
        { name: '3rd / Pass', value: dc.thirdOrPass, color: DEGREE_COLORS[3] },
    ] : [];
    const firstAndTwoOne = dc ? dc.firstClass + dc.twoOne : 0;

    // ── Metrics ─────────────────────
    const isAll = selectedUniId === 'all';
    const activeFilters = { ...filters, universityId: isAll ? filters.universityId : selectedUniId };
    const kpis = calcExecKPIs(activeFilters);
    const prevYear = (year as number) - 1;
    const appTrend = trend(kpis.totalApplications, kpis.prevYearApplications);
    const accTrend = kpis.offerAcceptanceRate >= 70 ? 'up' : 'down';
    const retTrend = kpis.retention12m >= 82 ? 'up' : 'down';
    const transferTrend = kpis.transferOutRate <= 15 ? 'flat' : 'down';
    const localTrend = kpis.localOriginHireShare >= 65 ? 'up' : 'flat';

    return (
        <div className="page animate-in">

            {/* ════════════════════════════════════════════════
                SECTION 1: CROSS-UNIVERSITY COMPARISON
            ════════════════════════════════════════════════ */}
            <SectionDivider label="Cross-University Comparison" />

            {/* Legend strip */}
            <div style={{
                display: 'flex', gap: 8, marginBottom: 20,
                padding: '10px 16px', background: 'var(--surface-2)',
                borderRadius: 8, border: '1px solid var(--border)',
                flexWrap: 'wrap', alignItems: 'center',
            }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginRight: 4 }}>UNIVERSITIES:</span>
                {tableData.map((u) => (
                    <span key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: u.color, display: 'inline-block' }} />
                        {u.shortName}
                        <span style={{
                            fontSize: 10, padding: '1px 5px',
                            background: 'var(--surface)', border: '1px solid var(--border)',
                            borderRadius: 4, color: 'var(--text-muted)',
                        }}>UK #{u.rankingUK}</span>
                    </span>
                ))}
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    UK ranking shown as context only
                </span>
            </div>

            {/* ── University Profile: selector + header card + KPIs ── */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
                <button
                    className={`btn btn-sm ${selectedUniId === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    style={selectedUniId === 'all' ? { background: '#ffffff', color: '#000' } : {}}
                    onClick={() => setSelectedUniId('all')}
                >
                    All Universities
                </button>
                <span style={{ color: 'var(--border)', margin: '0 4px', alignSelf: 'center' }}>|</span>
                {UNIVERSITIES.map((u) => (
                    <button
                        key={u.id}
                        className={`btn btn-sm ${selectedUniId === u.id ? 'btn-primary' : 'btn-secondary'}`}
                        style={selectedUniId === u.id ? { background: UNI_COLORS[u.id] } : {}}
                        onClick={() => setSelectedUniId(u.id)}
                        id={`tab-${u.id}`}
                    >
                        {u.shortName}
                    </button>
                ))}
            </div>


            {/* Unified KPI Grid for both All and Single Uni */}
            <div className="grid-4 mb-24 section">
                <KpiCard
                    id="kpi-applications"
                    label={isAll ? "NE Applications" : `${selUni?.shortName} Applications`}
                    value={num(kpis.totalApplications)}
                    trend={appTrend}
                    change={delta(kpis.applicationGrowthPct)}
                    basis={`vs ${prevYear}`}
                    status={appTrend === 'up' ? 'positive' : 'warning'}
                    tooltip={`Total completed applications from ${isAll ? 'North East' : selUni?.shortName} university candidates`}
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
                {isAll && (
                    <KpiCard
                        id="kpi-top-uni"
                        label="Top Contributing University"
                        value={kpis.topUniversity.split(' ')[0]}
                        basis={`${num(kpis.topUniversityHires)} hires in ${year}`}
                        status="info"
                        tooltip="University that produced the most hires in the selected period"
                    />
                )}
            </div>

            {isAll ? (
                <>

                    {/* Cross-university charts */}
                    <div className="grid-2 mb-24">
                        <div className="card">
                            <div className="card-header">
                                <div>
                                    <div className="card-title">Subject Volume by University</div>
                                    <div className="card-subtitle">Relevant student enrolments — size of addressable talent pool, {year}</div>
                                </div>
                                <div style={{ display: 'flex', gap: 5 }}>
                                    {['all', ...SUBJECTS].map((s) => (
                                        <button key={s} className={`btn btn-sm ${activeSubject === s ? 'btn-primary' : 'btn-secondary'}`}
                                            onClick={() => setActiveSubject(s)} style={{ fontSize: 10 }}>
                                            {s === 'all' ? 'All' : s.split(' ')[0]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="card-body">
                                <MultiBarChart data={subjectChartData} xKey="subject"
                                    bars={tableData.map((u) => ({ key: u.shortName, name: u.shortName, color: u.color }))} />
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <div>
                                    <div className="card-title">Quality of Talent Pool</div>
                                    <div className="card-subtitle">Progression rate vs employability score — graduate outcome quality</div>
                                </div>
                            </div>
                            <div className="card-body">
                                <MultiBarChart
                                    data={tableData.map((u) => ({ name: u.shortName, 'Progression Rate': u.progressionRate, 'Employability Score': u.employabilityScore }))}
                                    xKey="name"
                                    bars={[{ key: 'Progression Rate', name: 'Progression %', color: 'var(--chart-1)' }, { key: 'Employability Score', name: 'Employability Score', color: 'var(--chart-2)' }]}
                                    unit="%" />
                            </div>
                        </div>
                    </div>

                    <div className="card mb-8">
                        <div className="card-header">
                            <div>
                                <div className="card-title">Graduates Joining Accenture Newcastle</div>
                                <div className="card-subtitle">Actual hires by university, {year}</div>
                            </div>
                        </div>
                        <div className="card-body">
                            <HorizontalBarChart data={accentureData} yKey="name"
                                bars={[{ key: 'Hires', name: 'Joined Hires', color: 'var(--chart-1)' }]} height={180} />
                        </div>
                    </div>

                    <div className="grid-2 mb-20">
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
                </>
            ) : (
                <>

                    {/* Charts row 1: Hires trend + Degree donut */}
                    <div className="grid-2 mb-20">
                        <div className="card">
                            <div className="card-header">
                                <div>
                                    <div className="card-title">Hires & 12m Retention Trend</div>
                                    <div className="card-subtitle">How hiring volume and retention have evolved over time</div>
                                </div>
                            </div>
                            <div className="card-body">
                                <MultiLineChart data={hireTrendData} xKey="year"
                                    lines={[
                                        { key: 'Hires', name: 'Joined Hires', color: selColor },
                                        { key: 'Retention 12m', name: '12m Retention %', color: 'var(--chart-3)', dashed: true },
                                    ]} />
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <div>
                                    <div className="card-title">Degree Classifications (Offer Holders)</div>
                                    <div className="card-subtitle">Breakdown of degree results for students who received an Accenture offer</div>
                                </div>
                            </div>
                            <div className="card-body">
                                <DonutChart data={degreeDonutData} innerRadius={60} height={210}
                                    centerLabel="1st + 2:1" centerValue={`${firstAndTwoOne}%`} />
                                <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 8, flexWrap: 'wrap' }}>
                                    {degreeDonutData.map((d) => (
                                        <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                                            <span style={{ width: 10, height: 10, borderRadius: 2, background: d.color, display: 'inline-block' }} />
                                            <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                                            <span style={{ fontWeight: 700, color: d.color }}>{d.value}%</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{
                                    marginTop: 10, padding: '7px 12px',
                                    background: 'rgba(161,0,255,0.06)', border: '1px solid rgba(161,0,255,0.15)',
                                    borderRadius: 6, fontSize: 11, color: 'var(--text-muted)', textAlign: 'center',
                                }}>
                                    <strong style={{ color: firstAndTwoOne >= 80 ? 'var(--green)' : firstAndTwoOne >= 70 ? 'var(--amber)' : 'var(--red)' }}>
                                        {firstAndTwoOne}%
                                    </strong> of offer holders hold a 1st or 2:1 —{' '}
                                    {firstAndTwoOne >= 80 ? 'strong academic calibre' : firstAndTwoOne >= 70 ? 'solid pipeline quality' : 'below benchmark — review selection criteria'}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Page insight */}
            <div style={{
                marginTop: 24, padding: '14px 18px', background: 'rgba(161,0,255,0.06)',
                border: '1px solid rgba(161,0,255,0.2)', borderRadius: 10,
                display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
                <span style={{ fontSize: 16, marginTop: 1 }}>💡</span>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7 }}>
                    <strong>How to use this page:</strong> Select any university from the tabs above
                    to load its full profile metrics. The charts below compare all universities side-by-side,
                    while the trend and degree charts focus deeply on your selected institution.
                </div>
            </div>
        </div>
    );
}
