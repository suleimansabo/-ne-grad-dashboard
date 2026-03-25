// ============================================================
// PAGE: Attraction Funnel
// ============================================================

import { useFilters } from '../hooks/useFilters';
import { filterFunnel, sumFunnel } from '../utils/metrics';

const FUNNEL_STEPS = [
    { key: 'campaignReach', label: 'Campaign Reach', color: '#a100ff' },
    { key: 'eventRegistrations', label: 'Event Registrations', color: '#9200e6' },
    { key: 'eventAttendance', label: 'Event Attendance', color: '#8200cc' },
    { key: 'applicationStarts', label: 'Application Starts', color: '#00c8ff' },
    { key: 'completedApplications', label: 'Completed Applications', color: '#00b5e6' },
    { key: 'interviews', label: 'Interviews', color: '#22c55e' },
    { key: 'offers', label: 'Offers Made', color: '#16a34a' },
    { key: 'acceptedOffers', label: 'Accepted Offers', color: '#f59e0b' },
    { key: 'joinedHires', label: 'Joined Hires', color: '#d97706' },
] as const;

type FunnelKey = typeof FUNNEL_STEPS[number]['key'];

export default function AttractionFunnel() {
    const { filters } = useFilters();
    const records = filterFunnel(filters);
    const totals = sumFunnel(records);

    const maxVal = totals.campaignReach || 1;

    return (
        <div className="page animate-in">
            <div className="page-title">Attraction Funnel</div>
            <div className="page-subtitle">
                Candidate journey from campaign reach to joined hires ·{' '}
                {filters.year === 'all' ? 'All Years' : filters.year}
            </div>

            <div className="grid-2-1 mb-24" style={{ alignItems: 'start' }}>
                {/* Funnel visualization */}
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Recruitment Funnel</div>
                            <div className="card-subtitle">
                                {records.length} cohort{records.length !== 1 ? 's' : ''} · use filters above to drill down
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        {FUNNEL_STEPS.map((step, idx) => {
                            const val = totals[step.key as FunnelKey];
                            const prev = idx === 0 ? val : totals[FUNNEL_STEPS[idx - 1].key as FunnelKey];
                            const conv = prev > 0 ? Math.round((val / prev) * 100) : 0;
                            const widthPct = maxVal > 0 ? Math.round((val / maxVal) * 100) : 0;

                            return (
                                <div key={step.key} className="funnel-step">
                                    <div className="funnel-step-label">{step.label}</div>
                                    <div className="funnel-step-bar">
                                        <div
                                            className="funnel-step-fill"
                                            style={{ width: `${widthPct}%`, background: `linear-gradient(90deg, ${step.color}, ${step.color}99)` }}
                                        >
                                            {widthPct > 15 && (
                                                <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, paddingRight: 8 }}>
                                                    {val.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="funnel-step-num">{widthPct <= 15 ? val.toLocaleString() : ''}</div>
                                    <div className="funnel-conv">
                                        {idx > 0 ? (
                                            <span style={{ color: conv >= 60 ? 'var(--green)' : conv >= 40 ? 'var(--amber)' : 'var(--red)', fontWeight: 600 }}>
                                                {conv}%
                                            </span>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)' }}>—</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right panel: conversion rates */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Key Conversion Rates</div>
                        </div>
                        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {[
                                {
                                    label: 'Reach → Application',
                                    val: totals.campaignReach > 0 ? ((totals.completedApplications / totals.campaignReach) * 100).toFixed(1) : '0.0',
                                    color: 'var(--chart-1)',
                                },
                                {
                                    label: 'Application → Interview',
                                    val: totals.completedApplications > 0 ? ((totals.interviews / totals.completedApplications) * 100).toFixed(1) : '0.0',
                                    color: 'var(--chart-2)',
                                },
                                {
                                    label: 'Interview → Offer',
                                    val: totals.interviews > 0 ? ((totals.offers / totals.interviews) * 100).toFixed(1) : '0.0',
                                    color: 'var(--chart-3)',
                                },
                                {
                                    label: 'Offer Acceptance',
                                    val: totals.offers > 0 ? ((totals.acceptedOffers / totals.offers) * 100).toFixed(1) : '0.0',
                                    color: 'var(--chart-4)',
                                },
                                {
                                    label: 'Overall: Reach → Hire',
                                    val: totals.campaignReach > 0 ? ((totals.joinedHires / totals.campaignReach) * 100).toFixed(2) : '0.00',
                                    color: 'var(--red)',
                                },
                            ].map((r) => (
                                <div key={r.label}>
                                    <div className="flex-between mb-8" style={{ marginBottom: 6 }}>
                                        <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{r.label}</span>
                                        <span style={{ fontWeight: 700, color: r.color }}>{r.val}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${Math.min(parseFloat(r.val), 100)}%`, background: r.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Funnel Totals</div>
                        </div>
                        <div className="card-body">
                            <table style={{ width: '100%', fontSize: 13 }}>
                                <tbody>
                                    {[
                                        { label: 'Campaign Reach', val: totals.campaignReach },
                                        { label: 'Applications', val: totals.completedApplications },
                                        { label: 'Interviews', val: totals.interviews },
                                        { label: 'Offers', val: totals.offers },
                                        { label: 'Accepted', val: totals.acceptedOffers },
                                        { label: 'Joined Hires', val: totals.joinedHires },
                                    ].map((row) => (
                                        <tr key={row.label}>
                                            <td style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>{row.label}</td>
                                            <td style={{ textAlign: 'right', fontWeight: 700 }}>{row.val.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
