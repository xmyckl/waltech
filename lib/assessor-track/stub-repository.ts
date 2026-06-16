import type { IAssessorRepository } from './repository.interface';
import type {
  Assessor, Learner, CommsEntry, OTJEntry, KSBItem, KSBStatus,
  ReviewEntry, Alert,
} from '@/types/assessor-track';
import {
  assessors as seedAssessors,
  learners as seedLearners,
  commsEntries as seedComms,
  otjEntries as seedOtj,
  ksbItems as seedKsb,
  reviewEntries as seedReviews,
  alerts as seedAlerts,
} from './data';
import { generateId } from './utils';

/**
 * In-memory implementation of IAssessorRepository, seeded from static
 * dummy data. Mutations are persisted for the lifetime of the module
 * instance (i.e. across client-side navigations within the same session).
 *
 * Swap this for MaytasRepository when live credentials are available —
 * no page or hook code needs to change.
 */
export class StubRepository implements IAssessorRepository {
  private readonly assessors: Assessor[];
  private readonly learners: Learner[];
  private comms: CommsEntry[];
  private otj: OTJEntry[];
  private ksb: KSBItem[];
  private readonly reviews: ReviewEntry[];
  private readonly alerts: Alert[];

  constructor() {
    // Shallow-clone each record so mutations don't affect the seed constants.
    this.assessors = seedAssessors.map(a => ({ ...a }));
    this.learners  = seedLearners.map(l => ({ ...l }));
    this.comms     = seedComms.map(c => ({ ...c }));
    this.otj       = seedOtj.map(o => ({ ...o }));
    this.ksb       = seedKsb.map(k => ({ ...k }));
    this.reviews   = seedReviews.map(r => ({ ...r }));
    this.alerts    = seedAlerts.map(a => ({ ...a }));
  }

  // ── Assessors ─────────────────────────────────────────────────────────

  async getAssessors(): Promise<Assessor[]> {
    return this.assessors.map(a => ({ ...a }));
  }

  async getAssessorById(id: string): Promise<Assessor | null> {
    return this.assessors.find(a => a.id === id) ?? null;
  }

  // ── Learners ──────────────────────────────────────────────────────────

  async getLearners(): Promise<Learner[]> {
    return this.learners.map(l => ({ ...l }));
  }

  async getLearnerById(id: string): Promise<Learner | null> {
    const learner = this.learners.find(l => l.id === id);
    return learner ? { ...learner } : null;
  }

  async getLearnersByAssessor(assessorId: string): Promise<Learner[]> {
    return this.learners
      .filter(l => l.assessorId === assessorId)
      .map(l => ({ ...l }));
  }

  // ── Communications ────────────────────────────────────────────────────

  async getCommsForLearner(learnerId: string): Promise<CommsEntry[]> {
    return this.comms
      .filter(c => c.learnerId === learnerId)
      .map(c => ({ ...c }));
  }

  async addCommsEntry(entry: Omit<CommsEntry, 'id'>): Promise<CommsEntry> {
    const newEntry: CommsEntry = { ...entry, id: generateId('comms') };
    this.comms.unshift(newEntry);
    return { ...newEntry };
  }

  // ── Off-the-job hours ─────────────────────────────────────────────────

  async getOtjForLearner(learnerId: string): Promise<OTJEntry[]> {
    return this.otj
      .filter(o => o.learnerId === learnerId)
      .map(o => ({ ...o }));
  }

  async addOtjEntry(entry: Omit<OTJEntry, 'id'>): Promise<OTJEntry> {
    const newEntry: OTJEntry = { ...entry, id: generateId('otj') };
    this.otj.unshift(newEntry);

    // Keep the learner aggregate in sync with the new entry.
    const learner = this.learners.find(l => l.id === entry.learnerId);
    if (learner) {
      learner.otjLogged = Math.round((learner.otjLogged + entry.hours) * 10) / 10;
    }

    return { ...newEntry };
  }

  // ── KSB evidence ──────────────────────────────────────────────────────

  async getKsbForLearner(learnerId: string): Promise<KSBItem[]> {
    return this.ksb
      .filter(k => k.learnerId === learnerId)
      .map(k => ({ ...k }));
  }

  async updateKsbStatus(
    ksbId: string,
    status: KSBStatus,
    updatedDate: string,
  ): Promise<KSBItem> {
    const item = this.ksb.find(k => k.id === ksbId);
    if (!item) throw new Error(`KSB item "${ksbId}" not found`);
    item.status      = status;
    item.lastUpdated = updatedDate;
    return { ...item };
  }

  // ── Reviews ───────────────────────────────────────────────────────────

  async getReviewsForLearner(learnerId: string): Promise<ReviewEntry[]> {
    return this.reviews
      .filter(r => r.learnerId === learnerId)
      .map(r => ({ ...r }));
  }

  async getReviewsByAssessor(assessorId: string): Promise<ReviewEntry[]> {
    const ids = new Set(
      this.learners.filter(l => l.assessorId === assessorId).map(l => l.id),
    );
    return this.reviews
      .filter(r => ids.has(r.learnerId))
      .map(r => ({ ...r }));
  }

  async getAllReviews(): Promise<ReviewEntry[]> {
    return this.reviews.map(r => ({ ...r }));
  }

  // ── Alerts ────────────────────────────────────────────────────────────

  async getAlertsByAssessor(assessorId: string): Promise<Alert[]> {
    const ids = new Set(
      this.learners.filter(l => l.assessorId === assessorId).map(l => l.id),
    );
    return this.alerts
      .filter(a => a.learnerId != null && ids.has(a.learnerId))
      .map(a => ({ ...a }));
  }

  async getAllAlerts(): Promise<Alert[]> {
    return this.alerts.map(a => ({ ...a }));
  }
}
