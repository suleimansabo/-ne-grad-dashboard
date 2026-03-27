// ============================================================
// PAGE: University Landscape (Unified)
// TOP:    Cross-university comparison view
// BOTTOM: Selected university drill-down (replaces Scorecard)
// ============================================================

import { useState } from 'react';
import { MultiBarChart, HorizontalBarChart, MultiLineChart, DonutChart } from '../components/charts/Charts';
import { UNIVERSITIES } from '../data/universities';
import { RETENTION_DATA } from '../data/retention';
import { useFilters } from '../hooks/useFilters';
import { getLRIByUniversity } from '../utils/metrics';

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

const UNI_PROFILES: Record<string, string> = {
    newcastle: 'Russell Group · research-intensive · strong STEM and Business pipeline',
    northumbria: 'Post-92 · large graduate output · high local-origin share · volume pipeline',
    durham: 'Russell Group · highest academic calibre in region · selective but strong retention',
    teesside: 'Post-92 · applied focus · strong Computing and Engineering · high local community ties',
    sunderland: 'Post-92 · underutilised pipeline · high local-origin · growing employability scores',
};

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
    const [selectedUniId, setSelectedUniId] = useState<string>('northumbria');

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

    // ── Selected university drill-down data ───────────────────
    const selUni = UNIVERSITIES.find((u) => u.id === selectedUniId)!;
    const selColor = UNI_COLORS[selectedUniId] ?? 'var(--accent)';
    const selRetData = RETENTION_DATA.filter((r) => r.universityId === selectedUniId);
    const selLRI = getLRIByUniversity('all').find((l) => l.universityId === selectedUniId);
    const selLatestData = selUni.data[selUni.data.length - 1];
    const selLatestRet = selRetData[selRetData.length - 1];

    const hireTrendData = selRetData.map((r) => ({
        year: String(r.year),
        Hires: r.totalHires,
        'Retention 12m': r.retention12m,
    }));

    const dc = selLatestData.degreeClassifications;
    const degreeDonutData = [
        { name: '1st Class', value: dc.firstClass, color: DEGREE_COLORS[0] },
        { name: '2:1', value: dc.twoOne, color: DEGREE_COLORS[1] },
        { name: '2:2', value: dc.twoTwo, color: DEGREE_COLORS[2] },
        { name: '3rd / Pass', value: dc.thirdOrPass, color: DEGREE_COLORS[3] },
    ];
    const firstAndTwoOne = dc.firstClass + dc.twoOne;

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
                <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center', fontStyle: 'italic' }}>
                    Select a university to view its profile
                </span>
            </div>

            {/* Profile header */}
            <div className="card mb-20" style={{ borderTop: `4px solid ${selColor}` }}>
                <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 24, alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 20, fontWeight: 800 }}>{selUni.name}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
                                {selUni.location} · UK Ranking #{selUni.rankingUK}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontStyle: 'italic' }}>
                                {UNI_PROFILES[selectedUniId]}
                            </div>
                        </div>
                        {[
                            { label: 'Total Students', value: selLatestData.totalStudents.toLocaleString() },
                            { label: 'Employability Score', value: `${selLatestData.employabilityScore}/100` },
                            { label: 'Progression Rate', value: `${selLatestData.progressionRate}%` },
                        ].map((stat) => (
                            <div key={stat.label} style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 28, fontWeight: 800, color: selColor }}>{stat.value}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* KPI row */}
            {selLatestRet && (
                <div className="grid-4 mb-20">
                    {[
                        { label: 'Total Hires (Latest)', value: String(selLatestRet.totalHires), status: 'positive' as const },
                        { label: '12m Retention', value: `${selLatestRet.retention12m}%`, status: selLatestRet.retention12m >= 82 ? 'positive' as const : 'warning' as const },
                        { label: '24m Retention', value: `${selLatestRet.retention24m}%`, status: selLatestRet.retention24m >= 65 ? 'positive' as const : 'warning' as const },
                        { label: 'Avg LRI Score', value: selLRI ? String(selLRI.avgLRI) : '—', status: (selLRI?.avgLRI ?? 0) >= 70 ? 'positive' as const : 'warning' as const },
                    ].map((k) => (
                        <div key={k.label} className={`kpi-card ${k.status}`} style={{ borderTopColor: selColor }}>
                            <div className="kpi-label">{k.label}</div>
                            <div className="kpi-value">{k.value}</div>
                        </div>
                    ))}
                </div>
            )}

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
