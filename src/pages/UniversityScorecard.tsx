// ============================================================
// PAGE: University Scorecard — profile of one selected university
// Purpose: DRILL-DOWN — trends, subject mix, retention detail, degree quality
// Answers: What is happening at one university? How has it changed over time?
// ============================================================

import { useState } from 'react';
import { UNIVERSITIES } from '../data/universities';
import { RETENTION_DATA } from '../data/retention';
import { CAMPAIGNS } from '../data/campaigns';
import { MultiLineChart, MultiBarChart, DonutChart } from '../components/charts/Charts';
import { getLRIByUniversity } from '../utils/metrics';

const UNI_COLORS: Record<string, string> = {
    newcastle: '#a100ff',
    northumbria: '#00c8ff',
    durham: '#22c55e',
    teesside: '#f59e0b',
    sunderland: '#ff6b6b',
};

// Purple-toned degree colours matching the screenshot style
const DEGREE_COLORS = ['#a100ff', '#7b00cc', '#4d0099', '#220044'];

const UNI_PROFILES: Record<string, string> = {
    newcastle: 'Russell Group · research-intensive · strong STEM and Business pipeline',
    northumbria: 'Post-92 · large graduate output · high local-origin share · volume pipeline',
    durham: 'Russell Group · highest academic calibre in region · selective but strong retention',
    teesside: 'Post-92 · applied focus · strong Computing and Engineering · high local community ties',
    sunderland: 'Post-92 · underutilised pipeline · high local-origin · growing employability scores',
};

export default function UniversityScorecard() {
    const [selectedUniId, setSelectedUniId] = useState('northumbria');
    const uni = UNIVERSITIES.find((u) => u.id === selectedUniId)!;
    const color = UNI_COLORS[selectedUniId] ?? 'var(--accent)';

    const retData = RETENTION_DATA.filter((r) => r.universityId === selectedUniId);
    const camps = CAMPAIGNS.filter((c) => c.universityId === selectedUniId);
    const lriData = getLRIByUniversity('all').find((l) => l.universityId === selectedUniId);

    // Latest year data
    const latestData = uni.data[uni.data.length - 1];
    const latest = retData[retData.length - 1];

    // Hires & retention trend
    const trendData = retData.map((r) => ({
        year: String(r.year),
        Hires: r.totalHires,
        'Retention 12m': r.retention12m,
        'Local Origin %': r.localOriginHires > 0 ? Math.round((r.localOriginHires / r.totalHires) * 100) : 0,
    }));

    // Subject volumes for latest year
    const subjectData = latestData.subjectVolumes.map((sv) => ({
        subject: sv.subject.split(' ')[0],
        Students: sv.students,
        'Grad Employed %': sv.graduatesEmployedPct,
    }));

    // Local vs non-local retention
    const localVsNonLocalData = retData.map((r) => ({
        year: String(r.year),
        'Local Origin 12m': r.localRetention12m,
        'Non-Local 12m': r.nonLocalRetention12m,
    }));

    // Degree classification donut — offer holders for latest year
    const dc = latestData.degreeClassifications;
    const degreeDonutData = [
        { name: '1st Class', value: dc.firstClass, color: DEGREE_COLORS[0] },
        { name: '2:1', value: dc.twoOne, color: DEGREE_COLORS[1] },
        { name: '2:2', value: dc.twoTwo, color: DEGREE_COLORS[2] },
        { name: '3rd / Pass', value: dc.thirdOrPass, color: DEGREE_COLORS[3] },
    ];
    const firstAndTwoOne = dc.firstClass + dc.twoOne;

    return (
        <div className="page animate-in">
            <div className="page-title">University Scorecard</div>
            <div className="page-subtitle">Deep-dive profile for one university · trends · subject mix · retention detail</div>

            {/* ── University selector ── */}
            <div className="flex-center gap-8 mb-24">
                {UNIVERSITIES.map((u) => (
                    <button
                        key={u.id}
                        className={`btn btn-sm ${selectedUniId === u.id ? 'btn-primary' : 'btn-secondary'}`}
                        style={selectedUniId === u.id ? { background: UNI_COLORS[u.id] } : {}}
                        onClick={() => setSelectedUniId(u.id)}
                        id={`scorecard-${u.id}`}
                    >
                        {u.shortName}
                    </button>
                ))}
            </div>

            {/* ── Profile header card ── */}
            <div className="card mb-24" style={{ borderTop: `4px solid ${color}` }}>
                <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 24, alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 20, fontWeight: 800 }}>{uni.name}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
                                {uni.location} · UK Ranking #{uni.rankingUK}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontStyle: 'italic' }}>
                                {UNI_PROFILES[selectedUniId]}
                            </div>
                        </div>
                        {[
                            { label: 'Total Students', value: latestData.totalStudents.toLocaleString() },
                            { label: 'Employability Score', value: `${latestData.employabilityScore}/100` },
                            { label: 'Progression Rate', value: `${latestData.progressionRate}%` },
                        ].map((stat) => (
                            <div key={stat.label} style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 28, fontWeight: 800, color }}>{stat.value}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── KPI row ── */}
            {latest && (
                <div className="grid-4 mb-24">
                    {[
                        { label: 'Total Hires (Latest)', value: String(latest.totalHires), status: 'positive' as const },
                        { label: '12m Retention', value: `${latest.retention12m}%`, status: latest.retention12m >= 82 ? 'positive' as const : 'warning' as const },
                        { label: '24m Retention', value: `${latest.retention24m}%`, status: latest.retention24m >= 65 ? 'positive' as const : 'warning' as const },
                        { label: 'Avg LRI Score', value: lriData ? String(lriData.avgLRI) : '—', status: (lriData?.avgLRI ?? 0) >= 70 ? 'positive' as const : 'warning' as const },
                    ].map((k) => (
                        <div key={k.label} className={`kpi-card ${k.status}`} style={{ borderTopColor: color }}>
                            <div className="kpi-label">{k.label}</div>
                            <div className="kpi-value">{k.value}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Charts row 1: Hires & Retention Trend + Degree Classification Donut ── */}
            <div className="grid-2 mb-24">
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Hires & 12m Retention Trend</div>
                            <div className="card-subtitle">How hiring volume and retention have evolved over time</div>
                        </div>
                    </div>
                    <div className="card-body">
                        <MultiLineChart
                            data={trendData}
                            xKey="year"
                            lines={[
                                { key: 'Hires', name: 'Joined Hires', color },
                                { key: 'Retention 12m', name: '12m Retention %', color: 'var(--chart-3)', dashed: true },
                            ]}
                        />
                    </div>
                </div>

                {/* Degree classification donut — matching the screenshot style */}
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Degree Classifications (Offer Holders)</div>
                            <div className="card-subtitle">Breakdown of degree results for students who received an Accenture offer</div>
                        </div>
                    </div>
                    <div className="card-body">
                        <DonutChart
                            data={degreeDonutData}
                            innerRadius={60}
                            height={220}
                            centerLabel="1st + 2:1"
                            centerValue={`${firstAndTwoOne}%`}
                        />
                        {/* Legend row matching screenshot */}
                        <div style={{
                            display: 'flex', justifyContent: 'center', gap: 16,
                            marginTop: 8, flexWrap: 'wrap',
                        }}>
                            {degreeDonutData.map((d) => (
                                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                                    <span style={{ width: 10, height: 10, borderRadius: 2, background: d.color, display: 'inline-block' }} />
                                    <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                                    <span style={{ fontWeight: 700, color: d.color }}>{d.value}%</span>
                                </div>
                            ))}
                        </div>
                        <div style={{
                            marginTop: 12, padding: '8px 12px',
                            background: 'rgba(161,0,255,0.06)', border: '1px solid rgba(161,0,255,0.15)',
                            borderRadius: 6, fontSize: 11, color: 'var(--text-muted)', textAlign: 'center',
                        }}>
                            <strong style={{ color: firstAndTwoOne >= 80 ? 'var(--green)' : firstAndTwoOne >= 70 ? 'var(--amber)' : 'var(--red)' }}>
                                {firstAndTwoOne}%
                            </strong> of offer holders hold a 1st Class or 2:1 —{' '}
                            {firstAndTwoOne >= 80 ? 'strong academic calibre' : firstAndTwoOne >= 70 ? 'solid pipeline quality' : 'below benchmark — review selection criteria'}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Charts row 2: Subject Volumes + Local vs Non-Local Retention ── */}
            <div className="grid-2 mb-24">
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Subject Volumes ({latestData.year})</div>
                            <div className="card-subtitle">Student enrolments by relevant subject area</div>
                        </div>
                    </div>
                    <div className="card-body">
                        <MultiBarChart
                            data={subjectData}
                            xKey="subject"
                            bars={[{ key: 'Students', name: 'Students', color }]}
                        />
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Local vs Non-Local Origin Retention</div>
                            <div className="card-subtitle">12-month retention gap over time — local hires retain stronger</div>
                        </div>
                    </div>
                    <div className="card-body">
                        <MultiLineChart
                            data={localVsNonLocalData}
                            xKey="year"
                            lines={[
                                { key: 'Local Origin 12m', name: 'Local Origin', color: 'var(--chart-3)' },
                                { key: 'Non-Local 12m', name: 'Non-Local Origin', color: 'var(--chart-5)' },
                            ]}
                            unit="%"
                        />
                    </div>
                </div>
            </div>

            {/* ── Campaigns table ── */}
            {camps.length > 0 && (
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Associated Campaigns</div>
                        <div className="card-subtitle">Cost, applications, hires, and 12m retention per campaign</div>
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Campaign</th>
                                    <th>Year</th>
                                    <th>Spend</th>
                                    <th>Applications</th>
                                    <th>Joined</th>
                                    <th>Retained 12m</th>
                                    <th>£ / Retained</th>
                                </tr>
                            </thead>
                            <tbody>
                                {camps.map((c) => (
                                    <tr key={c.id}>
                                        <td style={{ fontWeight: 600 }}>{c.name}</td>
                                        <td>{c.year}</td>
                                        <td>£{c.estimatedCost.toLocaleString()}</td>
                                        <td>{c.applicationsGenerated}</td>
                                        <td>{c.joinedHires}</td>
                                        <td>
                                            <span className={`badge ${c.retention12mPct >= 85 ? 'green' : 'amber'}`}>
                                                {c.retainedHires} ({c.retention12mPct}%)
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 700 }}>£{c.costPerRetainedHire.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
