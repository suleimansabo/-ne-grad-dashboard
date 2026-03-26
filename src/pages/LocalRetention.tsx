// ============================================================
// PAGE: Local Retention / Stickiness
// ============================================================

import { MultiLineChart, MultiBarChart } from '../components/charts/Charts';
import { useFilters } from '../hooks/useFilters';
import { RETENTION_DATA } from '../data/retention';
import { getLRIByUniversity } from '../utils/metrics';

const UNI_COLORS: Record<string, string> = {
    newcastle: '#a100ff',
    northumbria: '#00c8ff',
    durham: '#22c55e',
    teesside: '#f59e0b',
    sunderland: '#ff6b6b',
};

export default function LocalRetention() {
    const { filters } = useFilters();
    const year = filters.year === 'all' ? 2024 : (filters.year as number);

    const retData = RETENTION_DATA.filter((r) =>
        filters.universityId === 'all' ? true : r.universityId === filters.universityId
    );

    // Retention trend: per university over time
    const universities = [...new Set(retData.map((r) => r.university))];
    const years = [2022, 2023, 2024];

    const retTrendData = years.map((yr) => {
        const row: Record<string, string | number> = { year: String(yr) };
        universities.forEach((uni) => {
            const found = retData.find((r) => r.year === yr && r.university === uni);
            if (found) row[uni.split(' ')[0]] = found.retention12m;
        });
        return row;
    });

    const retLines = universities.map((uni) => {
        const uid = RETENTION_DATA.find((r) => r.university === uni)?.universityId ?? '';
        return { key: uni.split(' ')[0], name: uni.split(' ')[0], color: UNI_COLORS[uid] ?? '#888' };
    });

    // Local vs non-local retention for current year
    const localVsNonLocal = retData
        .filter((r) => r.year === year)
        .map((r) => ({
            name: r.university.split(' ')[0],
            'Local Origin': r.localRetention12m,
            'Non-Local': r.nonLocalRetention12m,
        }));

    // LRI by university
    const lriData = getLRIByUniversity(filters.year);

    // 6/12/24 comparison for current year
    const retentionMilestones = retData
        .filter((r) => r.year === year)
        .sort((a, b) => b.retention12m - a.retention12m)
        .map((r) => ({
            name: r.university.split(' ')[0],
            '6m': r.retention6m,
            '12m': r.retention12m,
            '24m': r.retention24m,
        }));

    // ── Headline insight: weighted avg local vs non-local 12m retention ──
    const yearRows = retData.filter((r) => r.year === year);
    const totalLocal = yearRows.reduce((s, r) => s + r.localOriginHires, 0);
    const totalNonLocal = yearRows.reduce((s, r) => s + r.nonLocalOriginHires, 0);
    const wtdLocalRet = totalLocal > 0
        ? yearRows.reduce((s, r) => s + r.localRetention12m * r.localOriginHires, 0) / totalLocal
        : 0;
    const wtdNonLocalRet = totalNonLocal > 0
        ? yearRows.reduce((s, r) => s + r.nonLocalRetention12m * r.nonLocalOriginHires, 0) / totalNonLocal
        : 0;
    const retGapPp = Math.round((wtdLocalRet - wtdNonLocalRet) * 10) / 10;
    const bestLocalUni = [...yearRows].sort((a, b) => b.localRetention12m - a.localRetention12m)[0];
    const worstNonLocalUni = [...yearRows].sort((a, b) => a.nonLocalRetention12m - b.nonLocalRetention12m)[0];

    return (
        <div className="page animate-in">
            <div className="page-title">Local Retention & Stickiness</div>
            <div className="page-subtitle">
                Analysing whether North East hires are staying in the region · {year}
            </div>

            {/* ── Headline insight banner ── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                gap: 12,
                alignItems: 'stretch',
                marginBottom: 24,
                padding: '18px 24px',
                background: 'linear-gradient(135deg, rgba(161,0,255,0.10) 0%, rgba(0,200,255,0.07) 100%)',
                border: '1px solid rgba(161,0,255,0.25)',
                borderRadius: 12,
            }}>
                {/* Main stat */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                    <div style={{
                        fontSize: 52,
                        fontWeight: 900,
                        color: retGapPp >= 0 ? 'var(--green)' : 'var(--red)',
                        lineHeight: 1,
                        flexShrink: 0,
                    }}>
                        +{retGapPp}pp
                    </div>
                    <div>
                        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, marginBottom: 4 }}>
                            Local hires are retained <span style={{ color: 'var(--green)' }}>{retGapPp}pp more</span> than non-local hires at 12 months
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            Local-origin avg: <strong style={{ color: 'var(--text)' }}>{wtdLocalRet.toFixed(1)}%</strong>
                            {' '}·{' '}
                            Non-local avg: <strong style={{ color: 'var(--red)' }}>{wtdNonLocalRet.toFixed(1)}%</strong>
                            {' '}· weighted across {totalLocal + totalNonLocal} hires
                        </div>
                    </div>
                </div>

                {/* Supporting stat 1 */}
                {bestLocalUni && (
                    <div style={{
                        padding: '12px 16px',
                        background: 'rgba(34,197,94,0.08)',
                        border: '1px solid rgba(34,197,94,0.2)',
                        borderRadius: 8,
                        minWidth: 160,
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                            Best Local Retention
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--green)' }}>
                            {bestLocalUni.localRetention12m}%
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                            {bestLocalUni.university.split(' ')[0]} local hires
                        </div>
                    </div>
                )}

                {/* Supporting stat 2 */}
                {worstNonLocalUni && (
                    <div style={{
                        padding: '12px 16px',
                        background: 'rgba(255,107,107,0.08)',
                        border: '1px solid rgba(255,107,107,0.2)',
                        borderRadius: 8,
                        minWidth: 160,
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                            Highest Non-Local Leakage
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--red)' }}>
                            {worstNonLocalUni.nonLocalRetention12m}%
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                            {worstNonLocalUni.university.split(' ')[0]} non-local hires
                        </div>
                    </div>
                )}
            </div>

            {/* LRI scores */}
            <div className="section mb-24">
                <div className="section-title">Local Retention Index (LRI) by University</div>
                <div className="grid-4" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                    {lriData
                        .filter((l) => filters.universityId === 'all' || l.universityId === filters.universityId)
                        .map((l) => (
                            <div key={l.universityId} className="card" style={{ padding: 16, textAlign: 'center' }}>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                                    {l.university.split(' ')[0]}
                                </div>
                                <div
                                    style={{
                                        fontSize: 36,
                                        fontWeight: 800,
                                        color: l.avgLRI >= 75 ? 'var(--green)' : l.avgLRI >= 60 ? 'var(--amber)' : 'var(--red)',
                                        lineHeight: 1,
                                        marginBottom: 4,
                                    }}
                                >
                                    {l.avgLRI}
                                </div>
                                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8 }}>/ 100 LRI</div>
                                <div className="progress-bar" style={{ marginBottom: 8 }}>
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${l.avgLRI}%`,
                                            background: l.avgLRI >= 75 ? 'var(--green)' : l.avgLRI >= 60 ? 'var(--amber)' : 'var(--red)',
                                        }}
                                    />
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                    {l.localOriginPct}% local origin · {l.totalHires} hires
                                </div>
                            </div>
                        ))}
                </div>
                <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--text-muted)' }}>
                    LRI = home region NE (25pts) + NE university (25pts) + no transfer within 12m (25pts) + retained at 12m (25pts)
                </div>
            </div>

            {/* Charts */}
            <div className="grid-2 mb-24">
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">12-Month Retention Trend</div>
                            <div className="card-subtitle">By university, 2022–2024</div>
                        </div>
                    </div>
                    <div className="card-body">
                        <MultiLineChart
                            data={retTrendData}
                            xKey="year"
                            lines={retLines}
                            unit="%"
                        />
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Local vs Non-Local Origin Retention</div>
                            <div className="card-subtitle">12m retention by origin type, {year}</div>
                        </div>
                    </div>
                    <div className="card-body">
                        <MultiBarChart
                            data={localVsNonLocal}
                            xKey="name"
                            bars={[
                                { key: 'Local Origin', name: 'Local Origin (NE)', color: 'var(--chart-1)' },
                                { key: 'Non-Local', name: 'Non-Local Origin', color: 'var(--chart-5)' },
                            ]}
                            unit="%"
                        />
                    </div>
                </div>
            </div>

            {/* 6/12/24m milestones */}
            <div className="card mb-24">
                <div className="card-header">
                    <div className="card-title">Retention Milestones: 6m / 12m / 24m</div>
                    <div className="card-subtitle">Comparison across universities, {year}</div>
                </div>
                <div className="card-body">
                    <MultiBarChart
                        data={retentionMilestones}
                        xKey="name"
                        bars={[
                            { key: '6m', name: '6-Month %', color: 'var(--chart-2)' },
                            { key: '12m', name: '12-Month %', color: 'var(--chart-3)' },
                            { key: '24m', name: '24-Month %', color: 'var(--chart-4)' },
                        ]}
                        unit="%"
                    />
                </div>
            </div>

            {/* Detailed table */}
            <div className="card">
                <div className="card-header">
                    <div className="card-title">Retention Detail Table</div>
                    <div className="card-subtitle">{year} cohort</div>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>University</th>
                                <th>Total Hires</th>
                                <th>Local Origin</th>
                                <th>Non-Local</th>
                                <th>6m Retention</th>
                                <th>12m Retention</th>
                                <th>24m Retention</th>
                                <th>Local 12m</th>
                                <th>Non-Local 12m</th>
                                <th>Avg LRI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {retData
                                .filter((r) => r.year === year)
                                .map((r) => (
                                    <tr key={r.universityId}>
                                        <td style={{ fontWeight: 600 }}>
                                            <span className="uni-dot" style={{ background: UNI_COLORS[r.universityId] ?? '#888', marginRight: 8 }} />
                                            {r.university.split(' ')[0]}
                                        </td>
                                        <td>{r.totalHires}</td>
                                        <td>{r.localOriginHires}</td>
                                        <td>{r.nonLocalOriginHires}</td>
                                        <td><span className={`badge ${r.retention6m >= 90 ? 'green' : r.retention6m >= 85 ? 'amber' : 'red'}`}>{r.retention6m}%</span></td>
                                        <td><span className={`badge ${r.retention12m >= 85 ? 'green' : r.retention12m >= 78 ? 'amber' : 'red'}`}>{r.retention12m}%</span></td>
                                        <td><span className={`badge ${r.retention24m >= 70 ? 'green' : r.retention24m >= 62 ? 'amber' : 'red'}`}>{r.retention24m}%</span></td>
                                        <td>{r.localRetention12m}%</td>
                                        <td style={{ color: 'var(--red)' }}>{r.nonLocalRetention12m}%</td>
                                        <td>
                                            <span style={{ fontWeight: 700, color: r.avgLocalRetentionIndex >= 75 ? 'var(--green)' : r.avgLocalRetentionIndex >= 60 ? 'var(--amber)' : 'var(--red)' }}>
                                                {r.avgLocalRetentionIndex}
                                            </span>
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
