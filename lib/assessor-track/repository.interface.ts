import type {
  Assessor,
  Learner,
  CommsEntry,
  OTJEntry,
  KSBItem,
  KSBStatus,
  ReviewEntry,
  Alert,
} from '@/types/assessor-track';

/**
 * Contract for all data access in AssessorTrack.
 *
 * All methods are async so the interface is API-ready — the stub
 * implementation resolves immediately in memory, while a live
 * implementation would make authenticated HTTP calls to MAYTAS.
 *
 * Pages and hooks depend only on this interface, never on a concrete
 * class, so the underlying data source can be swapped without touching
 * any UI code.
 */
export interface IAssessorRepository {
  // ── Assessors ────────────────────────────────────────────────────────
  getAssessors(): Promise<Assessor[]>;
  getAssessorById(id: string): Promise<Assessor | null>;

  // ── Learners ──────────────────────────────────────────────────────────
  getLearners(): Promise<Learner[]>;
  getLearnerById(id: string): Promise<Learner | null>;
  getLearnersByAssessor(assessorId: string): Promise<Learner[]>;

  // ── Communications ───────────────────────────────────────────────────
  getCommsForLearner(learnerId: string): Promise<CommsEntry[]>;
  addCommsEntry(entry: Omit<CommsEntry, 'id'>): Promise<CommsEntry>;

  // ── Off-the-job hours ────────────────────────────────────────────────
  getOtjForLearner(learnerId: string): Promise<OTJEntry[]>;
  /** Adds an OTJ entry and updates the learner's aggregate otjLogged total. */
  addOtjEntry(entry: Omit<OTJEntry, 'id'>): Promise<OTJEntry>;

  // ── KSB evidence ─────────────────────────────────────────────────────
  getKsbForLearner(learnerId: string): Promise<KSBItem[]>;
  updateKsbStatus(ksbId: string, status: KSBStatus, updatedDate: string): Promise<KSBItem>;

  // ── Reviews ───────────────────────────────────────────────────────────
  getReviewsForLearner(learnerId: string): Promise<ReviewEntry[]>;
  getReviewsByAssessor(assessorId: string): Promise<ReviewEntry[]>;
  getAllReviews(): Promise<ReviewEntry[]>;

  // ── Alerts ────────────────────────────────────────────────────────────
  getAlertsByAssessor(assessorId: string): Promise<Alert[]>;
  getAllAlerts(): Promise<Alert[]>;
}
