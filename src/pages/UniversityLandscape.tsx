// ============================================================
// PAGE: University Landscape
// ============================================================

import { useState } from 'react';
import { MultiBarChart, HorizontalBarChart } from '../components/charts/Charts';
import { UNIVERSITIES } from '../data/universities';
import { useFilters } from '../hooks/useFilters';

const UNI_COLORS = ['#a100ff', '#00c8ff', '#22c55e', '#f59e0b', '#ff6b6b'];
const SUBJECTS = ['Business & Management', 'Computing', 'Engineering & Technology', 'Mathematical Sciences'];

export default function UniversityLandscape() {
    const { filters } = useFilters();
    const [activeSubject, setActiveSubject] = useState<string>('all');

    const year = filters.year === 'all' ? 2024 : (filters.year as number);

    // Build comparison table data
    const tableData = UNIVERSITIES
        .filter((u) => filters.universityId === 'all' || u.id === filters.universityId)
        .map((u, i) => {
            const yData = u.data.find((d) => d.year === year) ?? u.data[u.data.length - 1];
            const totalRelevantStudents = yData.subjectVolumes.reduce((s, sv) => s + sv.students, 0);
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
            };
        });

    // Subject volume comparison chart data
    const subjectChartData = SUBJECTS.map((subj) => {
        const row: Record<string, string | number> = { subject: subj.split(' ')[0] };
        tableData.forEach((u) => {
            const sv = u.subjectVolumes.find((s) => s.subject === subj);
            row[u.shortName] = sv?.students ?? 0;
        });
        return row;
    });

    // Progression rate comparison
    const progressionData = tableData.map((u) => ({
        name: u.shortName,
        'Progression Rate': u.progressionRate,
        'Employability Score': u.employabilityScore,
    }));

    // Graduates to Accenture horizontal bar
    const accentureData = tableData
        .sort((a, b) => b.graduatesToAccenture - a.graduatesToAccenture)
        .map((u) => ({ name: u.shortName, Hires: u.graduatesToAccenture }));

    return (
        <div className="page animate-in">
            <div className="page-title">University Landscape</div>
            <div className="page-subtitle">North East England · {year} · Subject volumes, progression, and employability</div>

            {/* Summary cards */}
            <div className="grid-4 mb-24" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                {tableData.map((u) => (
                    <div key={u.id} className="kpi-card neutral" style={{ borderTop: `3px solid ${u.color}` }}>
                        <div className="kpi-label" style={{ color: u.color }}>{u.shortName}</div>
                        <div className="kpi-value" style={{ fontSize: 22 }}>{u.graduatesToAccenture}</div>
                        <div className="kpi-footer">
                            <span className="kpi-basis" style={{ color: 'var(--text-muted)' }}>hires · UK #{u.rankingUK}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Comparison table */}
            <div className="card mb-24">
                <div className="card-header flex-between">
                    <div>
                        <div className="card-title">University Comparison</div>
                        <div className="card-subtitle">Graduates to Accenture, progression rates, and employability scores</div>
                    </div>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>University</th>
                                <th>UK Ranking</th>
                                <th>Relevant Students</th>
                                <th>Grads → Accenture</th>
                                <th>Progression Rate</th>
                                <th>Employability Score</th>
                                <th>Conversion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((u) => {
                                const conversion = u.totalRelevantStudents > 0 ? ((u.graduatesToAccenture / u.totalRelevantStudents) * 100).toFixed(2) : '0.00';
                                return (
                                    <tr key={u.id}>
                                        <td>
                                            <div className="flex-center gap-8">
                                                <span className="uni-dot" style={{ background: u.color }} />
                                                <span style={{ fontWeight: 600 }}>{u.shortName}</span>
                                            </div>
                                        </td>
                                        <td>#{u.rankingUK}</td>
                                        <td>{u.totalRelevantStudents.toLocaleString()}</td>
                                        <td>
                                            <span style={{ fontWeight: 700, color: u.color }}>{u.graduatesToAccenture}</span>
                                        </td>
                                        <td>
                                            <div className="flex-center gap-8">
                                                <div className="progress-bar" style={{ width: 80 }}>
                                                    <div className="progress-fill purple" style={{ width: `${u.progressionRate}%` }} />
                                                </div>
                                                <span style={{ fontSize: 12 }}>{u.progressionRate}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex-center gap-8">
                                                <div className="progress-bar" style={{ width: 80 }}>
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
                                            <span className={`badge ${Number(conversion) >= 1 ? 'green' : Number(conversion) >= 0.5 ? 'amber' : 'red'}`}>
                                                {conversion}%
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Charts */}
            <div className="grid-2 mb-24">
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Subject Volume by University</div>
                            <div className="card-subtitle">Relevant student enrolments, {year}</div>
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
                            <div className="card-title">Progression & Employability</div>
                            <div className="card-subtitle">Graduate outcomes comparison</div>
                        </div>
                    </div>
                    <div className="card-body">
                        <MultiBarChart
                            data={progressionData}
                            xKey="name"
                            bars={[
                                { key: 'Progression Rate', name: 'Progression %', color: 'var(--chart-1)' },
                                { key: 'Employability Score', name: 'Employability Score', color: 'var(--chart-2)' },
                            ]}
                            unit="%"
                        />
                    </div>
                </div>
            </div>

            {/* Graduates joined Accenture */}
            <div className="card">
                <div className="card-header">
                    <div className="card-title">Graduates Joining Accenture Newcastle</div>
                    <div className="card-subtitle">By university, {year}</div>
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
    );
}
