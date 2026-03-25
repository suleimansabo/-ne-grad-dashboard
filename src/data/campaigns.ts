// ============================================================
// MOCK DATA: Campaigns
// Replace with API call or CSV import as needed.
// ============================================================

export type CampaignType = 'University Partnership' | 'Campus Event' | 'Digital / Social' | 'Careers Fair' | 'Hackathon';

export interface Campaign {
    id: string;
    name: string;
    type: CampaignType;
    year: number;
    university: string | 'Multi-University';
    universityId: string | 'multi';
    estimatedCost: number; // £
    applicationsGenerated: number;
    interviewConversionPct: number; // % of applications reaching interview
    offerConversionPct: number; // % of interviews resulting in offer
    acceptanceRatePct: number; // % of offers accepted
    joinedHires: number;
    retention12mPct: number; // % still active at 12m
    retainedHires: number; // joinedHires * retention12mPct/100
    costPerHire: number; // estimatedCost / joinedHires
    costPerRetainedHire: number; // estimatedCost / retainedHires
}

export const CAMPAIGNS: Campaign[] = [
    {
        id: 'cam-001',
        name: 'Newcastle University Partnership 2024',
        type: 'University Partnership',
        year: 2024,
        university: 'Newcastle University',
        universityId: 'newcastle',
        estimatedCost: 28000,
        applicationsGenerated: 312,
        interviewConversionPct: 42,
        offerConversionPct: 58,
        acceptanceRatePct: 76,
        joinedHires: 47,
        retention12mPct: 87,
        retainedHires: 41,
        costPerHire: 596,
        costPerRetainedHire: 683,
    },
    {
        id: 'cam-002',
        name: 'Northumbria Tech Hackathon 2024',
        type: 'Hackathon',
        year: 2024,
        university: 'Northumbria University',
        universityId: 'northumbria',
        estimatedCost: 18000,
        applicationsGenerated: 210,
        interviewConversionPct: 55,
        offerConversionPct: 62,
        acceptanceRatePct: 68,
        joinedHires: 48,
        retention12mPct: 81,
        retainedHires: 39,
        costPerHire: 375,
        costPerRetainedHire: 462,
    },
    {
        id: 'cam-003',
        name: 'Durham Consulting Week 2024',
        type: 'Campus Event',
        year: 2024,
        university: 'Durham University',
        universityId: 'durham',
        estimatedCost: 22000,
        applicationsGenerated: 188,
        interviewConversionPct: 48,
        offerConversionPct: 60,
        acceptanceRatePct: 82,
        joinedHires: 44,
        retention12mPct: 88,
        retainedHires: 39,
        costPerHire: 500,
        costPerRetainedHire: 564,
    },
    {
        id: 'cam-004',
        name: 'NE Digital Talent Campaign 2024',
        type: 'Digital / Social',
        year: 2024,
        university: 'Multi-University',
        universityId: 'multi',
        estimatedCost: 12000,
        applicationsGenerated: 380,
        interviewConversionPct: 30,
        offerConversionPct: 48,
        acceptanceRatePct: 62,
        joinedHires: 34,
        retention12mPct: 74,
        retainedHires: 25,
        costPerHire: 353,
        costPerRetainedHire: 480,
    },
    {
        id: 'cam-005',
        name: 'Teesside Engineering Roadshow 2024',
        type: 'Careers Fair',
        year: 2024,
        university: 'Teesside University',
        universityId: 'teesside',
        estimatedCost: 9500,
        applicationsGenerated: 145,
        interviewConversionPct: 38,
        offerConversionPct: 52,
        acceptanceRatePct: 64,
        joinedHires: 18,
        retention12mPct: 78,
        retainedHires: 14,
        costPerHire: 528,
        costPerRetainedHire: 679,
    },
    {
        id: 'cam-006',
        name: 'Sunderland Diversity in Tech 2024',
        type: 'Campus Event',
        year: 2024,
        university: 'University of Sunderland',
        universityId: 'sunderland',
        estimatedCost: 7000,
        applicationsGenerated: 98,
        interviewConversionPct: 35,
        offerConversionPct: 50,
        acceptanceRatePct: 60,
        joinedHires: 10,
        retention12mPct: 80,
        retainedHires: 8,
        costPerHire: 700,
        costPerRetainedHire: 875,
    },
    {
        id: 'cam-007',
        name: 'Northumbria University Partnership 2024',
        type: 'University Partnership',
        year: 2024,
        university: 'Northumbria University',
        universityId: 'northumbria',
        estimatedCost: 32000,
        applicationsGenerated: 440,
        interviewConversionPct: 48,
        offerConversionPct: 55,
        acceptanceRatePct: 65,
        joinedHires: 96,
        retention12mPct: 80,
        retainedHires: 77,
        costPerHire: 333,
        costPerRetainedHire: 416,
    },
    // 2023 campaigns for trend comparison
    {
        id: 'cam-008',
        name: 'Newcastle University Partnership 2023',
        type: 'University Partnership',
        year: 2023,
        university: 'Newcastle University',
        universityId: 'newcastle',
        estimatedCost: 24000,
        applicationsGenerated: 268,
        interviewConversionPct: 40,
        offerConversionPct: 55,
        acceptanceRatePct: 73,
        joinedHires: 38,
        retention12mPct: 85,
        retainedHires: 32,
        costPerHire: 632,
        costPerRetainedHire: 750,
    },
    {
        id: 'cam-009',
        name: 'Northumbria University Partnership 2023',
        type: 'University Partnership',
        year: 2023,
        university: 'Northumbria University',
        universityId: 'northumbria',
        estimatedCost: 28000,
        applicationsGenerated: 390,
        interviewConversionPct: 45,
        offerConversionPct: 53,
        acceptanceRatePct: 63,
        joinedHires: 78,
        retention12mPct: 79,
        retainedHires: 62,
        costPerHire: 359,
        costPerRetainedHire: 452,
    },
];
