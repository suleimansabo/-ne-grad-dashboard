// ============================================================
// COMPONENT: Header and Filter Bar
// ============================================================

import { Download, RefreshCw, Info } from 'lucide-react';
import { useFilters } from '../../hooks/useFilters.tsx';
import { UNIVERSITIES } from '../../data/universities';
import { SUBJECTS } from '../../data/universities';

const YEARS = ['all', 2022, 2023, 2024, 2025];
const REGIONS = ['all', 'North East', 'Yorkshire', 'London', 'South East', 'Midlands', 'Scotland', 'Other'];
const OFFICES = ['all', 'Newcastle', 'London', 'No Preference'];

interface HeaderProps {
    pageTitle: string;
    pageSubtitle?: string;
}

export function Header({ pageTitle, pageSubtitle }: HeaderProps) {
    return (
        <header className="header">
            <div style={{ flex: 1 }}>
                <div className="header-title">
                    {pageTitle}
                    {pageSubtitle && <span className="header-subtitle">{pageSubtitle}</span>}
                </div>
            </div>
            <span className="header-badge">North East England</span>
            <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" id="btn-refresh" title="Refresh data">
                    <RefreshCw size={13} />
                </button>
                <button
                    className="btn btn-secondary btn-sm"
                    id="btn-export"
                    onClick={() => {
                        // CSV export hook: see utils/export.ts
                        alert('CSV export triggered. In production this would download data for the current view.');
                    }}
                >
                    <Download size={13} /> Export CSV
                </button>
            </div>
        </header>
    );
}

export function FilterBar() {
    const { filters, setFilter, resetFilters } = useFilters();

    return (
        <div className="filter-bar">
            <span className="filter-bar-label">
                <Info size={11} style={{ display: 'inline', marginRight: 4 }} />
                Filters
            </span>

            <select
                id="filter-year"
                className="filter-select"
                value={filters.year}
                onChange={(e) => setFilter('year', e.target.value === 'all' ? 'all' : Number(e.target.value))}
            >
                {YEARS.map((y) => (
                    <option key={y} value={y}>{y === 'all' ? 'All Years' : y}</option>
                ))}
            </select>

            <select
                id="filter-university"
                className="filter-select"
                value={filters.universityId}
                onChange={(e) => setFilter('universityId', e.target.value)}
            >
                <option value="all">All Universities</option>
                {UNIVERSITIES.map((u) => (
                    <option key={u.id} value={u.id}>{u.shortName}</option>
                ))}
            </select>

            <select
                id="filter-subject"
                className="filter-select"
                value={filters.subject}
                onChange={(e) => setFilter('subject', e.target.value)}
            >
                <option value="all">All Subjects</option>
                {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>

            <select
                id="filter-region"
                className="filter-select"
                value={filters.candidateRegion}
                onChange={(e) => setFilter('candidateRegion', e.target.value)}
            >
                {REGIONS.map((r) => (
                    <option key={r} value={r}>{r === 'all' ? 'All Regions' : r}</option>
                ))}
            </select>

            <select
                id="filter-office"
                className="filter-select"
                value={filters.officePreference}
                onChange={(e) => setFilter('officePreference', e.target.value)}
            >
                {OFFICES.map((o) => (
                    <option key={o} value={o}>{o === 'all' ? 'All Office Prefs' : o}</option>
                ))}
            </select>

            <button className="btn btn-secondary btn-sm" onClick={resetFilters} id="btn-reset-filters">
                Reset
            </button>
        </div>
    );
}
