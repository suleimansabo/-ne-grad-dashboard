// ============================================================
// PAGE: Campaign Effectiveness (Event Diagnostics)
// ============================================================

import React, { useState } from 'react';
import { MultiBarChart } from '../components/charts/Charts';
import { EVENT_TYPE_CI, UNI_CI, HEATMAP_DATA, FUNNEL_OVERALL, UPCOMING_EVENTS, CONTACTS, EVENT_FUNNEL_SHAPES, type WilsonCIData } from '../data/events';
import { useFilters } from '../hooks/useFilters';

const FUNNEL_COLORS = {
    attend: '#6b4cff',
    apply: '#8b75ff',
    interview: '#22c55e',
    offer: '#f59e0b',
    accept: '#ec4899',
};

const CHART_COLORS = ['#d97706', '#be185d', '#059669', '#2563eb', '#4f46e5', '#0891b2'];

const UNI_COLORS: Record<string, string> = {
    'Newcastle University': '#a100ff',
    'Northumbria University': '#00c8ff',
    'Durham University': '#22c55e',
    'Durham Teaching and Learning Centre': '#22c55e',
    'Teesside University': '#f59e0b',
    'University of Sunderland': '#ff6b6b',
};

function InteractiveCalendar() {
    const [viewDate, setViewDate] = useState(() => new Date());
    const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
    const [isContactsOpen, setIsContactsOpen] = useState(false);
    const [selectedUni, setSelectedUni] = useState('Newcastle University');

    const handlePrev = () => {
        const d = new Date(viewDate);
        if (viewMode === 'month') d.setMonth(d.getMonth() - 1);
        else d.setFullYear(d.getFullYear() - 1);
        setViewDate(d);
    };
    
    const handleNext = () => {
        const d = new Date(viewDate);
        if (viewMode === 'month') d.setMonth(d.getMonth() + 1);
        else d.setFullYear(d.getFullYear() + 1);
        setViewDate(d);
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();

    const getEventsForDay = (y: number, m: number, d: number) => {
        return UPCOMING_EVENTS.filter(e => {
            const ed = new Date(e.date);
            return ed.getFullYear() === y && ed.getMonth() === m && ed.getDate() === d;
        });
    };

    const getEventsForMonth = (y: number, m: number) => {
        return UPCOMING_EVENTS.filter(e => {
            const ed = new Date(e.date);
            return ed.getFullYear() === y && ed.getMonth() === m;
        });
    };

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const emptyCells = Array.from({ length: firstDayOfMonth }).map((_, i) => i);
    const dayCells = Array.from({ length: daysInMonth }).map((_, i) => i + 1);

    const contact = CONTACTS.find(c => c.university === selectedUni);

    return (
        <div className="card mb-20">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <div className="card-title">Event Calendar</div>
                    <div className="card-subtitle">Upcoming events and university contacts</div>
                </div>
                
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                        <button 
                            className={`btn btn-sm ${isContactsOpen ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setIsContactsOpen(!isContactsOpen)}
                            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            University Contacts
                        </button>

                        {isContactsOpen && (
                            <div style={{ 
                                position: 'absolute', top: '100%', right: 0, marginTop: 8, 
                                background: 'var(--surface-2)', border: '1px solid var(--border)', 
                                borderRadius: 8, padding: 16, width: 320, zIndex: 10,
                                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                            }}>
                                <select 
                                    className="form-select" 
                                    style={{ width: '100%', marginBottom: 12, background: 'var(--surface)', border: '1px solid var(--border)', padding: '8px 12px', borderRadius: 4, color: 'var(--text)', outline: 'none' }}
                                    value={selectedUni}
                                    onChange={(e) => setSelectedUni(e.target.value)}
                                >
                                    {CONTACTS.map(c => <option key={c.university} value={c.university}>{c.university}</option>)}
                                </select>
                                {contact && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: 16 }}>{contact.name}</div>
                                            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{contact.role}</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent)', fontSize: 13 }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                            <a href={`mailto:${contact.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{contact.email}</a>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13 }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                            {contact.phone}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', background: 'var(--surface-2)', borderRadius: 6, padding: 2, border: '1px solid var(--border)' }}>
                        <button className={`btn btn-sm ${viewMode === 'month' ? 'btn-primary' : ''}`} onClick={() => setViewMode('month')} style={{ padding: '4px 12px', background: viewMode === 'month' ? 'var(--accent)' : 'transparent', border: 'none', color: viewMode === 'month' ? '#fff' : 'var(--text-secondary)' }}>Month</button>
                        <button className={`btn btn-sm ${viewMode === 'year' ? 'btn-primary' : ''}`} onClick={() => setViewMode('year')} style={{ padding: '4px 12px', background: viewMode === 'year' ? 'var(--accent)' : 'transparent', border: 'none', color: viewMode === 'year' ? '#fff' : 'var(--text-secondary)' }}>Year</button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 8 }}>
                        <button className="btn btn-secondary btn-sm" onClick={handlePrev} style={{ padding: '4px 8px' }}>&lt;</button>
                        <span style={{ fontSize: 14, fontWeight: 700, minWidth: 100, textAlign: 'center' }}>
                            {viewMode === 'month' ? `${monthNames[currentMonth]} ${currentYear}` : currentYear}
                        </span>
                        <button className="btn btn-secondary btn-sm" onClick={handleNext} style={{ padding: '4px 8px' }}>&gt;</button>
                    </div>
                </div>
            </div>

            <div className="card-body" style={{ minHeight: 400, paddingTop: 16 }}>
                {viewMode === 'month' ? (
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, borderBottom: '1px solid var(--border)', paddingBottom: 8, marginBottom: 8 }}>
                            {dayNames.map(d => <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{d}</div>)}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                            {emptyCells.map(i => <div key={`empty-${i}`} style={{ background: 'var(--surface)', minHeight: 120 }} />)}
                            {dayCells.map(day => {
                                const events = getEventsForDay(currentYear, currentMonth, day);
                                return (
                                    <div key={day} style={{ background: 'var(--surface)', minHeight: 120, padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <div style={{ fontSize: 12, fontWeight: 600, color: events.length > 0 ? 'var(--text)' : 'var(--text-secondary)' }}>{day}</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                                            {events.map(e => {
                                                const color = UNI_COLORS[e.location] || 'var(--accent)';
                                                return (
                                                    <div key={e.id} style={{ fontSize: 10, padding: '4px 6px', borderRadius: 4, background: `${color}33`, color: color, border: `1px solid ${color}66`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={`${e.time} - ${e.name} at ${e.location}`}>
                                                        <strong style={{ opacity: 0.8 }}>{e.time}</strong> {e.name}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                        {monthNames.map((month, idx) => {
                            const evts = getEventsForMonth(currentYear, idx);
                            return (
                                <div key={month} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, minHeight: 120, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{month}</div>
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
                                        {evts.length > 0 ? (
                                            <>
                                                <div style={{ fontSize: 24, fontWeight: 800 }}>{evts.length}</div>
                                                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Event{evts.length > 1 ? 's' : ''}</div>
                                            </>
                                        ) : (
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No events</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

function CIChart({ title, subtitle, data }: { title: string, subtitle: string, data: WilsonCIData[] }) {
    return (
        <div className="card">
            <div className="card-header">
                <div>
                    <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {title}
                        <span style={{ fontSize: 10, background: 'var(--amber)', color: '#000', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>MOCK</span>
                    </div>
                    <div className="card-subtitle">{subtitle}</div>
                </div>
            </div>
            <div className="card-body">
                {/* Axis Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginBottom: 16, paddingLeft: '30%', paddingRight: '20%' }}>
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {data.map((row, i) => {
                        const color = CHART_COLORS[i % CHART_COLORS.length];
                        const leftPct = row.lowerCI;
                        const widthPct = row.upperCI - row.lowerCI;
                        return (
                            <div key={row.name} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                {/* Left Label */}
                                <div style={{ width: '30%', flexShrink: 0, fontSize: 12, fontWeight: 600, color, paddingRight: 10 }}>
                                    {row.name}
                                </div>
                                
                                {/* Track */}
                                <div style={{ flex: 1, height: 28, position: 'relative', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
                                    {/* Grid lines */}
                                    {[25, 50, 75].map(tick => (
                                        <div key={tick} style={{ position: 'absolute', left: `${tick}%`, top: 0, bottom: 0, width: 1, background: 'var(--border)', zIndex: 0 }} />
                                    ))}
                                    
                                    {/* CI Range Block */}
                                    <div style={{
                                        position: 'absolute',
                                        left: `${leftPct}%`,
                                        width: `${widthPct}%`,
                                        height: '100%',
                                        background: `${color}33`,
                                        borderRadius: 4,
                                        zIndex: 1
                                    }}>
                                        {/* Point Estimate Line */}
                                        <div style={{
                                            position: 'absolute',
                                            left: `${((row.rate - row.lowerCI) / widthPct) * 100}%`,
                                            top: '10%',
                                            bottom: '10%',
                                            width: 2,
                                            background: color,
                                            zIndex: 2,
                                            transform: 'translateX(-50%)'
                                        }} />
                                    </div>
                                </div>

                                {/* Right Data Labels */}
                                <div style={{ width: '20%', flexShrink: 0, textAlign: 'right', fontSize: 11, paddingLeft: 10 }}>
                                    <div style={{ color: 'var(--text-muted)' }}>{row.eventsCount} events · £{row.costPerConv}/conv</div>
                                    <div style={{ fontWeight: 700, marginTop: 4 }}>{row.rate.toFixed(1)}%</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {title.includes('Event Type') && (
                    <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(5, 150, 105, 0.1)', borderLeft: '4px solid var(--green)', borderRadius: '0 8px 8px 0', fontSize: 12 }}>
                        <strong style={{ color: 'var(--green)' }}>Reading CIs:</strong> Non-overlapping intervals = likely real difference. Overlapping = need more data. The point estimate (solid line) is your best guess; the shaded range is where the true rate likely lives.
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CampaignEffectiveness() {
    const { filters } = useFilters();
    
    // Calculate total for proportional funnel bar
    const sumPipeline = FUNNEL_OVERALL.totalAttend + FUNNEL_OVERALL.totalApply + FUNNEL_OVERALL.totalInterview + FUNNEL_OVERALL.totalOffer + FUNNEL_OVERALL.totalAccept;

    // Heatmap config
    const universities = ['NCL', 'DUR', 'NTH', 'SUN', 'TEE'];
    const eventTypes = ['Career Fair', 'Workshop', 'Hackathon', 'Case Study Evening', 'Guest Lecture', 'Panel Discussion'];

    return (
        <div className="page animate-in">
            <div className="page-title">Event Effectiveness Diagnostics</div>
            <div className="page-subtitle">
                Funnel diagnostics and campaign ROI tracking · {filters.year === 'all' ? 'All Years' : filters.year}
            </div>

            {/* 1. Funnel Drop-off Diagnostics */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Funnel Drop-off Diagnostics</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
                    Pinpoint WHERE candidates drop off. Red = below overall benchmark = bottleneck. This tells you what kind of intervention is needed.
                </div>

                <div className="card" style={{ background: 'var(--surface)' }}>
                    <div className="card-body">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <div style={{ fontSize: 16, fontWeight: 800 }}>Overall Benchmark</div>
                            <span style={{ fontSize: 10, background: 'var(--amber)', color: '#000', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>MOCK</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
                            Across all events — your baseline for comparison
                        </div>

                        {/* Flex containers for stats */}
                        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                            {[
                                { title: 'ATTEND → APPLY', rate: ((FUNNEL_OVERALL.totalApply / FUNNEL_OVERALL.totalAttend) * 100).toFixed(1), sub: `${FUNNEL_OVERALL.totalApply} of ${FUNNEL_OVERALL.totalAttend}` },
                                { title: 'APPLY → INTERVIEW', rate: ((FUNNEL_OVERALL.totalInterview / FUNNEL_OVERALL.totalApply) * 100).toFixed(1), sub: `${FUNNEL_OVERALL.totalInterview} of ${FUNNEL_OVERALL.totalApply}` },
                                { title: 'INTERVIEW → OFFER', rate: ((FUNNEL_OVERALL.totalOffer / FUNNEL_OVERALL.totalInterview) * 100).toFixed(1), sub: `${FUNNEL_OVERALL.totalOffer} of ${FUNNEL_OVERALL.totalInterview}` },
                                { title: 'OFFER → ACCEPT', rate: ((FUNNEL_OVERALL.totalAccept / FUNNEL_OVERALL.totalOffer) * 100).toFixed(1), sub: `${FUNNEL_OVERALL.totalAccept} of ${FUNNEL_OVERALL.totalOffer}` }
                            ].map((stat) => (
                                <div key={stat.title} style={{ flex: 1, background: 'var(--surface-2)', padding: '16px 20px', borderRadius: 8, border: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>{stat.title}</div>
                                    <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{stat.rate}%</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{stat.sub}</div>
                                </div>
                            ))}
                        </div>

                        {/* Continuous proportion bar */}
                        <div style={{ display: 'flex', height: 28, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', width: `${(FUNNEL_OVERALL.totalAttend / sumPipeline) * 100}%`, background: FUNNEL_COLORS.attend }}>Attend</div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', width: `${(FUNNEL_OVERALL.totalApply / sumPipeline) * 100}%`, background: FUNNEL_COLORS.apply }}>Apply</div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', width: `${(FUNNEL_OVERALL.totalInterview / sumPipeline) * 100}%`, background: FUNNEL_COLORS.interview }}>Interview</div>
                            <div style={{ width: `${(FUNNEL_OVERALL.totalOffer / sumPipeline) * 100}%`, background: FUNNEL_COLORS.offer }} />
                            <div style={{ width: `${(FUNNEL_OVERALL.totalAccept / sumPipeline) * 100}%`, background: FUNNEL_COLORS.accept }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Heatmap */}
            <div className="card mb-32">
                <div className="card-header border-bottom">
                    <div>
                        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            Event Type × University Heatmap
                            <span style={{ fontSize: 10, background: 'var(--amber)', color: '#000', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>MOCK</span>
                        </div>
                        <div className="card-subtitle">Attendance → applied rate. Darker = higher. Grey = untested (potential experiment).</div>
                    </div>
                </div>
                <div className="card-body" style={{ background: 'var(--surface-2)', padding: 24 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) repeat(5, 1fr)', gap: 8 }}>
                        {/* Header Row */}
                        <div />
                        {universities.map(u => (
                            <div key={u} style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>{u}</div>
                        ))}
                        
                        {/* Grid Rows */}
                        {eventTypes.map(type => (
                            <React.Fragment key={type}>
                                <div style={{ display: 'flex', alignItems: 'center', fontSize: 12, fontWeight: 600 }}>{type}</div>
                                {universities.map(u => {
                                    const cell = HEATMAP_DATA.find(h => h.uniCode === u && h.eventType === type);
                                    if (!cell || cell.appliedRate === null) {
                                        return (
                                            <div key={u} style={{ background: 'var(--border)', height: 60, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                                                —
                                            </div>
                                        );
                                    }
                                    // Intensity calculation: Map 5% to 50% applied rate to 0.2 to 1.0 opacity
                                    const opacity = Math.min(Math.max((cell.appliedRate - 5) / 45, 0.15) + 0.15, 1.0);
                                    
                                    return (
                                        <div key={u} style={{ background: `rgba(107, 76, 255, ${opacity})`, height: 60, borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: opacity > 0.4 ? '#fff' : 'var(--text)', transition: 'background 0.2s', cursor: 'pointer' }} title={`${type} at ${u}`}>
                                            <div style={{ fontSize: 14, fontWeight: 800 }}>{cell.appliedRate.toFixed(1)}%</div>
                                            <div style={{ fontSize: 10, opacity: 0.8 }}>n={cell.n}</div>
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>

                    <div style={{ marginTop: 24, padding: '12px 16px', background: 'rgba(107, 76, 255, 0.08)', borderLeft: '4px solid #6b4cff', borderRadius: '0 8px 8px 0', fontSize: 12, lineHeight: 1.5 }}>
                        <strong style={{ color: '#8b75ff' }}>How to use:</strong> The darkest cells are your best-performing combos for "applied". Grey cells are untested — these are your next experiments. Toggle between stages to find strategies that convert well early but leak later (high "applied" but low "accepted" = candidate quality issue, not engagement issue).
                    </div>
                </div>
            </div>

            {/* NEW: Funnel Shape by Event Type */}
            <div className="card mb-32">
                <div className="card-header border-bottom">
                    <div>
                        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            Funnel Shape by Event Type
                            <span style={{ fontSize: 10, background: 'var(--amber)', color: '#000', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>MOCK</span>
                        </div>
                        <div className="card-subtitle">Some formats are better at generating initial interest; others at producing quality candidates who convert through</div>
                    </div>
                </div>
                <div className="card-body">
                    <MultiBarChart
                        data={EVENT_FUNNEL_SHAPES}
                        xKey="name"
                        bars={[
                            { key: 'Attend→Apply', name: 'Attend→Apply', color: '#6b4cff' },
                            { key: 'Apply→Interview', name: 'Apply→Interview', color: '#22c55e' },
                            { key: 'Interview→Offer', name: 'Interview→Offer', color: '#f59e0b' },
                            { key: 'Offer→Accept', name: 'Offer→Accept', color: '#ec4899' },
                        ]}
                        unit="%"
                    />
                    <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(34, 197, 94, 0.08)', borderLeft: '4px solid var(--green)', borderRadius: '0 8px 8px 0', fontSize: 12, lineHeight: 1.5 }}>
                        <strong style={{ color: 'var(--green)' }}>Pattern to look for:</strong> An event type with high "Attend→Apply" but low "Interview→Offer" generates volume but not quality. One with lower initial conversion but high later-stage rates is a quality filter. Match your strategy to whether you need more top-of-funnel volume or better-qualified candidates.
                    </div>
                </div>
            </div>

            {/* 3. By Event Type & By University */}
            <div className="grid-2 mb-32">
                <CIChart title="By Event Type" subtitle="Wilson score 95% CI — wide bars mean uncertain, need more data" data={EVENT_TYPE_CI} />
                <CIChart title="By University" subtitle="Same measure, grouped by university" data={UNI_CI} />
            </div>

            {/* 4. Interactive Calendar (Replaces static events & contacts grids) */}
            <InteractiveCalendar />
        </div>
    );
}
