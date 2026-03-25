// ============================================================
// PAGE: Risk & Insights
// ============================================================

import { generateInsights } from '../utils/insights';
import { AlertTriangle, CheckCircle, Info, TrendingDown } from 'lucide-react';
import type { InsightSeverity } from '../utils/insights';
import { useState } from 'react';

// "What if?" Scenario view
function ScenarioPanel() {
    const [northumbriaFocus, setNorthumbriaFocus] = useState(50);
    const [newcastleFocus, setNewcastleFocus] = useState(50);

    const projectedHires = Math.round(250 + (northumbriaFocus - 50) * 2 + (newcastleFocus - 50) * 1.5);
    const projectedRetention = Math.min(90, Math.round(82 + (newcastleFocus - 50) * 0.1));
    const projectedFeeder = Math.max(10, Math.round(21 - (northumbriaFocus > 60 ? 1 : 0) - (newcastleFocus > 60 ? 1 : 0)));

    return (
        <div className="scenario-panel mb-24">
            <div className="flex-between mb-16">
                <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>What-If Scenario: Adjust University Focus</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 4 }}>
                        Simulate increasing recruitment focus on Northumbria and/or Newcastle
                    </div>
                </div>
                <span className="badge purple">Scenario Mode</span>
            </div>

            <div className="grid-2 mb-16">
                <div>
                    <div className="flex-between mb-8" style={{ marginBottom: 8 }}>
                        <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Northumbria Focus</label>
                        <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{northumbriaFocus}%</span>
                    </div>
                    <input
                        type="range"
                        className="scenario-slider"
                        min={10}
                        max={90}
                        value={northumbriaFocus}
                        onChange={(e) => setNorthumbriaFocus(Number(e.target.value))}
                        style={{ width: '100%' }}
                    />
                    <div className="flex-between" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                        <span>Low</span><span>High</span>
                    </div>
                </div>
                <div>
                    <div className="flex-between mb-8" style={{ marginBottom: 8 }}>
                        <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Newcastle Focus</label>
                        <span style={{ fontWeight: 700, color: 'var(--chart-2)' }}>{newcastleFocus}%</span>
                    </div>
                    <input
                        type="range"
                        className="scenario-slider"
                        min={10}
                        max={90}
                        value={newcastleFocus}
                        onChange={(e) => setNewcastleFocus(Number(e.target.value))}
                        style={{ width: '100%' }}
                    />
                    <div className="flex-between" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                        <span>Low</span><span>High</span>
                    </div>
                </div>
            </div>

            <div className="grid-3">
                {[
                    { label: 'Projected Hires', value: projectedHires, color: 'var(--chart-2)', up: projectedHires > 250 },
                    { label: 'Projected 12m Retention', value: `${projectedRetention}%`, color: 'var(--chart-3)', up: projectedRetention > 82 },
                    { label: 'Projected Feeder Index', value: `${projectedFeeder}%`, color: 'var(--chart-5)', up: false },
                ].map((r) => (
                    <div key={r.label} style={{ background: 'var(--bg-input)', borderRadius: 8, padding: '12px 14px' }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{r.label}</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: r.color }}>{r.value}</div>
                        {r.label === 'Projected Feeder Index' && (
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                                {projectedFeeder < 21 ? '↓ Better than baseline' : '→ No improvement'}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

const SEVERITY_ICONS: Record<InsightSeverity, React.ReactNode> = {
    positive: <CheckCircle size={15} style={{ color: 'var(--green)' }} />,
    warning: <AlertTriangle size={15} style={{ color: 'var(--amber)' }} />,
    critical: <TrendingDown size={15} style={{ color: 'var(--red)' }} />,
    info: <Info size={15} style={{ color: 'var(--blue)' }} />,
};

const SEVERITY_LABELS: Record<InsightSeverity, string> = {
    positive: 'Positive',
    warning: 'Watch',
    critical: 'Critical',
    info: 'Info',
};

const SEVERITY_BADGE: Record<InsightSeverity, string> = {
    positive: 'green',
    warning: 'amber',
    critical: 'red',
    info: 'blue',
};

export default function RiskInsights() {
    const insights = generateInsights();
    const [filter, setFilter] = useState<InsightSeverity | 'all'>('all');

    const filtered = filter === 'all' ? insights : insights.filter((i) => i.severity === filter);

    const counts = {
        critical: insights.filter((i) => i.severity === 'critical').length,
        warning: insights.filter((i) => i.severity === 'warning').length,
        positive: insights.filter((i) => i.severity === 'positive').length,
        info: insights.filter((i) => i.severity === 'info').length,
    };

    return (
        <div className="page animate-in">
            <div className="page-title">Risk & Insights</div>
            <div className="page-subtitle">
                Automated signals and plain-English recommendations for the early careers team
            </div>

            {/* Severity summary */}
            <div className="grid-4 mb-24">
                {(Object.entries(counts) as [InsightSeverity, number][]).map(([sev, count]) => (
                    <div
                        key={sev}
                        className={`kpi-card ${sev === 'critical' ? 'negative' : sev === 'positive' ? 'positive' : sev === 'warning' ? 'warning' : 'info'}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setFilter(sev)}
                    >
                        <div className="kpi-label">{SEVERITY_ICONS[sev]} {SEVERITY_LABELS[sev]} Signals</div>
                        <div className="kpi-value">{count}</div>
                        <div className="kpi-footer"><span className="kpi-basis">click to filter</span></div>
                    </div>
                ))}
            </div>

            {/* Scenario / What-if */}
            <ScenarioPanel />

            {/* Filter bar */}
            <div className="flex-center gap-8 mb-16">
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Show:</span>
                {(['all', 'critical', 'warning', 'positive', 'info'] as const).map((f) => (
                    <button
                        key={f}
                        className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'all' ? 'All' : SEVERITY_LABELS[f as InsightSeverity]}
                    </button>
                ))}
            </div>

            {/* Insight cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map((insight) => (
                    <div key={insight.id} className={`insight-card ${insight.severity}`}>
                        <div className="flex-between">
                            <div className="flex-center gap-8">
                                {SEVERITY_ICONS[insight.severity]}
                                <span className="insight-title">{insight.title}</span>
                            </div>
                            <div className="flex-center gap-8">
                                {insight.metric && (
                                    <div className="insight-metric">
                                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{insight.metric}:</span>
                                        <span className={`badge ${SEVERITY_BADGE[insight.severity]}`}>{insight.change}</span>
                                    </div>
                                )}
                                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>#{insight.id}</span>
                            </div>
                        </div>
                        <p className="insight-body">{insight.body}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
