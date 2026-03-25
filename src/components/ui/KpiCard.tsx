// ============================================================
// COMPONENT: KPI Card with trend arrows
// ============================================================

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type TrendDir = 'up' | 'down' | 'flat';
type CardStatus = 'positive' | 'negative' | 'warning' | 'neutral' | 'info';

interface KpiCardProps {
    id?: string;
    label: string;
    value: string;
    trend?: TrendDir;
    change?: string;
    basis?: string;
    status?: CardStatus;
    tooltip?: string;
    icon?: React.ReactNode;
}

export default function KpiCard({ id, label, value, trend, change, basis, status = 'neutral', tooltip, icon }: KpiCardProps) {
    return (
        <div id={id} className={`kpi-card ${status} animate-in`} title={tooltip}>
            <div className="kpi-label">
                {icon && <span style={{ color: 'var(--accent)' }}>{icon}</span>}
                {label}
            </div>
            <div className="kpi-value">{value}</div>
            {(trend || basis) && (
                <div className="kpi-footer">
                    {trend && (
                        <span className={`kpi-trend ${trend}`}>
                            {trend === 'up' && <TrendingUp size={13} />}
                            {trend === 'down' && <TrendingDown size={13} />}
                            {trend === 'flat' && <Minus size={13} />}
                            {change}
                        </span>
                    )}
                    {basis && <span className="kpi-basis">{basis}</span>}
                </div>
            )}
        </div>
    );
}
