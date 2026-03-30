// PAGE: Local Retention / Stickiness
// ============================================================

import { useState, useRef } from 'react';

import { MultiBarChart } from '../components/charts/Charts';
import { useFilters } from '../hooks/useFilters';
import { RETENTION_DATA } from '../data/retention';
import { getLRIByUniversity } from '../utils/metrics';

// Geographic Map definitions
const offices = [
  { id: 'edinburgh', name: 'Edinburgh', x: 44, y: 24, retention: 78 },
  { id: 'newcastle', name: 'Newcastle', x: 52, y: 34, retention: 82 },
  { id: 'leeds', name: 'Leeds', x: 54, y: 48, retention: 75 },
  { id: 'manchester', name: 'Manchester', x: 46, y: 52, retention: 79 },
  { id: 'birmingham', name: 'Birmingham', x: 52, y: 65, retention: 72 },
  { id: 'london', name: 'London', x: 66, y: 78, retention: 65 },
];
 
const flows = [
  { source: 'newcastle', target: 'london', count: 15, reason: 'Higher salary offered in London office', type: 'loss' },
  { source: 'newcastle', target: 'manchester', count: 8, reason: 'Relocation closer to family', type: 'loss' },
  { source: 'newcastle', target: 'edinburgh', count: 5, reason: 'Better project alignment', type: 'loss' },
  { source: 'newcastle', target: 'birmingham', count: 4, reason: 'Promotion opportunity', type: 'loss' },
  { source: 'newcastle', target: 'leeds', count: 3, reason: 'Change in technology stack', type: 'loss' },
  { source: 'newcastle', target: 'newcastle', count: 120, reason: 'Strong local culture and career progression', type: 'retained' },
  { source: 'london', target: 'newcastle', count: 4, reason: 'Lower cost of living', type: 'gain' },
  { source: 'manchester', target: 'leeds', count: 2, reason: 'Shorter commute', type: 'transfer' },
  { source: 'london', target: 'london', count: 300, reason: 'Established network and opportunities', type: 'retained' },
  { source: 'manchester', target: 'manchester', count: 150, reason: 'Growing tech hub', type: 'retained' },
  { source: 'edinburgh', target: 'edinburgh', count: 80, reason: 'Quality of life', type: 'retained' },
  { source: 'leeds', target: 'leeds', count: 60, reason: 'Local community', type: 'retained' },
  { source: 'birmingham', target: 'birmingham', count: 90, reason: 'Central location', type: 'retained' },
];

function GeographicFlowMap() {
  const [hoveredFlow, setHoveredFlow] = useState<typeof flows[0] | null>(null);
  const [hoveredOffice, setHoveredOffice] = useState<typeof offices[0] | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
 
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
 
  const getTooltipStyle = (): React.CSSProperties => {
    if (!containerRef.current) return { left: mousePos.x, top: mousePos.y };
   
    const rect = containerRef.current.getBoundingClientRect();
    const isRightHalf = mousePos.x > rect.width / 2;
    const isBottomHalf = mousePos.y > rect.height / 2;
   
    return {
      left: mousePos.x,
      top: mousePos.y,
      transform: `translate(${isRightHalf ? 'calc(-100% - 15px)' : '15px'}, ${isBottomHalf ? 'calc(-100% - 15px)' : '15px'})`
    };
  };

  return (
    <div style={{ width: '100%', height: 800, display: 'flex', flexDirection: 'column', backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative', borderRadius: 12 }}>
      <style>{`
        @keyframes custom-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ background: 'linear-gradient(to bottom, #050505 20%, rgba(5,5,5,0.8) 70%, transparent 100%)', position: 'absolute', top: 0, left: 0, right: 0, paddingBottom: 24, zIndex: 10, padding: 24, pointerEvents: 'none' }}>
        <div style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'white' }}>UK Office Mobility & Retention</div>
        <div style={{ fontSize: 13, color: '#a1a1aa', marginTop: 4 }}>
          Geographic flow of employees between Accenture UK offices.
          Hover over lines to see transfer reasons, and nodes for retention rates.
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12, color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444' }}></div> Loss</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981' }}></div> Retained</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3b82f6' }}></div> Gain</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#a855f7' }}></div> Transfer</div>
        </div>
      </div>

      <div ref={containerRef} style={{ flex: 1, position: 'relative', padding: 0, marginTop: 96 }} onMouseMove={handleMouseMove}>
        <svg style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="uk-3d-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1.5" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.9" />
            </filter>
          </defs>

          {/* 3D Base/Extrusion */}
          <g filter="url(#uk-3d-shadow)">
            <path
              d="M 35 5 L 45 5 L 52 15 L 48 22 L 50 25 L 55 32 L 65 48 L 78 62 L 75 78 L 68 85 L 55 85 L 35 92 L 22 96 L 20 88 L 35 82 L 38 78 L 25 72 L 28 60 L 40 55 L 38 40 L 32 32 L 35 25 L 28 18 L 25 10 Z"
              fill="#1a1a1a"
              transform="translate(1, 1.5)"
            />
            <path
              d="M 15 35 L 22 35 L 25 42 L 20 48 L 12 45 Z"
              fill="#1a1a1a"
              transform="translate(1, 1.5)"
            />
          </g>

          {/* Abstract UK Map Outline (Top Surface) */}
          <path
            d="M 35 5 L 45 5 L 52 15 L 48 22 L 50 25 L 55 32 L 65 48 L 78 62 L 75 78 L 68 85 L 55 85 L 35 92 L 22 96 L 20 88 L 35 82 L 38 78 L 25 72 L 28 60 L 40 55 L 38 40 L 32 32 L 35 25 L 28 18 L 25 10 Z"
            fill="#0a0a0a"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="0.6"
          />
          {/* Northern Ireland (Top Surface) */}
          <path
            d="M 15 35 L 22 35 L 25 42 L 20 48 L 12 45 Z"
            fill="#0a0a0a"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="0.6"
          />

          {/* Draw flows */}
          {flows.map((flow, idx) => {
            const source = offices.find(o => o.id === flow.source);
            const target = offices.find(o => o.id === flow.target);
            if (!source || !target) return null;
 
            const isSelf = source.id === target.id;
            const isHovered = hoveredFlow === flow;
            const isFaded = hoveredFlow && hoveredFlow !== flow;
 
            if (isSelf) {
              const loopRadius = Math.max(1.5, Math.min(4, Math.sqrt(flow.count) * 0.25));
              const loopDuration = Math.max(2, 20 / Math.sqrt(flow.count));
 
              return (
                <g key={`flow-${idx}`}
                   onMouseEnter={() => setHoveredFlow(flow)}
                   onMouseLeave={() => setHoveredFlow(null)}
                   style={{ cursor: 'pointer', opacity: isFaded ? 0.1 : 1, transition: 'opacity 0.3s' }}>
                  <circle
                    cx={source.x}
                    cy={source.y}
                    r={isHovered ? loopRadius * 1.3 : loopRadius}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth={isHovered ? 0.6 : 0.3}
                    strokeDasharray={isHovered ? "none" : "0.5,0.5"}
                    style={{
                      transformOrigin: `${source.x}px ${source.y}px`,
                      animation: `custom-spin ${isHovered ? loopDuration * 0.4 : loopDuration}s linear infinite`
                    }}
                  />
                  <circle
                    cx={source.x}
                    cy={source.y}
                    r={loopRadius * 1.5}
                    fill="transparent"
                    stroke="transparent"
                    strokeWidth={1.5}
                  />
                </g>
              );
            }
 
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const dr = Math.sqrt(dx * dx + dy * dy) * 1.2;
 
            let strokeColor = '#888';
            if (flow.type === 'loss') strokeColor = '#ef4444';
            if (flow.type === 'gain') strokeColor = '#3b82f6';
            if (flow.type === 'transfer') strokeColor = '#a855f7';
 
            const dotRadius = Math.max(0.3, Math.min(1.5, Math.sqrt(flow.count) * 0.15));
            const dotDuration = Math.max(1.5, 12 / Math.sqrt(flow.count));
 
            return (
              <g key={`flow-${idx}`}
                 onMouseEnter={() => setHoveredFlow(flow)}
                 onMouseLeave={() => setHoveredFlow(null)}
                 style={{ cursor: 'pointer', opacity: isFaded ? 0.1 : 1, transition: 'opacity 0.3s' }}>
                <path
                  id={`path-${idx}`}
                  d={`M${source.x},${source.y} A${dr},${dr} 0 0,1 ${target.x},${target.y}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isHovered ? 0.8 : Math.max(0.2, Math.min(0.8, flow.count * 0.02))}
                  strokeOpacity={isHovered ? 1 : 0.4}
                />
                <path
                  d={`M${source.x},${source.y} A${dr},${dr} 0 0,1 ${target.x},${target.y}`}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={1.5}
                />
                {(isHovered || !hoveredFlow) && (
                  <circle r={isHovered ? dotRadius * 1.5 : dotRadius} fill={strokeColor} opacity={isHovered ? 1 : 0.6}>
                    <animateMotion
                      dur={`${isHovered ? dotDuration * 0.5 : dotDuration}s`}
                      repeatCount="indefinite"
                      path={`M${source.x},${source.y} A${dr},${dr} 0 0,1 ${target.x},${target.y}`}
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Draw offices */}
          {offices.map((office) => {
            const isHovered = hoveredOffice?.id === office.id || hoveredFlow?.source === office.id || hoveredFlow?.target === office.id;
           
            return (
              <g key={office.id}
                 transform={`translate(${office.x}, ${office.y})`}
                 onMouseEnter={() => {
                   setHoveredOffice(office);
                   const retainedFlow = flows.find(f => f.source === office.id && f.target === office.id);
                   if (retainedFlow) setHoveredFlow(retainedFlow);
                 }}
                 onMouseLeave={() => {
                   setHoveredOffice(null);
                   setHoveredFlow(null);
                 }}
                 style={{ cursor: 'pointer' }}>
                <circle
                  r={isHovered ? 1 : 0.6}
                  fill={office.id === 'newcastle' ? '#a100ff' : '#1a1a1a'}
                  stroke={office.id === 'newcastle' ? '#fff' : '#888'}
                  strokeWidth={0.2}
                  style={{ transition: 'all 0.3s' }}
                />
                <text
                  y={isHovered ? -3.5 : -2.8}
                  textAnchor="middle"
                  fill={isHovered ? "#fff" : "#aaa"}
                  fontSize={isHovered ? "2.2px" : "1.6px"}
                  fontWeight={office.id === 'newcastle' || isHovered ? "bold" : "normal"}
                  style={{ transition: 'all 0.3s', pointerEvents: 'none' }}
                >
                  {office.name}
                </text>
                {(isHovered || hoveredOffice?.id === office.id) && (
                  <text
                    y={isHovered ? 4 : 3.2}
                    textAnchor="middle"
                    fill="#10b981"
                    fontSize="1.4px"
                    fontWeight="bold"
                    style={{ pointerEvents: 'none', transition: 'all 0.3s' }}
                  >
                    {office.retention}% Retained
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip Overlay */}
        {(hoveredFlow || hoveredOffice) && (
          <div
            style={{ position: 'absolute', zIndex: 50, pointerEvents: 'none', ...getTooltipStyle() }}
          >
            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', padding: 16, borderRadius: 8, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', minWidth: 260, maxWidth: 350, width: 'max-content', transition: 'all 0.1s' }}>
              {hoveredFlow ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontWeight: 700, textTransform: 'capitalize', color: '#fff' }}>{hoveredFlow.source}</span>
                    {hoveredFlow.source !== hoveredFlow.target && (
                      <>
                        <span style={{ color: '#9ca3af' }}>→</span>
                        <span style={{ fontWeight: 700, textTransform: 'capitalize', color: '#fff' }}>{hoveredFlow.target}</span>
                      </>
                    )}
                  </div>
                  <span style={{ flexShrink: 0, padding: '2px 6px', borderRadius: 4, fontSize: 11, fontWeight: 700, 
                    backgroundColor: hoveredFlow.type === 'retained' ? 'rgba(16,185,129,0.2)' : hoveredFlow.type === 'loss' ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)',
                    color: hoveredFlow.type === 'retained' ? '#34d399' : hoveredFlow.type === 'loss' ? '#f87171' : '#60a5fa'
                  }}>
                    {hoveredFlow.count} Employees
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#d1d5db' }}>
                  <span style={{ color: '#9ca3af', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>
                    {hoveredFlow.type === 'retained' ? 'Retention Driver' : 'Primary Reason for Leaving'}
                  </span>
                  {hoveredFlow.reason}
                </div>
              </>
            ) : hoveredOffice ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, textTransform: 'capitalize', color: '#fff' }}>{hoveredOffice.name}</span>
                  <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 11, fontWeight: 700, backgroundColor: 'rgba(16,185,129,0.2)', color: '#34d399' }}>
                    {hoveredOffice.retention}% Retained
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#d1d5db' }}>
                  <span style={{ color: '#9ca3af', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>
                    Office Status
                  </span>
                  General office metrics and retention.
                </div>
              </>
            ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LocalRetention() {
    const { filters } = useFilters();
    const year = filters.year === 'all' ? 2024 : (filters.year as number);

    const retData = RETENTION_DATA.filter((r) =>
        filters.universityId === 'all' ? true : r.universityId === filters.universityId
    );

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

    return (
        <div className="page animate-in">
            <div className="page-title">Local Retention & Stickiness</div>
            <div className="page-subtitle">
                Analysing whether North East hires are staying in the region · {year}
            </div>

            {/* LRI scores */}
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
            <div className="mb-24">

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

            {/* Geographic Flow Map */}
            <div className="mb-24">
                <GeographicFlowMap />
            </div>
        </div>
    );
}
