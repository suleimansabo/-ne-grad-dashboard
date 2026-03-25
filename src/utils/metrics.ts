// ============================================================
// UTILITIES: KPI Calculators & Local Retention Index
// ============================================================

import { FUNNEL_DATA } from '../data/funnel';
import type { FunnelRecord } from '../data/funnel';
import { HIRES } from '../data/hires';
import type { Hire } from '../data/hires';
import { RETENTION_DATA } from '../data/retention';

export interface GlobalFilters {
    year: number | 'all';
    universityId: string | 'all';
    subject: string | 'all';
    candidateRegion: string | 'all';
    officePreference: string | 'all';
}

// ─── Funnel helpers ──────────────────────────────────────────

export function filterFunnel(filters: GlobalFilters): FunnelRecord[] {
    return FUNNEL_DATA.filter((r) => {
        if (filters.year !== 'all' && r.year !== filters.year) return false;
        if (filters.universityId !== 'all' && r.universityId !== filters.universityId) return false;
        if (filters.subject !== 'all' && r.subject !== filters.subject) return false;
        if (filters.candidateRegion !== 'all' && r.candidateRegion !== filters.candidateRegion) return false;
        if (filters.officePreference !== 'all' && r.officePreference !== filters.officePreference) return false;
        return true;
    });
}

export function sumFunnel(records: FunnelRecord[]) {
    return records.reduce(
        (acc, r) => ({
            campaignReach: acc.campaignReach + r.campaignReach,
            eventRegistrations: acc.eventRegistrations + r.eventRegistrations,
            eventAttendance: acc.eventAttendance + r.eventAttendance,
            applicationStarts: acc.applicationStarts + r.applicationStarts,
            completedApplications: acc.completedApplications + r.completedApplications,
            interviews: acc.interviews + r.interviews,
            offers: acc.offers + r.offers,
            acceptedOffers: acc.acceptedOffers + r.acceptedOffers,
            joinedHires: acc.joinedHires + r.joinedHires,
        }),
        { campaignReach: 0, eventRegistrations: 0, eventAttendance: 0, applicationStarts: 0, completedApplications: 0, interviews: 0, offers: 0, acceptedOffers: 0, joinedHires: 0 }
    );
}

// ─── Hire helpers ─────────────────────────────────────────────

export function filterHires(filters: GlobalFilters): Hire[] {
    return HIRES.filter((h) => {
        if (filters.year !== 'all' && h.year !== filters.year) return false;
        if (filters.universityId !== 'all' && h.universityId !== filters.universityId) return false;
        if (filters.subject !== 'all' && h.subject !== filters.subject) return false;
        if (filters.candidateRegion !== 'all' && h.homeRegion !== filters.candidateRegion) return false;
        return true;
    });
}

// ─── Retention helpers ─────────────────────────────────────────

export function getRetentionForYear(year: number | 'all') {
    const data = year === 'all' ? RETENTION_DATA : RETENTION_DATA.filter((r) => r.year === year);
    return data;
}

// ─── Executive KPIs ───────────────────────────────────────────

export interface ExecKPIs {
    totalApplications: number;
    prevYearApplications: number;
    applicationGrowthPct: number;
    offerAcceptanceRate: number;
    retention12m: number;
    transferOutRate: number;
    localOriginHireShare: number;
    topUniversity: string;
    topUniversityHires: number;
}

export function calcExecKPIs(filters: GlobalFilters): ExecKPIs {
    const funnel = filterFunnel(filters);
    const sum = sumFunnel(funnel);

    // Previous year comparison
    const prevYear = filters.year === 'all' ? 2023 : (filters.year as number) - 1;
    const prevFilters = { ...filters, year: prevYear };
    const prevFunnel = filterFunnel(prevFilters);
    const prevSum = sumFunnel(prevFunnel);

    const offerAcceptanceRate = sum.offers > 0 ? (sum.acceptedOffers / sum.offers) * 100 : 0;
    const applicationGrowthPct =
        prevSum.completedApplications > 0
            ? ((sum.completedApplications - prevSum.completedApplications) / prevSum.completedApplications) * 100
            : 0;

    // Retention across filtered cohorts
    const retYear = filters.year === 'all' ? 2024 : (filters.year as number);
    const retData = RETENTION_DATA.filter(
        (r) => r.year === retYear && (filters.universityId === 'all' || r.universityId === filters.universityId)
    );
    const avgRetention12m =
        retData.length > 0 ? retData.reduce((s, r) => s + r.retention12m, 0) / retData.length : 0;

    // Transfer out rate
    const hires = filterHires(filters);
    const transferOut = hires.filter((h) => h.transferRequest && h.transferRequestMonths && h.transferRequestMonths <= 12).length;
    const transferOutRate = hires.length > 0 ? (transferOut / hires.length) * 100 : 0;

    // Local origin share
    const localOrigin = hires.filter((h) => h.homeRegion === 'North East').length;
    const localOriginHireShare = hires.length > 0 ? (localOrigin / hires.length) * 100 : 0;

    // Top university by hires
    const byUni = RETENTION_DATA.filter((r) => r.year === retYear).sort((a, b) => b.totalHires - a.totalHires);
    const top = byUni[0];

    return {
        totalApplications: sum.completedApplications,
        prevYearApplications: prevSum.completedApplications,
        applicationGrowthPct: Math.round(applicationGrowthPct * 10) / 10,
        offerAcceptanceRate: Math.round(offerAcceptanceRate * 10) / 10,
        retention12m: Math.round(avgRetention12m * 10) / 10,
        transferOutRate: Math.round(transferOutRate * 10) / 10,
        localOriginHireShare: Math.round(localOriginHireShare * 10) / 10,
        topUniversity: top?.university ?? '—',
        topUniversityHires: top?.totalHires ?? 0,
    };
}

// ─── Local Retention Index per university ─────────────────────

export interface LRIByUniversity {
    university: string;
    universityId: string;
    avgLRI: number;
    totalHires: number;
    localOriginPct: number;
}

export function getLRIByUniversity(year: number | 'all'): LRIByUniversity[] {
    const hires = year === 'all' ? HIRES : HIRES.filter((h) => h.year === year);
    const grouped: Record<string, Hire[]> = {};
    for (const h of hires) {
        grouped[h.universityId] = grouped[h.universityId] ?? [];
        grouped[h.universityId].push(h);
    }
    return Object.entries(grouped).map(([uid, hs]) => ({
        university: hs[0].university,
        universityId: uid,
        avgLRI: Math.round((hs.reduce((s, h) => s + h.localRetentionIndex, 0) / hs.length) * 10) / 10,
        totalHires: hs.length,
        localOriginPct: Math.round((hs.filter((h) => h.homeRegion === 'North East').length / hs.length) * 100 * 10) / 10,
    }));
}

// ─── Format helpers ───────────────────────────────────────────

export function pct(n: number, decimals = 1): string {
    return `${n.toFixed(decimals)}%`;
}

export function num(n: number): string {
    return n.toLocaleString();
}

export function delta(n: number): string {
    return n >= 0 ? `+${n.toFixed(1)}%` : `${n.toFixed(1)}%`;
}

export function trend(current: number, previous: number): 'up' | 'down' | 'flat' {
    if (current > previous * 1.02) return 'up';
    if (current < previous * 0.98) return 'down';
    return 'flat';
}
