// ============================================================
// MOCK DATA: Event Effectiveness
// Powers the Campaign Diagnostics tools (Heatmap, Funnel, CIs)
// ============================================================

export interface FunnelDiagnostics {
    totalAttend: number;
    totalApply: number;
    totalInterview: number;
    totalOffer: number;
    totalAccept: number;
}

export const FUNNEL_OVERALL: FunnelDiagnostics = {
    totalAttend: 2184,
    totalApply: 404,
    totalInterview: 205,
    totalOffer: 107,
    totalAccept: 81,
};

export interface HeatmapCell {
    uniCode: string; // NCL, DUR, NTH, SUN, TEE
    eventType: string; // Career Fair, Workshop, Hackathon, Case Study Evening, Guest Lecture, Panel Discussion
    appliedRate: number | null; // e.g. 16.5
    n: number | null; // e.g. 635
}

export const HEATMAP_DATA: HeatmapCell[] = [
    // NCL
    { uniCode: 'NCL', eventType: 'Career Fair', appliedRate: 16.5, n: 635 },
    { uniCode: 'NCL', eventType: 'Workshop', appliedRate: 38.0, n: 142 },
    { uniCode: 'NCL', eventType: 'Hackathon', appliedRate: 47.2, n: 72 },
    { uniCode: 'NCL', eventType: 'Case Study Evening', appliedRate: null, n: null },
    { uniCode: 'NCL', eventType: 'Guest Lecture', appliedRate: null, n: null },
    { uniCode: 'NCL', eventType: 'Panel Discussion', appliedRate: null, n: null },
    // DUR
    { uniCode: 'DUR', eventType: 'Career Fair', appliedRate: 14.3, n: 335 },
    { uniCode: 'DUR', eventType: 'Workshop', appliedRate: null, n: null },
    { uniCode: 'DUR', eventType: 'Hackathon', appliedRate: null, n: null },
    { uniCode: 'DUR', eventType: 'Case Study Evening', appliedRate: 41.7, n: 115 },
    { uniCode: 'DUR', eventType: 'Guest Lecture', appliedRate: null, n: null },
    { uniCode: 'DUR', eventType: 'Panel Discussion', appliedRate: 14.3, n: 70 },
    // NTH
    { uniCode: 'NTH', eventType: 'Career Fair', appliedRate: 10.3, n: 145 },
    { uniCode: 'NTH', eventType: 'Workshop', appliedRate: 30.5, n: 82 },
    { uniCode: 'NTH', eventType: 'Hackathon', appliedRate: 42.9, n: 28 },
    { uniCode: 'NTH', eventType: 'Case Study Evening', appliedRate: null, n: null },
    { uniCode: 'NTH', eventType: 'Guest Lecture', appliedRate: 8.0, n: 75 },
    { uniCode: 'NTH', eventType: 'Panel Discussion', appliedRate: null, n: null },
    // SUN
    { uniCode: 'SUN', eventType: 'Career Fair', appliedRate: 7.3, n: 110 },
    { uniCode: 'SUN', eventType: 'Workshop', appliedRate: 23.3, n: 30 },
    { uniCode: 'SUN', eventType: 'Hackathon', appliedRate: null, n: null },
    { uniCode: 'SUN', eventType: 'Case Study Evening', appliedRate: null, n: null },
    { uniCode: 'SUN', eventType: 'Guest Lecture', appliedRate: 7.5, n: 80 },
    { uniCode: 'SUN', eventType: 'Panel Discussion', appliedRate: 7.7, n: 65 },
    // TEE
    { uniCode: 'TEE', eventType: 'Career Fair', appliedRate: 7.8, n: 90 },
    { uniCode: 'TEE', eventType: 'Workshop', appliedRate: 20.0, n: 55 },
    { uniCode: 'TEE', eventType: 'Hackathon', appliedRate: null, n: null },
    { uniCode: 'TEE', eventType: 'Case Study Evening', appliedRate: null, n: null },
    { uniCode: 'TEE', eventType: 'Guest Lecture', appliedRate: 5.5, n: 55 },
    { uniCode: 'TEE', eventType: 'Panel Discussion', appliedRate: null, n: null },
];

export interface WilsonCIData {
    name: string;
    rate: number;
    lowerCI: number;
    upperCI: number;
    eventsCount: number;
    costPerConv: number;
}

export const EVENT_TYPE_CI: WilsonCIData[] = [
    { name: 'Hackathon', rate: 46.0, lowerCI: 35.0, upperCI: 57.0, eventsCount: 3, costPerConv: 272 },
    { name: 'Case Study Evening', rate: 41.7, lowerCI: 28.0, upperCI: 55.0, eventsCount: 2, costPerConv: 56 },
    { name: 'Workshop', rate: 31.4, lowerCI: 24.0, upperCI: 38.0, eventsCount: 8, costPerConv: 69 },
    { name: 'Career Fair', rate: 13.9, lowerCI: 11.0, upperCI: 16.0, eventsCount: 8, costPerConv: 124 },
    { name: 'Panel Discussion', rate: 11.1, lowerCI: 5.0, upperCI: 20.0, eventsCount: 2, costPerConv: 87 },
    { name: 'Guest Lecture', rate: 7.1, lowerCI: 4.0, upperCI: 12.0, eventsCount: 3, costPerConv: 93 },
];

export const UNI_CI: WilsonCIData[] = [
    { name: 'Newcastle University', rate: 22.7, lowerCI: 20.0, upperCI: 25.5, eventsCount: 8, costPerConv: 114 },
    { name: 'Durham University', rate: 20.4, lowerCI: 16.0, upperCI: 24.0, eventsCount: 5, costPerConv: 87 },
    { name: 'Northumbria University', rate: 17.6, lowerCI: 13.0, upperCI: 22.0, eventsCount: 5, costPerConv: 149 },
    { name: 'Teesside University', rate: 10.5, lowerCI: 8.0, upperCI: 14.0, eventsCount: 4, costPerConv: 169 },
    { name: 'University of Sunderland', rate: 9.1, lowerCI: 6.0, upperCI: 13.0, eventsCount: 4, costPerConv: 146 },
];

export interface UniContact {
    university: string;
    name: string;
    role: string;
    email: string;
    phone: string;
}

export const CONTACTS: UniContact[] = [
    {
        university: 'Newcastle University',
        name: 'Jane Doe',
        role: 'Head of Employer Engagement',
        email: 'jane.doe@newcastle.ac.uk',
        phone: '+44 191 208 6000'
    },
    {
        university: 'Durham University',
        name: 'Robert Smith',
        role: 'Careers & Enterprise Manager',
        email: 'employer.services@durham.ac.uk',
        phone: '+44 191 334 1431'
    },
    {
        university: 'Northumbria University',
        name: 'Sarah Williams',
        role: 'Graduate Futures Lead',
        email: 's.williams@northumbria.ac.uk',
        phone: '+44 191 227 4000'
    },
    {
        university: 'Teesside University',
        name: 'David Taylor',
        role: 'Student Futures Connect',
        email: 'studentfutures@tees.ac.uk',
        phone: '+44 1642 342266'
    },
    {
        university: 'University of Sunderland',
        name: 'Amanda Bell',
        role: 'Enterprise and Innovation',
        email: 'a.bell@sunderland.ac.uk',
        phone: '+44 191 515 2000'
    }
];

export interface UpcomingEvent {
    id: string;
    name: string;
    location: string;
    date: string;
    time: string;
}

export const UPCOMING_EVENTS: UpcomingEvent[] = [
    {
        id: 'ue-1',
        name: 'Accenture Hackathon',
        location: 'Newcastle University',
        date: 'Oct 15, 2026',
        time: '09:00 AM'
    },
    {
        id: 'ue-2',
        name: 'Autumn Careers Fair',
        location: 'Newcastle University',
        date: 'Oct 18, 2026',
        time: '10:00 AM'
    },
    {
        id: 'ue-3',
        name: 'Tech Careers Talk',
        location: 'Durham Teaching and Learning Centre',
        date: 'Oct 22, 2026',
        time: '02:00 PM'
    },
    {
        id: 'ue-4',
        name: 'Durhack 2026',
        location: 'Durham University',
        date: 'Nov 05, 2026',
        time: '08:00 AM'
    }
];

export interface FunnelShape {
    name: string;
    'Attend→Apply': number;
    'Apply→Interview': number;
    'Interview→Offer': number;
    'Offer→Accept': number;
}

export const EVENT_FUNNEL_SHAPES: FunnelShape[] = [
    { name: 'Career Fair', 'Attend→Apply': 15, 'Apply→Interview': 40, 'Interview→Offer': 50, 'Offer→Accept': 70 },
    { name: 'Workshop', 'Attend→Apply': 30, 'Apply→Interview': 55, 'Interview→Offer': 50, 'Offer→Accept': 78 },
    { name: 'Guest Lecture', 'Attend→Apply': 8, 'Apply→Interview': 32, 'Interview→Offer': 40, 'Offer→Accept': 100 },
    { name: 'Hackathon', 'Attend→Apply': 45, 'Apply→Interview': 65, 'Interview→Offer': 50, 'Offer→Accept': 80 },
    { name: 'Case Study Evening', 'Attend→Apply': 42, 'Apply→Interview': 68, 'Interview→Offer': 60, 'Offer→Accept': 80 },
    { name: 'Panel Discussion', 'Attend→Apply': 10, 'Apply→Interview': 48, 'Interview→Offer': 58, 'Offer→Accept': 50 },
];
