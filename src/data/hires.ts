// ============================================================
// MOCK DATA: Hires with Local Retention Index
// Replace with API call or CSV import as needed.
// ============================================================

export type HomeRegion = 'North East' | 'Yorkshire' | 'London' | 'South East' | 'Midlands' | 'Scotland' | 'Other';
export type Office = 'Newcastle' | 'London' | 'Manchester' | 'Edinburgh';

export interface Hire {
    id: string;
    name: string; // anonymised
    year: number;
    university: string;
    universityId: string;
    subject: string;
    homeRegion: HomeRegion;
    officeApplied: Office;
    officeJoined: Office;
    transferRequest: boolean;
    transferRequestMonths?: number; // months after joining when requested
    transferApproved?: boolean;
    transferToOffice?: Office;
    stillActive6m: boolean;
    stillActive12m: boolean;
    stillActive24m: boolean;
    localRetentionIndex: number; // 0-100, calculated
}

// LRI Calculation helper (also available in utils/metrics.ts)
// 25pts: home region = North East
// 25pts: university in North East
// 25pts: no transfer within 12m
// 25pts: still active at 12m in-region

function calcLRI(hire: Omit<Hire, 'localRetentionIndex'>): number {
    let score = 0;
    if (hire.homeRegion === 'North East') score += 25;
    // All these universities are in NE
    const neUniversities = ['newcastle', 'northumbria', 'durham', 'teesside', 'sunderland'];
    if (neUniversities.includes(hire.universityId)) score += 25;
    if (!hire.transferRequest || (hire.transferRequestMonths !== undefined && hire.transferRequestMonths > 12)) score += 25;
    if (hire.stillActive12m && hire.officeJoined === 'Newcastle') score += 25;
    return score;
}

const hireBase: Omit<Hire, 'localRetentionIndex'>[] = [
    // ─── Newcastle University - NE local hires ───
    { id: 'h001', name: 'Candidate A', year: 2023, university: 'Newcastle University', universityId: 'newcastle', subject: 'Computing', homeRegion: 'North East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: false, stillActive6m: true, stillActive12m: true, stillActive24m: true },
    { id: 'h002', name: 'Candidate B', year: 2023, university: 'Newcastle University', universityId: 'newcastle', subject: 'Business & Management', homeRegion: 'North East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: false, stillActive6m: true, stillActive12m: true, stillActive24m: true },
    { id: 'h003', name: 'Candidate C', year: 2023, university: 'Newcastle University', universityId: 'newcastle', subject: 'Engineering & Technology', homeRegion: 'North East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: true, transferRequestMonths: 18, stillActive6m: true, stillActive12m: true, stillActive24m: false },
    { id: 'h004', name: 'Candidate D', year: 2023, university: 'Newcastle University', universityId: 'newcastle', subject: 'Mathematical Sciences', homeRegion: 'North East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: false, stillActive6m: true, stillActive12m: true, stillActive24m: true },
    { id: 'h005', name: 'Candidate E', year: 2024, university: 'Newcastle University', universityId: 'newcastle', subject: 'Computing', homeRegion: 'North East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: false, stillActive6m: true, stillActive12m: true, stillActive24m: true },
    { id: 'h006', name: 'Candidate F', year: 2024, university: 'Newcastle University', universityId: 'newcastle', subject: 'Business & Management', homeRegion: 'North East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: false, stillActive6m: true, stillActive12m: true, stillActive24m: true },

    // ─── Newcastle University - London origin at Newcastle ───
    { id: 'h007', name: 'Candidate G', year: 2023, university: 'Newcastle University', universityId: 'newcastle', subject: 'Business & Management', homeRegion: 'London', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: true, transferRequestMonths: 8, transferApproved: true, transferToOffice: 'London', stillActive6m: true, stillActive12m: false, stillActive24m: false },
    { id: 'h008', name: 'Candidate H', year: 2024, university: 'Newcastle University', universityId: 'newcastle', subject: 'Computing', homeRegion: 'South East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: true, transferRequestMonths: 10, transferApproved: true, transferToOffice: 'London', stillActive6m: true, stillActive12m: false, stillActive24m: false },
    { id: 'h009', name: 'Candidate I', year: 2024, university: 'Newcastle University', universityId: 'newcastle', subject: 'Business & Management', homeRegion: 'London', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: true, transferRequestMonths: 6, transferApproved: true, transferToOffice: 'London', stillActive6m: false, stillActive12m: false, stillActive24m: false },

    // ─── Northumbria University - NE local hires ───
    { id: 'h010', name: 'Candidate J', year: 2023, university: 'Northumbria University', universityId: 'northumbria', subject: 'Business & Management', homeRegion: 'North East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: false, stillActive6m: true, stillActive12m: true, stillActive24m: true },
    { id: 'h011', name: 'Candidate K', year: 2023, university: 'Northumbria University', universityId: 'northumbria', subject: 'Computing', homeRegion: 'North East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: false, stillActive6m: true, stillActive12m: true, stillActive24m: true },
    { id: 'h012', name: 'Candidate L', year: 2023, university: 'Northumbria University', universityId: 'northumbria', subject: 'Business & Management', homeRegion: 'North East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: true, transferRequestMonths: 14, stillActive6m: true, stillActive12m: true, stillActive24m: false },
    { id: 'h013', name: 'Candidate M', year: 2024, university: 'Northumbria University', universityId: 'northumbria', subject: 'Computing', homeRegion: 'North East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: false, stillActive6m: true, stillActive12m: true, stillActive24m: true },
    { id: 'h014', name: 'Candidate N', year: 2024, university: 'Northumbria University', universityId: 'northumbria', subject: 'Business & Management', homeRegion: 'North East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: false, stillActive6m: true, stillActive12m: true, stillActive24m: true },
    { id: 'h015', name: 'Candidate O', year: 2024, university: 'Northumbria University', universityId: 'northumbria', subject: 'Engineering & Technology', homeRegion: 'North East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: false, stillActive6m: true, stillActive12m: true, stillActive24m: true },
    { id: 'h016', name: 'Candidate P', year: 2024, university: 'Northumbria University', universityId: 'northumbria', subject: 'Business & Management', homeRegion: 'North East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: false, stillActive6m: true, stillActive12m: true, stillActive24m: true },

    // ─── Northumbria University - Non-local hires (higher London leakage) ───
    { id: 'h017', name: 'Candidate Q', year: 2023, university: 'Northumbria University', universityId: 'northumbria', subject: 'Business & Management', homeRegion: 'London', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: true, transferRequestMonths: 7, transferApproved: true, transferToOffice: 'London', stillActive6m: true, stillActive12m: false, stillActive24m: false },
    { id: 'h018', name: 'Candidate R', year: 2024, university: 'Northumbria University', universityId: 'northumbria', subject: 'Computing', homeRegion: 'South East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: true, transferRequestMonths: 9, transferApproved: true, transferToOffice: 'London', stillActive6m: true, stillActive12m: false, stillActive24m: false },
    { id: 'h019', name: 'Candidate S', year: 2024, university: 'Northumbria University', universityId: 'northumbria', subject: 'Business & Management', homeRegion: 'London', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: true, transferRequestMonths: 11, transferApproved: false, stillActive6m: true, stillActive12m: true, stillActive24m: false },

    // ─── Durham University ───
    { id: 'h020', name: 'Candidate T', year: 2023, university: 'Durham University', universityId: 'durham', subject: 'Mathematical Sciences', homeRegion: 'North East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: false, stillActive6m: true, stillActive12m: true, stillActive24m: true },
    { id: 'h021', name: 'Candidate U', year: 2023, university: 'Durham University', universityId: 'durham', subject: 'Computing', homeRegion: 'North East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: false, stillActive6m: true, stillActive12m: true, stillActive24m: true },
    { id: 'h022', name: 'Candidate V', year: 2024, university: 'Durham University', universityId: 'durham', subject: 'Business & Management', homeRegion: 'Yorkshire', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: false, stillActive6m: true, stillActive12m: true, stillActive24m: true },
    { id: 'h023', name: 'Candidate W', year: 2024, university: 'Durham University', universityId: 'durham', subject: 'Mathematical Sciences', homeRegion: 'North East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: false, stillActive6m: true, stillActive12m: true, stillActive24m: true },
    { id: 'h024', name: 'Candidate X', year: 2024, university: 'Durham University', universityId: 'durham', subject: 'Business & Management', homeRegion: 'London', officeApplied: 'London', officeJoined: 'London', transferRequest: false, stillActive6m: true, stillActive12m: true, stillActive24m: false },

    // ─── Teesside University ───
    { id: 'h025', name: 'Candidate Y', year: 2023, university: 'Teesside University', universityId: 'teesside', subject: 'Computing', homeRegion: 'North East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: false, stillActive6m: true, stillActive12m: true, stillActive24m: true },
    { id: 'h026', name: 'Candidate Z', year: 2023, university: 'Teesside University', universityId: 'teesside', subject: 'Engineering & Technology', homeRegion: 'North East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: false, stillActive6m: true, stillActive12m: false, stillActive24m: false },
    { id: 'h027', name: 'Candidate AA', year: 2024, university: 'Teesside University', universityId: 'teesside', subject: 'Computing', homeRegion: 'North East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: false, stillActive6m: true, stillActive12m: true, stillActive24m: true },
    { id: 'h028', name: 'Candidate AB', year: 2024, university: 'Teesside University', universityId: 'teesside', subject: 'Business & Management', homeRegion: 'Yorkshire', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: false, stillActive6m: true, stillActive12m: true, stillActive24m: false },

    // ─── University of Sunderland ───
    { id: 'h029', name: 'Candidate AC', year: 2023, university: 'University of Sunderland', universityId: 'sunderland', subject: 'Business & Management', homeRegion: 'North East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: false, stillActive6m: true, stillActive12m: true, stillActive24m: true },
    { id: 'h030', name: 'Candidate AD', year: 2024, university: 'University of Sunderland', universityId: 'sunderland', subject: 'Computing', homeRegion: 'North East', officeApplied: 'Newcastle', officeJoined: 'Newcastle', transferRequest: false, stillActive6m: true, stillActive12m: true, stillActive24m: true },
];

export const HIRES: Hire[] = hireBase.map((h) => ({ ...h, localRetentionIndex: calcLRI(h) }));
