// ============================================================
// COMPONENT: Sidebar Navigation
// ============================================================

import { Building2, Users, Megaphone, ChevronRight } from 'lucide-react';

export type PageId =
    | 'university-landscape'
    | 'local-retention'
    | 'campaign-effectiveness'
    | 'campaign-calculator';

interface NavItem {
    id: PageId;
    label: string;
    icon: React.ReactNode;
    section: string;
}

const NAV_ITEMS: NavItem[] = [
    { id: 'university-landscape', label: 'University Landscape', icon: <Building2 size={15} />, section: 'Analytics' },
    { id: 'local-retention', label: 'Local Retention', icon: <Users size={15} />, section: 'Analytics' },
    { id: 'campaign-effectiveness', label: 'Campaign Effectiveness', icon: <Megaphone size={15} />, section: 'Campaigns' },
    { id: 'campaign-calculator', label: 'Campaign Calculator', icon: <Megaphone size={15} />, section: 'Campaigns' },
];

const SECTIONS = ['Overview', 'Analytics', 'Campaigns'];

interface SidebarProps {
    activePage: PageId;
    onNavigate: (page: PageId) => void;
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-mark">A</div>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Accenture</div>
                    <div className="sidebar-logo-text">NE Talent Hub</div>
                </div>
            </div>

            {/* Navigation */}
            {SECTIONS.map((section) => {
                const items = NAV_ITEMS.filter((n) => n.section === section);
                return (
                    <div key={section} className="sidebar-section">
                        <div className="sidebar-section-label">{section}</div>
                        {items.map((item) => (
                            <button
                                key={item.id}
                                className={`nav-item${activePage === item.id ? ' active' : ''}`}
                                onClick={() => onNavigate(item.id)}
                                id={`nav-${item.id}`}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span style={{ flex: 1 }}>{item.label}</span>
                                {activePage === item.id && <ChevronRight size={12} />}
                            </button>
                        ))}
                    </div>
                );
            })}

            {/* Footer */}
            <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Mock Data Mode</div>
                    Replace <code style={{ fontSize: 10, background: 'var(--bg-input)', padding: '1px 4px', borderRadius: 3 }}>src/data/</code> with real API endpoints
                </div>
            </div>
        </aside>
    );
}
