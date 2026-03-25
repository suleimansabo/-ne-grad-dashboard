// ============================================================
// MOCK DATA: Recruitment Funnel
// Replace with API call or CSV import as needed.
// Each record represents one cohort (year + university + subject + filters)
// ============================================================

export interface FunnelRecord {
    id: string;
    year: number;
    university: string;
    universityId: string;
    subject: string;
    candidateRegion: 'North East' | 'Yorkshire' | 'London' | 'South East' | 'Midlands' | 'Scotland' | 'Other';
    officePreference: 'Newcastle' | 'London' | 'No Preference';
    campaignReach: number;
    eventRegistrations: number;
    eventAttendance: number;
    applicationStarts: number;
    completedApplications: number;
    interviews: number;
    offers: number;
    acceptedOffers: number;
    joinedHires: number;
}

export const FUNNEL_DATA: FunnelRecord[] = [
    // ── Newcastle University 2024 ──
    { id: 'ncl-biz-2024-ne', year: 2024, university: 'Newcastle University', universityId: 'newcastle', subject: 'Business & Management', candidateRegion: 'North East', officePreference: 'Newcastle', campaignReach: 1200, eventRegistrations: 480, eventAttendance: 340, applicationStarts: 210, completedApplications: 165, interviews: 88, offers: 42, acceptedOffers: 32, joinedHires: 28 },
    { id: 'ncl-biz-2024-lon', year: 2024, university: 'Newcastle University', universityId: 'newcastle', subject: 'Business & Management', candidateRegion: 'London', officePreference: 'London', campaignReach: 300, eventRegistrations: 90, eventAttendance: 60, applicationStarts: 45, completedApplications: 38, interviews: 22, offers: 12, acceptedOffers: 10, joinedHires: 9 },
    { id: 'ncl-comp-2024-ne', year: 2024, university: 'Newcastle University', universityId: 'newcastle', subject: 'Computing', candidateRegion: 'North East', officePreference: 'Newcastle', campaignReach: 900, eventRegistrations: 380, eventAttendance: 280, applicationStarts: 180, completedApplications: 145, interviews: 82, offers: 40, acceptedOffers: 31, joinedHires: 27 },
    { id: 'ncl-comp-2024-se', year: 2024, university: 'Newcastle University', universityId: 'newcastle', subject: 'Computing', candidateRegion: 'South East', officePreference: 'No Preference', campaignReach: 200, eventRegistrations: 60, eventAttendance: 42, applicationStarts: 30, completedApplications: 24, interviews: 14, offers: 7, acceptedOffers: 5, joinedHires: 4 },
    { id: 'ncl-eng-2024-ne', year: 2024, university: 'Newcastle University', universityId: 'newcastle', subject: 'Engineering & Technology', candidateRegion: 'North East', officePreference: 'Newcastle', campaignReach: 800, eventRegistrations: 320, eventAttendance: 230, applicationStarts: 150, completedApplications: 118, interviews: 65, offers: 30, acceptedOffers: 23, joinedHires: 20 },
    { id: 'ncl-math-2024-ne', year: 2024, university: 'Newcastle University', universityId: 'newcastle', subject: 'Mathematical Sciences', candidateRegion: 'North East', officePreference: 'Newcastle', campaignReach: 500, eventRegistrations: 200, eventAttendance: 140, applicationStarts: 90, completedApplications: 70, interviews: 38, offers: 18, acceptedOffers: 14, joinedHires: 12 },

    // ── Newcastle University 2023 ──
    { id: 'ncl-biz-2023-ne', year: 2023, university: 'Newcastle University', universityId: 'newcastle', subject: 'Business & Management', candidateRegion: 'North East', officePreference: 'Newcastle', campaignReach: 1100, eventRegistrations: 430, eventAttendance: 300, applicationStarts: 190, completedApplications: 148, interviews: 78, offers: 36, acceptedOffers: 27, joinedHires: 23 },
    { id: 'ncl-comp-2023-ne', year: 2023, university: 'Newcastle University', universityId: 'newcastle', subject: 'Computing', candidateRegion: 'North East', officePreference: 'Newcastle', campaignReach: 820, eventRegistrations: 340, eventAttendance: 250, applicationStarts: 160, completedApplications: 128, interviews: 72, offers: 34, acceptedOffers: 26, joinedHires: 22 },
    { id: 'ncl-eng-2023-ne', year: 2023, university: 'Newcastle University', universityId: 'newcastle', subject: 'Engineering & Technology', candidateRegion: 'North East', officePreference: 'Newcastle', campaignReach: 720, eventRegistrations: 290, eventAttendance: 200, applicationStarts: 130, completedApplications: 102, interviews: 56, offers: 26, acceptedOffers: 20, joinedHires: 17 },

    // ── Northumbria University 2024 ──
    { id: 'num-biz-2024-ne', year: 2024, university: 'Northumbria University', universityId: 'northumbria', subject: 'Business & Management', candidateRegion: 'North East', officePreference: 'Newcastle', campaignReach: 1800, eventRegistrations: 720, eventAttendance: 540, applicationStarts: 360, completedApplications: 288, interviews: 154, offers: 72, acceptedOffers: 52, joinedHires: 44 },
    { id: 'num-biz-2024-lon', year: 2024, university: 'Northumbria University', universityId: 'northumbria', subject: 'Business & Management', candidateRegion: 'London', officePreference: 'London', campaignReach: 450, eventRegistrations: 140, eventAttendance: 98, applicationStarts: 72, completedApplications: 60, interviews: 36, offers: 18, acceptedOffers: 11, joinedHires: 9 },
    { id: 'num-comp-2024-ne', year: 2024, university: 'Northumbria University', universityId: 'northumbria', subject: 'Computing', candidateRegion: 'North East', officePreference: 'Newcastle', campaignReach: 1400, eventRegistrations: 560, eventAttendance: 420, applicationStarts: 280, completedApplications: 228, interviews: 122, offers: 58, acceptedOffers: 44, joinedHires: 38 },
    { id: 'num-eng-2024-ne', year: 2024, university: 'Northumbria University', universityId: 'northumbria', subject: 'Engineering & Technology', candidateRegion: 'North East', officePreference: 'Newcastle', campaignReach: 900, eventRegistrations: 360, eventAttendance: 270, applicationStarts: 180, completedApplications: 144, interviews: 78, offers: 36, acceptedOffers: 26, joinedHires: 22 },
    { id: 'num-math-2024-ne', year: 2024, university: 'Northumbria University', universityId: 'northumbria', subject: 'Mathematical Sciences', candidateRegion: 'North East', officePreference: 'Newcastle', campaignReach: 400, eventRegistrations: 160, eventAttendance: 110, applicationStarts: 72, completedApplications: 58, interviews: 30, offers: 14, acceptedOffers: 10, joinedHires: 8 },

    // ── Northumbria University 2023 ──
    { id: 'num-biz-2023-ne', year: 2023, university: 'Northumbria University', universityId: 'northumbria', subject: 'Business & Management', candidateRegion: 'North East', officePreference: 'Newcastle', campaignReach: 1600, eventRegistrations: 640, eventAttendance: 480, applicationStarts: 320, completedApplications: 260, interviews: 138, offers: 64, acceptedOffers: 46, joinedHires: 38 },
    { id: 'num-comp-2023-ne', year: 2023, university: 'Northumbria University', universityId: 'northumbria', subject: 'Computing', candidateRegion: 'North East', officePreference: 'Newcastle', campaignReach: 1200, eventRegistrations: 480, eventAttendance: 360, applicationStarts: 240, completedApplications: 196, interviews: 104, offers: 50, acceptedOffers: 37, joinedHires: 31 },

    // ── Durham University 2024 ──
    { id: 'dur-biz-2024-ne', year: 2024, university: 'Durham University', universityId: 'durham', subject: 'Business & Management', candidateRegion: 'North East', officePreference: 'Newcastle', campaignReach: 600, eventRegistrations: 240, eventAttendance: 180, applicationStarts: 110, completedApplications: 88, interviews: 50, offers: 26, acceptedOffers: 20, joinedHires: 18 },
    { id: 'dur-biz-2024-lon', year: 2024, university: 'Durham University', universityId: 'durham', subject: 'Business & Management', candidateRegion: 'London', officePreference: 'London', campaignReach: 500, eventRegistrations: 180, eventAttendance: 130, applicationStarts: 90, completedApplications: 74, interviews: 44, offers: 22, acceptedOffers: 18, joinedHires: 15 },
    { id: 'dur-comp-2024-ne', year: 2024, university: 'Durham University', universityId: 'durham', subject: 'Computing', candidateRegion: 'North East', officePreference: 'Newcastle', campaignReach: 400, eventRegistrations: 160, eventAttendance: 120, applicationStarts: 78, completedApplications: 62, interviews: 36, offers: 18, acceptedOffers: 14, joinedHires: 12 },
    { id: 'dur-math-2024-ne', year: 2024, university: 'Durham University', universityId: 'durham', subject: 'Mathematical Sciences', candidateRegion: 'North East', officePreference: 'Newcastle', campaignReach: 350, eventRegistrations: 140, eventAttendance: 100, applicationStarts: 64, completedApplications: 52, interviews: 30, offers: 16, acceptedOffers: 12, joinedHires: 11 },

    // ── Teesside University 2024 ──
    { id: 'tees-biz-2024-ne', year: 2024, university: 'Teesside University', universityId: 'teesside', subject: 'Business & Management', candidateRegion: 'North East', officePreference: 'Newcastle', campaignReach: 700, eventRegistrations: 280, eventAttendance: 200, applicationStarts: 130, completedApplications: 102, interviews: 54, offers: 24, acceptedOffers: 17, joinedHires: 14 },
    { id: 'tees-comp-2024-ne', year: 2024, university: 'Teesside University', universityId: 'teesside', subject: 'Computing', candidateRegion: 'North East', officePreference: 'Newcastle', campaignReach: 800, eventRegistrations: 320, eventAttendance: 230, applicationStarts: 150, completedApplications: 120, interviews: 64, offers: 28, acceptedOffers: 19, joinedHires: 16 },
    { id: 'tees-eng-2024-ne', year: 2024, university: 'Teesside University', universityId: 'teesside', subject: 'Engineering & Technology', candidateRegion: 'North East', officePreference: 'Newcastle', campaignReach: 600, eventRegistrations: 240, eventAttendance: 170, applicationStarts: 110, completedApplications: 86, interviews: 46, offers: 20, acceptedOffers: 14, joinedHires: 12 },

    // ── University of Sunderland 2024 ──
    { id: 'sund-biz-2024-ne', year: 2024, university: 'University of Sunderland', universityId: 'sunderland', subject: 'Business & Management', candidateRegion: 'North East', officePreference: 'Newcastle', campaignReach: 500, eventRegistrations: 200, eventAttendance: 140, applicationStarts: 88, completedApplications: 68, interviews: 36, offers: 16, acceptedOffers: 11, joinedHires: 9 },
    { id: 'sund-comp-2024-ne', year: 2024, university: 'University of Sunderland', universityId: 'sunderland', subject: 'Computing', candidateRegion: 'North East', officePreference: 'Newcastle', campaignReach: 400, eventRegistrations: 160, eventAttendance: 110, applicationStarts: 70, completedApplications: 54, interviews: 28, offers: 12, acceptedOffers: 8, joinedHires: 7 },
];

export const YEARS = [2023, 2024];
export const CANDIDATE_REGIONS = ['North East', 'Yorkshire', 'London', 'South East', 'Midlands', 'Scotland', 'Other'];
export const OFFICE_PREFERENCES = ['Newcastle', 'London', 'No Preference'];
