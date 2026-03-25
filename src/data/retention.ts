// ============================================================
// MOCK DATA: Retention cohort summaries
// Replace with API call or CSV import as needed.
// ============================================================

export interface RetentionCohort {
    year: number;
    university: string;
    universityId: string;
    totalHires: number;
    localOriginHires: number; // home region = North East
    nonLocalOriginHires: number;
    // Retention rates (%) across the full cohort
    retention6m: number;
    retention12m: number;
    retention24m: number;
    // Retention rates by origin
    localRetention12m: number;
    nonLocalRetention12m: number;
    avgLocalRetentionIndex: number; // 0-100
}

export const RETENTION_DATA: RetentionCohort[] = [
    // Newcastle University
    { year: 2022, university: 'Newcastle University', universityId: 'newcastle', totalHires: 38, localOriginHires: 28, nonLocalOriginHires: 10, retention6m: 94, retention12m: 87, retention24m: 76, localRetention12m: 93, nonLocalRetention12m: 65, avgLocalRetentionIndex: 82 },
    { year: 2023, university: 'Newcastle University', universityId: 'newcastle', totalHires: 44, localOriginHires: 31, nonLocalOriginHires: 13, retention6m: 93, retention12m: 85, retention24m: 74, localRetention12m: 94, nonLocalRetention12m: 60, avgLocalRetentionIndex: 80 },
    { year: 2024, university: 'Newcastle University', universityId: 'newcastle', totalHires: 52, localOriginHires: 36, nonLocalOriginHires: 16, retention6m: 94, retention12m: 87, retention24m: 75, localRetention12m: 95, nonLocalRetention12m: 63, avgLocalRetentionIndex: 83 },

    // Northumbria University
    { year: 2022, university: 'Northumbria University', universityId: 'northumbria', totalHires: 68, localOriginHires: 44, nonLocalOriginHires: 24, retention6m: 91, retention12m: 80, retention24m: 66, localRetention12m: 90, nonLocalRetention12m: 55, avgLocalRetentionIndex: 71 },
    { year: 2023, university: 'Northumbria University', universityId: 'northumbria', totalHires: 77, localOriginHires: 49, nonLocalOriginHires: 28, retention6m: 90, retention12m: 79, retention24m: 65, localRetention12m: 89, nonLocalRetention12m: 54, avgLocalRetentionIndex: 70 },
    { year: 2024, university: 'Northumbria University', universityId: 'northumbria', totalHires: 91, localOriginHires: 58, nonLocalOriginHires: 33, retention6m: 91, retention12m: 80, retention24m: 67, localRetention12m: 91, nonLocalRetention12m: 56, avgLocalRetentionIndex: 72 },

    // Durham University
    { year: 2022, university: 'Durham University', universityId: 'durham', totalHires: 30, localOriginHires: 14, nonLocalOriginHires: 16, retention6m: 95, retention12m: 88, retention24m: 72, localRetention12m: 97, nonLocalRetention12m: 68, avgLocalRetentionIndex: 74 },
    { year: 2023, university: 'Durham University', universityId: 'durham', totalHires: 35, localOriginHires: 16, nonLocalOriginHires: 19, retention6m: 94, retention12m: 87, retention24m: 70, localRetention12m: 96, nonLocalRetention12m: 66, avgLocalRetentionIndex: 72 },
    { year: 2024, university: 'Durham University', universityId: 'durham', totalHires: 41, localOriginHires: 18, nonLocalOriginHires: 23, retention6m: 95, retention12m: 88, retention24m: 71, localRetention12m: 97, nonLocalRetention12m: 67, avgLocalRetentionIndex: 73 },

    // Teesside University
    { year: 2022, university: 'Teesside University', universityId: 'teesside', totalHires: 28, localOriginHires: 22, nonLocalOriginHires: 6, retention6m: 88, retention12m: 76, retention24m: 60, localRetention12m: 80, nonLocalRetention12m: 50, avgLocalRetentionIndex: 66 },
    { year: 2023, university: 'Teesside University', universityId: 'teesside', totalHires: 31, localOriginHires: 25, nonLocalOriginHires: 6, retention6m: 89, retention12m: 77, retention24m: 62, localRetention12m: 81, nonLocalRetention12m: 52, avgLocalRetentionIndex: 68 },
    { year: 2024, university: 'Teesside University', universityId: 'teesside', totalHires: 36, localOriginHires: 29, nonLocalOriginHires: 7, retention6m: 90, retention12m: 79, retention24m: 64, localRetention12m: 83, nonLocalRetention12m: 54, avgLocalRetentionIndex: 70 },

    // University of Sunderland
    { year: 2022, university: 'University of Sunderland', universityId: 'sunderland', totalHires: 14, localOriginHires: 12, nonLocalOriginHires: 2, retention6m: 86, retention12m: 78, retention24m: 63, localRetention12m: 80, nonLocalRetention12m: 50, avgLocalRetentionIndex: 67 },
    { year: 2023, university: 'University of Sunderland', universityId: 'sunderland', totalHires: 17, localOriginHires: 14, nonLocalOriginHires: 3, retention6m: 87, retention12m: 79, retention24m: 65, localRetention12m: 82, nonLocalRetention12m: 52, avgLocalRetentionIndex: 68 },
    { year: 2024, university: 'University of Sunderland', universityId: 'sunderland', totalHires: 20, localOriginHires: 16, nonLocalOriginHires: 4, retention6m: 88, retention12m: 80, retention24m: 66, localRetention12m: 83, nonLocalRetention12m: 54, avgLocalRetentionIndex: 69 },
];
