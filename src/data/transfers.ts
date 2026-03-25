// ============================================================
// MOCK DATA: Internal Transfers (Newcastle → London leakage)
// Replace with API call or CSV import as needed.
// ============================================================

export interface Transfer {
    id: string;
    hireId: string;
    fromOffice: 'Newcastle' | 'Manchester' | 'Edinburgh';
    toOffice: 'London' | 'Manchester' | 'Edinburgh';
    requestedAtMonths: number; // months after joining
    approved: boolean;
    approvalMonths?: number; // months after request
    homeRegion: string;
    originUniversity: string;
    originUniversityId: string;
    year: number; // hire year
    subject: string;
}

// Summary stats for the Leakage view
export interface LeakageSummary {
    year: number;
    totalNEHires: number;
    hiresFromLondonSE: number; // originally from London or South East
    hiresStillInNE12m: number;
    hiresStillInNE24m: number;
    transfersToLondon12m: number;
    transferRequestsPending: number;
    feederIndexPct: number; // % of NE hires that ended up in London within 24m
}

export const TRANSFERS: Transfer[] = [
    { id: 't001', hireId: 'h007', fromOffice: 'Newcastle', toOffice: 'London', requestedAtMonths: 8, approved: true, approvalMonths: 2, homeRegion: 'London', originUniversity: 'Newcastle University', originUniversityId: 'newcastle', year: 2023, subject: 'Business & Management' },
    { id: 't002', hireId: 'h008', fromOffice: 'Newcastle', toOffice: 'London', requestedAtMonths: 10, approved: true, approvalMonths: 2, homeRegion: 'South East', originUniversity: 'Newcastle University', originUniversityId: 'newcastle', year: 2024, subject: 'Computing' },
    { id: 't003', hireId: 'h009', fromOffice: 'Newcastle', toOffice: 'London', requestedAtMonths: 6, approved: true, approvalMonths: 1, homeRegion: 'London', originUniversity: 'Newcastle University', originUniversityId: 'newcastle', year: 2024, subject: 'Business & Management' },
    { id: 't004', hireId: 'h017', fromOffice: 'Newcastle', toOffice: 'London', requestedAtMonths: 7, approved: true, approvalMonths: 2, homeRegion: 'London', originUniversity: 'Northumbria University', originUniversityId: 'northumbria', year: 2023, subject: 'Business & Management' },
    { id: 't005', hireId: 'h018', fromOffice: 'Newcastle', toOffice: 'London', requestedAtMonths: 9, approved: true, approvalMonths: 2, homeRegion: 'South East', originUniversity: 'Northumbria University', originUniversityId: 'northumbria', year: 2024, subject: 'Computing' },
    { id: 't006', hireId: 'h019', fromOffice: 'Newcastle', toOffice: 'London', requestedAtMonths: 11, approved: false, homeRegion: 'London', originUniversity: 'Northumbria University', originUniversityId: 'northumbria', year: 2024, subject: 'Business & Management' },
    { id: 't007', hireId: 'h003', fromOffice: 'Newcastle', toOffice: 'London', requestedAtMonths: 18, approved: true, approvalMonths: 3, homeRegion: 'North East', originUniversity: 'Newcastle University', originUniversityId: 'newcastle', year: 2023, subject: 'Engineering & Technology' },
    { id: 't008', hireId: 'h012', fromOffice: 'Newcastle', toOffice: 'London', requestedAtMonths: 14, approved: false, homeRegion: 'North East', originUniversity: 'Northumbria University', originUniversityId: 'northumbria', year: 2023, subject: 'Business & Management' },
];

export const LEAKAGE_SUMMARY: LeakageSummary[] = [
    {
        year: 2022,
        totalNEHires: 178,
        hiresFromLondonSE: 32,
        hiresStillInNE12m: 152,
        hiresStillInNE24m: 128,
        transfersToLondon12m: 18,
        transferRequestsPending: 4,
        feederIndexPct: 14,
    },
    {
        year: 2023,
        totalNEHires: 205,
        hiresFromLondonSE: 40,
        hiresStillInNE12m: 172,
        hiresStillInNE24m: 141,
        transfersToLondon12m: 26,
        transferRequestsPending: 5,
        feederIndexPct: 18,
    },
    {
        year: 2024,
        totalNEHires: 240,
        hiresFromLondonSE: 52,
        hiresStillInNE12m: 198,
        hiresStillInNE24m: 162,
        transfersToLondon12m: 35,
        transferRequestsPending: 8,
        feederIndexPct: 21,
    },
    {
        year: 2025,
        totalNEHires: 253,
        hiresFromLondonSE: 58,
        hiresStillInNE12m: 0, // data not yet available (too recent)
        hiresStillInNE24m: 0,
        transfersToLondon12m: 12, // YTD
        transferRequestsPending: 14,
        feederIndexPct: 0,
    },
];

// Flow data for Sankey-style chart: Newcastle → [Stay Newcastle, Transfer London, Leave]
export const FLOW_DATA = [
    { year: 2022, stayNewcastle: 128, transferLondon: 18, otherTransfer: 4, left: 28 },
    { year: 2023, stayNewcastle: 141, transferLondon: 26, otherTransfer: 6, left: 32 },
    { year: 2024, stayNewcastle: 162, transferLondon: 35, otherTransfer: 8, left: 35 },
];
