export type Assessor = {
  id: string;
  name: string;
  email: string;
  region: string;
};

export type LearnerStatus = 'on-track' | 'at-risk' | 'behind';

export type Learner = {
  id: string;
  name: string;
  assessorId: string;
  programme: string;
  employer: string;
  startDate: string;
  epaDate: string;
  status: LearnerStatus;
  otjLogged: number;
  otjTarget: number;
  lastContact: string;
  nextReview: string | null;
  needsAttention: boolean;
};

export type CommsChannel = 'visit' | 'email' | 'call' | 'note';

export type CommsEntry = {
  id: string;
  learnerId: string;
  date: string;
  channel: CommsChannel;
  loggedBy: string;
  note: string;
};

export type OTJEntry = {
  id: string;
  learnerId: string;
  date: string;
  hours: number;
  description: string;
};

export type KSBStatus = 'not-started' | 'in-progress' | 'complete';
export type KSBType = 'knowledge' | 'skill' | 'behaviour';

export type KSBItem = {
  id: string;
  learnerId: string;
  programme: string;
  reference: string;
  type: KSBType;
  description: string;
  status: KSBStatus;
  evidenceCount: number;
  lastUpdated: string | null;
  note: string;
};

export type ReviewType = 'progress-review' | 'mock-assessment' | 'gateway-meeting' | 'initial-visit';

export type ReviewEntry = {
  id: string;
  learnerId: string;
  type: ReviewType;
  scheduledDate: string;
  completed: boolean;
  notes: string;
};

export type AlertSeverity = 'critical' | 'warning';

export type Alert = {
  id: string;
  severity: AlertSeverity;
  learnerId: string | null;
  title: string;
  detail: string;
  createdAt: string;
};
