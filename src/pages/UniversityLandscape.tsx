// ============================================================
// PAGE: University Landscape → North East University Opportunity Map
// Answers: size of talent pool | quality of talent pool | retention potential
// ============================================================

import { useState } from 'react';
import { MultiBarChart, HorizontalBarChart } from '../components/charts/Charts';
import { UNIVERSITIES } from '../data/universities';
import { RETENTION_DATA } from '../data/retention';
import { useFilters } from '../hooks/useFilters';

const UNI_COLORS = ['#a100ff', '#00c8ff', '#22c55e', '#f59e0b', '#ff6b6b'];
const SUBJECTS = ['Business & Management', 'Computing', 'Engineering & Technology', 'Mathematical Sciences'];

// ─── Tooltip component ───────────────────────────────────────
function Tooltip({ text }: { text: string }) {
    return (
        <span className="tooltip-wrap" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: 4 }}>
            <span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 15,
                    height: 15,
                    borderRadius: '50%',
                    border: '1px solid var(--text-muted)',
                    color: 'var(--text-muted)',
                    fontSize: 10,
                    cursor: 'help',
                    fontWeight: 700,
                    lineHeight: 1,
                    flexShrink: 0,
                }}
                title={text}
            >?</span>
        </span>
    );
}

// ─── Opportunity tier badge ───────────────────────────────────
function TierBadge({ lri, retention12m }: { lri: number; retention12m: number }) {
    const avg = (lri + retention12m) / 2;
    if (avg >= 80) return <span className="badge green">High Potential</span>;
    if (avg >= 70) return <span className="badge amber">Medium Potential</span>;
    return <span className="badge red">Emerging</span>;
}

export default function UniversityLandscape() {
    const { filters } = useFilters();
    const [activeSubject, setActiveSubject] = useState<string>('all');

    const year = filters.year === 'all' ? 2024 : (filters.year as number);
    // Use previous year for retention cohort (they'd have been hired in prior years)
    const retentionYear = Math.min(year, 2024);

    // Build comparison table data joining universities + retention
    const tableData = UNIVERSITIES
        .filter((u) => filters.universityId === 'all' || u.id === filters.universityId)
        .map((u, i) => {
            const yData = u.data.find((d) => d.year === year) ?? u.data[u.data.length - 1];
            const retention = RETENTION_DATA.find((r) => r.universityId === u.id && r.year === retentionYear)
                ?? RETENTION_DATA.filter((r) => r.universityId === u.id).at(-1)!;
            const totalRelevantStudents = yData.subjectVolumes.reduce((s, sv) => s + sv.students, 0);
            const localOriginPct = retention
                ? Math.round((retention.localOriginHires / retention.totalHires) * 100)
                : 0;
            const conversion = totalRelevantStudents > 0
                ? ((yData.graduatesToAccenture / totalRelevantStudents) * 100)
                : 0;
            const lri = retention?.avgLocalRetentionIndex ?? 0;
            return {
                id: u.id,
                name: u.name,
                shortName: u.shortName,
                color: UNI_COLORS[i],
                rankingUK: u.rankingUK,
                progressionRate: yData.progressionRate,
                employabilityScore: yData.employabilityScore,
                graduatesToAccenture: yData.graduatesToAccenture,
                totalRelevantStudents,
                subjectVolumes: yData.subjectVolumes,
                localOriginPct,
                retention12m: retention?.retention12m ?? 0,
                lri,
                conversion,
            };
        });

    // ─── Chart data ─────────────────────────────────────────
    const subjectChartData = SUBJECTS.map((subj) => {
        const row: Record<string, string | number> = { subject: subj.split(' ')[0] };
        tableData.forEach((u) => {
            const sv = u.subjectVolumes.find((s) => s.subject === subj);
            row[u.shortName] = sv?.students ?? 0;
        });
        return row;
    });

    const retentionPotentialData = tableData.map((u) => ({
        name: u.shortName,
        '12m Retention': u.retention12m,
        'Local Origin %': u.localOriginPct,
        'LRI': u.lri,
    }));

    const accentureData = tableData
        .sort((a, b) => b.graduatesToAccenture - a.graduatesToAccenture)
        .map((u) => ({ name: u.shortName, Hires: u.graduatesToAccenture }));

    return (
        <div className="page animate-in">
            {/* ── Header ── */}
            <div className="page-title">North East University Opportunity Map</div>
            <div className="page-subtitle">
                {year} · Size of talent pool · Quality of talent pool · Retention potential
            </div>

            {/* ── Legend strip ── */}
            <div
                style={{
                    display: 'flex',
                    gap: 8,
                    marginBottom: 24,
                    padding: '10px 16px',
                    background: 'var(--surface-2)',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                }}
            >
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginRight: 4 }}>UNIVERSITIES:</span>
                {tableData.map((u) => (
                    <span key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: u.color, display: 'inline-block' }} />
                        {u.shortName}
                        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>#{u.rankingUK}</span>
                    </span>
                ))}
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    UK ranking shown for context only
                </span>
            </div>

            {/* ── University cards: 3 signals per card ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
                {tableData.map((u) => (
                    <div key={u.id} className="kpi-card neutral" style={{ borderTop: `3px solid ${u.color}`, padding: '14px 16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <div className="kpi-label" style={{ color: u.color, fontSize: 12 }}>{u.shortName}</div>
                            <TierBadge lri={u.lri} retention12m={u.retention12m} />
                        </div>

                        {/* Signal 1: Pool size */}
                        <div style={{ marginBottom: 8 }}>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
                                Talent Pool
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>
                                {u.totalRelevantStudents.toLocaleString()}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>relevant students</div>
                        </div>

                        {/* Signal 2: Accenture hires */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Hires</span>
                            <span style={{ fontWeight: 700, color: u.color }}>{u.graduatesToAccenture}</span>
                        </div>

                        {/* Signal 3: Local origin */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, paddingTop: 6 }}>
                            <span style={{ color: 'var(--text-muted)' }}>Local origin</span>
                            <span style={{ fontWeight: 600 }}>{u.localOriginPct}%</span>
                        </div>

                        {/* Signal 4: 12m retention */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, paddingTop: 6 }}>
                            <span style={{ color: 'var(--text-muted)' }}>12m retention</span>
                            <span style={{
                                fontWeight: 600,
                                color: u.retention12m >= 85 ? 'var(--green)' : u.retention12m >= 78 ? 'var(--amber)' : 'var(--red)',
                            }}>{u.retention12m}%</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Comparison table ── */}
            <div className="card mb-24">
                <div className="card-header flex-between">
                    <div>
                        <div className="card-title">University Opportunity Comparison</div>
                        <div className="card-subtitle">
                            Pool size · conversion · quality · retention potential — ordered by retention signal
                        </div>
                    </div>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>University</th>
                                <th>
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        Relevant Students
                                        <Tooltip text="Graduates in subject areas relevant to Accenture roles: Business & Management, Computing, Engineering & Technology, and Mathematical Sciences." />
                                    </span>
                                </th>
                                <th>Grads → Accenture</th>
                                <th>
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        Conversion
                                        <Tooltip text="Conversion = Accenture hires ÷ relevant students. Measures how effectively we turn the available talent pool into actual hires." />
                                    </span>
                                </th>
                                <th>Progression Rate</th>
                                <th>Employability</th>
                                <th>
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        Local Origin %
                                        <Tooltip text="Share of hired graduates whose home region is the North East. Higher = stronger retention signal, less London leakage risk." />
                                    </span>
                                </th>
                                <th>
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        12m Retention
                                        <Tooltip text="Percentage of graduates from this university still active at Accenture Newcastle 12 months after joining." />
                                    </span>
                                </th>
                                <th>
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        LRI
                                        <Tooltip text="Local Retention Index (0–100): composite of home region, NE university origin, no transfer within 12m, and still active at 12m in Newcastle. Higher = stronger long-term local anchor." />
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...tableData]
                                .sort((a, b) => b.lri - a.lri)
                                .map((u) => (
                                    <tr key={u.id}>
                                        <td>
                                            <div className="flex-center gap-8">
                                                <span className="uni-dot" style={{ background: u.color }} />
                                                <div>
                                                    <span style={{ fontWeight: 600 }}>{u.shortName}</span>
                                                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>UK #{u.rankingUK}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <span style={{ fontWeight: 600 }}>{u.totalRelevantStudents.toLocaleString()}</span>
                                                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>in 4 relevant subjects</div>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: 700, color: u.color }}>{u.graduatesToAccenture}</span>
                                        </td>
                                        <td>
                                            <span className={`badge ${u.conversion >= 1 ? 'green' : u.conversion >= 0.5 ? 'amber' : 'red'}`}>
                                                {u.conversion.toFixed(2)}%
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex-center gap-8">
                                                <div className="progress-bar" style={{ width: 70 }}>
                                                    <div className="progress-fill purple" style={{ width: `${u.progressionRate}%` }} />
                                                </div>
                                                <span style={{ fontSize: 12 }}>{u.progressionRate}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex-center gap-8">
                                                <div className="progress-bar" style={{ width: 70 }}>
                                                    <div
                                                        className="progress-fill"
                                                        style={{
                                                            width: `${u.employabilityScore}%`,
                                                            background: u.employabilityScore >= 80 ? 'var(--green)' : u.employabilityScore >= 70 ? 'var(--amber)' : 'var(--red)',
                                                        }}
                                                    />
                                                </div>
                                                <span style={{ fontSize: 12 }}>{u.employabilityScore}/100</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex-center gap-8">
                                                <div className="progress-bar" style={{ width: 55 }}>
                                                    <div
                                                        className="progress-fill"
                                                        style={{
                                                            width: `${u.localOriginPct}%`,
                                                            background: u.localOriginPct >= 60 ? 'var(--green)' : u.localOriginPct >= 40 ? 'var(--amber)' : 'var(--red)',
                                                        }}
                                                    />
                                                </div>
                                                <span style={{ fontSize: 12 }}>{u.localOriginPct}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{
                                                fontWeight: 700,
                                                color: u.retention12m >= 85 ? 'var(--green)' : u.retention12m >= 78 ? 'var(--amber)' : 'var(--red)',
                                            }}>
                                                {u.retention12m}%
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <div className="progress-bar" style={{ width: 50 }}>
                                                    <div
                                                        className="progress-fill"
                                                        style={{
                                                            width: `${u.lri}%`,
                                                            background: u.lri >= 80 ? 'var(--chart-1)' : u.lri >= 70 ? 'var(--amber)' : 'var(--red)',
                                                        }}
                                                    />
                                                </div>
                                                <span style={{ fontSize: 12, fontWeight: 700 }}>{u.lri}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Charts row 1: Pool size + Retention potential ── */}
            <div className="grid-2 mb-24">
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Subject Volume by University</div>
                            <div className="card-subtitle">
                                Relevant student enrolments — size of the addressable talent pool, {year}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                            {['all', ...SUBJECTS].map((s) => (
                                <button
                                    key={s}
                                    className={`btn btn-sm ${activeSubject === s ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setActiveSubject(s)}
                                    style={{ fontSize: 11 }}
                                >
                                    {s === 'all' ? 'All' : s.split(' ')[0]}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="card-body">
                        <MultiBarChart
                            data={subjectChartData}
                            xKey="subject"
                            bars={tableData.map((u) => ({ key: u.shortName, name: u.shortName, color: u.color }))}
                        />
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Retention Potential by University</div>
                            <div className="card-subtitle">
                                12m retention · local-origin share · LRI — which universities anchor talent in the North East
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <MultiBarChart
                            data={retentionPotentialData}
                            xKey="name"
                            bars={[
                                { key: '12m Retention', name: '12m Retention %', color: 'var(--chart-2)' },
                                { key: 'Local Origin %', name: 'Local Origin %', color: 'var(--green)' },
                                { key: 'LRI', name: 'LRI Score', color: 'var(--chart-1)' },
                            ]}
                            unit="%"
                        />
                        <div style={{
                            marginTop: 12,
                            padding: '8px 12px',
                            background: 'var(--surface-2)',
                            borderRadius: 6,
                            fontSize: 11,
                            color: 'var(--text-muted)',
                            lineHeight: 1.6,
                        }}>
                            <strong style={{ color: 'var(--text)' }}>LRI</strong> = Local Retention Index (0–100):
                            home region in NE (25pts) + NE university (25pts) + no transfer in 12m (25pts) + still active at 12m in Newcastle (25pts).
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Charts row 2: Quality + Hires ── */}
            <div className="grid-2 mb-24">
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Quality of Talent Pool</div>
                            <div className="card-subtitle">Progression rate vs employability score — graduate outcome quality</div>
                        </div>
                    </div>
                    <div className="card-body">
                        <MultiBarChart
                            data={tableData.map((u) => ({
                                name: u.shortName,
                                'Progression Rate': u.progressionRate,
                                'Employability Score': u.employabilityScore,
                            }))}
                            xKey="name"
                            bars={[
                                { key: 'Progression Rate', name: 'Progression %', color: 'var(--chart-1)' },
                                { key: 'Employability Score', name: 'Employability Score', color: 'var(--chart-2)' },
                            ]}
                            unit="%"
                        />
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Graduates Joining Accenture Newcastle</div>
                            <div className="card-subtitle">Actual hires by university, {year}</div>
                        </div>
                    </div>
                    <div className="card-body">
                        <HorizontalBarChart
                            data={accentureData}
                            yKey="name"
                            bars={[{ key: 'Hires', name: 'Joined Hires', color: 'var(--chart-1)' }]}
                            height={220}
                        />
                    </div>
                </div>
            </div>

            {/* ── Insight callout ── */}
            <div style={{
                padding: '16px 20px',
                background: 'rgba(161,0,255,0.06)',
                border: '1px solid rgba(161,0,255,0.2)',
                borderRadius: 10,
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
            }}>
                <span style={{ fontSize: 18, marginTop: 1 }}>💡</span>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7 }}>
                    <strong>How to read this page:</strong> The table is sorted by LRI (highest first) — universities at the top are the strongest bets
                    for long-term North East talent anchoring. A high <em>pool size</em> alone is not enough; combine it with{' '}
                    <em>local-origin %</em> and <em>12m retention</em> to identify the best recruitment focus.
                    Durham leads on quality and retention; Northumbria leads on volume and local origin share.
                    Teesside and Sunderland offer underutilised local-origin talent with strong community ties.
                </div>
            </div>
        </div>
    );
}
