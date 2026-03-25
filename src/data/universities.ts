// ============================================================
// MOCK DATA: Universities
// Replace with API call or CSV import as needed.
// Structure: university metadata + per-year subject volumes
// ============================================================

export interface SubjectVolume {
    subject: string;
    students: number;
    graduatesEmployedPct: number;
}

export interface UniversityYear {
    year: number;
    totalStudents: number;
    progressionRate: number; // % going on to graduate employment or further study
    employabilityScore: number; // 0-100
    graduatesToAccenture: number;
    subjectVolumes: SubjectVolume[];
}

export interface University {
    id: string;
    name: string;
    shortName: string;
    location: string;
    region: string;
    rankingUK: number;
    data: UniversityYear[];
}

export const UNIVERSITIES: University[] = [
    {
        id: 'newcastle',
        name: 'Newcastle University',
        shortName: 'Newcastle',
        location: 'Newcastle upon Tyne',
        region: 'North East',
        rankingUK: 25,
        data: [
            {
                year: 2022,
                totalStudents: 28200,
                progressionRate: 82,
                employabilityScore: 78,
                graduatesToAccenture: 34,
                subjectVolumes: [
                    { subject: 'Business & Management', students: 3200, graduatesEmployedPct: 85 },
                    { subject: 'Computing', students: 2100, graduatesEmployedPct: 92 },
                    { subject: 'Engineering & Technology', students: 2800, graduatesEmployedPct: 89 },
                    { subject: 'Mathematical Sciences', students: 1400, graduatesEmployedPct: 88 },
                ],
            },
            {
                year: 2023,
                totalStudents: 28800,
                progressionRate: 83,
                employabilityScore: 80,
                graduatesToAccenture: 41,
                subjectVolumes: [
                    { subject: 'Business & Management', students: 3350, graduatesEmployedPct: 86 },
                    { subject: 'Computing', students: 2300, graduatesEmployedPct: 93 },
                    { subject: 'Engineering & Technology', students: 2900, graduatesEmployedPct: 90 },
                    { subject: 'Mathematical Sciences', students: 1500, graduatesEmployedPct: 89 },
                ],
            },
            {
                year: 2024,
                totalStudents: 29500,
                progressionRate: 84,
                employabilityScore: 82,
                graduatesToAccenture: 47,
                subjectVolumes: [
                    { subject: 'Business & Management', students: 3500, graduatesEmployedPct: 87 },
                    { subject: 'Computing', students: 2550, graduatesEmployedPct: 94 },
                    { subject: 'Engineering & Technology', students: 3050, graduatesEmployedPct: 91 },
                    { subject: 'Mathematical Sciences', students: 1620, graduatesEmployedPct: 90 },
                ],
            },
            {
                year: 2025,
                totalStudents: 30100,
                progressionRate: 85,
                employabilityScore: 83,
                graduatesToAccenture: 52,
                subjectVolumes: [
                    { subject: 'Business & Management', students: 3680, graduatesEmployedPct: 87 },
                    { subject: 'Computing', students: 2720, graduatesEmployedPct: 95 },
                    { subject: 'Engineering & Technology', students: 3200, graduatesEmployedPct: 92 },
                    { subject: 'Mathematical Sciences', students: 1750, graduatesEmployedPct: 91 },
                ],
            },
        ],
    },
    {
        id: 'northumbria',
        name: 'Northumbria University',
        shortName: 'Northumbria',
        location: 'Newcastle upon Tyne',
        region: 'North East',
        rankingUK: 47,
        data: [
            {
                year: 2022,
                totalStudents: 35000,
                progressionRate: 74,
                employabilityScore: 71,
                graduatesToAccenture: 62,
                subjectVolumes: [
                    { subject: 'Business & Management', students: 5400, graduatesEmployedPct: 78 },
                    { subject: 'Computing', students: 3800, graduatesEmployedPct: 84 },
                    { subject: 'Engineering & Technology', students: 2200, graduatesEmployedPct: 80 },
                    { subject: 'Mathematical Sciences', students: 900, graduatesEmployedPct: 82 },
                ],
            },
            {
                year: 2023,
                totalStudents: 36200,
                progressionRate: 75,
                employabilityScore: 72,
                graduatesToAccenture: 74,
                subjectVolumes: [
                    { subject: 'Business & Management', students: 5600, graduatesEmployedPct: 79 },
                    { subject: 'Computing', students: 4100, graduatesEmployedPct: 85 },
                    { subject: 'Engineering & Technology', students: 2350, graduatesEmployedPct: 81 },
                    { subject: 'Mathematical Sciences', students: 980, graduatesEmployedPct: 83 },
                ],
            },
            {
                year: 2024,
                totalStudents: 37100,
                progressionRate: 76,
                employabilityScore: 73,
                graduatesToAccenture: 89,
                subjectVolumes: [
                    { subject: 'Business & Management', students: 5800, graduatesEmployedPct: 80 },
                    { subject: 'Computing', students: 4400, graduatesEmployedPct: 86 },
                    { subject: 'Engineering & Technology', students: 2500, graduatesEmployedPct: 82 },
                    { subject: 'Mathematical Sciences', students: 1050, graduatesEmployedPct: 83 },
                ],
            },
            {
                year: 2025,
                totalStudents: 38000,
                progressionRate: 77,
                employabilityScore: 74,
                graduatesToAccenture: 98,
                subjectVolumes: [
                    { subject: 'Business & Management', students: 6000, graduatesEmployedPct: 81 },
                    { subject: 'Computing', students: 4650, graduatesEmployedPct: 87 },
                    { subject: 'Engineering & Technology', students: 2650, graduatesEmployedPct: 83 },
                    { subject: 'Mathematical Sciences', students: 1120, graduatesEmployedPct: 84 },
                ],
            },
        ],
    },
    {
        id: 'durham',
        name: 'Durham University',
        shortName: 'Durham',
        location: 'Durham',
        region: 'North East',
        rankingUK: 6,
        data: [
            {
                year: 2022,
                totalStudents: 20500,
                progressionRate: 90,
                employabilityScore: 88,
                graduatesToAccenture: 28,
                subjectVolumes: [
                    { subject: 'Business & Management', students: 2100, graduatesEmployedPct: 91 },
                    { subject: 'Computing', students: 1100, graduatesEmployedPct: 95 },
                    { subject: 'Engineering & Technology', students: 1400, graduatesEmployedPct: 93 },
                    { subject: 'Mathematical Sciences', students: 1200, graduatesEmployedPct: 94 },
                ],
            },
            {
                year: 2023,
                totalStudents: 21200,
                progressionRate: 91,
                employabilityScore: 89,
                graduatesToAccenture: 33,
                subjectVolumes: [
                    { subject: 'Business & Management', students: 2250, graduatesEmployedPct: 92 },
                    { subject: 'Computing', students: 1200, graduatesEmployedPct: 96 },
                    { subject: 'Engineering & Technology', students: 1500, graduatesEmployedPct: 94 },
                    { subject: 'Mathematical Sciences', students: 1300, graduatesEmployedPct: 95 },
                ],
            },
            {
                year: 2024,
                totalStudents: 21800,
                progressionRate: 91,
                employabilityScore: 90,
                graduatesToAccenture: 38,
                subjectVolumes: [
                    { subject: 'Business & Management', students: 2400, graduatesEmployedPct: 92 },
                    { subject: 'Computing', students: 1350, graduatesEmployedPct: 96 },
                    { subject: 'Engineering & Technology', students: 1600, graduatesEmployedPct: 94 },
                    { subject: 'Mathematical Sciences', students: 1420, graduatesEmployedPct: 95 },
                ],
            },
            {
                year: 2025,
                totalStudents: 22400,
                progressionRate: 92,
                employabilityScore: 91,
                graduatesToAccenture: 44,
                subjectVolumes: [
                    { subject: 'Business & Management', students: 2550, graduatesEmployedPct: 93 },
                    { subject: 'Computing', students: 1500, graduatesEmployedPct: 97 },
                    { subject: 'Engineering & Technology', students: 1700, graduatesEmployedPct: 95 },
                    { subject: 'Mathematical Sciences', students: 1550, graduatesEmployedPct: 96 },
                ],
            },
        ],
    },
    {
        id: 'teesside',
        name: 'Teesside University',
        shortName: 'Teesside',
        location: 'Middlesbrough',
        region: 'North East',
        rankingUK: 65,
        data: [
            {
                year: 2022,
                totalStudents: 18500,
                progressionRate: 68,
                employabilityScore: 65,
                graduatesToAccenture: 22,
                subjectVolumes: [
                    { subject: 'Business & Management', students: 2800, graduatesEmployedPct: 71 },
                    { subject: 'Computing', students: 3200, graduatesEmployedPct: 78 },
                    { subject: 'Engineering & Technology', students: 2600, graduatesEmployedPct: 75 },
                    { subject: 'Mathematical Sciences', students: 600, graduatesEmployedPct: 72 },
                ],
            },
            {
                year: 2023,
                totalStudents: 19200,
                progressionRate: 69,
                employabilityScore: 66,
                graduatesToAccenture: 27,
                subjectVolumes: [
                    { subject: 'Business & Management', students: 2950, graduatesEmployedPct: 72 },
                    { subject: 'Computing', students: 3400, graduatesEmployedPct: 79 },
                    { subject: 'Engineering & Technology', students: 2700, graduatesEmployedPct: 76 },
                    { subject: 'Mathematical Sciences', students: 650, graduatesEmployedPct: 73 },
                ],
            },
            {
                year: 2024,
                totalStudents: 19800,
                progressionRate: 70,
                employabilityScore: 67,
                graduatesToAccenture: 31,
                subjectVolumes: [
                    { subject: 'Business & Management', students: 3100, graduatesEmployedPct: 73 },
                    { subject: 'Computing', students: 3650, graduatesEmployedPct: 80 },
                    { subject: 'Engineering & Technology', students: 2850, graduatesEmployedPct: 77 },
                    { subject: 'Mathematical Sciences', students: 700, graduatesEmployedPct: 74 },
                ],
            },
            {
                year: 2025,
                totalStudents: 20400,
                progressionRate: 71,
                employabilityScore: 68,
                graduatesToAccenture: 36,
                subjectVolumes: [
                    { subject: 'Business & Management', students: 3250, graduatesEmployedPct: 74 },
                    { subject: 'Computing', students: 3900, graduatesEmployedPct: 81 },
                    { subject: 'Engineering & Technology', students: 3000, graduatesEmployedPct: 78 },
                    { subject: 'Mathematical Sciences', students: 760, graduatesEmployedPct: 75 },
                ],
            },
        ],
    },
    {
        id: 'sunderland',
        name: 'University of Sunderland',
        shortName: 'Sunderland',
        location: 'Sunderland',
        region: 'North East',
        rankingUK: 90,
        data: [
            {
                year: 2022,
                totalStudents: 16000,
                progressionRate: 64,
                employabilityScore: 61,
                graduatesToAccenture: 12,
                subjectVolumes: [
                    { subject: 'Business & Management', students: 2500, graduatesEmployedPct: 68 },
                    { subject: 'Computing', students: 2100, graduatesEmployedPct: 74 },
                    { subject: 'Engineering & Technology', students: 1400, graduatesEmployedPct: 70 },
                    { subject: 'Mathematical Sciences', students: 400, graduatesEmployedPct: 69 },
                ],
            },
            {
                year: 2023,
                totalStudents: 16600,
                progressionRate: 65,
                employabilityScore: 62,
                graduatesToAccenture: 15,
                subjectVolumes: [
                    { subject: 'Business & Management', students: 2600, graduatesEmployedPct: 69 },
                    { subject: 'Computing', students: 2250, graduatesEmployedPct: 75 },
                    { subject: 'Engineering & Technology', students: 1500, graduatesEmployedPct: 71 },
                    { subject: 'Mathematical Sciences', students: 440, graduatesEmployedPct: 70 },
                ],
            },
            {
                year: 2024,
                totalStudents: 17100,
                progressionRate: 66,
                employabilityScore: 63,
                graduatesToAccenture: 19,
                subjectVolumes: [
                    { subject: 'Business & Management', students: 2700, graduatesEmployedPct: 70 },
                    { subject: 'Computing', students: 2400, graduatesEmployedPct: 76 },
                    { subject: 'Engineering & Technology', students: 1600, graduatesEmployedPct: 72 },
                    { subject: 'Mathematical Sciences', students: 480, graduatesEmployedPct: 71 },
                ],
            },
            {
                year: 2025,
                totalStudents: 17700,
                progressionRate: 67,
                employabilityScore: 64,
                graduatesToAccenture: 23,
                subjectVolumes: [
                    { subject: 'Business & Management', students: 2820, graduatesEmployedPct: 71 },
                    { subject: 'Computing', students: 2550, graduatesEmployedPct: 77 },
                    { subject: 'Engineering & Technology', students: 1700, graduatesEmployedPct: 73 },
                    { subject: 'Mathematical Sciences', students: 520, graduatesEmployedPct: 72 },
                ],
            },
        ],
    },
];

export const UNIVERSITY_NAMES = UNIVERSITIES.map((u) => u.name);
export const UNIVERSITY_IDS = UNIVERSITIES.map((u) => u.id);
export const YEARS = [2022, 2023, 2024, 2025];
export const SUBJECTS = [
    'Business & Management',
    'Computing',
    'Engineering & Technology',
    'Mathematical Sciences',
];
