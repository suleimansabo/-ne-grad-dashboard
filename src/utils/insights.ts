// ============================================================
// UTILITIES: Insight Generator
// Generates plain-English insights from the mock data
// ============================================================

import { RETENTION_DATA } from '../data/retention';
import { TRANSFERS, LEAKAGE_SUMMARY } from '../data/transfers';
import { FUNNEL_DATA } from '../data/funnel';

export type InsightSeverity = 'positive' | 'warning' | 'critical' | 'info';

export interface Insight {
    id: string;
    severity: InsightSeverity;
    title: string;
    body: string;
    metric?: string;
    change?: string;
}

function compareRetention(universityId: string, years: [number, number]) {
    const [y1, y2] = years;
    const r1 = RETENTION_DATA.find((r) => r.universityId === universityId && r.year === y1);
    const r2 = RETENTION_DATA.find((r) => r.universityId === universityId && r.year === y2);
    if (!r1 || !r2) return null;
    return { from: r1, to: r2, delta12m: r2.retention12m - r1.retention12m, deltaHires: r2.totalHires - r1.totalHires };
}

export function generateInsights(): Insight[] {
    const insights: Insight[] = [];

    // ─── Northumbria application volume vs acceptance ───
    const numFunnel2024 = FUNNEL_DATA.filter((f) => f.universityId === 'northumbria' && f.year === 2024);
    const numFunnel2023 = FUNNEL_DATA.filter((f) => f.universityId === 'northumbria' && f.year === 2023);
    const apps2024 = numFunnel2024.reduce((s, r) => s + r.completedApplications, 0);
    const apps2023 = numFunnel2023.reduce((s, r) => s + r.completedApplications, 0);
    const offers2024 = numFunnel2024.reduce((s, r) => s + r.offers, 0);
    const acc2024 = numFunnel2024.reduce((s, r) => s + r.acceptedOffers, 0);
    const accRate2024 = offers2024 > 0 ? (acc2024 / offers2024) * 100 : 0;
    const offers2023 = numFunnel2023.reduce((s, r) => s + r.offers, 0);
    const acc2023 = numFunnel2023.reduce((s, r) => s + r.acceptedOffers, 0);
    const accRate2023 = offers2023 > 0 ? (acc2023 / offers2023) * 100 : 0;

    if (apps2024 > apps2023 && accRate2024 < accRate2023) {
        insights.push({
            id: 'NU-001',
            severity: 'warning',
            title: 'Northumbria: Volume up, acceptance down',
            body: `Applications from Northumbria University rose ${Math.round(((apps2024 - apps2023) / apps2023) * 100)}% year-on-year, but offer acceptance rate fell from ${accRate2023.toFixed(0)}% to ${accRate2024.toFixed(0)}%. Review the candidate experience or offer competitiveness for this cohort.`,
            metric: 'Acceptance Rate',
            change: `-${(accRate2023 - accRate2024).toFixed(1)}pp`,
        });
    }

    // ─── Non-local hire transfer risk ───
    const leakage2024 = LEAKAGE_SUMMARY.find((l) => l.year === 2024);
    if (leakage2024) {
        const nonLocalPct = Math.round((leakage2024.hiresFromLondonSE / leakage2024.totalNEHires) * 100);
        insights.push({
            id: 'LEA-001',
            severity: 'critical',
            title: 'Non-local hires show higher London transfer risk',
            body: `${nonLocalPct}% of 2024 Newcastle hires originated from London or the South East. These candidates generate ${leakage2024.feederIndexPct}% of internal transfers to London within 24 months — significantly above the local-origin baseline.`,
            metric: 'Feeder Index',
            change: `${leakage2024.feederIndexPct}%`,
        });
    }

    // ─── Newcastle vs Northumbria retention ───
    const nclComp = compareRetention('newcastle', [2023, 2024]);
    const numComp = compareRetention('northumbria', [2023, 2024]);
    if (nclComp && numComp) {
        insights.push({
            id: 'RET-001',
            severity: 'info',
            title: 'Newcastle produces fewer hires but stronger retention',
            body: `In 2024, Newcastle University generated ${nclComp.to.totalHires} hires vs Northumbria's ${numComp.to.totalHires}, but 12-month retention was ${nclComp.to.retention12m}% vs ${numComp.to.retention12m}%. Investing in Newcastle recruitment may yield better long-term value per hire.`,
            metric: '12m Retention Delta',
            change: `+${(nclComp.to.retention12m - numComp.to.retention12m).toFixed(0)}pp`,
        });
    }

    // ─── Transfer trends ───
    const approved2024 = TRANSFERS.filter((t) => t.approved && t.year === 2024).length;
    const approved2023 = TRANSFERS.filter((t) => t.approved && t.year === 2023).length;
    if (approved2024 > approved2023) {
        insights.push({
            id: 'TRF-001',
            severity: 'warning',
            title: 'Approved London transfers increasing',
            body: `Approved internal transfers from Newcastle to London rose from ${approved2023} in 2023 to ${approved2024} in 2024. If this trend continues, Accenture Newcastle risks being perceived as a stepping-stone office rather than a genuine career destination.`,
            metric: 'Approved Transfers',
            change: `+${approved2024 - approved2023}`,
        });
    }

    // ─── Durham high retention positive ───
    const durComp = compareRetention('durham', [2023, 2024]);
    if (durComp && durComp.to.retention12m >= 88) {
        insights.push({
            id: 'DUR-001',
            severity: 'positive',
            title: 'Durham University: Strong retention performer',
            body: `Durham University hires maintain the highest 12-month retention across all NE universities at ${durComp.to.retention12m}%. Despite lower absolute volumes, Durham candidates show strong commitment to the Newcastle office. Consider increasing campus investment here.`,
            metric: '12m Retention',
            change: `${durComp.to.retention12m}%`,
        });
    }

    // ─── Leakage feeder index trending up ───
    const leakage23 = LEAKAGE_SUMMARY.find((l) => l.year === 2023);
    const leakage22 = LEAKAGE_SUMMARY.find((l) => l.year === 2022);
    if (leakage2024 && leakage23 && leakage22) {
        const feederTrend = leakage2024.feederIndexPct - leakage22.feederIndexPct;
        if (feederTrend > 4) {
            insights.push({
                id: 'LEA-002',
                severity: 'critical',
                title: 'Newcastle feeder-to-London index rising year-on-year',
                body: `The proportion of Newcastle hires that transferred to London within 24 months has risen from ${leakage22.feederIndexPct}% (2022) to ${leakage2024.feederIndexPct}% (2024). Immediate action on local engagement and career pathing in Newcastle is recommended.`,
                metric: 'Feeder Index (2-yr)',
                change: `+${feederTrend}pp`,
            });
        }
    }

    return insights;
}

// "What changed this month?" summary
export function getMonthlyChangeSummary(): string {
    return 'Northumbria applications are up 12% vs last month, but 3 new London transfer requests have been logged — the highest in a single month this year. Durham retention at 12 months remains the strongest in the North East cohort.';
}
