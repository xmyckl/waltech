import type {
  Assessor, Learner, CommsEntry, OTJEntry, KSBItem, ReviewEntry, Alert,
} from '@/types/assessor-track';

export const CURRENT_ASSESSOR_ID = 'a1';

export const assessors: Assessor[] = [
  { id: 'a1', name: 'Michael W.', email: 'michael.w@provider.ac.uk', region: 'South Wales' },
  { id: 'a2', name: 'Sarah Jones', email: 's.jones@provider.ac.uk', region: 'North Wales' },
  { id: 'a3', name: 'David Chen', email: 'd.chen@provider.ac.uk', region: 'South Wales' },
];

export const learners: Learner[] = [
  {
    id: 'l1', name: 'Jamie Hughes', assessorId: 'a1',
    programme: 'Software Engineering L4', employer: 'TechCorp Wales',
    startDate: '2025-01-06', epaDate: '2026-11-30', status: 'on-track',
    otjLogged: 280, otjTarget: 520, lastContact: '2026-06-10',
    nextReview: '2026-06-25', needsAttention: false,
  },
  {
    id: 'l2', name: 'Priya Patel', assessorId: 'a1',
    programme: 'Software Engineering L4', employer: 'Digital Agency Ltd',
    startDate: '2024-09-09', epaDate: '2026-08-15', status: 'at-risk',
    otjLogged: 120, otjTarget: 520, lastContact: '2026-05-20',
    nextReview: null, needsAttention: true,
  },
  {
    id: 'l3', name: 'Tom Barrett', assessorId: 'a1',
    programme: 'Business Administration L3', employer: 'Swansea Council',
    startDate: '2024-07-01', epaDate: '2026-07-01', status: 'behind',
    otjLogged: 45, otjTarget: 400, lastContact: '2026-04-10',
    nextReview: null, needsAttention: true,
  },
  {
    id: 'l4', name: 'Nia Williams', assessorId: 'a2',
    programme: 'Business Administration L3', employer: 'NHS Wales Trust',
    startDate: '2025-01-13', epaDate: '2026-12-15', status: 'on-track',
    otjLogged: 210, otjTarget: 400, lastContact: '2026-06-05',
    nextReview: '2026-07-01', needsAttention: false,
  },
  {
    id: 'l5', name: 'Owen Davies', assessorId: 'a3',
    programme: 'Software Engineering L4', employer: 'StartupCo Ltd',
    startDate: '2024-10-07', epaDate: '2026-09-10', status: 'at-risk',
    otjLogged: 195, otjTarget: 520, lastContact: '2026-06-01',
    nextReview: '2026-06-20', needsAttention: true,
  },
  {
    id: 'l6', name: 'Ceri Thomas', assessorId: 'a2',
    programme: 'Business Administration L3', employer: 'Welsh Government',
    startDate: '2025-03-03', epaDate: '2027-01-20', status: 'on-track',
    otjLogged: 150, otjTarget: 400, lastContact: '2026-06-12',
    nextReview: '2026-07-10', needsAttention: false,
  },
];

export const commsEntries: CommsEntry[] = [
  { id: 'c1', learnerId: 'l1', date: '2026-06-10', channel: 'visit', loggedBy: 'Michael W.', note: 'Progress review completed. Jamie is on track with all KSBs. Discussed upcoming OTJ activity plan.' },
  { id: 'c2', learnerId: 'l1', date: '2026-05-12', channel: 'email', loggedBy: 'Michael W.', note: 'Sent OTJ guidance and reminder about logging hours in MAYTAS. Jamie acknowledged and will update by end of week.' },
  { id: 'c3', learnerId: 'l1', date: '2026-04-08', channel: 'visit', loggedBy: 'Michael W.', note: 'Q1 progress review. Portfolio evidence looking strong for K1-K3. Set targets for S4 evidence.' },
  { id: 'c4', learnerId: 'l2', date: '2026-05-20', channel: 'call', loggedBy: 'Michael W.', note: 'Called Priya to discuss low OTJ hours. She is struggling to get employer support for off-the-job activities. Agreed to contact line manager.' },
  { id: 'c5', learnerId: 'l2', date: '2026-04-15', channel: 'email', loggedBy: 'Michael W.', note: 'Sent employer engagement letter template. Priya to discuss OTJ commitments with manager before next visit.' },
  { id: 'c6', learnerId: 'l2', date: '2026-03-10', channel: 'visit', loggedBy: 'Michael W.', note: 'Progress review. OTJ hours significantly behind. Priya has strong technical ability but employer is not releasing time. Escalation required.' },
  { id: 'c7', learnerId: 'l3', date: '2026-04-10', channel: 'visit', loggedBy: 'Michael W.', note: 'Attempted to hold review. Tom was unprepared — no portfolio evidence since January. EPA in less than 3 months. Urgent action plan agreed.' },
  { id: 'c8', learnerId: 'l3', date: '2026-02-14', channel: 'call', loggedBy: 'Michael W.', note: 'Welfare check call. Tom mentioned being overwhelmed with workload. Discussed adjustments with employer contact.' },
  { id: 'c9', learnerId: 'l4', date: '2026-06-05', channel: 'visit', loggedBy: 'Sarah Jones', note: 'Mid-point review. Nia is performing well. KSB evidence is complete for most units. OTJ on track.' },
  { id: 'c10', learnerId: 'l5', date: '2026-06-01', channel: 'email', loggedBy: 'David Chen', note: 'Reminder sent about upcoming review on 20 June. Owen to prepare portfolio evidence for KSBs S1-S3.' },
  { id: 'c11', learnerId: 'l6', date: '2026-06-12', channel: 'visit', loggedBy: 'Sarah Jones', note: 'Quarterly review. Ceri is making excellent progress. Employer very supportive of OTJ activities.' },
];

export const otjEntries: OTJEntry[] = [
  { id: 'o1', learnerId: 'l1', date: '2026-06-05', hours: 8, description: 'Internal training: Cloud architecture workshop (Azure)' },
  { id: 'o2', learnerId: 'l1', date: '2026-05-20', hours: 16, description: 'Formal learning: Unit testing with Jest — online course' },
  { id: 'o3', learnerId: 'l1', date: '2026-05-06', hours: 12, description: 'Shadowing senior developer on CI/CD pipeline refactor' },
  { id: 'o4', learnerId: 'l1', date: '2026-04-15', hours: 8, description: 'Team code review sessions and pair programming' },
  { id: 'o5', learnerId: 'l2', date: '2026-05-10', hours: 6, description: 'Online course: React Advanced Patterns' },
  { id: 'o6', learnerId: 'l2', date: '2026-04-08', hours: 8, description: 'Internal hackathon — employer agreed as OTJ' },
  { id: 'o7', learnerId: 'l3', date: '2026-03-20', hours: 8, description: 'Business admin skills workshop (external)' },
  { id: 'o8', learnerId: 'l3', date: '2026-02-10', hours: 12, description: 'Minute taking training and shadowing committee meetings' },
  { id: 'o9', learnerId: 'l4', date: '2026-06-02', hours: 10, description: 'NHS procurement process training' },
  { id: 'o10', learnerId: 'l4', date: '2026-05-14', hours: 14, description: 'Formal learning: CIPS Level 2 online module' },
  { id: 'o11', learnerId: 'l5', date: '2026-05-28', hours: 12, description: 'Tech conference attendance (Innovation Wales 2026)' },
  { id: 'o12', learnerId: 'l5', date: '2026-05-05', hours: 8, description: 'Agile / Scrum fundamentals training' },
  { id: 'o13', learnerId: 'l6', date: '2026-06-10', hours: 8, description: 'Policy writing masterclass — Welsh Government L&D' },
  { id: 'o14', learnerId: 'l6', date: '2026-05-21', hours: 14, description: 'Stakeholder management and communication workshop' },
];

export const ksbItems: KSBItem[] = [
  // Software Engineering L4 — Jamie Hughes (l1)
  { id: 'k1', learnerId: 'l1', programme: 'Software Engineering L4', reference: 'K1', type: 'knowledge', description: 'Underlying mathematics and science principles', status: 'complete', evidenceCount: 3, lastUpdated: '2026-04-08', note: 'Strong algebra and logic foundation demonstrated through portfolio.' },
  { id: 'k2', learnerId: 'l1', programme: 'Software Engineering L4', reference: 'K2', type: 'knowledge', description: 'Software design methodologies and notations', status: 'complete', evidenceCount: 4, lastUpdated: '2026-05-12', note: '' },
  { id: 'k3', learnerId: 'l1', programme: 'Software Engineering L4', reference: 'K3', type: 'knowledge', description: 'Programming concepts and paradigms', status: 'in-progress', evidenceCount: 2, lastUpdated: '2026-06-10', note: 'Good Python and JS evidence. Need OOP examples.' },
  { id: 'k4', learnerId: 'l1', programme: 'Software Engineering L4', reference: 'S1', type: 'skill', description: 'Create logical and maintainable code', status: 'in-progress', evidenceCount: 2, lastUpdated: '2026-06-10', note: '' },
  { id: 'k5', learnerId: 'l1', programme: 'Software Engineering L4', reference: 'S4', type: 'skill', description: 'Test code using appropriate methods', status: 'not-started', evidenceCount: 0, lastUpdated: null, note: 'Target for next quarter.' },
  { id: 'k6', learnerId: 'l1', programme: 'Software Engineering L4', reference: 'B1', type: 'behaviour', description: 'Works independently and takes responsibility', status: 'complete', evidenceCount: 3, lastUpdated: '2026-04-08', note: '' },
  // Software Engineering L4 — Priya Patel (l2)
  { id: 'k7', learnerId: 'l2', programme: 'Software Engineering L4', reference: 'K1', type: 'knowledge', description: 'Underlying mathematics and science principles', status: 'in-progress', evidenceCount: 1, lastUpdated: '2026-03-10', note: '' },
  { id: 'k8', learnerId: 'l2', programme: 'Software Engineering L4', reference: 'K3', type: 'knowledge', description: 'Programming concepts and paradigms', status: 'in-progress', evidenceCount: 2, lastUpdated: '2026-03-10', note: 'Good React work but needs backend evidence.' },
  { id: 'k9', learnerId: 'l2', programme: 'Software Engineering L4', reference: 'S1', type: 'skill', description: 'Create logical and maintainable code', status: 'not-started', evidenceCount: 0, lastUpdated: null, note: '' },
  { id: 'k10', learnerId: 'l2', programme: 'Software Engineering L4', reference: 'B1', type: 'behaviour', description: 'Works independently and takes responsibility', status: 'not-started', evidenceCount: 0, lastUpdated: null, note: '' },
  // Business Admin L3 — Tom Barrett (l3)
  { id: 'k11', learnerId: 'l3', programme: 'Business Administration L3', reference: 'K1', type: 'knowledge', description: 'Business principles — purpose, vision, and values', status: 'complete', evidenceCount: 2, lastUpdated: '2026-01-15', note: '' },
  { id: 'k12', learnerId: 'l3', programme: 'Business Administration L3', reference: 'S2', type: 'skill', description: 'Record and document production', status: 'in-progress', evidenceCount: 1, lastUpdated: '2026-02-14', note: 'Only basic examples. Needs formal minutes.' },
  { id: 'k13', learnerId: 'l3', programme: 'Business Administration L3', reference: 'S3', type: 'skill', description: 'Communication — written and verbal', status: 'not-started', evidenceCount: 0, lastUpdated: null, note: '' },
  { id: 'k14', learnerId: 'l3', programme: 'Business Administration L3', reference: 'B1', type: 'behaviour', description: 'Professionalism — ethical approach and reliability', status: 'not-started', evidenceCount: 0, lastUpdated: null, note: '' },
];

export const reviewEntries: ReviewEntry[] = [
  { id: 'r1', learnerId: 'l1', type: 'progress-review', scheduledDate: '2026-06-25', completed: false, notes: '' },
  { id: 'r2', learnerId: 'l1', type: 'progress-review', scheduledDate: '2026-04-08', completed: true, notes: 'Good progress. On track for EPA.' },
  { id: 'r3', learnerId: 'l2', type: 'progress-review', scheduledDate: '2026-06-10', completed: false, notes: 'OVERDUE — contact learner to rebook.' },
  { id: 'r4', learnerId: 'l2', type: 'progress-review', scheduledDate: '2026-03-10', completed: true, notes: 'OTJ concerns raised. Employer escalation agreed.' },
  { id: 'r5', learnerId: 'l3', type: 'progress-review', scheduledDate: '2026-05-15', completed: false, notes: 'OVERDUE — Tom unprepared at April visit. New date TBC.' },
  { id: 'r6', learnerId: 'l3', type: 'gateway-meeting', scheduledDate: '2026-07-01', completed: false, notes: 'EPA date. Gateway criteria unlikely to be met at current pace.' },
  { id: 'r7', learnerId: 'l4', type: 'progress-review', scheduledDate: '2026-07-01', completed: false, notes: '' },
  { id: 'r8', learnerId: 'l4', type: 'progress-review', scheduledDate: '2026-06-05', completed: true, notes: 'Mid-point review completed. All on track.' },
  { id: 'r9', learnerId: 'l5', type: 'progress-review', scheduledDate: '2026-06-20', completed: false, notes: '' },
  { id: 'r10', learnerId: 'l6', type: 'progress-review', scheduledDate: '2026-07-10', completed: false, notes: '' },
];

export const alerts: Alert[] = [
  { id: 'al1', severity: 'critical', learnerId: 'l3', title: 'EPA in 15 days — OTJ critically low', detail: 'Tom Barrett has only 45 of 400 required OTJ hours logged. EPA date is 01 July 2026. Gateway is unlikely to be met without immediate intervention.', createdAt: '2026-06-16' },
  { id: 'al2', severity: 'critical', learnerId: 'l3', title: 'Progress review overdue — 32 days', detail: 'Tom Barrett\'s scheduled review on 15 May 2026 has not been completed. A new date must be booked immediately.', createdAt: '2026-06-16' },
  { id: 'al3', severity: 'critical', learnerId: 'l2', title: 'Progress review overdue — 6 days', detail: 'Priya Patel\'s progress review scheduled for 10 June 2026 has not been completed. Contact learner to rebook.', createdAt: '2026-06-16' },
  { id: 'al4', severity: 'warning', learnerId: 'l2', title: 'OTJ hours below expected pace', detail: 'Priya Patel has logged 120 of 520 target hours (23%). At current pace, she will not reach the required total before her EPA on 15 August 2026.', createdAt: '2026-06-16' },
  { id: 'al5', severity: 'warning', learnerId: 'l5', title: 'OTJ hours below expected pace', detail: 'Owen Davies has logged 195 of 520 target hours (38%) with EPA on 10 September 2026. Employer engagement needed to increase off-the-job activity.', createdAt: '2026-06-16' },
  { id: 'al6', severity: 'warning', learnerId: 'l2', title: 'No contact in 27 days', detail: 'Last recorded contact with Priya Patel was 20 May 2026. Minimum contact frequency is every 28 days.', createdAt: '2026-06-16' },
];
