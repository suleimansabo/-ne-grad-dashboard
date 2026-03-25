// ============================================================
// CHART COMPONENTS: Dark-themed Recharts wrappers
// ============================================================

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend, Cell, PieChart, Pie, AreaChart, Area,
} from 'recharts';

// ─── Shared custom tooltip ────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DarkTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="custom-tooltip">
            <div className="label">{label}</div>
            {payload.map((p: { name: string; value: number; color: string }, i: number) => (
                <div key={i} className="item">
                    <span className="dot" style={{ background: p.color }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
                    <span style={{ fontWeight: 700 }}>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
                </div>
            ))}
        </div>
    );
};

const GRID_PROPS = { stroke: 'rgba(255,255,255,0.05)', strokeDasharray: '3 3' };
const AXIS_PROPS = { tick: { fill: 'var(--text-muted)', fontSize: 11 }, axisLine: false, tickLine: false };

// ─── Multi-bar grouped chart ──────────────────────────────────

interface BarChartProps {
    data: object[];
    bars: { key: string; name: string; color: string }[];
    xKey: string;
    unit?: string;
    height?: number;
}

export function MultiBarChart({ data, bars, xKey, unit = '', height = 280 }: BarChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 4, right: 8, left: -10, bottom: 4 }}>
                <CartesianGrid {...GRID_PROPS} vertical={false} />
                <XAxis dataKey={xKey} {...AXIS_PROPS} />
                <YAxis {...AXIS_PROPS} tickFormatter={(v) => `${v}${unit}`} />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
                {bars.map((b) => (
                    <Bar key={b.key} dataKey={b.key} name={b.name} fill={b.color} radius={[4, 4, 0, 0]} maxBarSize={40} />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
}

// ─── Multi-line trend chart ───────────────────────────────────

interface LineChartProps {
    data: object[];
    lines: { key: string; name: string; color: string; dashed?: boolean }[];
    xKey: string;
    unit?: string;
    height?: number;
}

export function MultiLineChart({ data, lines, xKey, unit = '', height = 280 }: LineChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 4, right: 8, left: -10, bottom: 4 }}>
                <CartesianGrid {...GRID_PROPS} />
                <XAxis dataKey={xKey} {...AXIS_PROPS} />
                <YAxis {...AXIS_PROPS} tickFormatter={(v) => `${v}${unit}`} />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
                {lines.map((l) => (
                    <Line
                        key={l.key}
                        dataKey={l.key}
                        name={l.name}
                        stroke={l.color}
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: l.color }}
                        activeDot={{ r: 6 }}
                        strokeDasharray={l.dashed ? '6 3' : undefined}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
}

// ─── Stacked area chart ───────────────────────────────────────

interface AreaChartProps {
    data: object[];
    areas: { key: string; name: string; color: string }[];
    xKey: string;
    unit?: string;
    height?: number;
}

export function StackedAreaChart({ data, areas, xKey, unit = '', height = 280 }: AreaChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 4, right: 8, left: -10, bottom: 4 }}>
                <defs>
                    {areas.map((a) => (
                        <linearGradient key={a.key} id={`grad-${a.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={a.color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={a.color} stopOpacity={0.03} />
                        </linearGradient>
                    ))}
                </defs>
                <CartesianGrid {...GRID_PROPS} />
                <XAxis dataKey={xKey} {...AXIS_PROPS} />
                <YAxis {...AXIS_PROPS} tickFormatter={(v) => `${v}${unit}`} />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
                {areas.map((a) => (
                    <Area key={a.key} type="monotone" dataKey={a.key} name={a.name} stroke={a.color} strokeWidth={2.5} fill={`url(#grad-${a.key})`} />
                ))}
            </AreaChart>
        </ResponsiveContainer>
    );
}

// ─── Donut / Pie chart ────────────────────────────────────────

interface DonutChartProps {
    data: { name: string; value: number; color: string }[];
    innerRadius?: number;
    height?: number;
    centerLabel?: string;
    centerValue?: string;
}

export function DonutChart({ data, innerRadius = 55, height = 220, centerLabel, centerValue }: DonutChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={innerRadius}
                    outerRadius={innerRadius + 28}
                    paddingAngle={3}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip content={<DarkTooltip />} />
                {centerLabel && (
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="recharts-text">
                        <tspan x="50%" dy="-6" style={{ fontSize: 18, fontWeight: 800, fill: 'var(--text-primary)' }}>{centerValue}</tspan>
                        <tspan x="50%" dy="18" style={{ fontSize: 11, fill: 'var(--text-muted)' }}>{centerLabel}</tspan>
                    </text>
                )}
            </PieChart>
        </ResponsiveContainer>
    );
}

// ─── Simple horizontal bar chart ─────────────────────────────

interface HBarChartProps {
    data: object[];
    bars: { key: string; name: string; color: string }[];
    yKey: string; // category field
    unit?: string;
    height?: number;
}

export function HorizontalBarChart({ data, bars, yKey, unit = '', height }: HBarChartProps) {
    const h = height ?? Math.max(220, data.length * 48);
    return (
        <ResponsiveContainer width="100%" height={h}>
            <BarChart layout="vertical" data={data} margin={{ top: 4, right: 16, left: 80, bottom: 4 }}>
                <CartesianGrid {...GRID_PROPS} horizontal={false} />
                <XAxis type="number" {...AXIS_PROPS} tickFormatter={(v) => `${v}${unit}`} />
                <YAxis type="category" dataKey={yKey} {...AXIS_PROPS} width={75} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <Tooltip content={<DarkTooltip />} />
                {bars.length > 1 && <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />}
                {bars.map((b) => (
                    <Bar key={b.key} dataKey={b.key} name={b.name} fill={b.color} radius={[0, 4, 4, 0]} maxBarSize={24} />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
}
