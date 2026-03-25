// ============================================================
// PAGE: University Scorecard (drill-down for one university)
// ============================================================

import { useState } from 'react';
import { UNIVERSITIES } from '../data/universities';
import { RETENTION_DATA } from '../data/retention';
import { CAMPAIGNS } from '../data/campaigns';
import { MultiLineChart, MultiBarChart } from '../components/charts/Charts';
import { getLRIByUniversity } from '../utils/metrics';

const UNI_COLORS: Record<string, string> = {
    newcastle: '#a100ff',
    northumbria: '#00c8ff',
    durham: '#22c55e',
    teesside: '#f59e0b',
    sunderland: '#ff6b6b',
};

export default function UniversityScorecard() {
    const [selectedUniId, setSelectedUniId] = useState('northumbria');
    const uni = UNIVERSITIES.find((u) => u.id === selectedUniId)!;
    const color = UNI_COLORS[selectedUniId] ?? 'var(--accent)';

    const retData = RETENTION_DATA.filter((r) => r.universityId === selectedUniId);
    const camps = CAMPAIGNS.filter((c) => c.universityId === selectedUniId);
    const lriData = getLRIByUniversity('all').find((l) => l.universityId === selectedUniId);

    // Trend data for hires & retention
    const trendData = retData.map((r) => ({
        year: String(r.year),
        Hires: r.totalHires,
        'Retention 12m': r.retention12m,
        'Local Origin %': r.localOriginHires > 0 ? Math.round((r.localOriginHires / r.totalHires) * 100) : 0,
    }));

    // Subject volumes for latest year
    const latestData = uni.data[uni.data.length - 1];
    const subjectData = latestData.subjectVolumes.map((sv) => ({
        subject: sv.subject.split(' ')[0],
        Students: sv.students,
        'Grad Employed %': sv.graduatesEmployedPct,
    }));

    const latest = retData[retData.length - 1];

    return (
        <div className="page animate-in">
            <div className="page-title">University Scorecard</div>
            <div className="page-subtitle">Deep-dive view for a single university</div>

            {/* University selector */}
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

            {/* Header card */}
            <div className="card mb-24" style={{ borderTop: `4px solid ${color}` }}>
                <div className="card-body">
                    <div className="grid-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                        <div>
                            <div style={{ fontSize: 20, fontWeight: 800 }}>{uni.name}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
                                {uni.location} · UK Ranking #{uni.rankingUK}
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

            {/* KPI row */}
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

            <div className="grid-2 mb-24">
                {/* Hires & retention trend */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Hires & 12m Retention Trend</div>
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

                {/* Subject volumes */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Subject Volumes ({latestData.year})</div>
                    </div>
                    <div className="card-body">
                        <MultiBarChart
                            data={subjectData}
                            xKey="subject"
                            bars={[
                                { key: 'Students', name: 'Students', color },
                            ]}
                        />
                    </div>
                </div>
            </div>

            {/* Local vs non-local retention trend */}
            <div className="card mb-24">
                <div className="card-header">
                    <div className="card-title">Local vs Non-Local Origin Retention</div>
                    <div className="card-subtitle">12-month retention gap</div>
                </div>
                <div className="card-body">
                    <MultiLineChart
                        data={retData.map((r) => ({
                            year: String(r.year),
                            'Local Origin 12m': r.localRetention12m,
                            'Non-Local 12m': r.nonLocalRetention12m,
                        }))}
                        xKey="year"
                        lines={[
                            { key: 'Local Origin 12m', name: 'Local Origin', color: 'var(--chart-3)' },
                            { key: 'Non-Local 12m', name: 'Non-Local Origin', color: 'var(--chart-5)' },
                        ]}
                        unit="%"
                    />
                </div>
            </div>

            {/* Campaigns */}
            {camps.length > 0 && (
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Associated Campaigns</div>
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
