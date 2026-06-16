'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAssessorContext } from '@/contexts/AssessorContext';
import { TODAY, diffDays, otjPct } from '@/lib/assessor-track/utils';
import type {
  Learner, CommsEntry, OTJEntry, KSBItem, KSBStatus, ReviewEntry,
} from '@/types/assessor-track';

export interface EpaReadinessItem {
  label: string;
  done: boolean;
}

export interface LearnerDetailState {
  learner: Learner;
  comms: CommsEntry[];
  otj: OTJEntry[];
  ksb: KSBItem[];
  reviews: ReviewEntry[];
  overdueReviews: ReviewEntry[];
  upcomingReviews: ReviewEntry[];
  epaReadiness: EpaReadinessItem[];
  pct: number;
  daysToEpa: number;
  addComms: (entry: Omit<CommsEntry, 'id'>) => Promise<void>;
  addOtj: (entry: Omit<OTJEntry, 'id'>) => Promise<void>;
  updateKsb: (ksbId: string, status: KSBStatus) => Promise<void>;
}

function deriveEpaReadiness(
  ksb: KSBItem[],
  reviews: ReviewEntry[],
  learner: Learner,
): EpaReadinessItem[] {
  const completedKsb = ksb.filter(k => k.status === 'complete').length;
  const ksbThreshold = ksb.length > 0 ? Math.ceil(ksb.length * 0.7) : 1;
  return [
    { label: 'Portfolio evidence',  done: completedKsb >= ksbThreshold },
    { label: 'Gateway criteria',    done: learner.status === 'on-track' },
    { label: 'Employer sign-off',   done: learner.status === 'on-track' },
    { label: 'Mock assessment',     done: reviews.some(r => r.type === 'mock-assessment' && r.completed) },
  ];
}

export function useLearnerDetail(learnerId: string): LearnerDetailState | null {
  const { repository } = useAssessorContext();
  const [learner, setLearner] = useState<Learner | null>(null);
  const [comms, setComms] = useState<CommsEntry[]>([]);
  const [otj, setOtj] = useState<OTJEntry[]>([]);
  const [ksb, setKsb] = useState<KSBItem[]>([]);
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);

  useEffect(() => {
    let active = true;
    async function load() {
      const [l, c, o, k, r] = await Promise.all([
        repository.getLearnerById(learnerId),
        repository.getCommsForLearner(learnerId),
        repository.getOtjForLearner(learnerId),
        repository.getKsbForLearner(learnerId),
        repository.getReviewsForLearner(learnerId),
      ]);
      if (!active) return;
      setLearner(l);
      setComms(c);
      setOtj(o);
      setKsb(k);
      setReviews(r);
    }
    load();
    return () => { active = false; };
  }, [learnerId, repository]);

  const addComms = useCallback(async (entry: Omit<CommsEntry, 'id'>) => {
    const saved = await repository.addCommsEntry(entry);
    setComms(prev => [saved, ...prev]);
  }, [repository]);

  const addOtj = useCallback(async (entry: Omit<OTJEntry, 'id'>) => {
    const saved = await repository.addOtjEntry(entry);
    setOtj(prev => [saved, ...prev]);
    // Re-fetch learner so otjLogged total reflects the new entry.
    const updated = await repository.getLearnerById(learnerId);
    if (updated) setLearner(updated);
  }, [learnerId, repository]);

  const updateKsb = useCallback(async (ksbId: string, status: KSBStatus) => {
    const updated = await repository.updateKsbStatus(ksbId, status, TODAY);
    setKsb(prev => prev.map(k => k.id === ksbId ? updated : k));
  }, [repository]);

  if (!learner) return null;

  const pct = otjPct(learner.otjLogged, learner.otjTarget);
  const daysToEpa = diffDays(TODAY, learner.epaDate);
  const overdueReviews = reviews.filter(r => !r.completed && r.scheduledDate < TODAY);
  const upcomingReviews = reviews.filter(r => !r.completed && r.scheduledDate >= TODAY);
  const epaReadiness = deriveEpaReadiness(ksb, reviews, learner);

  return {
    learner, comms, otj, ksb, reviews,
    overdueReviews, upcomingReviews,
    epaReadiness, pct, daysToEpa,
    addComms, addOtj, updateKsb,
  };
}
